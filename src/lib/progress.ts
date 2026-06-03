import "server-only";
import { prisma } from "./db";
import { getPhases, getTopicById } from "./content";

/**
 * Progress + sequential-unlock logic. Phase status is DERIVED from completed
 * TopicProgress rows + the content manifest's topic counts (the single source of
 * truth), so the JS 26-50 gap and content edits can never corrupt counts. All
 * writes go through here; pages/API never trust client-supplied unlock state.
 */

export type PhaseStatusValue = "locked" | "unlocked" | "completed";

export interface ProgressSummary {
  authed: boolean;
  dbConfigured: boolean;
  userId: string | null;
  name: string | null;
  xp: number;
  completedTopicIds: string[];
  perPhaseCompleted: Record<string, number>;
  phaseStatus: Record<string, PhaseStatusValue>;
  streak: { current: number; longest: number } | null;
}

const XP_PER_TOPIC = 10;

function derivePhaseStatus(perPhaseCompleted: Record<string, number>): Record<string, PhaseStatusValue> {
  const out: Record<string, PhaseStatusValue> = {};
  let prevCompleted = true;
  for (const p of getPhases()) {
    const done: boolean = (perPhaseCompleted[p.id] ?? 0) >= p.topicCount;
    const unlocked: boolean = p.order === 1 || prevCompleted;
    const status: PhaseStatusValue = !unlocked ? "locked" : done ? "completed" : "unlocked";
    out[p.id] = status;
    prevCompleted = status === "completed";
  }
  return out;
}

/** Build the full progress summary for a user (or an anonymous visitor). */
export async function getProgressSummary(
  userId: string | null,
  dbConfigured: boolean,
): Promise<ProgressSummary> {
  if (!userId || !dbConfigured) {
    return {
      authed: Boolean(userId),
      dbConfigured,
      userId,
      name: null,
      xp: 0,
      completedTopicIds: [],
      perPhaseCompleted: {},
      phaseStatus: derivePhaseStatus({}),
      streak: null,
    };
  }

  const [user, completed, streak] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, xp: true } }),
    prisma.topicProgress.findMany({
      where: { userId, status: "completed" },
      select: { topicId: true, phaseId: true },
    }),
    prisma.streak.findUnique({ where: { userId } }),
  ]);

  const perPhaseCompleted: Record<string, number> = {};
  for (const t of completed) perPhaseCompleted[t.phaseId] = (perPhaseCompleted[t.phaseId] ?? 0) + 1;

  return {
    authed: true,
    dbConfigured,
    userId,
    name: user?.name ?? null,
    xp: user?.xp ?? 0,
    completedTopicIds: completed.map((t) => t.topicId),
    perPhaseCompleted,
    phaseStatus: derivePhaseStatus(perPhaseCompleted),
    streak: streak ? { current: streak.current, longest: streak.longest } : null,
  };
}

function dayUTC(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

async function bumpStreakAndActivity(userId: string) {
  const today = dayUTC();
  await prisma.dailyActivity.upsert({
    where: { userId_day: { userId, day: today } },
    create: { userId, day: today, topicsCompleted: 1 },
    update: { topicsCompleted: { increment: 1 } },
  });

  const streak = await prisma.streak.findUnique({ where: { userId } });
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  let current = 1;
  if (streak?.lastActiveDay) {
    const last = dayUTC(new Date(streak.lastActiveDay));
    if (last.getTime() === today.getTime()) current = streak.current; // already counted today
    else if (last.getTime() === yesterday.getTime()) current = streak.current + 1;
  }
  const longest = Math.max(current, streak?.longest ?? 0);
  await prisma.streak.upsert({
    where: { userId },
    create: { userId, current, longest, lastActiveDay: today },
    update: { current, longest, lastActiveDay: today },
  });
  if (current > (streak?.current ?? 0)) {
    await prisma.event.create({ data: { userId, name: "streak_incremented", props: { current } } });
  }
}

/** Mark a topic complete for a user, enforcing the unlock invariant. Idempotent. */
export async function completeTopic(
  userId: string,
  topicId: string,
): Promise<ProgressSummary> {
  const topic = getTopicById(topicId);
  if (!topic) throw new Error(`Unknown topic: ${topicId}`);

  const current = await getProgressSummary(userId, true);
  if (current.phaseStatus[topic.phaseId] === "locked") {
    throw new Error("This phase is locked — finish the previous phase first.");
  }

  const existing = await prisma.topicProgress.findUnique({
    where: { userId_topicId: { userId, topicId } },
    select: { status: true },
  });
  if (existing?.status === "completed") {
    return getProgressSummary(userId, true); // idempotent
  }

  const now = new Date();
  await prisma.topicProgress.upsert({
    where: { userId_topicId: { userId, topicId } },
    create: {
      userId,
      topicId,
      phaseId: topic.phaseId,
      status: "completed",
      firstViewedAt: now,
      completedAt: now,
      viewCount: 1,
    },
    update: { status: "completed", completedAt: now },
  });
  await prisma.user.update({ where: { id: userId }, data: { xp: { increment: XP_PER_TOPIC } } });
  await prisma.event.create({
    data: { userId, name: "xp_awarded", props: { amount: XP_PER_TOPIC, reason: "topic_completed", topicId } },
  });
  await bumpStreakAndActivity(userId);

  // Phase-completion achievement + timestamp + unlock of the next phase.
  const after = await getProgressSummary(userId, true);
  if (after.phaseStatus[topic.phaseId] === "completed") {
    await prisma.achievement
      .create({ data: { userId, kind: `phase:${topic.phaseId}` } })
      .catch(() => {}); // ignore duplicate
    await prisma.phaseProgress.upsert({
      where: { userId_phaseId: { userId, phaseId: topic.phaseId } },
      create: { userId, phaseId: topic.phaseId, status: "completed", completedAt: now },
      update: { status: "completed", completedAt: now },
    });
    await prisma.event.create({ data: { userId, name: "phase_completed", props: { phaseId: topic.phaseId } } });
    const phases = getPhases();
    const idx = phases.findIndex((p) => p.id === topic.phaseId);
    const nextPhase = phases[idx + 1];
    if (nextPhase) {
      await prisma.event.create({ data: { userId, name: "phase_unlocked", props: { phaseId: nextPhase.id } } });
    }
  }

  await prisma.event.create({
    data: { userId, name: "topic_completed", props: { topicId, phaseId: topic.phaseId } },
  });

  return after;
}

/** Record a code-playground run (analytics + daily activity). */
export async function recordRun(
  userId: string,
  data: { topicId: string; language: string; passed: boolean; durationMs?: number },
) {
  await prisma.codeRun.create({
    data: {
      userId,
      topicId: data.topicId,
      language: data.language,
      passed: data.passed,
      durationMs: data.durationMs ?? null,
    },
  });
  await prisma.dailyActivity.upsert({
    where: { userId_day: { userId, day: dayUTC() } },
    create: { userId, day: dayUTC(), runsCount: 1 },
    update: { runsCount: { increment: 1 } },
  });
  await prisma.event.create({
    data: { userId, name: "code_run", props: { topicId: data.topicId, passed: data.passed } },
  });
}

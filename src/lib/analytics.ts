import "server-only";
import { prisma } from "./db";
import { getPhases, getTopicById, getTotalTopics } from "./content";

/**
 * Dashboard aggregations. Learner view = personal progress/readiness; admin view
 * = platform funnel/usage. Phase membership of a run/quiz is resolved via the
 * content layer (topicId -> phaseId), so no denormalised phase column is needed.
 */

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}
function dayUTC(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export interface PhaseStat {
  phaseId: string;
  title: string;
  completed: number;
  total: number;
  pct: number; // 0..100
  readiness: number; // 0..100
}

export interface LearnerDashboard {
  name: string | null;
  xp: number;
  streak: { current: number; longest: number };
  overall: { completed: number; total: number; pct: number };
  phases: PhaseStat[];
  codeRuns: { total: number; passed: number; rate: number };
  dueReviews: number;
  activity: { day: string; count: number }[];
}

export async function getLearnerDashboard(userId: string): Promise<LearnerDashboard> {
  const since = dayUTC();
  since.setUTCDate(since.getUTCDate() - 83); // ~12 weeks

  const [completed, runs, quizzes, streak, user, activity, dueReviews] = await Promise.all([
    prisma.topicProgress.findMany({ where: { userId, status: "completed" }, select: { topicId: true, phaseId: true } }),
    prisma.codeRun.findMany({ where: { userId }, select: { topicId: true, passed: true } }),
    prisma.quizScore.findMany({ where: { userId }, select: { topicId: true, score: true, total: true } }),
    prisma.streak.findUnique({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { xp: true, name: true } }),
    prisma.dailyActivity.findMany({
      where: { userId, day: { gte: since } },
      select: { day: true, topicsCompleted: true, runsCount: true },
    }),
    prisma.review.count({ where: { userId, due: { lte: new Date() } } }),
  ]);

  const phaseId = (topicId: string) => getTopicById(topicId)?.phaseId;

  // Per-phase quiz accuracy and code-run success.
  const quizByPhase = new Map<string, { score: number; total: number }>();
  for (const q of quizzes) {
    const pid = phaseId(q.topicId);
    if (!pid) continue;
    const cur = quizByPhase.get(pid) ?? { score: 0, total: 0 };
    cur.score += q.score;
    cur.total += q.total;
    quizByPhase.set(pid, cur);
  }
  const runByPhase = new Map<string, { passed: number; total: number }>();
  for (const r of runs) {
    const pid = phaseId(r.topicId);
    if (!pid) continue;
    const cur = runByPhase.get(pid) ?? { passed: 0, total: 0 };
    cur.total += 1;
    if (r.passed) cur.passed += 1;
    runByPhase.set(pid, cur);
  }
  const completedByPhase = new Map<string, number>();
  for (const c of completed) completedByPhase.set(c.phaseId, (completedByPhase.get(c.phaseId) ?? 0) + 1);

  const phases: PhaseStat[] = getPhases().map((p) => {
    const done = completedByPhase.get(p.id) ?? 0;
    const pct = p.topicCount ? done / p.topicCount : 0;
    const q = quizByPhase.get(p.id);
    const r = runByPhase.get(p.id);
    const quizAcc = q && q.total ? q.score / q.total : pct;
    const codeSucc = r && r.total ? r.passed / r.total : pct;
    const readiness = clamp01(0.6 * pct + 0.2 * quizAcc + 0.2 * codeSucc);
    return {
      phaseId: p.id,
      title: p.title,
      completed: done,
      total: p.topicCount,
      pct: Math.round(pct * 100),
      readiness: Math.round(readiness * 100),
    };
  });

  // Activity heatmap (dense over the window).
  const actMap = new Map<string, number>();
  for (const a of activity) {
    const key = a.day.toISOString().slice(0, 10);
    actMap.set(key, (actMap.get(key) ?? 0) + a.topicsCompleted + a.runsCount);
  }
  const heat: { day: string; count: number }[] = [];
  for (let i = 83; i >= 0; i--) {
    const d = dayUTC();
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    heat.push({ day: key, count: actMap.get(key) ?? 0 });
  }

  const passed = runs.filter((r) => r.passed).length;
  return {
    name: user?.name ?? null,
    xp: user?.xp ?? 0,
    streak: { current: streak?.current ?? 0, longest: streak?.longest ?? 0 },
    overall: {
      completed: completed.length,
      total: getTotalTopics(),
      pct: Math.round((completed.length / getTotalTopics()) * 100),
    },
    phases,
    codeRuns: { total: runs.length, passed, rate: runs.length ? Math.round((passed / runs.length) * 100) : 0 },
    dueReviews,
    activity: heat,
  };
}

export interface AdminDashboard {
  users: number;
  dau: number;
  wau: number;
  mau: number;
  completions: number;
  runs: { total: number; passRate: number };
  funnel: { phaseId: string; title: string; reached: number; completed: number }[];
  topTopics: { topicId: string; title: string; count: number }[];
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const today = dayUTC();
  const d7 = dayUTC();
  d7.setUTCDate(d7.getUTCDate() - 6);
  const d30 = dayUTC();
  d30.setUTCDate(d30.getUTCDate() - 29);

  const [users, completionsList, runsTotal, runsPassed, recent, topGroups] = await Promise.all([
    prisma.user.count(),
    prisma.topicProgress.findMany({ where: { status: "completed" }, select: { userId: true, phaseId: true } }),
    prisma.codeRun.count(),
    prisma.codeRun.count({ where: { passed: true } }),
    prisma.dailyActivity.findMany({ where: { day: { gte: d30 } }, select: { userId: true, day: true } }),
    prisma.topicProgress.groupBy({
      by: ["topicId"],
      where: { status: "completed" },
      _count: { topicId: true },
      orderBy: { _count: { topicId: "desc" } },
      take: 8,
    }),
  ]);

  const distinct = (rows: { userId: string; day: Date }[], gte: Date) =>
    new Set(rows.filter((r) => r.day >= gte).map((r) => r.userId)).size;

  // Funnel: users reaching (>=1 completed) vs completing each phase.
  const perUserPhase = new Map<string, Map<string, number>>();
  for (const c of completionsList) {
    const m = perUserPhase.get(c.phaseId) ?? new Map<string, number>();
    m.set(c.userId, (m.get(c.userId) ?? 0) + 1);
    perUserPhase.set(c.phaseId, m);
  }
  const funnel = getPhases().map((p) => {
    const m = perUserPhase.get(p.id) ?? new Map<string, number>();
    let completed = 0;
    for (const n of m.values()) if (n >= p.topicCount) completed += 1;
    return { phaseId: p.id, title: p.title, reached: m.size, completed };
  });

  const topTopics = topGroups.map((g) => ({
    topicId: g.topicId,
    title: getTopicById(g.topicId)?.title ?? g.topicId,
    count: g._count.topicId,
  }));

  return {
    users,
    dau: distinct(recent, today),
    wau: distinct(recent, d7),
    mau: distinct(recent, d30),
    completions: completionsList.length,
    runs: { total: runsTotal, passRate: runsTotal ? Math.round((runsPassed / runsTotal) * 100) : 0 },
    funnel,
    topTopics,
  };
}

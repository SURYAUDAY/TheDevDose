import "server-only";
import { prisma } from "./db";
import { reviewCardsForTopic, type ReviewCard } from "./quiz";
import { sm2, type SM2State } from "./sm2";

/**
 * Spaced-repetition queue + grading. The SM-2 algorithm itself lives in the pure
 * ./sm2 module. The queue is built from flashcards of the user's COMPLETED topics
 * — due cards first, then new ones.
 */
export { sm2, type SM2State };

export interface DueQueue {
  cards: ReviewCard[];
  dueCount: number;
  newCount: number;
  totalCompletedTopics: number;
}

export async function buildDueQueue(userId: string, limit = 20): Promise<DueQueue> {
  const completed = await prisma.topicProgress.findMany({
    where: { userId, status: "completed" },
    select: { topicId: true },
  });
  const cards = completed.flatMap((c) => reviewCardsForTopic(c.topicId));
  if (cards.length === 0) {
    return { cards: [], dueCount: 0, newCount: 0, totalCompletedTopics: completed.length };
  }

  const reviews = await prisma.review.findMany({
    where: { userId, cardKey: { in: cards.map((c) => c.cardKey) } },
  });
  const rmap = new Map(reviews.map((r) => [r.cardKey, r]));
  const now = Date.now();

  const candidates = cards
    .map((card) => ({ card, r: rmap.get(card.cardKey) }))
    .filter(({ r }) => !r || new Date(r.due).getTime() <= now);

  candidates.sort((a, b) => {
    const ad = a.r ? new Date(a.r.due).getTime() : Infinity;
    const bd = b.r ? new Date(b.r.due).getTime() : Infinity;
    return ad - bd;
  });

  return {
    cards: candidates.slice(0, limit).map((c) => c.card),
    dueCount: candidates.filter((c) => c.r).length,
    newCount: candidates.filter((c) => !c.r).length,
    totalCompletedTopics: completed.length,
  };
}

export async function gradeCard(userId: string, cardKey: string, grade: number) {
  const existing = await prisma.review.findUnique({
    where: { userId_cardKey: { userId, cardKey } },
  });
  const prev: SM2State = existing
    ? { ease: existing.ease, intervalDays: existing.intervalDays, reps: existing.reps }
    : { ease: 2.5, intervalDays: 0, reps: 0 };
  const next = sm2(prev, grade);

  await prisma.review.upsert({
    where: { userId_cardKey: { userId, cardKey } },
    create: {
      userId,
      cardKey,
      ease: next.ease,
      intervalDays: next.intervalDays,
      reps: next.reps,
      due: next.due,
      lastGrade: grade,
      lastReviewedAt: new Date(),
    },
    update: {
      ease: next.ease,
      intervalDays: next.intervalDays,
      reps: next.reps,
      due: next.due,
      lastGrade: grade,
      lastReviewedAt: new Date(),
    },
  });
  await prisma.event.create({
    data: { userId, name: "review_completed", props: { cardKey, grade } },
  });
  return { intervalDays: next.intervalDays };
}

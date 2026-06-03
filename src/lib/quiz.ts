import "server-only";
import { getTopicById, getTopics, type Topic } from "./content";

/**
 * Generates quiz material from existing content at zero authoring cost:
 *  - MCQs from a topic's key interview points, with distractors sampled from
 *    OTHER topics in the same phase (plausible but about a different concept).
 *  - Spaced-repetition flashcards from the follow-up Q&A.
 * Selection is seeded so cards/options are stable across requests (the cardKey
 * identifies a card for the SM-2 schedule).
 */

export interface Mcq {
  cardKey: string;
  question: string;
  options: string[];
  answerIndex: number;
}

export interface ReviewCard {
  cardKey: string;
  front: string;
  back: string;
  topicId: string;
  topicTitle: string;
  phaseId: string;
  slug: string;
}

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateMcqs(topic: Topic, max = 4): Mcq[] {
  const points = topic.sections.keyPoints.filter((p) => p.length > 15);
  if (points.length < 1) return [];

  const pool: string[] = [];
  for (const t of getTopics(topic.phaseId)) {
    if (t.id !== topic.id) pool.push(...t.sections.keyPoints.filter((p) => p.length > 15));
  }
  const distractorPool = pool.filter((p) => !points.includes(p));
  if (distractorPool.length < 3) return [];

  const rnd = mulberry32(hashSeed(topic.id + ":mcq"));
  const chosen = shuffle(points, rnd).slice(0, Math.min(max, points.length));

  const mcqs: Mcq[] = [];
  chosen.forEach((correct, i) => {
    const r = mulberry32(hashSeed(topic.id + ":mcq:" + i));
    const distractors = shuffle(distractorPool, r).slice(0, 3);
    if (distractors.length < 3) return;
    const options = shuffle([correct, ...distractors], r);
    mcqs.push({
      cardKey: `${topic.id}:mc:${i}`,
      question: `Which statement is true about ${topic.title}?`,
      options,
      answerIndex: options.indexOf(correct),
    });
  });
  return mcqs;
}

export function reviewCardsForTopic(topicId: string): ReviewCard[] {
  const t = getTopicById(topicId);
  if (!t) return [];
  return t.sections.followups.map((f, i) => ({
    cardKey: `${topicId}:fc:${i}`,
    front: f.q,
    back: f.a,
    topicId,
    topicTitle: t.title,
    phaseId: t.phaseId,
    slug: t.slug,
  }));
}

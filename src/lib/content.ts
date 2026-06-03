import "server-only";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Server-side access layer over the committed content/ JSON produced by the M1
 * pipeline. Content is static and read at request/build time; the database is
 * reserved for per-user progress and analytics (M3+).
 */

const CONTENT_DIR = join(process.cwd(), "content");

export type Language =
  | "javascript"
  | "typescript"
  | "jsx"
  | "python"
  | "sql"
  | "text";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Phase {
  id: string;
  code: string;
  title: string;
  order: number;
  primaryLanguage: Language;
  topicCount: number;
  missingNumbers: number[];
  blurb: string;
}

export interface Snippet {
  role: "example" | "test";
  language: Language;
  runnable: boolean;
  note: string | null;
  source: string;
  expectedOutput: string | null;
  requiresSolutionModule: boolean;
}

export interface FollowUp {
  q: string;
  a: string;
}

export interface Topic {
  id: string;
  phaseId: string;
  phaseCode: string;
  number: number;
  orderInPhase: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  estMinutes: number;
  metaphor: { templateId: string; seedText: string };
  sections: {
    simple_en: string;
    hinglish: string;
    keyPoints: string[];
    real_world: string;
    followups: FollowUp[];
  };
  snippets: Snippet[];
  source: { file: string };
}

interface Manifest {
  generatedFrom: string;
  totalTopics: number;
  phases: Phase[];
}

let manifestCache: Manifest | null = null;
const topicCache = new Map<string, Topic[]>();

export function getManifest(): Manifest {
  if (!manifestCache) {
    manifestCache = JSON.parse(
      readFileSync(join(CONTENT_DIR, "_manifest.json"), "utf8"),
    ) as Manifest;
  }
  return manifestCache;
}

export function getPhases(): Phase[] {
  return getManifest().phases.slice().sort((a, b) => a.order - b.order);
}

export function getPhase(id: string): Phase | undefined {
  return getPhases().find((p) => p.id === id);
}

export function getTopics(phaseId: string): Topic[] {
  if (!topicCache.has(phaseId)) {
    const dir = join(CONTENT_DIR, phaseId);
    const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
    const topics = files.map(
      (f) => JSON.parse(readFileSync(join(dir, f), "utf8")) as Topic,
    );
    topics.sort((a, b) => a.orderInPhase - b.orderInPhase);
    topicCache.set(phaseId, topics);
  }
  return topicCache.get(phaseId)!;
}

export function getTopic(phaseId: string, slug: string): Topic | undefined {
  return getTopics(phaseId).find((t) => t.slug === slug);
}

let idIndex: Map<string, Topic> | null = null;
export function getTopicById(id: string): Topic | undefined {
  if (!idIndex) {
    idIndex = new Map();
    for (const p of getPhases()) for (const t of getTopics(p.id)) idIndex.set(t.id, t);
  }
  return idIndex.get(id);
}

export interface TopicNeighbors {
  prev: { phaseId: string; slug: string; title: string } | null;
  next: { phaseId: string; slug: string; title: string } | null;
}

/** Previous/next within a phase, for topic-page navigation. */
export function getNeighbors(phaseId: string, orderInPhase: number): TopicNeighbors {
  const topics = getTopics(phaseId);
  const i = topics.findIndex((t) => t.orderInPhase === orderInPhase);
  const toRef = (t: Topic | undefined) =>
    t ? { phaseId: t.phaseId, slug: t.slug, title: t.title } : null;
  return {
    prev: toRef(topics[i - 1]),
    next: toRef(topics[i + 1]),
  };
}

export function getTotalTopics(): number {
  return getManifest().totalTopics;
}

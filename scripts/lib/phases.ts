export type Language =
  | "javascript"
  | "typescript"
  | "jsx"
  | "python"
  | "sql"
  | "text";

export interface PhaseDef {
  id: string;
  code: string;
  title: string;
  /** Learner progression order (sequential unlock). */
  order: number;
  primaryLanguage: Language;
  /** Expected number of topics, used as a hard validation gate. */
  expectedTopics: number;
  /** Topic numbers absent from the source (rendered out via dense orderInPhase). */
  missingNumbers: number[];
  blurb: string;
}

/**
 * Maps a source filename prefix -> phase definition.
 * Filenames look like `JavaScript_Foundations_P1A_1-25.docx.md`.
 */
export const PHASES: Record<string, PhaseDef> = {
  JavaScript_Foundations_P1A: {
    id: "p1a-javascript",
    code: "P1A",
    title: "JavaScript Foundations",
    order: 1,
    primaryLanguage: "javascript",
    expectedTopics: 103,
    missingNumbers: [],
    blurb:
      "The execution model, scope, closures, types, async, and the higher-order patterns interviews lean on hardest.",
  },
  TypeScript_P1B: {
    id: "p1b-typescript",
    code: "P1B",
    title: "TypeScript",
    order: 2,
    primaryLanguage: "typescript",
    expectedTopics: 77,
    missingNumbers: [],
    blurb:
      "The type system end to end: primitives, unions, generics, narrowing, utility types, and config.",
  },
  React_P2: {
    id: "p2-react",
    code: "P2",
    title: "React",
    order: 3,
    primaryLanguage: "jsx",
    expectedTopics: 72,
    missingNumbers: [],
    blurb:
      "How React works under the hood — the VDOM, hooks, composition patterns, and the performance toolkit.",
  },
  Backend_P3: {
    id: "p3-backend",
    code: "P3",
    title: "Backend",
    order: 4,
    primaryLanguage: "javascript",
    expectedTopics: 95,
    missingNumbers: [],
    blurb:
      "HTTP, Node, Express, SQL & NoSQL, auth, security, queues, and the DevOps that ships them.",
  },
  GenAI_P4: {
    id: "p4-genai",
    code: "P4",
    title: "GenAI + RAG",
    order: 5,
    primaryLanguage: "python",
    expectedTopics: 50,
    missingNumbers: [],
    blurb:
      "LLMs, prompting, generation parameters, embeddings, vector search, RAG, and agents.",
  },
  SystemDesign_P5: {
    id: "p5-system-design",
    code: "P5",
    title: "System Design",
    order: 6,
    primaryLanguage: "javascript",
    expectedTopics: 51,
    missingNumbers: [],
    blurb:
      "DSA foundations, scaling, caching, sharding, classic design questions, and interview-round prep.",
  },
};

/** Resolve a phase from a source filename. Returns null if it doesn't match. */
export function phaseFromFilename(filename: string): PhaseDef | null {
  for (const [prefix, def] of Object.entries(PHASES)) {
    if (filename.startsWith(prefix + "_")) return def;
  }
  return null;
}

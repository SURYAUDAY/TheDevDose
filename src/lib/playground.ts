import type { Language, Snippet, Topic } from "./content";
import type { PlaygroundFile } from "@/components/playground/Playground";

const RUNNABLE: ReadonlySet<Language> = new Set<Language>([
  "javascript",
  "typescript",
  "python",
]);

export interface PlaygroundPlan {
  runnable: boolean;
  runLanguage: Language;
  files: PlaygroundFile[];
  expectedOutput: string | null;
  /** Illustrative "real" snippet shown read-only above the playground. */
  reference: Snippet | null;
}

/**
 * Decides how a topic's two snippets drive the playground:
 *  - module-pair topics (test does require("./solution")) expose both as tabs;
 *  - otherwise the runnable test is the single editable file and the illustrative
 *    example (JSX, API-key code, …) is shown read-only as reference.
 */
export function buildPlaygroundPlan(topic: Topic): PlaygroundPlan {
  const example = topic.snippets.find((s) => s.role === "example") ?? null;
  const test = topic.snippets.find((s) => s.role === "test") ?? null;

  if (!test || !RUNNABLE.has(test.language)) {
    return {
      runnable: false,
      runLanguage: test?.language ?? "text",
      files: [],
      expectedOutput: test?.expectedOutput ?? null,
      reference: example,
    };
  }

  const includeSolution =
    !!example &&
    example.runnable &&
    test.requiresSolutionModule &&
    example.language === test.language;

  const files: PlaygroundFile[] = [];
  if (includeSolution && example) {
    files.push({
      name: "solution",
      role: "solution",
      source: example.source,
      language: example.language,
    });
  }
  files.push({
    name: "test",
    role: "test",
    source: test.source,
    language: test.language,
  });

  return {
    runnable: true,
    runLanguage: test.language,
    files,
    expectedOutput: test.expectedOutput,
    reference: includeSolution ? null : example,
  };
}

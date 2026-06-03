import { z } from "zod";

export const LanguageSchema = z.enum([
  "javascript",
  "typescript",
  "jsx",
  "python",
  "sql",
  "text",
]);

export const SnippetSchema = z.object({
  role: z.enum(["example", "test"]),
  language: LanguageSchema,
  /** Can this snippet be executed in the client-side playground at MVP? */
  runnable: z.boolean(),
  /** Optional italic preamble that introduced the code block in the source. */
  note: z.string().nullable(),
  source: z.string().min(1),
  /** Verified expected stdout — only present on the `test` snippet. */
  expectedOutput: z.string().nullable(),
  /** True when the test imports the example as a `./solution` module (a runnable pair). */
  requiresSolutionModule: z.boolean(),
});

export const FollowUpSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

export const TopicSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+-\d{3}$/),
  phaseId: z.string().min(1),
  phaseCode: z.string().min(1),
  number: z.number().int().positive(),
  /** Dense 1..N rank within the phase — hides gaps like JS 26-50. */
  orderInPhase: z.number().int().positive(),
  slug: z.string().min(1),
  title: z.string().min(1),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  tags: z.array(z.string()),
  estMinutes: z.number().int().positive(),
  metaphor: z.object({
    templateId: z.string().min(1),
    seedText: z.string(),
  }),
  sections: z.object({
    simple_en: z.string().min(1),
    hinglish: z.string().min(1),
    keyPoints: z.array(z.string().min(1)).min(1),
    real_world: z.string().min(1),
    followups: z.array(FollowUpSchema),
  }),
  snippets: z.array(SnippetSchema).min(1),
  source: z.object({ file: z.string().min(1) }),
});

export type Snippet = z.infer<typeof SnippetSchema>;
export type Topic = z.infer<typeof TopicSchema>;

export const PhaseManifestSchema = z.object({
  id: z.string(),
  code: z.string(),
  title: z.string(),
  order: z.number().int().positive(),
  primaryLanguage: LanguageSchema,
  topicCount: z.number().int().nonnegative(),
  missingNumbers: z.array(z.number().int()),
  blurb: z.string(),
});

export const ManifestSchema = z.object({
  generatedFrom: z.string(),
  totalTopics: z.number().int().nonnegative(),
  phases: z.array(PhaseManifestSchema),
});

export type Manifest = z.infer<typeof ManifestSchema>;

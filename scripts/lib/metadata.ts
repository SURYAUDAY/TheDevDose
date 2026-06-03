import type { ParsedTopic } from "./parse.js";
import type { PhaseDef } from "./phases.js";

/**
 * Derives the metadata the source content lacks (difficulty, tags, reading time,
 * metaphor template). All heuristic — the seed merges human edits from
 * content/metadata-overrides.json on top of these.
 */

const STOPWORDS = new Set([
  "the", "a", "an", "of", "in", "to", "and", "or", "vs", "what", "is", "are",
  "how", "with", "for", "your", "you", "it", "on", "by", "as", "at", "be",
  "do", "does", "using", "use", "via", "into", "from", "this", "that",
]);

const ADVANCED = /\b(Proxy|Reflect|generator|WeakMap|WeakRef|Symbol|prototype|microtask|event loop|Suspense|concurrent|reconciliation|server components?|sharding|replication|consensus|idempotency|eventual consistency|Firecracker|gVisor|reranking|quantization|RAG|agentic|backpressure|memoization|hydration)\b/i;

const METAPHOR_TEMPLATES: { id: string; re: RegExp }[] = [
  { id: "kitchen", re: /\b(kitchen|restaurant|chef|order ticket|recipe|cook|menu|waiter|barista|cafe)\b/i },
  { id: "stack", re: /\b(stack|pile|plates?|call stack|undo|tray)\b/i },
  { id: "queue", re: /\b(queue|line|waiting line|conveyor|ticket counter|turnstile|first.?in.?first.?out)\b/i },
  { id: "lock", re: /\b(lock|keys?|guard|security|passport|id card|bouncer|vault|permission|wristband|stamp)\b/i },
  { id: "tree", re: /\b(tree|branch|family|hierarchy|folder|org chart|root|leaf|nested)\b/i },
  { id: "network", re: /\b(network|request|server|mail|post office|delivery|phone call|courier|signal|switchboard|relay)\b/i },
  { id: "pipeline", re: /\b(pipeline|assembly|factory|conveyor belt|stages?|production line|pipe|relay race|bucket brigade)\b/i },
  { id: "container", re: /\b(container|boxe?s?|warehouse|shelf|storage|locker|drawer|bucket|fridge|pantry)\b/i },
  { id: "library", re: /\b(library|books?|document|dictionary|index|catalog|archive|notebook|ledger|filing)\b/i },
  { id: "map", re: /\b(map|gps|address|directory|phone book|lookup|coat check|cloakroom)\b/i },
  { id: "blueprint", re: /\b(blueprint|template|mold|stencil|cookie cutter|contract|form)\b/i },
];

export interface DerivedMetadata {
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  estMinutes: number;
  metaphor: { templateId: string; seedText: string };
}

export function deriveMetadata(
  topic: ParsedTopic,
  phase: PhaseDef,
  orderRatio: number,
): DerivedMetadata {
  const codeLen = topic.snippets.reduce((n, s) => n + s.source.length, 0);
  const proseLen =
    topic.sections.simple_en.length +
    topic.sections.hinglish.length +
    topic.sections.real_world.length +
    topic.sections.keyPoints.join(" ").length +
    topic.sections.followups.map((f) => f.q + f.a).join(" ").length;

  return {
    difficulty: deriveDifficulty(topic, codeLen, orderRatio),
    tags: deriveTags(topic, phase),
    estMinutes: clamp(Math.round(proseLen / 950 + countLines(topic) / 14), 3, 15),
    metaphor: classifyMetaphor(topic.sections.real_world),
  };
}

function deriveDifficulty(
  topic: ParsedTopic,
  codeLen: number,
  orderRatio: number,
): "beginner" | "intermediate" | "advanced" {
  let score = 0;
  if (orderRatio >= 0.7) score += 2;
  else if (orderRatio >= 0.33) score += 1;
  const haystack = topic.title + " " + topic.sections.keyPoints.join(" ");
  if (ADVANCED.test(haystack)) score += 1;
  if (codeLen > 1500) score += 1;
  if (score >= 3) return "advanced";
  if (score >= 1) return "intermediate";
  return "beginner";
}

function deriveTags(topic: ParsedTopic, phase: PhaseDef): string[] {
  const words = topic.title
    .toLowerCase()
    .replace(/[^a-z0-9.+#\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
  const seen = new Set<string>();
  const tags: string[] = [phase.code.toLowerCase()];
  for (const w of words) {
    const clean = w.replace(/^[.+-]+|[.+-]+$/g, "");
    if (clean.length > 1 && !seen.has(clean)) {
      seen.add(clean);
      tags.push(clean);
    }
    if (tags.length >= 6) break;
  }
  return tags;
}

function classifyMetaphor(realWorld: string): { templateId: string; seedText: string } {
  const seedText = firstSentence(realWorld);
  for (const t of METAPHOR_TEMPLATES) {
    if (t.re.test(realWorld)) return { templateId: t.id, seedText };
  }
  return { templateId: "generic", seedText };
}

function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](\s|$)/);
  const s = (m ? m[0] : text).trim();
  return s.length > 160 ? s.slice(0, 157).trimEnd() + "…" : s;
}

function countLines(topic: ParsedTopic): number {
  return topic.snippets.reduce((n, s) => n + s.source.split("\n").length, 0);
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

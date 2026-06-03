import { unescape } from "./escape.js";
import type { Language, PhaseDef } from "./phases.js";
import type { Snippet } from "./schema.js";

export interface ParsedTopic {
  number: number;
  title: string;
  sections: {
    simple_en: string;
    hinglish: string;
    keyPoints: string[];
    real_world: string;
    followups: { q: string; a: string }[];
  };
  snippets: Snippet[];
}

export interface ParsedFile {
  intro: string;
  topics: ParsedTopic[];
}

type SectionKind =
  | "simple_en"
  | "hinglish"
  | "key_points"
  | "real_world"
  | "code"
  | "test"
  | "followups";

interface SectionMatcher {
  kind: SectionKind;
  re: RegExp;
}

// Each topic contains exactly these seven bold-delimited section headers, in order.
const SECTION_MATCHERS: SectionMatcher[] = [
  { kind: "simple_en", re: /^\*\*Simple Explanation(?:\s*\(English\))?\*\*\s*$/ },
  { kind: "hinglish", re: /^\*\*Hinglish Explanation\*\*\s*$/ },
  { kind: "key_points", re: /^\*\*Key Interview Points\*\*\s*$/ },
  { kind: "real_world", re: /^\*\*Real-?World Example\*\*\s*$/ },
  {
    kind: "code",
    re: /^\*\*Code\s*[—–-]\s*Full\s*&\s*Runnable(?:\s*\(([^)]*)\))?\*\*\s*$/,
  },
  {
    kind: "test",
    re: /^\*\*Test\s*\/\s*Demo\s*&\s*Expected Output(?:\s*\(([^)]*)\))?\*\*\s*$/,
  },
  { kind: "followups", re: /^\*\*Common Follow-up Questions\*\*\s*$/ },
];

const TOPIC_HEADER = /^##\s+\*\*(\d+)\\?\.\s+(.+?)\*\*\s*$/;
const H1_HEADER = /^#\s+\*\*(.+?)\*\*\s*$/;

export function parseFile(raw: string, phase: PhaseDef, file: string): ParsedFile {
  const text = raw.replace(/^﻿/, "");
  const lines = text.split(/\r?\n/);

  // Locate every topic header.
  const topicStarts: { idx: number; number: number; title: string }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(TOPIC_HEADER);
    if (m) topicStarts.push({ idx: i, number: Number(m[1]), title: unescape(m[2].trim()) });
  }
  if (topicStarts.length === 0) {
    throw new Error(`[${file}] no topic headers found`);
  }

  const intro = extractIntro(lines, topicStarts[0].idx);

  const topics: ParsedTopic[] = [];
  for (let t = 0; t < topicStarts.length; t++) {
    const start = topicStarts[t].idx + 1;
    const end = t + 1 < topicStarts.length ? topicStarts[t + 1].idx : lines.length;
    const body = lines.slice(start, end);
    topics.push(
      parseTopic(body, topicStarts[t].number, topicStarts[t].title, phase, file),
    );
  }
  return { intro, topics };
}

function extractIntro(lines: string[], firstTopicIdx: number): string {
  // The phase blurb is the first prose paragraph after the `# **...**` h1.
  let h1 = -1;
  for (let i = 0; i < firstTopicIdx; i++) {
    if (H1_HEADER.test(lines[i])) h1 = i;
  }
  if (h1 === -1) return "";
  const para: string[] = [];
  for (let i = h1 + 1; i < firstTopicIdx; i++) {
    const l = lines[i].replace(/[ \t]+$/, "");
    if (l.trim() === "") {
      if (para.length) break;
      continue;
    }
    if (l.startsWith("**") || l.startsWith("#")) continue;
    para.push(l);
  }
  return unescape(para.join(" ").trim());
}

function parseTopic(
  body: string[],
  number: number,
  title: string,
  phase: PhaseDef,
  file: string,
): ParsedTopic {
  // Find the seven section boundaries.
  const bounds: { kind: SectionKind; idx: number; hint?: string }[] = [];
  for (let i = 0; i < body.length; i++) {
    for (const m of SECTION_MATCHERS) {
      const match = body[i].match(m.re);
      if (match) {
        bounds.push({ kind: m.kind, idx: i, hint: match[1] });
        break;
      }
    }
  }

  const found = new Set(bounds.map((b) => b.kind));
  const REQUIRED: SectionKind[] = [
    "simple_en",
    "hinglish",
    "key_points",
    "real_world",
    "code",
    "test",
    "followups",
  ];
  const missing = REQUIRED.filter((k) => !found.has(k));
  if (missing.length) {
    throw new Error(
      `[${file}] topic ${number} "${title}" is missing section(s): ${missing.join(", ")}`,
    );
  }

  const sectionBody = (kind: SectionKind): { lines: string[]; hint?: string } => {
    const bi = bounds.findIndex((b) => b.kind === kind);
    const b = bounds[bi];
    const next = bounds[bi + 1];
    const end = next ? next.idx : body.length;
    return { lines: body.slice(b.idx + 1, end), hint: b.hint };
  };

  const simple_en = prose(sectionBody("simple_en").lines);
  const hinglish = prose(sectionBody("hinglish").lines);
  const keyPoints = bullets(sectionBody("key_points").lines);
  const real_world = prose(sectionBody("real_world").lines);
  const followups = parseFollowups(sectionBody("followups").lines);

  const codeSec = sectionBody("code");
  const testSec = sectionBody("test");

  const example = buildSnippet("example", codeSec.lines, codeSec.hint, phase);
  const test = buildSnippet("test", testSec.lines, testSec.hint, phase);

  return {
    number,
    title,
    sections: { simple_en, hinglish, keyPoints, real_world, followups },
    snippets: [example, test],
  };
}

/** Collapse a block of source lines into clean markdown prose. */
function prose(lines: string[]): string {
  const text = lines
    .map((l) => l.replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return unescape(text);
}

function bullets(lines: string[]): string[] {
  const out: string[] = [];
  for (const raw of lines) {
    const l = raw.replace(/[ \t]+$/, "");
    const m = l.match(/^\s*[*-]\s+(.+)$/);
    if (m) out.push(unescape(m[1].trim()));
  }
  return out;
}

function parseFollowups(lines: string[]): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  let q: string | null = null;
  let aLines: string[] = [];
  const flush = () => {
    if (q !== null) {
      const a = unescape(
        aLines
          .join("\n")
          .replace(/[ \t]+$/gm, "")
          .replace(/\n{2,}/g, "\n")
          .trim(),
      );
      out.push({ q: unescape(q), a });
    }
    q = null;
    aLines = [];
  };
  for (const raw of lines) {
    const l = raw.replace(/[ \t]+$/, "");
    const qm = l.match(/^\*\*Q[:.)]?\s*(.+?)\*\*\s*$/);
    if (qm) {
      flush();
      q = qm[1].trim();
      continue;
    }
    if (q !== null) {
      const am = l.match(/^(?:\*\*A:?\*\*|A:)\s*(.*)$/);
      if (am) {
        aLines.push(am[1]);
      } else if (l.trim() !== "") {
        aLines.push(l);
      }
    }
  }
  flush();
  return out;
}

function buildSnippet(
  role: "example" | "test",
  rawLines: string[],
  hint: string | undefined,
  phase: PhaseDef,
): Snippet {
  const { note, rest } = extractNote(rawLines);
  const code = cleanCode(rest);
  const language = mapLanguage(hint, phase);

  if (role === "test") {
    const { demo, expected } = splitExpected(code);
    const requiresSolutionModule =
      /require\(\s*['"]\.\/solution|from\s+solution\s+import|import\s+[^;]*\bfrom\s+['"]\.\/solution/.test(
        demo,
      );
    return {
      role,
      language,
      runnable: isRunnable(language),
      note,
      source: demo,
      expectedOutput: expected,
      requiresSolutionModule,
    };
  }

  return {
    role,
    language,
    runnable: exampleRunnable(language, note),
    note,
    source: code,
    expectedOutput: null,
    requiresSolutionModule: false,
  };
}

function extractNote(lines: string[]): { note: string | null; rest: string[] } {
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  if (i < lines.length) {
    const t = lines[i].trim();
    // A single-star italic preamble line, e.g. *This is real React component code...*
    const m = t.match(/^\*(?!\*)(.+?)(?<!\*)\*$/);
    if (m) return { note: unescape(m[1].trim()), rest: lines.slice(i + 1) };
  }
  return { note: null, rest: lines.slice(i) };
}

function cleanCode(lines: string[]): string {
  const trimmed = lines.map((l) => l.replace(/[ \t]+$/, ""));
  while (trimmed.length && trimmed[0].trim() === "") trimmed.shift();
  while (trimmed.length && trimmed[trimmed.length - 1].trim() === "") trimmed.pop();
  return unescape(trimmed.join("\n"));
}

/**
 * Separate a test snippet into its runnable demo source and the verified
 * expected-output block. Handles three observed forms:
 *   JS inline:  /* EXPECTED OUTPUT: ... *\/
 *   JS banner:  /* ===== EXPECTED OUTPUT ===== ... ===== END EXPECTED OUTPUT ===== *\/
 *   Python:     # ===== EXPECTED OUTPUT ===== ... # ===== END EXPECTED OUTPUT =====
 */
function splitExpected(code: string): { demo: string; expected: string | null } {
  const lines = code.split("\n");
  const startIdx = lines.findIndex(
    (l) => /EXPECTED OUTPUT/.test(l) && !/END\s+EXPECTED OUTPUT/.test(l),
  );
  if (startIdx === -1) return { demo: code, expected: null };

  // Demo = everything before the comment that opens the expected block.
  const demoLines = lines.slice(0, startIdx);
  while (demoLines.length) {
    const last = demoLines[demoLines.length - 1].trim();
    if (last === "" || last === "/*") demoLines.pop();
    else break;
  }
  const demo = demoLines.join("\n").trim();

  // End of the expected block.
  let endIdx = lines.length;
  for (let j = startIdx + 1; j < lines.length; j++) {
    if (/END\s+EXPECTED OUTPUT/.test(lines[j]) || /\*\/\s*$/.test(lines[j])) {
      endIdx = j;
      break;
    }
  }

  // Only Python-style blocks (`# ===== EXPECTED OUTPUT =====`) prefix every line
  // with `# `. JS `/* ... */` blocks must NOT have a leading `#` stripped, or an
  // output line that legitimately starts with `#` (e.g. `#1 Node`) gets mangled.
  const isPython = /^\s*#/.test(lines[startIdx]);
  const inner = lines
    .slice(startIdx + 1, endIdx)
    .map((l) => {
      const stripped = isPython ? l.replace(/^\s*#\s?/, "") : l;
      return stripped.replace(/[ \t]+$/, "");
    })
    .filter((l) => !/^=+\s*$/.test(l)); // stray decoration

  // Trim leading/trailing blank lines but keep internal ones.
  while (inner.length && inner[0].trim() === "") inner.shift();
  while (inner.length && inner[inner.length - 1].trim() === "") inner.pop();

  const expected = inner.length ? inner.join("\n") : null;
  return { demo, expected };
}

function mapLanguage(hint: string | undefined, phase: PhaseDef): Language {
  if (hint) {
    const h = hint.toLowerCase();
    if (h.includes("python")) return "python";
    if (h.includes("jsx") || h.includes("react")) return "jsx";
    if (h.includes("typescript") || /\bts\b/.test(h)) return "typescript";
    if (h.includes("sql")) return "sql";
    if (h.includes("node") || h.includes("js")) return "javascript";
  }
  return phase.primaryLanguage;
}

function isRunnable(language: Language): boolean {
  return (
    language === "javascript" ||
    language === "typescript" ||
    language === "python"
  );
}

function exampleRunnable(language: Language, note: string | null): boolean {
  if (!isRunnable(language)) return false;
  if (note && /API key|real .*SDK|live (LLM|MongoDB|Postgres|Redis|server)|runs in the browser|real (React|server)|illustrative/i.test(note)) {
    return false;
  }
  return true;
}

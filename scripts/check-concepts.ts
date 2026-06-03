/**
 * Coverage check for the concept-animation routing: for every topic, resolve its
 * visualizer and report how many map to a real concept animation vs the metaphor
 * fallback, per phase, plus the key distribution and a sample of unmapped topics.
 *
 *   npx tsx scripts/check-concepts.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveConceptKey, isBespoke } from "../src/components/concept/concepts.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");

interface Topic {
  slug: string;
  title: string;
  phaseId: string;
  phaseCode: string;
}

const phases = readdirSync(CONTENT).filter((d) => !d.includes("."));
const keyCounts = new Map<string, number>();
let total = 0;
let mapped = 0;

for (const phase of phases) {
  const dir = join(CONTENT, phase);
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  let pMapped = 0;
  const fallbacks: string[] = [];

  for (const f of files) {
    const t = JSON.parse(readFileSync(join(dir, f), "utf8")) as Topic;
    total++;
    const key = resolveConceptKey(t.slug, t.title, t.phaseCode);
    if (key) {
      mapped++;
      pMapped++;
      keyCounts.set(key, (keyCounts.get(key) ?? 0) + 1);
    } else {
      fallbacks.push(t.title);
    }
  }

  const pct = Math.round((pMapped / files.length) * 100);
  console.log(`\n${phase}  —  ${pMapped}/${files.length} animated (${pct}%)`);
  if (fallbacks.length) {
    console.log(`  metaphor fallback (${fallbacks.length}): ${fallbacks.slice(0, 12).join(", ")}${fallbacks.length > 12 ? ` …+${fallbacks.length - 12}` : ""}`);
  }
}

console.log("\n" + "─".repeat(60));
console.log(`Total: ${mapped}/${total} topics get a concept animation (${Math.round((mapped / total) * 100)}%)`);
console.log("\nKey distribution:");
const sorted = [...keyCounts.entries()].sort((a, b) => b[1] - a[1]);
for (const [k, n] of sorted) {
  console.log(`  ${isBespoke(k) ? "◆" : "▸"} ${k.padEnd(18)} ${n}`);
}

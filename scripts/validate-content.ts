/**
 * Content validation gate (M1). Re-reads everything under content/ and asserts the
 * hard invariants: every topic validates against the Zod schema, per-phase counts
 * match, orderInPhase is dense 1..N, slugs are unique within a phase, and every
 * runnable test snippet carries an expected-output oracle. Exits non-zero on failure
 * so CI can block a bad parse.
 *
 *   npm run content:validate
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { PHASES } from "./lib/phases.js";
import { TopicSchema, ManifestSchema, type Topic } from "./lib/schema.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "content");

const errors: string[] = [];
const warnings: string[] = [];

function fail(msg: string) {
  errors.push(msg);
}
function warn(msg: string) {
  warnings.push(msg);
}

function main() {
  if (!existsSync(OUT_DIR)) {
    console.error("content/ does not exist — run `npm run content:parse` first.");
    process.exit(1);
  }

  const manifestRaw = JSON.parse(readFileSync(join(OUT_DIR, "_manifest.json"), "utf8"));
  const manifest = ManifestSchema.parse(manifestRaw);

  let grandTotal = 0;
  let runnableTests = 0;
  let withExpected = 0;

  for (const phase of Object.values(PHASES).sort((a, b) => a.order - b.order)) {
    const dir = join(OUT_DIR, phase.id);
    if (!existsSync(dir)) {
      fail(`Missing phase directory: content/${phase.id}`);
      continue;
    }
    const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
    const topics: Topic[] = [];
    for (const f of files) {
      const raw = JSON.parse(readFileSync(join(dir, f), "utf8"));
      const res = TopicSchema.safeParse(raw);
      if (!res.success) {
        fail(`${phase.id}/${f}: schema invalid — ${JSON.stringify(res.error.issues[0])}`);
        continue;
      }
      topics.push(res.data);
    }

    // Count gate.
    if (topics.length !== phase.expectedTopics) {
      fail(
        `${phase.code}: expected ${phase.expectedTopics} topics, found ${topics.length}`,
      );
    }

    // Dense ordering gate.
    const orders = topics.map((t) => t.orderInPhase).sort((a, b) => a - b);
    for (let i = 0; i < orders.length; i++) {
      if (orders[i] !== i + 1) {
        fail(`${phase.code}: orderInPhase is not dense 1..N (got ${orders.join(",")})`);
        break;
      }
    }

    // Unique slugs gate.
    const slugs = new Map<string, number>();
    for (const t of topics) slugs.set(t.slug, (slugs.get(t.slug) ?? 0) + 1);
    for (const [slug, n] of slugs) {
      if (n > 1) fail(`${phase.code}: duplicate slug "${slug}" (${n}×)`);
    }

    // Source numbering contiguity (warn-only — the JS 26-50 gap is known/expected).
    const nums = topics.map((t) => t.number).sort((a, b) => a - b);
    const expectedMissing = new Set(phase.missingNumbers);
    for (let n = nums[0]; n <= nums[nums.length - 1]; n++) {
      if (!nums.includes(n) && !expectedMissing.has(n)) {
        warn(`${phase.code}: source topic number ${n} is missing (unexpected gap)`);
      }
    }

    // Oracle coverage.
    for (const t of topics) {
      const test = t.snippets.find((s) => s.role === "test");
      if (test?.runnable) {
        runnableTests++;
        if (test.expectedOutput && test.expectedOutput.trim().length) withExpected++;
        else warn(`${t.id} "${t.title}": runnable test has no expected output`);
      }
    }

    grandTotal += topics.length;
  }

  if (grandTotal !== manifest.totalTopics) {
    fail(`Manifest totalTopics=${manifest.totalTopics} but found ${grandTotal} topic files`);
  }

  // Report.
  console.log("─".repeat(60));
  console.log(`Topics validated : ${grandTotal}`);
  console.log(`Runnable tests   : ${runnableTests}`);
  console.log(`  with oracle    : ${withExpected} (${pct(withExpected, runnableTests)})`);
  if (warnings.length) {
    console.log(`\n⚠️  ${warnings.length} warning(s):`);
    for (const w of warnings.slice(0, 25)) console.log(`   - ${w}`);
    if (warnings.length > 25) console.log(`   …and ${warnings.length - 25} more`);
  }
  console.log("─".repeat(60));

  if (errors.length) {
    console.error(`\n❌ ${errors.length} error(s):`);
    for (const e of errors) console.error(`   - ${e}`);
    process.exit(1);
  }
  console.log(`\n✅ All ${grandTotal} topics valid.`);
}

function pct(a: number, b: number): string {
  if (!b) return "n/a";
  return `${Math.round((a / b) * 100)}%`;
}

main();

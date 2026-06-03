/**
 * Corpus-wide playground self-test. Executes every JavaScript test snippet
 * through the SAME CommonJS module system + console capture the browser worker
 * uses, then compares its stdout to the stored EXPECTED OUTPUT oracle. This
 * verifies the run-and-grade logic against real content without a browser.
 * (TypeScript and Python paths need the in-browser CDN runtimes, so they're
 * exercised manually in the app.)
 *
 *   npx tsx scripts/check-runnable.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");

// Load the SAME Node-console formatter the browser worker uses, so this
// self-test reflects production behaviour exactly.
new Function(readFileSync(join(ROOT, "public/workers/console-format.js"), "utf8"))();
new Function(readFileSync(join(ROOT, "public/workers/node-shims.js"), "utf8"))();
const formatArg = (globalThis as unknown as { __tddFormatArg: (v: unknown) => string }).__tddFormatArg;
const BUILTINS = (globalThis as unknown as { __tddNodeBuiltins: Record<string, unknown> }).__tddNodeBuiltins;

// Mirror the worker's timer instrumentation so async demos drain before we compare.
const _setTimeout = globalThis.setTimeout.bind(globalThis);
let pending = 0;
const activeTimeouts = new Set<unknown>();
const activeIntervals = new Set<unknown>();
const origST = globalThis.setTimeout;
const origCT = globalThis.clearTimeout;
const origSI = globalThis.setInterval;
const origCI = globalThis.clearInterval;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.setTimeout = ((fn: (...a: unknown[]) => void, delay?: number, ...args: unknown[]) => {
  pending++;
  const id = origST(() => {
    if (activeTimeouts.has(id)) { activeTimeouts.delete(id); pending--; }
    try { if (typeof fn === "function") fn(...args); } catch { /* late callback from a finished topic */ }
  }, delay);
  activeTimeouts.add(id);
  return id;
}) as typeof globalThis.setTimeout;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.clearTimeout = ((id: any) => {
  if (activeTimeouts.has(id)) { activeTimeouts.delete(id); pending--; }
  origCT(id);
}) as typeof globalThis.clearTimeout;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.setInterval = ((fn: (...a: unknown[]) => void, delay?: number, ...args: unknown[]) => {
  pending++;
  const id = origSI(() => {
    try { if (typeof fn === "function") fn(...args); } catch { /* ignore */ }
  }, delay);
  activeIntervals.add(id);
  return id;
}) as typeof globalThis.setInterval;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.clearInterval = ((id: any) => {
  if (activeIntervals.has(id)) { activeIntervals.delete(id); pending--; }
  origCI(id);
}) as typeof globalThis.clearInterval;

function resetTimers() {
  for (const id of activeTimeouts) origCT(id as never);
  for (const id of activeIntervals) origCI(id as never);
  activeTimeouts.clear();
  activeIntervals.clear();
  pending = 0;
}
async function settle() {
  await new Promise((r) => _setTimeout(r, 0));
  const start = Date.now();
  while (pending > 0 && Date.now() - start < 4000) {
    await new Promise((r) => _setTimeout(r, 20));
  }
  await new Promise((r) => _setTimeout(r, 0));
}

interface Snip {
  role: "example" | "test";
  language: string;
  runnable: boolean;
  source: string;
  expectedOutput: string | null;
  requiresSolutionModule: boolean;
}
interface Topic {
  id: string;
  title: string;
  phaseId: string;
  snippets: Snip[];
}

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as {
  new (...args: string[]): (...a: unknown[]) => Promise<unknown>;
};

function makeConsole(logs: { stream: string; text: string }[]) {
  const push = (stream: string) => (...args: unknown[]) =>
    logs.push({ stream, text: args.map(formatArg).join(" ") });
  return {
    log: push("log"), info: push("log"), debug: push("log"),
    warn: push("warn"), error: push("error"),
    assert: (cond: unknown, ...args: unknown[]) => {
      if (!cond) logs.push({ stream: "error", text: "Assertion failed" + (args.length ? ": " + args.map(formatArg).join(" ") : "") });
    },
    table: push("log"), dir: push("log"), trace: push("log"), group: push("log"), groupEnd: () => {},
  };
}

async function runModule(
  source: string,
  requireFn: (n: string) => unknown,
  consoleObj: unknown,
): Promise<Record<string, unknown>> {
  const moduleObj = { exports: {} as Record<string, unknown> };
  const proc = {
    stdout: { write: () => true },
    stderr: { write: () => true },
    env: {},
    argv: ["node", "playground"],
    platform: "browser",
    exit: () => {},
    nextTick: (cb: (...a: unknown[]) => void, ...a: unknown[]) => queueMicrotask(() => cb(...a)),
    hrtime: () => [0, 0],
  };
  const fn = new AsyncFunction("module", "exports", "require", "console", "globalThis", "process", source);
  await fn(moduleObj, moduleObj.exports, requireFn, consoleObj, {}, proc);
  return moduleObj.exports;
}

function normalize(s: string): string {
  return s.replace(/\r\n/g, "\n").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/^\n+|\n+$/g, "");
}

async function main() {
  const phases = readdirSync(CONTENT).filter((d) => !d.startsWith("_") && !d.endsWith(".json"));
  let total = 0, pass = 0;
  let diffsShown = 0;
  const failures: { id: string; reason: string }[] = [];

  for (const phase of phases) {
    const dir = join(CONTENT, phase);
    for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
      const t = JSON.parse(readFileSync(join(dir, f), "utf8")) as Topic;
      const test = t.snippets.find((s) => s.role === "test");
      const example = t.snippets.find((s) => s.role === "example");
      if (!test || test.language !== "javascript" || !test.runnable) continue;
      total++;

      const logs: { stream: string; text: string }[] = [];
      const consoleObj = makeConsole(logs);
      resetTimers();
      try {
        let solutionExports: Record<string, unknown> = {};
        const requireFn = (name: string) => {
          if (/(^|\/)solution(\.[jt]s)?$/.test(name) || /^\.\/solution/.test(name)) return solutionExports;
          if (Object.prototype.hasOwnProperty.call(BUILTINS, name)) return BUILTINS[name];
          throw new Error(`require('${name}') unavailable`);
        };
        if (example && example.runnable && test.requiresSolutionModule && example.language === "javascript") {
          solutionExports = await runModule(example.source, requireFn, consoleObj);
        }
        await runModule(test.source, requireFn, consoleObj);
        await settle();

        const stdout = logs.filter((l) => l.stream === "log").map((l) => l.text).join("\n");
        if (!test.expectedOutput) {
          failures.push({ id: t.id, reason: "no expected output" });
        } else if (normalize(stdout) === normalize(test.expectedOutput)) {
          pass++;
        } else {
          failures.push({ id: `${t.id} (${t.title})`, reason: "output differs" });
          if (process.env.DEBUG_DIFF && diffsShown < 5) {
            diffsShown++;
            console.log(`\n##### ${t.id} ${t.title}`);
            console.log("--- GOT ---\n" + normalize(stdout));
            console.log("--- EXPECTED ---\n" + normalize(test.expectedOutput));
          }
        }
      } catch (err) {
        failures.push({ id: `${t.id} (${t.title})`, reason: `threw: ${(err as Error).message}` });
      }
    }
  }

  console.log("─".repeat(60));
  console.log(`JavaScript runnable tests : ${total}`);
  console.log(`Reproduced expected output: ${pass} (${Math.round((pass / total) * 100)}%)`);
  console.log(`Did not match / errored   : ${failures.length}`);
  console.log("─".repeat(60));
  if (failures.length) {
    console.log("\nNon-matching (first 30):");
    for (const fl of failures.slice(0, 30)) console.log(`  · ${fl.id} — ${fl.reason}`);
    if (failures.length > 30) console.log(`  …and ${failures.length - 30} more`);
  }
}

main();

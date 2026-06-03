/* TheDevDose JS/TS playground runner — a classic Web Worker.
 *
 * Runs user JavaScript/TypeScript with a captured console and a tiny CommonJS
 * module system so the `solution` + `test` pairs from the content (where the
 * test does `require("./solution")`) execute exactly as authored. TypeScript is
 * transpiled with the official compiler loaded from a CDN. Timers are
 * instrumented so the runner can wait for async work (Promises, setTimeout,
 * event-loop demos) to drain before reporting output. The worker holds no
 * reference to the page DOM; the host terminates it on timeout.
 */

importScripts("/workers/console-format.js");
importScripts("/workers/node-shims.js");

const TS_URL = "https://cdn.jsdelivr.net/npm/typescript@5.7.3/lib/typescript.min.js";
let tsLoaded = false;
function ensureTypeScript() {
  if (!tsLoaded) {
    importScripts(TS_URL);
    tsLoaded = true;
  }
  return self.ts;
}

// Shared Node-console-compatible formatter (matches the stored expected output).
const format = self.__tddFormatArg;

// ---- Timer instrumentation: lets us detect when async work has finished ----
const _setTimeout = self.setTimeout.bind(self);
const _clearTimeout = self.clearTimeout.bind(self);
const _setInterval = self.setInterval.bind(self);
const _clearInterval = self.clearInterval.bind(self);

let pending = 0;
let activeTimeouts = new Set();
let activeIntervals = new Set();
let currentLogs = null;

self.setTimeout = (fn, delay, ...args) => {
  pending++;
  const id = _setTimeout(() => {
    if (activeTimeouts.has(id)) {
      activeTimeouts.delete(id);
      pending--;
    }
    try {
      if (typeof fn === "function") fn(...args);
    } catch (err) {
      if (currentLogs) currentLogs.push({ stream: "error", text: String((err && err.message) || err) });
    }
  }, delay);
  activeTimeouts.add(id);
  return id;
};
self.clearTimeout = (id) => {
  if (activeTimeouts.has(id)) {
    activeTimeouts.delete(id);
    pending--;
  }
  _clearTimeout(id);
};
self.setInterval = (fn, delay, ...args) => {
  pending++;
  const id = _setInterval(() => {
    try {
      if (typeof fn === "function") fn(...args);
    } catch (err) {
      if (currentLogs) currentLogs.push({ stream: "error", text: String((err && err.message) || err) });
    }
  }, delay);
  activeIntervals.add(id);
  return id;
};
self.clearInterval = (id) => {
  if (activeIntervals.has(id)) {
    activeIntervals.delete(id);
    pending--;
  }
  _clearInterval(id);
};

function resetTimers() {
  for (const id of activeTimeouts) _clearTimeout(id);
  for (const id of activeIntervals) _clearInterval(id);
  activeTimeouts = new Set();
  activeIntervals = new Set();
  pending = 0;
}

// Wait until async work has finished (bounded) so promise chains and timer-based
// demos produce their full output. A macrotask tick drains the whole microtask
// chain (pure-promise demos); the loop then waits out any pending timers.
async function settle() {
  await new Promise((r) => _setTimeout(r, 0));
  const start = Date.now();
  while (pending > 0 && Date.now() - start < 4000) {
    await new Promise((r) => _setTimeout(r, 20));
  }
  await new Promise((r) => _setTimeout(r, 0));
}

function makeConsole(logs) {
  const push = (stream) => (...args) => logs.push({ stream, text: args.map(format).join(" ") });
  return {
    log: push("log"),
    info: push("log"),
    debug: push("log"),
    warn: push("warn"),
    error: push("error"),
    assert: (cond, ...args) => {
      if (!cond) {
        logs.push({
          stream: "error",
          text: "Assertion failed" + (args.length ? ": " + args.map(format).join(" ") : ""),
        });
      }
    },
    table: push("log"),
    dir: push("log"),
    trace: push("log"),
    group: push("log"),
    groupEnd: () => {},
  };
}

function makeProcess(logs) {
  return {
    stdout: { write: (s) => (logs.push({ stream: "log", text: String(s).replace(/\n$/, "") }), true) },
    stderr: { write: (s) => (logs.push({ stream: "error", text: String(s).replace(/\n$/, "") }), true) },
    env: {},
    argv: ["node", "playground"],
    platform: "browser",
    version: "v20.0.0",
    exit: () => {},
    nextTick: (cb, ...a) => queueMicrotask(() => cb(...a)),
    hrtime: () => [0, 0],
  };
}

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

async function runModule(source, requireFn, consoleObj, proc) {
  const module = { exports: {} };
  const fn = new AsyncFunction(
    "module",
    "exports",
    "require",
    "console",
    "globalThis",
    "process",
    source + "\n//# sourceURL=playground",
  );
  await fn(module, module.exports, requireFn, consoleObj, {}, proc);
  return module.exports;
}

self.onmessage = async (e) => {
  const { id, language, files } = e.data;
  const logs = [];
  const consoleObj = makeConsole(logs);
  const proc = makeProcess(logs);
  currentLogs = logs;
  resetTimers();
  const start = Date.now();

  try {
    let solutionSrc = null;
    let testSrc = null;
    for (const f of files) {
      if (f.role === "solution") solutionSrc = f.source;
      else testSrc = f.source;
    }
    if (testSrc == null) testSrc = files.length ? files[0].source : "";

    if (language === "typescript") {
      const ts = ensureTypeScript();
      const opts = {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2020,
          esModuleInterop: true,
        },
      };
      if (solutionSrc != null) solutionSrc = ts.transpileModule(solutionSrc, opts).outputText;
      testSrc = ts.transpileModule(testSrc, opts).outputText;
    }

    let solutionExports = {};
    const builtins = self.__tddNodeBuiltins || {};
    const requireFn = (name) => {
      if (/(^|\/)solution(\.[jt]s)?$/.test(name) || /^\.\/solution/.test(name)) return solutionExports;
      if (Object.prototype.hasOwnProperty.call(builtins, name)) return builtins[name];
      throw new Error(`require('${name}') is not available in the browser playground`);
    };

    if (solutionSrc != null) solutionExports = await runModule(solutionSrc, requireFn, consoleObj, proc);
    await runModule(testSrc, requireFn, consoleObj, proc);
    await settle();

    self.postMessage({ id, type: "result", logs, durationMs: Date.now() - start });
  } catch (err) {
    const msg = (err && (err.stack || err.message)) || String(err);
    logs.push({ stream: "error", text: String(msg) });
    self.postMessage({
      id,
      type: "result",
      logs,
      error: String((err && err.message) || err),
      durationMs: Date.now() - start,
    });
  } finally {
    resetTimers();
    currentLogs = null;
  }
};

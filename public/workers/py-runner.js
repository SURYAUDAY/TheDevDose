/* TheDevDose Python playground runner — a classic Web Worker.
 *
 * Loads Pyodide (CPython in WASM) from a CDN on first use and runs the demo
 * with stdout/stderr captured. The content's Python demos use only the stdlib,
 * so no extra packages are loaded. The host terminates this worker on timeout
 * (the only reliable way to stop a runaway `while True`).
 */

const PYODIDE_VERSION = "0.27.7";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise = null;

function ensurePyodide() {
  if (!pyodidePromise) {
    importScripts(PYODIDE_BASE + "pyodide.js");
    // eslint-disable-next-line no-undef
    pyodidePromise = loadPyodide({ indexURL: PYODIDE_BASE });
  }
  return pyodidePromise;
}

self.onmessage = async (e) => {
  const { id, files } = e.data;
  const entry = files.find((f) => f.role === "test") || files[0];
  const source = entry ? entry.source : "";
  const logs = [];
  const start = Date.now();

  try {
    const py = await ensurePyodide();
    py.setStdout({
      batched: (s) => logs.push({ stream: "log", text: s.replace(/\n$/, "") }),
    });
    py.setStderr({
      batched: (s) => logs.push({ stream: "error", text: s.replace(/\n$/, "") }),
    });
    await py.runPythonAsync(source);
    self.postMessage({ id, type: "result", logs, durationMs: Date.now() - start });
  } catch (err) {
    const msg = String((err && err.message) || err);
    logs.push({ stream: "error", text: msg });
    self.postMessage({
      id,
      type: "result",
      logs,
      error: msg,
      durationMs: Date.now() - start,
    });
  }
};

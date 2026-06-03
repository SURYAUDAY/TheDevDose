"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState, useEffect } from "react";
import type { Language } from "@/lib/content";
import { LANGUAGE_LABEL } from "@/lib/format";
import { Mascot, type Mood } from "@/components/character/Mascot";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[320px] place-items-center text-sm text-slate-500">
      Loading editor…
    </div>
  ),
});

export interface PlaygroundFile {
  name: string;
  role: "solution" | "test";
  source: string;
  language: Language;
}

interface LogLine {
  stream: "log" | "warn" | "error";
  text: string;
}

type Status = "idle" | "running" | "done" | "error" | "timeout";
type SaveState = "idle" | "saving" | "saved" | "local";

const RUN_TIMEOUT_MS = 8000;
const SAVE_DEBOUNCE_MS = 900;
const lsKey = (topicId: string, name: string) => `tdd:code:${topicId}:${name}`;
const MONACO_LANG: Partial<Record<Language, string>> = {
  javascript: "javascript",
  typescript: "typescript",
  jsx: "javascript",
  python: "python",
  sql: "sql",
};

function normalize(s: string): string {
  return s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .join("\n")
    .replace(/^\n+|\n+$/g, "");
}

export function Playground({
  topicId,
  runLanguage,
  files,
  expectedOutput,
}: {
  topicId?: string;
  runLanguage: Language;
  files: PlaygroundFile[];
  expectedOutput: string | null;
}) {
  const [sources, setSources] = useState<string[]>(() => files.map((f) => f.source));
  const [active, setActive] = useState(0);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [duration, setDuration] = useState<number | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [authed, setAuthed] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const runIdRef = useRef(0);
  const editedRef = useRef(false);

  useEffect(() => {
    return () => workerRef.current?.terminate();
  }, []);

  // Restore saved code on open (backend when signed in, else localStorage).
  useEffect(() => {
    if (!topicId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/code?topicId=${encodeURIComponent(topicId)}`, { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (data.authed) {
          setAuthed(true);
          if (data.files && Object.keys(data.files).length) {
            setSources(files.map((f) => data.files[f.name] ?? f.source));
            setSaveState("saved");
            return;
          }
        }
        // localStorage fallback (anonymous or no server-side copy)
        if (typeof window !== "undefined") {
          let any = false;
          const restored = files.map((f) => {
            const v = window.localStorage.getItem(lsKey(topicId, f.name));
            if (v != null) any = true;
            return v ?? f.source;
          });
          if (any) {
            setSources(restored);
            setSaveState("local");
          }
        }
      } catch {
        /* offline / not signed in — keep originals */
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  // Autosave edits (debounced). Only fires after a real edit, never on restore.
  useEffect(() => {
    if (!topicId || !editedRef.current) return;
    const handle = setTimeout(async () => {
      if (typeof window !== "undefined") {
        files.forEach((f, i) => window.localStorage.setItem(lsKey(topicId, f.name), sources[i]));
      }
      if (!authed) {
        setSaveState("local");
        return;
      }
      setSaveState("saving");
      try {
        const res = await fetch("/api/code", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            topicId,
            files: files.map((f, i) => ({ name: f.name, source: sources[i] })),
          }),
        });
        const ok = (await res.json())?.ok;
        setSaveState(ok ? "saved" : "local");
      } catch {
        setSaveState("local");
      }
    }, SAVE_DEBOUNCE_MS);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources]);

  const workerUrl = runLanguage === "python" ? "/workers/py-runner.js" : "/workers/js-runner.js";

  const getWorker = () => {
    if (!workerRef.current) workerRef.current = new Worker(workerUrl);
    return workerRef.current;
  };

  const run = () => {
    setStatus("running");
    setLogs([]);
    setDuration(null);
    const worker = getWorker();
    const id = ++runIdRef.current;

    const timeout = setTimeout(() => {
      worker.terminate();
      workerRef.current = null;
      setStatus("timeout");
      setLogs([
        {
          stream: "error",
          text: "⏱ Timed out (possible infinite loop). The sandbox was terminated.",
        },
      ]);
    }, RUN_TIMEOUT_MS);

    const onMessage = (e: MessageEvent) => {
      if (e.data?.id !== id) return;
      clearTimeout(timeout);
      worker.removeEventListener("message", onMessage);
      const resultLogs: LogLine[] = e.data.logs ?? [];
      setLogs(resultLogs);
      setDuration(e.data.durationMs ?? null);
      setStatus(e.data.error ? "error" : "done");

      // Fire-and-forget run analytics (persisted only when signed in + DB set).
      if (topicId) {
        const out = resultLogs.filter((l) => l.stream === "log").map((l) => l.text).join("\n");
        const passed = expectedOutput ? normalize(out) === normalize(expectedOutput) : !e.data.error;
        void fetch("/api/runs", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ topicId, language: runLanguage, passed, durationMs: e.data.durationMs }),
        }).catch(() => {});
      }
    };
    worker.addEventListener("message", onMessage);

    worker.postMessage({
      id,
      language: runLanguage,
      files: files.map((f, i) => ({ ...f, source: sources[i] })),
    });
  };

  const reset = () => {
    editedRef.current = true; // persist the revert to original
    setSources(files.map((f) => f.source));
    setLogs([]);
    setStatus("idle");
    setDuration(null);
  };

  const stdout = useMemo(
    () => logs.filter((l) => l.stream === "log").map((l) => l.text).join("\n"),
    [logs],
  );

  const match = useMemo(() => {
    if (status !== "done" || !expectedOutput) return null;
    return normalize(stdout) === normalize(expectedOutput);
  }, [status, stdout, expectedOutput]);

  const dirty = sources.some((s, i) => s !== files[i].source);
  const monacoLang = MONACO_LANG[runLanguage] ?? "plaintext";

  const mascotMood: Mood =
    status === "running"
      ? "thinking"
      : status === "error" || status === "timeout"
        ? "error"
        : status === "done"
          ? match === true
            ? "celebrating"
            : "idle"
          : "idle";

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/60">
      {/* Tab + toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-2">
        <div className="flex">
          {files.map((f, i) => (
            <button
              key={f.name}
              onClick={() => setActive(i)}
              className={
                "border-b-2 px-3 py-2 text-xs font-medium transition " +
                (active === i
                  ? "border-brand-400 text-slate-100"
                  : "border-transparent text-slate-500 hover:text-slate-300")
              }
            >
              {f.name}.{runLanguage === "python" ? "py" : runLanguage === "typescript" ? "ts" : "js"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pr-1">
          {saveState === "saving" && <span className="text-[11px] text-slate-500">Saving…</span>}
          {saveState === "saved" && <span className="text-[11px] text-emerald-400/80">✓ Saved</span>}
          {saveState === "local" && (
            <span className="text-[11px] text-slate-500" title="Sign in to sync across devices">
              Saved on device
            </span>
          )}
          <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[11px] text-slate-400">
            {LANGUAGE_LABEL[runLanguage]}
          </span>
          {dirty && (
            <button
              onClick={reset}
              className="rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-white/5 hover:text-slate-200"
            >
              Reset
            </button>
          )}
          <button
            onClick={run}
            disabled={status === "running"}
            className="rounded-md bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow transition hover:bg-emerald-400 disabled:opacity-50"
          >
            {status === "running" ? "Running…" : "▶ Run"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <MonacoEditor
        height="320px"
        theme="vs-dark"
        language={monacoLang}
        value={sources[active]}
        onChange={(val) => {
          editedRef.current = true;
          setSources((prev) => {
            const next = prev.slice();
            next[active] = val ?? "";
            return next;
          });
        }}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "var(--font-mono)",
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          tabSize: 2,
          automaticLayout: true,
          smoothScrolling: true,
        }}
      />

      {/* Output */}
      <div className="border-t border-white/10">
        <div className="flex items-center justify-between bg-slate-950/60 px-4 py-1.5 text-[11px] uppercase tracking-wide text-slate-500">
          <span className="flex items-center gap-2">
            <Mascot mood={mascotMood} size={26} />
            Output
          </span>
          <span className="flex items-center gap-3 normal-case">
            {duration != null && <span className="text-slate-600">{duration} ms</span>}
            {match === true && (
              <span className="font-medium text-emerald-400">✓ Matches expected</span>
            )}
            {match === false && (
              <span className="font-medium text-amber-400">✗ Differs from expected</span>
            )}
          </span>
        </div>
        <pre className="max-h-56 overflow-auto px-4 py-3 text-[13px] leading-relaxed">
          {logs.length === 0 ? (
            <span className="text-slate-600">
              {status === "running" ? "Running…" : "Press Run to execute this code."}
            </span>
          ) : (
            logs.map((l, i) => (
              <div
                key={i}
                className={
                  l.stream === "error"
                    ? "text-rose-400"
                    : l.stream === "warn"
                      ? "text-amber-300"
                      : "text-slate-200"
                }
              >
                <code className="font-mono whitespace-pre-wrap">{l.text}</code>
              </div>
            ))
          )}
        </pre>

        {match === false && expectedOutput && (
          <div className="border-t border-white/10 bg-slate-950/40 px-4 py-2">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              Expected
            </div>
            <pre className="mt-1 overflow-auto text-[13px] leading-relaxed text-emerald-300/80">
              <code className="font-mono whitespace-pre-wrap">{expectedOutput}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

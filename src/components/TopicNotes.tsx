"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type SaveState = "idle" | "saving" | "saved" | "local";
const lsKey = (topicId: string) => `tdd:note:${topicId}`;
const SAVE_DEBOUNCE_MS = 800;

/** A personal sticky note per topic, opened in a modal. Autosaves to the backend
 *  when signed in, else to localStorage; restores on return. */
export function TopicNotes({ topicId }: { topicId: string }) {
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const editedRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Restore on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/notes?topicId=${encodeURIComponent(topicId)}`, { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (data.authed) {
          setAuthed(true);
          if (data.body) {
            setBody(data.body);
            setSaveState("saved");
            return;
          }
        }
        const local = typeof window !== "undefined" ? window.localStorage.getItem(lsKey(topicId)) : null;
        if (local) {
          setBody(local);
          setSaveState("local");
        }
      } catch {
        /* keep empty */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [topicId]);

  // Autosave (debounced) after edits.
  useEffect(() => {
    if (!editedRef.current) return;
    const handle = setTimeout(async () => {
      if (typeof window !== "undefined") window.localStorage.setItem(lsKey(topicId), body);
      if (!authed) {
        setSaveState("local");
        return;
      }
      setSaveState("saving");
      try {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ topicId, body }),
        });
        setSaveState((await res.json())?.ok ? "saved" : "local");
      } catch {
        setSaveState("local");
      }
    }, SAVE_DEBOUNCE_MS);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body]);

  // Modal behaviour: Esc to close, scroll lock, focus the textarea.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => textareaRef.current?.focus(), 40);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
    };
  }, [open]);

  const hasNote = body.trim().length > 0;

  const status =
    saveState === "saving" ? "Saving…" : saveState === "saved" ? "✓ Saved" : saveState === "local" ? (authed ? "Saved" : "Saved on this device") : "";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition " +
          (hasNote
            ? "border-amber-400/40 bg-amber-400/15 text-amber-200 hover:bg-amber-400/25"
            : "border-amber-400/30 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20")
        }
      >
        📝 {hasNote ? "My note" : "Add a note"}
        {hasNote && <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden />}
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Topic notes"
              className="tdd-fade-up relative w-full max-w-xl -rotate-1 rounded-xl bg-amber-200 p-5 text-amber-950 shadow-2xl shadow-amber-900/40 ring-1 ring-amber-300"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-base font-semibold">📝 My notes</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-amber-800/80">{status}</span>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close notes"
                    className="grid h-7 w-7 place-items-center rounded-md text-amber-900/70 transition hover:bg-amber-300 hover:text-amber-950"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <textarea
                ref={textareaRef}
                value={body}
                onChange={(e) => {
                  editedRef.current = true;
                  setBody(e.target.value);
                }}
                placeholder="Jot anything that helps you remember this topic — gotchas, your own example, an interview line…"
                rows={12}
                className="w-full resize-y rounded-md bg-amber-100/80 px-3 py-2 text-[15px] leading-relaxed text-amber-950 placeholder:text-amber-700/60 focus:bg-amber-50 focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-amber-800/70">
                  {authed ? "Synced to your account · autosaves" : "Saved on this device · sign in to sync · autosaves"}
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-amber-950 transition hover:bg-amber-400"
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

type SaveState = "idle" | "saving" | "saved" | "local";
const lsKey = (topicId: string) => `tdd:note:${topicId}`;
const SAVE_DEBOUNCE_MS = 800;

/** A personal sticky note per topic. Autosaves to the backend when signed in,
 *  else to localStorage. Restores on return. */
export function TopicNotes({ topicId }: { topicId: string }) {
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const editedRef = useRef(false);

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
            setOpen(true);
            return;
          }
        }
        const local = typeof window !== "undefined" ? window.localStorage.getItem(lsKey(topicId)) : null;
        if (local) {
          setBody(local);
          setOpen(true);
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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-sm font-medium text-amber-200 transition hover:bg-amber-400/20"
      >
        📝 Add a note
      </button>
    );
  }

  return (
    <div className="-rotate-1 rounded-md bg-amber-200 p-4 text-amber-950 shadow-lg shadow-amber-900/30 ring-1 ring-amber-300">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold">📝 My notes</span>
        <span className="text-[11px] text-amber-800/80">
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "✓ Saved"}
          {saveState === "local" && (authed ? "Saved" : "Saved on this device")}
        </span>
      </div>
      <textarea
        value={body}
        onChange={(e) => {
          editedRef.current = true;
          setBody(e.target.value);
        }}
        placeholder="Jot anything that helps you remember this topic — gotchas, your own example, an interview line…"
        rows={4}
        className="w-full resize-y rounded-sm bg-amber-100/70 px-3 py-2 text-sm leading-relaxed text-amber-950 placeholder:text-amber-700/60 focus:bg-amber-50 focus:outline-none"
      />
      {!authed && (
        <p className="mt-1.5 text-[11px] text-amber-800/80">
          Sign in to sync your notes across devices.
        </p>
      )}
    </div>
  );
}

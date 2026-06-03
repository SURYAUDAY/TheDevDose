"use client";

import Link from "next/link";
import { useState } from "react";
import { useProgress } from "./ProgressProvider";
import { Mascot } from "@/components/character/Mascot";

export function CompleteButton({ topicId }: { topicId: string }) {
  const { isCompleted, complete, summary, loading } = useProgress();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && summary && !summary.authed) {
    return (
      <Link
        href={`/signin?callbackUrl=${encodeURIComponent(
          typeof window !== "undefined" ? window.location.pathname : "/learn",
        )}`}
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
      >
        Sign in to track progress →
      </Link>
    );
  }

  if (isCompleted(topicId)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 py-1 pl-1 pr-4 text-sm font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
        <Mascot mood="celebrating" size={30} />
        ✓ Completed
      </span>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={async () => {
          setBusy(true);
          setError(null);
          const res = await complete(topicId);
          setBusy(false);
          if (!res.ok) setError(res.reason ?? "Could not save progress.");
        }}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-400 disabled:opacity-50"
      >
        {busy ? "Saving…" : "Mark complete"}
      </button>
      {error && <span className="text-xs text-rose-400">{error}</span>}
    </div>
  );
}

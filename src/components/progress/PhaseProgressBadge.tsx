"use client";

import { useProgress } from "./ProgressProvider";

export function PhaseProgressBadge({ phaseId, total }: { phaseId: string; total: number }) {
  const { summary, phaseStatusOf, phaseCompletedCount } = useProgress();
  if (!summary?.authed) return null;

  const status = phaseStatusOf(phaseId);
  const done = phaseCompletedCount(phaseId);

  if (status === "locked") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-xs text-slate-400">
        🔒 Locked
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300">
        ✓ Completed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-300">
      {done}/{total} done
    </span>
  );
}

export function TopicCompletedDot({ topicId }: { topicId: string }) {
  const { isCompleted } = useProgress();
  return (
    <span
      className={
        "inline-block h-2 w-2 rounded-full " +
        (isCompleted(topicId) ? "bg-emerald-400" : "bg-slate-600")
      }
      aria-hidden
    />
  );
}

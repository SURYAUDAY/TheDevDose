"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type PhaseStatusValue = "locked" | "unlocked" | "completed";

interface Summary {
  authed: boolean;
  dbConfigured: boolean;
  name: string | null;
  xp: number;
  completedTopicIds: string[];
  perPhaseCompleted: Record<string, number>;
  phaseStatus: Record<string, PhaseStatusValue>;
  streak: { current: number; longest: number } | null;
}

interface ProgressCtx {
  summary: Summary | null;
  loading: boolean;
  isCompleted: (topicId: string) => boolean;
  phaseStatusOf: (phaseId: string) => PhaseStatusValue;
  phaseCompletedCount: (phaseId: string) => number;
  complete: (topicId: string) => Promise<{ ok: boolean; reason?: string }>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<ProgressCtx | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/progress", { cache: "no-store" });
      setSummary(await res.json());
    } catch {
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const complete = useCallback(
    async (topicId: string) => {
      const res = await fetch("/api/progress/complete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topicId }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (data.ok && data.summary) setSummary(data.summary);
      return { ok: Boolean(data.ok), reason: data.reason };
    },
    [],
  );

  const value: ProgressCtx = {
    summary,
    loading,
    isCompleted: (id) => Boolean(summary?.completedTopicIds.includes(id)),
    phaseStatusOf: (id) => summary?.phaseStatus[id] ?? (loading ? "unlocked" : "locked"),
    phaseCompletedCount: (id) => summary?.perPhaseCompleted[id] ?? 0,
    complete,
    refresh,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}

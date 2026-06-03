"use client";

import { useState } from "react";
import { Mascot } from "@/components/character/Mascot";
import { MetaphorScene } from "@/components/character/MetaphorScene";
import { ConceptVisual } from "./visualizers";
import { track } from "@/lib/track";

/**
 * The prominent, always-visible animated stage at the top of a topic. When a
 * concept visualizer exists for the topic it shows the actual mechanics; else it
 * falls back to the metaphor scene. Pixel presents it; Replay restarts the
 * animation by remounting the stage.
 */
export function ConceptStage({
  conceptKey,
  metaphorTemplateId,
  seedText,
  topicId,
}: {
  conceptKey: string | null;
  metaphorTemplateId: string;
  seedText: string;
  topicId?: string;
}) {
  const [replay, setReplay] = useState(0);
  const hasConcept = Boolean(conceptKey);

  return (
    <section className="tdd-fade-up overflow-hidden rounded-2xl border border-brand-400/20 bg-gradient-to-br from-brand-500/[0.10] to-slate-900/50 p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <Mascot mood="explaining" size={64} className="hidden shrink-0 sm:block" />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-300/80">
              {hasConcept ? "See how it works" : "Think of it like…"}
            </span>
            <button
              onClick={() => {
                setReplay((r) => r + 1);
                track("scene_replayed", { topicId, conceptKey });
              }}
              className="rounded-md px-2 py-1 text-xs text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
            >
              ↻ Replay
            </button>
          </div>
          <div
            key={replay}
            className="h-44 w-full rounded-xl bg-slate-950/40 ring-1 ring-inset ring-white/5 sm:h-52"
          >
            {hasConcept ? (
              <ConceptVisual conceptKey={conceptKey as string} />
            ) : (
              <MetaphorScene templateId={metaphorTemplateId} className="h-full w-full" />
            )}
          </div>
          <p className="mt-3 text-pretty text-sm text-slate-300">
            <span className="font-medium text-slate-100">Think of it like… </span>
            {seedText}
          </p>
        </div>
      </div>
    </section>
  );
}

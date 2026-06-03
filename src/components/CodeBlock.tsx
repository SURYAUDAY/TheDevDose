import { LANGUAGE_LABEL } from "@/lib/format";
import type { Language } from "@/lib/content";

/**
 * Read-only code display for M2. The live, runnable editor (Monaco + sandbox)
 * lands in M4 — this component renders the snippet with a language chip and a
 * "why this can't run here" note when the snippet is illustrative.
 */
export function CodeBlock({
  source,
  language,
  label,
  runnable,
  note,
  expectedOutput,
}: {
  source: string;
  language: Language;
  label?: string;
  runnable?: boolean;
  note?: string | null;
  expectedOutput?: string | null;
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/60">
      <figcaption className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs">
        <span className="font-medium text-slate-300">{label ?? "Code"}</span>
        <span className="flex items-center gap-2">
          {runnable === false && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-medium text-amber-300 ring-1 ring-amber-400/30">
              illustrative
            </span>
          )}
          <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-slate-400">
            {LANGUAGE_LABEL[language]}
          </span>
        </span>
      </figcaption>
      {note && (
        <p className="border-b border-white/5 bg-amber-500/[0.06] px-4 py-2 text-xs text-amber-200/80">
          {note}
        </p>
      )}
      <pre className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed">
        <code className="font-mono text-slate-200">{source}</code>
      </pre>
      {expectedOutput && (
        <div className="border-t border-white/10 bg-slate-950/50">
          <div className="px-4 pt-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Expected output
          </div>
          <pre className="overflow-x-auto px-4 pb-3 pt-1 text-[13px] leading-relaxed">
            <code className="font-mono text-emerald-300/90">{expectedOutput}</code>
          </pre>
        </div>
      )}
    </figure>
  );
}

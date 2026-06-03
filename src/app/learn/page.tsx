import Link from "next/link";
import { getPhases, getTotalTopics } from "@/lib/content";
import { accentFor } from "@/lib/format";
import { PhaseProgressBadge } from "@/components/progress/PhaseProgressBadge";

export const metadata = {
  title: "Roadmap — TheDevDose",
};

export default function RoadmapPage() {
  const phases = getPhases();
  const total = getTotalTopics();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-white">Your roadmap</h1>
      <p className="mt-2 text-slate-400">
        Six phases, {total} topics, in the order that builds on itself. Complete a
        phase to unlock the next.
      </p>

      <ol className="relative mt-10 space-y-4 border-l border-white/10 pl-8">
        {phases.map((p, i) => (
          <li key={p.id} className="relative">
            <span className="absolute -left-[39px] grid h-6 w-6 place-items-center rounded-full border border-white/15 bg-slate-900 text-xs font-semibold text-slate-300">
              {p.order}
            </span>
            <Link
              href={`/learn/${p.id}`}
              className={`group block rounded-2xl border border-white/10 bg-gradient-to-br p-5 ring-1 ring-inset transition hover:-translate-y-0.5 hover:border-white/20 ${accentFor(p.code)}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-white">{p.title}</h2>
                <span className="flex shrink-0 items-center gap-2">
                  <PhaseProgressBadge phaseId={p.id} total={p.topicCount} />
                  <span className="rounded-full bg-black/20 px-2.5 py-0.5 text-xs text-slate-300">
                    {p.topicCount} topics
                  </span>
                </span>
              </div>
              <p className="mt-1.5 text-sm text-slate-300/80">{p.blurb}</p>
              {i === 0 ? (
                <span className="mt-3 inline-block text-xs font-medium text-emerald-300">
                  ● Available now
                </span>
              ) : (
                <span className="mt-3 inline-block text-xs text-slate-400">
                  Unlocks after {phases[i - 1].title}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

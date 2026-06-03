import Link from "next/link";
import { getPhases, getTotalTopics } from "@/lib/content";
import { accentFor } from "@/lib/format";
import { Mascot } from "@/components/character/Mascot";

export default function Home() {
  const phases = getPhases();
  const total = getTotalTopics();

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="py-20 text-center sm:py-28">
        <div className="mx-auto mb-2 flex justify-center">
          <Mascot mood="waving" size={104} />
        </div>
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {total} interview topics · 6 phases · runnable code
        </div>
        <h1 className="mx-auto max-w-3xl text-balance text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Interview prep, <span className="text-brand-400">one dose</span> at a time.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-slate-400">
          Animated explanations, a real in-browser code playground, and a sequential
          roadmap from JavaScript fundamentals to System Design — with English &
          Hinglish for every concept.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/learn"
            className="rounded-lg bg-brand-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400"
          >
            Open the roadmap
          </Link>
          <Link
            href={`/learn/${phases[0].id}`}
            className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 font-medium text-slate-200 transition hover:bg-white/10"
          >
            Start with JavaScript
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {phases.map((p) => (
          <Link
            key={p.id}
            href={`/learn/${p.id}`}
            className={`group rounded-2xl border border-white/10 bg-gradient-to-br p-5 ring-1 ring-inset transition hover:-translate-y-0.5 hover:border-white/20 ${accentFor(p.code)}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
                Phase {p.order}
              </span>
              <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs text-slate-300">
                {p.topicCount} topics
              </span>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-white">{p.title}</h3>
            <p className="mt-1.5 text-sm text-slate-300/80">{p.blurb}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

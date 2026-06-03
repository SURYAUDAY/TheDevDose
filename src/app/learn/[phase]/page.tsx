import Link from "next/link";
import { notFound } from "next/navigation";
import { getPhase, getPhases, getTopics } from "@/lib/content";
import { DIFFICULTY_STYLE, accentFor } from "@/lib/format";

export function generateStaticParams() {
  return getPhases().map((p) => ({ phase: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ phase: string }>;
}) {
  const { phase } = await params;
  const p = getPhase(phase);
  return { title: p ? `${p.title} — TheDevDose` : "TheDevDose" };
}

export default async function PhasePage({
  params,
}: {
  params: Promise<{ phase: string }>;
}) {
  const { phase } = await params;
  const p = getPhase(phase);
  if (!p) notFound();
  const topics = getTopics(phase);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/learn" className="text-sm text-slate-400 hover:text-slate-200">
        ← Roadmap
      </Link>

      <header
        className={`mt-4 rounded-2xl border border-white/10 bg-gradient-to-br p-6 ring-1 ring-inset ${accentFor(p.code)}`}
      >
        <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
          Phase {p.order}
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">{p.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300/80">{p.blurb}</p>
        <p className="mt-3 text-xs text-slate-400">{p.topicCount} topics</p>
      </header>

      <ol className="relative mt-8 space-y-2 border-l border-white/10 pl-7">
        {topics.map((t) => (
          <li key={t.id} className="relative">
            <span className="absolute -left-[34px] grid h-5 w-5 place-items-center rounded-full border border-white/15 bg-slate-900 text-[10px] font-semibold text-slate-400">
              {t.orderInPhase}
            </span>
            <Link
              href={`/learn/${p.id}/${t.slug}`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 transition hover:border-white/20 hover:bg-slate-900/70"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium text-slate-100 group-hover:text-white">
                  {t.title}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {t.estMinutes} min · {t.tags.slice(1, 4).join(" · ")}
                </span>
              </span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ring-inset ${DIFFICULTY_STYLE[t.difficulty]}`}
              >
                {t.difficulty}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

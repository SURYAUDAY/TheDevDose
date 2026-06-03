import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getNeighbors,
  getPhase,
  getPhases,
  getTopic,
  getTopics,
} from "@/lib/content";
import { DIFFICULTY_STYLE, accentFor } from "@/lib/format";
import { buildPlaygroundPlan } from "@/lib/playground";
import { Prose } from "@/components/Prose";
import { CodeBlock } from "@/components/CodeBlock";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { Playground } from "@/components/playground/Playground";
import { ReactLivePreview } from "@/components/playground/ReactLivePreview";
import { CompleteButton } from "@/components/progress/CompleteButton";
import { ConceptStage } from "@/components/concept/ConceptStage";
import { resolveConceptKey } from "@/components/concept/concepts";
import { generateMcqs } from "@/lib/quiz";
import { TopicQuiz } from "@/components/quiz/TopicQuiz";
import { TopicViewTracker } from "@/components/analytics/Trackers";

export function generateStaticParams() {
  const params: { phase: string; topic: string }[] = [];
  for (const p of getPhases()) {
    for (const t of getTopics(p.id)) params.push({ phase: p.id, topic: t.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ phase: string; topic: string }>;
}) {
  const { phase, topic } = await params;
  const t = getTopic(phase, topic);
  if (!t) return { title: "Topic" };
  const desc = t.sections.simple_en.replace(/\s+/g, " ").slice(0, 155).trim();
  return {
    title: t.title,
    description: desc,
    openGraph: { title: `${t.title} · TheDevDose`, description: desc, type: "article" },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ phase: string; topic: string }>;
}) {
  const { phase, topic } = await params;
  const p = getPhase(phase);
  const t = getTopic(phase, topic);
  if (!p || !t) notFound();

  const plan = buildPlaygroundPlan(t);
  const mcqs = generateMcqs(t);
  const { prev, next } = getNeighbors(phase, t.orderInPhase);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <TopicViewTracker topicId={t.id} phaseId={t.phaseId} />
      <nav className="flex items-center gap-2 text-sm text-slate-400">
        <Link href={`/learn/${p.id}`} className="hover:text-slate-200">
          {p.title}
        </Link>
        <span>/</span>
        <span className="text-slate-500">Topic {t.orderInPhase}</span>
      </nav>

      <header className="mt-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full bg-gradient-to-br px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${accentFor(p.code)}`}
          >
            {p.code}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${DIFFICULTY_STYLE[t.difficulty]}`}
          >
            {t.difficulty}
          </span>
          <span className="text-xs text-slate-500">{t.estMinutes} min read</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">{t.title}</h1>
      </header>

      {/* Animated concept stage — shows the mechanics (call stack, closure, …),
          or the metaphor scene as a fallback. */}
      <div className="mt-6">
        <ConceptStage
          conceptKey={resolveConceptKey(t.slug, t.title, t.phaseCode)}
          metaphorTemplateId={t.metaphor.templateId}
          seedText={t.metaphor.seedText}
          topicId={t.id}
        />
      </div>

      <div className="mt-6 space-y-6">
        <ExplanationPanel en={t.sections.simple_en} hinglish={t.sections.hinglish} />

        <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Key interview points
          </h2>
          <ul className="space-y-2">
            {t.sections.keyPoints.map((k, i) => (
              <li key={i} className="flex gap-2.5 text-slate-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                <span className="leading-relaxed">
                  <Prose text={k} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Real-world example
          </h2>
          <Prose text={t.sections.real_world} />
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            {plan.runnable ? "Code playground" : "Code"}
          </h2>

          {/* Live, interactive render of the real React component. */}
          {plan.reference?.language === "jsx" && (
            <ReactLivePreview source={plan.reference.source} />
          )}

          {/* Illustrative "real" code that can't run in-browser (JSX, SDK calls, …). */}
          {plan.reference && (
            <CodeBlock
              source={plan.reference.source}
              language={plan.reference.language}
              label="Reference code"
              runnable={plan.reference.runnable}
              note={plan.reference.note}
            />
          )}

          {plan.runnable ? (
            <>
              <Playground
                topicId={t.id}
                runLanguage={plan.runLanguage}
                files={plan.files}
                expectedOutput={plan.expectedOutput}
              />
              <p className="text-xs text-slate-500">
                ▸ Edit the code and press Run — it executes in your browser and is
                checked against the verified expected output.
              </p>
            </>
          ) : (
            t.snippets
              .filter((s) => s.role === "test")
              .map((s, i) => (
                <CodeBlock
                  key={i}
                  source={s.source}
                  language={s.language}
                  label="Test / demo"
                  runnable={s.runnable}
                  note={s.note}
                  expectedOutput={s.expectedOutput}
                />
              ))
          )}
        </section>

        {t.sections.followups.length > 0 && (
          <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Common follow-up questions
            </h2>
            <dl className="space-y-4">
              {t.sections.followups.map((f, i) => (
                <div key={i}>
                  <dt className="font-medium text-slate-100">{f.q}</dt>
                  <dd className="mt-1 text-slate-400">
                    <Prose text={f.a} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      {mcqs.length > 0 && (
        <div className="mt-6">
          <TopicQuiz topicId={t.id} questions={mcqs} />
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/40 px-5 py-4">
        <span className="text-sm text-slate-400">Finished this topic?</span>
        <CompleteButton topicId={t.id} />
      </div>

      <nav className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-5 text-sm">
        {prev ? (
          <Link
            href={`/learn/${prev.phaseId}/${prev.slug}`}
            className="max-w-[45%] truncate rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-slate-300 hover:bg-white/10"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/learn/${next.phaseId}/${next.slug}`}
            className="max-w-[45%] truncate rounded-lg border border-white/10 bg-brand-500/90 px-4 py-2 font-medium text-white hover:bg-brand-500"
          >
            {next.title} →
          </Link>
        ) : (
          <Link
            href="/learn"
            className="rounded-lg border border-white/10 bg-emerald-500/80 px-4 py-2 font-medium text-white hover:bg-emerald-500"
          >
            Finish phase →
          </Link>
        )}
      </nav>
    </article>
  );
}

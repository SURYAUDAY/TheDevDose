"use client";

import { Prose } from "./Prose";
import { useLang } from "./LangProvider";

/**
 * Renders the topic explanation in the app-wide EN / Hinglish language (the
 * global toggle lives in the header). Kept as a thin client wrapper so the
 * statically-rendered topic page can still feed it both texts.
 */
export function ExplanationPanel({ en, hinglish }: { en: string; hinglish: string }) {
  const { lang, setLang } = useLang();

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Explanation</h2>
        <div className="inline-flex rounded-lg bg-slate-800/80 p-0.5 text-xs ring-1 ring-white/10">
          {(["en", "hinglish"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={
                "rounded-md px-3 py-1 font-medium transition " +
                (lang === l ? "bg-brand-500 text-white shadow" : "text-slate-400 hover:text-slate-200")
              }
              aria-pressed={lang === l}
            >
              {l === "en" ? "English" : "Hinglish"}
            </button>
          ))}
        </div>
      </div>
      <Prose text={lang === "en" ? en : hinglish} />
    </section>
  );
}

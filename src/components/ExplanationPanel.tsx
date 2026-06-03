"use client";

import { useEffect, useState } from "react";
import { Prose } from "./Prose";

type Lang = "en" | "hinglish";
const STORAGE_KEY = "tdd:lang";

/**
 * The EN / Hinglish toggle — a first-class accessibility feature for the
 * target audience. Preference persists in localStorage so it sticks across
 * topics and reloads.
 */
export function ExplanationPanel({
  en,
  hinglish,
}: {
  en: string;
  hinglish: string;
}) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "hinglish") setLang(saved);
  }, []);

  const choose = (next: Lang) => {
    setLang(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Explanation
        </h2>
        <div className="inline-flex rounded-lg bg-slate-800/80 p-0.5 text-xs ring-1 ring-white/10">
          {(["en", "hinglish"] as const).map((l) => (
            <button
              key={l}
              onClick={() => choose(l)}
              className={
                "rounded-md px-3 py-1 font-medium transition " +
                (lang === l
                  ? "bg-brand-500 text-white shadow"
                  : "text-slate-400 hover:text-slate-200")
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

"use client";

import { useLang } from "./LangProvider";
import { track } from "@/lib/track";

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="inline-flex rounded-lg bg-slate-800/80 p-0.5 text-xs ring-1 ring-white/10" role="group" aria-label="Explanation language">
      {(["en", "hinglish"] as const).map((l) => (
        <button
          key={l}
          onClick={() => {
            setLang(l);
            track("hinglish_toggled", { to: l });
          }}
          className={
            "rounded-md px-2.5 py-1 font-medium transition " +
            (lang === l ? "bg-brand-500 text-white shadow" : "text-slate-400 hover:text-slate-200")
          }
          aria-pressed={lang === l}
        >
          {l === "en" ? "EN" : "Hi"}
        </button>
      ))}
    </div>
  );
}

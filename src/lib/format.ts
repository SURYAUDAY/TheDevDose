import type { Difficulty, Language } from "./content";

export const PHASE_ACCENT: Record<string, string> = {
  P1A: "from-yellow-400/20 to-amber-500/10 text-amber-300 ring-amber-400/30",
  P1B: "from-blue-400/20 to-blue-600/10 text-blue-300 ring-blue-400/30",
  P2: "from-cyan-400/20 to-sky-600/10 text-cyan-300 ring-cyan-400/30",
  P3: "from-emerald-400/20 to-green-600/10 text-emerald-300 ring-emerald-400/30",
  P4: "from-fuchsia-400/20 to-purple-600/10 text-fuchsia-300 ring-fuchsia-400/30",
  P5: "from-orange-400/20 to-red-600/10 text-orange-300 ring-orange-400/30",
};

export const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  beginner: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
  intermediate: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
  advanced: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
};

export const LANGUAGE_LABEL: Record<Language, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  jsx: "React / JSX",
  python: "Python",
  sql: "SQL",
  text: "Text",
};

export function accentFor(code: string): string {
  return PHASE_ACCENT[code] ?? "from-slate-400/20 to-slate-600/10 text-slate-300 ring-slate-400/30";
}

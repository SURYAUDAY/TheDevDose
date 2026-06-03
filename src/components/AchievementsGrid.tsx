/** Badge wall derived from the learner's stats (no extra queries). */
export function AchievementsGrid({
  completed,
  longestStreak,
  codeRuns,
  phasesCompleted,
}: {
  completed: number;
  longestStreak: number;
  codeRuns: number;
  phasesCompleted: number;
}) {
  const badges = [
    { icon: "🌱", label: "First Steps", desc: "Complete your first topic", earned: completed >= 1 },
    { icon: "🔥", label: "Getting Warm", desc: "10 topics done", earned: completed >= 10 },
    { icon: "💪", label: "Committed", desc: "50 topics done", earned: completed >= 50 },
    { icon: "💯", label: "Century", desc: "100 topics done", earned: completed >= 100 },
    { icon: "⚡", label: "On a Roll", desc: "7-day streak", earned: longestStreak >= 7 },
    { icon: "🚀", label: "Unstoppable", desc: "30-day streak", earned: longestStreak >= 30 },
    { icon: "⌨️", label: "Code Runner", desc: "Run code 25 times", earned: codeRuns >= 25 },
    { icon: "🏆", label: "Phase Master", desc: "Finish a whole phase", earned: phasesCompleted >= 1 },
    { icon: "👑", label: "Full Stack", desc: "Finish all 6 phases", earned: phasesCompleted >= 6 },
  ];
  const earned = badges.filter((b) => b.earned).length;

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Achievements</h2>
        <span className="text-xs text-slate-500">
          {earned}/{badges.length}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {badges.map((b) => (
          <div
            key={b.label}
            title={b.desc}
            className={
              "flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition " +
              (b.earned
                ? "border-amber-400/30 bg-amber-500/[0.08]"
                : "border-white/10 bg-slate-800/30 opacity-50 grayscale")
            }
          >
            <span className="text-2xl">{b.icon}</span>
            <span className="text-[11px] font-medium text-slate-200">{b.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

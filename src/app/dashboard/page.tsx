import Link from "next/link";
import { auth } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { getLearnerDashboard } from "@/lib/analytics";
import { ProgressRing, StatCard, Heatmap } from "@/components/charts/Charts";
import { AchievementsGrid } from "@/components/AchievementsGrid";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — TheDevDose" };

function readinessColor(v: number): string {
  return v >= 70 ? "#34d399" : v >= 40 ? "#fbbf24" : "#94a3b8";
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-4xl px-4 py-10">{children}</div>;
}

export default async function DashboardPage() {
  if (!dbConfigured) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-slate-400">
          Connect a database (see the README) to track and visualise your progress.
        </p>
      </Shell>
    );
  }
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-slate-400">Sign in to see your progress.</p>
        <Link href="/signin?callbackUrl=/dashboard" className="mt-4 inline-block rounded-lg bg-brand-500 px-4 py-2 font-medium text-white hover:bg-brand-400">
          Sign in
        </Link>
      </Shell>
    );
  }

  const d = await getLearnerDashboard(userId);

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {d.name ? `${d.name}'s dashboard` : "Your dashboard"}
        </h1>
        <Link href="/review" className="text-sm text-brand-400 hover:underline">
          {d.dueReviews} reviews due →
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Topics done" value={`${d.overall.completed}/${d.overall.total}`} hint={`${d.overall.pct}%`} />
        <StatCard label="XP" value={d.xp} />
        <StatCard label="Streak" value={`${d.streak.current}🔥`} hint={`best ${d.streak.longest}`} />
        <StatCard label="Code runs" value={`${d.codeRuns.rate}%`} hint={`${d.codeRuns.passed}/${d.codeRuns.total} passed`} />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Interview readiness by phase
        </h2>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {d.phases.map((p) => (
            <ProgressRing
              key={p.phaseId}
              value={p.readiness}
              size={84}
              label={p.title.split(" ")[0]}
              sublabel={`${p.completed}/${p.total}`}
              color={readinessColor(p.readiness)}
            />
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900/40 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Activity (last 12 weeks)
        </h2>
        <Heatmap data={d.activity} />
      </section>

      <div className="mt-8">
        <AchievementsGrid
          completed={d.overall.completed}
          longestStreak={d.streak.longest}
          codeRuns={d.codeRuns.total}
          phasesCompleted={d.phases.filter((p) => p.pct >= 100).length}
        />
      </div>
    </Shell>
  );
}

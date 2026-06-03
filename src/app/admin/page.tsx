import Link from "next/link";
import { auth } from "@/lib/auth";
import { dbConfigured, prisma } from "@/lib/db";
import { getAdminDashboard } from "@/lib/analytics";
import { StatCard, BarList } from "@/components/charts/Charts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — TheDevDose" };

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-4xl px-4 py-10">{children}</div>;
}

export default async function AdminPage() {
  if (!dbConfigured) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold text-white">Admin</h1>
        <p className="mt-2 text-slate-400">Connect a database to view platform analytics.</p>
      </Shell>
    );
  }
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const me = userId
    ? await prisma.user.findUnique({ where: { id: userId }, select: { isAdmin: true } })
    : null;

  if (!me?.isAdmin) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold text-white">Admin</h1>
        <p className="mt-2 text-slate-400">
          This area is for platform owners. Set <code className="text-brand-300">isAdmin = true</code> on
          your user row (e.g. in Prisma Studio) to access it.
        </p>
        <Link href="/dashboard" className="mt-4 inline-block text-sm text-brand-400 hover:underline">
          ← Your dashboard
        </Link>
      </Shell>
    );
  }

  const a = await getAdminDashboard();
  const funnelMax = Math.max(1, ...a.funnel.map((f) => f.reached));
  const topMax = Math.max(1, ...a.topTopics.map((t) => t.count));

  return (
    <Shell>
      <h1 className="text-2xl font-bold tracking-tight text-white">Platform analytics</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Users" value={a.users} />
        <StatCard label="DAU / WAU / MAU" value={`${a.dau}/${a.wau}/${a.mau}`} />
        <StatCard label="Completions" value={a.completions} />
        <StatCard label="Run pass rate" value={`${a.runs.passRate}%`} hint={`${a.runs.total} runs`} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Phase funnel (users reached → completed)
          </h2>
          <BarList
            items={a.funnel.map((f) => ({
              label: f.title,
              value: f.reached,
              max: funnelMax,
              sub: `${f.reached} → ${f.completed}`,
            }))}
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Most-completed topics
          </h2>
          {a.topTopics.length ? (
            <BarList items={a.topTopics.map((t) => ({ label: t.title, value: t.count, max: topMax }))} />
          ) : (
            <p className="text-sm text-slate-500">No completions yet.</p>
          )}
        </section>
      </div>
    </Shell>
  );
}

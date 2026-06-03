"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useProgress } from "./progress/ProgressProvider";

export function AuthNav() {
  const { status, data } = useSession();
  const { summary } = useProgress();

  if (status === "loading") {
    return <span className="px-3 py-1.5 text-sm text-slate-600">…</span>;
  }

  if (status !== "authenticated") {
    return (
      <Link
        href="/signin"
        className="rounded-md bg-brand-500/90 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-500"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm sm:gap-3">
      <Link href="/dashboard" className="rounded-md px-3 py-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-100">
        Dashboard
      </Link>
      {summary && (
        <span className="hidden items-center gap-2 text-slate-400 sm:flex">
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-medium text-amber-300">
            {summary.xp} XP
          </span>
          {summary.streak && summary.streak.current > 0 && (
            <span className="rounded-full bg-orange-500/15 px-2 py-0.5 font-medium text-orange-300">
              🔥 {summary.streak.current}
            </span>
          )}
        </span>
      )}
      <span className="hidden text-slate-300 sm:inline">{data?.user?.name ?? data?.user?.email}</span>
      <button
        onClick={() => signOut({ redirectTo: "/" })}
        className="rounded-md px-3 py-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-200"
      >
        Sign out
      </button>
    </div>
  );
}

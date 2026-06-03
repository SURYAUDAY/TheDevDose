"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mascot } from "@/components/character/Mascot";

interface ReviewCard {
  cardKey: string;
  front: string;
  back: string;
  topicId: string;
  topicTitle: string;
  phaseId: string;
  slug: string;
}

interface ReviewData {
  authed: boolean;
  dbConfigured: boolean;
  cards: ReviewCard[];
  dueCount: number;
  newCount: number;
  totalCompletedTopics?: number;
}

const GRADES: { label: string; grade: number; cls: string }[] = [
  { label: "Again", grade: 1, cls: "bg-rose-500/80 hover:bg-rose-500" },
  { label: "Hard", grade: 3, cls: "bg-amber-500/80 hover:bg-amber-500" },
  { label: "Good", grade: 4, cls: "bg-emerald-500/80 hover:bg-emerald-500" },
  { label: "Easy", grade: 5, cls: "bg-sky-500/80 hover:bg-sky-500" },
];

export function ReviewSession() {
  const [data, setData] = useState<ReviewData | null>(null);
  const [queue, setQueue] = useState<ReviewCard[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  useEffect(() => {
    fetch("/api/review", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: ReviewData) => {
        setData(d);
        setQueue(d.cards ?? []);
      })
      .catch(() => setData({ authed: false, dbConfigured: false, cards: [], dueCount: 0, newCount: 0 }));
  }, []);

  if (!data) {
    return <p className="text-slate-500">Loading your review deck…</p>;
  }

  if (!data.dbConfigured) {
    return (
      <p className="text-slate-400">
        Connect a database to enable spaced-repetition review (see the README).
      </p>
    );
  }

  if (!data.authed) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 text-center">
        <p className="text-slate-300">Sign in to build and review your flashcard deck.</p>
        <Link
          href="/signin?callbackUrl=/review"
          className="mt-4 inline-block rounded-lg bg-brand-500 px-4 py-2 font-medium text-white hover:bg-brand-400"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (queue.length === 0) {
    const none = (data.totalCompletedTopics ?? 0) === 0;
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-8 text-center">
        <div className="mx-auto mb-3 flex justify-center">
          <Mascot mood="celebrating" size={80} />
        </div>
        <p className="text-lg font-semibold text-white">
          {none ? "Nothing to review yet" : "All caught up!"}
        </p>
        <p className="mt-1 text-sm text-slate-400">
          {none
            ? "Complete some topics — their follow-up questions become your review deck."
            : `You reviewed ${reviewed} card${reviewed === 1 ? "" : "s"}. Come back when more are due.`}
        </p>
        <Link
          href="/learn"
          className="mt-4 inline-block rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          Back to roadmap
        </Link>
      </div>
    );
  }

  const card = queue[0];

  const grade = async (g: number) => {
    void fetch("/api/review/grade", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ cardKey: card.cardKey, grade: g }),
    }).catch(() => {});
    setReviewed((n) => n + 1);
    setRevealed(false);
    setQueue((prev) => {
      const rest = prev.slice(1);
      // "Again" resurfaces the card later in this session.
      return g < 3 ? [...rest, card] : rest;
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
        <span>{queue.length} in queue</span>
        <span>
          {data.dueCount} due · {data.newCount} new · {reviewed} done
        </span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
        <Link
          href={`/learn/${card.phaseId}/${card.slug}`}
          className="text-xs text-brand-400 hover:underline"
        >
          {card.topicTitle}
        </Link>
        <p className="mt-3 text-lg font-medium text-slate-100">{card.front}</p>

        {revealed ? (
          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-slate-300">{card.back}</p>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {GRADES.map((g) => (
                <button
                  key={g.grade}
                  onClick={() => grade(g.grade)}
                  className={`rounded-lg px-2 py-2 text-sm font-medium text-white transition ${g.cls}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="mt-5 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
          >
            Show answer
          </button>
        )}
      </div>
    </div>
  );
}

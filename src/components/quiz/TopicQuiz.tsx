"use client";

import { useState } from "react";

export interface QuizQuestion {
  cardKey: string;
  question: string;
  options: string[];
  answerIndex: number;
}

export function TopicQuiz({ topicId, questions }: { topicId: string; questions: QuizQuestion[] }) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (questions.length === 0) return null;

  const q = questions[index];

  const finish = (finalScore: number) => {
    setDone(true);
    void fetch("/api/quiz/score", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ topicId, score: finalScore, total: questions.length }),
    }).catch(() => {});
  };

  const next = () => {
    if (index + 1 >= questions.length) finish(score);
    else {
      setIndex(index + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setStarted(true);
  };

  if (!started) {
    return (
      <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Test yourself</h2>
        <p className="mt-2 text-sm text-slate-400">
          {questions.length} quick question{questions.length > 1 ? "s" : ""} on this topic.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="mt-3 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-400"
        >
          Start quiz
        </button>
      </section>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 text-center">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Quiz complete</h2>
        <p className="mt-2 text-3xl font-bold text-white">
          {score}/{questions.length}
        </p>
        <p className={"text-sm " + (pct >= 70 ? "text-emerald-400" : "text-amber-400")}>{pct}%</p>
        <button
          onClick={restart}
          className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          Try again
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Question {index + 1} / {questions.length}
        </span>
        <span>Score: {score}</span>
      </div>
      <p className="mt-2 font-medium text-slate-100">{q.question}</p>
      <ul className="mt-3 space-y-2">
        {q.options.map((opt, i) => {
          const answered = picked !== null;
          const isCorrect = i === q.answerIndex;
          const isPicked = i === picked;
          const cls = !answered
            ? "border-white/10 bg-slate-800/40 hover:border-brand-400/50 hover:bg-slate-800/80"
            : isCorrect
              ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-200"
              : isPicked
                ? "border-rose-400/50 bg-rose-500/10 text-rose-200"
                : "border-white/10 bg-slate-800/30 opacity-60";
          return (
            <li key={i}>
              <button
                disabled={answered}
                onClick={() => {
                  setPicked(i);
                  if (i === q.answerIndex) setScore((s) => s + 1);
                }}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm text-slate-200 transition ${cls}`}
              >
                {opt}
                {answered && isCorrect && " ✓"}
              </button>
            </li>
          );
        })}
      </ul>
      {picked !== null && (
        <button
          onClick={next}
          className="mt-4 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-400"
        >
          {index + 1 >= questions.length ? "Finish" : "Next →"}
        </button>
      )}
    </section>
  );
}

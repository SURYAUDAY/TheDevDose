import { ReviewSession } from "@/components/quiz/ReviewSession";

export const metadata = { title: "Review — TheDevDose" };

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-white">Spaced repetition</h1>
      <p className="mt-1 text-sm text-slate-400">
        Flashcards from topics you&apos;ve completed, scheduled with SM-2 so you review
        each one right before you&apos;d forget it.
      </p>
      <div className="mt-6">
        <ReviewSession />
      </div>
    </div>
  );
}

/**
 * SM-2 spaced-repetition scheduling (pure, no DB — unit-tested in test/sm2.test.ts).
 * Grades: 1 = Again, 3 = Hard, 4 = Good, 5 = Easy.
 */
export interface SM2State {
  ease: number;
  intervalDays: number;
  reps: number;
}

export function sm2(prev: SM2State, grade: number): SM2State & { due: Date } {
  let { ease, intervalDays, reps } = prev;
  if (grade < 3) {
    reps = 0;
    intervalDays = 1; // resurface tomorrow (and again within this session client-side)
  } else {
    reps += 1;
    if (reps === 1) intervalDays = 1;
    else if (reps === 2) intervalDays = 6;
    else intervalDays = Math.max(1, Math.round(intervalDays * ease));
    ease = ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (ease < 1.3) ease = 1.3;
  }
  const due = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000);
  return { ease, intervalDays, reps, due };
}

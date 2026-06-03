import { describe, it, expect } from "vitest";
import { sm2 } from "../src/lib/sm2";

describe("sm2 spaced repetition", () => {
  it("grows the interval on repeated Good", () => {
    let s = { ease: 2.5, intervalDays: 0, reps: 0 };
    const intervals: number[] = [];
    for (let k = 0; k < 4; k++) {
      const r = sm2(s, 4);
      intervals.push(r.intervalDays);
      s = r;
    }
    expect(intervals).toEqual([1, 6, 15, 38]);
  });

  it("resets to 1 day on Again", () => {
    const r = sm2({ ease: 2.5, intervalDays: 15, reps: 3 }, 1);
    expect(r.reps).toBe(0);
    expect(r.intervalDays).toBe(1);
  });

  it("raises ease on Easy and clamps at 1.3", () => {
    expect(sm2({ ease: 2.5, intervalDays: 0, reps: 0 }, 5).ease).toBeCloseTo(2.6, 5);
    expect(sm2({ ease: 1.3, intervalDays: 6, reps: 2 }, 3).ease).toBeGreaterThanOrEqual(1.3);
  });
});

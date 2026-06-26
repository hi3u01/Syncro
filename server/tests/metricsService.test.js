//
// Unit tests for metricsService — the core training-load calculations
//
// Covered: Training Load, weekly daily-load bucketing, monotony, strain,
// wellness averages, at-risk detection and strain-spike detection,
// including the edge cases that guard against division by zero
//

const {
  computeTrainingLoad,
  weeklyDailyLoads,
  monotony,
  strain,
  weeklyTrainingLoad,
  wellnessAverages,
  overallWellness,
  isReportAtRisk,
  isStrainSpike,
  populationStd,
} = require("../services/metricsService");

const { startOfWeek, addDays } = require("../utils/dates");

describe("computeTrainingLoad", () => {
  test("TL = RPE * plannedDuration", () => {
    expect(computeTrainingLoad(6, 90)).toBe(540);
  });

  test("returns 0 when either input is missing or invalid", () => {
    expect(computeTrainingLoad(null, 90)).toBe(0);
    expect(computeTrainingLoad(6, undefined)).toBe(0);
    expect(computeTrainingLoad("abc", 90)).toBe(0);
  });
});

describe("populationStd", () => {
  test("uses population variance (divides by n)", () => {
    expect(populationStd([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2, 10);
  });

  test("zero for an empty array", () => {
    expect(populationStd([])).toBe(0);
  });
});

describe("weeklyDailyLoads", () => {
  test("buckets reports into the 7 days of their week and sums same-day load", () => {
    const monday = startOfWeek(new Date());
    const reports = [
      { date: monday, trainingLoad: 100 },
      { date: monday, trainingLoad: 50 }, // same day
      { date: addDays(monday, 2), trainingLoad: 200 },
    ];
    const loads = weeklyDailyLoads(reports, monday);
    expect(loads).toHaveLength(7);
    expect(loads[0]).toBe(150); // Monday
    expect(loads[2]).toBe(200); // Wednesday
    expect(loads[6]).toBe(0); // Sunday
  });

  test("rest days enter the week as TL = 0", () => {
    const monday = startOfWeek(new Date());
    const loads = weeklyDailyLoads(
      [{ date: monday, trainingLoad: 300 }],
      monday,
    );
    expect(loads.filter((x) => x === 0)).toHaveLength(6);
  });
});

describe("monotony", () => {
  test("mean / population SD over the week", () => {
    // one hard day, six rest days
    const loads = [600, 0, 0, 0, 0, 0, 0];
    const m = monotony(loads);
    const mean = 600 / 7;
    const sd = Math.sqrt(loads.reduce((a, x) => a + (x - mean) ** 2, 0) / 7);
    expect(m).toBeCloseTo(mean / sd, 10);
  });

  test("returns 0 for an empty (no-load) week", () => {
    expect(monotony([0, 0, 0, 0, 0, 0, 0])).toBe(0);
  });

  test("returns null when all days are equal (SD = 0, undefined monotony)", () => {
    expect(monotony([100, 100, 100, 100, 100, 100, 100])).toBeNull();
  });
});

describe("strain", () => {
  test("strain = weekly total load * monotony", () => {
    const loads = [600, 0, 0, 0, 0, 0, 0];
    const expected = weeklyTrainingLoad(loads) * monotony(loads);
    expect(strain(loads)).toBeCloseTo(expected, 10);
  });

  test("returns null when monotony is undefined (all days equal)", () => {
    expect(strain([100, 100, 100, 100, 100, 100, 100])).toBeNull();
  });
});

describe("wellnessAverages", () => {
  test("averages each wellness key across reports", () => {
    const reports = [
      { wellness: { fatigue: 2, sleep: 4, soreness: 3, stress: 2, mood: 5 } },
      { wellness: { fatigue: 4, sleep: 2, soreness: 1, stress: 4, mood: 3 } },
    ];
    const avg = wellnessAverages(reports);
    expect(avg.fatigue).toBe(3);
    expect(avg.sleep).toBe(3);
    expect(avg.mood).toBe(4);
  });

  test("null for a key with no numeric data", () => {
    expect(wellnessAverages([]).fatigue).toBeNull();
  });
});

describe("isReportAtRisk", () => {
  test("flags a report when any wellness value is below the threshold (2.5)", () => {
    const report = {
      wellness: { fatigue: 4, sleep: 4, soreness: 2, stress: 4, mood: 4 },
    };
    expect(isReportAtRisk(report)).toBe(true);
  });

  test("not at risk when all values are at or above the threshold", () => {
    const report = {
      wellness: { fatigue: 3, sleep: 4, soreness: 3, stress: 5, mood: 4 },
    };
    expect(isReportAtRisk(report)).toBe(false);
  });
});

describe("isStrainSpike", () => {
  test("true when current strain >= 1.5x previous week", () => {
    expect(isStrainSpike(1500, 1000)).toBe(true);
    expect(isStrainSpike(1500, 999)).toBe(true);
  });

  test("false for a smaller increase", () => {
    expect(isStrainSpike(1400, 1000)).toBe(false);
  });

  test("false when previous strain is missing/zero or current is null", () => {
    expect(isStrainSpike(1500, 0)).toBe(false);
    expect(isStrainSpike(1500, null)).toBe(false);
    expect(isStrainSpike(null, 1000)).toBe(false);
  });
});

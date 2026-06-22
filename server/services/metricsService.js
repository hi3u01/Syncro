//  - Training Load (TL)  = rpe * event.plannedDuration            [arbitrary units]
//  - Monotony      (M)   = mean(daily TL of the week) / sd(...)   — rest days count as TL = 0
//  - Strain        (S)   = sum(daily TL of the week) * M

const { WELLNESS_KEYS, AT_RISK_THRESHOLD } = require("../constants/validation");
const { startOfWeek, addDays, localDateString } = require("../utils/dates");

const STRAIN_SPIKE_FACTOR = 1.5;

const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const mean = (arr) => (arr.length ? sum(arr) / arr.length : 0);

// Population standard deviation: a training week is the complete set of 7 days
const populationStd = (arr) => {
  if (!arr.length) return 0;
  const m = mean(arr);
  const variance = mean(arr.map((x) => (x - m) ** 2));
  return Math.sqrt(variance);
};

// Training Load for a single session.
const computeTrainingLoad = (rpe, plannedDuration) => {
  const r = Number(rpe) || 0;
  const d = Number(plannedDuration) || 0;
  return r * d;
};

const reportDate = (report) =>
  (report.eventId && report.eventId.date) || report.date;

const weeklyDailyLoads = (reports, weekRef) => {
  const start = startOfWeek(weekRef);
  const buckets = new Array(7).fill(0);
  const dayIndex = {};
  for (let i = 0; i < 7; i++) {
    dayIndex[localDateString(addDays(start, i))] = i;
  }
  reports.forEach((r) => {
    const idx = dayIndex[localDateString(reportDate(r))];
    if (idx !== undefined) buckets[idx] += r.trainingLoad || 0;
  });
  return buckets;
};

const monotony = (dailyLoads) => {
  const m = mean(dailyLoads);
  if (m === 0) return 0;
  const sd = populationStd(dailyLoads);
  if (sd === 0) return null;
  return m / sd;
};

const strain = (dailyLoads) => {
  const mono = monotony(dailyLoads);
  if (mono === null) return null;
  return sum(dailyLoads) * mono;
};

const weeklyTrainingLoad = (dailyLoads) => sum(dailyLoads);

const wellnessAverages = (reports) => {
  const out = {};
  WELLNESS_KEYS.forEach((k) => {
    const vals = reports
      .map((r) => r.wellness && r.wellness[k])
      .filter((v) => typeof v === "number");
    out[k] = vals.length ? mean(vals) : null;
  });
  return out;
};

const overallWellness = (reports) => {
  const perReport = reports
    .map((r) => {
      const vals = WELLNESS_KEYS.map((k) => r.wellness && r.wellness[k]).filter(
        (v) => typeof v === "number",
      );
      return vals.length ? mean(vals) : null;
    })
    .filter((v) => v !== null);
  return perReport.length ? mean(perReport) : null;
};

const isReportAtRisk = (report) =>
  WELLNESS_KEYS.some((k) => {
    const v = report.wellness && report.wellness[k];
    return typeof v === "number" && v < AT_RISK_THRESHOLD;
  });

const isStrainSpike = (currentStrain, previousStrain) => {
  if (currentStrain === null || !previousStrain) return false;
  return currentStrain >= previousStrain * STRAIN_SPIKE_FACTOR;
};

module.exports = {
  STRAIN_SPIKE_FACTOR,
  sum,
  mean,
  populationStd,
  computeTrainingLoad,
  reportDate,
  weeklyDailyLoads,
  monotony,
  strain,
  weeklyTrainingLoad,
  wellnessAverages,
  overallWellness,
  isReportAtRisk,
  isStrainSpike,
};

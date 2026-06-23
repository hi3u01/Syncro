const User = require("../models/User");
const Report = require("../models/Report");
const metrics = require("./metricsService");
const {
  startOfDay,
  addDays,
  startOfWeek,
  localDateString,
} = require("../utils/dates");
const { WELLNESS_KEYS } = require("../constants/validation");

const CZ_DAYS = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];

const EVENT_FIELDS = "type title date plannedDuration plannedRpe";

const last7DaySeries = (reports, loadFor) => {
  const today = startOfDay(new Date());
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today, -i);
    days.push({
      dateStr: localDateString(d),
      day: i === 0 ? "Dnes" : CZ_DAYS[d.getDay()],
      load: 0,
      type: "Volno",
      isMatch: false,
    });
  }
  const byDay = {};
  days.forEach((d) => (byDay[d.dateStr] = []));
  reports.forEach((r) => {
    const key = localDateString(metrics.reportDate(r));
    if (byDay[key]) byDay[key].push(r);
  });
  days.forEach((day) => {
    const dayReports = byDay[day.dateStr];
    if (dayReports.length > 0) {
      day.load = Math.round(loadFor(dayReports));
      const type =
        (dayReports[0].eventId && dayReports[0].eventId.type) || "Aktivita";
      day.type = type;
      day.isMatch = type === "Zápas";
    }
  });
  return days;
};

const avgTrainingLoad = (dayReports) =>
  metrics.mean(dayReports.map((r) => r.trainingLoad || 0));

const WELLNESS_META = {
  fatigue: { label: "Únava", higherIsBetter: false },
  sleep: { label: "Spánek", higherIsBetter: true },
  soreness: { label: "Bolest", higherIsBetter: false },
  stress: { label: "Stres", higherIsBetter: false },
  mood: { label: "Nálada", higherIsBetter: true },
};

const teamWellnessSummary = (latestEventReports) => {
  const avg = metrics.wellnessAverages(latestEventReports);
  return WELLNESS_KEYS.map((k) => ({
    key: k,
    label: WELLNESS_META[k].label,
    higherIsBetter: WELLNESS_META[k].higherIsBetter,
    value: avg[k] === null ? null : Number(avg[k].toFixed(1)),
  }));
};

const buildHeatmap = (players, reports) => {
  const today = startOfDay(new Date());
  return players.map((p) => {
    const playerReports = reports
      .filter((r) => String(r.playerId._id || r.playerId) === String(p._id))
      .sort((a, b) => metrics.reportDate(b) - metrics.reportDate(a));
    const latest = playerReports[0];
    const isToday = latest && metrics.reportDate(latest) >= today;
    return {
      id: p._id,
      name: `${p.firstName} ${p.lastName}`,
      hasReport: !!isToday,
      rpe: latest ? latest.rpe : null,
      wellness: latest ? latest.wellness : null,
      note: latest ? latest.note || "" : "",
    };
  });
};

const groupByPlayer = (reports) => {
  const map = new Map();
  reports.forEach((r) => {
    const id = String(r.playerId._id || r.playerId);
    if (!map.has(id)) map.set(id, []);
    map.get(id).push(r);
  });
  return map;
};

const getTeamDashboard = async (teamId) => {
  const players = await User.find({ role: "player", teamId }).select(
    "firstName lastName _id",
  );

  const since = addDays(startOfDay(new Date()), -30);
  const reports = await Report.find({
    teamId,
    date: { $gte: since },
  })
    .populate("eventId", EVENT_FIELDS)
    .populate("playerId", "firstName lastName");

  // KPI: strain spike per player (this week vs last week).
  const thisWeek = startOfWeek(new Date());
  const lastWeek = addDays(thisWeek, -7);
  const byPlayer = groupByPlayer(reports);
  let strainSpikeCount = 0;
  byPlayer.forEach((playerReports) => {
    const curStrain = metrics.strain(
      metrics.weeklyDailyLoads(playerReports, thisWeek),
    );
    const prevStrain = metrics.strain(
      metrics.weeklyDailyLoads(playerReports, lastWeek),
    );
    if (metrics.isStrainSpike(curStrain, prevStrain)) strainSpikeCount += 1;
  });

  // KPI: at-risk players (any wellness param < 2.5) within the last 7 days.
  const weekAgo = addDays(startOfDay(new Date()), -7);
  const atRiskIds = new Set();
  reports.forEach((r) => {
    if (metrics.reportDate(r) >= weekAgo && metrics.isReportAtRisk(r)) {
      atRiskIds.add(String(r.playerId._id || r.playerId));
    }
  });

  // KPI: wellness average + RPE of the most recent event that has reports.
  const sortedByDate = [...reports].sort(
    (a, b) => metrics.reportDate(b) - metrics.reportDate(a),
  );
  let latestEventReports = [];
  if (sortedByDate.length > 0) {
    const latestEventId = String(
      sortedByDate[0].eventId && sortedByDate[0].eventId._id,
    );
    latestEventReports = reports.filter(
      (r) => String(r.eventId && r.eventId._id) === latestEventId,
    );
  }
  const wellnessAvg = metrics.overallWellness(latestEventReports);
  const activeRpe = latestEventReports
    .map((r) => r.rpe)
    .filter((v) => typeof v === "number" && v > 0);
  const plannedRpe =
    (latestEventReports[0] &&
      latestEventReports[0].eventId &&
      latestEventReports[0].eventId.plannedRpe) ||
    null;

  return {
    totalPlayers: players.length,
    kpis: {
      wellnessAvg: wellnessAvg === null ? null : Number(wellnessAvg.toFixed(1)),
      atRiskCount: atRiskIds.size,
      strainSpikeCount,
      avgRpe: {
        actual: activeRpe.length
          ? Number(metrics.mean(activeRpe).toFixed(1))
          : null,
        planned: plannedRpe,
      },
    },
    weeklyLoad: last7DaySeries(reports, avgTrainingLoad),
    wellnessSummary: teamWellnessSummary(latestEventReports),
    heatmap: buildHeatmap(players, reports),
  };
};

const weeklySeries = (reports, weeks) => {
  const series = [];
  const thisWeekStart = startOfWeek(new Date());
  for (let i = weeks - 1; i >= 0; i--) {
    const ws = addDays(thisWeekStart, -7 * i);
    const loads = metrics.weeklyDailyLoads(reports, ws);
    const mono = metrics.monotony(loads);
    const str = metrics.strain(loads);
    series.push({
      weekStart: localDateString(ws),
      label: `${ws.getDate()}.${ws.getMonth() + 1}.`,
      weeklyTL: metrics.weeklyTrainingLoad(loads),
      monotony: mono === null ? null : Number(mono.toFixed(2)),
      strain: str === null ? null : Math.round(str),
    });
  }
  return series;
};

const seasonRadar = (allReports, currentWeekReports) => {
  const season = metrics.wellnessAverages(allReports);
  const current = metrics.wellnessAverages(currentWeekReports);
  const labels = {
    sleep: "Spánek",
    fatigue: "Únava",
    soreness: "Bolest",
    stress: "Stres",
    mood: "Nálada",
  };
  return WELLNESS_KEYS.map((k) => ({
    subject: labels[k],
    current: current[k] === null ? 0 : Number(current[k].toFixed(1)),
    season: season[k] === null ? 0 : Number(season[k].toFixed(1)),
    fullMark: 5,
  }));
};

const getPlayerAnalytics = async (playerId, weeks = 8) => {
  const player = await User.findById(playerId).select(
    "firstName lastName teamId role",
  );
  if (!player) return null;

  const since = addDays(startOfWeek(new Date()), -7 * weeks);
  const reports = await Report.find({
    playerId,
    date: { $gte: since },
  }).populate("eventId", EVENT_FIELDS);

  const allReports = await Report.find({ playerId }).populate(
    "eventId",
    EVENT_FIELDS,
  );

  const thisWeek = startOfWeek(new Date());
  const lastWeek = addDays(thisWeek, -7);
  const curLoads = metrics.weeklyDailyLoads(reports, thisWeek);
  const prevLoads = metrics.weeklyDailyLoads(reports, lastWeek);

  const curWeekReports = reports.filter(
    (r) => metrics.reportDate(r) >= thisWeek,
  );

  const round2 = (v) => (v === null ? null : Number(v.toFixed(2)));
  const current = {
    weeklyTL: metrics.weeklyTrainingLoad(curLoads),
    monotony: round2(metrics.monotony(curLoads)),
    strain:
      metrics.strain(curLoads) === null
        ? null
        : Math.round(metrics.strain(curLoads)),
    reportCount: curWeekReports.length,
  };
  const prevWeekReports = reports.filter((r) => {
    const d = metrics.reportDate(r);
    return d >= lastWeek && d < thisWeek;
  });
  const previous = {
    weeklyTL: metrics.weeklyTrainingLoad(prevLoads),
    monotony: round2(metrics.monotony(prevLoads)),
    strain:
      metrics.strain(prevLoads) === null
        ? null
        : Math.round(metrics.strain(prevLoads)),
    reportCount: prevWeekReports.length,
  };

  const delta = (a, b) => (a === null || b === null ? null : a - b);
  const trends = {
    weeklyTL: delta(current.weeklyTL, previous.weeklyTL),
    monotony: delta(current.monotony, previous.monotony),
    strain: delta(current.strain, previous.strain),
    reportCount: delta(current.reportCount, previous.reportCount),
  };

  return {
    player: {
      _id: player._id,
      firstName: player.firstName,
      lastName: player.lastName,
    },
    current,
    previous,
    trends,
    weeklyLoad: last7DaySeries(reports, avgTrainingLoad),
    series: weeklySeries(reports, weeks),
    wellnessRadar: seasonRadar(allReports, curWeekReports),
    reports: allReports
      .sort((a, b) => metrics.reportDate(b) - metrics.reportDate(a))
      .slice(0, 30),
  };
};

module.exports = {
  getTeamDashboard,
  getPlayerAnalytics,
};

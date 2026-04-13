import { useMemo } from "react";
import {
  CheckCircle2,
  Activity,
  Moon,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const CoachKPICards = ({ reports = [], totalPlayers = 30 }) => {
  const stats = useMemo(() => {
    const now = new Date();

    // Func for dates
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const sevenDaysAgo = new Date(
      startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000,
    );
    const fourteenDaysAgo = new Date(
      startOfToday.getTime() - 14 * 24 * 60 * 60 * 1000,
    );
    // Compliance - players, who submitted report today
    const todaysReports = reports.filter(
      (r) => new Date(r.createdAt || r.date) >= startOfToday,
    );
    const uniquePlayersToday = new Set(
      todaysReports.map((r) => r.userId || r.player),
    ).size;
    const compliancePercentage =
      totalPlayers > 0
        ? Math.round((uniquePlayersToday / totalPlayers) * 100)
        : 0;

    // Seperate reports for current week and previus
    const currentWeekReports = reports.filter(
      (r) => new Date(r.createdAt || r.date) > sevenDaysAgo,
    );
    const prevWeekReports = reports.filter((r) => {
      const d = new Date(r.createdAt || r.date);
      return d > fourteenDaysAgo && d <= sevenDaysAgo;
    });

    // Average load (RPE x Duration) for current week
    let avgRpe = 0,
      avgDuration = 0,
      avgLoad = 0;
    if (currentWeekReports.length > 0) {
      avgRpe =
        currentWeekReports.reduce((sum, r) => sum + r.rpe, 0) /
        currentWeekReports.length;
      avgDuration =
        currentWeekReports.reduce((sum, r) => sum + r.duration, 0) /
        currentWeekReports.length;
      avgLoad = avgRpe * avgDuration;
    }

    // Average sleep and trend compared to previous week
    const getAvgSleep = (arr) =>
      arr.length ? arr.reduce((sum, r) => sum + r.sleep, 0) / arr.length : 0;
    const currentSleep = getAvgSleep(currentWeekReports);
    const prevSleep = getAvgSleep(prevWeekReports);
    const sleepTrend = currentSleep - prevSleep;

    // 4. Risk players
    const atRiskPlayers = new Set();
    currentWeekReports.forEach((r) => {
      if (r.sleep <= 2 || r.fatigue <= 2 || r.soreness <= 2 || r.rpe >= 9) {
        atRiskPlayers.add(r.userId || r.player);
      }
    });

    return {
      compliance: {
        current: uniquePlayersToday,
        total: totalPlayers,
        percentage: compliancePercentage,
      },
      load: {
        current: Math.round(avgLoad),
        rpe: avgRpe.toFixed(1),
        duration: Math.round(avgDuration),
      },
      sleep: { current: currentSleep.toFixed(1), trend: sleepTrend.toFixed(1) },
      risk: { count: atRiskPlayers.size },
    };
  }, [reports, totalPlayers]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all hover:border-gray-600">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Vyplněno dnes
          </p>
          <div className="p-2 bg-[#2a303c]/50 rounded-xl">
            <CheckCircle2 size={18} className="text-gray-300" />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight m-0">
            {stats.compliance.current}{" "}
            <span className="text-lg text-gray-500 font-medium">
              / {stats.compliance.total}
            </span>
          </h3>
          <p className="text-[12px] font-bold text-emerald-400 mt-2 flex items-center gap-1">
            {stats.compliance.percentage}% týmu vyplnilo
          </p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all hover:border-gray-600">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Průměrná zátěž
          </p>
          <div className="p-2 bg-[#4E4619] rounded-xl">
            <Activity size={18} className="text-[#dce1a1]" />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight m-0">
            {stats.load.current}{" "}
            <span className="text-sm text-gray-500 font-medium tracking-normal">
              A.U.
            </span>
          </h3>
          <p className="text-[12px] font-bold text-gray-400 mt-2">
            RPE {stats.load.rpe} × {stats.load.duration} min
          </p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all hover:border-gray-600">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Spánek týmu (za týden)
          </p>
          <div className="p-2 bg-[#2a303c]/50 rounded-xl">
            <Moon size={18} className="text-gray-300" />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight m-0">
            {stats.sleep.current}{" "}
            <span className="text-lg text-gray-500 font-medium">/ 5</span>
          </h3>
          <p
            className={`text-[12px] font-bold mt-2 flex items-center gap-1 ${
              Number(stats.sleep.trend) < 0
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {Number(stats.sleep.trend) < 0 ? (
              <TrendingDown size={14} />
            ) : (
              <TrendingUp size={14} />
            )}
            {Math.abs(stats.sleep.trend)} oproti min. týdnu
          </p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all hover:border-red-900/50 group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-900/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-all group-hover:bg-red-900/20"></div>

        <div className="flex justify-between items-start mb-4 relative z-10">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Rizikoví hráči
          </p>
          <div className="p-2 bg-red-900/30 border border-red-900/50 rounded-xl">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl font-extrabold text-white tracking-tight m-0 text-red-400">
            {stats.risk.count}
          </h3>
          <p className="text-[12px] font-bold text-red-400/80 mt-2">
            Vyžadují pozornost!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoachKPICards;

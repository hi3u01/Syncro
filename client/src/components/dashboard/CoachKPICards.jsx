import {
  HeartPulse,
  Activity,
  AlertTriangle,
  Flame,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const fmt = (v, suffix = "") =>
  v === null || v === undefined ? "–" : `${v}${suffix}`;

const CoachKPICards = ({ kpis, totalPlayers = 0 }) => {
  const wellnessAvg = kpis?.wellnessAvg ?? null;
  const atRisk = kpis?.atRiskCount ?? 0;
  const strainSpike = kpis?.strainSpikeCount ?? 0;
  const rpeActual = kpis?.avgRpe?.actual ?? null;
  const rpePlanned = kpis?.avgRpe?.planned ?? null;

  const rpeDiff =
    rpeActual !== null && rpePlanned !== null ? rpeActual - rpePlanned : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
      {/* Team wellness average (orientation, last event) */}
      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-5 shadow-lg transition-all hover:border-gray-600">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Wellness týmu
          </p>
          <div className="p-2 bg-[#2a303c]/50 rounded-xl">
            <HeartPulse size={18} className="text-gray-300" />
          </div>
        </div>
        <h3 className="text-3xl font-extrabold text-white tracking-tight m-0">
          {fmt(wellnessAvg)}{" "}
          <span className="text-lg text-gray-500 font-medium">/ 5</span>
        </h3>
        <p className="text-[12px] font-bold text-gray-400 mt-2">
          průměr za poslední událost
        </p>
      </div>

      {/* At-risk players */}
      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-5 shadow-lg transition-all hover:border-red-900/50 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-900/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="flex justify-between items-start mb-4 relative z-10">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Rizikoví hráči
          </p>
          <div className="p-2 bg-red-900/30 border border-red-900/50 rounded-xl">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
        </div>
        <h3 className="text-3xl font-extrabold tracking-tight m-0 text-red-400 relative z-10">
          {atRisk}
        </h3>
        <p className="text-[12px] font-bold text-red-400/80 mt-2 relative z-10">
          wellness pod 2,5 (za týden)
        </p>
      </div>

      {/* Strain spikes */}
      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-5 shadow-lg transition-all hover:border-gray-600">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Strain spike
          </p>
          <div className="p-2 bg-[#4E4619] rounded-xl">
            <Flame size={18} className="text-[#dce1a1]" />
          </div>
        </div>
        <h3 className="text-3xl font-extrabold text-white tracking-tight m-0">
          {strainSpike}{" "}
          <span className="text-lg text-gray-500 font-medium">
            / {totalPlayers}
          </span>
        </h3>
        <p className="text-[12px] font-bold text-gray-400 mt-2">
          prudký nárůst napětí
        </p>
      </div>

      {/* Average RPE vs planned */}
      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-5 shadow-lg transition-all hover:border-gray-600">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Průměrné RPE
          </p>
          <div className="p-2 bg-[#2a303c]/50 rounded-xl">
            <Activity size={18} className="text-gray-300" />
          </div>
        </div>
        <h3 className="text-3xl font-extrabold text-white tracking-tight m-0">
          {fmt(rpeActual)}{" "}
          <span className="text-lg text-gray-500 font-medium">/ 10</span>
        </h3>
        {rpeDiff === null ? (
          <p className="text-[12px] font-bold text-gray-400 mt-2">
            plán: {fmt(rpePlanned)}
          </p>
        ) : (
          <p
            className={`text-[12px] font-bold mt-2 flex items-center gap-1 ${
              rpeDiff > 0 ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {rpeDiff > 0 ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            {rpeDiff > 0 ? "+" : ""}
            {rpeDiff.toFixed(1)} oproti plánu ({rpePlanned})
          </p>
        )}
      </div>
    </div>
  );
};

export default CoachKPICards;

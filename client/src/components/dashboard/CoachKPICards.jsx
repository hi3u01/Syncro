import { TrendingDown, TrendingUp } from "lucide-react";
import InfoTooltip from "../ui/InfoTooltip";

const fmt = (v, suffix = "") =>
  v === null || v === undefined ? "–" : `${v}${suffix}`;

const CoachKPICards = ({ kpis, totalPlayers = 0 }) => {
  const wellnessAvg = kpis?.wellnessAvg ?? null;
  const atRisk = kpis?.atRiskCount ?? 0;
  const atRiskPlayers = kpis?.atRiskPlayers ?? [];
  const strainSpike = kpis?.strainSpikeCount ?? 0;
  const strainSpikePlayers = kpis?.strainSpikePlayers ?? [];
  const rpeActual = kpis?.avgRpe?.actual ?? null;
  const rpePlanned = kpis?.avgRpe?.planned ?? null;

  const rpeDiff =
    rpeActual !== null && rpePlanned !== null ? rpeActual - rpePlanned : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
      {/* Team wellness average (orientation, last event) */}
      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-5 shadow-lg transition-all hover:border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">
            Wellness týmu
          </p>
          <InfoTooltip text="Průměrné wellness (Hooper) všech hráčů z poslední události. Škála 1–5, vyšší je lepší." />
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
      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-5 shadow-lg transition-all hover:border-red-900/50 group relative">
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-900/10 rounded-full blur-3xl -mr-10 -mt-10" />
        </div>
        <div className="flex justify-between items-center mb-4 relative z-20">
          <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">
            Rizikoví hráči
          </p>
          <InfoTooltip
            text="Hráči s wellness pod 2,5 za poslední týden. Signalizuje únavu nebo nedostatečnou regeneraci."
            items={atRiskPlayers}
          />
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
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">
            Strain spike
          </p>
          <InfoTooltip
            text="Hráči s prudkým nárůstem napětí (strain = týdenní zátěž × monotónnost) oproti minulému týdnu. Vyšší riziko přetížení."
            items={strainSpikePlayers}
          />
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
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">
            Průměrné RPE
          </p>
          <InfoTooltip text="Průměrná vnímaná náročnost (RPE 1–10) z dotazníků oproti plánu trenéra. Kladný rozdíl = hráči to mají těžší, než bylo plánováno." />
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

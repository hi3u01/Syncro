import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import WeeklyLoadChart from "../components/dashboard/WeeklyLoadCharts";
import MonotonyStrainChart from "../components/player/MonotonyStrainChart";
import PlayerWellnessRadar from "../components/player/PlayerWellnessRadar";
import ReportHistory from "../components/reports/ReportHistory";
import InfoTooltip from "../components/ui/InfoTooltip";

const fmt = (v) => (v === null || v === undefined ? "–" : v);

const round1 = (v) =>
  v === null || v === undefined ? v : Math.round(v * 10) / 10;

const STRONG_CHANGE = 0.25;

const trendStrength = (value, trend) => {
  if (!trend) return "flat";
  const prev = value - trend;
  const pct = prev ? Math.abs(trend / prev) : 1;
  return pct >= STRONG_CHANGE ? "strong" : "mild";
};

const getHint = (metric, value, trend) => {
  if (value === null || value === undefined) return null;
  const strength = trendStrength(value, trend);
  const up = trend > 0;
  switch (metric) {
    case "weeklyTL":
      if (strength === "flat") return "Stabilní zátěž";
      if (up) return strength === "strong" ? "Hodně zatížený" : "Roste zátěž";
      return strength === "strong"
        ? "Lehký týden, může přidat"
        : "Mírně nižší zátěž";
    case "monotony":
      if (strength === "flat") return "Vyvážený týden";
      if (up)
        return strength === "strong"
          ? "Jednotvárná zátěž, prostřídej"
          : "Méně pestrý týden";
      return "Pestřejší rozložení zátěže";
    case "strain":
      if (strength === "flat") return "Napětí beze změny";
      if (up)
        return strength === "strong"
          ? "Vyšší riziko přetížení"
          : "Roste napětí";
      return "Klesající napětí";
    case "reportCount":
      if (strength === "flat") return "Vyplňuje stejně";
      if (up) return "Lépe vyplňuje dotazníky";
      return strength === "strong"
        ? "Málo dotazníků, připomeň"
        : "Méně dotazníků";
    default:
      return null;
  }
};

const TrendBadge = ({ value, invert = false, neutralDown = false }) => {
  if (value === null || value === undefined || value === 0) {
    return (
      <span className="flex items-center gap-1 text-gray-500">
        <Minus size={14} /> beze změny
      </span>
    );
  }
  const neutral = neutralDown && value < 0;
  const bad = invert ? value < 0 : value > 0;
  const Icon = value > 0 ? TrendingUp : TrendingDown;
  const color = neutral
    ? "text-gray-400"
    : bad
      ? "text-red-400"
      : "text-emerald-400";
  return (
    <span className={`flex items-center gap-1 ${color}`}>
      <Icon size={14} />
      {value > 0 ? "+" : ""}
      {round1(value)} vs. min. týden
    </span>
  );
};

const KpiCard = ({
  label,
  value,
  suffix,
  info,
  trend,
  invert,
  metric,
  neutralDown,
}) => {
  const hint = getHint(metric, value, trend);
  return (
    <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-5 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">
          {label}
        </p>
        <InfoTooltip text={info} />
      </div>
      <h3 className="text-3xl font-extrabold text-white tracking-tight m-0">
        {fmt(value)}
        {suffix && value !== null && value !== undefined && (
          <span className="text-sm text-gray-500 font-medium ml-1">
            {suffix}
          </span>
        )}
      </h3>
      <p className="text-[12px] font-bold mt-2">
        <TrendBadge value={trend} invert={invert} neutralDown={neutralDown} />
      </p>
      {hint && (
        <p className="text-[11px] font-medium text-gray-500 mt-1">{hint}</p>
      )}
    </div>
  );
};

const PlayerDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/users/${id}/analytics`);
        setData(res.data);
      } catch (err) {
        setError(
          err.response?.data?.error || "Nepodařilo se načíst data hráče.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 font-medium py-20">Načítání...</p>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <Link
          to="/players"
          className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 no-underline"
        >
          <ArrowLeft size={18} /> Zpět na hráče
        </Link>
        <div className="text-red-400 bg-red-900/20 border border-red-900/50 p-4 rounded-xl">
          {error || "Hráč nenalezen."}
        </div>
      </div>
    );
  }

  const { player, current, trends } = data;

  return (
    <div className="w-full max-w-[1100px] mx-auto animate-in fade-in duration-500">
      <Link
        to="/players"
        className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 no-underline text-sm font-bold uppercase tracking-widest"
      >
        <ArrowLeft size={18} /> Zpět na hráče
      </Link>

      <div className="flex items-center gap-4 mb-8 border-b border-[#2a303c] pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight m-0">
          {player.firstName} {player.lastName}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <KpiCard
          label="Týdenní zátěž"
          value={current.weeklyTL}
          suffix="A.U."
          info="Součet denní tréninkové zátěže (RPE × minuty) za posledních 7 dní. Vyjadřuje celkové zatížení hráče v týdnu."
          trend={trends.weeklyTL}
          invert={false}
          metric="weeklyTL"
          neutralDown
        />
        <KpiCard
          label="Monotónnost"
          value={current.monotony}
          info="Jednotvárnost zátěže = průměr / směrodatná odchylka denních zátěží. Vyšší hodnota znamená málo pestrý týden a vyšší riziko přetížení."
          trend={trends.monotony}
          invert={false}
          metric="monotony"
        />
        <KpiCard
          label="Napětí (strain)"
          value={current.strain}
          info="Napětí = týdenní zátěž × monotónnost. Kombinuje objem a jednotvárnost; vysoké hodnoty signalizují riziko přetížení."
          trend={trends.strain}
          invert={false}
          metric="strain"
        />
        <KpiCard
          label="Dotazníky"
          value={current.reportCount}
          suffix="/ týden"
          info="Počet vyplněných dotazníků (sRPE + wellness) za poslední týden. Více dotazníků = spolehlivější data."
          trend={trends.reportCount}
          invert
          metric="reportCount"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <WeeklyLoadChart
          data={data.weeklyLoad}
          title="Týdenní zátěž hráče"
          subtitle="Denní Load (RPE × Minuty)"
        />
        <PlayerWellnessRadar data={data.wellnessRadar} />
      </div>

      <div className="mb-6">
        <MonotonyStrainChart data={data.series} />
      </div>

      <h2 className="text-xl font-extrabold text-white tracking-tight mb-4">
        Historie dotazníků
      </h2>
      <ReportHistory reports={data.reports} />
    </div>
  );
};

export default PlayerDetail;

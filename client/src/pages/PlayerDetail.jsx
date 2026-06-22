import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import {
  ArrowLeft,
  Activity,
  Repeat,
  Flame,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import WeeklyLoadChart from "../components/dashboard/WeeklyLoadCharts";
import MonotonyStrainChart from "../components/player/MonotonyStrainChart";
import PlayerWellnessRadar from "../components/player/PlayerWellnessRadar";
import ReportHistory from "../components/reports/ReportHistory";

const fmt = (v) => (v === null || v === undefined ? "–" : v);

const TrendBadge = ({ value, invert = false }) => {
  if (value === null || value === undefined || value === 0) {
    return (
      <span className="flex items-center gap-1 text-gray-500">
        <Minus size={14} /> beze změny
      </span>
    );
  }
  const bad = invert ? value < 0 : value > 0;
  const Icon = value > 0 ? TrendingUp : TrendingDown;
  return (
    <span
      className={`flex items-center gap-1 ${bad ? "text-red-400" : "text-emerald-400"}`}
    >
      <Icon size={14} />
      {value > 0 ? "+" : ""}
      {value} vs. min. týden
    </span>
  );
};

const KpiCard = ({ label, value, suffix, icon: Icon, trend, invert }) => (
  <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-5 shadow-lg">
    <div className="flex justify-between items-start mb-4">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
        {label}
      </p>
      <div className="p-2 bg-[#2a303c]/50 rounded-xl">
        <Icon size={18} className="text-gray-300" />
      </div>
    </div>
    <h3 className="text-3xl font-extrabold text-white tracking-tight m-0">
      {fmt(value)}
      {suffix && value !== null && value !== undefined && (
        <span className="text-sm text-gray-500 font-medium ml-1">{suffix}</span>
      )}
    </h3>
    <p className="text-[12px] font-bold mt-2">
      <TrendBadge value={trend} invert={invert} />
    </p>
  </div>
);

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
          icon={Activity}
          trend={trends.weeklyTL}
          invert={false}
        />
        <KpiCard
          label="Monotónnost"
          value={current.monotony}
          icon={Repeat}
          trend={trends.monotony}
          invert={false}
        />
        <KpiCard
          label="Napětí (strain)"
          value={current.strain}
          icon={Flame}
          trend={trends.strain}
          invert={false}
        />
        <KpiCard
          label="Dotazníky"
          value={current.reportCount}
          suffix="/ týden"
          icon={ClipboardCheck}
          trend={trends.reportCount}
          invert
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

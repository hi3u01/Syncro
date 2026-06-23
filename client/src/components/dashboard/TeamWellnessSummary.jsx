import { HeartPulse, BatteryLow, Moon, Brain, Smile } from "lucide-react";

const ICONS = {
  fatigue: BatteryLow,
  sleep: Moon,
  soreness: HeartPulse,
  stress: Brain,
  mood: Smile,
};

const semaphore = (value, higherIsBetter) => {
  if (value === null || value === undefined) {
    return {
      text: "text-gray-600",
      bar: "bg-gray-700",
      track: "bg-[#2a303c]",
    };
  }
  const good = {
    text: "text-emerald-400",
    bar: "bg-emerald-400",
    track: "bg-emerald-900/20",
  };
  const warn = {
    text: "text-yellow-500",
    bar: "bg-yellow-500",
    track: "bg-yellow-900/20",
  };
  const bad = {
    text: "text-red-400",
    bar: "bg-red-400",
    track: "bg-red-900/20",
  };

  if (higherIsBetter) {
    if (value < 2.5) return bad;
    if (value < 3.5) return warn;
    return good;
  }
  if (value >= 3.5) return bad;
  if (value >= 2.5) return warn;
  return good;
};

const TeamWellnessSummary = ({ data = [] }) => {
  const rows = data || [];

  return (
    <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-6 shadow-lg w-full h-[400px] flex flex-col">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-[#2a303c]/50 rounded-xl">
          <HeartPulse size={20} className="text-gray-300" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight m-0">
            Wellness týmu
          </h2>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Průměr za poslední trénink/zápas
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4">
        {rows.length === 0 ? (
          <div className="text-center text-gray-500 text-sm font-medium uppercase tracking-widest">
            Zatím žádná data.
          </div>
        ) : (
          rows.map((row) => {
            const Icon = ICONS[row.key] || Smile;
            const c = semaphore(row.value, row.higherIsBetter);
            const pct = row.value === null ? 0 : (row.value / 5) * 100;
            return (
              <div key={row.key} className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 w-28 shrink-0">
                  <Icon size={16} className="text-gray-400 shrink-0" />
                  <span className="text-[13px] font-bold text-gray-300 uppercase tracking-wider">
                    {row.label}
                  </span>
                </div>

                <div
                  className={`flex-1 h-2.5 rounded-full overflow-hidden ${c.track}`}
                >
                  <div
                    className={`h-full rounded-full transition-all ${c.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div
                  className={`w-10 text-right text-[15px] font-extrabold ${c.text}`}
                >
                  {row.value === null ? "–" : row.value}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TeamWellnessSummary;

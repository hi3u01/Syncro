import { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Target } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#2a303c] border border-[#323946] p-4 rounded-xl shadow-xl">
        <p className="text-white font-bold mb-3 uppercase tracking-widest text-[11px] border-b border-[#323946] pb-2">
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <p className="text-[13px] font-medium text-gray-300 w-16">
              {entry.name}:
            </p>
            <p className="text-white font-bold text-[14px]">
              {entry.value}{" "}
              <span className="text-[10px] font-normal text-gray-500">/ 5</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const TeamWellnessRadar = ({ reports = [] }) => {
  const chartData = useMemo(() => {
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfYesterday = new Date(
      startOfToday.getTime() - 24 * 60 * 60 * 1000,
    );

    const reportsToday = reports.filter((r) => {
      const d = new Date(r.eventId?.date || r.date);
      return d >= startOfToday;
    });

    const reportsYesterday = reports.filter((r) => {
      const d = new Date(r.eventId?.date || r.date);
      return d >= startOfYesterday && d < startOfToday;
    });

    const getAvg = (arr, key) => {
      if (arr.length === 0) return 0;
      const sum = arr.reduce((acc, r) => acc + r[key], 0);
      return Number((sum / arr.length).toFixed(1));
    };

    return [
      {
        subject: "Spánek",
        vcera: getAvg(reportsYesterday, "sleep"),
        dnes: getAvg(reportsToday, "sleep"),
        fullMark: 5,
      },
      {
        subject: "Únava",
        vcera: getAvg(reportsYesterday, "fatigue"),
        dnes: getAvg(reportsToday, "fatigue"),
        fullMark: 5,
      },
      {
        subject: "Bolest",
        vcera: getAvg(reportsYesterday, "soreness"),
        dnes: getAvg(reportsToday, "soreness"),
        fullMark: 5,
      },
      {
        subject: "Stres",
        vcera: getAvg(reportsYesterday, "stress"),
        dnes: getAvg(reportsToday, "stress"),
        fullMark: 5,
      },
      {
        subject: "Nálada",
        vcera: getAvg(reportsYesterday, "mood"),
        dnes: getAvg(reportsToday, "mood"),
        fullMark: 5,
      },
    ];
  }, [reports]);

  return (
    <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-6 shadow-lg w-full h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2a303c]/50 rounded-xl">
            <Target size={20} className="text-gray-300" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight m-0">
              Wellness Profil
            </h2>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Dnes vs. Včera (Škála 1-5)
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#dce1a1]"></div>
            <span>Dnes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4b5563]"></div>
            <span>Včera</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full -mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#2a303c" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: "bold" }}
            />

            <PolarRadiusAxis
              angle={30}
              domain={[0, 5]}
              tick={false}
              axisLine={false}
            />

            <Radar
              name="Včera"
              dataKey="vcera"
              stroke="#4b5563"
              fill="#4b5563"
              fillOpacity={0.3}
            />

            <Radar
              name="Dnes"
              dataKey="dnes"
              stroke="#dce1a1"
              fill="#4E4619"
              fillOpacity={0.6}
            />

            <Tooltip content={<CustomTooltip />} cursor={false} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TeamWellnessRadar;

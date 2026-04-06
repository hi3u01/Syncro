import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";

// Mock data
const data = [
  { day: "Po", load: 300, type: "Lehký trénink" },
  { day: "Út", load: 650, type: "Těžký trénink" },
  { day: "St", load: 720, type: "Těžký trénink" },
  { day: "Čt", load: 150, type: "Regenerace" },
  { day: "Pá", load: 450, type: "Předzápasový" },
  { day: "So", load: 850, type: "Zápas" },
  { day: "Ne", load: 0, type: "Volno" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#2a303c] border border-[#323946] p-4 rounded-xl shadow-xl">
        <p className="text-white font-bold mb-1">{label}</p>
        <p className="text-[#dce1a1] font-extrabold text-lg">
          {payload[0].value}{" "}
          <span className="text-xs font-normal text-gray-400">A.U.</span>
        </p>
        <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-2">
          {payload[0].payload.type}
        </p>
      </div>
    );
  }
  return null;
};

const WeeklyLoadChart = () => {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-6 shadow-lg w-full h-[400px] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#2a303c]/50 rounded-xl">
          <BarChart3 size={20} className="text-gray-300" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight m-0">
            Týdenní zátěž týmu
          </h2>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Průměrný Load (RPE × Minuty)
          </p>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2a303c"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />

            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "#2a303c", opacity: 0.4 }}
            />

            <Bar dataKey="load" radius={[6, 6, 0, 0]} maxBarSize={50}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.day === "So" ? "#dce1a1" : "#4E4619"}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyLoadChart;

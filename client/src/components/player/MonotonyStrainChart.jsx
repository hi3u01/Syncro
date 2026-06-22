import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LineChart as LineIcon } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#2a303c] border border-[#323946] p-4 rounded-xl shadow-xl">
        <p className="text-white font-bold mb-2 text-[12px]">Týden {label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[13px] text-gray-300">{entry.name}:</span>
            <span className="text-white font-bold text-[13px]">
              {entry.value === null ? "–" : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MonotonyStrainChart = ({ data = [] }) => {
  const chartData = data || [];

  return (
    <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-6 shadow-lg w-full h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2a303c]/50 rounded-xl">
            <LineIcon size={20} className="text-gray-300" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight m-0">
              Monotónnost & Napětí
            </h2>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Dlouhodobý trend (týden po týdnu)
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 rounded-full bg-[#dce1a1]" />
            <span>Monotónnost</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 rounded-full bg-[#f87171]" />
            <span>Napětí</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2a303c"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              yAxisId="mono"
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="strain"
              orientation="right"
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              yAxisId="mono"
              type="monotone"
              name="Monotónnost"
              dataKey="monotony"
              stroke="#dce1a1"
              strokeWidth={3}
              connectNulls
              dot={{ r: 4, fill: "#1a1a1a", stroke: "#dce1a1", strokeWidth: 2 }}
            />
            <Line
              yAxisId="strain"
              type="monotone"
              name="Napětí"
              dataKey="strain"
              stroke="#f87171"
              strokeWidth={3}
              connectNulls
              dot={{ r: 4, fill: "#1a1a1a", stroke: "#f87171", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonotonyStrainChart;

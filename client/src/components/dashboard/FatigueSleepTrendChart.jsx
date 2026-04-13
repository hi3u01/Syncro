import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

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
            <p className="text-[13px] font-medium text-gray-300 w-14">
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

const getLocalDateString = (dateInput) => {
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const FatigueSleepTrendChart = ({ reports = [] }) => {
  const chartData = useMemo(() => {
    const days = [];
    const now = new Date();

    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);

      const displayDay = `${d.getDate()}.${d.getMonth() + 1}.`;

      days.push({
        dateStr: getLocalDateString(d),
        day: i === 0 ? "Dnes" : displayDay,
        sleep: null,
        fatigue: null,
        reports: [],
      });
    }

    // Divide reports into days
    reports.forEach((report) => {
      const actualEventDate = report.eventId?.date || report.date;
      if (!actualEventDate) return;

      const reportDateStr = getLocalDateString(actualEventDate);
      const targetDay = days.find((d) => d.dateStr === reportDateStr);

      if (targetDay) {
        targetDay.reports.push(report);
      }
    });

    days.forEach((day) => {
      if (day.reports.length > 0) {
        const totalSleep = day.reports.reduce((sum, r) => sum + r.sleep, 0);
        const totalFatigue = day.reports.reduce((sum, r) => sum + r.fatigue, 0);

        day.sleep = Number((totalSleep / day.reports.length).toFixed(1));
        day.fatigue = Number((totalFatigue / day.reports.length).toFixed(1));
      }
    });

    return days;
  }, [reports]);

  return (
    <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-6 shadow-lg w-full h-[400px] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2a303c]/50 rounded-xl">
            <TrendingUp size={20} className="text-gray-300" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight m-0">
              Spánek vs. Únava
            </h2>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Posledních 7 dní
            </p>
          </div>
        </div>

        <div className="flex gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 rounded-full bg-[#60a5fa]"></div>
            <span>Spánek</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 rounded-full bg-[#f87171]"></div>
            <span>Únava</span>
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
              dataKey="day"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />

            <YAxis
              domain={[0, 5]}
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickCount={6}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              name="Spánek"
              dataKey="sleep"
              stroke="#60a5fa"
              strokeWidth={3}
              connectNulls={true}
              dot={{ r: 4, fill: "#1a1a1a", stroke: "#60a5fa", strokeWidth: 2 }}
              activeDot={{
                r: 6,
                fill: "#60a5fa",
                stroke: "#1a1a1a",
                strokeWidth: 2,
              }}
            />

            <Line
              type="monotone"
              name="Únava"
              dataKey="fatigue"
              stroke="#f87171"
              strokeWidth={3}
              connectNulls={true}
              dot={{ r: 4, fill: "#1a1a1a", stroke: "#f87171", strokeWidth: 2 }}
              activeDot={{
                r: 6,
                fill: "#f87171",
                stroke: "#1a1a1a",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FatigueSleepTrendChart;

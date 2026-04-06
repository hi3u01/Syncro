import {
  CheckCircle2,
  Activity,
  Moon,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

// mock data
const mockData = {
  compliance: { current: 18, total: 24, percentage: 75 },
  load: { current: 450, rpe: 7.5, duration: 60 },
  sleep: { current: 3.8, trend: -0.4 },
  risk: { count: 2 },
};

const CoachKPICards = () => {
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
            {mockData.compliance.current}{" "}
            <span className="text-lg text-gray-500 font-medium">
              / {mockData.compliance.total}
            </span>
          </h3>
          <p className="text-[12px] font-bold text-emerald-400 mt-2 flex items-center gap-1">
            {mockData.compliance.percentage}% týmu vyplnilo
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
            {mockData.load.current}{" "}
            <span className="text-sm text-gray-500 font-medium tracking-normal">
              A.U.
            </span>
          </h3>
          <p className="text-[12px] font-bold text-gray-400 mt-2">
            RPE {mockData.load.rpe} × {mockData.load.duration} min
          </p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all hover:border-gray-600">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Spánek týmu
          </p>
          <div className="p-2 bg-[#2a303c]/50 rounded-xl">
            <Moon size={18} className="text-gray-300" />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight m-0">
            {mockData.sleep.current}{" "}
            <span className="text-lg text-gray-500 font-medium">/ 5</span>
          </h3>
          <p
            className={`text-[12px] font-bold mt-2 flex items-center gap-1 ${mockData.sleep.trend < 0 ? "text-red-400" : "text-emerald-400"}`}
          >
            {mockData.sleep.trend < 0 ? (
              <TrendingDown size={14} />
            ) : (
              <TrendingUp size={14} />
            )}
            {Math.abs(mockData.sleep.trend)} oproti včerejšku
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
            {mockData.risk.count}
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

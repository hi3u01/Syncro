import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut, UserCircle, ChevronLeft, ChevronRight } from "lucide-react";
import ReportForm from "../components/reportForm/ReportForm";
import CoachKPICards from "../components/dashboard/CoachKPICards";
import WeeklyLoadChart from "../components/dashboard/WeeklyLoadCharts";
import TeamWellnessRadar from "../components/dashboard/TeamWellnessRadar";
import FatigueSleepTrendChart from "../components/dashboard/FatigueSleepTrendChart";
import TeamHeatmapTable from "../components/dashboard/TeamHeatmapTable";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="w-full text-white font-sans flex justify-center pt-10 pb-20 animate-in fade-in duration-500">
      <div className="w-[95%] max-w-[800px] flex flex-col">
        <div className="flex items-center gap-5 mb-10 w-full border-b border-[#2a303c] pb-8">
          <div className="p-3 bg-[#2a303c]/40 rounded-2xl border border-[#2a303c]">
            <UserCircle size={48} className="text-gray-400" />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold m-0 p-0 tracking-tight text-white">
              {user?.firstName?.toUpperCase()} {user?.lastName?.toUpperCase()}
            </h1>

            <div className="flex items-center gap-4 mt-3">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  user?.role === "coach"
                    ? "bg-[#2a303c] text-blue-400"
                    : "bg-[#4E4619] text-[#dce1a1]"
                }`}
              >
                {user?.role === "coach" ? "Trenér" : "Hráč"}
              </span>

              {user?.role === "player" && (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-1.5 bg-transparent hover:bg-red-900/30 text-gray-500 hover:text-red-400 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all border border-transparent hover:border-red-900/50 active:scale-95"
                >
                  <LogOut size={14} /> Odhlásit se
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full">
          {user?.role === "player" ? (
            <ReportForm />
          ) : (
            <div className="w-full flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-white tracking-tight mb-2">
                Dnešní souhrn
              </h2>

              <CoachKPICards />

              <div className="flex items-center justify-between mt-6 mb-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight m-0">
                  Analytika
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentSlide(0)}
                    disabled={currentSlide === 0}
                    className={`p-1.5 rounded-lg transition-all ${
                      currentSlide === 0
                        ? "text-gray-600 cursor-not-allowed"
                        : "bg-[#2a303c] hover:bg-[#323946] text-white active:scale-95"
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex gap-1.5 mx-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-all ${currentSlide === 0 ? "bg-[#dce1a1] w-3" : "bg-gray-600"}`}
                    />
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-all ${currentSlide === 1 ? "bg-[#dce1a1] w-3" : "bg-gray-600"}`}
                    />
                  </div>

                  <button
                    onClick={() => setCurrentSlide(1)}
                    disabled={currentSlide === 1}
                    className={`p-1.5 rounded-lg transition-all ${
                      currentSlide === 1
                        ? "text-gray-600 cursor-not-allowed"
                        : "bg-[#2a303c] hover:bg-[#323946] text-white active:scale-95"
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="overflow-hidden w-full relative pb-4">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  <div className="min-w-full grid grid-cols-1 lg:grid-cols-2 gap-6 pr-4">
                    <WeeklyLoadChart />
                    <TeamWellnessRadar />
                  </div>

                  <div className="min-w-full">
                    <FatigueSleepTrendChart />
                  </div>
                </div>
              </div>
              <TeamHeatmapTable />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

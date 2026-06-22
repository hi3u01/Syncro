import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReportForm from "../components/reportForm/ReportForm";
import JoinTeamModal from "../components/teams/JoinTeamModal";
import CoachKPICards from "../components/dashboard/CoachKPICards";
import WeeklyLoadChart from "../components/dashboard/WeeklyLoadCharts";
import TeamWellnessRadar from "../components/dashboard/TeamWellnessRadar";
import FatigueSleepTrendChart from "../components/dashboard/FatigueSleepTrendChart";
import TeamHeatmapTable from "../components/dashboard/TeamHeatmapTable";
import PageHeader from "../components/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Coach: load the list of teams to drive the selector.
  useEffect(() => {
    if (user?.role !== "coach") return;
    const fetchTeams = async () => {
      try {
        const { data } = await API.get("/teams");
        setTeams(data);
        if (data.length > 0) setSelectedTeamId(data[0]._id);
        else setIsLoading(false);
      } catch (error) {
        console.error("Chyba při načítání týmů:", error);
        setIsLoading(false);
      }
    };
    fetchTeams();
  }, [user]);

  // Coach: load the aggregated dashboard for the selected team.
  useEffect(() => {
    if (user?.role !== "coach" || !selectedTeamId) return;
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const { data } = await API.get(`/teams/${selectedTeamId}/dashboard`);
        setDashboard(data);
      } catch (error) {
        console.error("Chyba při načítání dat:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, [selectedTeamId, user]);

  if (user?.role === "player") {
    return (
      <div className="w-full flex justify-center pt-6 pb-20 animate-in fade-in duration-500">
        <div className="w-[95%] max-w-[640px]">
          <JoinTeamModal show={!user.teamId} />
          <ReportForm />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-white font-sans flex justify-center pt-6 pb-20 animate-in fade-in duration-500">
      <div className="w-[95%] max-w-[1100px] flex flex-col">
        <PageHeader title="Přehled týmu" subtitle="Týdenní souhrn">
          {teams.length > 0 && (
            <div className="w-full sm:w-[220px]">
              <Select
                value={selectedTeamId}
                onValueChange={(value) => setSelectedTeamId(value)}
              >
                <SelectTrigger className="bg-[#2a303c] w-full text-white h-10 rounded-xl px-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-bold text-[12px] uppercase tracking-widest shadow-sm">
                  <SelectValue placeholder="Vyberte tým" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="bg-[#2a303c] border border-[#323946] shadow-xl rounded-xl overflow-hidden"
                >
                  {teams.map((team) => (
                    <SelectItem
                      key={team._id}
                      value={team._id}
                      className="h-10 pl-4 pr-8 text-[12px] font-bold uppercase tracking-widest text-gray-300 focus:bg-[#3a4252] focus:text-white cursor-pointer rounded-none"
                    >
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </PageHeader>

        {teams.length === 0 && !isLoading ? (
          <div className="text-center py-20 px-5 bg-[#1a1a1a]/40 border-2 border-dashed border-[#2a303c] rounded-3xl text-gray-400">
            Zatím nemáte žádný tým. Vytvořte ho v sekci{" "}
            <span className="text-white font-bold">Týmy</span>.
          </div>
        ) : (
          <div className="w-full flex flex-col gap-6">
            <CoachKPICards
              kpis={dashboard?.kpis}
              totalPlayers={dashboard?.totalPlayers || 0}
            />

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
                  <WeeklyLoadChart data={dashboard?.weeklyLoad} />
                  <TeamWellnessRadar data={dashboard?.wellnessRadar} />
                </div>
                <div className="min-w-full">
                  <FatigueSleepTrendChart data={dashboard?.fatigueSleepTrend} />
                </div>
              </div>
            </div>

            <TeamHeatmapTable rows={dashboard?.heatmap} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

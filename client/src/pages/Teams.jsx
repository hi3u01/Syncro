import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { Users, AlertCircle, Plus } from "lucide-react";
import CreateTeamForm from "../components/teams/CreateTeamForm";
import TeamCard from "../components/teams/TeamCard";
import { Button } from "../components/ui/button";

const Teams = () => {
  const { user } = useContext(AuthContext);

  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user?.role === "coach") {
      fetchTeamData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchTeamData = async () => {
    try {
      const teamRes = await API.get("/teams");
      const teamsData = Array.isArray(teamRes.data)
        ? teamRes.data
        : [teamRes.data];
      setTeams(teamsData);

      const playersRes = await API.get("/teams/players");
      setPlayers(playersRes.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError("Nepodařilo se načíst data týmu.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">
        Načítání...
      </div>
    );

  if (user?.role !== "coach") {
    return (
      <div className="p-8 font-sans max-w-6xl mx-auto">
        <div className="text-gray-400 bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a303c] text-sm font-medium">
          Jsi zaregistrován jako hráč. Správu týmu provádí tvůj trenér.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 font-sans max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8 border-b border-[#2a303c] pb-6">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white m-0 tracking-tight">
          <div className="p-2 bg-[#2a303c]/50 rounded-xl">
            <Users className="text-gray-300" size={24} />
          </div>
          Správa Týmů
        </h1>

        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#4E4619] hover:bg-[#4b4e26] text-white rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center gap-2 h-10 px-5 transition-all shadow-lg active:scale-95"
        >
          <Plus size={16} /> Nový tým
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-center gap-3 text-destructive mb-6">
          <AlertCircle size={18} />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-[450px]"
            onClick={(e) => e.stopPropagation()}
          >
            <CreateTeamForm
              onSuccess={(newTeam) => {
                setTeams((prevTeams) => [...prevTeams, newTeam]);
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {teams.length === 0 && (
        <div className="text-center py-20 px-5 bg-[#1a1a1a]/40 border-2 border-dashed border-[#2a303c] rounded-3xl flex flex-col items-center">
          <div className="bg-[#2a303c]/50 p-4 rounded-2xl mb-5">
            <Users size={40} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
            Zatím nemáte žádný tým
          </h3>
          <p className="max-w-sm mx-auto text-sm text-gray-400 font-medium leading-relaxed">
            Vytvořte svůj první tým, abyste mohli pozvat hráče přes zvací kód a
            začít sledovat jejich výsledky.
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="mt-6 bg-[#2a303c] hover:bg-[#323946] text-white rounded-xl font-bold uppercase tracking-widest text-[11px] h-10 px-6 transition-all"
          >
            <Plus size={16} className="mr-2" /> Vytvořit první tým
          </Button>
        </div>
      )}

      {teams.length > 0 && (
        <div className="grid gap-6">
          {teams.map((team) => {
            const teamPlayers = players.filter((p) => p.teamId === team._id);
            return (
              <TeamCard key={team._id} team={team} players={teamPlayers} />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Teams;

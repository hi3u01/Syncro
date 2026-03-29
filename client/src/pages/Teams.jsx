import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { Users, AlertCircle, Plus } from "lucide-react";
import CreateTeamForm from "../components/CreateTeamForm";
import TeamCard from "../components/TeamCard";

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
      <div className="p-5 text-center text-gray-600 animate-pulse">
        Načítání...
      </div>
    );

  if (user?.role !== "coach") {
    return (
      <div className="p-5 font-sans">
        <p className="text-gray-700 bg-gray-100 p-4 rounded-lg border border-gray-200">
          Jsi zaregistrován jako hráč. Správu týmu provádí tvůj trenér.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 font-sans max-w-6xl mx-auto">
      {/* Header část */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold text-gray-800 m-0">
          <Users className="text-blue-600" /> Správa Týmů
        </h1>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors shadow-sm"
          >
            <Plus size={18} /> Nový tým
          </button>
        )}
      </div>

      {/* Chybová hláška */}
      {error && (
        <div className="flex items-center gap-2.5 p-3 mb-5 bg-red-100 border border-red-200 text-red-700 rounded-md">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Formulář pro vytvoření týmu */}
      {showForm && (
        <div className="mb-8">
          <CreateTeamForm
            onSuccess={(newTeam) => {
              setTeams((prevTeams) => [...prevTeams, newTeam]);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Empty State (když nejsou týmy) */}
      {teams.length === 0 && !showForm && (
        <div className="text-center py-12 px-5 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
          <Users size={48} className="mx-auto mb-3 opacity-30" />
          <h3 className="text-lg font-semibold text-gray-700">
            Zatím nemáte žádný tým
          </h3>
          <p className="max-w-xs mx-auto mt-2">
            Vytvořte svůj první tým, abyste mohli pozvat hráče a sledovat jejich
            výsledky.
          </p>
        </div>
      )}

      {/* Seznam týmů */}
      {teams.length > 0 && (
        <div className="grid gap-4">
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

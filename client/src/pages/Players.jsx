import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import {
  UserRound,
  ChevronRight,
  Dumbbell,
  BatteryLow,
  Brain,
} from "lucide-react";
import PageHeader from "../components/PageHeader";

const riskColor = (value) => {
  if (value === null || value === undefined) return "text-gray-600";
  if (value >= 4) return "text-red-400";
  if (value === 3) return "text-yellow-500";
  return "text-emerald-400";
};

const Stat = ({ icon: Icon, label, value, valueClass = "text-white" }) => (
  <div className="flex-1 flex flex-col items-center gap-1 py-2">
    <Icon size={15} className="text-gray-500" />
    <span className={`text-[15px] font-extrabold ${valueClass}`}>
      {value === null || value === undefined ? "–" : value}
    </span>
    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
      {label}
    </span>
  </div>
);

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data } = await API.get("/users?role=player");
        setPlayers(data);
      } catch (error) {
        console.error("Chyba při načítání hráčů:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500">
      <PageHeader
        title="Hráči"
        subtitle="Detail a analytika jednotlivců"
        icon={UserRound}
      />

      {loading ? (
        <p className="text-center text-gray-500 font-medium py-10">
          Načítání...
        </p>
      ) : players.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-[#1a1a1a] border border-dashed border-[#2a303c] rounded-2xl">
          Zatím nemáte žádné hráče. Pozvěte je zvacím kódem v sekci Týmy.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player) => (
            <Link
              key={player._id}
              to={`/players/${player._id}`}
              className="group bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-5 shadow-lg flex flex-col hover:border-gray-600 transition-all no-underline"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#2a303c]/50 rounded-xl">
                    <UserRound size={24} className="text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold m-0">
                      {player.firstName} {player.lastName}
                    </h3>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                      Hráč
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-gray-600 group-hover:text-white transition-colors"
                />
              </div>

              <div className="flex items-stretch mt-4 pt-3 border-t border-[#2a303c] divide-x divide-[#2a303c]">
                <Stat
                  icon={Dumbbell}
                  label="Nálož"
                  value={player.metrics?.trainingLoad}
                />
                <Stat
                  icon={BatteryLow}
                  label="Únava"
                  value={player.metrics?.fatigue}
                  valueClass={riskColor(player.metrics?.fatigue)}
                />
                <Stat
                  icon={Brain}
                  label="Stres"
                  value={player.metrics?.stress}
                  valueClass={riskColor(player.metrics?.stress)}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Players;

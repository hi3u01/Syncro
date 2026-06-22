import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { UserRound, ChevronRight } from "lucide-react";
import PageHeader from "../components/PageHeader";

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
              className="group bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-5 shadow-lg flex items-center justify-between hover:border-gray-600 transition-all no-underline"
            >
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Players;

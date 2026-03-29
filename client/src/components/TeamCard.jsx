import { Copy, Users } from "lucide-react";

const TeamCard = ({ team, players }) => {
  const copyToClipboard = () => {
    if (team?.joinCode) {
      navigator.clipboard.writeText(team.joinCode);
      alert(`Kód ${team.joinCode} byl zkopírován!`);
    }
  };

  return (
    <div className="mt-5 mb-10 bg-[#111827] rounded-xl border border-gray-800 overflow-hidden shadow-lg">
      {/* Horní část karty s názvem a kódem */}
      <div className="bg-[#1e2530] p-5 flex justify-between items-center border-b border-gray-800">
        <div>
          <h2 className="text-xl font-bold text-white m-0">{team.name}</h2>
          <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
            <Users size={14} /> Aktivní tým
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
            Zvací kód
          </p>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-mono font-bold tracking-widest text-emerald-400">
              {team.joinCode}
            </span>
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-all"
              title="Kopírovat kód"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Seznam hráčů */}
      <div className="p-5">
        <h3 className="text-gray-300 font-semibold mb-4 text-sm uppercase tracking-wide">
          Hráči v týmu ({players.length})
        </h3>

        {players.length === 0 ? (
          <div className="py-6 text-center bg-black/20 rounded-lg border border-dashed border-gray-700">
            <p className="text-gray-500 italic text-sm">
              Zatím se nepřidal žádný hráč. Pošlete jim kód!
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {players.map((player) => (
              <li
                key={player._id}
                className="py-3 flex justify-between items-center group transition-all"
              >
                <span className="text-gray-200 font-medium group-hover:text-emerald-400 transition-colors">
                  {player.firstName} {player.lastName}
                </span>
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                  Hráč
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeamCard;

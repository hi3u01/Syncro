import { Copy, Users, UserMinus } from "lucide-react";

const TeamCard = ({ team, players, onRemovePlayer }) => {
  const copyToClipboard = () => {
    if (team?.joinCode) {
      navigator.clipboard.writeText(team.joinCode);
      alert(`Kód ${team.joinCode} byl zkopírován!`);
    }
  };

  return (
    <div className="mt-5 mb-10 bg-[#1a1a1a] rounded-2xl border border-[#2a303c] overflow-hidden shadow-lg">
      <div className="bg-[#2a303c]/30 p-6 flex justify-between items-center border-b border-[#2a303c]">
        <div>
          <h2 className="text-2xl font-extrabold text-white m-0 tracking-tight">
            {team.name}
          </h2>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Users size={14} /> Aktivní tým
          </p>
        </div>

        <div className="text-right">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Zvací kód
          </p>
          <div className="flex items-center gap-2 bg-[#1a1a1a] pl-4 pr-2 py-1.5 rounded-xl border border-[#2a303c]">
            <span className="text-xl font-mono font-bold tracking-widest text-white ">
              {team.joinCode}
            </span>
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#2a303c] rounded-lg transition-all"
              title="Kopírovat kód"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-gray-400 font-bold mb-4 text-[12px] uppercase tracking-widest">
          Hráči v týmu ({players.length})
        </h3>

        {players.length === 0 ? (
          <div className="py-8 text-center bg-[#2a303c]/20 rounded-xl border border-dashed border-[#2a303c]">
            <p className="text-gray-500 font-medium text-sm">
              Zatím se nepřidal žádný hráč. Pošlete jim kód!
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#2a303c]">
            {players.map((player) => (
              <li
                key={player._id}
                className="py-4 flex justify-between items-center group transition-all"
              >
                <span className="text-gray-200 font-bold group-hover:text-white transition-colors">
                  {player.firstName} {player.lastName}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-[#2a303c] text-gray-400 px-3 py-1 rounded-full">
                    Hráč
                  </span>
                  {onRemovePlayer && (
                    <button
                      onClick={() => onRemovePlayer(team._id, player._id)}
                      title="Odebrat z týmu"
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                    >
                      <UserMinus size={16} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeamCard;

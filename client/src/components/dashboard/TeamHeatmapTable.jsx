import { MessageSquare, Activity, XCircle } from "lucide-react";

const getWellnessColor = (value, inverse = false) => {
  if (value === "-" || value === null || value === undefined)
    return "bg-[#1a1a1a] text-gray-600 border-[#2a303c]";

  if (inverse) {
    if (value >= 4) return "bg-red-900/30 text-red-400 border-red-900/50";
    if (value === 3)
      return "bg-yellow-900/20 text-yellow-500 border-yellow-900/30";
    return "bg-emerald-900/20 text-emerald-400 border-emerald-900/30";
  }
  if (value <= 2) return "bg-red-900/30 text-red-400 border-red-900/50";
  if (value === 3) return "bg-yellow-900/20 text-yellow-500 border-yellow-900/30";
  return "bg-emerald-900/20 text-emerald-400 border-emerald-900/30";
};

const getRpeColor = (value) => {
  if (value === "-" || value === null || value === undefined)
    return "bg-[#1a1a1a] text-gray-600 border-[#2a303c]";
  if (value >= 8) return "bg-red-900/30 text-red-400 border-red-900/50";
  if (value >= 6) return "bg-yellow-900/20 text-yellow-500 border-yellow-900/30";
  return "bg-emerald-900/20 text-emerald-400 border-emerald-900/30";
};

const cell = (value) => (value === null || value === undefined ? "-" : value);

const TeamHeatmapTable = ({ rows = [] }) => {
  const tableData = (rows || []).map((r) => ({
    id: r.id,
    name: r.name,
    hasReport: r.hasReport,
    rpe: cell(r.rpe),
    sleep: cell(r.wellness?.sleep),
    fatigue: cell(r.wellness?.fatigue),
    soreness: cell(r.wellness?.soreness),
    stress: cell(r.wellness?.stress),
    mood: cell(r.wellness?.mood),
    note: r.note || "",
  }));

  return (
    <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl shadow-lg w-full overflow-hidden mt-6 flex flex-col">
      <div className="p-6 border-b border-[#2a303c] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2a303c]/50 rounded-xl">
            <Activity size={20} className="text-gray-300" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight m-0">
              Detailní přehled hráčů
            </h2>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Poslední dotazník
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {tableData.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-sm font-medium uppercase tracking-widest">
            V tomto týmu zatím nejsou žádní hráči.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2a303c]/30 border-b border-[#2a303c]">
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  Hráč
                </th>
                {["RPE", "Spánek", "Únava", "Bolest", "Stres", "Nálada"].map(
                  (h) => (
                    <th
                      key={h}
                      className="p-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center"
                    >
                      {h}
                    </th>
                  ),
                )}
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">
                  Poznámka
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a303c]">
              {tableData.map((player) => (
                <tr
                  key={player.id}
                  className="hover:bg-[#2a303c]/20 transition-colors"
                >
                  <td className="p-4 font-bold text-white whitespace-nowrap flex items-center gap-2">
                    {!player.hasReport && (
                      <XCircle size={14} className="text-gray-600" />
                    )}
                    <span
                      className={
                        player.hasReport ? "text-white" : "text-gray-400"
                      }
                    >
                      {player.name}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`inline-block w-8 text-center px-2 py-1 rounded-md text-[13px] font-extrabold border ${getRpeColor(player.rpe)}`}
                    >
                      {player.rpe}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block w-8 text-center px-2 py-1 rounded-md text-[13px] font-extrabold border ${getWellnessColor(player.sleep, false)}`}
                    >
                      {player.sleep}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block w-8 text-center px-2 py-1 rounded-md text-[13px] font-extrabold border ${getWellnessColor(player.fatigue, true)}`}
                    >
                      {player.fatigue}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block w-8 text-center px-2 py-1 rounded-md text-[13px] font-extrabold border ${getWellnessColor(player.soreness, true)}`}
                    >
                      {player.soreness}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block w-8 text-center px-2 py-1 rounded-md text-[13px] font-extrabold border ${getWellnessColor(player.stress, true)}`}
                    >
                      {player.stress}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block w-8 text-center px-2 py-1 rounded-md text-[13px] font-extrabold border ${getWellnessColor(player.mood, false)}`}
                    >
                      {player.mood}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    {player.note ? (
                      <div
                        className="flex items-center justify-end gap-2 text-red-400 cursor-help"
                        title={player.note}
                      >
                        <span className="text-[11px] max-w-[120px] font-medium truncate">
                          {player.note}
                        </span>
                        <MessageSquare size={16} />
                      </div>
                    ) : (
                      <span className="text-gray-600 text-[20px]">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TeamHeatmapTable;

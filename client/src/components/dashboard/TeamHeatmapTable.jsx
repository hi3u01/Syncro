import { useState } from "react";
import { MessageSquare, Activity } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

// Mock data
const mockTeams = [
  { id: "team_A", name: "A-Tým (Muži)" },
  { id: "team_U19", name: "Junioři U19" },
];

const mockPlayers = [
  {
    id: 1,
    teamId: "team_A",
    name: "Jan Novák",
    rpe: 8,
    duration: 90,
    sleep: 2,
    fatigue: 4,
    soreness: 5,
    stress: 3,
    mood: 2,
    note: "Tahá mě levý hamstring, potřebuju fyzio.",
  },
  {
    id: 2,
    teamId: "team_A",
    name: "Petr Svoboda",
    rpe: 6,
    duration: 90,
    sleep: 4,
    fatigue: 2,
    soreness: 3,
    stress: 2,
    mood: 4,
    note: "",
  },
  {
    id: 3,
    teamId: "team_A",
    name: "Tomáš Dvořák",
    rpe: 4,
    duration: 60,
    sleep: 5,
    fatigue: 1,
    soreness: 1,
    stress: 1,
    mood: 5,
    note: "",
  },
  // U19
  {
    id: 4,
    teamId: "team_U19",
    name: "Lukáš Černý",
    rpe: 9,
    duration: 90,
    sleep: 3,
    fatigue: 5,
    soreness: 4,
    stress: 4,
    mood: 3,
    note: "Hrozně těžký trénink včera.",
  },
  {
    id: 5,
    teamId: "team_U19",
    name: "Martin Kříž",
    rpe: 5,
    duration: 60,
    sleep: 4,
    fatigue: 3,
    soreness: 2,
    stress: 2,
    mood: 4,
    note: "",
  },
  {
    id: 6,
    teamId: "team_U19",
    name: "Jakub Veselý",
    rpe: 7,
    duration: 90,
    sleep: 3,
    fatigue: 3,
    soreness: 3,
    stress: 2,
    mood: 3,
    note: "",
  },
];

const getWellnessColor = (value, inverse = false) => {
  if (inverse) {
    if (value >= 4) return "bg-red-900/30 text-red-400 border-red-900/50";
    if (value === 3)
      return "bg-yellow-900/20 text-yellow-500 border-yellow-900/30";
    return "bg-emerald-900/20 text-emerald-400 border-emerald-900/30";
  } else {
    if (value <= 2) return "bg-red-900/30 text-red-400 border-red-900/50";
    if (value === 3)
      return "bg-yellow-900/20 text-yellow-500 border-yellow-900/30";
    return "bg-emerald-900/20 text-emerald-400 border-emerald-900/30";
  }
};

const getRpeColor = (value) => {
  if (value >= 8) return "bg-red-900/30 text-red-400 border-red-900/50";
  if (value >= 6)
    return "bg-yellow-900/20 text-yellow-500 border-yellow-900/30";
  return "bg-emerald-900/20 text-emerald-400 border-emerald-900/30";
};

const TeamHeatmapTable = () => {
  const [selectedTeamId, setSelectedTeamId] = useState(mockTeams[0].id);
  const filteredPlayers = mockPlayers.filter(
    (player) => player.teamId === selectedTeamId,
  );

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
              Dnešní data
            </p>
          </div>
        </div>

        <div className="w-[200px]">
          <Select
            value={selectedTeamId}
            onValueChange={(value) => setSelectedTeamId(value)}
          >
            <SelectTrigger className="bg-[#2a303c] w-full text-white h-10 rounded-xl px-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-bold text-[12px] uppercase tracking-widest shadow-sm">
              <SelectValue placeholder="Vyberte tým" />
            </SelectTrigger>

            <SelectContent
              position="popper"
              className="bg-[#2a303c] border border-[#323946] shadow-xl rounded-xl overflow-hidden w-[200px]"
            >
              {mockTeams.map((team) => (
                <SelectItem
                  key={team.id}
                  value={team.id}
                  className="h-10 pl-4 pr-8 text-[12px] font-bold uppercase tracking-widest text-gray-300 focus:bg-[#3a4252] focus:text-white cursor-pointer rounded-none"
                >
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredPlayers.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-sm font-medium uppercase tracking-widest">
            V tomto týmu zatím nejsou žádná data.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2a303c]/30 border-b border-[#2a303c]">
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  Hráč
                </th>
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
                  RPE
                </th>
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
                  Spánek
                </th>
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
                  Únava
                </th>
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
                  Bolest
                </th>
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
                  Stres
                </th>
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
                  Nálada
                </th>
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">
                  Poznámka
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a303c]">
              {filteredPlayers.map((player) => (
                <tr
                  key={player.id}
                  className="hover:bg-[#2a303c]/20 transition-colors"
                >
                  <td className="p-4 font-bold text-white whitespace-nowrap">
                    {player.name}
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
                        className="flex items-center justify-end gap-2 text-red-400 group cursor-help"
                        title={player.note}
                      >
                        <span className="text-[11px] max-w-[120px]  font-medium">
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

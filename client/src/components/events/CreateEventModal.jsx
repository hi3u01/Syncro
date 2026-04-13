import { useState, useEffect } from "react";
import { X, CalendarPlus, Edit2 } from "lucide-react";
import API from "../../services/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const eventTypes = ["Trénink", "Regenerace", "Zápas", "Volno"];

const CreateEventModal = ({
  isOpen,
  onClose,
  selectedTeamName,
  onEventCreated,
  defaultTeamId,
  editData,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("Trénink");
  const [title, setTitle] = useState("");
  const [plannedDuration, setPlannedDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setSelectedTeamId(editData.teamId);
        setDate(new Date(editData.date).toISOString().split("T")[0]);
        setType(editData.type);
        setTitle(editData.title || "");
        setPlannedDuration(editData.plannedDuration || "");
      } else {
        setSelectedTeamId(defaultTeamId);
        setDate(new Date().toISOString().split("T")[0]);
        setType("Trénink");
        setTitle("");
        setPlannedDuration("");
      }
      setError("");
    }
  }, [isOpen, defaultTeamId, editData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        teamId: selectedTeamId,
        date,
        type,
        title,
        plannedDuration: plannedDuration ? Number(plannedDuration) : null,
      };

      if (editData) {
        await API.put(`/events/${editData._id}`, payload);
      } else {
        await API.post("/events", payload);
      }

      onEventCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Něco se pokazilo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-[#2a303c]">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${editData ? "bg-blue-900/30" : "bg-[#4E4619]"}`}
            >
              {editData ? (
                <Edit2 size={20} className="text-blue-400" />
              ) : (
                <CalendarPlus size={20} className="text-[#dce1a1]" />
              )}
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight m-0">
              {editData ? "Upravit Událost" : "Nová Událost"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-900/50 text-red-400 text-sm font-bold rounded-lg text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-gray-400 px-2 uppercase tracking-widest">
              Tým
            </label>
            <div className="bg-[#2a303c]/50 text-white h-11 rounded-xl px-4 flex items-center border border-[#323946] opacity-80 shadow-inner group transition-all">
              <span className="text-[13px] font-bold text-gray-300">
                {selectedTeamName}
              </span>
              <input type="hidden" value={selectedTeamId} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-gray-400 px-2 uppercase tracking-widest">
                Datum
              </label>
              <Input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-[#2a303c] text-white h-11 rounded-xl px-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-gray-400 px-2 uppercase tracking-widest">
                Typ
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-[#2a303c] w-full text-white !h-11 rounded-xl px-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-bold text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2a303c] border border-[#323946] shadow-xl rounded-xl overflow-hidden">
                  {eventTypes.map((t) => (
                    <SelectItem
                      key={t}
                      value={t}
                      className="h-10 pl-4 pr-8 text-[12px] font-bold uppercase tracking-widest text-gray-300 focus:bg-[#3a4252] focus:text-white cursor-pointer rounded-none"
                    >
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-gray-400 px-2 uppercase tracking-widest">
              Název (nepovinné)
            </label>
            <Input
              type="text"
              placeholder="Např. Taktika a presink"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#2a303c] text-white h-11 rounded-xl px-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-gray-400 px-2 uppercase tracking-widest">
              Plánovaná délka (minuty)
            </label>
            <Input
              type="number"
              placeholder="Např. 90"
              value={plannedDuration}
              onChange={(e) => setPlannedDuration(e.target.value)}
              className="bg-[#2a303c] text-white h-11 rounded-xl px-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36]"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !selectedTeamId}
            className={`w-full hover:bg-opacity-80 disabled:opacity-50 h-12 rounded-xl font-bold text-[15px] shadow-lg transition-all active:scale-95 mt-2 ${editData ? "bg-blue-600 text-white" : "bg-[#4E4619]"}`}
          >
            {isLoading
              ? "Ukládám..."
              : editData
                ? "ULOŽIT ZMĚNY"
                : "VYTVOŘIT UDÁLOST"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;

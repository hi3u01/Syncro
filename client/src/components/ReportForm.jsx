import { useState } from "react";
import API from "../services/api";
import { Activity, Brain, Moon, Battery, Smile } from "lucide-react";

const ReportForm = ({ onReportSaved }) => {
  // Stavy pro všechny položky modelu
  const [duration, setDuration] = useState("");
  const [rpe, setRpe] = useState(5);
  const [fatigue, setFatigue] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [soreness, setSoreness] = useState(3);
  const [stress, setStress] = useState(3);
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reports", {
        duration: Number(duration),
        rpe,
        fatigue,
        sleep,
        soreness,
        stress,
        mood,
        note,
      });

      setMessage("Report byl úspěšně uložen! Dobrá práce.");
      setDuration("");
      setNote("");

      if (onReportSaved) onReportSaved();
    } catch (error) {
      setMessage(
        "Chyba při ukládání: " + (error.response?.data?.error || error.message),
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 max-w-[500px] bg-black p-6 rounded-lg shadow-xl text-white"
    >
      <h3 className="text-xl font-bold border-b border-gray-800 pb-2">
        Potréninkový report
      </h3>

      {message && (
        <div
          className={`p-3 rounded text-sm font-medium ${
            message.includes("Chyba")
              ? "bg-red-900/30 text-red-400 border border-red-800"
              : "bg-emerald-900/30 text-emerald-400 border border-emerald-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* Délka tréninku */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-300 uppercase tracking-wide">
          Délka tréninku (minuty):
        </label>
        <input
          type="number"
          required
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Např. 90"
          className="w-full bg-[#1e2530] border-none p-2.5 text-white rounded focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
        />
      </div>

      {/* RPE Slider */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-300 uppercase tracking-wide flex justify-between">
          <span>RPE - Subjektivní zátěž (1-10):</span>
          <span className="text-emerald-400 font-mono text-lg">{rpe}</span>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={rpe}
          onChange={(e) => setRpe(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
      </div>

      {/* Grid pro 1-5 parametry */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 flex items-center gap-2">
            <Battery size={14} className="text-yellow-500" /> Únava:{" "}
            <span className="text-white">{fatigue}</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={fatigue}
            onChange={(e) => setFatigue(Number(e.target.value))}
            className="accent-emerald-500 cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 flex items-center gap-2">
            <Moon size={14} className="text-blue-400" /> Spánek:{" "}
            <span className="text-white">{sleep}</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={sleep}
            onChange={(e) => setSleep(Number(e.target.value))}
            className="accent-emerald-500 cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 flex items-center gap-2">
            <Activity size={14} className="text-red-400" /> Svaly:{" "}
            <span className="text-white">{soreness}</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={soreness}
            onChange={(e) => setSoreness(Number(e.target.value))}
            className="accent-emerald-500 cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 flex items-center gap-2">
            <Brain size={14} className="text-purple-400" /> Stres:{" "}
            <span className="text-white">{stress}</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
            className="accent-emerald-500 cursor-pointer"
          />
        </div>
        <div className="col-span-2 flex flex-col gap-1.5 pt-2">
          <label className="text-xs font-bold text-gray-400 flex items-center gap-2">
            <Smile size={14} className="text-emerald-400" /> Nálada:{" "}
            <span className="text-white">{mood}</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Poznámka */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-300 uppercase tracking-wide">
          Poznámka pro trenéra:
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength="500"
          placeholder="Dnes se mi běželo dobře, ale ke konci mě tahalo lýtko..."
          className="w-full bg-[#1e2530] border-none p-2.5 text-white rounded min-h-[80px] focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        className="py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98]"
      >
        Odeslat report
      </button>
    </form>
  );
};

export default ReportForm;

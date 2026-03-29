import { useState } from "react";
import API from "../services/api";

const ReportForm = ({ onReportSaved }) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [rpe, setRpe] = useState("");
  const [duration, setDuration] = useState("");
  const [fatigue, setFatigue] = useState("");
  const [sleep, setSleep] = useState("");
  const [soreness, setSoreness] = useState("");
  const [stress, setStress] = useState("");
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reports", {
        duration: Number(duration),
        rpe: Number(rpe),
        fatigue: Number(fatigue),
        sleep: Number(sleep),
        soreness: Number(soreness),
        stress: Number(stress),
        mood: Number(mood),
        note,
      });

      setMessage("Report byl úspěšně uložen!");
      setRpe("");
      setDuration("");
      setFatigue("");
      setSleep("");
      setSoreness("");
      setStress("");
      setMood("");
      setNote("");

      if (onReportSaved) onReportSaved();
    } catch (error) {
      setMessage(
        "Chyba při ukládání: " + (error.response?.data?.error || error.message),
      );
    }
  };

  return (
    <div className="w-[95%] md:w-3/4 max-w-[1200px] mx-auto  overflow-hidden shadow-2xl text-white font-sans pb-8 mt-4 md:mt-8">
      <div className="py-6 text-center">
        <h1 className="text-[#5d5225] text-4xl font-extrabold tracking-wider uppercase m-0 text-white">
          SYNCO
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-12 flex flex-col gap-8">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-2 text-center">
          Dotazník pro hráče/hráčky
        </h2>

        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-bold text-center ${
              message.includes("Chyba")
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {message}
          </div>
        )}

        {/* Datum */}
        <div className="flex flex-col gap-2">
          <label className="text-[16px] font-semibold text-gray-200">
            Datum
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white text-black rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-[#5d5225] font-medium text-lg"
          />
        </div>

        {/* --- SEKCE: Fyzická zátěž --- */}
        <div className="mt-2">
          <h3 className="text-xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-2">
            Fyzická zátěž
          </h3>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-semibold text-gray-200 leading-snug">
                1. Ohodnoť, jak se cítíš po tréninku/zápase
              </label>
              <span className="text-[13px] italic text-gray-400 mb-1">
                (1 = nejlehčí, 10 = nejtěžší)
              </span>
              <input
                type="number"
                min="1"
                max="10"
                required
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                className="w-full bg-white text-black rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-[#5d5225] font-medium text-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-semibold text-gray-200 mb-1">
                2. Jak dlouho trvala aktivita? (v minutách)
              </label>
              <input
                type="number"
                min="1"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-white text-black rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-[#5d5225] font-medium text-lg"
              />
            </div>
          </div>
        </div>

        {/* --- SEKCE: Psychická zátěž --- */}
        <div className="mt-4">
          <h3 className="text-xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-2">
            Psychická zátěž
          </h3>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-semibold text-gray-200 leading-snug">
                1. Jak se dnes cítíš po fyzické stránce?
              </label>
              <span className="text-[13px] italic text-gray-400 mb-1">
                (1 = jsem hodně unavený/á, 5 = jsem plný/á energie)
              </span>
              <input
                type="number"
                min="1"
                max="5"
                required
                value={fatigue}
                onChange={(e) => setFatigue(e.target.value)}
                className="w-full bg-white text-black rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-[#5d5225] font-medium text-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-semibold text-gray-200 leading-snug">
                2. Jak dobře ses dneska vyspal/a?
              </label>
              <span className="text-[13px] italic text-gray-400 mb-1">
                (1 = nejhorší, 5 = nejlepší)
              </span>
              <input
                type="number"
                min="1"
                max="5"
                required
                value={sleep}
                onChange={(e) => setSleep(e.target.value)}
                className="w-full bg-white text-black rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-[#5d5225] font-medium text-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-semibold text-gray-200 leading-snug">
                3. Cítíš nějakou svalovou bolest nebo ztuhlost?
              </label>
              <span className="text-[13px] italic text-gray-400 mb-1">
                (1 = velmi silná bolest, 5 = žádná bolest)
              </span>
              <input
                type="number"
                min="1"
                max="5"
                required
                value={soreness}
                onChange={(e) => setSoreness(e.target.value)}
                className="w-full bg-white text-black rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-[#5d5225] font-medium text-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-semibold text-gray-200 leading-snug">
                4. Míra stresu mimo sport (škola, práce, domov)?
              </label>
              <span className="text-[13px] italic text-gray-400 mb-1">
                (1 = velmi vysoký stres, 5 = úplně v klidu)
              </span>
              <input
                type="number"
                min="1"
                max="5"
                required
                value={stress}
                onChange={(e) => setStress(e.target.value)}
                className="w-full bg-white text-black rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-[#5d5225] font-medium text-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-semibold text-gray-200 leading-snug mb-1">
                5. Jaká byla tvoje nálada během dne?
              </label>
              <div className="relative">
                <select
                  required
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-white text-black rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-[#5d5225] font-medium text-lg appearance-none cursor-pointer"
                >
                  <option value="" disabled></option>
                  <option value="1">😫 1 - Pod psa</option>
                  <option value="2">🙁 2 - Nic moc</option>
                  <option value="3">😐 3 - Normálka</option>
                  <option value="4">🙂 4 - Dobrý</option>
                  <option value="5">🤩 5 - Skvělá</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-gray-500">
                  <svg
                    className="fill-current h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[16px] font-semibold text-gray-200 leading-snug mb-1">
                Chtěl/a bych něco vzkázat trenérovi
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-white text-black rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-[#5d5225] font-medium text-lg"
              />
            </div>
          </div>
        </div>

        {/* Odesílací tlačítko */}
        <button
          type="submit"
          className="mt-6 w-full py-5 bg-[#5d5225] hover:bg-[#4a411d] text-white rounded-full font-bold text-xl tracking-wide transition-colors active:scale-[0.98] shadow-lg"
        >
          Odeslat
        </button>
      </form>
    </div>
  );
};

export default ReportForm;

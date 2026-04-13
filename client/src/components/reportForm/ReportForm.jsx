import { useState, useEffect } from "react";
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

const ReportForm = ({ onReportSaved }) => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [rpe, setRpe] = useState("");
  const [duration, setDuration] = useState("");
  const [fatigue, setFatigue] = useState("");
  const [sleep, setSleep] = useState("");
  const [soreness, setSoreness] = useState("");
  const [stress, setStress] = useState("");
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const stressOptions = [
    { value: "1", label: "1 - Velmi špatná" },
    { value: "2", label: "2 - Špatná" },
    { value: "3", label: "3 - Průměrná" },
    { value: "4", label: "4 - Dobrá" },
    { value: "5", label: "5 - Výborná" },
  ];

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        setIsLoadingEvents(true);

        const { data } = await API.get("/events/player/recent");
        setEvents(data);

        if (data.length > 0) {
          handleEventChange(data[0]._id, data);
        }
      } catch (error) {
        console.error("Chyba při načítání událostí:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchRecentEvents();
  }, []);

  const handleEventChange = (eventId, eventsList = events) => {
    setSelectedEventId(eventId);
    const event = eventsList.find((e) => e._id === eventId);

    if (event && event.plannedDuration) {
      setDuration(event.plannedDuration.toString());
    } else {
      setDuration("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reports", {
        eventId: selectedEventId,
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
    <div className="w-full text-white font-sans">
      <form
        onSubmit={handleSubmit}
        className="p-8 md:p-12 flex flex-col gap-8 "
      >
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide !mt-8 text-center">
          Dotazník po aktivitě
        </h2>

        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-bold text-center ${
              message.includes("Chyba")
                ? "bg-red-500/20 text-red-400 border border-red-500/50"
                : "bg-green-500/20 text-green-400 border border-green-500/50"
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-[12px] font-bold text-gray-400 !px-2 uppercase tracking-widest">
            Vyber aktivitu
          </label>
          <Select value={selectedEventId} onValueChange={handleEventChange}>
            <SelectTrigger className="bg-[#2a303c] w-full text-white !h-12 rounded-lg !pl-4 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium text-[15px]">
              <SelectValue
                placeholder={
                  isLoadingEvents ? "Načítám aktivity..." : "Vyber událost"
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-[#2a303c] border-none shadow-xl rounded-lg overflow-hidden w-full text-white">
              {events.length === 0 && !isLoadingEvents ? (
                <div className="p-3 text-sm text-gray-400 text-center">
                  Žádné nedávné události
                </div>
              ) : (
                events.map((event) => {
                  const dateStr = new Date(event.date).toLocaleDateString(
                    "cs-CZ",
                  );
                  return (
                    <SelectItem
                      key={event._id}
                      value={event._id}
                      className="h-12 pl-4 pr-8 text-[14px] font-medium text-white focus:bg-[#3a4252] focus:text-white cursor-pointer rounded-none"
                    >
                      {event.title || event.type} - {dateStr}
                    </SelectItem>
                  );
                })
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-2">
          <h3 className="text-xl px-2! font-bold text-gray-200 mb-6 border-b border-gray-700 pb-2">
            Fyzická zátěž 💪
          </h3>

          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-400 !px-2 !pt-2 uppercase tracking-widest">
                1. Ohodnoť, jak byl pro tebe dnešní trénink náročný.
              </label>
              <span className="!px-2 text-xs italic text-gray-400 mb-1">
                (1 = nejlehčí, 10 = nejtěžší)
              </span>
              <Input
                type="number"
                min="1"
                max="10"
                required
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                className="bg-[#2a303c] text-white h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium placeholder:text-white/80 text-[15px]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-400 !px-2 uppercase tracking-widest">
                2. Jak dlouho trvala aktivita? (v minutách)
              </label>
              <input
                type="number"
                min="1"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-[#2a303c] w-full text-white h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium placeholder:text-white/80 text-[15px]"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xl px-2! font-bold text-gray-200 mb-6 border-b border-gray-700 pb-2">
            Psychická zátěž 🧘
          </h3>

          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-400 !px-2 !pt-2 uppercase tracking-widest">
                1. Jak se dnes cítíš po fyzické stránce?
              </label>
              <span className="!px-2 text-xs italic text-gray-400 mb-1">
                (1 = jsem hodně unavený/á, 5 = jsem plný/á energie)
              </span>
              <Input
                type="number"
                min="1"
                max="5"
                required
                value={fatigue}
                onChange={(e) => setFatigue(e.target.value)}
                className="bg-[#2a303c] text-white h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium placeholder:text-white/80 text-[15px]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-400 !px-2 uppercase tracking-widest">
                2. Jak dobře ses dneska vyspal/a?
              </label>
              <span className="!px-2 text-xs italic text-gray-400 mb-1">
                (1 = nejhorší, 5 = nejlepší)
              </span>
              <Input
                type="number"
                min="1"
                max="5"
                required
                value={sleep}
                onChange={(e) => setSleep(e.target.value)}
                className="bg-[#2a303c] text-white h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium placeholder:text-white/80 text-[15px]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-400 !px-2 uppercase tracking-widest">
                3. Cítíš nějakou svalovou bolest nebo ztuhlost?
              </label>
              <span className="!px-2 text-xs italic text-gray-400 mb-1">
                (1 = velmi silná bolest, 5 = žádná bolest)
              </span>
              <Input
                type="number"
                min="1"
                max="5"
                required
                value={soreness}
                onChange={(e) => setSoreness(e.target.value)}
                className="bg-[#2a303c] text-white h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium placeholder:text-white/80 text-[15px]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-400 !px-2 uppercase tracking-widest">
                4. Míra stresu mimo sport (škola, práce, domov)?
              </label>
              <span className="!px-2 text-xs italic text-gray-400 mb-1">
                (1 = velmi vysoký stres, 5 = úplně v klidu)
              </span>
              <Input
                type="number"
                min="1"
                max="5"
                required
                value={stress}
                onChange={(e) => setStress(e.target.value)}
                className="bg-[#2a303c] text-white h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium placeholder:text-white/80 text-[15px]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-400 !px-2 uppercase tracking-widest">
                5. Jaká byla tvoje nálada během dneška?
              </label>
              <div className="relative">
                <Select value={mood} onValueChange={(value) => setMood(value)}>
                  <SelectTrigger className="bg-[#2a303c] w-full text-white !h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium text-[15px]">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    className="bg-[#2a303c] border-none shadow-xl rounded-lg overflow-hidden w-full"
                  >
                    {stressOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="h-10 pl-2 pr-8 text-[15px] font-medium text-white focus:bg-[#3a4252] focus:text-white cursor-pointer rounded-none"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-400 !px-2 uppercase tracking-widest">
                Chtěl/a bych něco vzkázat trenérovi?
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-[#2a303c] w-full text-white h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium placeholder:text-white/80 text-[15px]"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!selectedEventId}
          className="w-full bg-[#4E4619] hover:bg-[#4b4e26] disabled:opacity-50 h-12 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 mt-4 flex items-center justify-center gap-2"
        >
          ODESLAT
        </Button>
      </form>
    </div>
  );
};

export default ReportForm;

import { useState, useEffect } from "react";
import API from "../services/api";
import { CalendarDays, Clock } from "lucide-react";
import PageHeader from "../components/PageHeader";

const getEventColor = (type) => {
  switch (type) {
    case "Zápas":
      return "text-emerald-400 border-emerald-400/50 bg-emerald-900/20";
    case "Regenerace":
      return "text-blue-400 border-blue-400/50 bg-blue-900/20";
    case "Volno":
      return "text-gray-400 border-gray-400/50 bg-gray-900/20";
    default:
      return "text-[#dce1a1] border-[#dce1a1]/50 bg-[#4E4619]/30";
  }
};

const MyProgram = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await API.get("/events");
        setEvents(data);
      } catch (error) {
        console.error("Chyba při načítání programu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-500">
      <PageHeader
        title="Můj program"
        subtitle="Tréninky a zápasy týmu"
        icon={CalendarDays}
      />

      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-6 shadow-lg">
        {loading ? (
          <p className="text-center text-gray-500 font-medium py-10">
            Načítání...
          </p>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <CalendarDays size={48} className="text-[#2a303c] mb-4 mx-auto" />
            <p>Zatím nejsou naplánované žádné události.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isPast = eventDate < today;
              const formattedDate = new Intl.DateTimeFormat("cs-CZ", {
                weekday: "long",
                day: "numeric",
                month: "long",
              }).format(eventDate);

              return (
                <div
                  key={event._id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#2a303c]/30 border border-[#2a303c] rounded-xl gap-4 ${
                    isPast ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center bg-[#1a1a1a] border border-[#323946] rounded-lg w-16 h-16 min-w-[4rem]">
                      <span className="text-xs font-bold text-gray-400 uppercase">
                        {new Intl.DateTimeFormat("cs-CZ", {
                          weekday: "short",
                        }).format(eventDate)}
                      </span>
                      <span className="text-xl font-black text-white">
                        {eventDate.getDate()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">
                        {event.title || event.type}
                      </h4>
                      <p className="text-[12px] font-bold text-gray-400 mt-1 capitalize">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {event.plannedDuration && (
                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] border border-[#323946] rounded-md text-[11px] font-bold text-gray-300">
                        <Clock size={14} />
                        {event.plannedDuration} min
                      </div>
                    )}
                    <div
                      className={`px-3 py-1.5 border rounded-md text-[11px] font-extrabold uppercase tracking-widest ${getEventColor(event.type)}`}
                    >
                      {event.type}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProgram;

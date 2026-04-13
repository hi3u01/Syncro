import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
import CreateEventModal from "../components/events/CreateEventModal";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const Calendar = () => {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventToEdit, setEventToEdit] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data } = await API.get("/teams");
        setTeams(data);
        if (data.length > 0) setSelectedTeamId(data[0]._id);
      } catch (error) {
        console.error("Chyba při načítání týmů:", error);
      }
    };
    if (user?.role === "coach") fetchTeams();
  }, [user]);

  const fetchEvents = async () => {
    if (!selectedTeamId) return;
    setIsLoading(true);
    try {
      const { data } = await API.get(`/events/team/${selectedTeamId}`);
      setEvents(data);
    } catch (error) {
      console.error("Chyba při načítání událostí:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedTeamId]);

  const getEventColor = (type) => {
    switch (type) {
      case "Zápas":
        return "text-emerald-400 border-emerald-400/50 bg-emerald-900/20";
      case "Regenerace":
        return "text-blue-400 border-blue-400/50 bg-blue-900/20";
      case "Volno":
        return "text-gray-400 border-gray-400/50 bg-gray-900/20";
      case "Těžký trénink":
        return "text-red-400 border-red-400/50 bg-red-900/20";
      default:
        return "text-[#dce1a1] border-[#dce1a1]/50 bg-[#4E4619]/30";
    }
  };

  const handleEditEvent = (event) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Opravdu chcete tuto událost smazat?")) {
      try {
        await API.delete(`/events/${eventId}`);
        fetchEvents();
      } catch (error) {
        console.error("Chyba při mazání události:", error);
        alert("Událost se nepodařilo smazat.");
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a303c] pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#4E4619] rounded-xl shadow-[0_0_15px_rgba(78,70,25,0.4)]">
            <CalendarIcon size={24} className="text-[#dce1a1]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight m-0">
              Kalendář
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              Plánování sezóny
            </p>
          </div>
        </div>

        {teams.length > 0 && (
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-full sm:w-[200px]">
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger className="bg-[#2a303c] w-full text-white h-11 rounded-xl px-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-bold text-[12px] uppercase tracking-widest shadow-sm">
                  <SelectValue placeholder="Vyberte tým" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="bg-[#2a303c] border border-[#323946] shadow-xl rounded-xl overflow-hidden"
                >
                  {teams.map((t) => (
                    <SelectItem
                      key={t._id}
                      value={t._id}
                      className="h-10 pl-4 pr-8 text-[12px] font-bold uppercase tracking-widest text-gray-300 focus:bg-[#3a4252] focus:text-white cursor-pointer rounded-none"
                    >
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#4E4619] hover:bg-[#4b4e26] text-white rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center gap-2 h-11 px-5 transition-all shadow-lg active:scale-95"
            >
              <Plus size={16} /> Nová událost
            </Button>
          </div>
        )}
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-6 shadow-lg">
        {isLoading ? (
          <p className="text-center text-gray-500 font-medium py-10">
            Načítání kalendáře...
          </p>
        ) : events.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <CalendarIcon size={48} className="text-[#2a303c] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Kalendář je prázdný
            </h3>
            <p className="text-gray-400 text-sm max-w-md">
              Zatím jste nevytvořili žádné tréninky ani zápasy. Začněte tím, že
              přidáte novou událost.
            </p>
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
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#2a303c]/30 border border-[#2a303c] rounded-xl transition-all gap-4 
                    ${isPast ? "opacity-50 grayscale-[0.5] border-transparent shadow-none" : "hover:bg-[#2a303c]/50 shadow-sm"}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex flex-col items-center justify-center border rounded-lg w-16 h-16 min-w-[4rem] transition-colors
                      ${isPast ? "bg-[#1a1a1a]/50 border-[#2a303c]" : "bg-[#1a1a1a] border-[#323946]"}
                    `}
                    >
                      <span className="text-xs font-bold text-gray-400 uppercase">
                        {new Intl.DateTimeFormat("cs-CZ", {
                          weekday: "short",
                        }).format(eventDate)}
                      </span>
                      <span
                        className={`text-xl font-black ${isPast ? "text-gray-500" : "text-white"}`}
                      >
                        {eventDate.getDate()}
                      </span>
                    </div>

                    <div>
                      <h4
                        className={`text-lg font-bold flex items-center gap-2 transition-colors ${isPast ? "text-gray-500" : "text-white"}`}
                      >
                        {event.title || event.type}
                      </h4>
                      <p className="text-[12px] font-bold text-gray-400 mt-1 capitalize">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {event.plannedDuration && (
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-md text-[11px] font-bold hidden sm:flex transition-colors
                        ${isPast ? "bg-[#1a1a1a]/30 border-[#2a303c] text-gray-500" : "bg-[#1a1a1a] border-[#323946] text-gray-300"}
                      `}
                      >
                        <Clock size={14} />
                        {event.plannedDuration} min
                      </div>
                    )}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-md text-[11px] font-extrabold uppercase tracking-widest transition-all ${
                        isPast
                          ? "text-gray-500 border-gray-500/20 bg-gray-500/5"
                          : getEventColor(event.type)
                      }`}
                    >
                      {event.type}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#323946]"
                        >
                          <span className="sr-only">Otevřít menu</span>
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[#2a303c] border-[#323946] text-white"
                      >
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-[#3a4252] focus:bg-[#3a4252] focus:text-white flex items-center gap-2"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit2 size={14} />
                          Upravit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-400 hover:bg-red-900/30 hover:text-red-400 focus:bg-red-900/30 focus:text-red-400 flex items-center gap-2"
                          onClick={() => handleDeleteEvent(event._id)}
                        >
                          <Trash2 size={14} />
                          Odstranit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateEventModal
        key={`modal-${isModalOpen ? "open" : "closed"}-${selectedTeamId}`}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEventToEdit(null);
        }}
        selectedTeamName={
          teams.find((t) => t._id === selectedTeamId)?.name || "Neznámý tým"
        }
        defaultTeamId={selectedTeamId}
        onEventCreated={fetchEvents}
        editData={eventToEdit}
      />
    </div>
  );
};

export default Calendar;

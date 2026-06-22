import { useState } from "react";
import { ChevronDown, MessageSquare } from "lucide-react";

const WELLNESS_LABELS = {
  fatigue: "Únava",
  sleep: "Spánek",
  soreness: "Bolest",
  stress: "Stres",
  mood: "Nálada",
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const ReportRow = ({ report }) => {
  const [open, setOpen] = useState(false);
  const event = report.eventId || {};
  const eventDate = event.date || report.date;

  return (
    <div className="border border-[#2a303c] rounded-xl overflow-hidden bg-[#2a303c]/20">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 hover:bg-[#2a303c]/40 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center bg-[#1a1a1a] border border-[#323946] rounded-lg w-14 h-14 min-w-[3.5rem]">
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              {new Date(eventDate).toLocaleDateString("cs-CZ", {
                month: "short",
              })}
            </span>
            <span className="text-lg font-black text-white">
              {new Date(eventDate).getDate()}
            </span>
          </div>
          <div>
            <h4 className="text-white font-bold m-0">
              {event.title || event.type || "Aktivita"}
            </h4>
            <p className="text-[12px] text-gray-400 font-medium mt-0.5">
              {formatDate(eventDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Load
            </p>
            <p className="text-[#dce1a1] font-extrabold">
              {report.trainingLoad ?? 0}{" "}
              <span className="text-[10px] text-gray-500 font-normal">A.U.</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              RPE
            </p>
            <p className="text-white font-extrabold">{report.rpe}</p>
          </div>
          <ChevronDown
            size={18}
            className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="p-4 border-t border-[#2a303c] bg-[#1a1a1a]/40">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(WELLNESS_LABELS).map(([key, label]) => (
              <div
                key={key}
                className="bg-[#2a303c]/40 rounded-lg p-3 text-center"
              >
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {label}
                </p>
                <p className="text-xl font-extrabold text-white mt-1">
                  {report.wellness?.[key] ?? "-"}
                  <span className="text-[10px] text-gray-500 font-normal">
                    /5
                  </span>
                </p>
              </div>
            ))}
          </div>
          {report.note && (
            <div className="mt-3 flex items-start gap-2 text-gray-300 bg-[#2a303c]/30 p-3 rounded-lg">
              <MessageSquare size={16} className="text-gray-500 mt-0.5" />
              <span className="text-sm">{report.note}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ReportHistory = ({ reports = [], emptyText = "Zatím žádné dotazníky." }) => {
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm font-medium bg-[#1a1a1a] border border-dashed border-[#2a303c] rounded-2xl">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {reports.map((r) => (
        <ReportRow key={r._id} report={r} />
      ))}
    </div>
  );
};

export default ReportHistory;

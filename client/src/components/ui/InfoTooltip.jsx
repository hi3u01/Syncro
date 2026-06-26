import { useState } from "react";
import { Info } from "lucide-react";

// Small info icon with a hover/tap tooltip explaining a KPI metric.
// Optionally lists concrete items (e.g. affected players) under the text.
const InfoTooltip = ({ text, items }) => {
  const [open, setOpen] = useState(false);
  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label="Vysvětlení"
        onClick={() => setOpen((v) => !v)}
        className="p-1 text-gray-500 hover:text-gray-300 transition-colors bg-transparent border-0 cursor-help leading-none"
      >
        <Info size={16} />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute right-0 top-full mt-2 z-30 w-56 rounded-xl border border-[#2a303c] bg-[#0f0f0f] px-3 py-2 text-[12px] font-medium leading-snug text-gray-300 shadow-xl normal-case tracking-normal"
        >
          {text}
          {hasItems && (
            <span className="mt-2 flex flex-col gap-1 border-t border-[#2a303c] pt-2">
              {items.map((name, i) => (
                <span key={i} className="text-gray-200 font-semibold">
                  {name}
                </span>
              ))}
            </span>
          )}
        </span>
      )}
    </span>
  );
};

export default InfoTooltip;

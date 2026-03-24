import { useState } from "react";
import API from "../services/api";
import { Activity, Brain, Moon, Battery, Frown, Smile } from "lucide-react";

const ReportForm = ({ onReportSaved }) => {
  // Stavy pro všechny položky tvého Report.js modelu
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
      // Odeslání na tvůj backend (API už díky interceptoru pošle i token)
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
      // Volitelný reset formuláře
      setDuration("");
      setNote("");

      // Pokud chceme v Dashboardu po uložení něco udělat (např. aktualizovat graf)
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
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "500px",
        background: "black",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3>Potréninkový report</h3>

      {message && (
        <div
          style={{
            padding: "10px",
            background: message.includes("Chyba") ? "#fee2e2" : "#dcfce3",
            borderRadius: "5px",
          }}
        >
          {message}
        </div>
      )}

      <div>
        <label>
          <strong>Délka tréninku (minuty):</strong>
        </label>
        <input
          type="number"
          required
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div>
        <label>
          <strong>RPE - Subjektivní zátěž (1-10): {rpe}</strong>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={rpe}
          onChange={(e) => setRpe(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}
      >
        <div>
          <label>
            <Battery size={16} /> Únava (1-5): <strong>{fatigue}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={fatigue}
            onChange={(e) => setFatigue(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>
            <Moon size={16} /> Spánek (1-5): <strong>{sleep}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={sleep}
            onChange={(e) => setSleep(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>
            <Activity size={16} /> Bolest svalů (1-5):{" "}
            <strong>{soreness}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={soreness}
            onChange={(e) => setSoreness(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>
            <Brain size={16} /> Stres (1-5): <strong>{stress}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <label>
            <Smile size={16} /> Nálada (1-5): <strong>{mood}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div>
        <label>
          <strong>Poznámka pro trenéra (volitelné):</strong>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength="500"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            minHeight: "80px",
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          padding: "12px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Odeslat report
      </button>
    </form>
  );
};

export default ReportForm;

import { useState } from "react";
import API from "../services/api";
import { PlusCircle, AlertCircle, X } from "lucide-react";

const CreateTeamForm = ({ onSuccess, onCancel }) => {
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await API.post("/teams", { name: teamName });
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create team.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#070707",
        border: "1px solid #e5e7eb",
        padding: "20px",
        borderRadius: "8px",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h3 style={{ margin: 0 }}>Vytvořit nový tým</h3>
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
          }}
        >
          <X size={20} />
        </button>
      </div>

      {error && (
        <div
          style={{
            color: "#D8000C",
            backgroundColor: "#FFBABA",
            padding: "10px",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Název týmu:
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            placeholder="Např. Sparta U19"
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              borderRadius: "5px",
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "10px 15px",
              backgroundColor: "#e5e7eb",
              color: "#374151",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              flex: 1,
              fontWeight: "bold",
            }}
          >
            Zrušit
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "10px 15px",
              backgroundColor: "#10B981",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontWeight: "bold",
              flex: 2,
            }}
          >
            <PlusCircle size={18} />{" "}
            {isSubmitting ? "Vytvářím..." : "Vytvořit tým"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeamForm;

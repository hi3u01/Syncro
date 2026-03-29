import { Copy } from "lucide-react";

const TeamCard = ({ team, players }) => {
  const copyToClipboard = () => {
    if (team?.joinCode) {
      navigator.clipboard.writeText(team.joinCode);
      alert(`Kód ${team.joinCode} byl zkopírován!`);
    }
  };

  return (
    <div style={{ marginTop: "20px", marginBottom: "40px" }}>
      <div
        style={{
          backgroundColor: "#EFF6FF",
          border: "1px solid #BFDBFE",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 5px 0", color: "#1E3A8A" }}>{team.name}</h2>
        </div>

        <div style={{ textAlign: "right" }}>
          <p
            style={{
              margin: "0 0 5px 0",
              fontSize: "14px",
              color: "#4B5563",
            }}
          >
            Zvací kód pro hráče:
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                letterSpacing: "2px",
                color: "#111827",
              }}
            >
              {team.joinCode}
            </span>
            <button
              onClick={copyToClipboard}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6B7280",
              }}
              title="Kopírovat kód"
            >
              <Copy size={20} />
            </button>
          </div>
        </div>
      </div>

      <h3 style={{ margin: "0 0 10px 0" }}>Seznam hráčů ({players.length})</h3>

      {players.length === 0 ? (
        <p
          style={{
            color: "#6B7280",
            fontStyle: "italic",
            padding: "20px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            margin: 0,
          }}
        >
          Zatím se nepřidal žádný hráč. Pošlete jim zvací kód!
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {players.map((player) => (
            <li
              key={player._id}
              style={{
                padding: "15px",
                borderBottom: "1px solid #E5E7EB",
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "white",
              }}
            >
              <strong>
                {player.firstName} {player.lastName}
              </strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeamCard;

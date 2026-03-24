import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut } from "lucide-react";
import ReportForm from "../components/ReportForm";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Vítej, {user?.firstName}!</h1>
        <button
          onClick={logout}
          style={{
            padding: "8px 12px",
            backgroundColor: "#DC2626",
            color: "white",
            border: "none",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <LogOut size={16} /> Odhlásit se
        </button>
      </div>

      <p style={{ fontSize: "18px", color: "#4b5563", marginBottom: "30px" }}>
        Role: <strong>{user?.role === "coach" ? "Trenér" : "Hráč"}</strong>
      </p>

      {/* Podmíněné zobrazení podle role */}
      {user?.role === "player" ? (
        <div>
          <h2>Vyplnit dnešní report</h2>
          <ReportForm />
        </div>
      ) : (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px",
          }}
        >
          <h2>Přehled týmu</h2>
          <p>Zde trenér brzy uvidí grafy a data od svých hráčů.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

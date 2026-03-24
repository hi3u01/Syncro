import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { LogIn, AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Vyčištění předchozích chyb před novým pokusem

    try {
      // Odeslání dat na náš backend (API z api.js automaticky přidává /api)
      const response = await API.post("/users/login", { email, password });

      // Úspěch! Uložíme uživatele do kontextu a do prohlížeče
      login(response.data);

      // Přesměrujeme ho do aplikace
      navigate("/dashboard");
    } catch (err) {
      // Pokud backend vrátí chybu (např. 401 Neplatné heslo), zobrazíme ji
      setError(err.response?.data?.error || "Při přihlašování došlo k chybě.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Přihlášení do SYNCRO</h2>

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
            E-mail:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Heslo:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "12px",
            backgroundColor: "#2563EB",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            fontSize: "16px",
          }}
        >
          <LogIn size={18} />
          Přihlásit se
        </button>
      </form>
    </div>
  );
};

export default Login;

import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { UserPlus, AlertCircle } from "lucide-react";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("player");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Sending data to register endpoint
      const response = await API.post("/users/register", {
        firstName,
        lastName,
        email,
        password,
        role,
      });

      // send token to user login immediately after registration
      login(response.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Při registraci došlo k chybě.");
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
      <h2>Vytvořit nový účet</h2>

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
            Jméno:
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
            Příjmení:
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Jsem:
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
          >
            <option value="player">Hráč</option>
            <option value="coach">Trenér</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: "12px",
            backgroundColor: "#10B981",
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
          <UserPlus size={18} /> Zaregistrovat se
        </button>
      </form>

      {/* Odkaz zpět na přihlášení pomocí react-router-dom */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <p style={{ color: "#4b5563" }}>Už máš účet?</p>
        <Link
          to="/login"
          style={{
            color: "#2563EB",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Přihlásit se
        </Link>
      </div>
    </div>
  );
};

export default Register;

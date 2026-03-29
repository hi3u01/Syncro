import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { UserPlus, AlertCircle, KeyRound } from "lucide-react";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("player");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        firstName,
        lastName,
        email,
        password,
        role,
      };

      if (role === "player") {
        payload.joinCode = joinCode.trim();
      }

      const response = await API.post("/users/register", payload);

      login(response.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Při registraci došlo k chybě.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-20 font-sans text-white">
      <div className="w-full max-w-[400px] px-6 pb-20">
        <h2 className="text-xl mb-6 text-gray-200">Vytvořit nový účet</h2>

        {error && (
          <div className="text-red-400 bg-red-900/30 border border-red-800 p-3 rounded-md flex items-center gap-3 mb-5">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-200">Jméno:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full bg-[#1e2530] border-none p-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-200">Příjmení:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full bg-[#1e2530] border-none p-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-200">E-mail:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1e2530] border-none p-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-200">Heslo:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1e2530] border-none p-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-200">Jsem:</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (e.target.value === "coach") {
                  setJoinCode("");
                }
              }}
              className="w-full bg-[#111827] border border-gray-800 p-3 text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.7rem top 50%",
                backgroundSize: "0.65rem auto",
              }}
            >
              <option value="player" className="bg-[#1e2530]">
                Hráč
              </option>
              <option value="coach" className="bg-[#1e2530]">
                Trenér
              </option>
            </select>
          </div>

          {role === "player" && (
            <div className="flex flex-col gap-2 mt-2 bg-emerald-900/10 border border-emerald-900/30 p-4 rounded-lg">
              <label className="font-bold text-emerald-400 flex items-center gap-2">
                <KeyRound size={16} /> Zvací kód týmu:
              </label>
              <p className="text-xs text-gray-400 mb-1">
                Zadej kód, který ti poslal trenér, aby ses připojil do týmu.
              </p>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                required
                placeholder="Zadej kód (např. ABC12345)"
                className="w-full bg-[#1e2530] border border-gray-700 p-3 text-white font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all uppercase"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-[#10b981] hover:bg-[#059669] text-white rounded-md font-semibold flex justify-center items-center gap-2 transition-colors active:scale-[0.98]"
          >
            <UserPlus size={18} /> Zaregistrovat se
          </button>
        </form>

        <div className="mt-8 text-center flex flex-col gap-2">
          <p className="text-gray-500 text-sm">Už máš účet?</p>
          <Link
            to="/login"
            className="text-blue-600 font-bold hover:text-blue-500 transition-colors"
          >
            Přihlásit se
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

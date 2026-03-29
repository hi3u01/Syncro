import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    setError("");

    try {
      const response = await API.post("/users/login", { email, password });
      login(response.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Při přihlašování došlo k chybě.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-32 font-sans text-white">
      <div className="w-full max-w-[400px] px-6">
        <h2 className="text-xl mb-6 text-gray-200">Přihlášení do SYNCRO</h2>

        {error && (
          <div className="text-red-400 bg-red-900/30 border border-red-800 p-3 rounded-md flex items-center gap-3 mb-5">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* E-mail */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-200">E-mail:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="vás@email.cz"
              className="w-full bg-[#1e2530] border-none p-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Heslo */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-200">Heslo:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-[#1e2530] border-none p-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold flex justify-center items-center gap-2 transition-colors active:scale-[0.98]"
          >
            <LogIn size={18} />
            Přihlásit se
          </button>
        </form>

        <div className="mt-8 text-center flex flex-col gap-2">
          <p className="text-gray-500 text-sm">Ještě nemáš účet?</p>
          <Link
            to="/register"
            className="text-blue-500 font-bold hover:text-blue-400 transition-colors"
          >
            Vytvořit účet
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

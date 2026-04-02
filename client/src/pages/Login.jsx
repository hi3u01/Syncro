import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { LogIn, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

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
    <div className="flex min-h-screen w-full font-sans bg-[#1a1a1a]">
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
        <div className="text-center">
          <h1 className="text-5xl font-black text-black tracking-tighter italic">
            SYNCRO.
          </h1>
          <p className="text-gray-400 mt-4 font-medium uppercase tracking-widest text-xs">
            Performance tracking system for athletes
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-[#1a1a1a] flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-[420px] flex flex-col">
          <div className="text-center mb-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight !py-2">
              PŘIHLAŠTE SE
            </h2>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-xl flex items-center gap-3 text-destructive animate-in fade-in zoom-in-95">
              <AlertCircle size={18} />
              <span className="text-sm font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-400 !px-2 uppercase tracking-widest">
                E-mail
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=""
                className="bg-[#2a303c] text-white h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium placeholder:text-white/80 text-[15px]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-400 !px-2 uppercase tracking-widest">
                Heslo
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=""
                className="bg-[#2a303c] text-white h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium placeholder:text-white/80 text-[15px]"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#5b5e36] hover:bg-[#4b4e26] h-12 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 mt-4 flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              PŘIHLÁSIT SE
            </Button>
          </form>

          <div className="flex justify-between items-center px-4 !mt-3">
            <Link
              to="/forgot-password"
              className="text-[12px] font-bold !text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
            >
              Zapomněli heslo?
            </Link>
            <Link
              to="/register"
              className="text-[12px] font-bold !text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
            >
              Vytvořit účet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

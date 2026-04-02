import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { UserPlus, AlertCircle, KeyRound } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

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
              REGISTRACE
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
                Jméno:
              </label>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="bg-[#2a303c] text-white h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium placeholder:text-white/80 text-[15px]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-400 !px-2 uppercase tracking-widest">
                Přijmení:
              </label>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="bg-[#2a303c] text-white h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium placeholder:text-white/80 text-[15px]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-400 !px-2 uppercase tracking-widest">
                Email:
              </label>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#2a303c] text-white h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium placeholder:text-white/80 text-[15px]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-400 !px-2 uppercase tracking-widest">
                Heslo:
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#2a303c] text-white h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium placeholder:text-white/80 text-[15px]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-gray-400 !px-2 uppercase tracking-widest">
                Jsem:
              </label>
              <Select
                value={role}
                onValueChange={(value) => {
                  setRole(value);
                  if (value === "coach") {
                    setJoinCode("");
                  }
                }}
              >
                <SelectTrigger className="bg-[#2a303c] w-full text-white !h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium text-[15px]">
                  <SelectValue placeholder="Vyberte roli" />
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  className="bg-[#2a303c] border-none shadow-xl rounded-lg overflow-hidden w-full"
                >
                  <SelectItem
                    value="player"
                    className="h-10 pl-2 pr-8 text-[15px] font-medium text-white focus:bg-[#3a4252] focus:text-white cursor-pointer rounded-none"
                  >
                    Hráč
                  </SelectItem>

                  <SelectItem
                    value="coach"
                    className="h-10 pl-2 pr-8 text-[15px] font-medium text-white focus:bg-[#3a4252] focus:text-white cursor-pointer rounded-none"
                  >
                    Trenér
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "player" && (
              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-gray-400 !px-2 uppercase tracking-widest">
                  Zvací kód týmu:
                </label>
                <p className="!px-2 text-xs italic text-gray-400 mb-1">
                  Zadej kód, který ti poslal trenér, aby ses připojil/a do týmu.
                </p>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  required
                  className="bg-[#2a303c] w-full text-white h-10 rounded-lg !pl-2 pr-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium placeholder:text-white/80 text-[15px]"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#5b5e36] hover:bg-[#4b4e26] h-12 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 mt-4 flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              ZAREGISTROVAT SE
            </Button>
          </form>

          <div className="!mt-3 text-center flex flex-col gap-2">
            <Link
              to="/login"
              className="text-[12px] font-bold !text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
            >
              Přihlásit se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

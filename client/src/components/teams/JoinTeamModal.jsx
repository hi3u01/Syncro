import { useState, useContext } from "react";
import { KeyRound } from "lucide-react";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "../ui/button";

const JoinTeamModal = ({ show }) => {
  const { user, login } = useContext(AuthContext);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!show) return null;

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const { data } = await API.post("/teams/join", { joinCode });
      login({ ...user, teamId: data._id });
    } catch (err) {
      setError(err.response?.data?.error || "Připojení se nezdařilo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 bg-[#4E4619] rounded-2xl mb-4">
            <KeyRound size={28} className="text-[#dce1a1]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight m-0">
            Připoj se do týmu
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Zadej zvací kód, který ti poslal trenér.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-900/50 text-red-400 text-sm font-bold rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            required
            placeholder="Např. A1B2C3"
            className="bg-[#2a303c] w-full text-white h-12 rounded-xl px-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-mono font-bold tracking-widest text-center text-lg placeholder:text-gray-500"
          />
          <Button
            type="submit"
            disabled={isLoading || !joinCode}
            className="w-full bg-[#4E4619] hover:bg-[#4b4e26] disabled:opacity-50 h-12 rounded-xl font-bold text-[15px] shadow-lg transition-all active:scale-95"
          >
            {isLoading ? "Připojuji..." : "PŘIPOJIT SE"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default JoinTeamModal;

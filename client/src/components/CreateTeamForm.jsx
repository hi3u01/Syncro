import { useState } from "react";
import API from "../services/api";
import { PlusCircle, AlertCircle, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

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
      setError(
        err.response?.data?.error || "Při vytváření týmu došlo k chybě.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2a303c] p-6 rounded-2xl mt-5 shadow-lg animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="m-0 text-2xl font-extrabold text-white tracking-tight uppercase">
          Vytvořit nový tým
        </h3>
        <button
          onClick={onCancel}
          className="p-2 bg-[#2a303c]/50 hover:bg-[#2a303c] rounded-xl text-gray-400 hover:text-white transition-colors"
          title="Zavřít"
        >
          <X size={18} />
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-xl flex items-center gap-3 text-destructive mb-6">
          <AlertCircle size={18} />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="space-y-2 text-left">
          <label className="block text-[12px] font-bold text-gray-400 ml-4 uppercase tracking-widest">
            Název týmu
          </label>
          <Input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            placeholder="Např. Sparta U19"
            className="bg-[#2a303c] text-white h-10 rounded-xl px-4 border-none focus-visible:ring-2 focus-visible:ring-[#5b5e36] font-medium placeholder:text-gray-500 text-[15px]"
          />
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            type="button"
            onClick={onCancel}
            className="flex-1 h-10 bg-transparent hover:bg-[#2a303c] text-gray-400 hover:text-white border border-[#2a303c] rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all"
          >
            Zrušit
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={`flex-[2] h-10 bg-[#4E4619] hover:bg-[#4b4e26] text-white rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <PlusCircle size={18} />
            {isSubmitting ? "VYTVÁŘÍM..." : "VYTVOŘIT TÝM"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeamForm;

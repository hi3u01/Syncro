import { useState } from "react";
import API from "../services/api";
import { PlusCircle, AlertCircle, X } from "lucide-react";

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
      setError(err.response?.data?.error || "Failed to create team.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#070707] border border-gray-200 p-5 rounded-lg mt-5 text-white">
      <div className="flex justify-between items-center mb-[15px]">
        <h3 className="m-0 text-lg font-bold">Vytvořit nový tým</h3>
        <button
          onClick={onCancel}
          className="bg-none border-none cursor-pointer text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="text-[#D8000C] bg-[#FFBABA] p-2.5 rounded flex items-center gap-2.5 mb-[15px]">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-[15px]">
        <div>
          <label className="block mb-[5px] font-bold text-gray-200">
            Název týmu:
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            placeholder="Např. Sparta U19"
            className="w-full p-2.5 box-border rounded border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 p-2.5 bg-gray-200 text-gray-700 border-none rounded font-bold cursor-pointer hover:bg-gray-300 transition-colors"
          >
            Zrušit
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-[2] p-2.5 bg-[#10B981] text-white border-none rounded font-bold flex items-center justify-center gap-2 transition-colors ${
              isSubmitting
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer hover:bg-emerald-600"
            }`}
          >
            <PlusCircle size={18} />
            {isSubmitting ? "Vytvářím..." : "Vytvořit tým"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeamForm;

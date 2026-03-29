import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut } from "lucide-react";
import ReportForm from "../components/ReportForm";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    // Pozadí černé, text bílý, roztaženo na celou plochu
    <div className="min-h-screen bg-black text-white p-10 font-sans">
      {/* Horní řada s nadpisem a tlačítkem */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-xl font-medium">
            Vítej, {user?.firstName?.toUpperCase()}!
          </h1>
          <p className="text-gray-500 mt-1">
            Role:{" "}
            <strong className="text-gray-300">
              {user?.role === "coach" ? "Trenér" : "Hráč"}
            </strong>
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-[#DC2626] hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          <LogOut size={16} /> Odhlásit se
        </button>
      </div>

      {/* Podmíněné zobrazení podle role */}
      <div className="w-full">
        {user?.role === "player" ? (
          <div className="bg-[#1e2530] p-6 rounded-lg shadow-lg border border-gray-800">
            <h2 className="text-lg font-bold mb-4">Vyplnit dnešní report</h2>
            <ReportForm />
          </div>
        ) : (
          <div className="bg-[#f3f4f6] p-8 rounded-lg shadow-lg text-black max-w-2xl">
            <h2 className="text-gray-400 text-lg mb-2">Přehled týmu</h2>
            <p className="text-gray-300 text-sm">
              Zde trenér brzy uvidí grafy a data od svých hráčů.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

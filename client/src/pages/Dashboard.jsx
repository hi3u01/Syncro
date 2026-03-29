import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut, UserCircle } from "lucide-react"; // Přidána ikonka pro hezčí vzhled
import ReportForm from "../components/ReportForm";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    // Celou stránku nastavíme jako flexbox, který centruje svůj obsah doprostřed
    <div className="w-full text-white font-sans flex justify-center pt-8 pb-20">
      {/* TOTO JE TVŮJ STŘEDOVÝ SLOUPEC (jako chat okno) */}
      {/* Nastavíme mu šířku 95% na mobilech a max 800px na počítači */}
      <div className="w-[95%] max-w-[800px] flex flex-col">
        {/* Hlavička s pozdravem a tlačítkem */}
        <div className="flex justify-between items-start mb-10 w-full border-b border-gray-800 pb-6">
          <div className="flex items-center gap-4">
            {/* Přidána ikonka uživatele pro profi vzhled */}
            <UserCircle size={50} className="text-gray-600" />
            <div>
              <h1 className="text-2xl font-bold m-0 p-0 leading-tight">
                Vítej, {user?.firstName?.toUpperCase()}!
              </h1>
              <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
                Role:{" "}
                <strong
                  className={`px-2 py-0.5 rounded text-xs uppercase ${user?.role === "coach" ? "bg-blue-900/50 text-blue-300" : "bg-emerald-900/50 text-emerald-300"}`}
                >
                  {user?.role === "coach" ? "Trenér" : "Hráč"}
                </strong>
              </p>
            </div>
          </div>

          {/* NOVÁ PODMÍNKA ZDE: Tlačítko se vykreslí POUZE pokud je uživatel PLAYER */}
          {user?.role === "player" && (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-gray-400 hover:text-red-400 text-xs font-medium rounded-md transition-colors border border-gray-800 active:scale-95"
            >
              <LogOut size={14} /> Odhlásit se
            </button>
          )}
        </div>

        {/* Samotný obsah (Dotazník nebo Trenérský panel) */}
        <div className="w-full">
          {user?.role === "player" ? (
            <ReportForm />
          ) : (
            <div className="p-8 rounded-lg shadow-lg text-black w-full bg-[#1a1a1a] border border-gray-800">
              <h2 className="text-white text-lg mb-2">Přehled týmu</h2>
              <p className="text-gray-400 text-sm">
                Zde trenér uvidí grafy a data hráčů.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

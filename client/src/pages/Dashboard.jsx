import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut, UserCircle } from "lucide-react";
import ReportForm from "../components/ReportForm";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="w-full text-white font-sans flex justify-center pt-8 pb-20">
      <div className="w-[95%] max-w-[800px] flex flex-col">
        <div className="flex items-center gap-4 mb-10 w-full border-b border-gray-800 pb-6">
          <UserCircle size={50} className="text-gray-600" />

          <div>
            <h1 className="text-2xl font-bold m-0 p-0 leading-tight">
              {user?.firstName?.toUpperCase() +
                " " +
                user?.lastName?.toUpperCase()}
            </h1>

            <div className="flex items-center gap-4 mt-2">
              <p className="text-gray-500 m-0 p-0 flex items-center gap-2 text-sm">
                <strong
                  className={`px-2 py-0.5 rounded text-xs uppercase ${
                    user?.role === "coach"
                      ? "bg-blue-900/50 text-blue-300"
                      : "bg-emerald-900/50 text-emerald-300"
                  }`}
                >
                  {user?.role === "coach" ? "Trenér" : "Hráč"}
                </strong>
              </p>

              {user?.role === "player" && (
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1 bg-black hover:bg-gray-900 text-gray-400 hover:text-red-400 text-xs font-medium rounded-md transition-colors border border-gray-800 active:scale-95"
                >
                  <LogOut size={14} /> Odhlásit se
                </button>
              )}
            </div>
          </div>
        </div>

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

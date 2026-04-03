import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const { logout } = useContext(AuthContext);

  return (
    <aside className="w-[250px] bg-[#1a1a1a] text-white flex flex-col min-h-screen border-r border-[#2a303c]">
      <div className="p-4 border-b border-[#2a303c] flex justify-center gap-3">
        <h2 className="m-0 text-3xl font-black tracking-tighter italic text-white">
          SYNCRO
        </h2>
      </div>

      <nav className=" flex-1 flex flex-col ">
        <Link
          to="/dashboard"
          className={`flex items-center h-10 gap-3 px-4 py-3 no-underline font-bold uppercase tracking-widest transition-all duration-200 ${
            isActive("/dashboard")
              ? "bg-[#4E4619] text-white shadow-lg"
              : "bg-transparent text-gray-400 hover:bg-[#2a303c] hover:text-white"
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/teams"
          className={`flex items-center gap-3 h-10 px-4 py-3 no-underline  font-bold uppercase tracking-widest transition-all duration-200 ${
            isActive("/teams")
              ? "bg-[#4E4619] text-white shadow-lg"
              : "bg-transparent text-gray-400 hover:bg-[#2a303c] hover:text-white"
          }`}
        >
          Týmy
        </Link>
      </nav>

      {/* Footer area */}
      <div className="p-5 text-center">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2a303c] hover:bg-red-900/30 text-gray-400 hover:text-red-400 border border-transparent hover:border-red-900/50 text-[12px] font-bold  transition-all uppercase tracking-widest mb-4"
        >
          <LogOut size={16} /> Odhlásit se
        </button>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          © 2026 SYNCRO
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;

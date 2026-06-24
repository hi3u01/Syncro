import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Users,
  UserRound,
  CalendarDays,
  ClipboardList,
  History,
  UserCircle,
  X,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const COACH_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/teams", label: "Týmy", icon: Users },
  { to: "/players", label: "Hráči", icon: UserRound },
  { to: "/calendar", label: "Program", icon: CalendarDays },
  { to: "/profile", label: "Profil", icon: UserCircle },
];

const PLAYER_LINKS = [
  { to: "/dashboard", label: "Dotazník", icon: ClipboardList },
  { to: "/my-program", label: "Můj program", icon: CalendarDays },
  { to: "/history", label: "Historie", icon: History },
  { to: "/profile", label: "Profil", icon: UserCircle },
];

const Sidebar = ({ open = false, onClose = () => {} }) => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const isActive = (path) => location.pathname === path;

  const links = user?.role === "coach" ? COACH_LINKS : PLAYER_LINKS;

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-[250px] flex-col border-r border-[#2a303c] bg-[#1a1a1a] text-white transition-transform duration-300 lg:sticky lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-[#2a303c] flex items-center justify-center gap-3 relative">
          <h2 className="m-0 text-3xl font-black tracking-tighter italic text-white">
            SYNCRO
          </h2>
          <button
            onClick={onClose}
            aria-label="Zavřít menu"
            className="lg:hidden absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>
        <nav className="flex-1 flex flex-col">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`flex items-center h-10 gap-3 px-4 py-3 no-underline font-bold uppercase tracking-widest transition-all duration-200 ${
                  isActive(link.to)
                    ? "bg-[#4E4619] text-white shadow-lg"
                    : "bg-transparent text-gray-400 hover:bg-[#2a303c] hover:text-white"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-5 text-center">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 hover:text-red-400 text-gray-400 border border-transparent text-[12px] font-bold transition-all uppercase tracking-widest mb-4"
          >
            <LogOut size={16} /> Odhlásit se
          </button>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            © 2026 SYNCRO
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

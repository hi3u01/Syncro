import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Activity } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-[250px] bg-[#111827] text-white flex flex-col min-h-screen shadow-[4px_0_10px_rgba(0,0,0,0.1)]">
      {/* App Logo / Header */}
      <div className="p-6 border-b border-[#374151] mb-5 flex items-center gap-[10px]">
        <Activity color="#3B82F6" size={28} />
        <h2 className="m-0 text-[24px] tracking-[1px]">SYNCRO</h2>
      </div>

      {/* Navigation Links */}
      <nav className="px-4 flex-1">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 no-underline rounded-lg mb-2 font-medium transition-all duration-200 ${
            isActive("/dashboard")
              ? "bg-[#1F2937] text-[#60A5FA]"
              : "bg-transparent text-[#D1D5DB]"
          }`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          to="/teams"
          className={`flex items-center gap-3 px-4 py-3 no-underline rounded-lg mb-2 font-medium transition-all duration-200 ${
            isActive("/teams")
              ? "bg-[#1F2937] text-[#60A5FA]"
              : "bg-transparent text-[#D1D5DB]"
          }`}
        >
          <Users size={20} />
          Týmy
        </Link>
      </nav>

      {/* Footer area */}
      <div className="p-5 text-[12px] text-[#6B7280] text-center">
        © 2026 SYNCRO
      </div>
    </aside>
  );
};

export default Sidebar;

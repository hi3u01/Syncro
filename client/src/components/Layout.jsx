import { useContext, useState } from "react";
import { Menu } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showSidebar = !!user;

  return (
    <div className="flex min-h-screen bg-[#030303] text-white">
      {showSidebar && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-1 flex-col min-w-0">
        {showSidebar && (
          <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 border-b border-[#2a303c] bg-[#1a1a1a] p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Otevřít menu"
              className="text-gray-300 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <span className="text-2xl font-black tracking-tighter italic text-white">
              SYNCRO
            </span>
          </header>
        )}

        <main className="flex-1 p-5 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

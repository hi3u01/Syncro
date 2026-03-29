import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);

  const showSidebar = user?.role === "coach";

  return (
    <div className="flex min-h-screen bg-[#030303] text-white">
      {showSidebar && <Sidebar />}

      <main
        className={`flex-1 p-5 overflow-y-auto ${!showSidebar ? "flex flex-col items-center justify-center" : ""}`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;

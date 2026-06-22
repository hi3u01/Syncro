import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);

  const showSidebar = !!user;

  return (
    <div className="flex min-h-screen bg-[#030303] text-white">
      {showSidebar && <Sidebar />}

      <main className="flex-1 p-5 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Layout;

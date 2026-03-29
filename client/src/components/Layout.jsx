import Sidebar from "./Sidebar";

// The 'children' prop represents whatever page is currently being viewed
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#030303]">
      {/* Sidebar má pevnou šířku definovanou uvnitř své komponenty */}
      <Sidebar />

      {/* Main obsah vyplní zbytek (flex-1) a zajistí scrollování */}
      <main className="flex-1 p-5 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Layout;

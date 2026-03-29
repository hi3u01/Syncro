import Sidebar from "./Sidebar";

// The 'children' prop represents whatever page is currently being viewed
const Layout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#030303",
      }}
    >
      <Sidebar />
      <main style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

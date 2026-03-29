import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Activity } from "lucide-react";

const Sidebar = () => {
  // Get current URL path to highlight the active menu item
  const location = useLocation();

  // Helper function to determine if a link is active
  const isActive = (path) => location.pathname === path;

  // Base styling for links
  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    textDecoration: "none",
    borderRadius: "8px",
    marginBottom: "8px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  };

  return (
    <aside
      style={{
        width: "250px",
        backgroundColor: "#111827", // Dark theme for sidebar
        color: "white",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Full height
        boxShadow: "4px 0 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* App Logo / Header */}
      <div
        style={{
          padding: "24px",
          borderBottom: "1px solid #374151",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Activity color="#3B82F6" size={28} />
        <h2 style={{ margin: 0, fontSize: "24px", letterSpacing: "1px" }}>
          SYNCRO
        </h2>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: "0 16px", flex: 1 }}>
        <Link
          to="/dashboard"
          style={{
            ...linkStyle,
            backgroundColor: isActive("/dashboard") ? "#1F2937" : "transparent",
            color: isActive("/dashboard") ? "#60A5FA" : "#D1D5DB",
          }}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          to="/teams"
          style={{
            ...linkStyle,
            backgroundColor: isActive("/teams") ? "#1F2937" : "transparent",
            color: isActive("/teams") ? "#60A5FA" : "#D1D5DB",
          }}
        >
          <Users size={20} />
          Týmy
        </Link>
      </nav>

      {/* Footer area of sidebar (optional) */}
      <div
        style={{
          padding: "20px",
          fontSize: "12px",
          color: "#6B7280",
          textAlign: "center",
        }}
      >
        © 2026 SYNCRO
      </div>
    </aside>
  );
};

export default Sidebar;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import Calendar from "./pages/Calendar";
import Players from "./pages/Players";
import PlayerDetail from "./pages/PlayerDetail";
import MyProgram from "./pages/MyProgram";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Načítání...</div>;

  const guarded = (element, role) => {
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/dashboard" />;
    return <Layout>{element}</Layout>;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" />}
        />

        <Route path="/dashboard" element={guarded(<Dashboard />)} />
        <Route path="/profile" element={guarded(<Profile />)} />

        {/* Coach-only */}
        <Route path="/teams" element={guarded(<Teams />, "coach")} />
        <Route path="/players" element={guarded(<Players />, "coach")} />
        <Route
          path="/players/:id"
          element={guarded(<PlayerDetail />, "coach")}
        />
        <Route path="/calendar" element={guarded(<Calendar />, "coach")} />

        {/* Player-only */}
        <Route path="/my-program" element={guarded(<MyProgram />, "player")} />
        <Route path="/history" element={guarded(<History />, "player")} />

        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

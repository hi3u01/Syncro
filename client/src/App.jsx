import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const { user, loading } = useContext(AuthContext);

  // Zatímco se načítají data z localStorage, ukážeme prázdnou stránku (nebo spinner)
  if (loading) return <div>Načítání...</div>;

  return (
    <Router>
      <Routes>
        {/* Pokud není uživatel přihlášen, ukážeme Login */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Chráněná cesta - pokud není přihlášen, pošleme ho na login */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Jakákoliv jiná neexistující adresa přesměruje na správné místo */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

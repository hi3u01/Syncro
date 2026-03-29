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
import Layout from "./components/Layout";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Načítání...</div>;

  return (
    <Router>
      <Routes>
        {/* Veřejné cesty (BEZ Sidebaru) */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" />}
        />

        {/* Chráněné cesty (S Layoutem a Sidebarem) */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/teams"
          element={
            user ? (
              <Layout>
                <Teams />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Přesměrování všeho ostatního */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

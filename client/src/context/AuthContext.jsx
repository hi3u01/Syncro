import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data } = await API.get("/auth/me");
      setUser((prev) => {
        const merged = { ...data, token: prev?.token };
        localStorage.setItem("profile", JSON.stringify(merged));
        return merged;
      });
    } catch {
      // Ignore: keep the stored profile if the refresh fails.
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("profile");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      if (parsed?.token) refreshUser();
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("profile", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("profile");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

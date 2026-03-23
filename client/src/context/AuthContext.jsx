import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Při prvním načtení aplikace se podíváme, jestli už nemáme uživatele v lokálním úložišti
  useEffect(() => {
    const storedUser = localStorage.getItem("profile");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Funkce pro přihlášení (uloží data do state i do prohlížeče)
  const login = (userData) => {
    localStorage.setItem("profile", JSON.stringify(userData));
    setUser(userData);
  };

  // Funkce pro odhlášení (smaže data)
  const logout = () => {
    localStorage.removeItem("profile");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

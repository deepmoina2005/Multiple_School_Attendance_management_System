import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("user");
        setAuthenticated(false);
        setUser(null);
      }
    } else {
      setAuthenticated(false);
      setUser(null);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("adminToken", userData.token);
    localStorage.setItem("user", JSON.stringify(userData.user));
    setAuthenticated(true);
    setUser(userData.user);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    setAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

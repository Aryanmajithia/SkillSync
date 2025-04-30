import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      }
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post("/api/auth/login", { email, password });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    setUser(user);
  };

  const register = async (data) => {
    const response = await axios.post("/api/auth/register", data);
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

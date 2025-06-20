import { useState, useEffect, createContext, useContext } from "react";
import api from "../lib/axios";

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
      console.log("Checking auth with token:", token ? token : "none");
      if (token) {
        const response = await api.get("/api/auth/me");
        console.log("Auth check response:", response.data);
        setUser(response.data);
      } else {
        console.log("No token found in localStorage during auth check.");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      localStorage.removeItem("token");
      console.log("Token removed from localStorage due to auth error.");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    setUser(user);
    console.log("Login: token set in localStorage:", token);
    console.log("Login: user set:", user);
  };

  const register = async (data) => {
    const response = await api.post("/api/auth/register", data);
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    setUser(user);
    console.log("Register: token set in localStorage:", token);
    console.log("Register: user set:", user);
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    console.log(
      "Logout: token removed from localStorage and user set to null."
    );
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

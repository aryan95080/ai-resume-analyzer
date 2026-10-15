import { createContext, useContext, useState } from "react";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = async (email, password) => {
    // FastAPI's OAuth2 login expects form data with a field named "username"
    const body = new URLSearchParams({ username: email, password });
    const res = await api.post("/auth/login", body);
    localStorage.setItem("token", res.data.access_token);
    setToken(res.data.access_token);
  };

  const register = (email, password) =>
    api.post("/auth/register", { email, password });

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
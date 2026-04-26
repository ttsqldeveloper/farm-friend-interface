import { createContext, useContext, useEffect, useState } from "react";
import { api, auth } from "@/lib/api";










const Ctx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!auth.getToken()) {setUser(null);return;}
    try {
      const res = await api.me();
      setUser(res.user || res);
    } catch {
      auth.clear();
      setUser(null);
    }
  };

  useEffect(() => {refresh().finally(() => setLoading(false));}, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    auth.setToken(res.token);
    setUser(res.user);
  };

  const register = async (data) => {
    const res = await api.register(data);
    auth.setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {auth.clear();setUser(null);};

  return <Ctx.Provider value={{ user, loading, login, register, logout, refresh }}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
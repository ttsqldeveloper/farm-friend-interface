import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, auth, User } from "@/lib/api";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { fullName: string; email: string; password: string; location?: string; cropTypes?: string[] }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!auth.getToken()) { setUser(null); return; }
    try {
      const res: any = await api.me();
      setUser(res.user || res);
    } catch {
      auth.clear();
      setUser(null);
    }
  };

  useEffect(() => { refresh().finally(() => setLoading(false)); }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    auth.setToken(res.token);
    setUser(res.user);
  };

  const register: AuthCtx["register"] = async (data) => {
    const res = await api.register(data);
    auth.setToken(res.token);
    setUser(res.user);
  };

  const logout = () => { auth.clear(); setUser(null); };

  return <Ctx.Provider value={{ user, loading, login, register, logout, refresh }}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

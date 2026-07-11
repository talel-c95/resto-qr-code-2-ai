import { createContext, useState, ReactNode, useEffect } from "react";
import { User } from "@/types/auth.types";
import * as authService from "@/services/authService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
});
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login({ email, password });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.register({ name, email, password });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
        value={{ user, token, isAuthenticated: !!user, loading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/banking/types";
import { authApi } from "@/lib/auth/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, countryCode?: string, password?: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "instantglobal.auth.userId";
const TOKEN_KEY = "token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .verifyToken(token)
      .then((res) => {
        const u = res.user;
        setUser({ ...u, id: u.id || u._id } as User);
        localStorage.setItem(STORAGE_KEY, u.id || u._id);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const u = res.user;
    setUser({ ...u, id: u.id || u._id } as User);
    localStorage.setItem(STORAGE_KEY, u.id || u._id);
    localStorage.setItem(TOKEN_KEY, res.token);

    // Auto-redirect based on role
    if (u.isAdmin || u.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  const register = async (name: string, email: string, countryCode = "US", password = "ChangeMe123!") => {
    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ") || "User";
    const username = email.split("@")[0];
    const res = await authApi.register({
      firstName,
      lastName,
      username,
      email,
      password,
      country: countryCode,
    });
    const u = res.user;
    setUser({ ...u, id: u.id || u._id } as User);
    localStorage.setItem(STORAGE_KEY, u.id || u._id);
    localStorage.setItem(TOKEN_KEY, res.token || "");
    router.push("/dashboard");
    return { ...u, id: u.id || u._id } as User;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    router.push("/login");
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

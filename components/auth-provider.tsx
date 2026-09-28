"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiRequest, authRequest } from "@/lib/api";
import { clearStoredUser, getStoredUser, setStoredUser } from "@/lib/auth";
import type { ApiResponse, User } from "@/types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  setSessionUser: (user: User) => void;
  refreshUser: () => Promise<User | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await apiRequest<ApiResponse<User>>("/users/me", { auth: true });
      setUser(response.data);
      setStoredUser(response.data);
      return response.data;
    } catch {
      clearStoredUser();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setUser(getStoredUser());
    void refreshUser();

    const sync = () => setUser(getStoredUser());
    window.addEventListener("dap-auth-change", sync);
    return () => window.removeEventListener("dap-auth-change", sync);
  }, [refreshUser]);

  function setSessionUser(nextUser: User) {
    setStoredUser(nextUser);
    setUser(nextUser);
  }

  async function logout() {
    try {
      await authRequest<ApiResponse<null>>("logout", {
        method: "POST",
        body: JSON.stringify({}),
      });
    } finally {
      clearStoredUser();
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, setSessionUser, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

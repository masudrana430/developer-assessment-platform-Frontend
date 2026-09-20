"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import {
  clearAuthTokens,
  getAccessToken,
  getStoredUser,
  setAuthTokens,
  setStoredUser,
} from "@/lib/auth";
import type { ApiResponse, User } from "@/types";

type Session = {
  accessToken: string;
  refreshToken?: string;
  user: User;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  setSession: (session: Session) => void;
  refreshUser: () => Promise<User | null>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await apiRequest<ApiResponse<User>>("/users/me", { auth: true });
      setUser(response.data);
      setStoredUser(response.data);
      return response.data;
    } catch {
      clearAuthTokens();
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

  function setSession(session: Session) {
    setAuthTokens(session.accessToken, session.refreshToken);
    setStoredUser(session.user);
    setUser(session.user);
  }

  function logout() {
    clearAuthTokens();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, setSession, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../configs/axios";
import { setAccessToken, clearAccessToken } from "./token";

const AuthContext = createContext({
  user: null,
  ready: false,
  setUser: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // try refresh on load to hydrate access token and user
    let cancelled = false;
    (async () => {
      try {
        const r = await api.post("/auth/refresh");
        const token = r?.data?.data?.accessToken;
        if (token && !cancelled) {
          setAccessToken(token);
          // fetch current user profile
          const me = await api.get("/auth/me");
          if (!cancelled) {
            setUser(me?.data?.data || null);
          }
        }
      } catch (err) {
        console.warn("Auth hydrate failed", err?.message || err);
        if (!cancelled) {
          clearAccessToken();
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = async () => {
    // optimistic clear
    clearAccessToken();
    setUser(null);
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout API failed", err?.message || err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, ready, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

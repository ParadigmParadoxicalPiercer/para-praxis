import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../configs/axios";
import { setAccessToken, clearAccessToken } from "./token";

const AuthContext = createContext({
  user: null,
  ready: false,
  setUser: () => {},
  logout: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
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
      const path = typeof window !== "undefined" ? window.location?.pathname || "" : "";
      const onAuthScreen = path.startsWith("/auth/login") || path.startsWith("/auth/register");
      const justSignedOut = localStorage.getItem("signedOut") === "1";

      // Skip hydration on auth screens or immediately after explicit logout
      if (onAuthScreen || justSignedOut) {
        localStorage.removeItem("signedOut");
        setReady(true);
        return;
      }

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
        // 401 after logout or when no cookie is present is expected; keep quiet
        if (err?.response?.status !== 401) {
          console.warn("Auth hydrate failed", err?.message || err);
        }
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
    try {
      await api.post("/auth/logout");
      // mark an explicit sign-out so next load skips refresh once
      localStorage.setItem("signedOut", "1");
      setUser(null);
      clearAccessToken();
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

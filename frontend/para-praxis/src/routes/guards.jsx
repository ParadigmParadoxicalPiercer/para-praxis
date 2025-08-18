import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

// Use this to protect private pages
export function RequireAuth() {
  const { user, ready } = useAuth();

  // in loading state
  if (!ready) {
    return <div className="p-6 text-center">Checking session…</div>;
  }

  //if not logged in
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
}

// Use this to block login/register for already-logged-in users
export function RequireGuest() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && user) {
      navigate("/user", { replace: true });
    }
  }, [ready, user, navigate]);

  if (!ready) {
    return <div className="p-6 text-center">Loading…</div>;
  }
  if (user) {
    return null; // navigation already triggered
  }
  return <Outlet />;
}

export default { RequireAuth, RequireGuest };

// App Header: composes Logo, ToolsDropdown, and AuthSection. Exported as default.
import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import ToolsDropdown from "./ToolsDropdown";
import AuthSection from "./AuthSection";
import { useAuth } from "../../auth/AuthProvider";
import { clearAccessToken } from "../../auth/token";

export default function Header() {
  const auth = useAuth();
  const isLoggedIn = !!auth.user;
  const user = auth.user;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.logout();
    } finally {
      clearAccessToken();
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 grid grid-cols-3 items-center">
          <div className="flex items-center justify-start">
            <Logo />
          </div>
          <div className="flex items-center justify-center relative z-50">
            <ToolsDropdown />
          </div>
          <div className="flex items-center justify-end">
            <AuthSection isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </header>
  );
}

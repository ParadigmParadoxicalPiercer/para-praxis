import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./P5Header.css";
import { useAuth } from "../auth/AuthProvider";
import { clearAccessToken } from "../auth/token";

// ===== CONFIGURATION =====
const TOOL_LINKS = [
  { label: "Focus Timer", to: "/focus-timer" },
  { label: "Mood Journal", to: "/journal" },
  { label: "Task Manager", to: "/tasks" },
  { label: "Workout Plans", to: "/workouts" },
];

// ===== CUSTOM HOOKS =====

// ===== HEADER COMPONENTS =====
function HeaderLogo() {
  return (
    <Link className="logo-p5" to="/">
      <span className="logo-red">PARA</span>
      <span className="logo-white">PRAXIS</span>
    </Link>
  );
}

function ToolsDropdown() {
  const navigate = useNavigate();
  const [toolsOpen, setToolsOpen] = useState(false);

  const handleToolNavigation = (to) => {
    setToolsOpen(false);
    navigate(to);
  };

  const toolItemStyle = {
    padding: "11px 18px",
    fontSize: "1.18em",
    color: "#2563eb",
    fontWeight: "bold",
    fontFamily:
      "Quicksand, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
    borderRadius: "5px",
    transition: "background 0.11s, color 0.11s",
  };

  return (
    <div className="tools-dropdown" tabIndex={0}>
      <button
        className="tools-btn"
        onClick={() => setToolsOpen((prev) => !prev)}
        style={{ fontFamily: "Bebas Neue, Impact, Arial Black, sans-serif" }}
      >
        SELF-IMPROVEMENT TOOLS
        <span className="arrow">{toolsOpen ? "▲" : "▼"}</span>
      </button>
      {toolsOpen && (
        <ul className="tools-dropdown-menu">
          {TOOL_LINKS.map((tool) => (
            <li key={tool.label}>
              <button
                onClick={() => handleToolNavigation(tool.to)}
                className="w-full text-left bg-transparent border-none cursor-pointer block"
                style={toolItemStyle}
                onMouseEnter={(e) => {
                  e.target.style.background = "#2563eb";
                  e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#2563eb";
                }}
              >
                {tool.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AuthSection({ isLoggedIn, user, onLogout }) {
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <LoggedInText user={user} />
        <ProfileButton />
        <LogoutButton onLogout={onLogout} />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <LoginButton />
      <RegisterButton />
    </div>
  );
}

// ===== AUTH SUB-COMPONENTS =====
function LoggedInText({ user }) {
  return (
    <span className="user-greeting font-semibold text-blue-700 whitespace-nowrap text-sm md:text-base">
      Hi, {user?.name || "User"}
    </span>
  );
}

// Profile button removed for simpler, newbie-style header when logged in
function ProfileButton() {
  return (
    <Link
      className="comic-btn profile-btn bg-blue-600 hover:bg-blue-700 text-white border border-blue-700 shadow-sm"
      style={{ letterSpacing: "2px" }}
      to="/user"
    >
      PROFILE
    </Link>
  );
}

function LogoutButton({ onLogout }) {
  return (
    <button
      className="comic-btn logout-btn bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300"
      style={{ letterSpacing: "2px" }}
      onClick={onLogout}
    >
      LOGOUT
    </button>
  );
}

function LoginButton() {
  return (
    <Link className="comic-btn login-btn" to="/auth/login">
      LOGIN
    </Link>
  );
}

function RegisterButton() {
  return (
    <Link className="comic-btn register-btn" to="/auth/register">
      REGISTER
    </Link>
  );
}

// ===== MAIN HEADER COMPONENT =====
export default function P5Header() {
  const auth = useAuth();
  const isLoggedIn = !!auth.user;
  const user = auth.user;
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await auth.logout();
    } finally {
      clearAccessToken();
      // navigate to login page (or home) without full reload
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <header className="p5-header">
      <div className="header-section header-left">
        <HeaderLogo />
      </div>

      <div className="header-section header-center">
        <ToolsDropdown />
      </div>

      <div className="header-section header-right">
        <AuthSection
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
}

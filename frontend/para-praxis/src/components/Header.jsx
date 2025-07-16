import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import "./P5Header.css";

// ===== CONFIGURATION =====
const TOOL_LINKS = [
  { label: "Focus Timer", to: "/focus-timer" },
  { label: "Mood Journal", to: "/journal" },
  { label: "Task Manager", to: "/tasks" },
  { label: "Workout Plans", to: "/workouts" },
];

// ===== CUSTOM HOOKS =====
function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      if (token) {
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (error) {
            console.error("Error parsing user data:", error);
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
    };

    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        const token = e.newValue;
        setIsLoggedIn(!!token);
        if (!token) {
          setUser(null);
        }
      }
      if (e.key === "user" && e.newValue) {
        try {
          setUser(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
  };

  return { isLoggedIn, user, handleLogout };
}

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
    color: "#ef2f23",
    fontWeight: "bold",
    fontFamily: "Bebas Neue, Impact, Arial Black, sans-serif",
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
                  e.target.style.background = "#ef2f23";
                  e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#ef2f23";
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
      <>
        <UserGreeting user={user} />
        <ProfileButton />
        <LogoutButton onLogout={onLogout} />
      </>
    );
  }

  return (
    <>
      <LoginButton />
      <RegisterButton />
    </>
  );
}

// ===== AUTH SUB-COMPONENTS =====
function UserGreeting({ user }) {
  return (
    <span className="user-greeting text-white font-bold mr-4">
      Welcome, {user?.name || "User"}!
    </span>
  );
}

function ProfileButton() {
  return (
    <Link className="comic-btn profile-btn" to="/user">
      PROFILE
    </Link>
  );
}

function LogoutButton({ onLogout }) {
  return (
    <button className="comic-btn logout-btn" onClick={onLogout}>
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
  const { isLoggedIn, user, handleLogout } = useAuth();

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

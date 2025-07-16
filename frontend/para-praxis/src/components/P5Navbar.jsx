import React, { useState } from "react";
import "./P5Navbar.css";

const toolLinks = [
  { label: "Habit Tracker", href: "#" },
  { label: "Mood Journal", href: "#" },
  { label: "Goal Planner", href: "#" },
];

export default function P5Navbar() {
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <nav className="p5-navbar">
      <div className="navbar-left">
        {/* Logo/Wordmark */}
        <div className="logo-p5">
          <span className="logo-red">PARA</span>
          <span className="logo-white">PRAXIS</span>
        </div>
        <div
          className="tools-dropdown"
          tabIndex={0}
          onBlur={() => setToolsOpen(false)}
        >
          <button
            className="tools-btn"
            onClick={() => setToolsOpen((o) => !o)}
            style={{
              fontFamily: "Bebas Neue, Impact, Arial Black, sans-serif",
            }}
          >
            SELF-IMPROVEMENT TOOLS
            <span className="arrow">{toolsOpen ? "▲" : "▼"}</span>
          </button>
          {toolsOpen && (
            <ul className="tools-dropdown-menu">
              {toolLinks.map((tool) => (
                <li key={tool.label}>
                  <a href={tool.href}>{tool.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-right">
        <button className="comic-btn login-btn">LOGIN</button>
        <button className="comic-btn register-btn">REGISTER</button>
      </div>
    </nav>
  );
}

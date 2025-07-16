import React from "react";
import { Link } from "react-router";

// Example props: pass image URL via props or hardcode it here
const HERO_BG = "/zeus-p5.png"; // Zeus background from public folder

export default function HeroSection() {
  return (
    <section className="flex-1 relative w-full flex items-center justify-center bg-black overflow-hidden">
      {/* Background image with Persona5 overlay */}
      <img
        src={HERO_BG}
        alt="Persona5 Themed Background"
        className="absolute inset-0 w-full h-fit object-cover z-0"
        draggable={false}
      />
      {/* Black + Red Persona5 overlay for dramatic effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-red-900/60 to-black/80 z-10" />
      {/* Persona5 jagged border edge at bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full z-20"
        height="60"
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* <path
          d="M0 60 L240 40 L480 60 L720 30 L960 60 L1200 40 L1440 60 V0 H0 V60 Z"
          fill="#111"
        /> */}
        <path
          d="M0 60 L120 45 L360 55 L600 37 L900 52 L1200 42 L1440 60"
          stroke="#e11d48"
          strokeWidth="6"
          fill="none"
        />
      </svg>
      {/* Content */}
      <div className="relative z-30 text-center flex flex-col items-center justify-center px-6">
        <h1
          className="text-5xl md:text-7xl font-extrabold uppercase tracking-tight drop-shadow-[2px_4px_0_rgba(0,0,0,0.6)]"
          style={{
            fontFamily: "'Bebas Neue', Impact, Arial Black, sans-serif",
            letterSpacing: "0.08em",
          }}
        >
          SPARKS
          <br className="hidden md:inline" />
          <span className="text-red-500 font-black persona5-highlight px-2">
            Your Future!
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-2xl font-semibold text-white/90 max-w-xl mx-auto persona5-shadow">
          Track habits. Reflect on your journey. Achieve your goals.
          <br />
          <span className="text-yellow-300 font-black">PARA-PRAXIS</span> have
          your back!
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/auth/register"
            className="rounded-md bg-red-600 hover:bg-yellow-400 hover:text-black transition-all text-white text-xl px-8 py-3 font-extrabold border-4 border-black shadow-lg uppercase tracking-wider persona5-btn"
          >
            Get Started
          </Link>
          <Link
            to="/auth/login"
            className="rounded-md bg-white hover:bg-yellow-400 hover:text-black transition-all text-red-700 text-xl px-8 py-3 font-extrabold border-4 border-black shadow-lg uppercase tracking-wider persona5-btn"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}

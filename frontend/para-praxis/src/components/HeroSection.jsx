import React from "react";
import { Link } from "react-router";

// Example props: pass image URL via props or hardcode it here
const HERO_BG = "/bluewhite_background.png"; // Zeus background from public folder

export default function HeroSection() {
  return (
    <section className="flex-1 relative w-full flex items-center justify-center bg-white overflow-hidden">
      <img
        src={HERO_BG}
        alt="Black-white Themed Background"
        className="absolute inset-0 w-full h-fit object-cover z-0"
        draggable={false}
      />
      {/* Subtle blue gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-blue-50 to-white/0 z-10" />
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
          stroke="#93c5fd"
          strokeWidth="4"
          fill="none"
        />
      </svg>
      {/* Content */}
      <div className="relative z-30 text-center flex flex-col items-center justify-center px-6">
        <h1
          className="text-5xl md:text-7xl font-extrabold uppercase tracking-tight drop-shadow-[2px_4px_0_rgba(0,0,0,0.6)]"
          style={{
            fontFamily:
              "Quicksand, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
            letterSpacing: "0.03em",
          }}
        >
          Build
          <br className="hidden md:inline" />
          <span className="text-blue-600 font-black px-2">Your Future</span>
        </h1>
        <p className="mt-6 text-lg md:text-2xl font-semibold text-slate-700 max-w-xl mx-auto">
          Track habits. Reflect on your journey. Achieve your goals.
          <br />
          <span className="text-blue-600 font-black">PARA-PRAXIS</span> has your
          back.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/auth/register"
            className="rounded-md bg-blue-600 hover:bg-blue-700 transition-all text-white text-xl px-8 py-3 font-semibold border border-blue-700 shadow-sm tracking-wide"
          >
            Get Started
          </Link>
          <Link
            to="/auth/login"
            className="rounded-md bg-white hover:bg-blue-50 transition-all text-blue-700 text-xl px-8 py-3 font-semibold border border-slate-200 shadow-sm tracking-wide"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}

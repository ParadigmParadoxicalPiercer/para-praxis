// Registration screen for new users; pairs RegisterForm with themed visual.
import React from "react";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex-1 relative w-full flex overflow-hidden items-stretch">
      {/* Background and overlay as before */}
      <img
        src="/registerwallpaper.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        draggable={false}
      />
      <div className="absolute inset-0 pointer-events-none" />
      <div className="relative z-20 flex flex-col md:flex-row w-full items-stretch">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 py-12 sm:px-8">
          <div className="max-w-lg text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg mb-6 tracking-tight">
              Forge Your Destiny
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 mb-4">
              Master Your Craft
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600">
              Shape yourself with the fire of determination. Join the forge and
              craft your path to excellence.
            </p>
          </div>
        </div>
        {/* Use your new component here */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-6 sm:px-8">
          <div className="w-full max-w-2xl">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}

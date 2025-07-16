import React from "react";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex-1 relative w-full flex overflow-hidden items-stretch">
      {/* Background PNG image */}
      <img
        src="/ganesh.png"
        alt="Background"
        className="absolute inset-0 w-fit h-fit z-0 pointer-events-none"
        draggable={false}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-red-900 to-black opacity-80 z-10 pointer-events-none" />

      <div className="relative z-20 flex w-full items-stretch">
        {/* Left half with wording */}
        <div className="w-1/2 flex flex-col justify-center items-center px-4 py-12 sm:px-8">
          <div className="max-w-lg text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg mb-6 tracking-tight">
              Welcome Back, Seeker!
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-red-200 drop-shadow mb-4">
              Remove Your Obstacles
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/80">
              Begin anew with wisdom. Log in and continue your path to success.
            </p>
          </div>
        </div>
        {/* Right half: center form */}
        <div className="w-1/2 flex items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-2xl">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

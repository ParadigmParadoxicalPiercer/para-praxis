// Brief: Public login page; wraps LoginForm with a simple layout.
import React from "react";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex-1 relative w-full flex overflow-hidden items-stretch">
      {/* Background PNG image */}
      <img
        src="/login.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        draggable={false}
      />
      {/* Light blue overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-blue-300 to-white/0 z-10 pointer-events-none" />

      <div className="relative z-20 flex flex-col md:flex-row w-full items-stretch">
        {/* Left half with wording */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 py-12 sm:px-8">
          <div className="max-w-lg text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg mb-6 tracking-tight">
              Welcome Back, Seeker!
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-700 mb-4">
              Welcome back
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600">
              Begin anew with wisdom. Log in and continue your path to success.
            </p>
          </div>
        </div>
        {/* Right half: center form */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-2xl">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

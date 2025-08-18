import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useLoginStore } from "../stores/useLoginStore";

export default function LoginForm() {
  const { form, errors, serverError, loading, setFormField, handleSubmit } =
    useLoginStore();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    handleSubmit(e, (user) => {
      if (user) setUser(user);
      navigate("/user");
    });
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      )}
      <form
        onSubmit={handleFormSubmit}
        aria-busy={loading}
        className={`bg-white rounded-2xl px-6 py-8 shadow-lg border border-slate-200 persona5-form ${
          loading ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <h2 className="text-4xl font-extrabold text-center mt-2 mb-6 text-blue-600 persona5-font">
          LOGIN
        </h2>
        {serverError && (
          <div className="mb-3 bg-blue-50 text-blue-700 px-4 py-2 rounded border border-blue-200 text-center font-semibold">
            {serverError}
          </div>
        )}
        <div className="mb-3">
          <label
            className="block font-bold text-slate-700 mb-1"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            className={`w-full px-4 py-2 rounded border border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none font-medium ${
              errors.email ? "border-red-400" : ""
            }`}
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setFormField("email", e.target.value)}
            disabled={loading}
            required
          />
          {errors.email && (
            <div className="text-red-500 font-medium mt-1">{errors.email}</div>
          )}
        </div>
        <div className="mb-5">
          <label
            className="block font-bold text-slate-700 mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            className={`w-full px-4 py-2 rounded border border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none font-medium ${
              errors.password ? "border-red-400" : ""
            }`}
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setFormField("password", e.target.value)}
            disabled={loading}
            required
          />
          {errors.password && (
            <div className="text-red-500 font-medium mt-1">
              {errors.password}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold py-3 w-full rounded text-lg border border-blue-700 shadow-sm tracking-wide persona5-btn"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Take Your Heart!"}
        </button>
        <div className="mt-4 text-center mb-6">
          <Link
            to="/auth/register"
            className="text-blue-700 hover:underline font-semibold"
          >
            Don't have an account? Register
          </Link>
        </div>
      </form>
    </div>
  );
}

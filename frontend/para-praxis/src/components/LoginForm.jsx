import React from "react";
import { Link } from "react-router";
import { useLoginStore } from "../stores/useLoginStore";

export default function LoginForm() {
  const { form, errors, serverError, loading, setFormField, handleSubmit } =
    useLoginStore();

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black/90 rounded-2xl px-6 py-8 shadow-2xl border-4 border-white persona5-form"
    >
      <h2 className="text-5xl font-black text-center mt-4 mb-6 text-red-600 drop-shadow persona5-font">
        LOGIN
      </h2>
      {serverError && (
        <div className="mb-3 bg-red-700/80 text-white px-4 py-2 rounded border-2 border-red-300 text-center font-bold shadow">
          {serverError}
        </div>
      )}
      <div className="mb-3">
        <label className="block font-bold text-white mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          className={`w-full px-4 py-2 rounded border-2 border-black bg-white/90 text-black focus:border-red-600 outline-none font-bold ${
            errors.email ? "border-red-500" : ""
          }`}
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setFormField("email", e.target.value)}
          disabled={loading}
          required
        />
        {errors.email && (
          <div className="text-red-400 font-bold mt-1">{errors.email}</div>
        )}
      </div>
      <div className="mb-5">
        <label className="block font-bold text-white mb-1" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          className={`w-full px-4 py-2 rounded border-2 border-black bg-white/90 text-black focus:border-red-600 outline-none font-bold ${
            errors.password ? "border-red-500" : ""
          }`}
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setFormField("password", e.target.value)}
          disabled={loading}
          required
        />
        {errors.password && (
          <div className="text-red-400 font-bold mt-1">{errors.password}</div>
        )}
      </div>
      <button
        type="submit"
        className="bg-red-600 hover:bg-yellow-300 hover:text-black transition-all text-white font-black py-3 w-full rounded uppercase text-lg border-4 border-black shadow-lg tracking-wider persona5-btn"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Take Your Heart!"}
      </button>
      <div className="mt-4 text-center mb-6">
        <Link
          to="/auth/register"
          className="text-yellow-300 hover:underline font-bold"
        >
          Don't have an account? Register
        </Link>
      </div>
    </form>
  );
}

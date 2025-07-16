import React from "react";
import { Link } from "react-router";
import { useRegisterStore } from "../stores/useRegisterStore";

export default function RegisterForm() {
  const { form, errors, serverError, loading, setFormField, handleSubmit } =
    useRegisterStore();

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black/90 rounded-2xl px-6 shadow-2xl border-3 border-white persona5-form"
    >
      <h2 className="text-5xl font-black text-center mt-4 mb-2 text-red-600 drop-shadow persona5-font">
        REGISTER
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
      <div className="mb-3">
        <label className="block font-bold text-white mb-1" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          className={`w-full px-4 py-2 rounded border-2 border-black bg-white/90 text-black focus:border-red-600 outline-none font-bold ${
            errors.username ? "border-red-500" : ""
          }`}
          type="text"
          autoComplete="username"
          value={form.username}
          onChange={(e) => setFormField("username", e.target.value)}
          disabled={loading}
          required
        />
        {errors.username && (
          <div className="text-red-400 font-bold mt-1">{errors.username}</div>
        )}
      </div>
      <div className="mb-3">
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
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setFormField("password", e.target.value)}
          disabled={loading}
          required
        />
        {errors.password && (
          <div className="text-red-400 font-bold mt-1">{errors.password}</div>
        )}
      </div>
      <div className="mb-5">
        <label className="block font-bold text-white mb-1" htmlFor="confirm">
          Confirm Password
        </label>
        <input
          id="confirm"
          name="confirm"
          className={`w-full px-4 py-2 rounded border-2 border-black bg-white/90 text-black focus:border-red-600 outline-none font-bold ${
            errors.confirm ? "border-red-500" : ""
          }`}
          type="password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={(e) => setFormField("confirm", e.target.value)}
          disabled={loading}
          required
        />
        {errors.confirm && (
          <div className="text-red-400 font-bold mt-1">{errors.confirm}</div>
        )}
      </div>
      <button
        type="submit"
        className="bg-red-600 hover:bg-yellow-300 hover:text-black transition-all text-white font-black py-3 w-full rounded uppercase text-lg border-4 border-black shadow-lg tracking-wider persona5-btn"
        disabled={loading}
      >
        {loading ? "Registering..." : "Join the Para-Praxis!"}
      </button>
      <div className="mt-4 text-center mb-6">
        <Link
          to="/auth/login"
          className="text-yellow-300 hover:underline font-bold"
        >
          Already have an account? Login
        </Link>
      </div>
    </form>
  );
}

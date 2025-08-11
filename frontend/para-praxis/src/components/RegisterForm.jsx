import React from "react";
import { Link } from "react-router";
import { useRegisterStore } from "../stores/useRegisterStore";

export default function RegisterForm() {
  const { form, errors, serverError, loading, setFormField, handleSubmit } =
    useRegisterStore();

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl px-6 py-8 shadow-lg border border-slate-200 persona5-form"
    >
      <h2 className="text-4xl font-extrabold text-center mt-2 mb-6 text-blue-600 persona5-font">
        REGISTER
      </h2>
      {serverError && (
        <div className="mb-3 bg-blue-50 text-blue-700 px-4 py-2 rounded border border-blue-200 text-center font-semibold">
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
      <div className="mb-3">
        <label className="block font-bold text-white mb-1" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          className={`w-full px-4 py-2 rounded border border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none font-medium ${
            errors.username ? "border-red-400" : ""
          }`}
          type="text"
          autoComplete="username"
          value={form.username}
          onChange={(e) => setFormField("username", e.target.value)}
          disabled={loading}
          required
        />
        {errors.username && (
          <div className="text-red-500 font-medium mt-1">{errors.username}</div>
        )}
      </div>
      <div className="mb-3">
        <label className="block font-bold text-white mb-1" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          className={`w-full px-4 py-2 rounded border border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none font-medium ${
            errors.password ? "border-red-400" : ""
          }`}
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setFormField("password", e.target.value)}
          disabled={loading}
          required
        />
        {errors.password && (
          <div className="text-red-500 font-medium mt-1">{errors.password}</div>
        )}
      </div>
      <div className="mb-5">
        <label className="block font-bold text-white mb-1" htmlFor="confirm">
          Confirm Password
        </label>
        <input
          id="confirm"
          name="confirm"
          className={`w-full px-4 py-2 rounded border border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none font-medium ${
            errors.confirm ? "border-red-400" : ""
          }`}
          type="password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={(e) => setFormField("confirm", e.target.value)}
          disabled={loading}
          required
        />
        {errors.confirm && (
          <div className="text-red-500 font-medium mt-1">{errors.confirm}</div>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold py-3 w-full rounded text-lg border border-blue-700 shadow-sm tracking-wide persona5-btn"
        disabled={loading}
      >
        {loading ? "Registering..." : "Join the Para-Praxis!"}
      </button>
      <div className="mt-4 text-center mb-6">
        <Link
          to="/auth/login"
          className="text-blue-700 hover:underline font-semibold"
        >
          Already have an account? Login
        </Link>
      </div>
    </form>
  );
}

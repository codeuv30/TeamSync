import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";

import {
  EyeIcon,
  EyeOffIcon,
  GoogleIcon,
  GithubIcon,
  SpinnerIcon,
  ArrowRightIcon,
} from "../../../../assets/icons";
import useAuth from "../../hooks/useAuth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.mode);
  const dark = theme === "dark";

  const reduxError = useSelector((state) => state.auth.error);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [oauthLoading, setOauthLoading] = useState(null);

  const { register, handleSubmit, errors, isSubmitting, touchedFields, onLoginSubmit } = useAuth();

  // Prefer a freshly-thrown local error, otherwise fall back to whatever
  // the Redux auth slice last set (e.g. from a rejected login thunk).
  const displayedError = serverError || reduxError;

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      onLoginSubmit(data);
    } catch (err) {
      setServerError(err?.message || "Something went wrong. Please try again.");
    }
  };

  const handleOAuth = async (provider) => {
    setServerError(null);
    setOauthLoading(provider);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: dark ? "#0a0a0f" : "#f8f8fc" }}
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 50% at 50% 0%, ${
            dark ? "rgba(124,58,237,0.12)" : "rgba(124,58,237,0.06)"
          } 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[400px]">
        {/* Card gradient border */}
        <div
          className="rounded-2xl p-px"
          style={{
            background: dark
              ? "linear-gradient(to bottom, rgba(139,92,246,0.4), rgba(139,92,246,0.1), transparent)"
              : "linear-gradient(to bottom, rgba(139,92,246,0.5), rgba(139,92,246,0.15), transparent)",
            boxShadow: dark
              ? "0 0 60px -15px rgba(124,58,237,0.35)"
              : "0 4px 24px rgba(124,58,237,0.12)",
          }}
        >
          <div
            className="rounded-2xl px-8 py-9"
            style={{ background: dark ? "rgba(19,18,26,0.95)" : "#ffffff" }}
          >
            {/* Logo */}
            <div className="flex flex-col items-center text-center mb-7">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-900/30 mb-3">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" aria-hidden="true">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
                </svg>
              </div>
              <h1
                className="font-semibold text-[15px] tracking-tight"
                style={{ color: dark ? "#ffffff" : "#0f0f14" }}
              >
                TeamSync
              </h1>
              <p className="text-[13px] mt-1" style={{ color: dark ? "#9ca3af" : "#6b7280" }}>
                Sign in to your workspace
              </p>
            </div>

            {/* Server / Redux error */}
            {displayedError && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2 rounded-lg px-3 py-2.5 text-[13px]"
                style={{
                  border: `1px solid ${dark ? "rgba(239,68,68,0.3)" : "#fca5a5"}`,
                  background: dark ? "rgba(239,68,68,0.1)" : "#fef2f2",
                  color: dark ? "#fca5a5" : "#dc2626",
                }}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h.01a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                <span>{displayedError}</span>
              </div>
            )}

            {/* OAuth buttons */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {[
                { id: "google", label: "Google", Icon: GoogleIcon },
                { id: "github", label: "GitHub", Icon: GithubIcon },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleOAuth(id)}
                  disabled={oauthLoading !== null || isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  style={{
                    border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#e5e7eb"}`,
                    background: dark ? "rgba(255,255,255,0.03)" : "#f9fafb",
                    color: dark ? "#e5e7eb" : "#374151",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = dark ? "rgba(255,255,255,0.07)" : "#f3f4f6";
                    e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.2)" : "#d1d5db";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "#f9fafb";
                    e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.1)" : "#e5e7eb";
                  }}
                >
                  {oauthLoading === id ? <SpinnerIcon className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
                  {label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px flex-1" style={{ background: dark ? "rgba(255,255,255,0.1)" : "#e5e7eb" }} />
              <span className="text-[11px] uppercase tracking-wide" style={{ color: dark ? "#6b7280" : "#9ca3af" }}>
                or continue with email
              </span>
              <span className="h-px flex-1" style={{ background: dark ? "rgba(255,255,255,0.1)" : "#e5e7eb" }} />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] font-medium uppercase tracking-wide mb-1.5"
                  style={{ color: dark ? "rgba(196,181,253,0.9)" : "#6d28d9" }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="w-full rounded-lg px-3.5 py-2.5 text-[13.5px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/40"
                  style={{
                    background: dark ? "rgba(255,255,255,0.04)" : "#f9fafb",
                    border: `1px solid ${
                      errors.email
                        ? dark ? "rgba(239,68,68,0.6)" : "#f87171"
                        : dark ? "rgba(255,255,255,0.1)" : "#e5e7eb"
                    }`,
                    color: dark ? "#f3f4f6" : "#111827",
                  }}
                  {...register("email", {
                    required: "Email is required.",
                    pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address." },
                  })}
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="mt-1.5 text-[12px]" style={{ color: dark ? "#f87171" : "#dc2626" }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-[11px] font-medium uppercase tracking-wide"
                    style={{ color: dark ? "rgba(196,181,253,0.9)" : "#6d28d9" }}
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[12px] transition-colors focus:outline-none focus-visible:underline"
                    style={{ color: dark ? "#a78bfa" : "#7c3aed" }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className="w-full rounded-lg px-3.5 py-2.5 pr-10 text-[13.5px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/40"
                    style={{
                      background: dark ? "rgba(255,255,255,0.04)" : "#f9fafb",
                      border: `1px solid ${
                        errors.password
                          ? dark ? "rgba(239,68,68,0.6)" : "#f87171"
                          : dark ? "rgba(255,255,255,0.1)" : "#e5e7eb"
                      }`,
                      color: dark ? "#f3f4f6" : "#111827",
                    }}
                    {...register("password", {
                      required: "Password is required.",
                      minLength: { value: 8, message: "Password must be at least 8 characters." },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors focus:outline-none"
                    style={{ color: dark ? "#6b7280" : "#9ca3af" }}
                  >
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" role="alert" className="mt-1.5 text-[12px]" style={{ color: dark ? "#f87171" : "#dc2626" }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Stay signed in */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="stayLoggedIn"
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded cursor-pointer accent-violet-500"
                  style={{
                    borderColor: dark ? "rgba(255,255,255,0.2)" : "#d1d5db",
                    background: dark ? "rgba(255,255,255,0.05)" : "#ffffff",
                  }}
                  {...register("stayLoggedIn")}
                />
                <label
                  htmlFor="stayLoggedIn"
                  className="text-[12.5px] cursor-pointer select-none"
                  style={{ color: dark ? "#9ca3af" : "#4b5563" }}
                >
                  Stay signed in
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-lg shadow-violet-900/20 hover:from-violet-500 hover:to-purple-500 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                {isSubmitting ? (
                  <>
                    <SpinnerIcon className="w-4 h-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-[12.5px] mt-5" style={{ color: dark ? "#9ca3af" : "#6b7280" }}>
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium transition-colors focus:outline-none focus-visible:underline"
                style={{ color: dark ? "#a78bfa" : "#7c3aed" }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] mt-5" style={{ color: dark ? "#4b5563" : "#9ca3af" }}>
          © 2026 TeamSync · Distributed Intelligence Platform
          <br />
          <Link to="/privacy" className="transition-colors hover:underline">Privacy Policy</Link>
          {" · "}
          <Link to="/terms" className="transition-colors hover:underline">Terms of Service</Link>
        </p>
      </div>
    </div>
  );
}

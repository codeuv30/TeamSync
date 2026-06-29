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
  CheckIcon,
  AlertIcon,
} from "../../../../assets/icons";
import useAuth from "../../hooks/useAuth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getStrength(password = "") {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthMeta = [
  { label: "Too short", barColor: "#ef4444", textColor: { dark: "#f87171", light: "#dc2626" } },
  { label: "Weak",      barColor: "#f97316", textColor: { dark: "#fb923c", light: "#ea580c" } },
  { label: "Fair",      barColor: "#eab308", textColor: { dark: "#facc15", light: "#ca8a04" } },
  { label: "Good",      barColor: "#8b5cf6", textColor: { dark: "#a78bfa", light: "#7c3aed" } },
  { label: "Strong",    barColor: "#10b981", textColor: { dark: "#34d399", light: "#059669" } },
];

export default function Register() {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.mode);
  const dark = theme === "dark";

  const reduxError = useSelector((state) => state.auth.error);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [oauthLoading, setOauthLoading] = useState(null);

  const { register, handleSubmit, watch, errors, isSubmitting, touchedFields, dirtyFields, onRegisterSubmit } = useAuth();

  const passwordValue = watch("password", "");
  const strength = getStrength(passwordValue);
  const meta = strengthMeta[strength];

  // Prefer a freshly-thrown local error, otherwise fall back to whatever
  // the Redux auth slice last set (e.g. from a rejected register thunk).
  const displayedError = serverError || reduxError;

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      onRegisterSubmit(data);
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
                Create your workspace account
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
                <AlertIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
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
              {/* Full name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-[11px] font-medium uppercase tracking-wide mb-1.5"
                  style={{ color: dark ? "rgba(196,181,253,0.9)" : "#6d28d9" }}
                >
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Cooper"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className="w-full rounded-lg px-3.5 py-2.5 text-[13.5px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/40"
                  style={{
                    background: dark ? "rgba(255,255,255,0.04)" : "#f9fafb",
                    border: `1px solid ${
                      errors.name
                        ? dark ? "rgba(239,68,68,0.6)" : "#f87171"
                        : dark ? "rgba(255,255,255,0.1)" : "#e5e7eb"
                    }`,
                    color: dark ? "#f3f4f6" : "#111827",
                  }}
                  {...register("name", {
                    required: "Full name is required.",
                    minLength: { value: 2, message: "Must be at least 2 characters." },
                  })}
                />
                {errors.name && (
                  <p id="name-error" role="alert" className="mt-1.5 text-[12px]" style={{ color: dark ? "#f87171" : "#dc2626" }}>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] font-medium uppercase tracking-wide mb-1.5"
                  style={{ color: dark ? "rgba(196,181,253,0.9)" : "#6d28d9" }}
                >
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className="w-full rounded-lg px-3.5 py-2.5 pr-9 text-[13.5px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/40"
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
                  {touchedFields.email && dirtyFields.email && !errors.email && (
                    <CheckIcon
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: dark ? "#34d399" : "#059669" }}
                    />
                  )}
                </div>
                {errors.email && (
                  <p id="email-error" role="alert" className="mt-1.5 text-[12px]" style={{ color: dark ? "#f87171" : "#dc2626" }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-[11px] font-medium uppercase tracking-wide mb-1.5"
                  style={{ color: dark ? "rgba(196,181,253,0.9)" : "#6d28d9" }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={errors.password ? "password-error" : "password-strength"}
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
                      validate: (v) => getStrength(v) >= 2 || "Add uppercase letters, numbers, or symbols.",
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

                {errors.password ? (
                  <p id="password-error" role="alert" className="mt-1.5 text-[12px]" style={{ color: dark ? "#f87171" : "#dc2626" }}>
                    {errors.password.message}
                  </p>
                ) : (
                  passwordValue.length > 0 && (
                    <div id="password-strength" className="mt-2 space-y-1.5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((s) => (
                          <div
                            key={s}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{
                              background: strength >= s
                                ? meta.barColor
                                : dark ? "rgba(255,255,255,0.1)" : "#e5e7eb",
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-[12px] font-medium" style={{ color: meta.textColor[dark ? "dark" : "light"] }}>
                        {meta.label} password
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-0.5 h-3.5 w-3.5 rounded cursor-pointer accent-violet-500"
                  aria-invalid={errors.terms ? "true" : "false"}
                  aria-describedby={errors.terms ? "terms-error" : undefined}
                  {...register("terms", { required: "You must accept the Terms to continue." })}
                />
                <div>
                  <label
                    htmlFor="terms"
                    className="text-[12.5px] cursor-pointer select-none leading-relaxed"
                    style={{ color: dark ? "#9ca3af" : "#4b5563" }}
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="transition-colors focus:outline-none focus-visible:underline"
                      style={{ color: dark ? "#a78bfa" : "#7c3aed" }}
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="transition-colors focus:outline-none focus-visible:underline"
                      style={{ color: dark ? "#a78bfa" : "#7c3aed" }}
                    >
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.terms && (
                    <p id="terms-error" role="alert" className="mt-1 text-[12px]" style={{ color: dark ? "#f87171" : "#dc2626" }}>
                      {errors.terms.message}
                    </p>
                  )}
                </div>
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
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-[12.5px] mt-5" style={{ color: dark ? "#9ca3af" : "#6b7280" }}>
              Already have an account?{" "}
              <Link
                to="/"
                className="font-medium transition-colors focus:outline-none focus-visible:underline"
                style={{ color: dark ? "#a78bfa" : "#7c3aed" }}
              >
                Log in
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
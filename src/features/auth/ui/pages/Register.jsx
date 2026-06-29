import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

// Same shared icon set as Login.jsx — keeps both screens dependency-free.
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
  return score; // 0-4
}

const strengthMeta = [
  { label: "Too short", barClass: "bg-red-500", textClass: "text-red-400" },
  { label: "Weak", barClass: "bg-orange-500", textClass: "text-orange-400" },
  { label: "Fair", barClass: "bg-yellow-400", textClass: "text-yellow-400" },
  { label: "Good", barClass: "bg-violet-400", textClass: "text-violet-300" },
  {
    label: "Strong",
    barClass: "bg-emerald-400",
    textClass: "text-emerald-400",
  },
];

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [oauthLoading, setOauthLoading] = useState(null); // "google" | "github" | null

  const { register, handleSubmit, watch, errors, isSubmitting, touchedFields, dirtyFields, onRegisterSubmit } = useAuth();

  const passwordValue = watch("password", "");
  const strength = getStrength(passwordValue);
  const meta = strengthMeta[strength];

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
      // Replace with your real OAuth redirect/flow
      await new Promise((resolve) => setTimeout(resolve, 900));
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0f] px-4 py-10 relative overflow-hidden">
      {/* ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(124,58,237,0.12) 0%, rgba(10,10,15,0) 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[400px]">
        {/* Card with gradient border */}
        <div className="rounded-2xl p-px bg-gradient-to-b from-violet-500/40 via-violet-500/10 to-transparent shadow-[0_0_60px_-15px_rgba(124,58,237,0.35)]">
          <div className="rounded-2xl bg-[#13121a]/95 backdrop-blur-xl px-8 py-9">
            {/* Logo */}
            <div className="flex flex-col items-center text-center mb-7">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-900/40 mb-3">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-white"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h1 className="text-white font-semibold text-[15px] tracking-tight">
                TeamSync
              </h1>
              <p className="text-gray-500 text-[13px] mt-1">
                Create your workspace account
              </p>
            </div>

            {/* Server-level error banner */}
            {serverError && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-[13px] text-red-300"
              >
                <AlertIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* OAuth buttons */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={oauthLoading !== null || isSubmitting}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[13px] font-medium text-gray-200 hover:bg-white/[0.07] hover:border-white/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#13121a]"
              >
                {oauthLoading === "google" ? (
                  <SpinnerIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <GoogleIcon className="w-4 h-4" />
                )}
                Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuth("github")}
                disabled={oauthLoading !== null || isSubmitting}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[13px] font-medium text-gray-200 hover:bg-white/[0.07] hover:border-white/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#13121a]"
              >
                {oauthLoading === "github" ? (
                  <SpinnerIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <GithubIcon className="w-4 h-4" />
                )}
                GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] uppercase tracking-wide text-gray-500">
                or continue with email
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              {/* Full name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-[11px] font-medium uppercase tracking-wide text-violet-300/90 mb-1.5"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Cooper"
                  aria-invalid={errors.fullName ? "true" : "false"}
                  aria-describedby={
                    errors.fullName ? "fullName-error" : undefined
                  }
                  className={`w-full rounded-lg bg-white/[0.04] border px-3.5 py-2.5 text-[13.5px] text-gray-100 placeholder:text-gray-500 outline-none transition-colors focus:ring-2 focus:ring-violet-500/40 ${
                    errors.fullName
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-white/10 focus:border-violet-500/60"
                  }`}
                  {...register("fullName", {
                    required: "Full name is required.",
                    minLength: {
                      value: 2,
                      message: "Must be at least 2 characters.",
                    },
                  })}
                />
                {errors.fullName && (
                  <p
                    id="fullName-error"
                    role="alert"
                    className="mt-1.5 text-[12px] text-red-400"
                  >
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] font-medium uppercase tracking-wide text-violet-300/90 mb-1.5"
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
                    className={`w-full rounded-lg bg-white/[0.04] border px-3.5 py-2.5 pr-9 text-[13.5px] text-gray-100 placeholder:text-gray-500 outline-none transition-colors focus:ring-2 focus:ring-violet-500/40 ${
                      errors.email
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-white/10 focus:border-violet-500/60"
                    }`}
                    {...register("email", {
                      required: "Email is required.",
                      pattern: {
                        value: EMAIL_PATTERN,
                        message: "Enter a valid email address.",
                      },
                    })}
                  />
                  {touchedFields.email &&
                    dirtyFields.email &&
                    !errors.email && (
                      <CheckIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                    )}
                </div>
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="mt-1.5 text-[12px] text-red-400"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-[11px] font-medium uppercase tracking-wide text-violet-300/90 mb-1.5"
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
                    aria-describedby={
                      errors.password ? "password-error" : "password-strength"
                    }
                    className={`w-full rounded-lg bg-white/[0.04] border px-3.5 py-2.5 pr-10 text-[13.5px] text-gray-100 placeholder:text-gray-500 outline-none transition-colors focus:ring-2 focus:ring-violet-500/40 ${
                      errors.password
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-white/10 focus:border-violet-500/60"
                    }`}
                    {...register("password", {
                      required: "Password is required.",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters.",
                      },
                      validate: (v) =>
                        getStrength(v) >= 2 ||
                        "Add uppercase letters, numbers, or symbols.",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {errors.password ? (
                  <p
                    id="password-error"
                    role="alert"
                    className="mt-1.5 text-[12px] text-red-400"
                  >
                    {errors.password.message}
                  </p>
                ) : (
                  passwordValue.length > 0 && (
                    <div id="password-strength" className="mt-2 space-y-1.5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((s) => (
                          <div
                            key={s}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              strength >= s ? meta.barClass : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-[12px] font-medium ${meta.textClass}`}
                      >
                        {meta.label} password
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-0.5 h-3.5 w-3.5 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-2 focus:ring-violet-500/40 focus:ring-offset-0 cursor-pointer accent-violet-500"
                  aria-invalid={errors.terms ? "true" : "false"}
                  aria-describedby={errors.terms ? "terms-error" : undefined}
                  {...register("terms", {
                    required: "You must accept the Terms to continue.",
                  })}
                />
                <div>
                  <label
                    htmlFor="terms"
                    className="text-[12.5px] text-gray-400 cursor-pointer select-none leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-violet-400 hover:text-violet-300 transition-colors focus:outline-none focus-visible:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-violet-400 hover:text-violet-300 transition-colors focus:outline-none focus-visible:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.terms && (
                    <p
                      id="terms-error"
                      role="alert"
                      className="mt-1 text-[12px] text-red-400"
                    >
                      {errors.terms.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-purple-500 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#13121a]"
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

            <p className="text-center text-[12.5px] text-gray-500 mt-5">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-violet-400 hover:text-violet-300 font-medium transition-colors focus:outline-none focus-visible:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-600 mt-5">
          © 2026 TeamSync · Distributed Intelligence Platform
          <br />
          <Link to="/privacy" className="hover:text-gray-400 transition-colors">
            Privacy Policy
          </Link>{" "}
          ·{" "}
          <Link to="/terms" className="hover:text-gray-400 transition-colors">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
}

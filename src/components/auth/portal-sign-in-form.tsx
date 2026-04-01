"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { SubmissionSuccessModal } from "@/components/forms/submission-success-modal";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "sign_in" | "sign_up";

type PortalSignInFormProps = {
  initialMessage?: string;
  initialMode?: AuthMode;
};

const ADMIN_PORTAL_EMAIL = "hello@tacklersconsulting.com";

async function persistPortalSession(accessToken: string, refreshToken: string) {
  const response = await fetch("/api/auth/session", {
    body: JSON.stringify({
      accessToken,
      refreshToken,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const payload = (await response.json().catch(() => ({}))) as { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Unable to persist the portal session.");
  }
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M21.81 10.04H12.4v3.92h5.39c-.23 1.26-.94 2.33-2 3.05v2.53h3.24c1.9-1.76 2.99-4.35 2.99-7.42 0-.69-.06-1.36-.21-2.08Z"
        fill="#4285F4"
      />
      <path
        d="M12.4 21.8c2.7 0 4.96-.89 6.62-2.41l-3.24-2.53c-.89.61-2.03.98-3.38.98-2.61 0-4.82-1.76-5.61-4.13H3.43v2.61A9.99 9.99 0 0 0 12.4 21.8Z"
        fill="#34A853"
      />
      <path
        d="M6.79 13.71A5.96 5.96 0 0 1 6.47 12c0-.59.11-1.16.32-1.71V7.68H3.43A9.99 9.99 0 0 0 2.4 12c0 1.62.39 3.16 1.03 4.32l3.36-2.61Z"
        fill="#FBBC05"
      />
      <path
        d="M12.4 6.16c1.47 0 2.79.51 3.82 1.49l2.86-2.86C17.36 3.18 15.1 2.2 12.4 2.2 8.49 2.2 5.12 4.44 3.43 7.68l3.36 2.61c.79-2.37 3-4.13 5.61-4.13Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6.75h16v10.5H4z" />
      <path d="m5 8 7 5 7-5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7.5 10.5h9a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18v-6a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M8.5 10.5v-2a3.5 3.5 0 1 1 7 0v2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function PortalSignInForm({
  initialMessage = "",
  initialMode = "sign_in",
}: PortalSignInFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [isResetPending, setIsResetPending] = useState(false);
  const [successTitle, setSuccessTitle] = useState("Account created");
  const [successMessage, setSuccessMessage] = useState("");
  const isSignIn = mode === "sign_in";
  const panelTitle = isSignIn ? "New to Tacklers?" : "Already registered?";
  const panelCta = isSignIn ? "Create account" : "Sign in";
  const panelBody = isSignIn
    ? "Create your portal access to view documents, track programme activity, and stay close to the work."
    : "Return to your portal to access delivery updates, documents, and the latest account activity.";
  const heading = isSignIn ? "Welcome back" : "Create your account";
  const intro = isSignIn
    ? "Sign in to continue to your Tacklers portal."
    : "Set up your Tacklers portal access in a few focused steps.";
  const emailDividerLabel = isSignIn ? "or sign in with email" : "or continue with email";
  const submitLabel = isSubmitting
    ? isSignIn
      ? "Signing in..."
      : "Creating account..."
    : isSignIn
      ? "Sign in"
      : "Create account";

  useEffect(() => {
    setMode(initialMode);
    setError("");
    setSuccessMessage("");
  }, [initialMode]);

  async function handleGoogleSignIn() {
    setError("");
    setSuccessMessage("");
    setIsGooglePending(true);

    const redirectTo = `${window.location.origin}/auth/callback?next=/client-hub`;
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      options: {
        redirectTo,
      },
      provider: "google",
    });

    if (googleError) {
      setError(googleError.message || "Unable to start Google sign-in.");
      setIsGooglePending(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      if (mode === "sign_up") {
        if (!fullName.trim()) {
          setError("Please enter your full name.");
          return;
        }

        if (password.length < 8) {
          setError("Use a password with at least 8 characters.");
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const redirectTo = `${window.location.origin}/auth/callback?next=/client-hub`;
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
            emailRedirectTo: redirectTo,
          },
        });

        if (signUpError) {
          setError(signUpError.message || "Unable to create your account right now.");
          return;
        }

        if (data.session) {
          await persistPortalSession(data.session.access_token, data.session.refresh_token);
          router.replace("/client-hub");
          router.refresh();
          return;
        }

        setMode("sign_in");
        setPassword("");
        setConfirmPassword("");
        setSuccessTitle("Account created");
        setSuccessMessage(
          "Your account has been created. Check your email to confirm it, then sign in to reach your dashboard.",
        );
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      if (normalizedEmail === ADMIN_PORTAL_EMAIL) {
        const response = await fetch("/api/admin/session", {
          body: JSON.stringify({ email: normalizedEmail, password }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          setError(payload.error ?? "Unable to sign in right now.");
          return;
        }

        router.replace("/admin");
        router.refresh();
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Unable to sign in right now.");
        return;
      }

      if (!data.session) {
        setError("No portal session was returned. Please try again.");
        return;
      }

      await persistPortalSession(data.session.access_token, data.session.refresh_token);
      router.replace("/client-hub");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleForgotPassword() {
    setError("");
    setSuccessMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setError("Enter your email first so we can send the reset link.");
      return;
    }

    if (normalizedEmail === ADMIN_PORTAL_EMAIL) {
      setError("Admin credentials are environment-backed. Contact support for admin password resets.");
      return;
    }

    setIsResetPending(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        body: JSON.stringify({ email: normalizedEmail }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string; message?: string };

      if (!response.ok) {
        setError(payload.error ?? "Unable to send reset email right now.");
        return;
      }

      setSuccessTitle("Reset email sent");
      setSuccessMessage(payload.message ?? "Check your inbox for the reset link.");
    } finally {
      setIsResetPending(false);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_35px_120px_rgba(15,23,42,0.24)]">
        <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
          <form className="grid gap-5 p-7 sm:p-10" onSubmit={handleSubmit}>
            <div>
              <p className="text-sm font-semibold text-slate-400">
                {isSignIn ? "Sign in to continue to Tacklers" : "Create access to the Tacklers portal"}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                {heading}
              </h1>
              <p className="mt-3 text-base leading-7 text-slate-500">{intro}</p>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting || isGooglePending}
              className="inline-flex h-13 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-[#8a0917]/25 hover:text-[#8a0917] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <GoogleIcon />
              {isGooglePending ? "Redirecting to Google..." : "Continue with Google"}
            </button>

            <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              <span>{emailDividerLabel}</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            {mode === "sign_up" ? (
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Full name
                <input
                  className="h-13 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-[#8a0917]/40 focus:bg-white"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </label>
            ) : null}

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Email
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center pl-4 text-slate-400">
                  <MailIcon />
                </span>
                <input
                  className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-[#8a0917]/40 focus:bg-white"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Password
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center pl-4 text-slate-400">
                  <LockIcon />
                </span>
                <input
                  className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-18 text-sm outline-none transition focus:border-[#8a0917]/40 focus:bg-white"
                  type={showPassword ? "text" : "password"}
                  placeholder={isSignIn ? "Enter your password" : "Create a password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={isSignIn ? "current-password" : "new-password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 inline-flex items-center px-4 text-xs font-semibold text-slate-500 transition hover:text-[#8a0917]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {mode === "sign_up" ? (
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Confirm password
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center pl-4 text-slate-400">
                    <LockIcon />
                  </span>
                  <input
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-18 text-sm outline-none transition focus:border-[#8a0917]/40 focus:bg-white"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    className="absolute inset-y-0 right-0 inline-flex items-center px-4 text-xs font-semibold text-slate-500 transition hover:text-[#8a0917]"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>
            ) : null}

            {isSignIn ? (
              <div className="-mt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    void handleForgotPassword();
                  }}
                  disabled={isSubmitting || isGooglePending || isResetPending}
                  className="text-sm font-semibold text-[#8a0917] transition hover:text-[#690711] disabled:opacity-60"
                >
                  {isResetPending ? "Sending reset link..." : "Forgot password?"}
                </button>
              </div>
            ) : null}

            {initialMessage ? <p className="text-sm font-semibold text-[#8a0917]">{initialMessage}</p> : null}
            {error ? <p className="text-sm font-semibold text-[#8a0917]">{error}</p> : null}

            <button
              type="submit"
              className="inline-flex h-13 w-full items-center justify-center gap-3 rounded-2xl bg-[#8a0917] px-5 text-sm font-semibold text-white transition hover:bg-[#690711] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting || isGooglePending || isResetPending}
            >
              <span>{submitLabel}</span>
              <ArrowIcon />
            </button>

            <p className="text-center text-sm text-slate-500 lg:hidden">
              {isSignIn ? "Need an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(isSignIn ? "sign_up" : "sign_in");
                  setError("");
                  setSuccessMessage("");
                }}
                className="font-semibold text-[#8a0917]"
              >
                {panelCta}
              </button>
            </p>
          </form>

          <aside className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#6b0f1a_0%,#8a0917_48%,#8a5521_100%)] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute -right-14 top-0 h-56 w-56 rounded-full bg-white/12 blur-sm" />
              <div className="absolute bottom-8 left-[-3.5rem] h-64 w-64 rounded-full bg-[#fdd835]/12 blur-sm" />
              <div className="absolute right-8 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-white/10 blur-sm" />
            </div>

            <div className="relative z-10">
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/media/TCG%20Logo.png"
                  alt="Tacklers Consulting Group logo"
                  width={184}
                  height={184}
                  className="h-24 w-36 object-contain"
                />
                <p className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-white/75">
                  Tacklers Consulting Group
                </p>
                <p className="mt-3 max-w-xs text-sm leading-6 text-white/78">
                  People-first Lean transformation that reduces waste, protects expertise, and builds capability that lasts.
                </p>
              </div>

              <div className="mt-10 rounded-[1.75rem] border border-white/15 bg-white/10 px-7 py-8 text-center backdrop-blur-sm">
                <div className="text-4xl leading-none text-[#fdd835]">“</div>
                <p className="mt-3 text-lg font-medium leading-8 text-white">
                  Results, not reports. Results that stick.
                </p>
                <p className="mt-4 text-sm text-white/70">
                  Practical access to your dashboard, documents, and delivery updates.
                </p>
              </div>
            </div>

            <div className="relative z-10 text-center">
              <p className="text-sm text-white/72">{panelTitle}</p>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/78">
                {panelBody}
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode(isSignIn ? "sign_up" : "sign_in");
                  setError("");
                  setSuccessMessage("");
                }}
                className="mt-6 inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
              >
                {panelCta}
              </button>
            </div>
          </aside>
        </div>
      </div>

      <SubmissionSuccessModal
        open={Boolean(successMessage)}
        title={successTitle}
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />
    </>
  );
}

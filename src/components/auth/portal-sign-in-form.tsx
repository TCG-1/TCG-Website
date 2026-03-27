"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type PortalSignInFormProps = {
  initialMessage?: string;
};

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

export function PortalSignInForm({ initialMessage = "" }: PortalSignInFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);

  return (
    <form
      className="grid gap-5 rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message || "Unable to sign in right now.");
          setIsSubmitting(false);
          return;
        }

        router.replace("/client-hub");
        router.refresh();
      }}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8a0917]">User access</p>
        <h1 className="mt-3 text-4xl font-light tracking-[-0.04em] text-slate-950">Sign in</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Access your Tacklers user dashboard and stay signed in until you log out manually.
        </p>
      </div>

      <button
        type="button"
        onClick={async () => {
          setError("");
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
        }}
        disabled={isSubmitting || isGooglePending}
        className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#8a0917]/20 hover:text-[#8a0917] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <GoogleIcon />
        {isGooglePending ? "Redirecting to Google..." : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        <span>or</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Email
        <input
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#8a0917]/30 focus:bg-white"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Password
        <input
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#8a0917]/30 focus:bg-white"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
      </label>

      {initialMessage ? <p className="text-sm font-semibold text-[#8a0917]">{initialMessage}</p> : null}
      {error ? <p className="text-sm font-semibold text-[#8a0917]">{error}</p> : null}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full bg-[#8a0917] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#690711] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting || isGooglePending}
      >
        {isSubmitting ? "Signing in..." : "Sign in to dashboard"}
      </button>
    </form>
  );
}

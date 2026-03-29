"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

type AdminSignInFormProps = {
  initialMessage?: string;
};

export function AdminSignInForm({ initialMessage = "" }: AdminSignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <form
      className="card grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");

        startTransition(async () => {
          try {
            const response = await fetch("/api/admin/session", {
              body: JSON.stringify({ email, password }),
              headers: { "Content-Type": "application/json" },
              method: "POST",
            });
            const payload = (await response.json()) as { error?: string };

            if (!response.ok) {
              setError(payload.error ?? "Unable to sign in right now.");
              return;
            }

            window.location.assign("/admin");
          } catch {
            setError("Unable to sign in right now.");
          }
        });
      }}
    >
      <div>
        <p className="eyebrow">Admin access</p>
        <h1 className="section-title">Sign in</h1>
        <p className="mt-3 text-slate-600">
          Log in with the deployment admin credentials to manage Tacklers content.
        </p>
      </div>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Work email
        <input
          className="input"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Password
        <div className="relative">
          <input
            className="input pr-12"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute inset-y-0 right-0 inline-flex items-center px-3 text-xs font-semibold text-slate-500 hover:text-[#8a0917]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </label>
      {initialMessage ? <p className="text-sm font-semibold text-[#8a0917]">{initialMessage}</p> : null}
      {error ? <p className="text-sm font-semibold text-[#8a0917]">{error}</p> : null}
      <button
        type="submit"
        className="button-primary w-full justify-center"
        disabled={!isHydrated || isPending}
        data-auth-ready={isHydrated ? "true" : "false"}
      >
        {!isHydrated ? "Preparing sign in..." : isPending ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-center text-sm text-slate-600">
        Need access?{" "}
        <Link href="/support" className="font-semibold text-[#8a0917]">
          Contact support
        </Link>
      </p>
    </form>
  );
}

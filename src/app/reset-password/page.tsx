"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || newPassword.length < 10) {
      setError("Use a stronger password with at least 10 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation must match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/update-password", {
        body: JSON.stringify({ confirmPassword, newPassword }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string; message?: string };

      if (!response.ok) {
        setError(payload.error ?? "Unable to update password right now.");
        return;
      }

      setSuccess(payload.message ?? "Password updated successfully.");
      setTimeout(() => {
        router.replace("/sign-in");
        router.refresh();
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="section-gap">
      <div className="container mx-auto max-w-xl px-6">
        <form
          className="grid gap-5 rounded-4xl border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
          onSubmit={handleSubmit}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8a0917]">Account recovery</p>
            <h1 className="mt-3 text-4xl font-light tracking-[-0.04em] text-slate-950">Set a new password</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Choose a new password for your portal account. After saving, you can sign in again with the updated password.
            </p>
          </div>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            New password
            <div className="relative">
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-16 text-sm outline-none transition focus:border-[#8a0917]/30 focus:bg-white"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((current) => !current)}
                className="absolute inset-y-0 right-0 inline-flex items-center px-4 text-xs font-semibold text-slate-500 hover:text-[#8a0917]"
                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Confirm password
            <div className="relative">
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-16 text-sm outline-none transition focus:border-[#8a0917]/30 focus:bg-white"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="absolute inset-y-0 right-0 inline-flex items-center px-4 text-xs font-semibold text-slate-500 hover:text-[#8a0917]"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error ? <p className="text-sm font-semibold text-[#8a0917]">{error}</p> : null}
          {success ? <p className="text-sm font-semibold text-emerald-700">{success}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#8a0917] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#690711] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Updating password..." : "Save new password"}
          </button>

          <p className="text-center text-sm text-slate-600">
            Remembered it?{" "}
            <Link href="/sign-in" className="font-semibold text-[#8a0917]">
              Back to sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

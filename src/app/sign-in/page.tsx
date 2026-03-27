"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Container } from "@/components/sections";
import { signInAdmin } from "@/lib/admin-auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <section className="section-gap">
      <Container>
        <div className="mx-auto max-w-xl">
          <div className="mb-6 grid grid-cols-2 rounded-full border border-black/10 bg-white p-1 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <Link
              href="/sign-in"
              className="rounded-full bg-[#8a0917] px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-white"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-[#8a0917]"
            >
              Sign up
            </Link>
          </div>

          <form
            className="card grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              const result = signInAdmin(email, password);

              if (!result.ok) {
                setError(result.message);
                return;
              }

              router.push("/admin");
            }}
          >
            <div>
              <p className="eyebrow">Welcome back</p>
              <h1 className="section-title">Sign in</h1>
              <p className="mt-3 text-slate-600">Log in to continue to your Tacklers account.</p>
            </div>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Work email
              <input className="input" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Password
              <input className="input" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error ? <p className="text-sm font-semibold text-[#8a0917]">{error}</p> : null}
            <button type="submit" className="button-primary w-full justify-center">
              Sign in
            </button>
            <p className="text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-semibold text-[#8a0917]">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}

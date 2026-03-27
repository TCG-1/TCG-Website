"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Container } from "@/components/sections";
import { signUpAdmin } from "@/lib/admin-auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="section-gap">
      <Container>
        <div className="mx-auto max-w-xl">
          <div className="mb-6 grid grid-cols-2 rounded-full border border-black/10 bg-white p-1 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <Link
              href="/sign-in"
              className="rounded-full px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-[#8a0917]"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-[#8a0917] px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-white"
            >
              Sign up
            </Link>
          </div>

          <form
            className="card grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              signUpAdmin({ name, email, password });
              router.push("/admin");
            }}
          >
            <div>
              <p className="eyebrow">Create account</p>
              <h1 className="section-title">Sign up</h1>
              <p className="mt-3 text-slate-600">Create your account to get started.</p>
            </div>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Full name
              <input className="input" type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Work email
              <input className="input" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Password
              <input className="input" type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button type="submit" className="button-primary w-full justify-center">
              Create account
            </button>
            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-semibold text-[#8a0917]">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}

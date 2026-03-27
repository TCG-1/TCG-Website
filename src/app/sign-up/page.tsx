import Link from "next/link";

import { Container } from "@/components/sections";

export default function SignUpPage() {
  return (
    <section className="section-gap">
      <Container>
        <div className="mx-auto max-w-xl">
          <div className="card grid gap-5">
            <div>
              <p className="eyebrow">Admin access</p>
              <h1 className="section-title">Sign up is disabled</h1>
              <p className="mt-3 text-slate-600">
                Admin accounts are provisioned through deployment environment variables for Vercel,
                not through public registration.
              </p>
            </div>

            <p className="text-center text-sm text-slate-600">
              Return to{" "}
              <Link href="/sign-in" className="font-semibold text-[#8a0917]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminSignInForm } from "@/components/auth/admin-sign-in-form";
import { Container } from "@/components/sections";
import { getAdminUser } from "@/lib/admin-auth";
import { getPortalUser } from "@/lib/portal-auth";
import { createPageMetadata } from "@/lib/site-seo";

const adminSignInSeo = {
  description: "Sign in to the Tacklers Consulting Group admin portal to manage training delivery, content, and client operations.",
  image: "/media/Audrey-Nyamande-1-cd36ad87.jpeg",
  title: "Admin Sign In | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: adminSignInSeo.description,
  image: adminSignInSeo.image,
  noIndex: true,
  path: "/sign-in/admin",
  title: adminSignInSeo.title,
});

type AdminSignInPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

function readSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminSignInPage({ searchParams }: AdminSignInPageProps) {
  const [adminAuth, portalUser, resolvedSearchParams] = await Promise.all([
    getAdminUser(),
    getPortalUser(),
    searchParams,
  ]);

  if (adminAuth.user) {
    redirect("/admin");
  }

  if (portalUser && !adminAuth.user) {
    redirect("/client-hub");
  }

  const initialMessage =
    readSearchParam(resolvedSearchParams.error) === "admin-config"
      ? "Admin access is not configured for this deployment yet."
      : "";

  return (
    <section className="section-gap">
      <Container>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <AdminSignInForm initialMessage={initialMessage} />
          </div>

          <div className="grid gap-6 self-start">
            <div className="rounded-[2rem] border border-black/5 bg-[#f5f2ee] p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8a0917]">Admin workflow</p>
              <h2 className="mt-3 text-3xl font-light tracking-[-0.04em] text-slate-950">
                Keep admin access separate
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Sign in with the management credentials to run training delivery, learner operations, resources, and reporting without mixing the client portal flow into the same screen.
              </p>
            </div>

            <div className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Portal routing</p>
              <h2 className="mt-3 text-3xl font-light tracking-[-0.04em] text-slate-950">
                Need the user portal instead?
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Use the standard user sign-in flow for learner and client-manager dashboard access, Google sign-in, and account creation.
              </p>
              <Link href="/sign-in" className="button-secondary mt-6">
                Back to user access
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

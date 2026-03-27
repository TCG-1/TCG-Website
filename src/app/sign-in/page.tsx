import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminSignInForm } from "@/components/auth/admin-sign-in-form";
import { PortalSignInForm } from "@/components/auth/portal-sign-in-form";
import { Container } from "@/components/sections";
import { getAdminUser } from "@/lib/admin-auth";
import { getPortalUser } from "@/lib/portal-auth";
import { createPageMetadata } from "@/lib/site-seo";

const signInSeo = {
  description:
    "Sign in to the Tacklers Consulting Group client hub or admin portal to access dashboards, documents, and programme updates.",
  image: "/media/Audrey-Nyamande-1-cd36ad87.jpeg",
  title: "Portal Sign In | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: signInSeo.description,
  image: signInSeo.image,
  noIndex: true,
  path: "/sign-in",
  title: signInSeo.title,
});

type SignInPageProps = {
  searchParams: Promise<{ error?: string | string[]; mode?: string | string[]; view?: string | string[] }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const [portalUser, adminAuth, resolvedSearchParams] = await Promise.all([
    getPortalUser(),
    getAdminUser(),
    searchParams,
  ]);

  if (portalUser) {
    redirect("/client-hub");
  }

  if (adminAuth.user) {
    redirect("/admin");
  }

  const adminInitialMessage =
    resolvedSearchParams.error === "admin-config"
      ? "Admin access is not configured for this deployment yet."
      : "";
  const portalInitialMessage =
    resolvedSearchParams.error === "oauth"
      ? "Google sign-in could not be completed. Please try again."
      : "";
  const showAdminView = resolvedSearchParams.view === "admin";
  const initialPortalMode = resolvedSearchParams.mode === "sign-up" ? "sign_up" : "sign_in";

  return (
    <section className="section-gap">
      <Container>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            {showAdminView ? (
              <AdminSignInForm initialMessage={adminInitialMessage} />
            ) : (
              <PortalSignInForm initialMessage={portalInitialMessage} initialMode={initialPortalMode} />
            )}
          </div>

          <div className="grid gap-6 self-start">
            <div className="rounded-[2rem] border border-black/5 bg-[#f5f2ee] p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8a0917]">
                {showAdminView ? "Admin workflow" : "Session behavior"}
              </p>
              <h2 className="mt-3 text-3xl font-light tracking-[-0.04em] text-slate-950">
                {showAdminView ? "Keep admin access separate" : "Stay signed in until you log out"}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {showAdminView
                  ? "Admin access still uses the secure deployment credentials and redirects straight into the management portal."
                  : "User sessions are persisted with Supabase cookies, so signed-in users stay in the dashboard until they log out manually."}
              </p>
            </div>

            <div className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Portal routing</p>
              <h2 className="mt-3 text-3xl font-light tracking-[-0.04em] text-slate-950">
                {showAdminView ? "Need the user portal instead?" : "Need admin access instead?"}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {showAdminView
                  ? "Use the standard user sign-in flow for client dashboard access, Google sign-in, and account creation."
                  : "Admins can still sign in separately without mixing the client portal flow into the same screen."}
              </p>
              <Link href={showAdminView ? "/sign-in" : "/sign-in?view=admin"} className="button-secondary mt-6">
                {showAdminView ? "Back to user access" : "Open admin sign in"}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

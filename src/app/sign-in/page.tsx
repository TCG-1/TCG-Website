import { redirect } from "next/navigation";

import { AdminSignInForm } from "@/components/auth/admin-sign-in-form";
import { PortalSignInForm } from "@/components/auth/portal-sign-in-form";
import { Container } from "@/components/sections";
import { getAdminUser } from "@/lib/admin-auth";
import { getPortalUser } from "@/lib/portal-auth";

type SignInPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
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

  return (
    <section className="section-gap">
      <Container>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <PortalSignInForm initialMessage={portalInitialMessage} />
            <div className="rounded-[1.75rem] border border-black/5 bg-[#f5f2ee] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8a0917]">Session behavior</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                User sessions are persisted with Supabase cookies, so signed-in users stay in the dashboard
                until they log out manually.
              </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl">
            <AdminSignInForm initialMessage={adminInitialMessage} />
          </div>
        </div>
      </Container>
    </section>
  );
}

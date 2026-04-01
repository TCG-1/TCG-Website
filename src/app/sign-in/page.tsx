import type { Metadata } from "next";
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

function readSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const [portalUser, adminAuth, resolvedSearchParams] = await Promise.all([
    getPortalUser(),
    getAdminUser(),
    searchParams,
  ]);

  if (adminAuth.user) {
    redirect("/admin");
  }

  if (portalUser) {
    redirect("/client-hub");
  }

  const errorParam = readSearchParam(resolvedSearchParams.error);
  const viewParam = readSearchParam(resolvedSearchParams.view);
  const modeParam = readSearchParam(resolvedSearchParams.mode);

  const adminInitialMessage =
    errorParam === "admin-config"
      ? "Admin access is not configured for this deployment yet."
      : "";
  const portalInitialMessage =
    errorParam === "oauth"
      ? "Google sign-in could not be completed. Please try again."
      : errorParam === "auth-link"
        ? "That email action link is invalid or expired. Please request a new one."
      : "";
  const showAdminView = viewParam === "admin";
  const initialPortalMode = modeParam === "sign-up" ? "sign_up" : "sign_in";

  return (
    showAdminView ? (
      <section className="section-gap">
        <Container>
          <div className="mx-auto max-w-2xl">
            <AdminSignInForm initialMessage={adminInitialMessage} />
          </div>
        </Container>
      </section>
    ) : (
      <section className="relative isolate overflow-hidden bg-[#141b2d] py-16 sm:py-20 lg:min-h-[calc(100vh-5rem)] lg:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-[#8a0917]/28 blur-3xl" />
          <div className="absolute bottom-[-8rem] right-[-5rem] h-80 w-80 rounded-full bg-[#fdd835]/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_38%)]" />
        </div>
        <Container>
          <div className="relative mx-auto max-w-5xl">
            <PortalSignInForm initialMessage={portalInitialMessage} initialMode={initialPortalMode} />
          </div>
        </Container>
      </section>
    )
  );
}

"use client";

import { usePathname } from "next/navigation";

import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { NewsletterSignupSection } from "@/components/newsletter-signup-section";
import { ScrollRevealController } from "@/components/scroll-reveal-controller";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const useImmersiveLayout = pathname.startsWith("/admin") || pathname.startsWith("/client-hub");
  const hideNewsletterSignup =
    useImmersiveLayout ||
    pathname.startsWith("/newsletter/subscription") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/reset-password");

  if (useImmersiveLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollRevealController enabled={!useImmersiveLayout} pathname={pathname} />
      <SiteHeader />
      <main data-scroll-reveal-root="true" className="flex-1">
        {children}
      </main>
      {!hideNewsletterSignup ? <NewsletterSignupSection sourcePage={pathname} /> : null}
      <SiteFooter />
      <CookieConsentBanner />
    </>
  );
}

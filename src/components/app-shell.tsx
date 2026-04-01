"use client";

import { usePathname } from "next/navigation";

import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { ScrollRevealController } from "@/components/scroll-reveal-controller";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const useImmersiveLayout = pathname.startsWith("/admin") || pathname.startsWith("/client-hub");

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
      <SiteFooter />
      <CookieConsentBanner />
    </>
  );
}

import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { rootMetadata } from "@/lib/site-seo";
import {
  buildLocalBusinessJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/structured-data";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-white text-slate-950">
        <JsonLd data={[buildOrganizationJsonLd(), buildWebSiteJsonLd(), buildLocalBusinessJsonLd()]} />
        <div className="flex min-h-screen flex-col">
          <AppShell>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}

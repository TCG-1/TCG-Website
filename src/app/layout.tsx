import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import { AppShell } from "@/components/app-shell";
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

export const metadata: Metadata = {
  title: "Tacklers Consulting Group",
  description:
    "Lean transformation and operational excellence consulting for UK organisations.",
};

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
        <div className="flex min-h-screen flex-col">
          <AppShell>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}

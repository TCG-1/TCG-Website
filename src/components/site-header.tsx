"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { navItems } from "@/lib/site-data";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  const isSolidHeader = isScrolled || isAuthPage || isMobileMenuOpen;

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isSolidHeader
          ? "border-white/20 bg-[rgba(138,9,23,0.82)] backdrop-blur-md"
          : "border-white/0 bg-transparent backdrop-blur-0"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-1 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={`flex items-center rounded-xl text-white no-underline transition-all duration-300 ${
            isSolidHeader
              ? "bg-transparent"
              : "border border-[#fff1f3]/95 bg-[#8a0917]/72 px-2 backdrop-blur-sm"
          }`}
        >
          <Image
            src="/media/TCG%20Logo.png"
            alt="Tacklers Consulting Group logo"
            width={112}
            height={112}
            className={`h-20 w-32 object-contain ${
              isSolidHeader
                ? "[filter:drop-shadow(0_4px_16px_rgba(0,0,0,0.7))]"
                : "[filter:drop-shadow(0_5px_18px_rgba(0,0,0,0.75))]"
            }`}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-bold transition ${
                isSolidHeader
                  ? "text-white/85 hover:text-white"
                  : "text-slate-950 hover:text-slate-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/sign-in"
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
              isSolidHeader
                ? "border-white/35 text-white/85 hover:bg-white/10"
                : "border-[#8a0917]/30 text-[#8a0917] hover:bg-[#8a0917]/8"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4 20c1.7-4.3 5-6 8-6s6.3 1.7 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Sign in
          </Link>
          <Link href="/book-a-discovery-call" className="button-light">
            Book now
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/sign-in"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm"
            aria-label="Sign in"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4 20c1.7-4.3 5-6 8-6s6.3 1.7 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              {isMobileMenuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-white/20 bg-[rgba(138,9,23,0.92)] px-4 py-4 backdrop-blur-md lg:hidden sm:px-6">
          <nav className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-bold text-white transition hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-2">
            <Link
              href="/sign-in"
              onClick={() => setIsMobileMenuOpen(false)}
              className="button-light justify-center"
            >
              Sign in
            </Link>
            <Link
              href="/book-a-discovery-call"
              onClick={() => setIsMobileMenuOpen(false)}
              className="button-light justify-center"
            >
              Book now
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

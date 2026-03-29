"use client";

import Link from "next/link";
import { useState } from "react";

type CookiePreference = {
  analytics: boolean;
  essential: true;
  marketing: boolean;
  updatedAt: string;
};

const COOKIE_PREFERENCE_KEY = "tcg_cookie_preferences_v1";

function persistPreferences(preferences: CookiePreference) {
  localStorage.setItem(COOKIE_PREFERENCE_KEY, JSON.stringify(preferences));
}

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return !window.localStorage.getItem(COOKIE_PREFERENCE_KEY);
  });

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 shadow-[0_-16px_40px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a0917]">Cookie notice</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-950">We use essential cookies to keep the site secure and working.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Tacklers Consulting Group uses strictly necessary cookies for sign-in, session security, and core site operation.
            We do not place non-essential analytics or marketing cookies unless we clearly ask for consent first.
            Read our <Link href="/cookie-policy" className="font-semibold text-[#8a0917] underline underline-offset-2">Cookie Policy</Link> for full details.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => {
              persistPreferences({
                analytics: false,
                essential: true,
                marketing: false,
                updatedAt: new Date().toISOString(),
              });
              setIsVisible(false);
            }}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => {
              persistPreferences({
                analytics: true,
                essential: true,
                marketing: false,
                updatedAt: new Date().toISOString(),
              });
              setIsVisible(false);
            }}
            className="inline-flex items-center justify-center rounded-full bg-[#8a0917] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#6f0712]"
          >
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  );
}

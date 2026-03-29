import Link from "next/link";
import Image from "next/image";

import { footerData } from "@/lib/site-data";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 0 0 3.25 5c0 1.1.89 2 1.97 2h.03a2 2 0 1 0 0-4ZM20.75 12.87c0-3.47-1.85-5.08-4.32-5.08-1.99 0-2.88 1.09-3.38 1.86V8.5H9.68c.04.76 0 11.5 0 11.5h3.37v-6.42c0-.34.02-.68.13-.92.27-.67.9-1.36 1.95-1.36 1.37 0 1.92 1.03 1.92 2.55V20h3.37v-7.13Z" />
    </svg>
  );
}

function SocialIcon({ platform }: { platform: (typeof footerData.socialLinks)[number]["platform"] }) {
  if (platform === "linkedin") {
    return <LinkedInIcon />;
  }

  return null;
}

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-[#111111] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div className="mx-auto flex max-w-md flex-col items-center space-y-5 text-center">
          <div className="flex flex-col items-center gap-3">
            <Link href="/" className="inline-flex">
              <Image
                src="/media/TCG%20Logo.png"
                alt="Tacklers Consulting Group logo"
                width={144}
                height={144}
                className="h-24 w-40 object-contain sm:h-28 sm:w-44"
              />
            </Link>
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">
                Tacklers Consulting Group
              </p>
              <p className="mt-1 text-lg font-semibold">Operational excellence, built to hold.</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/75">{footerData.description}</p>
          <div className="space-y-2 text-sm text-white/75">
            <p>{footerData.coverageNote}</p>
            <p>
              <a href={`mailto:${footerData.email}`} className="transition hover:text-white">
                {footerData.email}
              </a>
            </p>
            <p>
              <a href={`tel:${footerData.phone.replace(/\s+/g, "")}`} className="transition hover:text-white">
                {footerData.phone}
              </a>
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
            Useful links
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            {footerData.usefulLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
            Additional links
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            {footerData.additionalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
            Legal & social
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            {footerData.legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            {footerData.socialLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
              >
                <SocialIcon platform={item.platform} />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-white/55 sm:px-6 lg:px-8">
        Copyright © 2026 Tacklers Consulting Group. All rights reserved.
      </div>
    </footer>
  );
}

import Link from "next/link";
import Image from "next/image";

import { footerData } from "@/lib/site-data";

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

          <div className="mt-8 flex flex-wrap gap-2">
            {footerData.socialLinks.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/65"
              >
                {item}
              </span>
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

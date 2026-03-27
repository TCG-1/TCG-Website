import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

import type { CardItem, FaqItem } from "@/lib/site-data";

export function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

export function PageHero({
  eyebrow,
  title,
  body,
  primary,
  secondary,
  image,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  image?: string;
}) {
  const eyebrowClassName =
    eyebrow === "Transforming Challenges Into Opportunities"
      ? "text-sm font-serif tracking-[0.08em] text-[#8a0917]"
      : "eyebrow";

  return (
    <section className="relative isolate -mt-[100px] overflow-hidden py-20 sm:-mt-[110px] sm:py-24 lg:-mt-[120px] lg:py-28">
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : null}
      <div className="hero-soft-gradient absolute inset-0" />
      <Container>
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center pt-14 text-center sm:pt-16 lg:pt-20">
          {eyebrow ? <p className={eyebrowClassName}>{eyebrow}</p> : null}
          <h1 className="display-title mt-3 max-w-4xl">
            {title}
          </h1>
          <p className="body-copy mt-6 max-w-3xl">
            {body}
          </p>
          {(primary || secondary) && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {primary ? (
                <Link href={primary.href} className="button-primary">
                  {primary.label}
                </Link>
              ) : null}
              {secondary ? (
                <Link href={secondary.href} className="button-secondary">
                  {secondary.label}
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  body,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto mb-12 max-w-3xl text-center" : "mb-12 max-w-3xl"}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="section-title">{title}</h2>
      {body ? <p className="body-copy mt-4">{body}</p> : null}
    </div>
  );
}

export function StatGrid({ items }: { items: { value: string; label: string }[] }) {
  return (
    <section className="bg-[#8a0917] py-6 text-white">
      <Container>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {items.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center">
              <div className="text-3xl font-bold">{item.value}</div>
              <div className="mt-2 text-sm uppercase tracking-[0.14em] text-white/80">{item.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function FeatureList({ items }: { items: string[] }) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <div key={item} className="card flex items-start gap-3">
          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8a0917] text-sm font-bold text-white">
            ✓
          </span>
          <p className="text-slate-700">{item}</p>
        </div>
      ))}
    </div>
  );
}

export function CardGrid({
  items,
  columns = 3,
  centerText = false,
}: {
  items: CardItem[];
  columns?: 2 | 3 | 4;
  centerText?: boolean;
}) {
  const cols =
    columns === 4
      ? "lg:grid-cols-4"
      : columns === 2
        ? "lg:grid-cols-2"
        : "lg:grid-cols-3";

  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${cols}`}>
      {items.map((item) => (
        <article
          key={item.title}
          className="group relative overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-2 hover:border-[#8a0917]/15 hover:shadow-[0_28px_90px_rgba(15,23,42,0.12)]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8a0917] via-[#b41626] to-[#FDD835] opacity-0 transition duration-300 group-hover:opacity-100" />
          {item.image ? (
            <div className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          ) : null}
          <div className={`p-6 ${centerText ? "text-center" : ""}`}>
            <h3 className="text-2xl font-bold tracking-tight text-[#8a0917] transition duration-300 group-hover:text-[#690711]">
              {item.title}
            </h3>
            <p className="mt-3 leading-7 text-slate-700">{item.body}</p>
            {item.href && item.cta ? (
              <Link
                href={item.href}
                className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#8a0917] transition duration-300 group-hover:gap-3 ${
                  centerText ? "justify-center" : ""
                }`}
              >
                {item.cta}
                <span aria-hidden="true">→</span>
              </Link>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function StepsGrid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <div key={item.title} className="card">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#8a0917] text-sm font-bold text-white">
            {index + 1}
          </span>
          <h3 className="mt-5 text-xl font-bold text-[#8a0917]">{item.title}</h3>
          <p className="mt-3 text-slate-700">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <details key={item.question} className="card group">
          <summary className="cursor-pointer list-none text-lg font-bold text-[#8a0917]">
            {item.question}
          </summary>
          <p className="mt-4 leading-7 text-slate-700">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function TestimonialGrid({
  items,
}: {
  items: { quote: string; author: string; role: string }[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {items.map((item) => (
        <blockquote key={item.author} className="card bg-slate-950 text-white">
          <p className="text-lg leading-8 text-white/90">“{item.quote}”</p>
          <footer className="mt-6">
            <div className="font-semibold">{item.author}</div>
            <div className="text-sm uppercase tracking-[0.18em] text-white/60">{item.role}</div>
          </footer>
        </blockquote>
      ))}
    </div>
  );
}

export function CtaBanner({
  eyebrow,
  title,
  body,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}) {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-[2rem] bg-gradient-to-br from-[#FDD835] via-[#f6cf2d] to-[#ebc620] px-8 py-14 text-center text-slate-950 shadow-[0_30px_90px_rgba(253,216,53,0.35)] sm:px-10 lg:px-14">
          {eyebrow ? <p className="eyebrow text-slate-900/75">{eyebrow}</p> : null}
          <h2 className="section-title mx-auto max-w-4xl text-slate-950">{title}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-900/80">{body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={primary.href} className="button-primary">
              {primary.label}
            </Link>
            <Link href={secondary.href} className="button-secondary">
              {secondary.label}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ContactForm({ title = "Send a Message" }: { title?: string }) {
  return (
    <form className="card grid gap-5">
      <div>
        <h3 className="text-2xl font-bold text-[#8a0917]">{title}</h3>
        <p className="mt-2 text-slate-700">
          Share a few details and we will come back with the best next step.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Full name
          <input className="input" type="text" placeholder="Your name" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Work email
          <input className="input" type="email" placeholder="you@company.com" />
        </label>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Company
          <input className="input" type="text" placeholder="Organisation name" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Phone number
          <input className="input" type="tel" placeholder="+44 ..." />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Your message
        <textarea className="input min-h-36 resize-y" placeholder="Tell us what you are trying to improve." />
      </label>
      <button type="submit" className="button-primary w-fit">
        Submit enquiry
      </button>
    </form>
  );
}

export function LegalSection({
  number,
  title,
  body,
  points,
}: {
  number?: string;
  title: string;
  body: string;
  points?: string[];
}) {
  return (
    <section className="card">
      <h2 className="text-2xl font-bold text-[#8a0917]">
        {number ? `${number}. ` : ""}
        {title}
      </h2>
      <p className="mt-4 leading-8 text-slate-700">{body}</p>
      {points?.length ? (
        <ul className="mt-4 space-y-3 text-slate-700">
          {points.map((point) => (
            <li key={point} className="flex gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-[#8a0917]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

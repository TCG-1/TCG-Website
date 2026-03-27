import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import {
  Container,
  PageHero,
  SectionHeader,
} from "@/components/sections";
import { createPageMetadata } from "@/lib/site-seo";
import { brandTagline, globalCta, leanProgrammes, methodSteps } from "@/lib/site-data";
import { buildBreadcrumbJsonLd, buildServiceJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

const leanTrainingSeo = {
  description:
    "Practical Lean training and mentoring for UK teams that want to reduce waste, improve productivity, and build capability that lasts.",
  image: "/media/Lean-Training-060b97e6.jpeg",
  title: "Lean Training UK | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: leanTrainingSeo.description,
  image: leanTrainingSeo.image,
  path: "/lean-training-uk",
  title: leanTrainingSeo.title,
});

const approachCardStyles = [
  {
    shell:
      "border-[#f6d15a]/40 bg-[linear-gradient(180deg,rgba(253,216,53,0.16),rgba(255,255,255,0.05))] hover:border-[#f6d15a] hover:bg-[#fff5c4] hover:shadow-[0_28px_90px_rgba(253,216,53,0.22)]",
    badge: "bg-[#FDD835] text-[#8a0917]",
  },
  {
    shell:
      "border-[#f2c4c8]/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] hover:border-[#f2c4c8] hover:bg-[#fff3f5] hover:shadow-[0_28px_90px_rgba(255,255,255,0.16)]",
    badge: "bg-white text-[#8a0917]",
  },
  {
    shell:
      "border-[#9ed9d1]/40 bg-[linear-gradient(180deg,rgba(118,218,202,0.16),rgba(255,255,255,0.04))] hover:border-[#9ed9d1] hover:bg-[#ecfffb] hover:shadow-[0_28px_90px_rgba(118,218,202,0.18)]",
    badge: "bg-[#baf4ea] text-[#0f5f57]",
  },
  {
    shell:
      "border-[#c9d0ef]/40 bg-[linear-gradient(180deg,rgba(201,208,239,0.16),rgba(255,255,255,0.04))] hover:border-[#c9d0ef] hover:bg-[#f4f6ff] hover:shadow-[0_28px_90px_rgba(201,208,239,0.18)]",
    badge: "bg-[#dfe4ff] text-[#38406f]",
  },
] as const;

export default function LeanServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: leanTrainingSeo.description,
            path: "/lean-training-uk",
            title: leanTrainingSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Lean Training", path: "/lean-training-uk" },
          ]),
          buildServiceJsonLd({
            description: leanTrainingSeo.description,
            name: "Lean Group Mentoring",
            path: "/lean-training-uk",
          }),
        ]}
      />
      <PageHero
        eyebrow={brandTagline}
        title="Practical Lean training and mentoring that builds capability where work happens."
        body="We help teams reduce waste, improve productivity, and strengthen daily ways of working through practical learning that connects directly to real operational challenges."
        primary={{ label: "Enquire now", href: "/book-lean-training" }}
        secondary={{ label: "Download brochure", href: "/contact" }}
        image={leanTrainingSeo.image}
      />

      <section className="-mt-10 pb-6">
        <Container>
          <div className="relative z-10 mx-auto max-w-md rounded-[1.75rem] bg-[#FDD835] px-8 py-8 text-center shadow-[0_30px_80px_rgba(253,216,53,0.28)]">
            <p className="text-5xl font-extrabold text-[#8a0917]">500+</p>
            <p className="mt-3 text-xs font-bold uppercase leading-6 tracking-[0.16em] text-slate-950">
              Individuals, from front-line teams to C-Suite level, trained in Lean Principles
            </p>
          </div>
        </Container>
      </section>

      <section className="border-y border-black/5 bg-slate-100 py-12">
        <Container>
          <div className="text-center">
            <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
              Industries We&apos;ve Transformed
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-55 grayscale transition-all md:gap-16">
              {[
                "Aerospace & Defence",
                "Healthcare & Life Sciences",
                "Energy",
                "Public Sector",
                "IT Services",
              ].map((item) => (
                <span key={item} className="text-xl font-bold italic tracking-tight text-slate-800">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Programmes"
            title="Mentoring Programmes"
            body="Comprehensive curriculum designed to transform your workforce into Lean experts and change leaders."
            center
          />

          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-3">
              {leanProgrammes.map((programme, index) => {
                const featured = index === 1;

                return (
                  <article
                    key={programme.title}
                    className={`relative flex flex-col items-center border p-8 text-center transition-all duration-300 ${
                      featured
                        ? "border-2 border-[#8a0917] bg-white shadow-2xl"
                        : "border-black/5 bg-white shadow-sm hover:shadow-2xl"
                    }`}
                  >
                    {featured ? (
                      <div className="absolute -top-4 bg-[#8a0917] px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                        Most Popular
                      </div>
                    ) : null}

                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#8a0917] text-white transition-transform group-hover:scale-110">
                      <span className="text-3xl font-bold">{index + 1}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-950">{programme.title}</h3>
                    <p className="mb-8 mt-4 text-sm leading-7 text-slate-600">{programme.body}</p>

                    <Link
                      href={programme.href ?? "/book-lean-training"}
                      className={`mt-auto w-full py-3 text-center text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                        featured
                          ? "bg-[#8a0917] text-white hover:bg-[#690711]"
                          : "border-2 border-[#8a0917] text-[#8a0917] hover:bg-[#8a0917] hover:text-white"
                      }`}
                    >
                      {programme.cta}
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap bg-white">
        <Container>
          <div className="relative z-10">
            <SectionHeader
              eyebrow="Our approach"
              title="A four-stage engagement model that turns learning into daily practice."
              body="We assess, collaborate, upskill, and sustain so improvement capability stays with your team."
              center
            />

            <div className="mx-auto max-w-6xl">
              <div className="relative grid gap-4 md:grid-cols-4">
                <div className="absolute left-0 top-1/2 z-0 hidden h-px w-full -translate-y-1/2 bg-slate-200 md:block" />
                {methodSteps.map((step, index) => {
                  const style = approachCardStyles[index] ?? approachCardStyles[0];

                  return (
                    <article
                      key={step.title}
                      className={`group relative z-10 rounded-[1.35rem] border p-8 text-slate-950 transition-all duration-300 hover:-translate-y-2 hover:rotate-[-0.3deg] ${style.shell}`}
                    >
                      <div
                        className={`mb-6 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold transition-all group-hover:scale-110 ${style.badge}`}
                      >
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-slate-950 transition-colors group-hover:text-[#8a0917]">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600 transition-colors group-hover:text-slate-700">
                        {step.body}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-100">
        <Container>
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="relative">
              <Image
                src="/media/photo-1554224155-6726b3ff858f-9273a89e.jpg"
                alt="Lean training impact"
                width={960}
                height={860}
                className="rounded-xl border-[8px] border-white shadow-lg"
              />
              <div className="absolute -right-8 -top-8 flex h-36 w-36 flex-col items-center justify-center rounded-full bg-[#8a0917] p-6 text-center text-white shadow-2xl sm:h-40 sm:w-40">
                <span className="text-3xl font-bold">30%</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/85">
                  Avg. waste reduction
                </span>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-10 bg-[#8a0917]" />
                <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#8a0917]">
                  Why Choose Tacklers?
                </span>
              </div>
              <h2 className="section-title text-slate-950">
                Lean Excellence, <span className="font-bold">Real Results.</span>
              </h2>

              <ul className="mt-8 space-y-6">
                {[
                  {
                    title: "Sustainable ROI",
                    body: "We don’t just deliver a report; we deliver measurable bottom-line improvements that stick.",
                  },
                  {
                    title: "Pragmatic Mentoring",
                    body: "No jargon-heavy classroom theory. We teach by doing in your operational environment, where teams can apply the learning immediately.",
                  },
                  {
                    title: "Cultural Transformation",
                    body: "We focus on changing mindsets, empowering your people to become self-sufficient problem solvers.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FDD835] text-[#8a0917]">
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                      <p className="mt-1 text-slate-600">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-white">
        <Container>
          <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#690711_0%,#8a0917_48%,#a51122_100%)] px-10 py-12 text-white text-center shadow-[0_30px_90px_rgba(138,9,23,0.28)] md:px-16 md:py-16">
            <div className="mx-auto max-w-4xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">
                {globalCta.eyebrow}
              </p>
              <h3 className="section-title mt-3 text-white">
                {globalCta.title}
              </h3>
              <p className="body-copy mt-4 text-white/82">
                {globalCta.body}
              </p>
            </div>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/discovery-call"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#8a0917] transition hover:-translate-y-1 hover:bg-[#fff4f1]"
              >
                {globalCta.primary.label}
              </Link>
              <Link
                href="/on-site-assessment"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-white/35 bg-white/8 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:-translate-y-1 hover:bg-white/14"
              >
                {globalCta.secondary.label}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

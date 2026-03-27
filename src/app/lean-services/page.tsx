import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  Container,
} from "@/components/sections";
import { leanProgrammes, methodSteps } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Lean Group Mentoring | Tacklers Consulting Group",
  description:
    "Lean mentoring, practical training programmes, and capability building for UK teams that need improvement to stick.",
};

export default function LeanServicesPage() {
  return (
    <>
      <section className="relative isolate -mt-[100px] overflow-hidden bg-[#F8F9FA] py-20 sm:-mt-[110px] sm:py-24 lg:-mt-[120px] lg:py-32">
        <Container>
          <div className="grid items-center gap-12 pt-14 sm:pt-16 lg:grid-cols-2 lg:gap-16 lg:pt-20">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px w-10 bg-[#8a0917]" />
                <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#8a0917]">
                  Operational Excellence Consulting
                </span>
              </div>
              <h1 className="max-w-3xl text-[clamp(2.5rem,6vw,4.75rem)] font-light leading-[1.05] tracking-[-0.04em] text-slate-950">
                Lean transformation that cuts waste, <span className="font-bold text-[#8a0917]">not people.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Building internal capability through collaborative learning and strategic guidance.
                Empower your team to lead the transformation and achieve sustainable ROI without the
                theatre.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/book-lean-training-session" className="button-primary px-8">
                  Enquire Now
                </Link>
                <Link href="/contact-us" className="button-secondary px-8">
                  Download Brochure
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rotate-1 overflow-hidden rounded-[1.75rem] shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
                <Image
                  src="/media/Lean-Training-060b97e6.jpeg"
                  alt="Lean mentoring in action"
                  width={960}
                  height={760}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 left-0 max-w-[240px] bg-[#FDD835] p-6 shadow-2xl sm:-left-6 sm:p-8">
                <p className="text-4xl font-extrabold text-[#8a0917]">10+ Years</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-950">
                  Of proven Lean methodologies transformed into results
                </p>
              </div>
            </div>
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
          <div className="mb-16 text-center">
            <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-light tracking-[-0.03em] text-slate-950">
              Mentoring <span className="font-bold text-[#8a0917]">Programmes</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              Comprehensive curriculum designed to transform your workforce into Lean experts and
              change leaders.
            </p>
          </div>

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
                    href={programme.href ?? "/book-lean-training-session"}
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
        </Container>
      </section>

      <section className="relative overflow-hidden bg-[#8a0917] py-24 text-white">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 -translate-x-[-15%] -skew-x-12 bg-black/5" />
        <Container>
          <div className="relative z-10">
            <div className="mb-20 text-center">
              <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-light tracking-[-0.03em] text-white">
                How we work: <span className="font-bold italic">The Tacklers Method</span>
              </h2>
              <p className="mt-4 text-red-100/75">
                A results-focused, four-stage engagement model.
              </p>
            </div>

            <div className="relative grid gap-4 md:grid-cols-4">
              <div className="absolute left-0 top-1/2 z-0 hidden h-px w-full -translate-y-1/2 bg-red-300/30 md:block" />
              {methodSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative z-10 rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white hover:text-[#8a0917]"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#FDD835] text-xl font-bold text-[#8a0917] transition-all">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 opacity-85">{step.body}</p>
                </div>
              ))}
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
              <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-light tracking-[-0.03em] text-slate-950">
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
                    body: "No jargon-heavy classroom theory. We teach by doing, on the shop floor or in the office.",
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
          <div className="flex flex-col items-center justify-between gap-10 bg-[#FDD835] p-10 md:flex-row md:p-16">
            <div className="flex items-center gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#8a0917] text-white">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold leading-tight text-slate-950 md:text-3xl">
                  Ready to cut waste and keep your people?
                </h3>
                <p className="mt-2 font-medium text-[#8a0917]">
                  Schedule a discovery call to discuss your transformation journey.
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
              <Link href="/book-a-discovery-call" className="button-primary whitespace-nowrap px-8">
                Book a Discovery Call
              </Link>
              <Link href="/request-an-on-site-assessment" className="inline-flex items-center justify-center whitespace-nowrap bg-slate-950 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-black">
                Request Assessment
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

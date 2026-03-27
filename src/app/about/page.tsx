import Image from "next/image";
import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import {
  CardGrid,
  Container,
  CtaBanner,
  FaqList,
  PageHero,
  SectionHeader,
  StepsGrid,
} from "@/components/sections";
import {
  aboutBeliefs,
  aboutFaqs,
  aboutServices,
  experienceDo,
  experienceDont,
  globalCta,
  homeData,
  methodSteps,
  teamMembers,
} from "@/lib/site-data";
import { createPageMetadata } from "@/lib/site-seo";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

const aboutSeo = {
  description:
    "Learn how Tacklers Consulting Group delivers people-first Lean consulting, operational excellence support, and on-site transformation work across the UK.",
  image: "/media/audrey-and-arlandous-1-e1773762025172-1b5d8b67.jpeg",
  title: "About Tacklers Consulting Group | People-First Lean Consultants",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: aboutSeo.description,
  image: aboutSeo.image,
  path: "/about",
  title: aboutSeo.title,
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: aboutSeo.description,
            path: "/about",
            title: aboutSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Who we are"
        title="About Tacklers Consulting Group"
        body="We started Tacklers for a simple reason. Too many organisations invest in transformation, then get a report, a workshop, and a few weeks of noise. We work on-site at Gemba with your teams to improve flow, reduce waste, and build ways of working your people can sustain without losing expertise."
        primary={globalCta.primary}
        secondary={globalCta.secondary}
        image="/media/Lean-transformation-consulting-UK-consultant-working-with-team-at-Gemba-1-6dc05d89.jpeg"
      />

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="Our expertise"
            title="What we believe"
            body="A practical philosophy shaped by real work, real constraints, and real teams."
            center
          />
          <div className="mx-auto max-w-5xl">
            <CardGrid items={aboutBeliefs} columns={2} />
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <div className="mx-auto grid max-w-6xl grid-cols-[0.9fr_1.1fr] items-center gap-8">
            <div className="overflow-hidden rounded-3xl border border-black/5 bg-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <Image
                src="/media/audrey-and-arlandous-1-e1773762025172-1b5d8b67.jpeg"
                alt="Audrey Nyamande-Trigg and Arlandous Makoni"
                width={900}
                height={1080}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="rounded-3xl border border-[#8a0917]/10 bg-white p-8 text-left shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10">
              <p className="eyebrow">Holistic approach</p>
              <h2 className="section-title mt-2">What we do</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                We help organisations improve operational performance in complex, regulated
                environments.
              </p>
              <div className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {aboutServices.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8a0917] text-[0.65rem] font-bold text-white">
                      ✓
                    </span>
                    <p className="text-sm leading-6 text-slate-700 sm:text-[0.95rem]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="Industries"
            title="Who we work with"
            body="We support regulated and high-stakes environments where capability and delivery discipline matter."
            center
          />
          <div className="mx-auto max-w-6xl">
            <CardGrid items={homeData.industries} columns={3} centerText />
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-16 max-w-4xl text-center">
              <h2 className="font-sans text-[clamp(2.2rem,6.2vw,3.8rem)] font-light leading-none tracking-[-0.04em] text-[#8a0917]">
                OUR TEAM
              </h2>
              <div className="mx-auto mt-6 max-w-3xl">
                <p className="text-lg font-light leading-8 tracking-tight text-slate-600 md:text-xl">
                  We are a small team on purpose. You get people who show up, ask the right
                  questions, and stay close to the work.
                </p>
              </div>
            </div>

            <div className="space-y-24">
              <article className="group relative grid items-center gap-8 lg:grid-cols-12 lg:gap-0">
                <div className="z-10 mx-auto w-full max-w-160 overflow-hidden lg:col-span-6 lg:mx-0">
                  <div className="relative aspect-5/4 overflow-hidden bg-slate-200 transition duration-700 group-hover:scale-[1.01]">
                    <Image
                      src="/media/Audrey-Nyamande-1-cd36ad87.jpeg"
                      alt="Audrey Nyamande"
                      width={1200}
                      height={760}
                      className="h-full w-full object-cover object-top grayscale transition duration-1000 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-[#8a0917]/0 transition duration-700 group-hover:bg-[#8a0917]/5" />
                  </div>
                </div>
                <div className="z-20 lg:col-span-6 lg:-ml-10">
                  <div className="border border-slate-200 bg-white p-8 shadow-[0_16px_46px_rgba(15,23,42,0.08)] transition duration-500 group-hover:shadow-[0_0_40px_-10px_rgba(98,0,11,0.15)] sm:p-12">
                    <header>
                      <h3 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                        Audrey Nyamande
                      </h3>
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.22em] text-[#8a0917]">
                        Founder &amp; Managing Director
                      </p>
                    </header>
                    <div className="mt-8 h-1 w-12 bg-[#8a0917] transition-all duration-500 group-hover:w-24" />
                    <p className="mt-8 text-base leading-8 text-slate-600 md:text-[1.05rem]">
                      {teamMembers[0]?.body}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <a href="mailto:hello@tacklersconsulting.com" className="button-primary">
                        Connect
                      </a>
                      <a href="/contact-us" className="button-secondary">
                        Contact
                      </a>
                    </div>
                  </div>
                </div>
              </article>

              <article className="group relative grid items-center gap-8 lg:grid-cols-12 lg:gap-0">
                <div className="order-2 z-20 lg:order-1 lg:col-span-6 lg:-mr-10">
                  <div className="border border-slate-200 bg-white p-8 shadow-[0_16px_46px_rgba(15,23,42,0.08)] transition duration-500 group-hover:shadow-[0_0_40px_-10px_rgba(98,0,11,0.15)] sm:p-12">
                    <header>
                      <h3 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                        Arlandous Makoni
                      </h3>
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.22em] text-[#8a0917]">
                        Policy and Public Affairs Consultant
                      </p>
                    </header>
                    <div className="mt-8 h-1 w-12 bg-[#8a0917] transition-all duration-500 group-hover:w-24" />
                    <p className="mt-8 text-base leading-8 text-slate-600 md:text-[1.05rem]">
                      {teamMembers[1]?.body}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <a href="mailto:hello@tacklersconsulting.com" className="button-primary">
                        Email
                      </a>
                      <a href="/contact-us" className="button-secondary">
                        Contact
                      </a>
                    </div>
                  </div>
                </div>
                <div className="order-1 z-10 mx-auto w-full max-w-160 overflow-hidden lg:order-2 lg:col-span-6 lg:col-start-7 lg:mx-0">
                  <div className="relative aspect-5/4 overflow-hidden bg-slate-200 transition duration-700 group-hover:scale-[1.01]">
                    <Image
                      src="/media/Arnoldis-N.jpeg"
                      alt="Arlandous Makoni"
                      width={1200}
                      height={760}
                      className="h-full w-full object-cover grayscale transition duration-1000 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-[#8a0917]/0 transition duration-700 group-hover:bg-[#8a0917]/5" />
                  </div>
                </div>
              </article>
            </div>

            <div className="mt-24 flex items-center justify-between border-t border-slate-200 pt-10">
              <div className="flex gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8a0917]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#8a0917]/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#8a0917]/15" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400">
                Excellence in execution
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="Our approach"
            title="How we work"
            body="A four-stage method that keeps things clear, practical, and results-focused."
            center
          />
          <div className="mx-auto max-w-6xl">
            <StepsGrid items={methodSteps} />
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-8 lg:col-span-5">
              <p className="eyebrow text-[#795900]">Strategic methodology</p>
              <h2 className="font-sans text-[clamp(2.2rem,5vw,3.8rem)] font-light leading-[1.05] tracking-[-0.04em] text-[#8a0917]">
                OUR FOCUS
              </h2>
              <span className="block h-px w-24 bg-linear-to-r from-[#8a0917] to-transparent" />

              <div className="space-y-4">
                <p className="text-2xl font-medium leading-tight tracking-tight text-slate-900">
                  What a good engagement <span className="text-[#8a0917] italic">feels</span> like
                </p>
                <p className="max-w-md text-base leading-8 text-slate-600">
                  Our consulting approach moves beyond theoretical frameworks. We prioritise
                  practical clarity in programme optimisation so teams can execute with confidence.
                </p>
              </div>

              <div className="group relative mt-8 overflow-hidden rounded-2xl border border-black/5 shadow-[0_18px_52px_rgba(15,23,42,0.12)]">
                <Image
                  src="/media/Lean-transformation-consulting-UK-consultant-working-with-team-at-Gemba-1-6dc05d89.jpeg"
                  alt="Operational team in a Lean transformation session"
                  width={960}
                  height={720}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#8a0917]/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </div>

            <div className="grid gap-8 lg:col-span-7">
              <div className="rounded-2xl border-l-4 border-[#FDD835] bg-white p-7 shadow-[0_16px_44px_rgba(15,23,42,0.08)] sm:p-10">
                <h3 className="text-xl font-semibold uppercase tracking-[0.2em] text-slate-900">
                  You should feel
                </h3>
                <ul className="mt-7 space-y-3">
                  {experienceDo.map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-xl p-3 transition-colors duration-300 hover:bg-slate-50">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FDD835]" />
                      <span className="text-base font-medium leading-7 text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border-l-4 border-[#8a0917]/30 bg-slate-100 p-7 sm:p-10">
                <h3 className="text-xl font-semibold uppercase tracking-[0.2em] text-slate-700">
                  You should not feel
                </h3>
                <ul className="mt-7 space-y-3">
                  {experienceDont.map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-xl p-3 transition-colors duration-300 hover:bg-white">
                      <span className="mt-1.5 text-base font-semibold text-[#8a0917]/45">×</span>
                      <span className="text-base leading-7 text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="FAQs"
            title="Frequently asked questions"
            body="Common questions about how we work and who we support."
            center
          />
          <div className="mx-auto max-w-4xl">
            <FaqList items={aboutFaqs} />
          </div>
        </Container>
      </section>

      <CtaBanner {...globalCta} />
    </>
  );
}

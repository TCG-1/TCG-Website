import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { FunFactCarousel } from "@/components/funfact-carousel";
import {
  CardGrid,
  Container,
  CtaBanner,
  FaqList,
  SectionHeader,
  StepsGrid,
} from "@/components/sections";
import { getPublishedBlogEntries } from "@/lib/blog-content";
import { createPageMetadata } from "@/lib/site-seo";
import { brandTagline, globalCta, homeData, homeFaqs } from "@/lib/site-data";

const homeSeo = {
  description:
    "Tacklers Consulting Group helps UK organisations reduce waste, improve productivity, and build operational excellence capability that lasts.",
  image: homeData.hero.image,
  title: "People-First Lean Transformation UK | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: homeSeo.description,
  image: homeSeo.image,
  keywords: [
    "operational excellence consulting uk",
    "lean transformation uk",
    "gemba consulting",
    "continuous improvement partner",
  ],
  path: "/",
  title: homeSeo.title,
});

export default async function Home() {
  const blogPosts = await getPublishedBlogEntries();

  const serviceItems = [
    {
      title: "Cost Management",
      body: "Cost reduction works when it is tied to how work actually runs. When it is not, it turns into pressure and short-term fixes.",
      href: "/operational-excellence-consulting-uk",
      cta: "View Programme",
      image: "/media/Cost-Management-f9a07bf6.jpeg",
    },
    {
      title: "Executive Leadership Coaching",
      body: "This is where many improvements win or lose. Good projects can stall when leaders do not have a clear operating rhythm.",
      href: "/operational-excellence-consulting-uk",
      cta: "View Programme",
      image: "/media/Executive-Leadership-Coaching-1588bf3d.jpeg",
    },
    {
      title: "Mentoring",
      body: "Training has to connect to real work or it fades fast. We keep it practical.",
      href: "/lean-training-uk",
      cta: "View Programme",
      image: "/media/Lean-Training-060b97e6.jpeg",
    },
    {
      title: "Lean Transformation",
      body: "Lean transformation is not a workshop series. It is a change in how work is managed, improved, and sustained.",
      href: "/operational-excellence-consulting-uk",
      cta: "View Programme",
      image: "/media/Lean-Transformation-ee5c9aae.jpeg",
    },
    {
      title: "People Strategy",
      body: "If the people side is ignored, the process side will not last. That is not a philosophy, it is just reality.",
      href: "/operational-excellence-consulting-uk",
      cta: "View Program",
      image: "/media/photo-1521737604893-d14cc237f11d-b93a2a8e.jpg",
    },
    {
      title: "Manufacturing Support",
      body: "Manufacturing environments feel small until you trace one delay and realise how many parts it touches.",
      href: "/operational-excellence-consulting-uk",
      cta: "View Program",
      image: "/media/Manufacturing-Support-f5a8f8f1.jpeg",
    },
  ];

  const founderCredentials = [
    "Lean Six Sigma Certified",
    "Private Pilot's License - PPL (A)",
    "Bachelor's Degree",
    "Aerospace Technology",
  ];

  return (
    <div className="text-center">
      <section className="relative isolate -mt-[100px] overflow-hidden py-20 sm:-mt-[110px] sm:py-24 lg:-mt-[120px] lg:py-28">
        <Image
          src="/media/aida-public-AB6AXuCyOjIab072l46SaGHablYPEZAu48OXAu95HSTBh0PG-adf322ea.jpg"
          alt="Operational excellence team session"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="hero-soft-gradient absolute inset-0" />
        <Container>
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center pt-14 text-center sm:pt-16 lg:pt-20">
            <p className="brand-tagline max-w-3xl">{brandTagline}</p>
            <h1 className="display-title mt-3 max-w-4xl">
              People-First Lean Transformation
              <br />
              <span className="hero-title-emphasis">for UK Teams</span>
            </h1>
            <p className="body-copy mt-6 max-w-3xl">
              Tacklers Consulting Group is a UK-based Lean transformation and operational excellence
              partner. We work on-site at Gemba with your teams to reduce waste, clear bottlenecks,
              improve flow, and retain the expertise your organisation depends on.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/discovery-call" className="button-primary">
                Book a discovery call
              </Link>
              <Link href="/on-site-assessment" className="button-secondary">
                Request an on-site assessment
              </Link>
            </div>
            <div className="mt-10 grid w-full max-w-4xl gap-3 sm:grid-cols-3">
              <p className="rounded-2xl border border-[#8a0917]/20 bg-white/80 px-4 py-4 text-sm font-semibold leading-6 text-slate-800 backdrop-blur-sm">
                10+ years applying Lean methodologies
              </p>
              <p className="rounded-2xl border border-[#8a0917]/20 bg-white/80 px-4 py-4 text-sm font-semibold leading-6 text-slate-800 backdrop-blur-sm">
                Implementing Lean principles that have delivered multi-million-pound savings to organisations
              </p>
              <p className="rounded-2xl border border-[#8a0917]/20 bg-white/80 px-4 py-4 text-sm font-semibold leading-6 text-slate-800 backdrop-blur-sm">
                500+ individuals, from front-line teams to C-Suite level, trained in Lean Principles
              </p>
            </div>
          </div>
        </Container>
      </section>

      <FunFactCarousel
        items={[
          {
            value: "500+",
            label: "Individuals trained in Lean Principles",
            detail: "From front-line teams to C-Suite level across operationally complex environments.",
          },
          {
            value: "4.8/5",
            label: "Average rating",
            detail: "Programmes are designed to be practical, useful, and easy for teams to apply immediately.",
          },
          {
            value: "98%",
            label: "Client satisfaction",
            detail: "Clients stay engaged because the work focuses on real bottlenecks, not generic slide decks.",
          },
          {
            value: "10+",
            label: "Years experience",
            detail: "Lean transformation support grounded in hands-on delivery, not just workshop theory.",
          },
        ]}
      />

      <section className="section-gap bg-slate-50">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left — image */}
            <div className="overflow-hidden rounded-[2rem] shadow-xl">
              <Image
                src="/media/Productivity-Improvement-1d0b843c.jpeg"
                alt="Productivity improvement in action"
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Right — text + compact checklist */}
            <div>
              <p className="eyebrow">What you get, quickly</p>
              <h2 className="section-title mt-2">
                This is what clients usually want. It&apos;s also what they struggle to get from report-heavy consulting.
              </h2>
              <ul className="mt-6 space-y-3">
                {[
                  "Less waiting, fewer hand-over issues, fewer repeat problems",
                  "Shorter cycle times and steadier delivery",
                  "Higher first-time quality through clear standard work",
                  "More capacity from the people and systems you already have",
                  "Leaders and teams who can sustain improvement after we leave",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8a0917] text-xs font-bold text-white">
                      ✓
                    </span>
                    <span className="text-slate-700 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap bg-[#2d060c] text-white">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-[2rem] border border-white/10">
              <Image
                src="/media/aida-public-AB6AXuDHky4TW1pFeH2_awPPMuIqsfxjuG-7yGMeQeE2qY4s-173f18c3.jpg"
                alt="People-first lean collaboration"
                width={900}
                height={700}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.2)] sm:p-10">
              <p className="eyebrow text-white/60">People-first Lean</p>
              <h2 className="section-title text-white">People-first Lean, the way it should be</h2>
              <p className="mt-5 text-lg leading-8 text-white/82">
                Lean has a reputation problem. I think we all know why. Too many organisations use it to
                justify reducing headcount, then wonder why trust disappears.
              </p>
              <p className="mt-4 text-lg leading-8 text-white/82">
                Our approach is different. We focus on reducing waste, building capability, and
                redeploying talent into higher-value work. It is more work up front, but it holds because
                organisations keep the expertise they have worked hard to build.
              </p>
              <div className="mt-7 flex justify-center">
                <Link href="/lean-training-uk" className="button-light">
                  Explore mentoring
                </Link>
              </div>
              <p className="mt-5 text-sm uppercase tracking-[0.18em] text-white/55">
                Build capability. Retain expertise. Improve flow without eroding trust.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Lean transformation services"
            title="You can start small with one value stream, or run a wider programme."
            body="Either is fine. We’ll tell you what makes sense once we see how work really flows."
            center
          />
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceItems.map((item) => (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-2 hover:border-[#8a0917]/15 hover:shadow-[0_28px_90px_rgba(15,23,42,0.12)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8a0917] via-[#b41626] to-[#FDD835] opacity-0 transition duration-300 group-hover:opacity-100" />
                <Image
                  src={item.image}
                  alt={item.title}
                  width={800}
                  height={480}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-950 transition duration-300 group-hover:text-[#8a0917]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{item.body}</p>
                  <Link
                    href={item.href}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#8a0917] transition duration-300 group-hover:gap-3"
                  >
                    {item.cta}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/operational-excellence-consulting-uk" className="button-secondary">
              View All Services
            </Link>
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="Our approach"
            title="We use a four-stage method that keeps things clear."
            center
          />
          <StepsGrid
            items={[
              {
                title: "Assess",
                body: "We identify gaps, constraints, and value stream opportunities using observation, data, and team input.",
              },
              {
                title: "Collaborate",
                body: "We work on-site with the people doing the work. Improvements are tested in the real environment.",
              },
              {
                title: "Upskill",
                body: "We train teams to own the new processes. Leaders learn how to coach and sustain, not just approve.",
              },
              {
                title: "Sustain",
                body: "We build daily and weekly management routines so performance does not drift back.",
              },
            ]}
          />
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
          <CardGrid items={homeData.industries} columns={3} centerText />
        </Container>
      </section>

      <section className="section-gap overflow-hidden bg-white">
        <Container>
          <div className="grid items-center gap-12 text-left lg:grid-cols-12 lg:gap-20">
            <div className="flex flex-col gap-10 lg:col-span-7">
              <div className="space-y-5">
                <p className="eyebrow text-[#795900]">Our leadership</p>
                <h2 className="font-sans text-[clamp(2.4rem,4.8vw,4.1rem)] font-light leading-[1.05] tracking-[-0.04em] text-[#8a0917]">
                  Founder-led, technically grounded
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Tacklers is led by Audrey Nyamande-Trigg, an aerospace engineer and Lean transformation
                  coach. She has led transformation work in high-stakes engineering environments and
                  brings that same practical discipline into every engagement. Not to overcomplicate
                  things. Just to make sure the work holds.
                </p>
              </div>

              <div className="border-l-2 border-[#FDD835] pl-6">
                <p className="text-[1.35rem] font-semibold tracking-tight text-slate-950">
                  Audrey Nyamande-Trigg
                </p>
                <p className="mt-1 text-sm italic text-slate-500">Founder of TCG</p>
              </div>

              <div className="space-y-6">
                <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
                  Credentials &amp; Authority
                </h3>
                <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
                  {founderCredentials.map((item) => (
                    <li key={item} className="flex items-start gap-4">
                      <span className="mt-[0.72rem] h-1 w-1 shrink-0 bg-[#FDD835]" />
                      <span className="text-[0.98rem] font-medium leading-7 text-slate-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link href="/about" className="button-primary group gap-3 px-8 py-4 text-[0.82rem]">
                  Read More
                  <span aria-hidden="true" className="text-base transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>

            <div className="relative lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#f3f3f3] shadow-[0_40px_60px_-15px_rgba(26,28,28,0.08)] lg:translate-y-6">
                <Image
                  src="/media/Audrey-Nyamande-1-cd36ad87.jpeg"
                  alt="Audrey Nyamande-Trigg"
                  width={720}
                  height={900}
                  className="h-full w-full object-cover grayscale-[0.08] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-[#8a0917]/10 mix-blend-multiply opacity-30" />
              </div>

              <div className="absolute -bottom-5 left-0 hidden rounded-[1.25rem] border border-[#8a0917]/10 bg-white px-6 py-5 shadow-[0_22px_50px_rgba(15,23,42,0.12)] lg:block">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8a0917] text-xl text-white">
                    ✦
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[#795900]">
                      Methodology
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">Technically grounded</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Frequently Asked Questions"
            title="Common questions"
            center
          />
          <div className="mx-auto max-w-4xl">
            <FaqList items={homeFaqs} />
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader eyebrow="Our Blogs" title="From the blog" center />
          <p className="mx-auto mb-12 max-w-4xl text-center text-lg leading-8 text-slate-600">
            If you want operational excellence support that shows up in day-to-day work, start with a
            discovery call or request an on-site assessment. We will help you identify opportunities for
            improvement and define the first milestones together.
          </p>
          <div className="grid gap-6 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <article
                key={post.slug}
                className="group relative overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-2 hover:border-[#8a0917]/15 hover:shadow-[0_28px_90px_rgba(15,23,42,0.12)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8a0917] via-[#b41626] to-[#FDD835] opacity-0 transition duration-300 group-hover:opacity-100" />
                <Image
                  src={post.cover}
                  alt={post.title}
                  width={800}
                  height={480}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950 transition duration-300 group-hover:text-[#8a0917]">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#8a0917] transition duration-300 group-hover:gap-3"
                  >
                    Read Article
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner {...globalCta} />
    </div>
  );
}

import Link from "next/link";
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
  TestimonialGrid,
} from "@/components/sections";
import {
  globalCta,
  homeData,
  methodSteps,
  serviceCards,
  serviceFaqs,
  testimonials,
} from "@/lib/site-data";
import { createPageMetadata } from "@/lib/site-seo";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildServiceJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

const servicesSeo = {
  description:
    "Tacklers Consulting Group delivers operational excellence consulting across the UK — Lean transformation, executive coaching, on-site training, and supplier quality support to reduce waste and improve flow.",
  image: "/media/Lean-transformation-consulting-UK-consultant-working-with-team-at-Gemba-1-6dc05d89.jpeg",
  title: "Operational Excellence Consulting UK | Tacklers Consulting Group",
} as const;

const serviceHighlights = [
  {
    title: "Scalable Implementation",
    body: "Start with one value stream or scale across multiple teams with a delivery cadence that remains controlled, visible, and practical.",
  },
  {
    title: "Evidence-Based Strategy",
    body: "Prioritise work through Gemba observation, operational data, and leadership objectives so effort goes where the return will be measurable.",
  },
  {
    title: "Objective Assessment",
    body: "Evaluate flow, waste, management routines, and capability honestly so decisions are based on evidence rather than assumption.",
  },
] as const;

const serviceTiers = [
  {
    title: "Discovery and diagnosis",
    points: [
      "Target the right value stream, function, or operational constraint first.",
      "Assess flow, waste, leadership routines, and capability on-site.",
      "Agree a clear starting point before broader investment is made.",
    ],
  },
  {
    title: "Embedded delivery support",
    points: [
      "Work alongside teams at Gemba to remove waste and improve flow.",
      "Establish daily and weekly management routines that hold under pressure.",
      "Turn improvement activity into measurable operational gains.",
    ],
  },
  {
    title: "Capability transfer",
    points: [
      "Coach leaders and mentors to run the work with confidence.",
      "Build internal problem solving, standard work, and escalation discipline.",
      "Leave behind capability your organisation can sustain without us.",
    ],
  },
] as const;

export const metadata: Metadata = createPageMetadata({
  description: servicesSeo.description,
  image: servicesSeo.image,
  keywords: [
    "operational excellence consulting uk",
    "lean transformation services",
    "lean consulting uk",
    "business process improvement",
    "continuous improvement consulting",
    "gemba walk consulting",
    "lean six sigma consulting uk",
  ],
  path: "/operational-excellence-consulting-uk",
  title: servicesSeo.title,
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: servicesSeo.description,
            path: "/operational-excellence-consulting-uk",
            title: servicesSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/operational-excellence-consulting-uk" },
          ]),
          buildServiceJsonLd({
            description: servicesSeo.description,
            name: "Operational Excellence Services",
            path: "/operational-excellence-consulting-uk",
          }),
          buildFaqJsonLd(serviceFaqs),
        ]}
      />
      <PageHero
        eyebrow="Our services"
        title="Operational Excellence Services in the UK"
        body="Most organisations do not need more initiatives. They need measurable gains in flow, cost, quality, and delivery that hold after the consultants leave."
        primary={globalCta.primary}
        secondary={globalCta.secondary}
        image="/media/Lean-transformation-consulting-UK-consultant-working-with-team-at-Gemba-1-6dc05d89.jpeg"
      />

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Lean transformation services"
            title="Operational support built for measurable results"
            body="Practical support across transformation, leadership coaching, mentoring, capability building, and performance improvement."
            center
          />
          <div className="mx-auto mb-10 grid max-w-6xl gap-6 md:grid-cols-3">
            {serviceHighlights.map((highlight) => (
              <article
                key={highlight.title}
                className="card-hover rounded-[1.5rem] border border-[#8a0917]/10 bg-[#fff9fa] p-6 text-left shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
              >
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a0917]">
                  {highlight.title}
                </p>
                <p className="mt-4 leading-7 text-slate-700">{highlight.body}</p>
              </article>
            ))}
          </div>
          <div className="mx-auto max-w-6xl">
            <CardGrid
              items={serviceCards.map((card) =>
                card.title === "Mentoring"
                  ? { ...card, cta: "View Programme", href: "/lean-training-uk" }
                  : { ...card, cta: undefined, href: undefined }
              )}
            />
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="Service tiers"
            title="A clear route from diagnosis to capability transfer"
            body="Choose the level of support that fits your situation now. We can start focused and scale when the evidence supports it."
            center
          />
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
            {serviceTiers.map((tier) => (
              <article
                key={tier.title}
                className="card-hover rounded-[1.75rem] border border-black/5 bg-white p-8 text-left shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
              >
                <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{tier.title}</h3>
                <ul className="mt-6 space-y-3">
                  {tier.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8a0917]" />
                      <span className="text-slate-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="People-First Lean"
            title="People-First Lean: Results Without the Risk"
            body="We reduce waste, protect expertise, and build capability that lasts."
            center
          />
          <div className="card mx-auto max-w-3xl text-center">
            <ul className="mx-auto max-w-md space-y-3 text-left">
              {[
                "Trust-Based Transformation",
                "Waste-Free Workflows",
                "Redeployed Talent",
                "Retained Expertise",
                "Sustainable Capability",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8a0917] text-xs font-bold text-white">✓</span>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link className="button-primary" href="/discovery-call">
                Book a discovery call
              </Link>
              <Link className="button-secondary" href="/on-site-assessment">
                Request an assessment
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Our approach"
            title="How we work"
            body="Assess what matters, collaborate at Gemba, upskill your teams, and sustain the gains with routines that hold."
            center
          />
          <StepsGrid items={methodSteps} />
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="Industries"
            title="Who we work with"
            body="We support regulated and high-stakes environments where quality, flow, and delivery discipline matter most."
            center
          />
          <div className="mx-auto max-w-6xl">
            <CardGrid items={homeData.industries} columns={3} />
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Testimonials"
            title="What our clients say"
            body="Feedback from teams we have supported across regulated and operationally complex environments."
            center
          />
          <TestimonialGrid items={testimonials} />
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="FAQs"
            title="Frequently asked questions"
            body="Common questions from teams exploring operational excellence support."
            center
          />
          <FaqList items={serviceFaqs} />
        </Container>
      </section>

      <CtaBanner {...globalCta} />
    </>
  );
}

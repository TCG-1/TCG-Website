import type { Metadata } from "next";
import Link from "next/link";

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
import { globalCta, methodSteps, testimonials } from "@/lib/site-data";
import { createPageMetadata } from "@/lib/site-seo";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildServiceJsonLd,
  buildWebPageJsonLd,
} from "@/lib/structured-data";

const pageSeo = {
  description:
    "Lean transformation consulting for UK organisations. We work on-site at Gemba to reduce waste, improve flow, build leadership capability, and deliver sustainable operational gains.",
  image:
    "/media/Lean-transformation-consulting-UK-consultant-working-with-team-at-Gemba-1-6dc05d89.jpeg",
  title: "Lean Transformation Consulting UK | Tacklers",
} as const;

const faqs = [
  {
    question: "What is Lean transformation?",
    answer:
      "Lean transformation is a structured approach to improving how work flows through an organisation. It focuses on removing waste, improving quality, and building leadership habits that sustain gains over time. Unlike isolated improvement projects, Lean transformation changes the management system itself.",
  },
  {
    question: "How long does a Lean transformation take?",
    answer:
      "Timelines vary by scope. Initial improvements are often visible within 4–8 weeks. A full transformation across multiple value streams typically takes 6–18 months, depending on complexity and the level of leadership engagement.",
  },
  {
    question: "Is Lean transformation only for manufacturing?",
    answer:
      "No. Lean principles apply wherever work flows through a process. We have supported Lean transformations in healthcare, energy, IT services, public sector, and aerospace environments alongside traditional manufacturing.",
  },
  {
    question: "What makes your approach different?",
    answer:
      "We are people-first. We reduce waste while protecting and redeploying talent, not cutting it. We work on-site at Gemba, not from a boardroom. And we build internal capability so your teams sustain gains without ongoing dependency on external consultants.",
  },
  {
    question: "Do we need Lean experience before starting?",
    answer:
      "No. We meet organisations where they are. Whether you are starting from scratch or restarting a stalled programme, we adapt our approach to your current maturity and operational context.",
  },
];

export const metadata: Metadata = createPageMetadata({
  description: pageSeo.description,
  image: pageSeo.image,
  keywords: [
    "lean transformation consulting uk",
    "lean transformation programme",
    "lean implementation support",
    "lean consulting services uk",
    "lean management consulting",
    "lean culture change",
  ],
  path: "/lean-transformation-consulting-uk",
  title: pageSeo.title,
});

export default function LeanTransformationPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: pageSeo.description,
            path: "/lean-transformation-consulting-uk",
            title: pageSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Lean Transformation Consulting", path: "/lean-transformation-consulting-uk" },
          ]),
          buildServiceJsonLd({
            description: pageSeo.description,
            name: "Lean Transformation Consulting",
            path: "/lean-transformation-consulting-uk",
          }),
          buildFaqJsonLd(faqs),
        ]}
      />
      <PageHero
        eyebrow="Lean transformation"
        title="Lean Transformation Consulting for UK Organisations"
        body="Lean transformation is not a workshop series. It is a change in how work is managed, improved, and sustained — delivered through practical on-site support, evidence-based strategy, and leadership capability building."
        primary={globalCta.primary}
        secondary={globalCta.secondary}
        image={pageSeo.image}
      />

      <section className="section-gap">
        <Container>
          <div className="mx-auto max-w-4xl">
            <SectionHeader
              eyebrow="What we do"
              title="Practical Lean transformation that delivers lasting results"
            />
            <div className="space-y-6 text-base leading-8 text-slate-700">
              <p>
                Most organisations that invest in Lean transformation get the same experience: a burst
                of workshop activity, some early wins, and then a slow return to old habits. The
                missing piece is almost always the same — the management system, leadership routines,
                and daily discipline needed to sustain improvement were never built properly.
              </p>
              <p>
                We approach Lean transformation differently. We work on-site at Gemba alongside your
                teams to understand how work actually flows, where waste is creating the most damage,
                and what needs to change to make improvement sustainable. Our support covers the full
                transformation lifecycle: from initial assessment and value stream analysis through to
                implementation support, leadership coaching, and capability transfer.
              </p>
              <p>
                We do not impose a one-size-fits-all framework. We adapt proven Lean principles —
                value stream mapping, standard work, visual management, daily management, Kaizen — to
                fit your operational context, sector requirements, and organisational maturity. The
                goal is not to create a Lean programme. It is to change how your organisation manages
                and improves work, permanently.
              </p>
              <p>
                Our people-first approach means we reduce waste while protecting and redeploying
                talent. We do not chase headcount reduction. We help you build the capability,
                leadership habits, and management systems that make performance gains stick — so your
                teams are stronger, more capable, and more independent after our engagement ends.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="Core elements"
            title="What a Lean transformation programme includes"
            body="Every transformation is different, but these elements form the foundation of sustainable change."
            center
          />
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Value Stream Analysis",
                body: "We map end-to-end flow to expose waste, bottlenecks, and improvement opportunities that have the greatest impact on delivery performance.",
              },
              {
                title: "Waste Elimination",
                body: "Structured removal of the eight wastes — overproduction, waiting, transport, over-processing, inventory, motion, defects, and unused talent.",
              },
              {
                title: "Standard Work",
                body: "Documented best-known methods that reduce variation, improve quality, and give teams a stable baseline for further improvement.",
              },
              {
                title: "Daily Management",
                body: "Visual boards, short interval control, and tiered meetings that make performance visible and keep teams aligned on priorities.",
              },
              {
                title: "Leadership Routines",
                body: "Structured Gemba walks, coaching conversations, and escalation cadences that build the operating rhythm needed to sustain change.",
              },
              {
                title: "Capability Transfer",
                body: "On-the-job mentoring and structured development so your teams own the improvement capability when external support ends.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="card-hover rounded-[1.5rem] border border-[#8a0917]/10 bg-white p-6 text-left shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
              >
                <h3 className="text-lg font-bold text-[#8a0917]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Our approach"
            title="How we deliver Lean transformation"
            body="A four-stage method that keeps things clear, practical, and sustainable."
            center
          />
          <StepsGrid items={methodSteps} />
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="Related services"
            title="Services that support Lean transformation"
            body="These services often form part of a broader transformation programme."
            center
          />
          <CardGrid
            items={[
              {
                title: "Executive Leadership Coaching",
                body: "Build the leadership habits that sustain transformation gains beyond the initial implementation.",
                cta: "Learn more",
                href: "/services/executive-leadership-coaching-operations",
              },
              {
                title: "Business Process Management",
                body: "Define how work should flow, establish ownership, and bring consistency across teams and sites.",
                cta: "Learn more",
                href: "/services/business-process-management-consulting-uk",
              },
              {
                title: "Lean Training & Mentoring",
                body: "Build internal capability through structured on-the-job development tied to real operational challenges.",
                cta: "View programme",
                href: "/lean-training-uk",
              },
            ]}
            columns={3}
          />
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Testimonials"
            title="What our clients say"
            body="Feedback from teams we have supported through Lean transformation."
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
            body="Common questions about Lean transformation consulting."
            center
          />
          <div className="mx-auto max-w-4xl">
            <FaqList items={faqs} />
          </div>
        </Container>
      </section>

      <CtaBanner {...globalCta} />
    </>
  );
}

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
    "Gemba consulting for UK organisations. Solve problems and improve performance where the work happens — on the shop floor, the production line, the ward, and the front line.",
  image: "/media/Productivity-Improvement-1d0b843c.jpeg",
  title: "Gemba Consulting UK | Lean Gemba Walk Consultants | Tacklers",
} as const;

const faqs = [
  {
    question: "What is Gemba?",
    answer:
      "Gemba is a Japanese word meaning 'the real place'. In Lean thinking, it refers to where value is created — the shop floor, the production line, the hospital ward, or wherever work happens. Gemba consulting means solving problems and improving performance at the point of work, not from a boardroom or a spreadsheet.",
  },
  {
    question: "What is a Gemba walk?",
    answer:
      "A Gemba walk is a structured visit to where work is done, with the purpose of observing processes, understanding problems, and engaging teams. It is not an audit or an inspection — it is a leadership routine for learning what is really happening and supporting teams to improve.",
  },
  {
    question: "How is Gemba consulting different from other consulting?",
    answer:
      "Traditional consulting often works from data, reports, and interviews. Gemba consulting starts at the point of work — watching how value flows, where problems occur, and what people actually do. This gives a far more accurate picture than any report and leads to solutions that work in practice, not just in theory.",
  },
  {
    question: "How long does a Gemba engagement take?",
    answer:
      "It depends on the scope. A focused Gemba diagnostic can be completed in days. Building a sustained Gemba-based management system typically takes three to six months. We scope every engagement around your specific challenges and readiness.",
  },
  {
    question: "Do you work with service organisations or just manufacturing?",
    answer:
      "We work across manufacturing, healthcare, logistics, professional services, construction, and food and drink. Gemba principles apply wherever work is done — the point of work just looks different in each sector.",
  },
];

export const metadata: Metadata = createPageMetadata({
  description: pageSeo.description,
  image: pageSeo.image,
  keywords: [
    "gemba consulting uk",
    "gemba walk consulting",
    "gemba lean consulting",
    "shopfloor improvement consulting",
    "gemba management",
    "lean gemba walks",
  ],
  path: "/gemba-consulting",
  title: pageSeo.title,
});

export default function GembaConsultingPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: pageSeo.description,
            path: "/gemba-consulting",
            title: pageSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Gemba Consulting", path: "/gemba-consulting" },
          ]),
          buildServiceJsonLd({
            description: pageSeo.description,
            name: "Gemba Consulting",
            path: "/gemba-consulting",
          }),
          buildFaqJsonLd(faqs),
        ]}
      />
      <PageHero
        eyebrow="Gemba consulting"
        title="Gemba Consulting — Improve Performance Where the Work Happens"
        body="We work at the point of value creation — observing, coaching, and building systems that help teams solve problems and improve performance every day."
        primary={globalCta.primary}
        secondary={globalCta.secondary}
        image={pageSeo.image}
      />

      <section className="section-gap">
        <Container>
          <div className="mx-auto max-w-4xl">
            <SectionHeader
              eyebrow="Our philosophy"
              title="Why Gemba matters"
            />
            <div className="space-y-6 text-base leading-8 text-slate-700">
              <p>
                In many organisations, decisions about operations are made far from where the work
                happens. Leaders rely on reports, dashboards, and second-hand information to
                understand performance. Problems get reported upward days or weeks after they occur.
                Solutions are designed in offices and imposed on teams, often missing the root cause
                entirely.
              </p>
              <p>
                Gemba consulting reverses that pattern. We start by going to where value is created —
                the production line, the warehouse floor, the hospital ward, the construction site —
                and observing how work actually flows. We watch where delays occur, where people
                struggle, where information breaks down, and where standards are unclear. This gives
                us an understanding of performance that no report can match.
              </p>
              <p>
                From there, we work with teams to solve problems at source. We coach leaders to
                develop Gemba walk routines that keep them connected to the work. We build daily
                management systems that make abnormalities visible and problems easy to escalate. And
                we develop problem-solving capability so teams can identify and fix issues
                independently, without waiting for instruction.
              </p>
              <p>
                The result is an organisation that makes decisions based on reality, solves problems
                faster, and builds performance from the ground up — not the top down. When leaders
                are present at Gemba, they build trust, remove barriers, and create the conditions
                for teams to do their best work.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="What we deliver"
            title="Our Gemba consulting approach"
            body="Practical, on-site work that builds lasting capability."
            center
          />
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Gemba Diagnostics",
                body: "On-site observation and analysis of how work flows, where waste exists, and what opportunities are available for immediate and lasting improvement.",
              },
              {
                title: "Gemba Walk Coaching",
                body: "Teaching leaders how to observe, ask questions, and coach at the point of work — turning Gemba walks from inspections into learning opportunities.",
              },
              {
                title: "Daily Management Systems",
                body: "Visual boards, tiered meetings, and short interval control that make performance visible and enable rapid problem resolution at every level.",
              },
              {
                title: "Problem-Solving at Source",
                body: "Building team capability in structured problem-solving — A3 thinking, 5 Whys, PDCA — so issues are resolved where they occur.",
              },
              {
                title: "Standard Work Development",
                body: "Documenting the best-known method for critical processes, creating a stable baseline that makes variation visible and improvement possible.",
              },
              {
                title: "Leadership Routines",
                body: "Establishing the cadence of Gemba presence, review, and follow-through that keeps leaders connected to reality and teams supported in their work.",
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
            eyebrow="Our method"
            title="How a Gemba engagement works"
            body="A structured approach that builds understanding, capability, and momentum."
            center
          />
          <StepsGrid items={methodSteps} />
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="Related services"
            title="Services that complement Gemba consulting"
            body="These services work alongside Gemba consulting to strengthen your operations."
            center
          />
          <CardGrid
            items={[
              {
                title: "Lean Transformation",
                body: "Larger-scale transformation programmes that create the operating system for Gemba-based management.",
                cta: "Learn more",
                href: "/lean-transformation-consulting-uk",
              },
              {
                title: "Continuous Improvement",
                body: "Build the daily improvement habits and Kaizen culture that make Gemba observations actionable.",
                cta: "Learn more",
                href: "/continuous-improvement-consulting-uk",
              },
              {
                title: "Executive Leadership Coaching",
                body: "Develop leaders who can observe, coach, and create the conditions for frontline teams to improve.",
                cta: "Learn more",
                href: "/services/executive-leadership-coaching-uk",
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
            body="Feedback from organisations where we have worked at Gemba."
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
            body="Common questions about Gemba consulting."
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

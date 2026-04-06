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
    "Continuous improvement consulting for UK organisations. Build sustainable improvement capability, embed Kaizen thinking, and create a culture where teams improve how they work every day.",
  image: "/media/Productivity-Improvement-1d0b843c.jpeg",
  title: "Continuous Improvement Consulting UK | Tacklers",
} as const;

const faqs = [
  {
    question: "What is continuous improvement?",
    answer:
      "Continuous improvement is the practice of making ongoing, incremental changes to processes, systems, and behaviours to improve quality, efficiency, and delivery. It is not a one-off initiative — it is a way of working that becomes part of how the organisation operates.",
  },
  {
    question: "How is continuous improvement different from Lean transformation?",
    answer:
      "Lean transformation is often a larger-scale change programme that redesigns how work flows and how the organisation is managed. Continuous improvement is the ongoing discipline of making things better day by day. In practice, Lean transformation creates the foundation, and continuous improvement sustains and extends the gains.",
  },
  {
    question: "Do we need a continuous improvement team?",
    answer:
      "Not necessarily. The strongest CI cultures embed improvement into every team's daily work, not a separate department. We help build that capability across your organisation so improvement is everyone's responsibility.",
  },
  {
    question: "What tools do you use?",
    answer:
      "We use practical Lean tools including Kaizen events, value stream mapping, A3 problem solving, 5 Whys, standard work, visual management, and PDCA cycles. We select tools based on the problem, not the other way around.",
  },
  {
    question: "How do we sustain a continuous improvement culture?",
    answer:
      "Sustainability comes from leadership routines, daily management discipline, and making improvement part of how work is managed — not a separate programme. We build all three so the culture holds after external support ends.",
  },
];

export const metadata: Metadata = createPageMetadata({
  description: pageSeo.description,
  image: pageSeo.image,
  keywords: [
    "continuous improvement consulting uk",
    "continuous improvement programme",
    "kaizen consulting uk",
    "CI culture building",
    "operational improvement consulting",
    "lean continuous improvement",
  ],
  path: "/continuous-improvement-consulting-uk",
  title: pageSeo.title,
});

export default function ContinuousImprovementPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: pageSeo.description,
            path: "/continuous-improvement-consulting-uk",
            title: pageSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Continuous Improvement Consulting", path: "/continuous-improvement-consulting-uk" },
          ]),
          buildServiceJsonLd({
            description: pageSeo.description,
            name: "Continuous Improvement Consulting",
            path: "/continuous-improvement-consulting-uk",
          }),
          buildFaqJsonLd(faqs),
        ]}
      />
      <PageHero
        eyebrow="Continuous improvement"
        title="Continuous Improvement Consulting for UK Organisations"
        body="Build a sustainable improvement culture where teams identify waste, solve problems at source, and improve how they work every day — not just during improvement events."
        primary={globalCta.primary}
        secondary={globalCta.secondary}
        image={pageSeo.image}
      />

      <section className="section-gap">
        <Container>
          <div className="mx-auto max-w-4xl">
            <SectionHeader
              eyebrow="What we do"
              title="Building genuine continuous improvement capability"
            />
            <div className="space-y-6 text-base leading-8 text-slate-700">
              <p>
                Many organisations describe themselves as having a continuous improvement culture, but
                in reality, improvement is project-based, consultant-dependent, or limited to a small
                team. When the project ends or the CI manager moves on, the activity stops and
                performance drifts back.
              </p>
              <p>
                We help organisations build genuine continuous improvement capability — where
                improvement is embedded in daily work, owned by teams at every level, and sustained
                by leadership routines that keep the momentum alive. Our approach starts with the
                problems your teams face today and builds their ability to solve them systematically,
                using practical Lean tools in the context of real work.
              </p>
              <p>
                We work on-site at Gemba to understand how work flows, where problems recur, and what
                is preventing teams from improving independently. From there, we build problem-solving
                capability, establish Kaizen routines, strengthen daily management, and coach leaders
                to create the conditions for continuous improvement to thrive.
              </p>
              <p>
                The result is an organisation that does not just do improvement — it improves how it
                improves. Teams get better at spotting waste, solving problems, and sustaining gains.
                Leaders get better at coaching, prioritising, and following through. And the
                organisation builds a competitive advantage that compounds over time.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="Core capabilities"
            title="What we help you build"
            body="The building blocks of a sustainable continuous improvement culture."
            center
          />
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Problem-Solving Capability",
                body: "Teams learn to use structured methods — A3 thinking, 5 Whys, PDCA — to solve problems at source rather than working around them.",
              },
              {
                title: "Kaizen Culture",
                body: "Regular, focused improvement events that deliver measurable gains and build team confidence in the improvement process.",
              },
              {
                title: "Daily Management Discipline",
                body: "Visual boards, short interval control, and tiered meetings that make performance visible and improvement part of every day.",
              },
              {
                title: "Leadership Coaching",
                body: "Leaders learn to coach, not just direct — asking better questions, following through consistently, and creating the conditions for teams to improve.",
              },
              {
                title: "Standard Work",
                body: "Documented best-known methods that give teams a stable baseline to improve from, reducing variation and making gains visible.",
              },
              {
                title: "Sustainability Routines",
                body: "The management routines, review cadences, and escalation habits that keep improvement alive after external support ends.",
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
            title="How we build continuous improvement capability"
            body="A structured method that develops your teams' ability to improve independently."
            center
          />
          <StepsGrid items={methodSteps} />
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="Related services"
            title="Services that complement continuous improvement"
            body="These services often run alongside continuous improvement consulting."
            center
          />
          <CardGrid
            items={[
              {
                title: "Lean Transformation",
                body: "Broader transformation work sets the foundation for continuous improvement to thrive.",
                cta: "Learn more",
                href: "/lean-transformation-consulting-uk",
              },
              {
                title: "Productivity Improvement",
                body: "Targeted capacity release and throughput gains that complement ongoing improvement activity.",
                cta: "Learn more",
                href: "/services/productivity-improvement-consulting-uk",
              },
              {
                title: "Strategy Deployment",
                body: "Align continuous improvement priorities with strategic goals so effort creates maximum value.",
                cta: "Learn more",
                href: "/services/strategy-deployment-consulting-uk",
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
            body="Feedback from teams we have supported through continuous improvement programmes."
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
            body="Common questions about continuous improvement consulting."
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

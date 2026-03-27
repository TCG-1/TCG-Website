import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Operational Excellence Services in the UK | Tacklers Consulting Group",
  description:
    "Hands-on operational excellence services for UK organisations: Lean transformation, process improvement, coaching, training, and supplier quality support.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Operational Excellence Services in the UK"
        body="Most organisations do not need more initiatives. They need work that runs better on a normal Tuesday. Tacklers supports teams with hands-on operational excellence services across the UK to improve flow, reduce waste, and build routines that keep results in place."
        primary={globalCta.primary}
        secondary={globalCta.secondary}
        image="/media/Lean-transformation-consulting-UK-consultant-working-with-team-at-Gemba-1-6dc05d89.jpeg"
      />

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Core offer"
            title="Our core services"
            body="Practical support across transformation, coaching, capability building, and performance improvement."
          />
          <CardGrid items={serviceCards.map((card) => ({ ...card, cta: "View programme", href: "/contact-us" }))} />
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="Need a starting point?"
            title="Don't know where to start?"
            body="If you are not sure which option fits, book a discovery call. We will pick a starting point that makes sense for your reality, not an ideal world."
          />
          <div className="card max-w-3xl">
            <p className="text-lg leading-8 text-slate-600">
              We keep the approach simple because the work is already complex.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a className="button-primary" href="/book-a-discovery-call">
                Free consultation call
              </a>
              <a className="button-secondary" href="/request-an-on-site-assessment">
                Request assessment
              </a>
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
          />
          <CardGrid items={homeData.industries} columns={3} />
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Testimonials"
            title="What our clients say"
            body="Feedback from teams we have supported across regulated and operationally complex environments."
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
          />
          <FaqList items={serviceFaqs} />
        </Container>
      </section>

      <CtaBanner {...globalCta} />
    </>
  );
}

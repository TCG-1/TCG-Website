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
    "Explore Tacklers Consulting Group operational excellence consulting services in the UK, including Lean transformation, coaching, training, and supplier quality support.",
  image: "/media/Lean-transformation-consulting-UK-consultant-working-with-team-at-Gemba-1-6dc05d89.jpeg",
  title: "Operational Excellence Consulting UK | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: servicesSeo.description,
  image: servicesSeo.image,
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
            center
          />
          <div className="mx-auto max-w-6xl">
            <CardGrid
              items={serviceCards.map((card) => ({ ...card, cta: "View programme", href: "/contact" }))}
            />
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="Need a starting point?"
            title="Don't know where to start?"
            body="If you are not sure which option fits, book a discovery call. We will pick a starting point that makes sense for your reality, not an ideal world."
            center
          />
          <div className="card mx-auto max-w-3xl text-center">
            <p className="text-lg leading-8 text-slate-600">
              We keep the approach simple because the work is already complex.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a className="button-primary" href="/discovery-call">
                Free consultation call
              </a>
              <a className="button-secondary" href="/on-site-assessment">
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

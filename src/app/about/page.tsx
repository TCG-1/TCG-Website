import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import {
  CardGrid,
  Container,
  CtaBanner,
  FaqList,
  FeatureList,
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
        image="/media/audrey-and-arlandous-1-e1773762025172-1b5d8b67.jpeg"
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
          <SectionHeader
            eyebrow="Holistic approach"
            title="What we do"
            body="We help organisations improve operational performance in complex, regulated environments."
            center
          />
          <div className="mx-auto max-w-4xl">
            <FeatureList items={aboutServices} />
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
          <SectionHeader
            eyebrow="Our team"
            title="Meet our team"
            body="We are a small team on purpose. You get people who show up, ask the right questions, and stay close to the work."
            center
          />
          <div className="mx-auto max-w-5xl">
            <CardGrid
              items={teamMembers.map((member) => ({
                title: member.name,
                body: `${member.role}. ${member.body}`,
              }))}
              columns={2}
            />
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
          <SectionHeader
            eyebrow="Our focus"
            title="What a good engagement feels like"
            center
          />
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
            <div className="card">
              <h3 className="text-2xl font-semibold text-slate-950">You should feel</h3>
              <div className="mt-6">
                <FeatureList items={experienceDo} />
              </div>
            </div>
            <div className="card">
              <h3 className="text-2xl font-semibold text-slate-950">You should not feel</h3>
              <div className="mt-6">
                <FeatureList items={experienceDont} />
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

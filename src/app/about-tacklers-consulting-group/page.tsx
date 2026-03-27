import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "About Tacklers Consulting Group",
  description:
    "Learn about Tacklers Consulting Group, our people-first Lean approach, our team, and how we support transformation work that lasts.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title="About Tacklers Consulting Group"
        body="We started Tacklers for a simple reason. Too many organisations invest in transformation, then get a report, a workshop, and a few weeks of noise. We work on-site at Gemba with your teams to improve flow, reduce waste, and build ways of working your people can sustain."
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
          />
          <CardGrid items={aboutBeliefs} columns={2} />
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Holistic approach"
            title="What we do"
            body="We help organisations improve operational performance in complex, regulated environments."
          />
          <FeatureList items={aboutServices} />
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

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Our team"
            title="Meet our team"
            body="We are a small team on purpose. You get people who show up, ask the right questions, and stay close to the work."
          />
          <CardGrid
            items={teamMembers.map((member) => ({
              title: member.name,
              body: `${member.role}. ${member.body}`,
            }))}
            columns={2}
          />
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="The Tacklers method"
            title="How we work"
            body="A four-stage method that keeps things clear, practical, and results-focused."
          />
          <StepsGrid items={methodSteps} />
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Our focus"
            title="What a good engagement feels like"
          />
          <div className="grid gap-6 lg:grid-cols-2">
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
          <SectionHeader eyebrow="FAQs" title="Frequently asked questions" body="Common questions about how we work and who we support." />
          <FaqList items={aboutFaqs} />
        </Container>
      </section>

      <CtaBanner {...globalCta} />
    </>
  );
}

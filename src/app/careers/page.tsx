import type { Metadata } from "next";

import { CareersPortal } from "@/components/careers/careers-portal";
import { CardGrid, Container, PageHero, SectionHeader } from "@/components/sections";

export const metadata: Metadata = {
  title: "Careers at Tacklers Consulting Group",
  description:
    "Explore job positions at Tacklers Consulting Group and submit applications with attachment uploads through the careers portal.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers at TCG"
        title="Build something that holds."
        body="We hire for people who want to work where the real problems live. Explore open positions below or join the talent network for future roles."
        primary={{ label: "View open roles", href: "#careers-portal" }}
      />

      <section className="section-gap bg-slate-50">
        <Container>
          <div id="careers-portal">
            <SectionHeader
              eyebrow="Open positions"
              title="Current roles and applications"
              body="Choose a live role or join the talent network. Applications, notes, and attachments go straight into the recruitment workspace."
              center
            />
            <CareersPortal />
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <SectionHeader eyebrow="Why TCG" title="What makes this different" center />
          <div className="mx-auto max-w-5xl">
            <CardGrid
              columns={2}
              centerText
              items={[
                {
                  title: "People first",
                  body: "We do not cut headcount to hit a number. We build capability, redeploy talent, and make teams stronger from within.",
                },
                {
                  title: "Work at Gemba",
                  body: "We do not send decks from a distance. We go where the work happens and improve it side-by-side with your team.",
                },
                {
                  title: "Real impact",
                  body: "Our work shows up in flow, quality, and delivery, not just a report. If it does not hold, it does not count.",
                },
                {
                  title: "Growth mindset",
                  body: "Mentorship and challenging work across aerospace, healthcare, and energy sectors are part of the plan.",
                },
              ]}
            />
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <div className="card mx-auto max-w-3xl text-center">
            <p className="eyebrow">Talent network</p>
            <h2 className="section-title">Join our Talent Network</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Do not see a role? Send us your details anyway. We keep a shortlist of exceptional Lean experts for when new projects launch.
            </p>
            <a className="button-primary mt-8 inline-flex" href="#career-application-form">
              Start an application
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";

import { Container, PageHero } from "@/components/sections";

export const metadata: Metadata = {
  title: "Request an on-site assessment",
  description:
    "Ask Tacklers Consulting Group for an on-site assessment to identify waste, bottlenecks, and the right improvement starting point.",
};

export default function AssessmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Assessment"
        title="Request an on-site assessment"
        body="Get a clear plan for your goals. Ask questions, talk through options, and leave knowing what to do next."
      />
      <section className="section-gap">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="card overflow-hidden p-0">
              <iframe
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ11USKg535CHbRA9WSL0S5pk5gn6mcWHMmSaJ3Vxj5WqV614xUELPlmSnmukgDUtpXGvoCIEcA2?gv=true"
                title="Google Calendar on-site assessment scheduling"
                style={{ border: 0 }}
                width="100%"
                height="600"
                frameBorder="0"
                loading="lazy"
              />
            </div>
            <div className="grid gap-6">
              <div className="card grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="eyebrow">Free consultation</p>
                  <p className="mt-3 text-slate-600">A short conversation to understand the problem before suggesting a path.</p>
                </div>
                <div>
                  <p className="eyebrow">Lean certified</p>
                  <p className="mt-3 text-slate-600">Practical operational excellence support grounded in real delivery constraints.</p>
                </div>
                <div>
                  <p className="eyebrow">Flexible scheduling</p>
                  <p className="mt-3 text-slate-600">We work around operational reality, not the other way around.</p>
                </div>
                <div>
                  <p className="eyebrow">Mon-Fri 9:00 AM - 5:00 PM</p>
                  <p className="mt-3 text-slate-600">Typical availability for consultation and planning discussions.</p>
                </div>
              </div>
              <div className="card">
                <p className="eyebrow">Our approach</p>
                <p className="mt-4 leading-8 text-slate-600">
                  We keep it honest. We do not push services you do not need. If you are a good fit, we will tell you. If you are not, we will tell you that too.
                </p>
                <a href="/operational-excellence-services-uk" className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-[#8a0917]">
                  Explore more services
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

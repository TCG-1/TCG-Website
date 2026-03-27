import type { Metadata } from "next";

import { Container, PageHero } from "@/components/sections";

export const metadata: Metadata = {
  title: "Book Your Lean Training Session",
  description:
    "Request a Lean training session for leaders and teams that need practical skills tied to real work.",
};

export default function TrainingBookingPage() {
  return (
    <>
      <PageHero
        eyebrow="Lean training"
        title="Book Your Lean Training Session"
        body="If you are looking for Lean training UK teams can actually use, you are in the right place. We keep it close to real work so it sticks."
      />
      <section className="section-gap">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="card overflow-hidden p-0">
              <iframe
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0UzjL0Lcv8jfoEPCIOsd9ixdkSGfvYESVsoClERgG3oDL3KI70KxeNhucFnpaYS0y23iMYE5eS?gv=true"
                title="Google Calendar Lean training scheduling"
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
                  <p className="mt-3 text-slate-600">Talk through audience, format, and where training should support live priorities.</p>
                </div>
                <div>
                  <p className="eyebrow">Lean certified</p>
                  <p className="mt-3 text-slate-600">Practical training built around how teams actually work.</p>
                </div>
                <div>
                  <p className="eyebrow">Flexible scheduling</p>
                  <p className="mt-3 text-slate-600">Delivered in a way that respects operational commitments.</p>
                </div>
                <div>
                  <p className="eyebrow">Mon-Fri 9:00 AM - 5:00 PM</p>
                  <p className="mt-3 text-slate-600">Typical planning availability for live sessions and programme setup.</p>
                </div>
              </div>
              <div className="card">
                <p className="eyebrow">Our approach</p>
                <p className="mt-4 leading-8 text-slate-600">
                  We do not push theory overload or feel-good workshops that vanish the next week. The goal is useful capability that teams can apply immediately.
                </p>
                <a href="/lean-services" className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-[#8a0917]">
                  Explore lean services
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

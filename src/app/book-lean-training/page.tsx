import type { Metadata } from "next";

import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { JsonLd } from "@/components/seo/json-ld";
import { Container, PageHero } from "@/components/sections";
import { createPageMetadata } from "@/lib/site-seo";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

const bookLeanTrainingSeo = {
  description:
    "Enquire about Lean training for your team. Tacklers Consulting Group delivers practical, on-the-job capability building tied to real work. Enquire today.",
  image: "/media/photo-1454165804606-c3d57bc86b40-354f8fd9.jpg",
  title: "Book Lean Training UK | Tacklers",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: bookLeanTrainingSeo.description,
  image: bookLeanTrainingSeo.image,
  keywords: [
    "book lean training uk",
    "lean training enquiry",
    "lean capability building",
  ],
  path: "/book-lean-training",
  title: bookLeanTrainingSeo.title,
});

export default function TrainingBookingPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: bookLeanTrainingSeo.description,
            path: "/book-lean-training",
            title: bookLeanTrainingSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Book Lean Training", path: "/book-lean-training" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Lean training"
        title="Book Your Lean Training Session"
        body="Tell us who the training is for, what capability needs to grow, and how the delivery should support live operational priorities."
        primary={{ label: "Start your request", href: "#lead-capture-form" }}
        secondary={{ label: "Explore Lean training", href: "/lean-training-uk" }}
        image={bookLeanTrainingSeo.image}
      />
      <section className="section-gap">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <LeadCaptureForm id="lead-capture-form" title="Plan your Lean training request" variant="lean_training" />
            <div className="grid gap-6">
              <div className="card grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="eyebrow">Free consultation</p>
                  <p className="mt-3 text-slate-600">Talk through audience, format, and where training should support live priorities.</p>
                </div>
                <div>
                  <p className="eyebrow">Lean certified</p>
                  <p className="mt-3 text-slate-600">500+ individuals trained in Lean Principles.</p>
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
                <p className="eyebrow">Better qualification</p>
                <p className="mt-4 leading-8 text-slate-600">
                  The form lets us qualify delivery mode, audience size, and capability gaps before we come
                  back to you, so the next conversation is already grounded in what the team needs.
                </p>
              </div>
              <div className="card">
                <p className="eyebrow">Our approach</p>
                <p className="mt-4 leading-8 text-slate-600">
                  We do not push theory overload or feel-good workshops that vanish the next week. The goal is useful capability that teams can apply immediately in their own environment.
                </p>
                <a href="/lean-training-uk" className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-[#8a0917]">
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

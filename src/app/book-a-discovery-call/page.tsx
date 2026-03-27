import type { Metadata } from "next";

import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { Container, PageHero } from "@/components/sections";

export const metadata: Metadata = {
  title: "Book a discovery call",
  description:
    "Request a discovery call with Tacklers Consulting Group to discuss your operational bottlenecks and next steps.",
};

export default function DiscoveryCallPage() {
  return (
    <>
      <PageHero
        eyebrow="Book now"
        title="Book a discovery call"
        body="Select a time window that works best for you to discuss current bottlenecks, where work gets stuck, and whether a discovery call or on-site assessment is the right first step."
      />
      <section className="section-gap">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <LeadCaptureForm title="Request your discovery call" variant="discovery_call" />
            <div className="grid gap-6">
              <div className="card">
                <p className="eyebrow">What to expect</p>
                <ul className="mt-4 space-y-3 text-slate-600">
                  <li>30-minute deep dive into your current bottlenecks</li>
                  <li>Preliminary roadmap for lean transformation</li>
                  <li>Transparent view of how support could be structured</li>
                </ul>
              </div>
              <div className="card">
                <p className="eyebrow">Why the form is better</p>
                <p className="mt-4 leading-8 text-slate-600">
                  We now collect the context we actually need before we reply, so the follow-up is more
                  useful than a generic scheduling link.
                </p>
              </div>
              <div className="card">
                <p className="eyebrow">Need help?</p>
                <a href="mailto:hello@tacklersconsulting.com" className="mt-4 block text-lg font-medium text-slate-700">
                  hello@tacklersconsulting.com
                </a>
                <a href="tel:+447932105847" className="mt-2 block text-lg font-medium text-slate-700">
                  +44 7932 105847
                </a>
                <p className="mt-4 text-slate-600">We support teams from front-line operations through to C-Suite leadership.</p>
              </div>
              <div className="card">
                <p className="eyebrow">On-site delivery</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">We come to your site</h2>
                <p className="mt-4 leading-8 text-slate-600">
                  Tacklers Consulting Group travels to client locations across the UK. We do not operate a public visitor office.
                </p>
                <p className="mt-4 text-slate-600">If an on-site visit makes sense, we can scope it during your discovery call.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

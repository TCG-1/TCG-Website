import type { Metadata } from "next";

import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { JsonLd } from "@/components/seo/json-ld";
import { Container, PageHero } from "@/components/sections";
import { createPageMetadata } from "@/lib/site-seo";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

const discoveryCallSeo = {
  description:
    "Book a free discovery call with Tacklers Consulting Group. Discuss your bottlenecks, improvement priorities, and the best first step for Lean transformation in your organisation.",
  image: "/media/Strategy-Deployment-cb6e4118.jpeg",
  title: "Book a Free Discovery Call | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: discoveryCallSeo.description,
  image: discoveryCallSeo.image,
  keywords: [
    "book lean consulting call",
    "free lean transformation consultation",
    "operational excellence discovery call",
    "lean improvement consultation uk",
  ],
  path: "/discovery-call",
  title: discoveryCallSeo.title,
});

export default function DiscoveryCallPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: discoveryCallSeo.description,
            path: "/discovery-call",
            title: discoveryCallSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Book a discovery call", path: "/discovery-call" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Book now"
        title="Book a discovery call"
        body="Start with a focused conversation about where work is getting stuck, what matters most now, and the right first move."
        primary={{ label: "Start your request", href: "#lead-capture-form" }}
        secondary={{ label: "Request an on-site assessment", href: "/on-site-assessment" }}
        image={discoveryCallSeo.image}
      />
      <section className="section-gap">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <LeadCaptureForm id="lead-capture-form" title="Request your discovery call" variant="discovery_call" />
            <div className="grid gap-6">
              <div className="card">
                <p className="eyebrow">What to expect</p>
                <ul className="mt-4 space-y-3 text-slate-600">
                  <li>Focused discussion on your current bottlenecks and priorities</li>
                  <li>Clear view of whether a discovery call or on-site assessment is the right next step</li>
                  <li>Practical outline of how support could be structured</li>
                </ul>
              </div>
              <div className="card">
                <p className="eyebrow">Why we ask for context</p>
                <p className="mt-4 leading-8 text-slate-600">
                  The form gives us enough operational context to respond with a useful next step
                  rather than a generic scheduling link.
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
                <p className="mt-4 text-slate-600">We support teams across all levels of the organisation.</p>
              </div>
              <div className="card">
                <p className="eyebrow">On-site delivery</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">We come to your site</h2>
                <p className="mt-4 leading-8 text-slate-600">
                  We go where the work happens—no offices, no distractions.
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

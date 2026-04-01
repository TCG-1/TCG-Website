import type { Metadata } from "next";

import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { JsonLd } from "@/components/seo/json-ld";
import { Container, PageHero } from "@/components/sections";
import { createPageMetadata } from "@/lib/site-seo";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

const onSiteAssessmentSeo = {
  description:
    "Request an on-site assessment from Tacklers Consulting Group to identify waste, bottlenecks, and the highest-impact starting point for improvement.",
  image: "/media/Supplier-Quality-Development-a29c0c6d.jpeg",
  title: "On-Site Assessment | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: onSiteAssessmentSeo.description,
  image: onSiteAssessmentSeo.image,
  keywords: [
    "on-site lean assessment uk",
    "operational assessment",
    "lean improvement assessment",
  ],
  path: "/on-site-assessment",
  title: onSiteAssessmentSeo.title,
});

export default function AssessmentPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: onSiteAssessmentSeo.description,
            path: "/on-site-assessment",
            title: onSiteAssessmentSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Request an on-site assessment", path: "/on-site-assessment" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Assessment"
        title="Request an on-site assessment"
        body="Get a clear view of where to focus first, what should improve next, and which on-site support will create the greatest operational impact."
        primary={{ label: "Start your request", href: "#lead-capture-form" }}
        secondary={{ label: "Book a discovery call", href: "/discovery-call" }}
        image={onSiteAssessmentSeo.image}
      />
      <section className="section-gap">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <LeadCaptureForm id="lead-capture-form" title="Request your on-site assessment" variant="on_site_assessment" />
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
                <p className="eyebrow">What we ask up front</p>
                <p className="mt-4 leading-8 text-slate-600">
                  Site location, operational context, and urgency help us decide whether an assessment is the
                  right move and what level of preparation is needed before we respond.
                </p>
              </div>
              <div className="card">
                <p className="eyebrow">Our approach</p>
                <p className="mt-4 leading-8 text-slate-600">
                  We keep it honest. We do not push services you do not need. If you are a good fit, we will tell you. If you need something more focused, we will help define the next step clearly.
                </p>
                <a href="/operational-excellence-consulting-uk" className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-[#8a0917]">
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

import type { Metadata } from "next";
import Link from "next/link";

import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Container,
  CtaBanner,
  FaqList,
  PageHero,
  SectionHeader,
} from "@/components/sections";
import { createPageMetadata } from "@/lib/site-seo";
import { contactFaqs, globalCta } from "@/lib/site-data";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

const contactSeo = {
  description:
    "Get in touch with Tacklers Consulting Group to discuss Lean transformation, operational excellence, or book a discovery call. We support organisations across the UK.",
  image: "/media/photo-1554224155-6726b3ff858f-9273a89e.jpg",
  title: "Contact | Tacklers Consulting Group | UK Lean Consultants",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: contactSeo.description,
  image: contactSeo.image,
  keywords: [
    "contact lean consultants uk",
    "operational excellence enquiry",
    "lean consulting discovery call",
    "uk lean transformation contact",
  ],
  path: "/contact",
  title: contactSeo.title,
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: contactSeo.description,
            path: "/contact",
            title: contactSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          buildFaqJsonLd(contactFaqs),
        ]}
      />
      <PageHero
        eyebrow="Get in touch"
        title="Contact Tacklers Consulting Group"
        body="A short, focused conversation is all it takes to determine if we can unlock meaningful value together."
        primary={{ label: "Book a discovery call", href: "/discovery-call" }}
        secondary={{ label: "Request an on-site assessment", href: "/on-site-assessment" }}
        image={contactSeo.image}
      />

      <section className="section-gap">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-6">
              <div className="card">
                <p className="eyebrow">Where we work</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">We go where the work happens</h2>
                <p className="mt-4 leading-8 text-slate-600">
                  We go where the work happens—no offices, no distractions. The best way to start is by phone, email, or a discovery call.
                </p>
                <Link className="mt-5 inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-[#8a0917]" href="/discovery-call">
                  Book a discovery call
                </Link>
              </div>
              <div className="card">
                <p className="eyebrow">Call us</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">Speak directly for appointments and enquiries</h2>
                <a className="mt-4 block text-lg font-medium text-slate-700" href="tel:+447932105847">
                  +44 7932 105847
                </a>
              </div>
              <div className="card">
                <p className="eyebrow">Email us</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">Send us a message anytime</h2>
                <a className="mt-4 block text-lg font-medium text-slate-700" href="mailto:hello@tacklersconsulting.com">
                  hello@tacklersconsulting.com
                </a>
                <p className="mt-4 text-slate-600">We aim to respond within 2 working days to all enquiries.</p>
              </div>
              <div className="card">
                <p className="eyebrow">Operating hours</p>
                <div className="mt-4 grid gap-3 text-slate-700">
                  <div className="flex items-center justify-between border-b border-black/5 pb-3"><span>Monday to Friday</span><span>9:00 AM - 5:00 PM</span></div>
                  <div className="flex items-center justify-between border-b border-black/5 pb-3"><span>Saturday</span><span>Closed</span></div>
                  <div className="flex items-center justify-between"><span>Sunday</span><span>Closed</span></div>
                </div>
              </div>
            </div>
            <LeadCaptureForm title="Send a message" variant="general_contact" />
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="card">
              <p className="eyebrow">Why Tacklers</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Lasting change, not short-term activity
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                We founded Tacklers to address a common gap in transformation efforts. Too often,
                organisations invest heavily and see short-term activity — reports, workshops, and
                initial momentum — but limited lasting change. Our approach is different. We work
                alongside your teams, at the Gemba, to improve flow, reduce waste, and embed ways of
                working that are practical, sustainable, and built around the expertise you already
                have.
              </p>
            </div>
            <div className="card">
              <p className="eyebrow">What clients value</p>
              <ul className="mt-5 space-y-4">
                {[
                  "We reduce waste while protecting and redeploying your talent.",
                  "We work alongside your teams at Gemba, where the real constraints show up.",
                  "We go where the work happens—no offices, no distractions.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8a0917]" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <SectionHeader eyebrow="Common questions" title="Frequently asked questions" center />
          <FaqList items={contactFaqs} />
        </Container>
      </section>

      <CtaBanner {...globalCta} />
    </>
  );
}

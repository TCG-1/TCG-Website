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
    "Contact Tacklers Consulting Group to discuss Lean transformation, operational excellence consulting, discovery calls, and on-site improvement work across the UK.",
  image: "/media/photo-1554224155-6726b3ff858f-9273a89e.jpg",
  title: "Contact Tacklers Consulting Group | UK Lean Consultants",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: contactSeo.description,
  image: contactSeo.image,
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
            { name: "Contact Us", path: "/contact" },
          ]),
          buildFaqJsonLd(contactFaqs),
        ]}
      />
      <PageHero
        eyebrow="Get in touch"
        title="Contact Tacklers Consulting Group"
        body="If you are exploring Lean transformation or operational excellence support, start here. You do not need a long pitch from us. A short conversation is usually enough to see if we are a good fit."
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
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">We work on-site with clients</h2>
                <p className="mt-4 leading-8 text-slate-600">
                  Tacklers Consulting Group works on-site at client locations across the UK. We do not operate a public walk-in office.
                </p>
                <p className="mt-4 text-slate-600">The best way to start is by phone, email, or a discovery call.</p>
                <Link className="mt-5 inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-[#8a0917]" href="/discovery-call">
                  Book a discovery call
                </Link>
              </div>
              <div className="card">
                <p className="eyebrow">Call us</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">Speak directly for appointment and inquiries</h2>
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
                <p className="mt-4 text-slate-600">We aim to respond within 2 working days to all inquiries.</p>
              </div>
              <div className="card">
                <p className="eyebrow">Operating hours</p>
                <div className="mt-4 grid gap-3 text-slate-700">
                  <div className="flex items-center justify-between border-b border-black/5 pb-3"><span>Monday - Friday</span><span>9:00 AM - 5:00 PM</span></div>
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
          <SectionHeader eyebrow="Common questions" title="Frequently asked questions" center />
          <FaqList items={contactFaqs} />
        </Container>
      </section>

      <CtaBanner {...globalCta} />
    </>
  );
}

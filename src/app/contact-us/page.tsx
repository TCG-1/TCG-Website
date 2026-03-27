import type { Metadata } from "next";
import Link from "next/link";

import {
  ContactForm,
  Container,
  CtaBanner,
  FaqList,
  PageHero,
  SectionHeader,
} from "@/components/sections";
import { contactFaqs, globalCta } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact Tacklers Consulting Group",
  description:
    "Get in touch with Tacklers Consulting Group for Lean transformation, operational excellence support, or a discovery call.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact Tacklers Consulting Group"
        body="If you are exploring Lean transformation or operational excellence support, start here. You do not need a long pitch from us. A short conversation is usually enough to see if we are a good fit."
        primary={{ label: "Book a discovery call", href: "/book-a-discovery-call" }}
        secondary={{ label: "Request an on-site assessment", href: "/request-an-on-site-assessment" }}
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
                <Link className="mt-5 inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-[#8a0917]" href="/book-a-discovery-call">
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
                <p className="mt-4 text-slate-600">We aim to respond within 24 hours.</p>
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
            <ContactForm />
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader eyebrow="Common questions" title="Frequently asked questions" />
          <FaqList items={contactFaqs} />
        </Container>
      </section>

      <CtaBanner
        eyebrow="Two ways to get started"
        title="Book a discovery call or send a message"
        body="Tell us what you are trying to fix and we will help you choose a practical starting point."
        primary={globalCta.primary}
        secondary={globalCta.secondary}
      />
    </>
  );
}

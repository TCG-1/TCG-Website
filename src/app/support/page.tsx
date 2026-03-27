import type { Metadata } from "next";
import Link from "next/link";

import { Container, FaqList, PageHero, SectionHeader } from "@/components/sections";
import { supportFaqs } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Support | Tacklers Consulting Group",
  description:
    "Support information for existing Tacklers clients and prospective partners with questions about Lean transformation and delivery support.",
};

export default function SupportPage() {
  return (
    <>
      <PageHero
        eyebrow="Help center"
        title="How can we support you?"
        body="Whether you are an existing client needing operational support or a prospective partner with questions, our team is here to help."
      />

      <section className="section-gap">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="card">
              <h2 className="text-2xl font-semibold text-slate-950">General inquiries</h2>
              <p className="mt-4 text-slate-600">Have a question about our Lean transformation services or want to learn more about our methodologies?</p>
              <a href="mailto:info@tacklersconsulting.com" className="mt-6 inline-flex text-[#8a0917]">
                info@tacklersconsulting.com
              </a>
            </div>
            <div className="card">
              <h2 className="text-2xl font-semibold text-slate-950">Client support</h2>
              <p className="mt-4 text-slate-600">Existing clients who need to reach their designated Lean coach or request an on-site visit adjustment.</p>
              <a href="mailto:support@tacklersconsulting.com" className="mt-6 inline-flex text-[#8a0917]">
                support@tacklersconsulting.com
              </a>
            </div>
            <div className="card">
              <h2 className="text-2xl font-semibold text-slate-950">On-site support</h2>
              <p className="mt-4 text-slate-600">We support clients at their locations across the UK and do not operate a public office for visits.</p>
              <Link href="/request-an-on-site-assessment" className="mt-6 inline-flex text-[#8a0917]">
                Arrange an on-site conversation
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />
          <FaqList items={supportFaqs} />
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <div className="card max-w-3xl">
            <p className="eyebrow">Still need help?</p>
            <h2 className="section-title">Reach out directly</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              If you could not find the answer you were looking for, contact us directly. We typically respond within 1–2 business days.
            </p>
            <a className="button-primary mt-8 inline-flex" href="mailto:hello@tacklersconsulting.com">
              Contact us
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { Container, FaqList, PageHero, SectionHeader } from "@/components/sections";
import { createPageMetadata } from "@/lib/site-seo";
import { supportFaqs } from "@/lib/site-data";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

const supportSeo = {
  description:
    "Get client support from Tacklers Consulting Group. Help with operational queries, on-site coordination, and next steps for Lean improvement work across the UK.",
  image: "/media/photo-1517976487492-5750f3195933-200958be.jpg",
  title: "Client Support | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: supportSeo.description,
  image: supportSeo.image,
  keywords: [
    "lean consulting client support",
    "operational improvement help",
    "on-site lean support uk",
  ],
  path: "/support",
  title: supportSeo.title,
});

export default function SupportPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: supportSeo.description,
            path: "/support",
            title: supportSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Support", path: "/support" },
          ]),
          buildFaqJsonLd(supportFaqs),
        ]}
      />
      <PageHero
        eyebrow="Help centre"
        title="How can we support you?"
        body="Whether you need client support, on-site coordination, or a practical next step for a new challenge, our team will help you get to the right conversation quickly."
        primary={{ label: "Book a discovery call", href: "/discovery-call" }}
        secondary={{ label: "Arrange on-site support", href: "/on-site-assessment" }}
        image={supportSeo.image}
      />

      <section className="section-gap">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="card">
              <h2 className="text-2xl font-semibold text-slate-950">General enquiries</h2>
              <p className="mt-4 text-slate-600">Have a question about our Lean transformation services or want to learn more about our methodologies?</p>
              <a href="mailto:hello@tacklersconsulting.com" className="mt-6 inline-flex text-[#8a0917]">
                hello@tacklersconsulting.com
              </a>
            </div>
            <div className="card">
              <h2 className="text-2xl font-semibold text-slate-950">Client support</h2>
              <p className="mt-4 text-slate-600">Existing clients who need to reach their designated Lean coach or request an on-site visit adjustment.</p>
              <a href="mailto:hello@tacklersconsulting.com" className="mt-6 inline-flex text-[#8a0917]">
                hello@tacklersconsulting.com
              </a>
            </div>
            <div className="card">
              <h2 className="text-2xl font-semibold text-slate-950">On-site support</h2>
              <p className="mt-4 text-slate-600">We go where the work happens—no offices, no distractions.</p>
              <Link href="/on-site-assessment" className="mt-6 inline-flex text-[#8a0917]">
                Arrange an on-site conversation
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader eyebrow="FAQ" title="Frequently asked questions" center />
          <div className="mx-auto max-w-4xl">
            <FaqList items={supportFaqs} />
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <div className="card mx-auto max-w-3xl text-center">
            <p className="eyebrow">Still need help?</p>
            <h2 className="section-title">Reach out directly</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              If you could not find the answer you were looking for, contact us directly. We aim to respond within 2 working days to all enquiries.
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

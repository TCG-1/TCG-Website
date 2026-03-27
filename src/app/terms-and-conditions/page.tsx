import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { Container, LegalSection, PageHero } from "@/components/sections";
import { createPageMetadata } from "@/lib/site-seo";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

const termsSeo = {
  description:
    "Review the Tacklers Consulting Group terms and conditions covering website use, intellectual property, service agreements, and liability.",
  image: "/media/photo-1552664730-d307ca884978-3b59fe94.jpg",
  title: "Terms and Conditions | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: termsSeo.description,
  image: termsSeo.image,
  path: "/terms-and-conditions",
  title: termsSeo.title,
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: termsSeo.description,
            path: "/terms-and-conditions",
            title: termsSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Terms & Conditions", path: "/terms-and-conditions" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Legal & compliance"
        title="Terms & Conditions"
        body="Please read these terms carefully before using our services. Last updated: October 2025."
        image={termsSeo.image}
      />
      <section className="section-gap">
        <Container>
          <div className="grid gap-6">
            <LegalSection
              number="1"
              title="Intellectual Property Rights"
              body="Unless otherwise stated, Tacklers Consulting Group and its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved."
              points={[
                "Do not republish material from our website without proper attribution.",
                "Do not sell, rent, or sub-license material from the website.",
                "Do not reproduce or copy material for commercial purposes without permission.",
              ]}
            />
            <LegalSection
              number="2"
              title="Consulting Services & Agreements"
              body="Information on this website is for general informational purposes only. Engaging Tacklers Consulting Group is subject to a separate Statement of Work or written contract. Nothing on the website constitutes a binding consulting agreement or guarantees specific results."
            />
            <LegalSection
              number="3"
              title="User Conduct"
              body="You agree not to use the site in a way that damages the website, impairs accessibility, or is unlawful, illegal, fraudulent, or harmful."
            />
            <LegalSection
              number="4"
              title="Limitation of Liability"
              body="Tacklers Consulting Group and its team will not be liable for anything arising out of or connected with your use of this website, whether under contract, tort, or otherwise, to the maximum extent permitted by law."
            />
            <LegalSection
              number="5"
              title="Governing Law & Jurisdiction"
              body="These terms are governed by the laws of the United Kingdom, and disputes are subject to the non-exclusive jurisdiction of the appropriate courts in the UK."
            />
            <LegalSection
              number="6"
              title="Changes to These Terms"
              body="Tacklers Consulting Group may revise these terms at any time. By using the website, you are expected to review them regularly so you understand the terms governing your use."
            />
            <LegalSection
              title="Questions about these terms?"
              body="If you require clarification on any of our terms of service, contact our legal team at hello@tacklersconsulting.com."
            />
          </div>
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";

import { Container, LegalSection, PageHero } from "@/components/sections";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for Tacklers Consulting Group.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal & compliance"
        title="Terms & Conditions"
        body="Please read these terms carefully before using our services. Last updated: October 2025."
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

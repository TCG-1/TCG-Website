import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { Container, LegalSection, PageHero } from "@/components/sections";
import { createPageMetadata } from "@/lib/site-seo";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

const cookieSeo = {
  description:
    "Read how Tacklers Consulting Group uses cookies and similar technologies, including essential session cookies and any future consent-based optional cookies.",
  image: "/media/photo-1552664730-d307ca884978-c9ac175b.jpg",
  title: "Cookie Policy | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: cookieSeo.description,
  image: cookieSeo.image,
  path: "/cookie-policy",
  title: cookieSeo.title,
});

export default function CookiePolicyPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            description: cookieSeo.description,
            path: "/cookie-policy",
            title: cookieSeo.title,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Cookie Policy", path: "/cookie-policy" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Legal & compliance"
        title="Cookie Policy"
        body="How we use cookies and similar technologies across the Tacklers website and portal. Effective date: 29 March 2026."
        image={cookieSeo.image}
      />
      <section className="section-gap">
        <Container>
          <div className="grid gap-6">
            <LegalSection
              number="1"
              title="What cookies are"
              body="Cookies are small text files placed on your device when you visit a website. Similar technologies may include local storage, pixels, tags, and software development kits. They help websites remember information, maintain secure sessions, and improve how services are delivered."
            />
            <LegalSection
              number="2"
              title="How we use cookies"
              body="We use cookies and similar technologies to keep our website and client portal secure, maintain authenticated sessions, remember technical preferences, and support core functionality such as sign-in and access control. Where we ever introduce optional analytics, advertising, or personalisation cookies, we will request consent before placing them, except where applicable law permits otherwise."
            />
            <LegalSection
              number="3"
              title="Cookies we currently use"
              body="At present, our primary cookie use is limited to strictly necessary and security-related technologies that support website delivery and portal authentication. These cookies help us keep pages functioning correctly, manage secure logins, and protect accounts from misuse."
              points={[
                "Strictly necessary cookies for website delivery and security.",
                "Authentication and session cookies used by our portal and Supabase sign-in flow.",
                "Preference storage indicating whether you accepted or limited cookie choices on this site.",
              ]}
            />
            <LegalSection
              number="4"
              title="Legal basis for cookie use"
              body="Where cookies are strictly necessary for providing the website or a service you explicitly request, we rely on our legitimate interest in operating a secure digital service and, where relevant, performance of a contract. Where cookies are not strictly necessary, we rely on your consent under applicable EU and UK rules before using them."
            />
            <LegalSection
              number="5"
              title="Managing cookies"
              body="You can control cookies through your browser settings, device controls, and any cookie choices presented on our site. Blocking strictly necessary cookies may affect sign-in, portal access, security protections, or other essential website features."
            />
            <LegalSection
              number="6"
              title="Third-party technologies"
              body="Some site and portal functionality depends on third-party infrastructure providers such as hosting, authentication, and content delivery services. Those providers may set or read necessary cookies as part of delivering secure sessions and website functionality. We require those providers to process data under appropriate contractual and legal safeguards."
            />
            <LegalSection
              number="7"
              title="Changes to this policy"
              body="We may update this Cookie Policy from time to time to reflect legal, technical, or operational changes. Where changes materially affect how optional cookies are used, we will update the notice shown on the site and request fresh consent where required."
            />
            <LegalSection
              title="Questions about cookies?"
              body="For questions about our use of cookies or similar technologies, contact hello@tacklersconsulting.com."
            />
          </div>
        </Container>
      </section>
    </>
  );
}

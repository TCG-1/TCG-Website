import Link from "next/link";
import Image from "next/image";

import {
  CardGrid,
  Container,
  CtaBanner,
  FaqList,
  SectionHeader,
  StepsGrid,
} from "@/components/sections";
import { blogPosts, homeData } from "@/lib/site-data";

export default function Home() {
  const faqItems = [
    {
      question: "What does “Gemba” mean?",
      answer:
        "It means where the work happens. We spend time there to see what slows flow down, then improve it with your team on-site.",
    },
    {
      question: "Do you deliver Lean transformation without layoffs?",
      answer:
        "Yes. Our approach is people-first. We focus on removing waste, building capability, and redeploying talent as capacity opens up.",
    },
    {
      question: "What Lean tools do you use?",
      answer:
        "We use practical tools such as value stream mapping, 5S, standard work, visual management, and structured problem solving based on your context.",
    },
    {
      question: "How fast will we see results?",
      answer:
        "You usually see early improvements during the first on-site work, especially around delays, rework, and unclear handoffs. Sustain routines protect long-term gains.",
    },
    {
      question: "What is the best first step?",
      answer:
        "Book a discovery call or request an on-site assessment so we can see how work flows and agree the first practical improvements.",
    },
  ];

  const serviceItems = [
    {
      title: "Cost Management",
      body: "Cost reduction works when it is tied to how work actually runs. When it is not, it turns into pressure and short-term fixes.",
      href: "/operational-excellence-services-uk",
      cta: "View Programme",
      image: "/media/Cost-Management-f9a07bf6.jpeg",
    },
    {
      title: "Executive Leadership Coaching",
      body: "This is where many improvements win or lose. Good projects can stall when leaders do not have a clear operating rhythm.",
      href: "/operational-excellence-services-uk",
      cta: "View Programme",
      image: "/media/Executive-Leadership-Coaching-1588bf3d.jpeg",
    },
    {
      title: "Lean Training",
      body: "Training has to connect to real work or it fades fast. We keep it practical.",
      href: "/lean-services",
      cta: "View Programme",
      image: "/media/Lean-Training-060b97e6.jpeg",
    },
    {
      title: "Lean Transformation",
      body: "Lean transformation is not a workshop series. It is a change in how work is managed, improved, and sustained.",
      href: "/operational-excellence-services-uk",
      cta: "View Programme",
      image: "/media/Lean-Transformation-ee5c9aae.jpeg",
    },
    {
      title: "People Strategy",
      body: "If the people side is ignored, the process side will not last. That is not a philosophy, it is just reality.",
      href: "/operational-excellence-services-uk",
      cta: "View Program",
      image: "/media/photo-1521737604893-d14cc237f11d-b93a2a8e.jpg",
    },
    {
      title: "Manufacturing Support",
      body: "Manufacturing environments feel small until you trace one delay and realise how many parts it touches.",
      href: "/operational-excellence-services-uk",
      cta: "View Program",
      image: "/media/Manufacturing-Support-f5a8f8f1.jpeg",
    },
  ];

  return (
    <div className="text-center">
      <section className="relative isolate -mt-[100px] overflow-hidden py-20 sm:-mt-[110px] sm:py-24 lg:-mt-[120px] lg:py-28">
        <Image
          src="/media/aida-public-AB6AXuCyOjIab072l46SaGHablYPEZAu48OXAu95HSTBh0PG-adf322ea.jpg"
          alt="Operational excellence team session"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="hero-soft-gradient absolute inset-0" />
        <Container>
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center pt-14 text-center sm:pt-16 lg:pt-20">
            <p className="eyebrow">Operational Excellence Consulting</p>
            <h1 className="display-title mt-3 max-w-4xl">
              Operational Excellence
              <br />
              <span className="hero-title-emphasis">Services in the UK</span>
            </h1>
            <p className="body-copy mt-6 max-w-3xl">
              Tacklers Consulting Group is a UK-based Lean transformation and operational excellence
              partner. We work on-site at Gemba with your teams to remove waste, clear bottlenecks and
              improve flow. And yes, we do it without using redundancies as the “plan.”
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/book-a-discovery-call" className="button-primary">
                Book a discovery call
              </Link>
              <Link href="/request-an-on-site-assessment" className="button-secondary">
                Request an on-site assessment
              </Link>
            </div>
            <div className="mt-10 grid w-full max-w-4xl gap-3 sm:grid-cols-3">
              <p className="rounded-2xl border border-[#8a0917]/20 bg-white/80 px-4 py-4 text-sm font-semibold leading-6 text-slate-800 backdrop-blur-sm">
                10+ years applying Lean methodologies
              </p>
              <p className="rounded-2xl border border-[#8a0917]/20 bg-white/80 px-4 py-4 text-sm font-semibold leading-6 text-slate-800 backdrop-blur-sm">
                Implementing Lean principles that have delivered multi-million-pound savings to organisations
              </p>
              <p className="rounded-2xl border border-[#8a0917]/20 bg-white/80 px-4 py-4 text-sm font-semibold leading-6 text-slate-800 backdrop-blur-sm">
                Delivering Lean training to over 500 employees globally, from front-line staff to C-suite
                level
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#8a0917] py-8 text-white">
        <Container>
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/75">Fun facts</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "5,000+", label: "Happy Customers" },
                { value: "4.8/5", label: "Average Rating" },
                { value: "98%", label: "Client Satisfaction" },
                { value: "10+", label: "Years Experience" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/20 bg-white/10 px-5 py-6 backdrop-blur-sm"
                >
                  <div className="text-4xl font-extrabold leading-none">{item.value}</div>
                  <div className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/80">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left — image */}
            <div className="overflow-hidden rounded-[2rem] shadow-xl">
              <Image
                src="/media/Productivity-Improvement-1d0b843c.jpeg"
                alt="Productivity improvement in action"
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Right — text + compact checklist */}
            <div>
              <p className="eyebrow">What you get, quickly</p>
              <h2 className="section-title mt-2">
                This is what clients usually want. It&apos;s also what they struggle to get from report-heavy consulting.
              </h2>
              <ul className="mt-6 space-y-3">
                {[
                  "Less waiting, fewer hand-over issues, fewer repeat problems",
                  "Shorter cycle times and steadier delivery",
                  "Higher first-time quality through clear standard work",
                  "More capacity from the people and systems you already have",
                  "Leaders and teams who can sustain improvement after we leave",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8a0917] text-xs font-bold text-white">
                      ✓
                    </span>
                    <span className="text-slate-700 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-950 text-white">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-[2rem] border border-white/10">
              <Image
                src="/media/aida-public-AB6AXuDHky4TW1pFeH2_awPPMuIqsfxjuG-7yGMeQeE2qY4s-173f18c3.jpg"
                alt="People-first lean collaboration"
                width={900}
                height={700}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="eyebrow text-white/60">People-first Lean</p>
              <h2 className="section-title text-white">People-first Lean, the way it should be</h2>
              <p className="mt-5 text-lg leading-8 text-white/80">
                Lean has a reputation problem. I think we all know why. Too many organisations use it to
                justify headcount cuts, then wonder why trust disappears.
              </p>
              <p className="mt-4 text-lg leading-8 text-white/80">
                Our approach is different. We focus on waste, not people. That means upskilling,
                redeploying, and building stronger daily ways of working. It’s more work up front, but it
                tends to hold.
              </p>
              <Link href="/about-tacklers-consulting-group" className="mt-6 inline-flex button-ghost">
                Know more
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Lean transformation services"
            title="You can start small with one value stream, or run a wider programme."
            body="Either is fine. We’ll tell you what makes sense once we see how work really flows."
            center
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceItems.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.06)]"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={800}
                  height={480}
                  className="h-56 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{item.body}</p>
                  <Link
                    href={item.href}
                    className="mt-5 inline-flex text-sm font-semibold uppercase tracking-[0.16em] text-[#8a0917]"
                  >
                    {item.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/operational-excellence-services-uk" className="button-secondary">
              View All Services
            </Link>
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="How we work, the Tacklers method"
            title="We use a four-stage method that keeps things clear."
            center
          />
          <StepsGrid
            items={[
              {
                title: "Assess",
                body: "We identify gaps, constraints, and value stream opportunities using observation, data, and team input.",
              },
              {
                title: "Collaborate",
                body: "We work on-site with the people doing the work. Improvements are tested in the real environment.",
              },
              {
                title: "Upskill",
                body: "We train teams to own the new processes. Leaders learn how to coach and sustain, not just approve.",
              },
              {
                title: "Sustain",
                body: "We build daily and weekly management routines so performance does not drift back.",
              },
            ]}
          />
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader
            eyebrow="Industries"
            title="Who we work with"
            body="We support regulated and high-stakes environments where capability and delivery discipline matter."
            center
          />
          <CardGrid items={homeData.industries} columns={3} centerText />
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white">
              <Image
                src="/media/Audrey-Nyamande-1-cd36ad87.jpeg"
                alt="Audrey Nyamande-Trigg"
                width={640}
                height={760}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="eyebrow">Founder-led, technically grounded</p>
              <h2 className="section-title">Audrey Nyamande-Trigg</h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">Founder of TCG</p>
              <p className="mt-5 text-lg leading-8 text-slate-700">
                Tacklers is led by Audrey Nyamande-Trigg, an aerospace engineer and Lean transformation
                coach. She has led transformation work in high-stakes engineering environments and brings
                that same practical discipline into every engagement. Not to overcomplicate things. Just
                to make sure the work holds.
              </p>
              <h3 className="mt-8 text-xl font-semibold text-slate-950">Credentials & Authority</h3>
              <ul className="mt-4 space-y-3 text-slate-700">
                <li>Lean Six Sigma Green Belt Certification</li>
                <li>Private Pilot&apos;s License - PPL (A)</li>
                <li>Bachelor&apos;s Degree, Aerospace Technology</li>
              </ul>
              <Link href="/about-tacklers-consulting-group" className="button-secondary mt-7">
                Read More
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-gap">
        <Container>
          <SectionHeader
            eyebrow="Frequently Asked Questions"
            title="Common questions"
            center
          />
          <div className="mx-auto max-w-4xl">
            <FaqList items={faqItems} />
          </div>
        </Container>
      </section>

      <section className="section-gap bg-slate-50">
        <Container>
          <SectionHeader eyebrow="Our Blogs" title="From the blog" center />
          <p className="mx-auto mb-12 max-w-4xl text-center text-lg leading-8 text-slate-600">
            If you want operational excellence support that shows up in day-to-day work, let’s talk. Start
            with a discovery call, or request an on-site assessment and we’ll map the first improvements
            together.
          </p>
          <div className="grid gap-6 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <article
                key={post.slug}
                className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.06)]"
              >
                <Image
                  src={post.cover}
                  alt={post.title}
                  width={800}
                  height={480}
                  className="h-52 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">{post.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 inline-flex text-sm font-semibold uppercase tracking-[0.16em] text-[#8a0917]"
                  >
                    Read Article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        eyebrow="Ready to cut waste and keep your people?"
        title="Ready to cut waste and keep your people?"
        body="Book a discovery call, or request an on-site assessment. We’ll identify what’s slowing delivery down and agree the first set of fixes. No theatre. Just real work."
        primary={{ label: "Book a discovery call", href: "/book-a-discovery-call" }}
        secondary={{
          label: "Request an on-site assessment",
          href: "/request-an-on-site-assessment",
        }}
      />
    </div>
  );
}

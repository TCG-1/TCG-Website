export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  href: string;
  label: string;
  platform: "linkedin";
};

export type CardItem = {
  title: string;
  body: string;
  image?: string;
  cta?: string;
  href?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type BlogPost = {
  category: string;
  canonicalPath?: string;
  cover: string;
  content: string[];
  date: string;
  excerpt: string;
  keywords?: string;
  noIndex?: boolean;
  ogImageUrl?: string;
  publishedAt?: string;
  seoDescription?: string;
  seoTitle?: string;
  slug: string;
  title: string;
  updatedAt?: string;
};

export const brandTagline =
  "Lean transformation that reduces waste and optimizes your team's capabilities";

const bestPlaceToStartAnswer =
  "Start with a discovery call. If more direction is needed, an on-site assessment will identify where to focus and what will deliver the greatest impact.";

const supportLevelsAnswer =
  "We offer standalone training, hands-on implementation support, on-site assessments, embedded consultants, and ongoing retainer services. The right mix depends on how much delivery support and internal capability building you need.";

const supportedIndustriesAnswer =
  "We support Aerospace, Aviation, Energy, Healthcare, Life Sciences, IT Services, the Public Sector, and Space & Defence, along with other operationally complex environments.";

const peopleFirstAnswer =
  "Our approach is people-first. We work on-site with your teams to build capability, improve flow, and redeploy talent into higher-value work as capacity opens up. We strive to deliver Lean improvements without reducing headcount so organisations retain expertise.";

const leanToolsAnswer =
  "Common tools include Value Stream Mapping, 5S, Standard Work, Visual Management, and Structured Problem Solving. We choose tools to fit your environment and operating reality rather than forcing a one-size-fits-all approach.";

const resultsAnswer =
  "Quick \"Just Do It\" actions can deliver immediate impact. Structured Kaizen activity often creates results in days or weeks, while more complex improvements follow a defined implementation plan. The gains become sustainable when daily management practices are embedded.";

const genbaMeaningAnswer =
  "Both spellings refer to the real place where the work happens. We spend time there with your team to see what is slowing flow down and what will improve performance in practice.";

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/operational-excellence-consulting-uk" },
  { label: "Mentoring", href: "/lean-training-uk" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
];

export const footerData = {
  description:
    "Empowering organizations to achieve sustainable operational excellence.",
  usefulLinks: [
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/operational-excellence-consulting-uk" },
    { label: "Blog & Resources", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
    { label: "Career", href: "/careers" },
  ],
  additionalLinks: navItems,
  legalLinks: [
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Support", href: "/support" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
  ],
  socialLinks: [
    {
      href: "https://www.linkedin.com/company/tacklers-consulting-group/",
      label: "LinkedIn",
      platform: "linkedin",
    },
  ] satisfies SocialLink[],
  coverageNote:
    "We work on-site at client locations across the UK. No public walk-in office.",
  email: "hello@tacklersconsulting.com",
  phone: "+44 7932 105847",
};

export const globalCta = {
  eyebrow: "Start the right conversation",
  title:
    "Ready to reduce waste, improve productivity, and optimize your team's capabilities?",
  body:
    "Book a discovery call or request an on-site assessment. We'll work with you to identify opportunities for improvement, define an implementation plan that suits your organisation's needs, and establish key milestones for success.",
  primary: { label: "Book a discovery call", href: "/discovery-call" },
  secondary: {
    label: "Request an on-site assessment",
    href: "/on-site-assessment",
  },
};

export const homeData = {
  hero: {
    eyebrow: brandTagline,
    title: "Operational Excellence Consulting",
    subtitle: "Lean transformation that reduces waste and retains expertise.",
    body:
      "Tacklers Consulting Group is a UK-based Lean transformation and operational excellence partner. We work on-site at Gemba with your teams to reduce waste, clear bottlenecks, and improve flow.",
    primary: { label: "Book a discovery call", href: "/discovery-call" },
    secondary: {
      label: "Request an on-site assessment",
      href: "/on-site-assessment",
    },
    image:
      "/media/aida-public-AB6AXuCyOjIab072l46SaGHablYPEZAu48OXAu95HSTBh0PG-adf322ea.jpg",
    badge: "Gemba Focused",
  },
  stats: [
    { value: "10+", label: "Years Lean Experience" },
    {
      value: "500+",
      label: "Individuals, from front-line teams to C-Suite level, trained in Lean Principles",
    },
    { value: "£M+", label: "Savings Delivered" },
    { value: "4.8/5", label: "Average Rating" },
    { value: "98%", label: "Client Satisfaction" },
  ],
  valueProp: {
    title: "What you get, quickly",
    body:
      "This is what clients usually want. It is also what they struggle to get from report-heavy consulting.",
    points: [
      "Less waiting, fewer hand-over issues, fewer repeat problems",
      "Shorter cycle times and steadier delivery",
      "Higher first-time quality through clear standard work",
      "More capacity from the people and systems you already have",
      "Leaders and teams who can sustain improvement after we leave",
    ],
  },
  peopleFirst: {
    title: "People-first Lean, the way it should be",
    body:
      "Lean has a reputation problem. Too many organisations use it to justify headcount cuts. Our approach focuses on waste, not people: upskilling, redeploying, and creating stronger daily ways of working.",
    image:
      "/media/aida-public-AB6AXuDHky4TW1pFeH2_awPPMuIqsfxjuG-7yGMeQeE2qY4s-173f18c3.jpg",
  },
  services: [
    {
      title: "Cost Management",
      body: "Cost reduction works when it is tied to how work actually runs.",
      image:
        "/media/photo-1554224155-6726b3ff858f-9273a89e.jpg",
      href: "/operational-excellence-consulting-uk",
    },
    {
      title: "Executive Leadership Coaching",
      body: "Good projects stall because leaders did not have a clear operating rhythm.",
      image:
        "/media/photo-1552664730-d307ca884978-3b59fe94.jpg",
      href: "/operational-excellence-consulting-uk",
    },
    {
      title: "Lean Training",
      body: "Training has to connect to real work or it fades fast.",
      image:
        "/media/photo-1454165804606-c3d57bc86b40-354f8fd9.jpg",
      href: "/lean-training-uk",
    },
    {
      title: "Lean Transformation",
      body: "A change in how work is managed, improved, and sustained.",
      image:
        "/media/photo-1461749280684-dccba630e2f6-28fdc020.jpg",
      href: "/operational-excellence-consulting-uk",
    },
    {
      title: "People Strategy",
      body: "If the people side is ignored, the process side will not last.",
      image:
        "/media/photo-1521737604893-d14cc237f11d-b93a2a8e.jpg",
      href: "/operational-excellence-consulting-uk",
    },
    {
      title: "Manufacturing Support",
      body: "Tracing delays to see how many parts they touch.",
      image:
        "/media/Manufacturing-Support-f5a8f8f1.jpeg",
      href: "/operational-excellence-consulting-uk",
    },
  ],
  industries: [
    {
      title: "Aerospace & Defence",
      body: "Programmes with tight controls, quality pressure, and complex handovers.",
      image:
        "/media/photo-1517976547714-720226b864c1-3397c986.jpg",
    },
    {
      title: "Healthcare & Life Sciences",
      body: "Improvement work in regulated, high-stakes service and production settings.",
      image:
        "/media/photo-1576091160550-2173dba999ef-58286eed.jpg",
    },
    {
      title: "Energy Sector",
      body: "Operations where reliability, planning, and escalation discipline matter.",
      image:
        "/media/photo-1473341304170-971dccb5ac1e-b3bd42a9.jpg",
    },
    {
      title: "Public Sector",
      body: "Process improvement for delivery teams balancing demand, risk, and accountability.",
      image:
        "/media/photo-1486406146926-c627a92ad1ab-89b08768.jpg",
    },
    {
      title: "IT Services",
      body: "Lean thinking for digital work, service management, and cross-team flow.",
      image:
        "/media/photo-1518773553398-650c184e0bb3-7d18c6b0.jpg",
    },
    {
      title: "Manufacturing",
      body: "Support for factories, production teams, and supply chains under pressure.",
      image:
        "/media/photo-1565688534245-05d6b5be184a-f02d6c76.jpg",
    },
  ],
};

export const serviceCards: CardItem[] = [
  {
    title: "Business Process Management",
    body: "If your processes differ by team, shift, or site, performance will vary. We bring structure and clarity to how work moves.",
    image: "/media/Lean-transformation-consulting-UK-consultant-working-with-team-at-Gemba-1-6dc05d89.jpeg",
  },
  {
    title: "Cost Management",
    body: "Cost reduction works when it is tied to how work actually runs. Otherwise it becomes pressure and short-term fixes.",
    image: "/media/Cost-Management-f9a07bf6.jpeg",
  },
  {
    title: "Executive Leadership Coaching",
    body: "Good projects stall when leaders do not have a clear operating rhythm. We coach leaders to make improvement stick.",
    image: "/media/Executive-Leadership-Coaching-1588bf3d.jpeg",
  },
  {
    title: "Lean Training",
    body: "Training has to connect to real work or it fades fast. We keep it practical and immediately usable.",
    image: "/media/Lean-Training-060b97e6.jpeg",
  },
  {
    title: "Lean Transformation",
    body: "Lean transformation is not a workshop series. It is a change in how work is managed, improved, and sustained.",
    image: "/media/Lean-Transformation-ee5c9aae.jpeg",
  },
  {
    title: "People Strategy",
    body: "If the people side is ignored, the process side will not last. We help align capability, structure, and leadership habits.",
    image: "/media/photo-1521737604893-d14cc237f11d-b93a2a8e.jpg",
  },
  {
    title: "Manufacturing Support",
    body: "Manufacturing environments feel small until you trace one delay and realise how many parts it touches.",
    image: "/media/Manufacturing-Support-f5a8f8f1.jpeg",
  },
  {
    title: "Productivity Improvement",
    body: "Productivity is not about pushing harder. It is about removing the things that slow work down.",
    image: "/media/Productivity-Improvement-1d0b843c.jpeg",
  },
  {
    title: "Project Management",
    body: "Transformation work fails when coordination is weak. We create visible, disciplined execution.",
    image: "/media/photo-1454165804606-c3d57bc86b40-354f8fd9.jpg",
  },
  {
    title: "Supplier Quality Development",
    body: "If supplier issues drive your delays and rework, internal improvement alone will not fix it.",
    image: "/media/Supplier-Quality-Development-a29c0c6d.jpeg",
  },
  {
    title: "Strategy Deployment",
    body: "Strategy fails when it stays in a slide deck. We help translate it into daily priorities and weekly follow-through.",
    image: "/media/Strategy-Deployment-cb6e4118.jpeg",
  },
];

export const testimonials = [
  {
    quote:
      "Tacklers helped us simplify hand-overs and stabilise daily routines. The team stopped firefighting and delivery became more predictable.",
    author: "John",
    role: "Operations lead, regulated environment",
  },
  {
    quote:
      "The difference was the on-site work. It felt practical, and the changes stayed because leaders were coached to keep the rhythm going.",
    author: "Sara",
    role: "Senior manager, service organisation",
  },
  {
    quote:
      "They helped us remove delays we had normalised. It was not magic. It was disciplined work, and it paid off.",
    author: "Meera",
    role: "Engineering manager, MRO environment",
  },
];

export const serviceFaqs: FaqItem[] = [
  {
    question: "What's the best place to start?",
    answer: bestPlaceToStartAnswer,
  },
  {
    question: "What levels of support do you offer?",
    answer: supportLevelsAnswer,
  },
  {
    question: "What industries do you support?",
    answer: supportedIndustriesAnswer,
  },
  {
    question: "What makes our approach different to others?",
    answer: peopleFirstAnswer,
  },
  {
    question: "How fast will we see results?",
    answer: resultsAnswer,
  },
];

export const leanProgrammes = [
  {
    title: "Lean Fundamentals",
    body: "Master the core principles of value, waste identification, and continuous improvement culture.",
    cta: "Explore details",
    href: "/book-lean-training",
  },
  {
    title: "Value Stream Mapping",
    body: "Learn to visualise your process flow and identify the bottlenecks that delay value.",
    cta: "Master VSM",
    href: "/book-lean-training",
  },
  {
    title: "Kaizen Facilitation",
    body: "Develop the skills to lead improvement events that create rapid and sustainable results.",
    cta: "View details",
    href: "/book-lean-training",
  },
];

export const methodSteps = [
  {
    title: "Assess",
    body: "Identify gaps, constraints, and value stream opportunities using observation, data, and team input.",
  },
  {
    title: "Collaborate",
    body: "Work on-site with the people doing the work. Test improvements in the real environment.",
  },
  {
    title: "Upskill",
    body: "Train teams to own the new processes. Help leaders learn how to coach and sustain, not just approve.",
  },
  {
    title: "Sustain",
    body: "Build daily and weekly management routines so performance does not drift back.",
  },
];

export const aboutBeliefs = [
  {
    title: "People-first Lean",
    body: "Lean works best when people trust the process. If improvement feels like a threat, teams stop sharing issues and stop trying.",
  },
  {
    title: "Our approach reduces waste without reducing headcount",
    body:
      "We focus on capacity, capability, and performance, then help you redeploy talent into higher-value work so your organisation retains expertise as the system improves.",
  },
  {
    title: "Hands-on beats high-level",
    body: "We do not sit on the sidelines. Real constraints show up on the floor and in service delivery, not in a slide deck.",
  },
  {
    title: "Sustain is the real work",
    body: "Plenty of organisations can change for a month. The hard part is keeping it. We build routines and simple management systems that hold the gains.",
  },
];

export const aboutServices = [
  "Lean transformation and Lean implementation",
  "Business process improvement and business process management",
  "Lean training and internal capability building",
  "Executive leadership coaching",
  "Productivity improvement",
  "Cost management",
  "Project management for transformation delivery",
  "Supplier quality development",
  "Strategy deployment turning goals into weekly execution",
];

export const teamMembers = [
  {
    name: "Audrey Nyamande",
    role: "Founder & Managing Director",
    body: "Leads client transformation work with a practical, people-first approach grounded in Gemba observation and leadership coaching.",
  },
  {
    name: "Arlandous Makoni",
    role: "Policy and Public Affairs Consultant",
    body: "Supports stakeholder alignment, structured communication, and broader change adoption across complex environments.",
  },
];

export const experienceDo = [
  "Clear on priorities and what good looks like",
  "Less noise and more follow-through",
  "More control of daily delivery",
  "A steady rhythm leaders can run without outside pressure",
];

export const experienceDont = [
  "Buried in slides",
  "Overloaded with initiatives",
  "Left with a handover and no support",
];

export const aboutFaqs: FaqItem[] = [
  {
    question: "What makes our approach different to others?",
    answer: peopleFirstAnswer,
  },
  {
    question: "What industries do you support?",
    answer: supportedIndustriesAnswer,
  },
  {
    question: "What levels of support do you offer?",
    answer: supportLevelsAnswer,
  },
  {
    question: "Where are you based?",
    answer:
      "We are UK-based and work on-site at client locations across the UK. We do not operate a public visitor office.",
  },
  {
    question: "What's the best place to start?",
    answer: bestPlaceToStartAnswer,
  },
];

export const contactFaqs: FaqItem[] = [
  {
    question: "How quickly will you respond?",
    answer:
      "We aim to respond within 2 working days to all inquiries.",
  },
  {
    question: "What's the best place to start?",
    answer: bestPlaceToStartAnswer,
  },
  {
    question: "What industries do you support?",
    answer: supportedIndustriesAnswer,
  },
  {
    question: "What levels of support do you offer?",
    answer: supportLevelsAnswer,
  },
  {
    question: "What makes our approach different to others?",
    answer: peopleFirstAnswer,
  },
];

export const supportFaqs: FaqItem[] = [
  {
    question: "What does Genba or Gemba mean?",
    answer: genbaMeaningAnswer,
  },
  {
    question: "What makes our approach different to others?",
    answer: peopleFirstAnswer,
  },
  {
    question: "Which Lean tools do you actually use?",
    answer: leanToolsAnswer,
  },
  {
    question: "How fast will we see results?",
    answer: resultsAnswer,
  },
  {
    question: "What levels of support do you offer?",
    answer: supportLevelsAnswer,
  },
];

export const homeFaqs: FaqItem[] = [
  {
    question: "What does Genba or Gemba mean?",
    answer: genbaMeaningAnswer,
  },
  {
    question: "What makes our approach different to others?",
    answer: peopleFirstAnswer,
  },
  {
    question: "Which Lean tools do you actually use?",
    answer: leanToolsAnswer,
  },
  {
    question: "How fast will we see results?",
    answer: resultsAnswer,
  },
  {
    question: "What's the best place to start?",
    answer: bestPlaceToStartAnswer,
  },
  {
    question: "What levels of support do you offer?",
    answer: supportLevelsAnswer,
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "lean-transformation-aerospace-mait",
    title: "Lean transformation in aerospace MAIT, where delays really come from",
    excerpt:
      "If you work in aerospace MAIT, you already know the pattern. The plan looks solid, the schedule looks reasonable, and then hidden handovers start to push everything sideways.",
    category: "Aerospace Lean",
    date: "10 Oct 2025",
    cover:
      "/media/photo-1517976487492-5750f3195933-200958be.jpg",
    content: [
      "Aerospace MAIT environments rarely fail because of one dramatic issue. Delays usually build through ordinary, repeated friction: unclear sequencing, late information, conflicting priorities, and unresolved ownership between functions.",
      "The first step in Lean transformation is not another dashboard. It is seeing the real path of work and identifying where value gets stuck. Once the flow is visible, you can stabilise daily routines, reduce firefighting, and create more predictable delivery.",
      "Teams usually know where the pain lives. What they often lack is the space, structure, and leadership rhythm to deal with it. That is where disciplined Gemba work matters most.",
    ],
  },
  {
    slug: "lean-transformation-without-layoffs",
    title: "Lean transformation without layoffs, how people-first Lean actually works",
    excerpt:
      "Lean has a reputation problem. Some teams hear the phrase and immediately think job cuts. That is not the only path, and it is not ours.",
    category: "People-first Lean",
    date: "10 Oct 2025",
    cover:
      "/media/photo-1522202176988-66273c2fd55f-259dd5c3.jpg",
    content: [
      "People-first Lean starts with a different question: how do we remove waste while increasing capability? Instead of using improvement as a threat, we use it to create better flow, clearer work, and stronger roles for the team.",
      "When trust is low, people protect themselves. They stop surfacing issues and improvements stall. When leaders make it clear that the goal is to reduce waste while retaining expertise, teams engage more honestly and progress speeds up.",
      "The strongest Lean environments grow internal capability, redeploy time into better work, and give leaders a rhythm for sustaining gains. That is how improvement holds.",
    ],
  },
  {
    slug: "business-coaching-strategies-that-drive-real-success",
    title: "Business Coaching Strategies That Drive Real Success",
    excerpt:
      "Coaching works best when it strengthens how leaders run the business week to week, not when it sits outside the operating system.",
    category: "Leadership Coaching",
    date: "10 Oct 2025",
    cover:
      "/media/photo-1552664730-d307ca884978-c9ac175b.jpg",
    content: [
      "Effective coaching is practical. It helps leaders set clearer priorities, make faster decisions, and stay visible in the work rather than floating above it.",
      "The best coaching strategies create repeatable habits: short review rhythms, better escalation pathways, clearer accountability, and more useful conversations about performance.",
      "Coaching should make the day-to-day easier to run. If it does not change the quality of decisions and follow-through, it is not yet doing enough.",
    ],
  },
  {
    slug: "how-to-build-confidence-with-business-coaching",
    title: "How to Build Confidence With Business Coaching",
    excerpt:
      "Confidence is not created by motivational language alone. It grows when leaders understand the system, see progress, and know how to respond under pressure.",
    category: "Leadership Coaching",
    date: "10 Oct 2025",
    cover:
      "/media/photo-1515169067868-5387ec356754-6a0fcd5a.jpg",
    content: [
      "Business coaching builds confidence by reducing ambiguity. Leaders need a practical framework for what to look at, how to respond, and how to keep teams aligned when problems appear.",
      "That usually means better routines, more useful metrics, and clearer expectations rather than more inspiration sessions. Confidence grows when leaders can see what good looks like.",
      "The result is steadier leadership under pressure and a stronger environment for teams to improve their work without confusion.",
    ],
  },
];

export type FaqEntry = {
  question: string;
  answer: string;
};

export type ServiceDetailPage = {
  description: string;
  h1: string;
  /** Hero / card image path */
  image: string;
  keywords: string[];
  overview: string;
  slug: string;
  title: string;
  whatWeDeliver: string[];
  whenToUse: string[];
  /** Extended body copy for deeper content */
  extendedOverview?: string;
  /** Methodology or approach steps */
  methodology?: { title: string; body: string }[];
  /** FAQs specific to this service */
  faqs?: FaqEntry[];
  /** Slugs of related service detail pages */
  relatedServices?: string[];
};

export type IndustryPage = {
  challenges: string[];
  description: string;
  h1: string;
  /** Hero / card image path */
  image: string;
  keywords: string[];
  overview: string;
  slug: string;
  title: string;
  whyTacklers: string[];
  /** Extended body copy for deeper content */
  extendedOverview?: string;
  /** FAQs specific to this industry */
  faqs?: FaqEntry[];
  /** Slugs of related service detail pages */
  relatedServices?: string[];
};

export const serviceDetailPages: ServiceDetailPage[] = [
  {
    slug: "business-process-management-consulting-uk",
    title: "Business Process Management Consulting UK | Tacklers",
    h1: "Business Process Management consulting for UK operational teams",
    image: "/media/Lean-transformation-consulting-UK-consultant-working-with-team-at-Gemba-1-6dc05d89.jpeg",
    description:
      "Strengthen flow, reduce variation, and improve handovers with practical business process management consulting delivered on-site at Gemba.",
    keywords: [
      "business process management consulting uk",
      "business process improvement consultant",
      "process mapping and optimisation",
      "bpm consulting services",
      "process standardisation uk",
    ],
    overview:
      "When process ownership is unclear, performance varies by team, shift, or site. We help you define how work should flow, where constraints sit, and which routines are needed to hold gains under pressure.",
    extendedOverview:
      "Business process management is not about creating documentation for its own sake. It is about making the way work moves visible, measurable, and improvable. In most organisations we support, the problem is the same: processes exist on paper but behaviour differs in practice. Hand-overs are inconsistent, escalation paths are unclear, and no one owns the end-to-end flow. We work alongside your teams at Gemba to map how work actually moves, identify the constraints that slow it down, and design practical routines that bring consistency without adding bureaucracy. Our approach connects process mapping with daily management discipline, so the improvements are visible in how work runs every day — not just on a wall chart. Whether you are standardising across sites or diagnosing a single value stream, we bring the structure needed to make process improvement stick.",
    whenToUse: [
      "Teams are firefighting recurring handover delays.",
      "The same process produces different outcomes by location or shift.",
      "Leaders need a practical baseline before broader transformation work.",
      "Process documentation exists but does not match actual practice.",
      "Cross-functional handoffs are causing quality or delivery issues.",
    ],
    whatWeDeliver: [
      "Current-state and future-state process maps tied to real constraints.",
      "Clear ownership, escalation paths, and operating rhythm recommendations.",
      "A phased implementation plan with measurable milestones.",
      "Standard work documentation aligned to team capability.",
      "Leadership routines to maintain process discipline over time.",
    ],
    methodology: [
      { title: "Map the current state", body: "We observe and document how work actually moves — not how it is supposed to — to expose constraints, variation, and waste." },
      { title: "Identify root causes", body: "Using Gemba observation and data analysis, we prioritise the handover failures and process breakdowns that drive the most disruption." },
      { title: "Design the future state", body: "We co-design improved workflows with your teams, testing changes in the live environment before locking them in." },
      { title: "Embed and sustain", body: "Standard work, escalation paths, and daily management routines are established so the gains hold without external pressure." },
    ],
    faqs: [
      { question: "How long does a typical BPM engagement take?", answer: "Most engagements start with a 2–4 week diagnostic, followed by a phased implementation period that depends on the scope and number of value streams involved." },
      { question: "Do you work across multiple sites?", answer: "Yes. We support multi-site process standardisation, helping align ways of working across different teams and locations while respecting local operational constraints." },
      { question: "What is the difference between BPM and Lean transformation?", answer: "BPM focuses specifically on how processes are designed, owned, and managed. Lean transformation is broader, covering leadership routines, capability building, and cultural change. BPM often forms part of a wider Lean programme." },
    ],
    relatedServices: ["cost-management-consulting-uk", "productivity-improvement-consulting-uk", "strategy-deployment-consulting-uk"],
  },
  {
    slug: "cost-management-consulting-uk",
    title: "Cost Management Consulting UK | Tacklers",
    h1: "Cost management consulting linked to operational reality",
    image: "/media/Cost-Management-f9a07bf6.jpeg",
    description:
      "Reduce avoidable cost by removing process waste, improving flow, and protecting critical expertise across regulated and high-stakes operations.",
    keywords: [
      "cost management consulting uk",
      "operational cost reduction consultant",
      "lean cost improvement",
      "waste reduction consulting",
      "cost optimisation services uk",
    ],
    overview:
      "Cost reduction only holds when it is connected to how work actually runs. We identify waste at source, quantify impact, and implement practical controls so savings stay visible in day-to-day delivery.",
    extendedOverview:
      "Many cost-reduction programmes fail because they target line items rather than root causes. Savings are announced, reported, and then quietly reverse within months. Our approach is different. We connect cost management to the way work actually flows — identifying waste at the process level, quantifying its impact in real terms, and implementing controls that prevent it from returning. We work on-site with your teams to trace where time, material, and effort are lost, then prioritise interventions based on evidence rather than assumption. The result is cost improvement that holds because it is embedded in how people work, not imposed from above. This approach protects your critical expertise and avoids the morale damage that short-sighted headcount cuts create. We help you spend less by working better, not by doing less.",
    whenToUse: [
      "Cost pressure is rising but service quality cannot drop.",
      "Cost initiatives have delivered short-term wins only.",
      "Leaders need evidence-led priorities, not broad cost-cutting.",
      "Waste is visible but has not been systematically quantified.",
      "The business needs to reduce spend without losing key capability.",
    ],
    whatWeDeliver: [
      "Waste and cost-driver diagnostics by value stream.",
      "Prioritised intervention plan with expected savings ranges.",
      "Leadership routines to sustain gains and prevent cost creep.",
      "Process-level controls that make savings visible in daily operations.",
      "Capability transfer so your team can sustain cost discipline independently.",
    ],
    methodology: [
      { title: "Diagnose cost drivers", body: "We walk the process at Gemba, identifying where time, material, and effort are wasted — not just where budgets are overspent." },
      { title: "Quantify and prioritise", body: "Each cost driver is sized by impact and effort to fix, creating a clear priority matrix for leadership decision-making." },
      { title: "Implement controls", body: "We design and embed practical controls at the process level — standard work, visual management, and escalation routines." },
      { title: "Sustain through leadership", body: "Daily and weekly management rhythms are built so cost discipline becomes part of how the operation runs, not a separate initiative." },
    ],
    faqs: [
      { question: "How do you protect quality while reducing cost?", answer: "We focus on removing waste — not cutting corners. By improving flow and reducing rework, quality often improves alongside cost reduction." },
      { question: "What kind of savings can we expect?", answer: "Savings vary by environment, but most engagements deliver measurable cost reduction within the first 8–12 weeks, with a clear plan for sustaining and extending gains." },
      { question: "Is this different from traditional cost-cutting?", answer: "Yes. Traditional cost-cutting often targets headcount or budgets. Our approach targets the process waste that drives unnecessary cost, preserving capability and expertise." },
    ],
    relatedServices: ["business-process-management-consulting-uk", "productivity-improvement-consulting-uk", "supplier-quality-development-consulting"],
  },
  {
    slug: "executive-leadership-coaching-operations",
    title: "Executive Leadership Coaching for Operations | Tacklers",
    h1: "Executive leadership coaching for operational performance",
    image: "/media/Executive-Leadership-Coaching-1588bf3d.jpeg",
    description:
      "Build leadership cadence, decision discipline, and escalation clarity so operational improvement efforts hold without constant external support.",
    keywords: [
      "executive leadership coaching operations",
      "operations leadership coaching",
      "leadership routines for continuous improvement",
      "lean leadership coaching uk",
      "operational leadership development",
    ],
    overview:
      "Improvement efforts succeed or fail on leadership habits. We coach senior and frontline leaders to build practical operating rhythms that support accountability, faster decisions, and sustainable delivery gains.",
    extendedOverview:
      "The most common reason operational improvement programmes stall is not a lack of tools — it is a lack of leadership discipline to sustain them. Good ideas fail when leaders cannot maintain the operating rhythm needed to follow through. We coach executives and frontline managers to build the daily and weekly habits that keep improvement alive: structured Gemba walks, consistent escalation cadences, visible accountability, and coaching conversations that develop team capability rather than just checking boxes. Our coaching is not classroom-based theory. It happens in the workplace, alongside real operational decisions, so leaders can practise new behaviours in context. Whether you need a single senior leader to shift their approach or an entire management tier to adopt new routines, we provide the structured support that makes the change practical and lasting.",
    whenToUse: [
      "Good improvement ideas stall at execution stage.",
      "Escalation is inconsistent and decision ownership is unclear.",
      "Leaders need support to coach teams through change.",
      "Daily management routines are weak or inconsistently followed.",
      "Transformation progress depends on a few key individuals rather than the system.",
    ],
    whatWeDeliver: [
      "Leadership cadence and governance design.",
      "Coaching support for frontline and middle-management routines.",
      "Decision and escalation framework mapped to operational risk.",
      "Gemba walk routines with structured observation and follow-up.",
      "Leadership capability assessment and development plan.",
    ],
    methodology: [
      { title: "Assess leadership behaviours", body: "We observe how leaders spend their time, make decisions, and follow through — identifying gaps between intent and practice." },
      { title: "Design the operating rhythm", body: "We co-create daily, weekly, and monthly leadership routines that match the operational tempo and priorities." },
      { title: "Coach on the floor", body: "Coaching happens at Gemba — in real meetings, real decisions, and real escalation moments — not in a training room." },
      { title: "Transfer and sustain", body: "Leaders learn to coach each other, creating a self-sustaining rhythm that holds after external support ends." },
    ],
    faqs: [
      { question: "Who is leadership coaching for?", answer: "It supports anyone from senior executives to frontline team leaders. The focus depends on where the leadership gap is having the most impact on operational performance." },
      { question: "How is this different from executive mentoring?", answer: "Our coaching is tied directly to operational outcomes and daily behaviours, not just strategic thinking. It is practical, on-site, and results-oriented." },
      { question: "Can coaching run alongside other improvement work?", answer: "Absolutely. Leadership coaching often runs in parallel with Lean transformation or process improvement to ensure leaders can sustain the changes being made." },
    ],
    relatedServices: ["strategy-deployment-consulting-uk", "business-process-management-consulting-uk", "productivity-improvement-consulting-uk"],
  },
  {
    slug: "productivity-improvement-consulting-uk",
    title: "Productivity Improvement Consulting UK | Tacklers",
    h1: "Productivity improvement consulting for complex operations",
    image: "/media/Productivity-Improvement-1d0b843c.jpeg",
    description:
      "Increase throughput and release capacity by removing bottlenecks, reducing rework, and improving daily management discipline.",
    keywords: [
      "productivity improvement consultancy uk",
      "productivity consulting services",
      "improve operational productivity",
      "throughput improvement consulting",
      "capacity release consulting",
    ],
    overview:
      "Productivity is not about pushing people harder. It is about removing the conditions that slow work down. We improve flow and support teams to sustain better output with less friction.",
    extendedOverview:
      "In most operations we assess, productivity loss comes from the same places: waiting, rework, unclear priorities, and inconsistent handovers. People are working hard, but the system is working against them. We help organisations identify and remove these friction points methodically — starting with the constraints that have the biggest impact on throughput and delivery reliability. Our approach combines Gemba observation with data analysis to build a clear picture of where capacity is being lost and what needs to change. We then work alongside teams to implement practical countermeasures: visual management, standard work, daily accountability routines, and better flow design. The result is more output from the same resources — not through harder work, but through smarter system design and stronger daily management discipline.",
    whenToUse: [
      "Throughput is unstable across weeks or shifts.",
      "Rework, waiting, and avoidable handoffs are persistent.",
      "Operational targets are missed despite high team effort.",
      "Teams are busy but output does not reflect the effort invested.",
      "Leaders lack visibility of where capacity is lost in the process.",
    ],
    whatWeDeliver: [
      "Bottleneck analysis with practical countermeasures.",
      "Daily management and visual control improvements.",
      "Capability transfer so teams sustain gains internally.",
      "Throughput improvement plan with clear milestones.",
      "Standard work and flow redesign for key value streams.",
    ],
    methodology: [
      { title: "Baseline performance", body: "We measure current throughput, cycle times, and rework rates to establish a factual starting point." },
      { title: "Identify constraints", body: "Gemba observation and data analysis pinpoint where flow breaks down and capacity is lost." },
      { title: "Implement countermeasures", body: "We co-design and test improvements with your teams in the live environment, adjusting based on real results." },
      { title: "Build daily discipline", body: "Visual management and daily management routines ensure gains are sustained and new constraints are caught early." },
    ],
    faqs: [
      { question: "How quickly will we see productivity improvements?", answer: "Most teams see measurable improvement within the first 4–6 weeks as quick-win countermeasures take effect. Deeper systemic improvements build over 3–6 months." },
      { question: "Do you work in service environments or just manufacturing?", answer: "We support both. Productivity improvement principles apply wherever work flows through a process, whether that is a factory, a service desk, or a clinical pathway." },
      { question: "What if the problem is people, not process?", answer: "In our experience, most performance issues are system problems, not people problems. We help leaders see the difference and address the root cause." },
    ],
    relatedServices: ["business-process-management-consulting-uk", "cost-management-consulting-uk", "executive-leadership-coaching-operations"],
  },
  {
    slug: "supplier-quality-development-consulting",
    title: "Supplier Quality Development Consulting | Tacklers",
    h1: "Supplier quality development for stable delivery",
    image: "/media/Supplier-Quality-Development-a29c0c6d.jpeg",
    description:
      "Strengthen supplier performance and reduce downstream disruption with practical supplier quality development support.",
    keywords: [
      "supplier quality development consulting",
      "supplier quality improvement",
      "supplier performance consultancy",
      "supply chain quality uk",
      "supplier development programme",
    ],
    overview:
      "If supplier issues drive delays and rework, internal process change alone is not enough. We support supplier-facing quality development and escalation discipline that protects delivery performance.",
    extendedOverview:
      "Supplier quality problems are among the most persistent and costly sources of operational disruption. Late deliveries, incoming defects, and inconsistent specification compliance ripple through your operation, creating rework, delays, and customer risk. Yet most organisations treat supplier quality reactively — chasing problems after they arrive rather than preventing them at source. We take a different approach. We help you build structured supplier development routines that drive quality improvement upstream, strengthen escalation discipline, and create shared accountability between your teams and your supply base. Our support covers supplier assessment, containment frameworks, corrective action facilitation, and joint improvement planning. Whether you are dealing with a small number of critical suppliers or managing a complex supply chain, we bring the practical tools and on-site discipline needed to stabilise incoming quality and protect your delivery performance.",
    whenToUse: [
      "Supplier defects are driving customer or production risk.",
      "Incoming quality variation causes rework and instability.",
      "Teams need a stronger supplier escalation and recovery model.",
      "Supplier performance data exists but is not driving action.",
      "Key suppliers are underperforming and need structured development support.",
    ],
    whatWeDeliver: [
      "Supplier quality baseline and risk prioritisation.",
      "Practical containment and corrective-action framework.",
      "Joint supplier-development routines with clear accountability.",
      "Incoming quality metrics and escalation triggers.",
      "Capability transfer so your procurement and quality teams can sustain the programme.",
    ],
    methodology: [
      { title: "Assess supplier risk", body: "We evaluate supplier performance data and incoming quality patterns to prioritise which suppliers need development support first." },
      { title: "Design the framework", body: "We create a practical containment, corrective action, and escalation framework tailored to your supply chain complexity." },
      { title: "Engage suppliers", body: "We facilitate joint improvement sessions with critical suppliers to address root causes and agree clear development milestones." },
      { title: "Sustain and monitor", body: "Incoming quality routines and performance reviews are embedded so supplier discipline holds without constant intervention." },
    ],
    faqs: [
      { question: "Do you work directly with our suppliers?", answer: "Yes. We facilitate joint sessions and support direct supplier engagement to address root causes and drive improvement collaboratively." },
      { question: "What sectors is this most relevant to?", answer: "Supplier quality development is critical in aerospace, defence, manufacturing, healthcare, and any sector where incoming material or component quality directly affects delivery reliability." },
      { question: "Can you help with supplier audits?", answer: "We support supplier assessment and development rather than formal audit certification, focusing on practical quality improvement that drives better performance." },
    ],
    relatedServices: ["cost-management-consulting-uk", "business-process-management-consulting-uk", "project-management-for-transformation"],
  },
  {
    slug: "strategy-deployment-consulting-uk",
    title: "Strategy Deployment Consulting UK | Tacklers",
    h1: "Strategy deployment consulting that drives weekly execution",
    image: "/media/Strategy-Deployment-cb6e4118.jpeg",
    description:
      "Translate strategic priorities into visible weekly execution, ownership, and follow-through across operational teams.",
    keywords: [
      "strategy deployment consulting uk",
      "hoshin kanri consulting",
      "operational strategy execution",
      "strategy execution support",
      "policy deployment consulting uk",
    ],
    overview:
      "Strategy fails when it stays in presentation decks. We help turn priorities into practical execution routines so leaders and teams stay aligned on what matters now and what must happen next.",
    extendedOverview:
      "The gap between strategy and execution is one of the most common challenges in operational organisations. Leaders set clear strategic goals, but by the time they reach the teams who need to act on them, priorities are diluted, ownership is vague, and follow-through is inconsistent. Strategy deployment — sometimes called Hoshin Kanri or policy deployment — closes this gap by creating a visible, structured cascade from strategic intent to daily action. We help you design priority cascades that connect board-level goals to team-level tasks, build weekly review cadences that keep execution on track, and establish escalation models that surface blockers before they become failures. The result is an organisation that does not just set strategy — it executes it, consistently and visibly, at every level.",
    whenToUse: [
      "Teams are overloaded with initiatives and mixed priorities.",
      "Strategic goals are not translating into operational action.",
      "Follow-through is inconsistent across departments.",
      "Leaders lack a structured way to cascade and review strategic priorities.",
      "Annual planning creates goals that are forgotten by Q2.",
    ],
    whatWeDeliver: [
      "Priority cascades from strategic goals to team-level actions.",
      "Weekly execution cadence and review routines.",
      "Escalation and accountability model for cross-functional delivery.",
      "Visual management tools for strategy tracking.",
      "Leadership coaching to sustain the deployment rhythm long-term.",
    ],
    methodology: [
      { title: "Clarify strategic priorities", body: "We help leadership teams distil their strategy into a small number of clear, measurable priorities that can be cascaded." },
      { title: "Cascade to team level", body: "Each priority is translated into specific actions, owners, and timelines at every level of the organisation." },
      { title: "Build execution cadence", body: "Weekly and monthly review routines are designed to track progress, surface blockers, and maintain alignment." },
      { title: "Coach and sustain", body: "Leaders are coached to run the deployment rhythm independently, ensuring strategy execution becomes part of how the organisation operates." },
    ],
    faqs: [
      { question: "Is this the same as Hoshin Kanri?", answer: "Strategy deployment draws heavily on Hoshin Kanri principles — cascading priorities, catchball planning, and structured review. We adapt the approach to fit your organisation's maturity and complexity." },
      { question: "How does this relate to OKRs?", answer: "OKRs and strategy deployment share the goal of aligning action to priorities. Strategy deployment adds the execution cadence and leadership routines that OKRs alone often lack." },
      { question: "How long does it take to implement?", answer: "Most organisations can establish an initial deployment cycle within 6–8 weeks. Full maturity builds over 2–3 deployment cycles as teams develop confidence in the rhythm." },
    ],
    relatedServices: ["executive-leadership-coaching-operations", "project-management-for-transformation", "business-process-management-consulting-uk"],
  },
  {
    slug: "project-management-for-transformation",
    title: "Project Management for Transformation | Tacklers",
    h1: "Project management for Lean and operational transformation",
    image: "/media/photo-1454165804606-c3d57bc86b40-354f8fd9.jpg",
    description:
      "Improve transformation execution with practical project governance, clear milestones, and disciplined cross-functional coordination.",
    keywords: [
      "transformation project management consultancy",
      "operational transformation project support",
      "lean project management",
      "change programme management",
      "transformation delivery governance",
    ],
    overview:
      "Transformation activity often fails because coordination breaks down. We provide practical governance and delivery structure that keeps work moving and reduces execution risk.",
    extendedOverview:
      "Operational transformation programmes are complex. They involve multiple workstreams, cross-functional dependencies, and competing priorities — all running alongside day-to-day delivery. When project management is weak, milestones slip, ownership blurs, and momentum stalls. We bring practical project governance that keeps transformation work moving without creating bureaucratic overhead. Our approach focuses on visible delivery tracking, structured escalation, and clear ownership at every level. We help you design transformation plans with realistic dependencies, establish review cadences that maintain pace, and build escalation routines that catch problems before they derail progress. Whether you are running a single value stream improvement or a multi-site transformation programme, we provide the coordination discipline that turns good intentions into delivered results.",
    whenToUse: [
      "Transformation milestones are slipping repeatedly.",
      "Cross-functional teams are not aligned on delivery ownership.",
      "Leaders need better delivery visibility and decision confidence.",
      "Multiple improvement workstreams are running with inconsistent governance.",
      "Previous transformation efforts lost momentum after initial enthusiasm.",
    ],
    whatWeDeliver: [
      "Transformation plan with clear dependencies and risk controls.",
      "Cadence for planning, review, and escalation.",
      "Execution support aligned to operational outcomes.",
      "Stakeholder management and communication framework.",
      "Capability transfer so your team can manage future programmes independently.",
    ],
    methodology: [
      { title: "Scope and structure", body: "We define the transformation programme structure — workstreams, milestones, dependencies, and governance — based on what the operation can realistically support." },
      { title: "Establish cadence", body: "Weekly and monthly review routines are built to maintain pace, surface risks, and keep stakeholders aligned." },
      { title: "Deliver and adapt", body: "We support execution in real-time, adjusting plans as operational realities evolve and new constraints emerge." },
      { title: "Transfer ownership", body: "Programme management capability is built internally so your team can sustain the discipline for future transformation cycles." },
    ],
    faqs: [
      { question: "Do you replace our existing project managers?", answer: "No. We work alongside your team to strengthen governance and execution discipline. The goal is to build internal capability, not create dependency." },
      { question: "What size of programme do you support?", answer: "We support everything from single-site value stream improvements to multi-site transformation programmes. The governance framework scales to match." },
      { question: "How do you handle programme risk?", answer: "We build risk identification and escalation into the weekly cadence so problems are caught early and decisions are made quickly, not deferred." },
    ],
    relatedServices: ["strategy-deployment-consulting-uk", "executive-leadership-coaching-operations", "productivity-improvement-consulting-uk"],
  },
];

export const industryPages: IndustryPage[] = [
  {
    slug: "aerospace-defence-operational-excellence",
    title: "Aerospace & Defence Operational Excellence | Tacklers",
    h1: "Operational excellence support for Aerospace and Defence",
    image: "/media/photo-1517976547714-720226b864c1-3397c986.jpg",
    description:
      "Practical Lean transformation support for Aerospace and Defence teams managing quality pressure, complex handovers, and strict regulatory controls.",
    keywords: [
      "aerospace operational excellence consulting",
      "defence process improvement",
      "lean aerospace consulting uk",
      "aerospace lean transformation",
      "MRO process improvement",
    ],
    overview:
      "Aerospace and Defence operations require precision, reliability, and disciplined delivery. We support teams in high-control environments to improve flow without compromising safety or quality.",
    extendedOverview:
      "Aerospace and Defence organisations operate under some of the most demanding quality and regulatory requirements of any sector. Every handover, inspection, and assembly step carries consequence — and when flow breaks down, the cost is measured in programme delays, customer risk, and compliance exposure. We have direct experience working in these environments, supporting MRO operations, manufacturing lines, and engineering teams to improve throughput while maintaining the traceability, quality, and safety discipline these sectors demand. Our approach respects the complexity of the work. We do not impose generic solutions. Instead, we observe how work actually flows at Gemba, identify where constraints and waste are creating the most disruption, and co-design improvements with your teams that fit within the regulatory and quality framework. The result is better delivery performance, protected expertise, and sustainable gains that survive programme pressure.",
    challenges: [
      "Complex handovers across engineering, supply, and production teams.",
      "Quality and traceability pressure under tight delivery windows.",
      "High cost of rework and late-stage disruption.",
      "MRO turnaround times under increasing commercial pressure.",
      "Regulatory compliance requirements that limit how processes can change.",
    ],
    whyTacklers: [
      "On-site support where constraints are visible and measurable.",
      "People-first approach that protects specialist expertise.",
      "Practical routines that sustain gains after implementation.",
      "Direct experience in aerospace MRO and manufacturing environments.",
      "Improvement approach that works within regulatory and quality frameworks.",
    ],
    faqs: [
      { question: "Do you have aerospace sector experience?", answer: "Yes. Our founder has a degree in Aerospace Technology and has led Lean transformation work in aerospace engineering and MRO environments." },
      { question: "How do you handle regulatory constraints?", answer: "We design improvements that work within your existing quality and regulatory frameworks, not around them. Compliance is a baseline, not an afterthought." },
      { question: "Can you support MRO operations?", answer: "Yes. We have supported MRO teams to improve turnaround times, reduce rework, and strengthen handover discipline across complex maintenance workflows." },
    ],
    relatedServices: ["supplier-quality-development-consulting", "business-process-management-consulting-uk", "project-management-for-transformation"],
  },
  {
    slug: "healthcare-life-sciences-process-improvement",
    title: "Healthcare & Life Sciences Process Improvement | Tacklers",
    h1: "Lean process improvement for Healthcare and Life Sciences",
    image: "/media/photo-1576091160550-2173dba999ef-58286eed.jpg",
    description:
      "Improve flow, reduce avoidable delay, and build reliable routines across Healthcare and Life Sciences operations.",
    keywords: [
      "healthcare process improvement consultancy",
      "lean healthcare consulting uk",
      "life sciences operational excellence",
      "clinical pathway improvement",
      "healthcare lean transformation",
    ],
    overview:
      "Healthcare and Life Sciences teams operate with high consequence and high complexity. We help improve process reliability while maintaining the discipline these environments demand.",
    extendedOverview:
      "Healthcare and Life Sciences organisations face a unique combination of pressures: high patient or product consequence, regulatory complexity, resource constraints, and demand variability that makes flow improvement both critical and challenging. Generic process improvement approaches often fail here because they underestimate the consequence of change in clinical or regulated environments. Our approach is different. We work alongside clinical and operational teams at the point of care or production to observe how workflows actually function, identify where avoidable delays and bottlenecks are creating the most harm, and design improvements that teams can adopt safely and sustainably. We understand that trust is earned in these environments — improvement must feel safe, practical, and grounded in the realities teams face every day. Whether you are improving patient pathways, stabilising laboratory workflows, or strengthening production discipline in a life sciences facility, we bring the practical delivery support needed to improve flow without compromising safety or quality.",
    challenges: [
      "Demand variability and bottlenecks across critical workflows.",
      "Need for consistent quality under regulatory pressure.",
      "Cross-team coordination challenges that affect throughput.",
      "Patient flow delays and avoidable waiting times.",
      "Difficulty sustaining improvements in high-pressure clinical environments.",
    ],
    whyTacklers: [
      "Structured operational diagnostics linked to practical action.",
      "Capability building for leaders and frontline teams.",
      "Improvement model designed for high-stakes delivery settings.",
      "People-first approach that builds trust in the improvement process.",
      "Experience improving flow in both clinical and life sciences production settings.",
    ],
    faqs: [
      { question: "Do you work in hospitals and clinical settings?", answer: "We support healthcare organisations to improve operational flow and reduce avoidable delay. Our approach works within the governance and safety frameworks that clinical environments require." },
      { question: "How do you ensure patient safety during improvement work?", answer: "Safety is always the baseline. We design improvements that fit within clinical governance frameworks and test changes carefully before wider rollout." },
      { question: "Can you help with laboratory or production workflows?", answer: "Yes. Our process improvement approach works in life sciences production, laboratory, and clinical settings where flow reliability and quality consistency are critical." },
    ],
    relatedServices: ["business-process-management-consulting-uk", "productivity-improvement-consulting-uk", "executive-leadership-coaching-operations"],
  },
  {
    slug: "energy-sector-operational-improvement",
    title: "Energy Sector Operational Improvement | Tacklers",
    h1: "Operational improvement support for the Energy sector",
    image: "/media/photo-1473341304170-971dccb5ac1e-b3bd42a9.jpg",
    description:
      "Improve operational reliability, planning discipline, and escalation effectiveness across Energy sector delivery environments.",
    keywords: [
      "energy sector operational efficiency consulting",
      "energy process improvement consultancy",
      "lean energy operations",
      "energy sector lean transformation",
      "operational reliability consulting energy",
    ],
    overview:
      "Energy operations require reliability, speed, and control. We work alongside teams to improve planning and execution discipline so performance is more predictable under pressure.",
    extendedOverview:
      "Energy sector operations — whether in generation, transmission, distribution, or renewables — face relentless pressure on reliability, cost, and regulatory compliance. Unplanned outages, maintenance backlogs, and poor planning-to-execution discipline can have significant commercial and safety consequences. We help energy organisations strengthen their operational foundations by working on-site with teams to improve planning discipline, escalation effectiveness, and daily management routines. Our approach focuses on making work visible, reducing the gap between planned and actual execution, and building the leadership habits needed to sustain better performance under pressure. Whether you are managing maintenance schedules, responding to grid demands, or optimising renewable asset performance, we bring practical Lean thinking to help your teams deliver more reliably with the resources they have.",
    challenges: [
      "Reliability issues disrupting output and service continuity.",
      "Weak escalation pathways during operational disruption.",
      "Planning-to-execution disconnect across teams.",
      "Maintenance backlogs and unplanned downtime.",
      "Regulatory and safety compliance complexity.",
    ],
    whyTacklers: [
      "Evidence-led prioritisation of critical constraints.",
      "Leadership coaching to strengthen daily operating rhythm.",
      "Practical, measurable interventions rather than theoretical plans.",
      "On-site support that addresses real operational conditions.",
      "Approach designed for high-consequence, regulated environments.",
    ],
    faqs: [
      { question: "What types of energy operations do you support?", answer: "We support generation, transmission, distribution, and renewables operations — anywhere that reliability, planning discipline, and operational flow need to improve." },
      { question: "How do you balance improvement with safety requirements?", answer: "Safety is non-negotiable. Our improvements are designed within your safety management system and regulatory framework, not around them." },
      { question: "Can you help reduce unplanned downtime?", answer: "Yes. By improving planning discipline, escalation routines, and maintenance execution, we help teams move from reactive firefighting to predictable, planned delivery." },
    ],
    relatedServices: ["productivity-improvement-consulting-uk", "strategy-deployment-consulting-uk", "executive-leadership-coaching-operations"],
  },
  {
    slug: "public-sector-lean-transformation",
    title: "Public Sector Lean Transformation | Tacklers",
    h1: "Lean transformation support for Public Sector delivery teams",
    image: "/media/photo-1486406146926-c627a92ad1ab-89b08768.jpg",
    description:
      "Strengthen service delivery, reduce process waste, and improve execution discipline in Public Sector operational environments.",
    keywords: [
      "public sector lean transformation",
      "public service process improvement",
      "operational excellence public sector uk",
      "lean government consulting",
      "public sector continuous improvement",
    ],
    overview:
      "Public Sector teams balance demand, risk, and accountability. We support practical transformation that improves delivery performance while protecting service continuity.",
    extendedOverview:
      "Public Sector organisations face a distinctive set of challenges: high demand, constrained budgets, complex governance, and accountability frameworks that make change inherently difficult. Improvement programmes in this context need to be practical, sensitive to the operating environment, and designed to deliver results without disrupting service continuity. We work alongside public sector delivery teams to identify where process waste is creating the most impact on service quality and throughput, then co-design improvements that teams can implement safely and sustain with existing resources. Our approach values simplicity, transparency, and measurable outcomes. We help teams build daily management routines that improve follow-through, reduce hand-off delays, and create visible accountability — not more bureaucracy. Whether you are improving case processing, service delivery pathways, or cross-departmental coordination, we bring the same practical discipline that works in the most demanding private sector environments, adapted to the realities of public service.",
    challenges: [
      "High demand and limited operational capacity.",
      "Complex governance and accountability requirements.",
      "Inconsistent execution across functions and teams.",
      "Case backlogs and service delivery delays.",
      "Difficulty sustaining improvement within existing budget constraints.",
    ],
    whyTacklers: [
      "Hands-on implementation support for real service constraints.",
      "Simple operating routines that improve follow-through.",
      "Capability transfer to sustain gains internally.",
      "People-first approach that builds trust in the improvement process.",
      "Experience adapting Lean methods for public accountability frameworks.",
    ],
    faqs: [
      { question: "Have you worked with public sector organisations before?", answer: "Yes. We have supported public sector delivery teams to improve operational performance and reduce process waste within existing governance and accountability frameworks." },
      { question: "How do you adapt Lean methods for the public sector?", answer: "We focus on the principles — improving flow, reducing waste, building capability — and adapt the tools to fit the governance, accountability, and service continuity requirements of public organisations." },
      { question: "Can you help with service backlogs?", answer: "Yes. We help teams identify the root causes of backlog accumulation and implement practical countermeasures that improve throughput and prevent recurrence." },
    ],
    relatedServices: ["business-process-management-consulting-uk", "executive-leadership-coaching-operations", "strategy-deployment-consulting-uk"],
  },
  {
    slug: "it-services-lean-operations",
    title: "IT Services Lean Operations | Tacklers",
    h1: "Lean operations support for IT Services teams",
    image: "/media/photo-1518773553398-650c184e0bb3-7d18c6b0.jpg",
    description:
      "Apply Lean thinking to IT Services delivery to improve flow, reduce handoff delays, and strengthen cross-team execution.",
    keywords: [
      "it services lean transformation",
      "it operations process improvement",
      "lean service management",
      "IT service delivery improvement",
      "lean IT consulting uk",
    ],
    overview:
      "IT Services environments often struggle with cross-team bottlenecks and unclear ownership. We help teams build practical flow and escalation discipline across service delivery.",
    extendedOverview:
      "IT Services organisations manage complex, high-volume workflows that span multiple teams, tools, and escalation tiers. When flow breaks down, tickets pile up, handoffs stall, and service levels deteriorate — often despite significant technology investment. The problem is rarely the tools. It is how work moves between people. We apply Lean thinking to IT service delivery by observing how work actually flows across teams, identifying where bottlenecks and handoff delays are creating the most disruption, and designing practical improvements that reduce waiting, clarify ownership, and strengthen cross-team execution. Our approach works alongside existing ITSM frameworks — it does not replace them. Instead, it addresses the operational execution gaps that formal process frameworks alone cannot solve. Whether you are improving incident response, change management flow, or cross-team service delivery, we bring the practical discipline needed to make IT operations more reliable and responsive.",
    challenges: [
      "High ticket or request volume with uneven throughput.",
      "Repeated handoff delays between support and delivery teams.",
      "Improvement initiatives that do not hold in live operations.",
      "Unclear ownership across shared service teams.",
      "Service level pressure despite significant technology investment.",
    ],
    whyTacklers: [
      "Gemba-style observation applied to digital service workflows.",
      "Practical routines to stabilise prioritisation and execution.",
      "Leadership support to sustain improvements over time.",
      "Approach that complements existing ITSM frameworks.",
      "Focus on flow and handoff improvement, not just tool optimisation.",
    ],
    faqs: [
      { question: "Do you replace our ITSM framework?", answer: "No. We work within your existing ITSM framework to improve operational execution. Lean thinking complements process frameworks by addressing the day-to-day flow and handoff gaps they cannot solve alone." },
      { question: "Can Lean really work in IT?", answer: "Absolutely. Lean thinking applies wherever work flows through a process. IT Services involves queues, handoffs, prioritisation, and escalation — all areas where Lean principles drive significant improvement." },
      { question: "How do you observe digital workflows?", answer: "We use a Gemba-style approach adapted for digital environments — working alongside teams, observing how tickets and requests move, and identifying where work stalls or gets reworked." },
    ],
    relatedServices: ["productivity-improvement-consulting-uk", "business-process-management-consulting-uk", "executive-leadership-coaching-operations"],
  },
  {
    slug: "manufacturing-operational-excellence",
    title: "Manufacturing Operational Excellence | Tacklers",
    h1: "Operational excellence support for Manufacturing environments",
    image: "/media/photo-1565688534245-05d6b5be184a-f02d6c76.jpg",
    description:
      "Reduce waste, improve production flow, and strengthen delivery reliability across Manufacturing operations and supply chains.",
    keywords: [
      "manufacturing operational excellence consultancy",
      "lean manufacturing consulting uk",
      "manufacturing process improvement",
      "production flow improvement",
      "factory lean transformation",
    ],
    overview:
      "Manufacturing teams face persistent pressure on cost, quality, and delivery. We support practical flow improvement, leadership routines, and capability transfer that hold under real production conditions.",
    extendedOverview:
      "Manufacturing environments are where Lean principles originated, and they remain one of the most impactful settings for process improvement. Yet many manufacturing operations still struggle with the same challenges: production bottlenecks, repeat rework, inconsistent shift performance, and supply chain variability that disrupts even well-planned schedules. We work on the shop floor alongside production teams, supervisors, and managers to identify where flow is breaking down and why. Our support covers value stream mapping, standard work design, visual management, daily management routines, and leadership coaching — all delivered in the context of your actual production environment. We do not run classroom workshops and call it transformation. We improve the way work moves, build the capability of the people doing the work, and establish the management discipline needed to sustain better performance over time. Whether you are dealing with one production line or a multi-site operation, we bring practical, measurable improvement that holds under real conditions.",
    challenges: [
      "Production bottlenecks and repeat rework disrupting output.",
      "Supplier and handover issues driving variability.",
      "High effort spent on firefighting rather than improvement.",
      "Inconsistent performance across shifts and production lines.",
      "Difficulty sustaining gains after initial improvement efforts.",
    ],
    whyTacklers: [
      "On-site delivery support where delays and constraints are visible.",
      "People-first Lean approach that protects operational expertise.",
      "Structured improvement cadence for sustainable performance gains.",
      "Direct experience in manufacturing, assembly, and MRO environments.",
      "Capability transfer so your teams sustain improvements independently.",
    ],
    faqs: [
      { question: "What types of manufacturing do you support?", answer: "We support discrete manufacturing, assembly, MRO, and process manufacturing environments. Our approach adapts to your production type, complexity, and volume." },
      { question: "Can you help with multi-site operations?", answer: "Yes. We support multi-site standardisation and improvement, helping align ways of working and share best practices across locations." },
      { question: "How do you work with our production schedule?", answer: "We plan our support around your production reality. Observation and improvement work is scheduled to minimise disruption while maximising learning from live operations." },
    ],
    relatedServices: ["supplier-quality-development-consulting", "productivity-improvement-consulting-uk", "cost-management-consulting-uk"],
  },
];

export function getServiceDetailBySlug(slug: string) {
  return serviceDetailPages.find((item) => item.slug === slug) ?? null;
}

export function getServiceDetailBySlugOrNull(slug: string) {
  return serviceDetailPages.find((item) => item.slug === slug) ?? null;
}

export function getIndustryPageBySlug(slug: string) {
  return industryPages.find((item) => item.slug === slug) ?? null;
}

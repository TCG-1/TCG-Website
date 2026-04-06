/* ------------------------------------------------------------------ */
/*  Case-study data — used by both the hub and the [slug] detail page */
/* ------------------------------------------------------------------ */

export interface CaseStudy {
  slug: string;
  title: string;
  sector: string;
  summary: string;
  outcomes: string[];
  /** Extended narrative displayed on the detail page. Markdown-like headings (##) supported. */
  detail: string[];
  /** Related service page paths for internal linking */
  relatedServices: { label: string; href: string }[];
  /** Cover image (reused from existing media) */
  cover: string;
  /** SEO fields */
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "aerospace-mro-turnaround-time-reduction",
    title: "Aerospace MRO Turnaround Time Reduction",
    sector: "Aerospace & Defence",
    summary:
      "Reduced aircraft turnaround time by 30% through value stream redesign, standard work implementation, and improved cross-shift handover discipline in a complex MRO environment.",
    outcomes: [
      "30% turnaround time reduction",
      "Improved cross-shift handover",
      "Sustained through daily management routines",
    ],
    cover: "/media/Manufacturing-Support-f5a8f8f1.jpeg",
    detail: [
      "## The challenge",
      "A UK-based aerospace MRO facility was under increasing commercial pressure to reduce aircraft turnaround time. Customer contracts specified penalty clauses for late delivery, and the organisation was regularly exceeding target turnaround by 15 to 25 per cent. The operation ran 24/7 across multiple shifts, with complex aircraft requiring hundreds of individual task cards, inspections, and sign-offs before release to service.",
      "Initial management assumptions pointed to resource constraints — not enough engineers, not enough tooling, not enough bay capacity. However, a closer look at the data suggested the problem was not capacity but flow.",
      "## Our approach",
      "We began at Gemba — spending time on the hangar floor across all shifts, observing how work actually moved through the MRO process. What we found was characteristic of complex MRO environments: significant waiting time between work packages, inconsistent handovers between shifts, parts kitting delays that left engineers idle, and a planning process that front-loaded work into the first days of each visit without smoothing the schedule across the full turnaround window.",
      "Working alongside the operations team, we mapped the value stream for the most common aircraft type. The map revealed that value-adding work — actual hands-on engineering — represented approximately 22 per cent of total turnaround time. The remaining 78 per cent was waiting, transport, rework, and administrative delay.",
      "We designed targeted interventions: a revised planning method that levelled work across the turnaround window, a kitting system that ensured parts and tooling were staged before each shift, a structured handover protocol that reduced cross-shift information loss, and daily management routines that made turnaround progress visible to all teams.",
      "## The results",
      "Within four months, average turnaround time had reduced by 30 per cent. Cross-shift handover quality improved measurably, with a 60 per cent reduction in shift-start queries and reconfirmation requests. More importantly, the daily management routines we established gave the team the tools to sustain these gains independently.",
      "The improvements did not require additional headcount or capital investment. They came from removing the waste in how work was planned, sequenced, and communicated — exactly the kind of improvement that Lean thinking is designed to deliver.",
    ],
    relatedServices: [
      { label: "Operational Excellence Consulting", href: "/operational-excellence-consulting-uk" },
      { label: "Lean Transformation", href: "/lean-transformation-consulting-uk" },
      { label: "Aerospace & Defence", href: "/industries/aerospace-defence" },
    ],
    seoTitle: "Aerospace MRO Turnaround Time Reduction Case Study | Tacklers",
    seoDescription:
      "How we reduced aircraft MRO turnaround time by 30% through value stream redesign and daily management. Read the full case study.",
    keywords: [
      "aerospace MRO case study",
      "turnaround time reduction",
      "lean aerospace improvement",
      "MRO process improvement",
    ],
  },
  {
    slug: "manufacturing-productivity-improvement",
    title: "Manufacturing Productivity Improvement",
    sector: "Manufacturing",
    summary:
      "Improved production line OEE from 62% to 81% by addressing changeover losses, implementing visual management, and coaching team leaders in daily performance management.",
    outcomes: [
      "OEE improved from 62% to 81%",
      "Changeover time reduced by 45%",
      "Team leader capability developed",
    ],
    cover: "/media/Productivity-Improvement-1d0b843c.jpeg",
    detail: [
      "## The challenge",
      "A mid-sized UK manufacturer was struggling with below-target production throughput despite having invested in modern equipment. Overall Equipment Effectiveness (OEE) across the primary production line sat at 62 per cent — significantly below the 85 per cent industry benchmark. The gap was costing the business in lost output, overtime, and missed delivery commitments.",
      "Previous improvement efforts had focused on equipment upgrades and maintenance scheduling, but OEE had plateaued. The root causes lay not in the machines but in how the production process was managed day to day.",
      "## Our approach",
      "Starting at Gemba, we observed the production line across multiple shifts and product changeovers. Three root causes quickly became apparent: changeover times were excessive (averaging 48 minutes against a 15-minute target), visual management was either absent or not maintained, and team leaders lacked the skills and routines to manage daily performance proactively.",
      "We designed a three-strand intervention. First, a SMED (Single-Minute Exchange of Die) programme targeting the five highest-frequency changeovers, involving the operators and setters who performed them. Second, a visual management system that made hourly production status, quality alerts, and maintenance needs visible to everyone on the line. Third, a coaching programme for team leaders covering daily management meetings, Gemba observation, and short-interval performance review.",
      "## The results",
      "Over twelve weeks, OEE improved from 62 per cent to 81 per cent. The SMED programme reduced average changeover time from 48 to 26 minutes, with the top two changeovers reduced below 15 minutes. The visual management system enabled faster response to stoppages and quality issues. And the team leader coaching programme created a management cadence where performance was actively managed every hour rather than reviewed at the end of each shift.",
      "The manufacturer gained the equivalent of an additional shift's worth of capacity from existing equipment — without capital expenditure or additional headcount. More significantly, the team leader capability developed during the programme created a foundation for ongoing improvement that continues independently.",
    ],
    relatedServices: [
      { label: "Lean Training UK", href: "/lean-training-uk" },
      { label: "Continuous Improvement Consulting", href: "/continuous-improvement-consulting-uk" },
      { label: "Manufacturing", href: "/industries/manufacturing" },
    ],
    seoTitle: "Manufacturing OEE Improvement Case Study | Tacklers",
    seoDescription:
      "How we improved production OEE from 62% to 81% through SMED, visual management, and team leader coaching. Read the full case study.",
    keywords: [
      "manufacturing OEE improvement",
      "lean manufacturing case study",
      "production improvement uk",
      "SMED case study",
    ],
  },
  {
    slug: "healthcare-patient-flow-improvement",
    title: "Healthcare Patient Flow Improvement",
    sector: "Healthcare",
    summary:
      "Reduced average patient waiting time by 40% across emergency and outpatient pathways through process redesign, visual flow management, and leadership coaching.",
    outcomes: [
      "40% reduction in patient waiting time",
      "Improved staff engagement",
      "Sustainable flow management system",
    ],
    cover: "/media/Productivity-Improvement-1d0b843c.jpeg",
    detail: [
      "## The challenge",
      "A UK healthcare organisation was experiencing persistent patient flow challenges. Average waiting times across emergency and outpatient pathways significantly exceeded targets. Staff were working at full stretch, yet patients routinely experienced avoidable delays at multiple points in their journey — from initial assessment through to treatment, review, and discharge.",
      "Previous improvement efforts had focused on individual bottlenecks without addressing the end-to-end pathway. Fixing one constraint simply moved the queue to the next step in the process.",
      "## Our approach",
      "We mapped the patient pathways end to end, following patients through the system and measuring the time at each stage. The value stream maps revealed that patients spent approximately 85 per cent of their time in the system waiting rather than receiving care. The waits occurred at predictable points: triage queues, diagnostic turnaround, specialist review availability, and discharge processing.",
      "Working with clinical and operational teams, we designed improvements targeting the highest-impact wait points. This included a visual flow management system that gave charge nurses and site managers real-time visibility of patient status across the pathway, a criteria-led discharge process that enabled earlier identification and preparation of patients who were approaching discharge readiness, and structured daily huddles that aligned the multi-disciplinary team around flow priorities each morning.",
      "Crucially, we invested significant time coaching ward and department leaders. The improvement tools were important, but the sustainability depended on leaders who could maintain the new routines, coach their teams through challenges, and escalate systemic issues effectively.",
      "## The results",
      "Average patient waiting time reduced by 40 per cent across the targeted pathways. Staff engagement scores in the pilot areas improved measurably, with teams reporting clearer communication, better visibility of priorities, and a stronger sense of control over their working day.",
      "The visual flow management system and daily huddle routines provided a sustainable operating rhythm that continued well after our direct involvement ended. The coaching investment in ward leaders was the key enabler — giving them the skills and confidence to sustain the improvements independently.",
    ],
    relatedServices: [
      { label: "Operational Excellence Consulting", href: "/operational-excellence-consulting-uk" },
      { label: "Gemba Consulting", href: "/gemba-consulting" },
      { label: "Healthcare & Life Sciences", href: "/industries/healthcare-life-sciences" },
    ],
    seoTitle: "Healthcare Patient Flow Improvement Case Study | Tacklers",
    seoDescription:
      "How we reduced patient waiting time by 40% through pathway redesign, visual flow management, and leadership coaching. Read the case study.",
    keywords: [
      "healthcare patient flow",
      "lean healthcare case study",
      "NHS process improvement",
      "patient waiting time reduction",
    ],
  },
  {
    slug: "energy-sector-maintenance-planning",
    title: "Energy Sector Maintenance Planning",
    sector: "Energy",
    summary:
      "Improved planned maintenance execution from 68% to 89% adherence by redesigning the planning cycle, strengthening escalation routines, and embedding daily management discipline.",
    outcomes: [
      "89% maintenance plan adherence (from 68%)",
      "Reduced unplanned downtime by 35%",
      "Strengthened planning-to-execution flow",
    ],
    cover: "/media/Lean-Transformation-ee5c9aae.jpeg",
    detail: [
      "## The challenge",
      "An energy sector organisation was experiencing chronic maintenance planning failures. Planned maintenance adherence sat at 68 per cent — meaning nearly a third of scheduled maintenance activities were being deferred, rescheduled, or missed. The consequences were predictable: increasing unplanned downtime, reactive work consuming ever more resource, and a vicious cycle where poor planning led to more breakdowns, which led to more reactive work, which further undermined the planning process.",
      "The planning team was working hard, but the planning cycle itself was flawed. Schedules were overloaded, work prioritisation was unclear, spare parts availability was unreliable, and there was no effective escalation mechanism when planned work was blocked.",
      "## Our approach",
      "We began by mapping the planning-to-execution value stream: how maintenance work was identified, prioritised, scheduled, resourced, executed, and closed. The map revealed several critical gaps: a weekly planning cycle that was too infrequent for the volume and complexity of work, no visual mechanism for tracking work status between planning and execution, spare parts availability checks happening too late in the cycle, and no structured daily review of plan execution and emerging issues.",
      "Working with the planning, maintenance, and operations teams, we redesigned the planning cycle to a daily planning-execution rhythm. We introduced a visual management system that tracked every planned job from scheduling through to completion, including parts readiness, resource allocation, and access requirements. We established a daily stand-up meeting that brought planners, supervisors, and operations together to review the day's plan, identify blockers, and agree on priorities.",
      "We also coached maintenance supervisors in daily management techniques — how to run effective team briefs, how to manage short-interval control of work progress, and how to escalate issues before they derailed the day's plan.",
      "## The results",
      "Planned maintenance adherence improved from 68 per cent to 89 per cent within sixteen weeks. Unplanned downtime reduced by 35 per cent as the improved maintenance regime prevented breakdowns that had previously been accepted as normal. The daily planning rhythm and visual management system gave the team shared visibility and a common operating picture that had not existed before.",
      "The most valuable outcome was the cultural shift: the maintenance team moved from a reactive to a proactive operating mode. Problems were anticipated and addressed before they disrupted the plan, rather than after.",
    ],
    relatedServices: [
      { label: "Lean Transformation", href: "/lean-transformation-consulting-uk" },
      { label: "Operational Excellence Consulting", href: "/operational-excellence-consulting-uk" },
      { label: "Energy & Utilities", href: "/industries/energy-utilities" },
    ],
    seoTitle: "Energy Maintenance Planning Improvement Case Study | Tacklers",
    seoDescription:
      "How we improved maintenance plan adherence from 68% to 89% and reduced unplanned downtime by 35%. Read the energy sector case study.",
    keywords: [
      "maintenance planning improvement",
      "energy sector lean",
      "planned maintenance adherence",
      "lean maintenance case study",
    ],
  },
  {
    slug: "public-sector-service-delivery-improvement",
    title: "Public Sector Service Delivery Improvement",
    sector: "Public Sector",
    summary:
      "Reduced case processing backlog by 55% and improved end-to-end processing time by 3 days through workflow analysis, bottleneck resolution, and team capability building.",
    outcomes: [
      "55% backlog reduction",
      "3-day processing time improvement",
      "Capability embedded in team routines",
    ],
    cover: "/media/Productivity-Improvement-1d0b843c.jpeg",
    detail: [
      "## The challenge",
      "A public sector organisation was struggling with a growing case processing backlog. End-to-end processing times had extended well beyond target, with cases queuing at multiple points in the workflow. The team was working at capacity, yet the backlog continued to grow. Previous attempts to address the problem had focused on overtime and temporary staffing, providing short-term relief without addressing the underlying causes.",
      "The organisation needed a sustainable solution that would reduce the backlog, improve processing times, and prevent the backlog from rebuilding — all without additional permanent resource.",
      "## Our approach",
      "We began by mapping the case processing workflow end to end, following cases from receipt through assessment, decision, notification, and closure. The value stream map identified three primary sources of waste: cases waiting in queues between process steps (representing approximately 70 per cent of total processing time), duplication of data entry across multiple systems, and rework caused by incomplete initial submissions that were not caught until late in the process.",
      "We co-designed improvements with the team. A triage step at the front of the process identified incomplete submissions early, reducing downstream rework by 40 per cent. Batch sizes were reduced so that cases moved through the workflow in smaller, more frequent batches rather than accumulating. Visual management boards made queue sizes and processing rates visible to the team, enabling self-regulation and highlighting bottlenecks as they developed.",
      "We also invested in building the team's problem-solving capability. Team leaders were trained in structured problem solving and daily management, so they could identify emerging issues and resolve them without escalation or external support.",
      "## The results",
      "Within ten weeks, the backlog reduced by 55 per cent. End-to-end processing time improved by 3 days on average. Early triage reduced rework rates significantly, freeing capacity that had previously been consumed by correcting errors. The visual management system and daily team meetings gave the team the tools to manage their own performance proactively.",
      "The improvement was achieved without additional headcount. The capacity freed by removing waste was more than sufficient to clear the backlog and maintain target processing times. More importantly, the team now has the capability and routines to sustain the improvement and respond to demand fluctuations without reverting to reactive firefighting.",
    ],
    relatedServices: [
      { label: "Continuous Improvement Consulting", href: "/continuous-improvement-consulting-uk" },
      { label: "Lean Training UK", href: "/lean-training-uk" },
      { label: "Public Sector", href: "/industries/public-sector" },
    ],
    seoTitle: "Public Sector Service Delivery Case Study | Tacklers",
    seoDescription:
      "How we reduced a case processing backlog by 55% and improved processing time by 3 days in a public sector organisation. Read the case study.",
    keywords: [
      "public sector lean case study",
      "case processing improvement",
      "lean public sector uk",
      "service delivery improvement",
    ],
  },
  {
    slug: "it-services-incident-resolution",
    title: "IT Services Incident Resolution",
    sector: "IT Services",
    summary:
      "Improved first-time resolution rate from 54% to 73% and reduced average resolution time by 28% through handoff redesign and tiered daily management implementation.",
    outcomes: [
      "First-time resolution: 54% → 73%",
      "28% faster average resolution",
      "Reduced escalation volumes",
    ],
    cover: "/media/Lean-Transformation-ee5c9aae.jpeg",
    detail: [
      "## The challenge",
      "An IT services organisation was underperforming on two critical metrics: first-time resolution rate (54 per cent, against a target of 70 per cent) and average incident resolution time. Customers were experiencing repeated escalations, inconsistent communication, and prolonged resolution cycles. The service desk team was working hard but was caught in a cycle of reactive firefighting, with insufficient time or tools to address upstream root causes.",
      "Management had attempted process documentation and additional training without significant improvement. The issue was systemic — rooted in how work flowed between teams — rather than a skills or effort problem.",
      "## Our approach",
      "We spent time at Gemba — in this case, sitting with the service desk and second-line support teams, observing how incidents flowed from receipt through triage, assignment, investigation, and resolution. The primary finding was that the handoff between first and second line was the critical failure point. Insufficient information was captured at first line, leading to repeated return-and-rework cycles. Escalation criteria were unclear, resulting in tickets being bounced between teams. And there was no visual mechanism for tracking escalated tickets, meaning items disappeared into queues where they could sit for days without attention.",
      "We redesigned the handoff process with input from both teams, creating an escalation template that ensured all required information was captured before handoff. We implemented a visual escalation board that made the status of every escalated ticket visible to both teams. And we established a daily management tiered meeting structure: a 15-minute service desk huddle each morning reviewing the day's priorities, and a weekly cross-team review addressing systemic issues and repeat incident patterns.",
      "We also worked with team leaders on coaching skills — helping them shift from managing tickets to managing the flow of work and developing their team's diagnostic capability.",
      "## The results",
      "First-time resolution improved from 54 per cent to 73 per cent within eight weeks. Average resolution time reduced by 28 per cent, driven primarily by the elimination of handoff rework and the improved visibility provided by the escalation board. Escalation volumes also reduced, as better first-line resolution meant fewer tickets needed second-line involvement.",
      "The daily management routines gave both teams a structured operating rhythm and the visibility to manage work proactively rather than reactively. Team leader coaching ensured these routines were sustained beyond the initial implementation period.",
    ],
    relatedServices: [
      { label: "Operational Excellence Consulting", href: "/operational-excellence-consulting-uk" },
      { label: "Gemba Consulting", href: "/gemba-consulting" },
      { label: "IT & Technology Services", href: "/industries/it-technology-services" },
    ],
    seoTitle: "IT Incident Resolution Improvement Case Study | Tacklers",
    seoDescription:
      "How we improved first-time resolution from 54% to 73% and reduced resolution time by 28% through handoff redesign and daily management.",
    keywords: [
      "IT service desk improvement",
      "incident resolution case study",
      "lean IT services",
      "first-time resolution improvement",
    ],
  },
];

/** Look up a single case study by its URL slug */
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

/** Return all case study slugs for static generation */
export function getAllCaseStudySlugs(): string[] {
  return caseStudies.map((cs) => cs.slug);
}

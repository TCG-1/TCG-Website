export type TrainingTone = "good" | "warning" | "risk" | "neutral";

export type TrainingMetric = {
  detail: string;
  label: string;
  tone?: TrainingTone;
  value: string;
};

export type TrainingWorkflowStep = {
  description: string;
  label: string;
};

export type SessionRecord = {
  cohort: string;
  facilitator: string;
  format: string;
  status: string;
  time: string;
  title: string;
};

export type ModuleRecord = {
  duration: string;
  outcomes: string[];
  phase: string;
  status: string;
  title: string;
};

export type AssessmentRecord = {
  cohort: string;
  due: string;
  notes: string;
  status: string;
  title: string;
};

export type ResourceRecord = {
  audience: string;
  format: string;
  module: string;
  title: string;
};

export type ProgressRecord = {
  label: string;
  note: string;
  value: string;
};

export const trainingBlueprint = {
  clientGaps: [
    "The dashboard shows generic portal widgets but does not guide a learner through upcoming sessions, module preparation, exams, or evidence of progress.",
    "The current resource area behaves like a document dump rather than a module-based learning library with prework, worksheets, and post-session packs.",
    "There is no clear learner view of syllabus coverage, pass criteria, feedback, attendance, or what must happen next to complete the programme.",
  ],
  adminGaps: [
    "The admin area is organized around website operations, leads, and portal utilities, not the day-to-day work of running cohorts, scheduling sessions, marking assessments, and protecting learner progress.",
    "There is no single operational view for at-risk learners, overdue grading, attendance gaps, or upcoming session readiness.",
    "Resource publishing, syllabus control, and assessment release are not connected into one training delivery workflow.",
  ],
  missingScope: [
    "Cohort setup with sponsor, learner roster, pathway, trainer assignment, and delivery cadence.",
    "Session operations with upcoming calendar, attendance capture, prework readiness, facilitator notes, and post-session actions.",
    "Syllabus control with modules, outcomes, exercises, required evidence, and completion rules.",
    "Assessment operations with quiz windows, practical assignments, grading queues, pass thresholds, and feedback release.",
    "Resource governance with learner packs, facilitator packs, revision guides, templates, and version control.",
    "Progress intelligence with attendance, completion, exam performance, confidence, and certification readiness.",
    "Learner experience with what is next, what is overdue, what has been passed, and what support is available.",
  ],
  workflows: {
    admin: [
      {
        description: "Set up programme pathway, cohort dates, facilitators, learner roster, and success criteria before delivery starts.",
        label: "Design",
      },
      {
        description: "Publish syllabus, release prework, schedule live sessions, and confirm rooms, virtual links, and materials.",
        label: "Prepare",
      },
      {
        description: "Run sessions, capture attendance, record actions, and publish follow-up packs while the learning is still fresh.",
        label: "Deliver",
      },
      {
        description: "Release exams and practical assessments, mark submissions, and return feedback with clear next actions.",
        label: "Assess",
      },
      {
        description: "Track progress, flag at-risk learners, coach sponsors, and move qualified learners toward certification.",
        label: "Sustain",
      },
    ] satisfies TrainingWorkflowStep[],
    client: [
      {
        description: "See your next live session, prework, and expected outcomes as soon as you enter the portal.",
        label: "Know what is next",
      },
      {
        description: "Follow the syllabus module by module with a clear view of what has been completed and what is still ahead.",
        label: "Follow the pathway",
      },
      {
        description: "Access the right workbook, template, recording, or revision guide without digging through unrelated files.",
        label: "Learn from the right materials",
      },
      {
        description: "Complete quizzes and practical tasks with clear due dates, pass criteria, and feedback once marked.",
        label: "Prove capability",
      },
      {
        description: "Track attendance, confidence, exam progress, and certification readiness in one place.",
        label: "See progress clearly",
      },
    ] satisfies TrainingWorkflowStep[],
  },
} as const;

export const clientTrainingData = {
  assessments: [
    {
      cohort: "Lean Fundamentals Cohort A",
      due: "Due 18 April • 17:00",
      notes: "20-question quiz covering problem framing, waste identification, and current-state mapping.",
      status: "Ready to take",
      title: "Module 3 Knowledge Check",
    },
    {
      cohort: "Lean Fundamentals Cohort A",
      due: "Practical review on 24 April",
      notes: "Submit a completed waste walk observation sheet from your area with one improvement proposal.",
      status: "Action required",
      title: "Gemba Observation Assignment",
    },
    {
      cohort: "Lean Fundamentals Cohort A",
      due: "Marked 2 April",
      notes: "Passed with strong understanding of the Lean principles foundation and people-first improvement.",
      status: "Passed",
      title: "Lean Principles Entry Quiz",
    },
  ] satisfies AssessmentRecord[],
  intro: {
    description:
      "This workspace is now organized around the actual learning journey: upcoming sessions, module progress, assessments, learning resources, and the evidence needed to complete the programme with confidence.",
    eyebrow: "Lean Training Journey",
    title: "Everything your team needs to prepare, learn, apply, and progress.",
  },
  metrics: [
    {
      detail: "Next session in 4 days with prework released.",
      label: "Upcoming sessions",
      tone: "good",
      value: "3",
    },
    {
      detail: "Four of six core modules completed.",
      label: "Modules completed",
      tone: "good",
      value: "67%",
    },
    {
      detail: "Average across released quizzes and practical checks.",
      label: "Assessment average",
      tone: "warning",
      value: "84%",
    },
    {
      detail: "Attendance remains strong across the active cohort.",
      label: "Attendance",
      tone: "good",
      value: "96%",
    },
  ] satisfies TrainingMetric[],
  modules: [
    {
      duration: "Half day workshop + team exercise",
      outcomes: [
        "Understand the eight wastes in the context of your own process",
        "Differentiate activity from value",
        "Capture improvement ideas without threatening headcount",
      ],
      phase: "Foundation",
      status: "Completed",
      title: "Lean Principles & Waste",
    },
    {
      duration: "Full day practical session",
      outcomes: [
        "Map current state across people, information, and material flow",
        "Identify delays, rework loops, and handoff issues",
        "Build a future-state improvement hypothesis",
      ],
      phase: "Analysis",
      status: "Completed",
      title: "Value Stream Mapping",
    },
    {
      duration: "Half day workshop + field application",
      outcomes: [
        "Set clear workplace conditions with 5S and visual standards",
        "Use abnormality triggers to protect flow",
        "Link visual management to leadership routines",
      ],
      phase: "Control",
      status: "In progress",
      title: "Visual Management & 5S",
    },
    {
      duration: "Half day workshop + coaching follow-up",
      outcomes: [
        "Create reliable task sequence and takt-based standard work",
        "Capture key quality points and escalation rules",
        "Coach teams to improve standards without drift",
      ],
      phase: "Stability",
      status: "Next up",
      title: "Standard Work",
    },
    {
      duration: "Full day simulation and live problem review",
      outcomes: [
        "Run structured problem solving from issue definition to countermeasure",
        "Separate symptoms from root causes",
        "Use evidence, not opinion, to prioritise action",
      ],
      phase: "Capability",
      status: "Scheduled",
      title: "Structured Problem Solving",
    },
  ] satisfies ModuleRecord[],
  nextSession: {
    checklist: [
      "Review the Visual Management workbook and mark two examples from your area.",
      "Bring one current SOP or checklist that would benefit from clearer standard work.",
      "Ask your line leader which daily meeting issues should be made visible on the shopfloor.",
    ],
    facilitator: "Audrey Nyamande-Trigg",
    format: "On-site workshop",
    time: "Tuesday 16 April • 09:00 to 12:30",
    title: "Module 4: Standard Work in Daily Practice",
    venue: "Client site • Operations training room",
  },
  progress: [
    {
      label: "Confidence to lead a waste walk",
      note: "Up from baseline after Modules 1 to 3.",
      value: "78%",
    },
    {
      label: "Practical assignments submitted",
      note: "Five of six learners have completed the latest field exercise.",
      value: "83%",
    },
    {
      label: "Certification readiness",
      note: "On track if attendance and practical evidence stay above target.",
      value: "Green",
    },
  ] satisfies ProgressRecord[],
  resources: [
    {
      audience: "Learners",
      format: "PDF workbook",
      module: "Module 4",
      title: "Standard Work Participant Pack",
    },
    {
      audience: "Team leaders",
      format: "XLSX template",
      module: "Module 3",
      title: "5S Audit & Red Tag Tracker",
    },
    {
      audience: "Sponsors",
      format: "Slide deck",
      module: "Programme-wide",
      title: "Monthly Sponsor Review Pack",
    },
    {
      audience: "Learners",
      format: "Revision guide",
      module: "Module 5",
      title: "Structured Problem Solving Revision Notes",
    },
  ] satisfies ResourceRecord[],
  sessions: [
    {
      cohort: "Lean Fundamentals Cohort A",
      facilitator: "Audrey Nyamande-Trigg",
      format: "On-site",
      status: "Confirmed",
      time: "16 Apr • 09:00",
      title: "Standard Work in Daily Practice",
    },
    {
      cohort: "Lean Fundamentals Cohort A",
      facilitator: "Marcus Thorne",
      format: "Virtual coaching",
      status: "Prep required",
      time: "18 Apr • 14:00",
      title: "Action Review & Leadership Coaching",
    },
    {
      cohort: "Lean Fundamentals Cohort A",
      facilitator: "Audrey Nyamande-Trigg",
      format: "On-site",
      status: "Scheduled",
      time: "24 Apr • 09:30",
      title: "Structured Problem Solving Simulation",
    },
  ] satisfies SessionRecord[],
} as const;

export const adminTrainingData = {
  assessments: [
    {
      cohort: "Cohort A",
      due: "16 submissions due this week",
      notes: "Release feedback once the workbook evidence and quiz scores are both complete.",
      status: "Marking queue",
      title: "Module 3 Knowledge Check",
    },
    {
      cohort: "Cohort B",
      due: "Draft exam window opens 22 April",
      notes: "Needs facilitator sign-off before learner release.",
      status: "Needs release",
      title: "Standard Work Practical Assessment",
    },
    {
      cohort: "Cohort A",
      due: "2 learners below pass threshold",
      notes: "Coach and re-sit support should be scheduled before the next module.",
      status: "At risk",
      title: "Problem Solving Re-sit Plan",
    },
  ] satisfies AssessmentRecord[],
  cohorts: [
    {
      label: "Lean Fundamentals Cohort A",
      sponsor: "Aerospace MAIT",
      nextMilestone: "Module 4 workshop on 16 April",
      readiness: "Prework 92% complete",
      status: "Delivering",
    },
    {
      label: "Lean Leader Cohort B",
      sponsor: "Healthcare Logistics",
      nextMilestone: "Sponsor review on 19 April",
      readiness: "Exam bank needs release",
      status: "Assessing",
    },
    {
      label: "Continuous Improvement Bootcamp",
      sponsor: "Energy Operations",
      nextMilestone: "Roster confirmation due this week",
      readiness: "Trainer assignment pending",
      status: "Planning",
    },
  ],
  intro: {
    description:
      "The admin portal should run the entire training operation: cohort setup, session delivery, syllabus control, assessment release, learner progress, and the resources that support every stage.",
    eyebrow: "Training Operations",
    title: "Run Lean training like a delivery system, not a collection of disconnected tabs.",
  },
  metrics: [
    {
      detail: "Across active training pathways and sponsor groups.",
      label: "Active cohorts",
      tone: "good",
      value: "5",
    },
    {
      detail: "Live workshops, coaching reviews, and exam windows.",
      label: "Sessions in next 14 days",
      tone: "warning",
      value: "18",
    },
    {
      detail: "Knowledge checks and practical assignments awaiting review.",
      label: "Assessments to grade",
      tone: "risk",
      value: "27",
    },
    {
      detail: "Low attendance, overdue work, or confidence dips need intervention.",
      label: "Learners at risk",
      tone: "risk",
      value: "6",
    },
  ] satisfies TrainingMetric[],
  progress: [
    {
      label: "Attendance above target",
      note: "Four of five cohorts remain above the 90% threshold.",
      value: "80%",
    },
    {
      label: "Assessments marked within SLA",
      note: "Target is 3 working days from submission close.",
      value: "74%",
    },
    {
      label: "Certification-ready learners",
      note: "Learners who have completed modules, evidence, and pass criteria.",
      value: "14",
    },
  ] satisfies ProgressRecord[],
  resources: [
    {
      audience: "Facilitators",
      format: "Facilitator guide",
      module: "Module 4",
      title: "Standard Work delivery pack",
    },
    {
      audience: "Learners",
      format: "Workbook + template",
      module: "Module 3",
      title: "Visual management participant set",
    },
    {
      audience: "Sponsors",
      format: "Quarterly review deck",
      module: "Programme-wide",
      title: "Sponsor outcomes and impact pack",
    },
    {
      audience: "Admins",
      format: "Version checklist",
      module: "Assessment operations",
      title: "Exam release governance sheet",
    },
  ] satisfies ResourceRecord[],
  sessions: [
    {
      cohort: "Lean Fundamentals Cohort A",
      facilitator: "Audrey Nyamande-Trigg",
      format: "On-site",
      status: "Materials ready",
      time: "16 Apr • 09:00",
      title: "Module 4 workshop",
    },
    {
      cohort: "Lean Leader Cohort B",
      facilitator: "Marcus Thorne",
      format: "Virtual",
      status: "Roster update needed",
      time: "18 Apr • 14:00",
      title: "Leadership coaching clinic",
    },
    {
      cohort: "Continuous Improvement Bootcamp",
      facilitator: "Unassigned",
      format: "On-site",
      status: "Facilitator gap",
      time: "24 Apr • 09:30",
      title: "Bootcamp launch session",
    },
  ] satisfies SessionRecord[],
  syllabus: [
    {
      duration: "1 half day",
      outcomes: [
        "Frame Lean as capability building rather than headcount reduction",
        "Set behavioural expectations for observation and problem solving",
      ],
      phase: "Onboarding",
      status: "Published",
      title: "Programme Kick-off",
    },
    {
      duration: "1 full day",
      outcomes: [
        "Observe the real process at the place of work",
        "Capture waste and blockers in a consistent format",
      ],
      phase: "Foundation",
      status: "Published",
      title: "Waste & Value Observation",
    },
    {
      duration: "1 full day",
      outcomes: [
        "Translate current-state evidence into a practical future state",
        "Prepare the line for implementation experiments",
      ],
      phase: "Analysis",
      status: "Needs review",
      title: "Value Stream Mapping",
    },
    {
      duration: "1 half day",
      outcomes: [
        "Create visible standards and escalation triggers",
        "Connect standards to leader routines",
      ],
      phase: "Control",
      status: "Live",
      title: "Visual Management & Standard Work",
    },
  ] satisfies ModuleRecord[],
  workflowCards: [
    {
      detail: "Assign sponsors, facilitators, learners, and success rules before day one.",
      label: "Programme design",
    },
    {
      detail: "Sequence sessions, publish prework, and confirm readiness for each cohort.",
      label: "Session operations",
    },
    {
      detail: "Release exams, mark evidence, and close capability gaps with feedback.",
      label: "Assessment control",
    },
    {
      detail: "Track attendance, completion, confidence, and certification to sustain results.",
      label: "Progress management",
    },
  ],
} as const;

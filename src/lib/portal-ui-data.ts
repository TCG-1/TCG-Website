export const adminNotifications = [
  {
    id: "NT-101",
    title: "Client hub content needs review",
    body: "Healthcare Logistics has a flagged KPI card that should be reviewed before the next programme meeting.",
    timeLabel: "10 minutes ago",
    priority: "High",
    category: "Client Hub",
    unread: true,
  },
  {
    id: "NT-102",
    title: "New career application received",
    body: "A new applicant submitted a CV for Lean Transformation Consultant and is waiting for triage.",
    timeLabel: "32 minutes ago",
    priority: "Normal",
    category: "Hiring",
    unread: true,
  },
  {
    id: "NT-103",
    title: "Support ticket moved to waiting",
    body: "Portal access request from Aerospace MAIT is waiting on client confirmation.",
    timeLabel: "2 hours ago",
    priority: "Normal",
    category: "Support",
    unread: false,
  },
];

export const adminDocuments = [
  {
    id: "DOC-201",
    title: "Q2 Programme Review Deck",
    client: "Aerospace MAIT",
    category: "Report",
    updatedAt: "Updated today",
    access: "Shared",
  },
  {
    id: "DOC-202",
    title: "Lean Training Workbook",
    client: "Healthcare Logistics",
    category: "Training",
    updatedAt: "Updated yesterday",
    access: "Client only",
  },
  {
    id: "DOC-203",
    title: "Operational Assessment Summary",
    client: "Energy Grid Optimisation",
    category: "Assessment",
    updatedAt: "Updated 3 days ago",
    access: "Admin only",
  },
];

export const adminSupportTickets = [
  {
    id: "SUP-301",
    subject: "Portal access for new sponsor",
    client: "Aerospace MAIT",
    status: "Open",
    priority: "High",
    owner: "Tacklers Admin",
  },
  {
    id: "SUP-302",
    subject: "Document access request",
    client: "Healthcare Logistics",
    status: "Waiting",
    priority: "Normal",
    owner: "Audrey Nyamande",
  },
  {
    id: "SUP-303",
    subject: "Calendar invite mismatch",
    client: "Energy Grid Optimisation",
    status: "Resolved",
    priority: "Low",
    owner: "Marcus Thorne",
  },
];

export const adminActivityFeed = [
  {
    id: "ACT-401",
    title: "Programme stage updated",
    description: "Healthcare Logistics moved from Assess to Collaborate.",
    timeLabel: "Today, 09:10",
  },
  {
    id: "ACT-402",
    title: "Document uploaded",
    description: "Q2 Programme Review Deck was uploaded to Aerospace MAIT collection.",
    timeLabel: "Today, 08:20",
  },
  {
    id: "ACT-403",
    title: "Lead qualified",
    description: "Emma Clark was marked as qualified and ready for follow-up.",
    timeLabel: "Yesterday, 16:45",
  },
];

export const adminProfile = {
  name: "Tacklers Admin",
  role: "Platform Operations Lead",
  email: "hello@tacklersconsulting.com",
  phone: "+44 7932 105847",
  location: "UK-wide on-site delivery",
  bio:
    "Responsible for admin operations, portal content governance, client workspace quality, and security workflows across the Tacklers platform.",
  focusAreas: [
    "Client portal operations",
    "Content governance and QA",
    "Hiring and applications workflow",
    "Security and access management",
  ],
  activeSessions: [
    "Current browser session • London • Chrome",
    "Previous session • Manchester • Safari",
  ],
};

export const adminSettings = {
  notifications: [
    {
      label: "Critical alerts",
      description: "Send real-time notifications for security, hiring, and client workspace issues.",
      enabled: true,
    },
    {
      label: "Daily operations digest",
      description: "Email a daily summary of leads, support tickets, and portal changes.",
      enabled: true,
    },
    {
      label: "Client content reminders",
      description: "Prompt admins to review KPI and roadmap changes before scheduled sessions.",
      enabled: false,
    },
  ],
  security: [
    { label: "Admin auth mode", value: "Secure server session" },
    { label: "Password rotation", value: "Every 90 days" },
    { label: "Session timeout", value: "8 hours of inactivity" },
  ],
  automations: [
    { label: "Lead triage workflow", status: "Enabled" },
    { label: "Application intake routing", status: "Enabled" },
    { label: "Client hub publishing guardrails", status: "Review" },
  ],
};

export const adminDocumentCollections = [
  {
    name: "Programme decks",
    count: "18 files",
    description: "Quarterly reviews, executive summaries, and sponsor packs.",
  },
  {
    name: "Workshop resources",
    count: "12 files",
    description: "Training packs, templates, and facilitator notes.",
  },
  {
    name: "Assessment outputs",
    count: "9 files",
    description: "On-site assessment summaries, opportunity logs, and milestone plans.",
  },
];

export const adminEscalationRules = [
  {
    title: "High-priority support tickets",
    description: "Escalate to operations lead within 2 working hours.",
  },
  {
    title: "Client hub publishing changes",
    description: "Require same-day content review before external visibility.",
  },
  {
    title: "Application attachment failures",
    description: "Flag recruitment workflow and notify admin immediately.",
  },
];

export const clientNotifications = [
  {
    id: "CL-NT-1",
    title: "Quarterly review confirmed",
    body: "Your next quarterly review session has been scheduled and added to the mentoring calendar.",
    timeLabel: "1 hour ago",
    type: "Schedule",
    unread: true,
  },
  {
    id: "CL-NT-2",
    title: "New resource uploaded",
    body: "A refreshed Value Stream Mapping template is now available in your knowledge library.",
    timeLabel: "Yesterday",
    type: "Library",
    unread: true,
  },
  {
    id: "CL-NT-3",
    title: "Insight recommendation updated",
    body: "The optimisation forecast has been refreshed with the latest throughput assumptions.",
    timeLabel: "2 days ago",
    type: "Insight",
    unread: false,
  },
];

export const clientDocuments = [
  {
    id: "CL-DOC-1",
    title: "Programme Review Summary",
    type: "Report",
    updatedAt: "Updated today",
    owner: "Tacklers Consulting",
    access: "Shared",
  },
  {
    id: "CL-DOC-2",
    title: "Lean Fundamentals Workbook",
    type: "Training",
    updatedAt: "Updated 2 days ago",
    owner: "Audrey Nyamande-Trigg",
    access: "Client team",
  },
  {
    id: "CL-DOC-3",
    title: "Assessment Action Tracker",
    type: "Working file",
    updatedAt: "Updated this week",
    owner: "Joint workspace",
    access: "Collaborative",
  },
];

export const clientSupportTickets = [
  {
    id: "CL-SUP-1",
    subject: "Need access for a new stakeholder",
    status: "Open",
    updatedAt: "Updated today",
    owner: "Tacklers Support",
  },
  {
    id: "CL-SUP-2",
    subject: "Question about workshop follow-up pack",
    status: "Waiting",
    updatedAt: "Updated yesterday",
    owner: "Programme team",
  },
];

export const clientProfile = {
  name: "Audrey",
  role: "Programme Sponsor",
  company: "Aerospace MAIT",
  email: "audrey@example.com",
  phone: "+44 20 0000 0000",
  baseLocation: "UK operations",
  learningGoals: [
    "Improve visibility of value-stream performance",
    "Strengthen daily management routines",
    "Build confidence across front-line leaders",
  ],
};

export const clientDocumentCollections = [
  {
    name: "Programme governance",
    count: "6 files",
    description: "Review decks, milestone plans, and steering summaries.",
  },
  {
    name: "Training resources",
    count: "11 files",
    description: "Lean learning packs, worksheets, and facilitator handouts.",
  },
  {
    name: "Working documents",
    count: "8 files",
    description: "Action trackers, live opportunity logs, and collaborative templates.",
  },
];

export const clientHelpResources = [
  {
    title: "How to request a new on-site session",
    description: "Use the support form or discovery route to coordinate the next workshop.",
  },
  {
    title: "How document access works",
    description: "Shared files appear in your portal when your programme team publishes them.",
  },
  {
    title: "How recommendations are updated",
    description: "Insights are refreshed after reviews, workshops, and progress checkpoints.",
  },
];

export const clientSettings = {
  notifications: [
    { label: "In-app notifications", description: "Show live programme updates in the portal.", enabled: true },
    { label: "Email alerts", description: "Receive important schedule and document updates.", enabled: true },
    { label: "Weekly summary", description: "Send a weekly digest of activity and milestones.", enabled: false },
  ],
  workspace: [
    { label: "Default view", value: "Programme Overview" },
    { label: "Timezone", value: "Europe/London" },
    { label: "Language", value: "English (UK)" },
  ],
};

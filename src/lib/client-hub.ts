import { createSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

export const DASHBOARD_ICON_NAMES = [
  "dashboard",
  "calendar",
  "folder",
  "chart",
  "help",
  "logout",
  "spark",
  "search",
  "bell",
  "settings",
  "recycle",
  "bolt",
  "tree",
  "group",
  "check",
  "play",
  "download",
  "book",
  "arrow",
  "location",
  "video",
  "insight",
  "architecture",
  "user",
  "shield",
  "document",
  "message",
  "clock",
] as const;

export type DashboardIconName = (typeof DASHBOARD_ICON_NAMES)[number];
export type ClientHubTone = "success" | "accent" | "neutral";
export type ClientHubStageState = "complete" | "active" | "upcoming";

export type ClientHubNavItem = {
  label: string;
  icon: DashboardIconName;
  section: string;
};

export type ClientHubLink = {
  label: string;
  href: string;
};

export type ClientHubMetric = {
  value: string;
  label: string;
  icon: DashboardIconName;
  badgeText?: string;
  badgeTone?: ClientHubTone;
};

export type ClientHubStage = {
  label: string;
  state: ClientHubStageState;
};

export type ClientHubCollaborator = {
  name: string;
  imageUrl: string;
  alt: string;
};

export type ClientHubResource = {
  title: string;
  meta: string;
  icon: DashboardIconName;
  href: string;
};

export type ClientHubSession = {
  day: string;
  month: string;
  title: string;
  time: string;
  mode: string;
  location: string;
  highlighted: boolean;
};

export type ClientHubContent = {
  meta: {
    pageTitle: string;
    brandName: string;
    brandSubtitle: string;
    sidebarTitle: string;
    sidebarSubtitle: string;
    greetingLabel: string;
    greetingName: string;
    greetingBody: string;
    searchPlaceholder: string;
    ctaLabel: string;
    footerCopy: string;
  };
  navigation: {
    primary: ClientHubNavItem[];
    secondary: ClientHubNavItem[];
    footerLinks: ClientHubLink[];
  };
  metrics: ClientHubMetric[];
  programme: {
    title: string;
    subtitle: string;
    completionLabel: string;
    completionPercentage: number;
    ctaLabel: string;
    stages: ClientHubStage[];
    collaborators: ClientHubCollaborator[];
    extraCollaboratorLabel: string;
  };
  library: {
    heading: string;
    resources: ClientHubResource[];
    featured: {
      badge: string;
      title: string;
      imageUrl: string;
      imageAlt: string;
      href: string;
    };
  };
  calendar: {
    heading: string;
    sessions: ClientHubSession[];
    ctaLabel: string;
  };
  insight: {
    title: string;
    body: string;
    ctaLabel: string;
  };
  profile: {
    avatarUrl: string;
    avatarAlt: string;
  };
};

const DEFAULT_CLIENT_HUB_CONTENT: ClientHubContent = {
  meta: {
    pageTitle: "Lean Training Hub | Tacklers Consulting",
    brandName: "Tacklers Training Hub",
    brandSubtitle: "Lean capability journey",
    sidebarTitle: "Lean Training Hub",
    sidebarSubtitle: "Learning workspace",
    greetingLabel: "Training overview",
    greetingName: "Audrey",
    greetingBody:
      "Your team can now track sessions, syllabus coverage, exams, learning packs, and progress from one training-focused workspace.",
    searchPlaceholder: "Search sessions, modules, and resources...",
    ctaLabel: "Ask for coaching support",
    footerCopy: "© 2026 Tacklers Consulting Group • Lean training delivery workspace",
  },
  navigation: {
    primary: [
      { label: "Programme Overview", icon: "dashboard", section: "programme-overview" },
      { label: "Mentoring Schedule", icon: "calendar", section: "mentoring-schedule" },
      { label: "Resource Library", icon: "folder", section: "resource-library" },
      { label: "Progress Tracking", icon: "chart", section: "progress-tracking" },
    ],
    secondary: [
      { label: "Help Centre", icon: "help", section: "help-centre" },
      { label: "Logout", icon: "logout", section: "top" },
    ],
    footerLinks: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Client Terms", href: "/terms-and-conditions" },
      { label: "Contact Support", href: "/support" },
    ],
  },
  metrics: [
    { value: "32%", label: "Waste Reduced", icon: "recycle", badgeText: "On track", badgeTone: "success" },
    { value: "+18%", label: "Efficiency Gain", icon: "bolt", badgeText: "Optimised", badgeTone: "accent" },
    { value: "3", label: "Active Value Streams", icon: "tree" },
    { value: "156", label: "Teams Trained", icon: "group" },
  ],
  programme: {
    title: "Lean Fundamentals",
    subtitle: "Industrial Operational Excellence Programme",
    completionLabel: "Completion",
    completionPercentage: 74,
    ctaLabel: "View Full Roadmap",
    stages: [
      { label: "Assess", state: "complete" },
      { label: "Collaborate", state: "complete" },
      { label: "Upskill", state: "active" },
      { label: "Sustain", state: "upcoming" },
    ],
    collaborators: [
      {
        name: "Audrey Nyamande-Trigg",
        imageUrl: "/media/Audrey-Nyamande-1-cd36ad87.jpeg",
        alt: "Audrey Nyamande-Trigg portrait",
      },
      {
        name: "Operations lead",
        imageUrl: "/media/audrey-and-arlandous-1-e1773762025172-1b5d8b67.jpeg",
        alt: "Tacklers consultants working together",
      },
    ],
    extraCollaboratorLabel: "+4",
  },
  library: {
    heading: "Knowledge Library",
    resources: [
      { title: "Download VSM Template", meta: "XLSX • 2.4 MB", icon: "download", href: "#" },
      { title: "Methodology Handbook", meta: "PDF • 18.2 MB", icon: "book", href: "#" },
    ],
    featured: {
      badge: "Featured Case Study",
      title: "Aerospace MAIT: Operational Efficiency in Small Sat Production",
      imageUrl: "/media/Lean-transformation-consulting-UK-consultant-working-with-team-at-Gemba-1-6dc05d89.jpeg",
      imageAlt: "Aerospace operational excellence case study",
      href: "/blog/lean-transformation-aerospace-mait",
    },
  },
  calendar: {
    heading: "Mentoring Calendar",
    ctaLabel: "Book New Session",
    sessions: [
      {
        day: "14",
        month: "Oct",
        title: "Gemba Walk: Floor 4",
        time: "09:00 AM",
        mode: "onsite",
        location: "onsite",
        highlighted: false,
      },
      {
        day: "16",
        month: "Oct",
        title: "Leadership Coaching",
        time: "Virtual",
        mode: "virtual",
        location: "virtual",
        highlighted: false,
      },
      {
        day: "22",
        month: "Oct",
        title: "Quarterly Review",
        time: "02:00 PM",
        mode: "onsite",
        location: "programme boardroom",
        highlighted: true,
      },
    ],
  },
  insight: {
    title: "Optimisation Forecast",
    body:
      "Based on current throughput, applying Smartsourcing to your supply chain could yield an additional 4% margin gain by Q4.",
    ctaLabel: "Review Recommendation",
  },
  profile: {
    avatarUrl: "/media/Audrey-Nyamande-1-cd36ad87.jpeg",
    avatarAlt: "Client profile avatar",
  },
};

const CLIENT_HUB_ROW_ID = "default";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function readNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readIconName(value: unknown, fallback: DashboardIconName): DashboardIconName {
  return typeof value === "string" && DASHBOARD_ICON_NAMES.includes(value as DashboardIconName)
    ? (value as DashboardIconName)
    : fallback;
}

function readTone(value: unknown, fallback: ClientHubTone | undefined): ClientHubTone | undefined {
  return value === "success" || value === "accent" || value === "neutral" ? value : fallback;
}

function readStageState(value: unknown, fallback: ClientHubStageState): ClientHubStageState {
  return value === "complete" || value === "active" || value === "upcoming" ? value : fallback;
}

function sanitizeNavItems(value: unknown, fallback: ClientHubNavItem[]) {
  if (!Array.isArray(value)) return fallback;

  return value.map((item, index) => {
    const safe = fallback[index] ?? fallback[fallback.length - 1];
    return {
      label: readString(isObject(item) ? item.label : undefined, safe.label),
      icon: readIconName(isObject(item) ? item.icon : undefined, safe.icon),
      section: readString(isObject(item) ? item.section : undefined, safe.section),
    };
  });
}

function sanitizeLinks(value: unknown, fallback: ClientHubLink[]) {
  if (!Array.isArray(value)) return fallback;

  return value.map((item, index) => {
    const safe = fallback[index] ?? fallback[fallback.length - 1];
    return {
      label: readString(isObject(item) ? item.label : undefined, safe.label),
      href: readString(isObject(item) ? item.href : undefined, safe.href),
    };
  });
}

function sanitizeMetrics(value: unknown, fallback: ClientHubMetric[]) {
  if (!Array.isArray(value)) return fallback;

  return value.map((item, index) => {
    const safe = fallback[index] ?? fallback[fallback.length - 1];
    return {
      value: readString(isObject(item) ? item.value : undefined, safe.value),
      label: readString(isObject(item) ? item.label : undefined, safe.label),
      icon: readIconName(isObject(item) ? item.icon : undefined, safe.icon),
      badgeText: readString(isObject(item) ? item.badgeText : undefined, safe.badgeText ?? ""),
      badgeTone: readTone(isObject(item) ? item.badgeTone : undefined, safe.badgeTone),
    };
  });
}

function sanitizeStages(value: unknown, fallback: ClientHubStage[]) {
  if (!Array.isArray(value)) return fallback;

  return value.map((item, index) => {
    const safe = fallback[index] ?? fallback[fallback.length - 1];
    return {
      label: readString(isObject(item) ? item.label : undefined, safe.label),
      state: readStageState(isObject(item) ? item.state : undefined, safe.state),
    };
  });
}

function sanitizeCollaborators(value: unknown, fallback: ClientHubCollaborator[]) {
  if (!Array.isArray(value)) return fallback;

  return value.map((item, index) => {
    const safe = fallback[index] ?? fallback[fallback.length - 1];
    return {
      name: readString(isObject(item) ? item.name : undefined, safe.name),
      imageUrl: readString(isObject(item) ? item.imageUrl : undefined, safe.imageUrl),
      alt: readString(isObject(item) ? item.alt : undefined, safe.alt),
    };
  });
}

function sanitizeResources(value: unknown, fallback: ClientHubResource[]) {
  if (!Array.isArray(value)) return fallback;

  return value.map((item, index) => {
    const safe = fallback[index] ?? fallback[fallback.length - 1];
    return {
      title: readString(isObject(item) ? item.title : undefined, safe.title),
      meta: readString(isObject(item) ? item.meta : undefined, safe.meta),
      icon: readIconName(isObject(item) ? item.icon : undefined, safe.icon),
      href: readString(isObject(item) ? item.href : undefined, safe.href),
    };
  });
}

function sanitizeSessions(value: unknown, fallback: ClientHubSession[]) {
  if (!Array.isArray(value)) return fallback;

  return value.map((item, index) => {
    const safe = fallback[index] ?? fallback[fallback.length - 1];
    return {
      day: readString(isObject(item) ? item.day : undefined, safe.day),
      month: readString(isObject(item) ? item.month : undefined, safe.month),
      title: readString(isObject(item) ? item.title : undefined, safe.title),
      time: readString(isObject(item) ? item.time : undefined, safe.time),
      mode: readString(isObject(item) ? item.mode : undefined, safe.mode),
      location: readString(isObject(item) ? item.location : undefined, safe.location),
      highlighted: isObject(item) && typeof item.highlighted === "boolean" ? item.highlighted : safe.highlighted,
    };
  });
}

export function getDefaultClientHubContent() {
  return structuredClone(DEFAULT_CLIENT_HUB_CONTENT);
}

export function sanitizeClientHubContent(value: unknown): ClientHubContent {
  if (!isObject(value)) {
    return getDefaultClientHubContent();
  }

  const fallback = getDefaultClientHubContent();
  const meta = isObject(value.meta) ? value.meta : {};
  const navigation = isObject(value.navigation) ? value.navigation : {};
  const programme = isObject(value.programme) ? value.programme : {};
  const library = isObject(value.library) ? value.library : {};
  const featured = isObject(library.featured) ? library.featured : {};
  const calendar = isObject(value.calendar) ? value.calendar : {};
  const insight = isObject(value.insight) ? value.insight : {};
  const profile = isObject(value.profile) ? value.profile : {};

  return {
    meta: {
      pageTitle: readString(meta.pageTitle, fallback.meta.pageTitle),
      brandName: readString(meta.brandName, fallback.meta.brandName),
      brandSubtitle: readString(meta.brandSubtitle, fallback.meta.brandSubtitle),
      sidebarTitle: readString(meta.sidebarTitle, fallback.meta.sidebarTitle),
      sidebarSubtitle: readString(meta.sidebarSubtitle, fallback.meta.sidebarSubtitle),
      greetingLabel: readString(meta.greetingLabel, fallback.meta.greetingLabel),
      greetingName: readString(meta.greetingName, fallback.meta.greetingName),
      greetingBody: readString(meta.greetingBody, fallback.meta.greetingBody),
      searchPlaceholder: readString(meta.searchPlaceholder, fallback.meta.searchPlaceholder),
      ctaLabel: readString(meta.ctaLabel, fallback.meta.ctaLabel),
      footerCopy: readString(meta.footerCopy, fallback.meta.footerCopy),
    },
    navigation: {
      primary: sanitizeNavItems(navigation.primary, fallback.navigation.primary),
      secondary: sanitizeNavItems(navigation.secondary, fallback.navigation.secondary),
      footerLinks: sanitizeLinks(navigation.footerLinks, fallback.navigation.footerLinks),
    },
    metrics: sanitizeMetrics(value.metrics, fallback.metrics),
    programme: {
      title: readString(programme.title, fallback.programme.title),
      subtitle: readString(programme.subtitle, fallback.programme.subtitle),
      completionLabel: readString(programme.completionLabel, fallback.programme.completionLabel),
      completionPercentage: readNumber(programme.completionPercentage, fallback.programme.completionPercentage),
      ctaLabel: readString(programme.ctaLabel, fallback.programme.ctaLabel),
      stages: sanitizeStages(programme.stages, fallback.programme.stages),
      collaborators: sanitizeCollaborators(programme.collaborators, fallback.programme.collaborators),
      extraCollaboratorLabel: readString(
        programme.extraCollaboratorLabel,
        fallback.programme.extraCollaboratorLabel,
      ),
    },
    library: {
      heading: readString(library.heading, fallback.library.heading),
      resources: sanitizeResources(library.resources, fallback.library.resources),
      featured: {
        badge: readString(featured.badge, fallback.library.featured.badge),
        title: readString(featured.title, fallback.library.featured.title),
        imageUrl: readString(featured.imageUrl, fallback.library.featured.imageUrl),
        imageAlt: readString(featured.imageAlt, fallback.library.featured.imageAlt),
        href: readString(featured.href, fallback.library.featured.href),
      },
    },
    calendar: {
      heading: readString(calendar.heading, fallback.calendar.heading),
      sessions: sanitizeSessions(calendar.sessions, fallback.calendar.sessions),
      ctaLabel: readString(calendar.ctaLabel, fallback.calendar.ctaLabel),
    },
    insight: {
      title: readString(insight.title, fallback.insight.title),
      body: readString(insight.body, fallback.insight.body),
      ctaLabel: readString(insight.ctaLabel, fallback.insight.ctaLabel),
    },
    profile: {
      avatarUrl: readString(profile.avatarUrl, fallback.profile.avatarUrl),
      avatarAlt: readString(profile.avatarAlt, fallback.profile.avatarAlt),
    },
  };
}

export async function getClientHubContent() {
  const fallback = getDefaultClientHubContent();

  if (!isSupabaseConfigured()) {
    return { configured: false, content: fallback };
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return { configured: false, content: fallback };
  }

  const { data, error } = await supabase
    .from("client_hub_content")
    .select("content")
    .eq("id", CLIENT_HUB_ROW_ID)
    .maybeSingle();

  if (error) {
    return { configured: true, content: fallback, error: error.message };
  }

  return {
    configured: true,
    content: sanitizeClientHubContent(data?.content),
  };
}

export async function saveClientHubContent(content: unknown) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const sanitized = sanitizeClientHubContent(content);
  const { error } = await supabase.from("client_hub_content").upsert(
    {
      id: CLIENT_HUB_ROW_ID,
      content: sanitized,
    },
    {
      onConflict: "id",
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  return sanitized;
}

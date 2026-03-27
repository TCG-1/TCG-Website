export const JOB_STATUSES = ["draft", "open", "closed"] as const;
export const APPLICATION_STATUSES = ["new", "reviewing", "shortlisted", "rejected"] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type CareerJob = {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  location_label: string | null;
  employment_type: string | null;
  experience_level: string | null;
  summary: string;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  status: JobStatus;
  created_at: string;
  updated_at: string;
};

export type CareerApplication = {
  id: string;
  job_id: string | null;
  job_title_snapshot: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  cover_note: string | null;
  resume_filename: string;
  resume_path: string;
  resume_content_type: string | null;
  status: ApplicationStatus;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CareerJobPayload = {
  title: string;
  department: string;
  locationLabel: string;
  employmentType: string;
  experienceLevel: string;
  summary: string;
  description: string;
  responsibilities: string;
  requirements: string;
  status: JobStatus;
};

export type CareerApplicationPayload = {
  jobId: string;
  jobTitleSnapshot: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
  coverNote: string;
};

export const TALENT_NETWORK_LABEL = "Talent Network";
export const DEFAULT_JOB_LOCATION = "On-site at client locations across the UK";
export const DEFAULT_EMPLOYMENT_TYPE = "Full-time";
export const MAX_RESUME_FILE_SIZE = 10 * 1024 * 1024;

export const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];
export const ACCEPTED_RESUME_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function isJobStatus(value: string): value is JobStatus {
  return JOB_STATUSES.includes(value as JobStatus);
}

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return APPLICATION_STATUSES.includes(value as ApplicationStatus);
}

export function normalizeText(value: string) {
  return value.trim();
}

export function normalizeOptionalText(value: string) {
  const normalized = value.trim();
  return normalized ? normalized : null;
}

export function normalizeMultilineText(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

export function splitMultilineText(value?: string | null) {
  if (!value) return [];

  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function slugifyCareerTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function buildUniqueCareerSlug(title: string) {
  const base = slugifyCareerTitle(title) || "career-role";
  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
}

export function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatCareerDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getResumeExtension(fileName: string) {
  const normalized = fileName.toLowerCase();
  const extension = ACCEPTED_RESUME_EXTENSIONS.find((item) => normalized.endsWith(item));
  return extension ?? null;
}

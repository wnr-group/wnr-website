/**
 * types/career.ts — Career application DTO and domain model types.
 *
 * Layers:
 *   CareerApplicationRequestDTO  — raw data from the multipart form (all strings)
 *   CareerApplicationDomain      — validated, typed domain model
 *   JobApplicationRecord         — what gets stored / logged (storage layer)
 *   CareerApplicationResponseDTO — what the API returns to the client
 */

// ── Controlled dropdown values ────────────────────────────────────────────────

export const NOTICE_PERIOD_OPTIONS = [
  "Immediate",
  "15 days",
  "30 days",
  "45 days",
  "60 days",
  "90 days",
  "More than 90 days",
] as const;

export type NoticePeriod = (typeof NOTICE_PERIOD_OPTIONS)[number];

export const HEARD_ABOUT_US_OPTIONS = [
  "LinkedIn",
  "Job Board",
  "Referral",
  "WnR Website",
  "Social Media",
  "Other",
] as const;

export type HeardAboutUs = (typeof HEARD_ABOUT_US_OPTIONS)[number];

// ── Request DTO (from multipart/form-data) ────────────────────────────────────

/**
 * All fields arrive as strings from a multipart form.
 * Numbers (yearsOfExperience, expectedCtc) are coerced in the domain mapper.
 */
export interface CareerApplicationRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentLocation: string;
  yearsOfExperience: string;       // numeric string
  currentCompany?: string;
  currentDesignation?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  /** resumeRef is set after the file is stored */
  resumeRef?: string;
  coverLetter?: string;
  expectedCtc?: string;            // numeric string
  noticePeriod?: string;
  preferredRole?: string;
  heardAboutUs?: string;
  /** Honeypot — must be empty */
  honeypot?: string;
}

// ── Domain model ──────────────────────────────────────────────────────────────

export interface CareerApplicationDomain {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  currentLocation: string;
  yearsOfExperience: number;
  currentCompany: string | null;
  currentDesignation: string | null;
  linkedInUrl: string | null;
  portfolioUrl: string | null;
  resumeRef: string;
  coverLetter: string | null;
  expectedCtc: number | null;
  noticePeriod: NoticePeriod | null;
  preferredRole: string | null;
  heardAboutUs: HeardAboutUs | null;
}

// ── Storage model ─────────────────────────────────────────────────────────────

export interface JobApplicationRecord {
  id: string;
  submittedAt: string;             // ISO-8601
  applicant: {
    firstName: string;
    lastName: string;
    email: string;                 // store full for DB; masked in logs
    phone: string;
    currentLocation: string;
  };
  professional: {
    yearsOfExperience: number;
    currentCompany: string | null;
    currentDesignation: string | null;
    linkedInUrl: string | null;
    portfolioUrl: string | null;
    expectedCtc: number | null;
    noticePeriod: string | null;
    preferredRole: string | null;
  };
  application: {
    resumeRef: string;
    coverLetter: string | null;
    heardAboutUs: string | null;
  };
  meta: {
    ip: string;
    userAgent: string;
    requestId: string;
  };
}

// ── Response DTO ──────────────────────────────────────────────────────────────

export interface CareerApplicationResponseDTO {
  referenceNumber: string;
  message: string;
}

/**
 * types/contact.ts — Contact enquiry DTO and domain model types.
 *
 * Layers:
 *   ContactEnquiryRequestDTO  — raw JSON from the form
 *   ContactEnquiryDomain      — validated, typed domain model
 *   ContactEnquiryRecord      — what gets stored / logged (storage layer)
 *   ContactEnquiryResponseDTO — what the API returns to the client
 */

// ── Controlled dropdown values ────────────────────────────────────────────────

export const REGION_OPTIONS = [
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Middle East",
  "Africa",
  "Australia",
] as const;

export type Region = (typeof REGION_OPTIONS)[number];

export const INQUIRY_TYPE_OPTIONS = [
  "General Enquiry",
  "Digital Transformation",
  "AI & GenAI",
  "Cloud",
  "Cybersecurity",
  "Data & Analytics",
  "Managed Services",
  "Product Demo",
  "Technology Partnership",
  "Careers",
  "Media",
  "Other",
] as const;

export type InquiryType = (typeof INQUIRY_TYPE_OPTIONS)[number];

// ── Request DTO (from JSON body) ──────────────────────────────────────────────

export interface ContactEnquiryRequestDTO {
  name: string;
  email: string;
  organization: string;
  contactNumber: string;
  region: string;
  inquiryType: string;
  message: string;
  /** Honeypot — must be empty */
  honeypot?: string;
}

// ── Domain model ──────────────────────────────────────────────────────────────

export interface ContactEnquiryDomain {
  name: string;
  email: string;
  organization: string;
  contactNumber: string;
  region: Region;
  inquiryType: InquiryType;
  message: string;
}

// ── Storage model ─────────────────────────────────────────────────────────────

export interface ContactEnquiryRecord {
  id: string;
  submittedAt: string;             // ISO-8601
  contact: {
    name: string;
    email: string;                 // stored full; masked in logs
    organization: string;
    contactNumber: string;
  };
  enquiry: {
    region: string;
    inquiryType: string;
    message: string;
  };
  meta: {
    ip: string;
    userAgent: string;
    requestId: string;
  };
}

// ── Response DTO ──────────────────────────────────────────────────────────────

export interface ContactEnquiryResponseDTO {
  referenceNumber: string;
  message: string;
}

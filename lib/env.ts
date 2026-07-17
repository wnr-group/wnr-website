/**
 * lib/env.ts — Centralised environment configuration accessor.
 *
 * All configurable knobs live here. Consumers import named constants; never
 * access process.env directly in business logic so config is easy to audit.
 *
 * Safe defaults let the app run in development without any .env.local file.
 */

function getInt(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getBool(key: string, fallback: boolean): boolean {
  const raw = process.env[key];
  if (!raw) return fallback;
  return raw.toLowerCase() === "true" || raw === "1";
}

function getString(key: string, fallback: string): string {
  return process.env[key]?.trim() || fallback;
}

// ── Resume / file upload ─────────────────────────────────────────────────────

/** Maximum resume size in bytes. Default: 4 MB. */
export const MAX_RESUME_SIZE_BYTES =
  getInt("MAX_RESUME_SIZE_MB", 4) * 1024 * 1024;

/** Comma-separated allowed extensions. Default: pdf,doc,docx */
export const ALLOWED_FILE_EXTENSIONS: readonly string[] = getString(
  "ALLOWED_FILE_TYPES",
  "pdf,doc,docx",
)
  .split(",")
  .map((ext) => `.${ext.trim().toLowerCase()}`);

// ── Rate limiting ────────────────────────────────────────────────────────────

/** Max career-apply submissions per IP per window. Default: 5. */
export const RATE_LIMIT_CAREER_APPLY = getInt("RATE_LIMIT_CAREER_APPLY", 5);

/** Max contact submissions per IP per window. Default: 10. */
export const RATE_LIMIT_CONTACT = getInt("RATE_LIMIT_CONTACT", 10);

/** Max standalone resume uploads per IP per window. Default: 5. */
export const RATE_LIMIT_RESUME = getInt("RATE_LIMIT_RESUME", 5);

/** Rate-limit window in milliseconds. Default: 10 minutes. */
export const RATE_LIMIT_WINDOW_MS = getInt(
  "RATE_LIMIT_WINDOW_MS",
  10 * 60 * 1000,
);

// ── Network / timeouts ───────────────────────────────────────────────────────

/** Client-side request timeout in milliseconds. Default: 30 s. */
export const REQUEST_TIMEOUT_MS = getInt("REQUEST_TIMEOUT_MS", 30_000);

/** Max retry attempts for transient failures. Default: 2. */
export const MAX_RETRIES = getInt("MAX_RETRIES", 2);

// ── Email ────────────────────────────────────────────────────────────────────

/** Whether the email provider is active. Default: false (stub only). */
export const EMAILS_ENABLED = getBool("EMAILS_ENABLED", false);

/** Sender address shown on all outgoing emails. */
export const EMAIL_FROM = getString(
  "EMAIL_FROM",
  "noreply@wnrtech.com",
);

/** HR / internal notification recipient. */
export const HR_EMAIL = getString("HR_EMAIL", "careers@wnrtech.com");

/** Sales / internal contact notification recipient. */
export const SALES_EMAIL = getString("SALES_EMAIL", "hello@wnrtech.com");

// ── Upload / storage ─────────────────────────────────────────────────────────

/** Directory (server-side) where resumes are temporarily stored. */
export const UPLOAD_DIR = getString("UPLOAD_DIR", "");

// ── Analytics ────────────────────────────────────────────────────────────────

/** Whether to emit analytics events. Default: true. */
export const ANALYTICS_ENABLED = getBool("ANALYTICS_ENABLED", true);

// ── Draft ────────────────────────────────────────────────────────────────────

/** sessionStorage key for career application drafts. */
export const CAREER_DRAFT_KEY = getString(
  "CAREER_DRAFT_KEY",
  "wnr_career_draft",
);

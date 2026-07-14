/**
 * lib/validation/validators.ts — Reusable, pure validation functions.
 *
 * Rules:
 * - Every function returns `string | null` (error message or null = valid)
 * - All functions operate on already-sanitized strings
 * - Safe to import in both client (browser) and server (Node) code
 * - No external dependencies
 */

// ── Required ──────────────────────────────────────────────────────────────────

export function validateRequired(
  value: string,
  fieldLabel: string,
): string | null {
  if (!value || value.trim().length === 0) {
    return `${fieldLabel} is required.`;
  }
  return null;
}

// ── Length ────────────────────────────────────────────────────────────────────

export function validateMinLength(
  value: string,
  min: number,
  fieldLabel: string,
): string | null {
  if (value.trim().length < min) {
    return `${fieldLabel} must be at least ${min} characters.`;
  }
  return null;
}

export function validateMaxLength(
  value: string,
  max: number,
  fieldLabel: string,
): string | null {
  if (value.trim().length > max) {
    return `${fieldLabel} must be ${max} characters or fewer.`;
  }
  return null;
}

// ── Email ─────────────────────────────────────────────────────────────────────

/**
 * RFC 5322-aligned email pattern.
 * Deliberately conservative — rejects edge cases that most providers reject anyway.
 */
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function validateEmail(value: string): string | null {
  if (!value || value.trim().length === 0) return "Email is required.";
  if (value.length > 254) return "Email address is too long.";
  if (!EMAIL_PATTERN.test(value.trim())) {
    return "Please enter a valid email address.";
  }
  return null;
}

// ── Phone ─────────────────────────────────────────────────────────────────────

/**
 * International phone — E.164 compatible.
 * Accepts optional leading +, then 7–15 digits (with optional spaces/dashes).
 */
const PHONE_PATTERN = /^\+?[0-9][\d\s\-().]{6,19}$/;

export function validatePhone(value: string, required = true): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return required ? "Phone number is required." : null;
  }
  if (!PHONE_PATTERN.test(trimmed)) {
    return "Please enter a valid international phone number (e.g. +91 98765 43210).";
  }
  return null;
}

// ── URL ───────────────────────────────────────────────────────────────────────

export function validateUrl(value: string, fieldLabel: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null; // URLs are optional unless combined with validateRequired
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    if (!["http:", "https:"].includes(url.protocol)) {
      return `${fieldLabel} must be an http or https URL.`;
    }
  } catch {
    return `${fieldLabel} must be a valid URL.`;
  }
  return null;
}

// ── Numeric ───────────────────────────────────────────────────────────────────

export function validateNumeric(
  value: string,
  fieldLabel: string,
  required = false,
): string | null {
  const trimmed = value.trim();
  if (!trimmed) return required ? `${fieldLabel} is required.` : null;
  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return `${fieldLabel} must be a number.`;
  }
  return null;
}

export function validatePositiveInt(
  value: string,
  fieldLabel: string,
  required = true,
): string | null {
  const trimmed = value.trim();
  if (!trimmed) return required ? `${fieldLabel} is required.` : null;
  if (!/^\d+$/.test(trimmed)) {
    return `${fieldLabel} must be a positive whole number.`;
  }
  return null;
}

// ── Dropdown ─────────────────────────────────────────────────────────────────

export function validateOneOf(
  value: string,
  allowed: readonly string[],
  fieldLabel: string,
): string | null {
  if (!value || value.trim().length === 0) {
    return `${fieldLabel} is required.`;
  }
  if (!allowed.includes(value.trim())) {
    return `${fieldLabel} must be one of the provided options.`;
  }
  return null;
}

// ── Honeypot ──────────────────────────────────────────────────────────────────

/**
 * A honeypot field must always be empty — bots fill it, humans don't see it.
 * Returns a silent null on success so error surfaces give no hint.
 */
export function validateHoneypot(value: string): string | null {
  if (value && value.length > 0) return "Submission rejected.";
  return null;
}

// ── File ──────────────────────────────────────────────────────────────────────

export interface FileConstraints {
  maxSizeBytes: number;
  allowedExtensions: readonly string[];
  allowedMimeTypes: readonly string[];
}

export interface FileLike {
  name: string;
  size: number;
  type: string;
}

export function validateFile(
  file: FileLike,
  constraints: FileConstraints,
): string | null {
  if (file.size <= 0) return "File is empty.";

  if (file.size > constraints.maxSizeBytes) {
    const mb = Math.round(constraints.maxSizeBytes / (1024 * 1024));
    return `File must be under ${mb} MB.`;
  }

  const ext = file.name.includes(".")
    ? `.${file.name.split(".").pop()!.toLowerCase()}`
    : "";

  if (!constraints.allowedExtensions.includes(ext)) {
    return `Only ${constraints.allowedExtensions.map((e) => e.slice(1).toUpperCase()).join(", ")} files are accepted.`;
  }

  if (
    file.type &&
    file.type !== "application/octet-stream" &&
    !constraints.allowedMimeTypes.includes(file.type)
  ) {
    return `File type '${file.type}' is not accepted.`;
  }

  return null;
}

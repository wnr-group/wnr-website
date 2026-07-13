/**
 * validation/contact.schema.ts — Contact enquiry validation schema.
 *
 * Uses shared validators from lib/validation/validators.ts.
 * Safe to use on both client and server.
 */

import type { ContactEnquiryRequestDTO } from "@/types/contact";
import { REGION_OPTIONS, INQUIRY_TYPE_OPTIONS } from "@/types/contact";
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validateMinLength,
  validateMaxLength,
  validateOneOf,
  validateHoneypot,
} from "@/lib/validation/validators";
import type { FieldError } from "@/lib/errors";

export interface ValidationResult {
  valid: true;
}

export interface ValidationFailure {
  valid: false;
  errors: FieldError[];
}

export type ContactValidationResult = ValidationResult | ValidationFailure;

/** Collect all errors so the form can show all problems at once. */
export function validateContactEnquiry(
  dto: ContactEnquiryRequestDTO,
): ContactValidationResult {
  const errors: FieldError[] = [];

  function add(field: string, message: string | null) {
    if (message) errors.push({ field, message });
  }

  // ── Honeypot ──────────────────────────────────────────────────────────────
  add("honeypot", validateHoneypot(dto.honeypot ?? ""));

  // ── Name ──────────────────────────────────────────────────────────────────
  add("name", validateRequired(dto.name ?? "", "Name"));
  add("name", validateMaxLength(dto.name ?? "", 200, "Name"));

  // ── Email ─────────────────────────────────────────────────────────────────
  add("email", validateEmail(dto.email ?? ""));

  // ── Organization ──────────────────────────────────────────────────────────
  add("organization", validateRequired(dto.organization ?? "", "Organization"));
  add(
    "organization",
    validateMaxLength(dto.organization ?? "", 200, "Organization"),
  );

  // ── Phone ─────────────────────────────────────────────────────────────────
  add("contactNumber", validatePhone(dto.contactNumber ?? "", true));

  // ── Region ────────────────────────────────────────────────────────────────
  add("region", validateOneOf(dto.region ?? "", REGION_OPTIONS, "Region"));

  // ── Inquiry Type ──────────────────────────────────────────────────────────
  add(
    "inquiryType",
    validateOneOf(
      dto.inquiryType ?? "",
      INQUIRY_TYPE_OPTIONS,
      "Inquiry Type",
    ),
  );

  // ── Message ───────────────────────────────────────────────────────────────
  add("message", validateRequired(dto.message ?? "", "Message"));
  add("message", validateMinLength(dto.message ?? "", 20, "Message"));
  add("message", validateMaxLength(dto.message ?? "", 5000, "Message"));

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

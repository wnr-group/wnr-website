/**
 * validation/career.schema.ts — Career application validation schema.
 *
 * Uses shared validators from lib/validation/validators.ts.
 * Returns typed result so callers can surface per-field errors.
 *
 * Safe to use on both client and server — no Node-only APIs.
 */

import type { CareerApplicationRequestDTO } from "@/types/career";
import {
  NOTICE_PERIOD_OPTIONS,
  HEARD_ABOUT_US_OPTIONS,
} from "@/types/career";
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validateMinLength,
  validateMaxLength,
  validatePositiveInt,
  validateNumeric,
  validateOneOf,
  validateUrl,
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

export type CareerValidationResult = ValidationResult | ValidationFailure;

/** Collect all errors so the form can show all problems at once. */
export function validateCareerApplication(
  dto: CareerApplicationRequestDTO,
): CareerValidationResult {
  const errors: FieldError[] = [];

  function add(field: string, message: string | null) {
    if (message) errors.push({ field, message });
  }

  // ── Honeypot ──────────────────────────────────────────────────────────────
  add("honeypot", validateHoneypot(dto.honeypot ?? ""));

  // ── Required personal fields ──────────────────────────────────────────────
  add("firstName", validateRequired(dto.firstName ?? "", "First Name"));
  add("firstName", validateMaxLength(dto.firstName ?? "", 100, "First Name"));

  add("lastName", validateRequired(dto.lastName ?? "", "Last Name"));
  add("lastName", validateMaxLength(dto.lastName ?? "", 100, "Last Name"));

  add("email", validateEmail(dto.email ?? ""));

  add("phone", validatePhone(dto.phone ?? "", true));

  add(
    "currentLocation",
    validateRequired(dto.currentLocation ?? "", "Current Location"),
  );
  add(
    "currentLocation",
    validateMaxLength(dto.currentLocation ?? "", 200, "Current Location"),
  );

  // ── Experience ────────────────────────────────────────────────────────────
  add(
    "yearsOfExperience",
    validatePositiveInt(dto.yearsOfExperience ?? "", "Years of Experience", true),
  );

  // ── Optional professional fields ──────────────────────────────────────────
  if (dto.currentCompany) {
    add(
      "currentCompany",
      validateMaxLength(dto.currentCompany, 200, "Current Company"),
    );
  }

  if (dto.currentDesignation) {
    add(
      "currentDesignation",
      validateMaxLength(dto.currentDesignation, 200, "Current Designation"),
    );
  }

  if (dto.linkedInUrl) {
    add("linkedInUrl", validateUrl(dto.linkedInUrl, "LinkedIn URL"));
    add(
      "linkedInUrl",
      validateMaxLength(dto.linkedInUrl, 500, "LinkedIn URL"),
    );
  }

  if (dto.portfolioUrl) {
    add("portfolioUrl", validateUrl(dto.portfolioUrl, "Portfolio / GitHub URL"));
    add(
      "portfolioUrl",
      validateMaxLength(dto.portfolioUrl, 500, "Portfolio / GitHub URL"),
    );
  }

  // ── Resume ────────────────────────────────────────────────────────────────
  // resumeRef is set after file upload; required for final submission
  add("resumeRef", validateRequired(dto.resumeRef ?? "", "Resume"));

  // ── Optional fields ───────────────────────────────────────────────────────
  if (dto.coverLetter) {
    add(
      "coverLetter",
      validateMinLength(dto.coverLetter, 10, "Cover Letter"),
    );
    add(
      "coverLetter",
      validateMaxLength(dto.coverLetter, 5000, "Cover Letter"),
    );
  }

  if (dto.expectedCtc) {
    add("expectedCtc", validateNumeric(dto.expectedCtc, "Expected CTC", false));
  }

  if (dto.noticePeriod) {
    add(
      "noticePeriod",
      validateOneOf(
        dto.noticePeriod,
        NOTICE_PERIOD_OPTIONS,
        "Notice Period",
      ),
    );
  }

  if (dto.preferredRole) {
    add(
      "preferredRole",
      validateMaxLength(dto.preferredRole, 200, "Preferred Role"),
    );
  }

  if (dto.heardAboutUs) {
    add(
      "heardAboutUs",
      validateOneOf(
        dto.heardAboutUs,
        HEARD_ABOUT_US_OPTIONS,
        "How did you hear about us",
      ),
    );
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

"use client";

/**
 * hooks/useContactForm.ts — Contact enquiry form state machine.
 *
 * States: idle → editing → validating → submitting → success | failure
 *
 * Features:
 * - Duplicate submission protection
 * - Honeypot validation
 * - Analytics events
 * - Reference number on success
 * - Error recovery (retry / start over)
 */

import { useState, useCallback, useRef } from "react";
import type { ContactEnquiryRequestDTO } from "@/types/contact";
import { REGION_OPTIONS, INQUIRY_TYPE_OPTIONS } from "@/types/contact";
import { validateContactEnquiry } from "@/validation/contact.schema";
import { sanitizeAll } from "@/lib/validation/sanitize";
import { submitContact } from "@/services/contact";
import { trackEvent } from "@/lib/analytics";

// ── State machine types ───────────────────────────────────────────────────────

export type ContactFormStatus =
  | "idle"
  | "editing"
  | "validating"
  | "submitting"
  | "success"
  | "failure";

export type ContactFieldErrors = Partial<
  Record<keyof ContactEnquiryRequestDTO, string>
>;

export interface ContactFormValues {
  name: string;
  email: string;
  organization: string;
  contactNumber: string;
  region: string;
  inquiryType: string;
  message: string;
  honeypot: string;
}

const EMPTY_VALUES: ContactFormValues = {
  name: "",
  email: "",
  organization: "",
  contactNumber: "",
  region: "",
  inquiryType: "",
  message: "",
  honeypot: "",
};

export interface UseContactFormReturn {
  // State
  status: ContactFormStatus;
  values: ContactFormValues;
  errors: ContactFieldErrors;
  touched: Partial<Record<keyof ContactFormValues, boolean>>;
  submitError: string | null;
  referenceNumber: string | null;

  // Handlers
  handleChange: (field: keyof ContactFormValues, value: string) => void;
  handleBlur: (field: keyof ContactFormValues) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleReset: () => void;
  handleRetry: () => void;

  // Options for dropdowns
  regionOptions: typeof REGION_OPTIONS;
  inquiryTypeOptions: typeof INQUIRY_TYPE_OPTIONS;
}

export function useContactForm(): UseContactFormReturn {
  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ContactFormValues, boolean>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const analyticsStartedRef = useRef(false);

  const handleChange = useCallback(
    (field: keyof ContactFormValues, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      if (!analyticsStartedRef.current) {
        analyticsStartedRef.current = true;
        trackEvent("contact_started");
      }

      if (status === "idle") setStatus("editing");

      // Clear field error on change
      setErrors((prev) => {
        if (!prev[field as keyof ContactEnquiryRequestDTO]) return prev;
        const next = { ...prev };
        delete next[field as keyof ContactEnquiryRequestDTO];
        return next;
      });
    },
    [status],
  );

  const handleBlur = useCallback((field: keyof ContactFormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Duplicate submission guard
      if (status === "submitting" || status === "success") return;

      setStatus("validating");
      setSubmitError(null);

      // Sanitize then validate
      const sanitized = sanitizeAll(
        values as unknown as Record<string, unknown>,
      ) as unknown as ContactFormValues;

      const dto: ContactEnquiryRequestDTO = {
        name: sanitized.name,
        email: sanitized.email,
        organization: sanitized.organization,
        contactNumber: sanitized.contactNumber,
        region: sanitized.region,
        inquiryType: sanitized.inquiryType,
        message: sanitized.message,
        honeypot: sanitized.honeypot,
      };

      const validation = validateContactEnquiry(dto);

      if (!validation.valid) {
        const fieldErrors: ContactFieldErrors = {};
        for (const err of validation.errors) {
          fieldErrors[err.field as keyof ContactEnquiryRequestDTO] = err.message;
        }
        setErrors(fieldErrors);
        setStatus("failure");

        // Focus first invalid field
        const firstField = validation.errors[0]?.field;
        if (firstField) {
          const el = document.getElementById(`contact-${firstField}`);
          el?.focus();
        }
        return;
      }

      setStatus("submitting");

      const controller = new AbortController();
      abortRef.current = controller;

      const result = await submitContact(dto, { signal: controller.signal });

      if (result.ok) {
        setStatus("success");
        setReferenceNumber(result.data.referenceNumber);
        trackEvent("contact_submitted");
      } else {
        if (result.kind === "validation" && result.fieldErrors) {
          const fieldErrors: ContactFieldErrors = {};
          for (const err of result.fieldErrors) {
            fieldErrors[err.field as keyof ContactEnquiryRequestDTO] = err.message;
          }
          setErrors(fieldErrors);
        }
        setSubmitError(result.message);
        setStatus("failure");
        trackEvent("contact_failed");
      }
    },
    [status, values],
  );

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
    setValues(EMPTY_VALUES);
    setErrors({});
    setTouched({});
    setSubmitError(null);
    setReferenceNumber(null);
    analyticsStartedRef.current = false;
  }, []);

  const handleRetry = useCallback(() => {
    setStatus("editing");
    setSubmitError(null);
  }, []);

  return {
    status,
    values,
    errors,
    touched,
    submitError,
    referenceNumber,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    handleRetry,
    regionOptions: REGION_OPTIONS,
    inquiryTypeOptions: INQUIRY_TYPE_OPTIONS,
  };
}

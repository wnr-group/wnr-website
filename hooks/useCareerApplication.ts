"use client";

/**
 * hooks/useCareerApplication.ts — Career application form state machine.
 *
 * States:
 *   idle → editing → validating → uploading → submitting → success | failure | cancelled
 *
 * Features:
 * - Field state (values, errors, touched)
 * - Resume upload state (passed as external ref for progress)
 * - Duplicate submission protection (state machine — disabled once submitting)
 * - Honeypot field (hidden, validated silently)
 * - Unsaved-changes detection (beforeunload warning)
 * - sessionStorage draft save/restore
 * - Analytics event tracking
 * - Reference number on success
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { CareerApplicationRequestDTO } from "@/types/career";
import { NOTICE_PERIOD_OPTIONS, HEARD_ABOUT_US_OPTIONS } from "@/types/career";
import { validateCareerApplication } from "@/validation/career.schema";
import { sanitizeAll } from "@/lib/validation/sanitize";
import { submitCareerApplication } from "@/services/careerApplication";
import { trackEvent } from "@/lib/analytics";
import { CAREER_DRAFT_KEY } from "@/lib/env";

// ── State machine types ───────────────────────────────────────────────────────

export type CareerFormStatus =
  | "idle"
  | "editing"
  | "validating"
  | "uploading"
  | "submitting"
  | "success"
  | "failure"
  | "cancelled";

export type FieldErrors = Partial<Record<keyof CareerApplicationRequestDTO | "resume", string>>;

export interface CareerFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentLocation: string;
  yearsOfExperience: string;
  currentCompany: string;
  currentDesignation: string;
  linkedInUrl: string;
  portfolioUrl: string;
  coverLetter: string;
  expectedCtc: string;
  noticePeriod: string;
  preferredRole: string;
  heardAboutUs: string;
  honeypot: string;
  /** Set after successful resume upload */
  resumeRef: string;
  /** Display name of the uploaded resume file */
  resumeFileName: string;
}

const EMPTY_STATE: CareerFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  currentLocation: "",
  yearsOfExperience: "",
  currentCompany: "",
  currentDesignation: "",
  linkedInUrl: "",
  portfolioUrl: "",
  coverLetter: "",
  expectedCtc: "",
  noticePeriod: "",
  preferredRole: "",
  heardAboutUs: "",
  honeypot: "",
  resumeRef: "",
  resumeFileName: "",
};

export interface UseCareerApplicationReturn {
  // State
  status: CareerFormStatus;
  values: CareerFormState;
  errors: FieldErrors;
  touched: Partial<Record<keyof CareerFormState, boolean>>;
  submitError: string | null;
  referenceNumber: string | null;
  uploadProgress: number;
  isDirty: boolean;
  hasDraft: boolean;

  // Handlers
  handleChange: (
    field: keyof CareerFormState,
    value: string,
  ) => void;
  handleBlur: (field: keyof CareerFormState) => void;
  setResumeRef: (ref: string, fileName: string) => void;
  setUploadProgress: (percent: number) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleReset: () => void;
  handleRetry: () => void;
  restoreDraft: () => void;
  discardDraft: () => void;

  // Dropdown options (exported for UI)
  noticePeriodOptions: typeof NOTICE_PERIOD_OPTIONS;
  heardAboutUsOptions: typeof HEARD_ABOUT_US_OPTIONS;
}

function loadDraft(): CareerFormState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CAREER_DRAFT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed as CareerFormState;
  } catch {
    return null;
  }
}

function saveDraft(values: CareerFormState): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CAREER_DRAFT_KEY, JSON.stringify(values));
  } catch {
    // sessionStorage may be unavailable (private mode, storage full)
  }
}

function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(CAREER_DRAFT_KEY);
  } catch {
    // ignore
  }
}

export function useCareerApplication(
  initialPreferredRole = "",
): UseCareerApplicationReturn {
  const [status, setStatus] = useState<CareerFormStatus>("idle");
  const [values, setValues] = useState<CareerFormState>({
    ...EMPTY_STATE,
    preferredRole: initialPreferredRole,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof CareerFormState, boolean>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [uploadProgress, setUploadProgressState] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  // Lazy initializer — avoids setState-in-effect lint error and runs once on mount
  const [hasDraft, setHasDraft] = useState(() => loadDraft() !== null);
  const abortRef = useRef<AbortController | null>(null);
  const analyticsStartedRef = useRef(false);

  // Warn on unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty && status !== "success") {
        e.preventDefault();
        // Modern browsers ignore custom messages but require preventDefault
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty, status]);

  const handleChange = useCallback(
    (field: keyof CareerFormState, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);

      // Fire career_started once on first interaction
      if (!analyticsStartedRef.current) {
        analyticsStartedRef.current = true;
        trackEvent("career_started");
      }

      if (status === "idle") setStatus("editing");

      // Clear field error on change
      setErrors((prev) => {
        if (!prev[field as keyof CareerApplicationRequestDTO]) return prev;
        const next = { ...prev };
        delete next[field as keyof CareerApplicationRequestDTO];
        return next;
      });

      // Auto-save draft (debounced via natural React batching)
      saveDraft({ ...values, [field]: value });
    },
    [status, values],
  );

  const handleBlur = useCallback(
    (field: keyof CareerFormState) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
    },
    [],
  );

  const setResumeRef = useCallback((ref: string, fileName: string) => {
    setValues((prev) => ({ ...prev, resumeRef: ref, resumeFileName: fileName }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.resumeRef;
      return next;
    });
    trackEvent("resume_uploaded");
  }, []);

  const setUploadProgress = useCallback((percent: number) => {
    setUploadProgressState(percent);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Duplicate submission guard
      if (
        status === "submitting" ||
        status === "uploading" ||
        status === "success"
      ) {
        return;
      }

      setStatus("validating");
      setSubmitError(null);

      // Sanitize then validate
      const sanitized = sanitizeAll(values as unknown as Record<string, unknown>) as unknown as CareerFormState;

      const dto: CareerApplicationRequestDTO = {
        firstName: sanitized.firstName,
        lastName: sanitized.lastName,
        email: sanitized.email,
        phone: sanitized.phone,
        currentLocation: sanitized.currentLocation,
        yearsOfExperience: sanitized.yearsOfExperience,
        currentCompany: sanitized.currentCompany || undefined,
        currentDesignation: sanitized.currentDesignation || undefined,
        linkedInUrl: sanitized.linkedInUrl || undefined,
        portfolioUrl: sanitized.portfolioUrl || undefined,
        resumeRef: sanitized.resumeRef || undefined,
        coverLetter: sanitized.coverLetter || undefined,
        expectedCtc: sanitized.expectedCtc || undefined,
        noticePeriod: sanitized.noticePeriod || undefined,
        preferredRole: sanitized.preferredRole || undefined,
        heardAboutUs: sanitized.heardAboutUs || undefined,
        honeypot: sanitized.honeypot,
      };

      const result = validateCareerApplication(dto);

      if (!result.valid) {
        const fieldErrors: FieldErrors = {};
        for (const err of result.errors) {
          fieldErrors[err.field as keyof CareerApplicationRequestDTO] = err.message;
        }
        setErrors(fieldErrors);
        setStatus("failure");

        // Focus the first invalid field
        const firstField = result.errors[0]?.field;
        if (firstField) {
          const el = document.getElementById(`career-${firstField}`);
          el?.focus();
        }
        return;
      }

      setStatus("submitting");

      const controller = new AbortController();
      abortRef.current = controller;

      const formData = new FormData();
      Object.entries(dto).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value);
      });

      const submitResult = await submitCareerApplication(formData, {
        signal: controller.signal,
        onProgress: (pct) => setUploadProgressState(pct),
      });

      if (submitResult.ok) {
        setStatus("success");
        setReferenceNumber(submitResult.data.referenceNumber);
        setIsDirty(false);
        clearDraft();
        setHasDraft(false);
        trackEvent("career_submitted");
      } else {
        if (submitResult.kind === "validation" && submitResult.fieldErrors) {
          const fieldErrors: FieldErrors = {};
          for (const err of submitResult.fieldErrors) {
            fieldErrors[err.field as keyof CareerApplicationRequestDTO] = err.message;
          }
          setErrors(fieldErrors);
        }
        setSubmitError(submitResult.message);
        setStatus("failure");
        trackEvent("career_failed");
      }
    },
    [status, values],
  );

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
    setValues({ ...EMPTY_STATE, preferredRole: initialPreferredRole });
    setErrors({});
    setTouched({});
    setSubmitError(null);
    setReferenceNumber(null);
    setUploadProgressState(0);
    setIsDirty(false);
    clearDraft();
    setHasDraft(false);
    analyticsStartedRef.current = false;
  }, [initialPreferredRole]);

  const handleRetry = useCallback(() => {
    setStatus("editing");
    setSubmitError(null);
  }, []);

  const restoreDraft = useCallback(() => {
    const draft = loadDraft();
    if (draft) {
      setValues(draft);
      setIsDirty(true);
      setHasDraft(false);
      setStatus("editing");
    }
  }, []);

  const discardDraft = useCallback(() => {
    clearDraft();
    setHasDraft(false);
  }, []);

  return {
    status,
    values,
    errors,
    touched,
    submitError,
    referenceNumber,
    uploadProgress,
    isDirty,
    hasDraft,
    handleChange,
    handleBlur,
    setResumeRef,
    setUploadProgress,
    handleSubmit,
    handleReset,
    handleRetry,
    restoreDraft,
    discardDraft,
    noticePeriodOptions: NOTICE_PERIOD_OPTIONS,
    heardAboutUsOptions: HEARD_ABOUT_US_OPTIONS,
  };
}

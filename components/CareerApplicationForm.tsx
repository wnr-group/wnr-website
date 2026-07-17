"use client";

/**
 * components/CareerApplicationForm.tsx — Full career application form.
 *
 * 16 fields, drag-and-drop resume upload, state machine, ARIA attributes,
 * unsaved-changes warning, sessionStorage draft, success panel with reference.
 * Completely independent from ContactForm.
 */

import { useCallback, useId, useRef, useState } from "react";
import {
  Check,
  AlertCircle,
  Loader2,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { validateFileMeta } from "@/lib/file-validation";
import { resumeConfig } from "@/content/careers";
import { uploadResume } from "@/services/careers";
import { useCareerApplication } from "@/hooks/useCareerApplication";

// ── Style tokens (match project conventions) ──────────────────────────────────

const fieldBase =
  "w-full rounded-lg border border-line bg-paper px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted/70 transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/25";

const labelBase = "text-sm font-medium text-ink";

const errorBase = "mt-1 flex items-center gap-1.5 text-xs text-destructive";

// ── FieldError ────────────────────────────────────────────────────────────────

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className={errorBase} aria-live="polite">
      <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

// ── ResumeField ───────────────────────────────────────────────────────────────

type ResumeUploadStatus =
  | { status: "idle" }
  | { status: "selected"; file: File }
  | { status: "uploading"; file: File; progress: number }
  | { status: "success"; fileName: string; ref: string }
  | { status: "error"; message: string; file?: File };

interface ResumeFieldProps {
  onSuccess: (ref: string, fileName: string) => void;
  errorMessage?: string;
  errorId: string;
}

function ResumeField({ onSuccess, errorMessage, errorId }: ResumeFieldProps) {
  const [state, setState] = useState<ResumeUploadStatus>({ status: "idle" });
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputId = useId();

  const acceptAttr = resumeConfig.acceptedExtensions.join(",");

  const selectFile = useCallback((file: File) => {
    const err = validateFileMeta(
      { name: file.name, size: file.size, type: file.type },
      resumeConfig,
    );
    if (err) {
      setState({ status: "error", message: err });
      return;
    }
    setState({ status: "selected", file });
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) selectFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) selectFile(file);
  };

  const upload = async () => {
    if (state.status !== "selected") return;
    const file = state.file;
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: "uploading", file, progress: 0 });

    const result = await uploadResume(file, {
      signal: controller.signal,
      onProgress: (pct) =>
        setState((prev) =>
          prev.status === "uploading" ? { ...prev, progress: pct } : prev,
        ),
    });

    if (result.ok) {
      // The existing resume endpoint returns a message but no ref. Use the
      // filename as a stand-in ref for now; the /api/careers/apply endpoint
      // handles the actual file upload itself via the FormData payload.
      setState({ status: "success", fileName: file.name, ref: file.name });
      onSuccess(file.name, file.name);
    } else {
      setState({ status: "error", message: result.message, file });
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setState({ status: "idle" });
  };

  if (state.status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-forest/20 bg-forest-wash px-4 py-3">
        <CheckCircle2 size={18} className="shrink-0 text-forest" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
          {state.fileName}
        </span>
        <button
          type="button"
          onClick={reset}
          aria-label="Remove uploaded resume"
          className="shrink-0 text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
        >
          <X size={15} />
        </button>
      </div>
    );
  }

  const file =
    state.status === "selected" || state.status === "uploading" || state.status === "error"
      ? state.file
      : undefined;

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        aria-label="Upload resume — drag and drop or click to browse"
        aria-describedby={
          (state.status === "error" || errorMessage) ? errorId : undefined
        }
        className={cn(
          "flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2",
          dragActive ? "border-forest bg-forest-wash" : "border-line-strong bg-mist",
        )}
      >
        <UploadCloud className="text-forest" size={26} aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-ink">
            Drag and drop your resume, or{" "}
            <span className="text-forest underline underline-offset-2">browse</span>
          </p>
          <p className="mt-1 text-xs text-muted">PDF, DOC, or DOCX — up to 4 MB</p>
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={acceptAttr}
          onChange={onInputChange}
          className="sr-only"
          aria-label="Browse for a resume file"
        />
      </div>

      {/* Selected file row */}
      {file && (
        <div className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3">
          <FileText size={18} className="shrink-0 text-forest" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-sm text-ink">{file.name}</span>
          {state.status === "uploading" ? (
            <span className="flex shrink-0 items-center gap-2 text-xs font-semibold text-muted">
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              {state.progress}%
            </span>
          ) : (
            <button
              type="button"
              onClick={reset}
              aria-label="Remove selected file"
              className="shrink-0 text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
            >
              <X size={15} />
            </button>
          )}
        </div>
      )}

      {/* Upload error */}
      {state.status === "error" && (
        <p id={errorId} role="alert" className={errorBase} aria-live="polite">
          <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}

      {/* External field error (from form-level validation) */}
      {errorMessage && state.status !== "error" && (
        <p id={errorId} role="alert" className={errorBase} aria-live="polite">
          <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
          {errorMessage}
        </p>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={upload}
        disabled={state.status !== "selected"}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_-14px_rgba(18,71,52,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
        aria-label={state.status === "uploading" ? "Uploading…" : "Upload resume"}
      >
        {state.status === "uploading" ? (
          <>
            <Loader2 size={15} className="animate-spin" aria-hidden="true" />
            Uploading…
          </>
        ) : (
          "Upload Resume"
        )}
      </button>
    </div>
  );
}

// ── Success panel ─────────────────────────────────────────────────────────────

function SuccessPanel({
  referenceNumber,
  onReset,
}: {
  referenceNumber: string;
  onReset: () => void;
}) {
  return (
    <div
      className="flex flex-col gap-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col gap-4 rounded-2xl border border-forest/20 bg-forest-wash p-8">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-forest text-white">
          <Check size={20} />
        </span>
        <div>
          <h3 className="font-display text-xl font-semibold text-ink">
            Application submitted — thank you.
          </h3>
          <p className="mt-2 text-[0.95rem] text-body">
            We review every application. If there&rsquo;s a fit, we&rsquo;ll be in touch
            within 5 business days.
          </p>
        </div>

        <dl className="flex flex-col gap-2 rounded-xl border border-forest/15 bg-paper p-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Reference number</dt>
            <dd className="font-mono font-semibold text-forest">{referenceNumber}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Next steps</dt>
            <dd className="text-ink">Initial screen call</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-forest hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
        >
          Submit another application
        </button>
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_-14px_rgba(18,71,52,0.7)] transition-all hover:-translate-y-0.5 hover:bg-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
        >
          Back to Careers
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

// ── Draft banner ──────────────────────────────────────────────────────────────

function DraftBanner({
  onRestore,
  onDiscard,
}: {
  onRestore: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
      <p className="text-amber-800">
        You have a saved draft. Would you like to restore it?
      </p>
      <div className="flex shrink-0 gap-3">
        <button
          type="button"
          onClick={onRestore}
          className="font-semibold text-amber-800 underline underline-offset-2 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Restore
        </button>
        <button
          type="button"
          onClick={onDiscard}
          className="text-amber-700 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Discard
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface CareerApplicationFormProps {
  /** Pre-filled from ?role= query param */
  initialRole?: string;
}

export function CareerApplicationForm({ initialRole = "" }: CareerApplicationFormProps) {
  const resumeErrorId = useId();

  const {
    status,
    values,
    errors,
    touched,
    submitError,
    referenceNumber,
    hasDraft,
    handleChange,
    handleBlur,
    setResumeRef,
    handleSubmit,
    handleReset,
    handleRetry,
    restoreDraft,
    discardDraft,
    noticePeriodOptions,
    heardAboutUsOptions,
  } = useCareerApplication(initialRole);

  if (status === "success" && referenceNumber) {
    return <SuccessPanel referenceNumber={referenceNumber} onReset={handleReset} />;
  }

  const isSubmitting = status === "submitting" || status === "validating";

  function field(
    name: string,
    label: string,
    children: React.ReactNode,
    required = false,
  ) {
    const fieldName = name as keyof typeof errors;
    const err = errors[fieldName];
    const isTouched = touched[name as keyof typeof touched];
    const errorId = `career-${name}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`career-${name}`} className={labelBase}>
          {label}{" "}
          {required && (
            <span className="text-forest" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {children}
        {isTouched && err && <FieldError id={errorId} message={err} />}
      </div>
    );
  }

  function inputProps(
    name: keyof typeof values,
    required = false,
  ) {
    const err = errors[name as keyof typeof errors];
    const isTouched = touched[name as keyof typeof touched];
    return {
      id: `career-${name}`,
      name,
      required,
      value: values[name],
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
      ) => handleChange(name, e.target.value),
      onBlur: () => handleBlur(name),
      "aria-required": required ? ("true" as const) : ("false" as const),
      "aria-invalid": !!(err && isTouched),
      "aria-describedby": err && isTouched ? `career-${name}-error` : undefined,
      className: fieldBase,
    };
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
      aria-label="Career Application — WnRTech"
      noValidate
    >
      {/* Draft restore banner */}
      {hasDraft && (
        <DraftBanner onRestore={restoreDraft} onDiscard={discardDraft} />
      )}

      {/* Error summary */}
      {submitError && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Unable to submit your application.</p>
            <p className="mt-0.5">{submitError}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-1 text-xs font-semibold underline underline-offset-2 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Section: Personal Details */}
      <div className="flex flex-col gap-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-forest">
          Personal Details
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          {field(
            "firstName",
            "First Name",
            <input
              {...inputProps("firstName", true)}
              type="text"
              autoComplete="given-name"
              placeholder="First name"
            />,
            true,
          )}
          {field(
            "lastName",
            "Last Name",
            <input
              {...inputProps("lastName", true)}
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
            />,
            true,
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {field(
            "email",
            "Email",
            <input
              {...inputProps("email", true)}
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@company.com"
            />,
            true,
          )}
          {field(
            "phone",
            "Phone Number",
            <input
              {...inputProps("phone", true)}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+91 98765 43210"
            />,
            true,
          )}
        </div>

        {field(
          "currentLocation",
          "Current Location",
          <input
            {...inputProps("currentLocation", true)}
            type="text"
            autoComplete="address-level2"
            placeholder="City, Country"
          />,
          true,
        )}
      </div>

      {/* Section: Professional Details */}
      <div className="flex flex-col gap-5 border-t border-line pt-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-forest">
          Professional Details
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          {field(
            "yearsOfExperience",
            "Years of Experience",
            <input
              {...inputProps("yearsOfExperience", true)}
              type="number"
              min="0"
              max="60"
              inputMode="numeric"
              placeholder="e.g. 5"
            />,
            true,
          )}
          {field(
            "currentCompany",
            "Current Company",
            <input
              {...inputProps("currentCompany")}
              type="text"
              autoComplete="organization"
              placeholder="Your current employer"
            />,
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {field(
            "currentDesignation",
            "Current Designation",
            <input
              {...inputProps("currentDesignation")}
              type="text"
              placeholder="e.g. Senior Engineer"
            />,
          )}
          {field(
            "preferredRole",
            "Preferred Role",
            <input
              {...inputProps("preferredRole")}
              type="text"
              placeholder="Role you're applying for"
            />,
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {field(
            "linkedInUrl",
            "LinkedIn URL",
            <input
              {...inputProps("linkedInUrl")}
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="https://linkedin.com/in/…"
            />,
          )}
          {field(
            "portfolioUrl",
            "Portfolio / GitHub",
            <input
              {...inputProps("portfolioUrl")}
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="https://github.com/…"
            />,
          )}
        </div>
      </div>

      {/* Section: Application Details */}
      <div className="flex flex-col gap-5 border-t border-line pt-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-forest">
          Application Details
        </p>

        {/* Resume Upload */}
        <div className="flex flex-col gap-1.5">
          <span className={labelBase}>
            Resume <span className="text-forest" aria-hidden="true">*</span>
          </span>
          <ResumeField
            onSuccess={setResumeRef}
            errorMessage={touched.resumeRef ? errors.resumeRef : undefined}
            errorId={resumeErrorId}
          />
        </div>

        {field(
          "coverLetter",
          "Cover Letter",
          <textarea
            {...inputProps("coverLetter")}
            rows={4}
            placeholder="Tell us why you'd be a great fit for WnRTech…"
            className={`${fieldBase} resize-none`}
          />,
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {field(
            "expectedCtc",
            "Expected CTC",
            <input
              {...inputProps("expectedCtc")}
              type="text"
              inputMode="numeric"
              placeholder="e.g. 1200000"
            />,
          )}
          {field(
            "noticePeriod",
            "Notice Period",
            <select
              {...inputProps("noticePeriod")}
              className={`${fieldBase} cursor-pointer`}
            >
              <option value="">Select notice period…</option>
              {noticePeriodOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>,
          )}
        </div>

        {field(
          "heardAboutUs",
          "How did you hear about us?",
          <select
            {...inputProps("heardAboutUs")}
            className={`${fieldBase} cursor-pointer`}
          >
            <option value="">Select an option…</option>
            {heardAboutUsOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>,
        )}
      </div>

      {/* Honeypot — hidden from humans, traps bots */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="career-honeypot">Leave this field empty</label>
        <input
          id="career-honeypot"
          name="honeypot"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.honeypot}
          onChange={(e) => handleChange("honeypot", e.target.value)}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_-14px_rgba(18,71,52,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Submitting Application…
          </>
        ) : (
          <>
            Submit Application
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}

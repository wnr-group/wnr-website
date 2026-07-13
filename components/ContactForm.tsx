"use client";

/**
 * components/ContactForm.tsx — Standalone Contact (Let's Talk) form.
 *
 * Separate from CareerApplicationForm — business enquiries only.
 * Fields: Name, Email, Organization, Contact Number, Region, Inquiry Type, Message.
 * Matches the visual language of the existing LeadForm (fieldBase/labelBase).
 */

import { Check, AlertCircle, Loader2 } from "lucide-react";
import { useContactForm } from "@/hooks/useContactForm";
import { REGION_OPTIONS, INQUIRY_TYPE_OPTIONS } from "@/types/contact";

// ── Shared style tokens (match existing LeadForm exactly) ─────────────────────
const fieldBase =
  "w-full rounded-lg border border-line bg-paper px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted/70 transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/25";

const labelBase = "text-sm font-medium text-ink";

const errorBase = "mt-1 flex items-center gap-1.5 text-xs text-destructive";

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className={errorBase} aria-live="polite">
      <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

function SuccessPanel({
  referenceNumber,
  onReset,
}: {
  referenceNumber: string;
  onReset: () => void;
}) {
  return (
    <div
      className="flex flex-col gap-5 rounded-2xl border border-forest/20 bg-forest-wash p-8"
      role="status"
      aria-live="polite"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-forest text-white">
        <Check size={20} />
      </span>
      <div>
        <h3 className="font-display text-xl font-semibold text-ink">
          Message received — thank you.
        </h3>
        <p className="mt-2 text-[0.95rem] text-body">
          A member of our team will be in touch within one business day.
        </p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Reference:{" "}
          <span className="font-mono text-forest">{referenceNumber}</span>
        </p>
      </div>
      <div className="flex flex-wrap gap-3 border-t border-line pt-5">
        <p className="text-sm text-body">
          Need to send another enquiry?
        </p>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-semibold text-forest underline underline-offset-2 hover:text-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
        >
          Start a new enquiry
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ContactForm() {
  const {
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
  } = useContactForm();

  if (status === "success" && referenceNumber) {
    return <SuccessPanel referenceNumber={referenceNumber} onReset={handleReset} />;
  }

  const isSubmitting = status === "submitting" || status === "validating";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
      aria-label="Contact WnR Group — Let's Talk"
      noValidate
    >
      {/* Error summary */}
      {submitError && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Unable to send your message.</p>
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

      {/* Row 1: Name + Email */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className={labelBase}>
            Name <span className="text-forest" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your full name"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            aria-required="true"
            aria-invalid={!!errors.name && touched.name}
            aria-describedby={errors.name && touched.name ? "contact-name-error" : undefined}
            className={fieldBase}
          />
          {touched.name && <FieldError id="contact-name-error" message={errors.name} />}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className={labelBase}>
            Email <span className="text-forest" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            aria-required="true"
            aria-invalid={!!errors.email && touched.email}
            aria-describedby={errors.email && touched.email ? "contact-email-error" : undefined}
            className={fieldBase}
          />
          {touched.email && <FieldError id="contact-email-error" message={errors.email} />}
        </div>
      </div>

      {/* Row 2: Organization + Contact Number */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-organization" className={labelBase}>
            Organization <span className="text-forest" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-organization"
            name="organization"
            type="text"
            required
            autoComplete="organization"
            placeholder="Your company name"
            value={values.organization}
            onChange={(e) => handleChange("organization", e.target.value)}
            onBlur={() => handleBlur("organization")}
            aria-required="true"
            aria-invalid={!!errors.organization && touched.organization}
            aria-describedby={
              errors.organization && touched.organization
                ? "contact-organization-error"
                : undefined
            }
            className={fieldBase}
          />
          {touched.organization && (
            <FieldError id="contact-organization-error" message={errors.organization} />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-contactNumber" className={labelBase}>
            Contact Number <span className="text-forest" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-contactNumber"
            name="contactNumber"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="+1 555 000 0000"
            value={values.contactNumber}
            onChange={(e) => handleChange("contactNumber", e.target.value)}
            onBlur={() => handleBlur("contactNumber")}
            aria-required="true"
            aria-invalid={!!errors.contactNumber && touched.contactNumber}
            aria-describedby={
              errors.contactNumber && touched.contactNumber
                ? "contact-contactNumber-error"
                : undefined
            }
            className={fieldBase}
          />
          {touched.contactNumber && (
            <FieldError id="contact-contactNumber-error" message={errors.contactNumber} />
          )}
        </div>
      </div>

      {/* Row 3: Region + Inquiry Type */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-region" className={labelBase}>
            Region <span className="text-forest" aria-hidden="true">*</span>
          </label>
          <select
            id="contact-region"
            name="region"
            required
            value={values.region}
            onChange={(e) => handleChange("region", e.target.value)}
            onBlur={() => handleBlur("region")}
            aria-required="true"
            aria-invalid={!!errors.region && touched.region}
            aria-describedby={errors.region && touched.region ? "contact-region-error" : undefined}
            className={`${fieldBase} cursor-pointer`}
          >
            <option value="">Select region…</option>
            {REGION_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {touched.region && <FieldError id="contact-region-error" message={errors.region} />}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-inquiryType" className={labelBase}>
            Inquiry Type <span className="text-forest" aria-hidden="true">*</span>
          </label>
          <select
            id="contact-inquiryType"
            name="inquiryType"
            required
            value={values.inquiryType}
            onChange={(e) => handleChange("inquiryType", e.target.value)}
            onBlur={() => handleBlur("inquiryType")}
            aria-required="true"
            aria-invalid={!!errors.inquiryType && touched.inquiryType}
            aria-describedby={
              errors.inquiryType && touched.inquiryType ? "contact-inquiryType-error" : undefined
            }
            className={`${fieldBase} cursor-pointer`}
          >
            <option value="">Select inquiry type…</option>
            {INQUIRY_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {touched.inquiryType && (
            <FieldError id="contact-inquiryType-error" message={errors.inquiryType} />
          )}
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className={labelBase}>
          Message <span className="text-forest" aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          placeholder="Tell us about your business and what you're trying to solve…"
          value={values.message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          aria-required="true"
          aria-invalid={!!errors.message && touched.message}
          aria-describedby={
            errors.message && touched.message ? "contact-message-error" : undefined
          }
          className={`${fieldBase} resize-none`}
        />
        {touched.message && (
          <FieldError id="contact-message-error" message={errors.message} />
        )}
      </div>

      {/* Honeypot — visually hidden, bots fill it, humans don't */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-honeypot">Leave this field empty</label>
        <input
          id="contact-honeypot"
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
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_-14px_rgba(18,71,52,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}

/**
 * services/email/provider.ts — Email provider interface and factory.
 *
 * The interface defines the four required email flows.
 * The factory returns the configured provider (currently always stub).
 *
 * To swap providers (Resend, SES, Mailgun):
 *   1. Implement EmailProvider in a new file (e.g. resend.provider.ts)
 *   2. Return it from getEmailProvider() based on an env var
 *   3. Zero changes to call sites
 */

import type { CareerApplicationDomain } from "@/types/career";
import type { ContactEnquiryDomain } from "@/types/contact";
import { StubEmailProvider } from "./stub.provider";

// ── Interface ─────────────────────────────────────────────────────────────────

export interface EmailProvider {
  /**
   * Confirmation email sent to the job applicant.
   * Subject: "Application received — WnR Group"
   */
  sendCandidateConfirmation(
    to: string,
    data: CareerApplicationDomain,
    resumeRef: string,
  ): Promise<void>;

  /**
   * Internal notification sent to HR when a new application arrives.
   * Includes resume reference for retrieval.
   */
  sendHRNotification(
    data: CareerApplicationDomain,
    resumeRef: string,
  ): Promise<void>;

  /**
   * Thank-you email sent to the enquirer after contact form submission.
   * Subject: "We've received your enquiry — WnR Group"
   */
  sendCustomerConfirmation(
    to: string,
    data: ContactEnquiryDomain,
  ): Promise<void>;

  /**
   * Internal notification sent to the sales/admin team on new enquiry.
   */
  sendSalesNotification(data: ContactEnquiryDomain): Promise<void>;
}

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Return the active email provider.
 * Extend this function to support additional providers via env var routing.
 */
export function getEmailProvider(): EmailProvider {
  // TODO: Route by process.env.EMAIL_PROVIDER
  // if (process.env.EMAIL_PROVIDER === "resend") return new ResendEmailProvider();
  return new StubEmailProvider();
}

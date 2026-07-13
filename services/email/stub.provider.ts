/**
 * services/email/stub.provider.ts — Stub email provider.
 *
 * Logs all emails via the structured logger. Does not send real email.
 * EMAILS_ENABLED = false (default) keeps this as the active provider.
 * Set EMAILS_ENABLED = true and wire a real provider in provider.ts to activate.
 */

import type { EmailProvider } from "./provider";
import type { CareerApplicationDomain } from "@/types/career";
import type { ContactEnquiryDomain } from "@/types/contact";
import { logger, maskEmail } from "@/lib/logger";
import { HR_EMAIL, SALES_EMAIL } from "@/lib/env";

export class StubEmailProvider implements EmailProvider {
  async sendCandidateConfirmation(
    to: string,
    data: CareerApplicationDomain,
    resumeRef: string,
  ): Promise<void> {
    logger.info(
      {
        emailType: "candidate_confirmation",
        to: maskEmail(to),
        applicantName: data.fullName,
        resumeRef,
      },
      "[email:stub] Would send candidate confirmation",
    );
  }

  async sendHRNotification(
    data: CareerApplicationDomain,
    resumeRef: string,
  ): Promise<void> {
    logger.info(
      {
        emailType: "hr_notification",
        to: maskEmail(HR_EMAIL),
        applicantName: data.fullName,
        preferredRole: data.preferredRole,
        resumeRef,
      },
      "[email:stub] Would send HR notification",
    );
  }

  async sendCustomerConfirmation(
    to: string,
    data: ContactEnquiryDomain,
  ): Promise<void> {
    logger.info(
      {
        emailType: "customer_confirmation",
        to: maskEmail(to),
        inquiryType: data.inquiryType,
        region: data.region,
      },
      "[email:stub] Would send customer confirmation",
    );
  }

  async sendSalesNotification(data: ContactEnquiryDomain): Promise<void> {
    logger.info(
      {
        emailType: "sales_notification",
        to: maskEmail(SALES_EMAIL),
        inquiryType: data.inquiryType,
        organization: data.organization,
        region: data.region,
      },
      "[email:stub] Would send sales notification",
    );
  }
}

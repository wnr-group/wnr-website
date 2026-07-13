/**
 * services/storage/contact.repository.ts — Contact enquiry storage repository.
 *
 * Same repository pattern as career.repository.ts — log-only now,
 * swappable for a real database without API changes.
 */

import type { ContactEnquiryRecord } from "@/types/contact";
import { logger, maskEmail } from "@/lib/logger";
import { randomBytes } from "node:crypto";

// ── Interface ─────────────────────────────────────────────────────────────────

export interface ContactRepository {
  /**
   * Persist a contact enquiry record.
   * Returns the assigned record ID (used as the reference number).
   */
  save(record: ContactEnquiryRecord): Promise<{ id: string }>;
}

// ── Log-only implementation ───────────────────────────────────────────────────

export class LogContactRepository implements ContactRepository {
  async save(record: ContactEnquiryRecord): Promise<{ id: string }> {
    logger.info(
      {
        requestId: record.meta.requestId,
        recordId: record.id,
        contact: maskEmail(record.contact.email),
        organization: record.contact.organization,
        inquiryType: record.enquiry.inquiryType,
        region: record.enquiry.region,
        submittedAt: record.submittedAt,
      },
      "[contact-repo] Enquiry received",
    );
    return { id: record.id };
  }
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function getContactRepository(): ContactRepository {
  // TODO: return new PrismaContactRepository() when DB is wired
  return new LogContactRepository();
}

// ── ID generator ──────────────────────────────────────────────────────────────

/** Generate a human-readable enquiry reference number. */
export function generateEnquiryId(): string {
  const hex = randomBytes(4).toString("hex").toUpperCase();
  return `WNR-ENQ-${hex}`;
}

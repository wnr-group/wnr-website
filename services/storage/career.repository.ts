/**
 * services/storage/career.repository.ts — Career application storage repository.
 *
 * Repository pattern: the interface defines the contract; the implementation
 * can be swapped from log-only → Prisma/Drizzle/Postgres without changing
 * any API route or business logic.
 */

import type { JobApplicationRecord } from "@/types/career";
import { logger, maskEmail } from "@/lib/logger";
import { randomBytes } from "node:crypto";

// ── Interface ─────────────────────────────────────────────────────────────────

export interface CareerRepository {
  /**
   * Persist a job application record.
   * Returns the assigned record ID (used as the reference number).
   */
  save(record: JobApplicationRecord): Promise<{ id: string }>;
}

// ── Log-only implementation ───────────────────────────────────────────────────

export class LogCareerRepository implements CareerRepository {
  async save(record: JobApplicationRecord): Promise<{ id: string }> {
    logger.info(
      {
        requestId: record.meta.requestId,
        recordId: record.id,
        applicant: maskEmail(record.applicant.email),
        preferredRole: record.professional.preferredRole,
        resumeRef: record.application.resumeRef,
        submittedAt: record.submittedAt,
      },
      "[career-repo] Job application received",
    );
    return { id: record.id };
  }
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function getCareerRepository(): CareerRepository {
  // TODO: return new PrismaCareerRepository() when DB is wired
  return new LogCareerRepository();
}

// ── ID generator ──────────────────────────────────────────────────────────────

/** Generate a human-readable application reference number. */
export function generateApplicationId(): string {
  const hex = randomBytes(4).toString("hex").toUpperCase();
  return `WNR-APP-${hex}`;
}

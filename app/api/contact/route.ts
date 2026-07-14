import { ok, fail, failUnknown } from "@/lib/api-response";
import {
  BadRequestError,
  RateLimitError,
  ValidationError,
  isAppError,
} from "@/lib/errors";
import { generateRequestId, generateTraceId } from "@/lib/request-id";
import { logger, maskEmail } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeAll } from "@/lib/validation/sanitize";
import { validateContactEnquiry } from "@/validation/contact.schema";
import { getContactRepository, generateEnquiryId } from "@/services/storage/contact.repository";
import { getEmailProvider } from "@/services/email/provider";
import type {
  ContactEnquiryRequestDTO,
  ContactEnquiryDomain,
  ContactEnquiryRecord,
} from "@/types/contact";
import { REGION_OPTIONS, INQUIRY_TYPE_OPTIONS } from "@/types/contact";
import { RATE_LIMIT_CONTACT, RATE_LIMIT_WINDOW_MS } from "@/lib/env";
import { NextResponse } from "next/server";

// ── Helpers ───────────────────────────────────────────────────────────────────

function clientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

function mapToDomain(dto: ContactEnquiryRequestDTO): ContactEnquiryDomain {
  return {
    name: dto.name,
    email: dto.email,
    organization: dto.organization,
    contactNumber: dto.contactNumber,
    region: dto.region as ContactEnquiryDomain["region"],
    inquiryType: dto.inquiryType as ContactEnquiryDomain["inquiryType"],
    message: dto.message,
  };
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = generateRequestId();
  const traceId = generateTraceId();
  const startMs = Date.now();
  const ip = clientIp(request);
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  const logCtx = { requestId, traceId, endpoint: "POST /api/contact", ip };

  try {
    // ── Rate limit ──────────────────────────────────────────────────────────
    const limit = rateLimit(`contact:${ip}`, {
      limit: RATE_LIMIT_CONTACT,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });
    if (!limit.allowed) {
      throw new RateLimitError(limit.retryAfterMs);
    }

    // ── Parse JSON ──────────────────────────────────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new BadRequestError("Expected JSON body.");
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new BadRequestError("Expected a JSON object.");
    }

    // ── Extract and sanitize ─────────────────────────────────────────────────
    const raw = body as Record<string, unknown>;
    const stringFields: Array<keyof ContactEnquiryRequestDTO> = [
      "name", "email", "organization", "contactNumber",
      "region", "inquiryType", "message", "honeypot",
    ];
    const toSanitize: Record<string, string> = {};
    for (const field of stringFields) {
      toSanitize[field] = typeof raw[field] === "string" ? (raw[field] as string) : "";
    }
    const sanitized = sanitizeAll(toSanitize);

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

    // ── Validate ─────────────────────────────────────────────────────────────
    const validation = validateContactEnquiry(dto);
    if (!validation.valid) {
      throw new ValidationError(validation.errors, "Validation failed.");
    }

    // ── Map to domain ────────────────────────────────────────────────────────
    // Extra guard: ensure region and inquiryType are within allowed values
    if (!REGION_OPTIONS.includes(dto.region as typeof REGION_OPTIONS[number])) {
      throw new ValidationError(
        [{ field: "region", message: "Invalid region." }],
      );
    }
    if (!INQUIRY_TYPE_OPTIONS.includes(dto.inquiryType as typeof INQUIRY_TYPE_OPTIONS[number])) {
      throw new ValidationError(
        [{ field: "inquiryType", message: "Invalid inquiry type." }],
      );
    }

    const domain = mapToDomain(dto);

    // ── Persist ──────────────────────────────────────────────────────────────
    const enquiryId = generateEnquiryId();
    const record: ContactEnquiryRecord = {
      id: enquiryId,
      submittedAt: new Date().toISOString(),
      contact: {
        name: domain.name,
        email: domain.email,
        organization: domain.organization,
        contactNumber: domain.contactNumber,
      },
      enquiry: {
        region: domain.region,
        inquiryType: domain.inquiryType,
        message: domain.message,
      },
      meta: { ip, userAgent, requestId },
    };

    await getContactRepository().save(record);

    // ── Send emails (non-blocking) ───────────────────────────────────────────
    const emailProvider = getEmailProvider();
    Promise.allSettled([
      emailProvider.sendCustomerConfirmation(domain.email, domain),
      emailProvider.sendSalesNotification(domain),
    ]).catch((err) => {
      logger.error(logCtx, "Email dispatch failed", err);
    });

    logger.info(
      {
        ...logCtx,
        enquiryId,
        contact: maskEmail(domain.email),
        inquiryType: domain.inquiryType,
        region: domain.region,
        durationMs: Date.now() - startMs,
        status: 200,
      },
      "Contact enquiry accepted",
    );

    return ok(
      {
        referenceNumber: enquiryId,
        message:
          "Thank you for reaching out. A member of our team will be in touch within one business day.",
      },
      requestId,
    );
  } catch (err) {
    const durationMs = Date.now() - startMs;
    if (isAppError(err)) {
      logger.warn(
        { ...logCtx, errorCode: err.code, status: err.statusCode, durationMs },
        err.message,
      );
      return fail(err, requestId);
    }
    logger.error({ ...logCtx, durationMs }, "Unhandled error in contact", err);
    return failUnknown(requestId);
  }
}

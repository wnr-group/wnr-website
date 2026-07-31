import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

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
import { validateFileMeta, validateFileSignature, getExtension } from "@/lib/file-validation";
import { scanResume } from "@/lib/virus-scan";
import { sanitizeAll, sanitizeFilename } from "@/lib/validation/sanitize";
import { validateCareerApplication } from "@/validation/career.schema";
import { getCareerRepository, generateApplicationId } from "@/services/storage/career.repository";
import { getEmailProvider } from "@/services/email/provider";
import type {
  CareerApplicationRequestDTO,
  CareerApplicationDomain,
  JobApplicationRecord,
} from "@/types/career";
import { NOTICE_PERIOD_OPTIONS, HEARD_ABOUT_US_OPTIONS } from "@/types/career";
import {
  RATE_LIMIT_CAREER_APPLY,
  RATE_LIMIT_WINDOW_MS,
  MAX_RESUME_SIZE_BYTES,
  ALLOWED_FILE_EXTENSIONS,
} from "@/lib/env";
import { resumeConfig } from "@/content/careers";

// ── Helpers ───────────────────────────────────────────────────────────────────

function clientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

function mapToDomain(
  dto: CareerApplicationRequestDTO,
  resumeRef: string,
): CareerApplicationDomain {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    fullName: `${dto.firstName} ${dto.lastName}`.trim(),
    email: dto.email,
    phone: dto.phone,
    currentLocation: dto.currentLocation,
    yearsOfExperience: parseInt(dto.yearsOfExperience, 10),
    currentCompany: dto.currentCompany || null,
    currentDesignation: dto.currentDesignation || null,
    linkedInUrl: dto.linkedInUrl || null,
    portfolioUrl: dto.portfolioUrl || null,
    resumeRef,
    coverLetter: dto.coverLetter || null,
    expectedCtc: dto.expectedCtc ? parseFloat(dto.expectedCtc) : null,
    noticePeriod:
      NOTICE_PERIOD_OPTIONS.includes(dto.noticePeriod as typeof NOTICE_PERIOD_OPTIONS[number])
        ? (dto.noticePeriod as CareerApplicationDomain["noticePeriod"])
        : null,
    preferredRole: dto.preferredRole || null,
    heardAboutUs:
      HEARD_ABOUT_US_OPTIONS.includes(dto.heardAboutUs as typeof HEARD_ABOUT_US_OPTIONS[number])
        ? (dto.heardAboutUs as CareerApplicationDomain["heardAboutUs"])
        : null,
  };
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = generateRequestId();
  const traceId = generateTraceId();
  const startMs = Date.now();
  const ip = clientIp(request);
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  const logCtx = { requestId, traceId, endpoint: "POST /api/careers/apply", ip };

  try {
    // ── Rate limit ──────────────────────────────────────────────────────────
    const limit = rateLimit(`career-apply:${ip}`, {
      limit: RATE_LIMIT_CAREER_APPLY,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });
    if (!limit.allowed) {
      throw new RateLimitError(limit.retryAfterMs);
    }

    // ── Parse multipart ─────────────────────────────────────────────────────
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      throw new BadRequestError("Expected multipart/form-data.");
    }

    // ── Extract and sanitize string fields ──────────────────────────────────
    const raw: Record<string, string> = {};
    const stringFields: Array<keyof CareerApplicationRequestDTO> = [
      "firstName", "lastName", "email", "phone", "currentLocation",
      "yearsOfExperience", "currentCompany", "currentDesignation",
      "linkedInUrl", "portfolioUrl", "resumeRef", "coverLetter",
      "expectedCtc", "noticePeriod", "preferredRole", "heardAboutUs", "honeypot",
    ];
    for (const field of stringFields) {
      raw[field] = String(formData.get(field) ?? "");
    }
    const sanitized = sanitizeAll(raw);

    // ── Validate file ────────────────────────────────────────────────────────
    const resumeFile = formData.get("resume");
    if (!(resumeFile instanceof File)) {
      throw new ValidationError(
        [{ field: "resumeRef", message: "Resume file is required." }],
        "Resume file is required.",
      );
    }

    const fileConfig = {
      maxSizeBytes: MAX_RESUME_SIZE_BYTES,
      acceptedExtensions: ALLOWED_FILE_EXTENSIONS,
      acceptedMimeTypes: resumeConfig.acceptedMimeTypes as readonly string[],
    };

    const metaError = validateFileMeta(
      { name: resumeFile.name, size: resumeFile.size, type: resumeFile.type },
      fileConfig,
    );
    if (metaError) {
      throw new ValidationError(
        [{ field: "resumeRef", message: metaError }],
        metaError,
      );
    }

    const bytes = new Uint8Array(await resumeFile.arrayBuffer());
    const extension = getExtension(resumeFile.name);
    const signatureError = validateFileSignature(bytes, extension);
    if (signatureError) {
      throw new ValidationError(
        [{ field: "resumeRef", message: signatureError }],
        signatureError,
      );
    }

    // ── Virus scan ───────────────────────────────────────────────────────────
    const scanResult = await scanResume(bytes);
    if (!scanResult.clean) {
      throw new ValidationError(
        [{ field: "resumeRef", message: "File was rejected by security scan." }],
        "File was rejected by security scan.",
      );
    }

    // ── Build DTO for validation ─────────────────────────────────────────────
    const dto: CareerApplicationRequestDTO = {
      firstName: sanitized.firstName,
      lastName: sanitized.lastName,
      email: sanitized.email,
      phone: sanitized.phone,
      currentLocation: sanitized.currentLocation,
      yearsOfExperience: sanitized.yearsOfExperience,
      currentCompany: sanitized.currentCompany,
      currentDesignation: sanitized.currentDesignation,
      linkedInUrl: sanitized.linkedInUrl,
      portfolioUrl: sanitized.portfolioUrl,
      resumeRef: "pending", // will be set after file write
      coverLetter: sanitized.coverLetter,
      expectedCtc: sanitized.expectedCtc,
      noticePeriod: sanitized.noticePeriod,
      preferredRole: sanitized.preferredRole,
      heardAboutUs: sanitized.heardAboutUs,
      honeypot: sanitized.honeypot,
    };

    const validation = validateCareerApplication(dto);
    if (!validation.valid) {
      throw new ValidationError(validation.errors, "Validation failed.");
    }

    // ── Store resume file ────────────────────────────────────────────────────
    const safeFilename = sanitizeFilename(resumeFile.name);
    const uploadDir = path.join(tmpdir(), "wnr-resumes");
    await mkdir(uploadDir, { recursive: true });
    const storedName = `${randomUUID()}${extension}`;
    await writeFile(path.join(uploadDir, storedName), bytes);
    const resumeRef = storedName;

    // ── Map to domain ────────────────────────────────────────────────────────
    const domain = mapToDomain({ ...dto, resumeRef }, resumeRef);

    // ── Persist ──────────────────────────────────────────────────────────────
    const applicationId = generateApplicationId();
    const record: JobApplicationRecord = {
      id: applicationId,
      submittedAt: new Date().toISOString(),
      applicant: {
        firstName: domain.firstName,
        lastName: domain.lastName,
        email: domain.email,
        phone: domain.phone,
        currentLocation: domain.currentLocation,
      },
      professional: {
        yearsOfExperience: domain.yearsOfExperience,
        currentCompany: domain.currentCompany,
        currentDesignation: domain.currentDesignation,
        linkedInUrl: domain.linkedInUrl,
        portfolioUrl: domain.portfolioUrl,
        expectedCtc: domain.expectedCtc,
        noticePeriod: domain.noticePeriod,
        preferredRole: domain.preferredRole,
      },
      application: {
        resumeRef,
        coverLetter: domain.coverLetter,
        heardAboutUs: domain.heardAboutUs,
      },
      meta: { ip, userAgent, requestId },
    };

    await getCareerRepository().save(record);

    // ── Send emails (non-blocking — don't fail the request on email error) ──
    const emailProvider = getEmailProvider();
    Promise.allSettled([
      emailProvider.sendCandidateConfirmation(domain.email, domain, resumeRef),
      emailProvider.sendHRNotification(domain, resumeRef),
    ]).catch((err) => {
      logger.error(logCtx, "Email dispatch failed", err);
    });

    logger.info(
      {
        ...logCtx,
        applicationId,
        applicant: maskEmail(domain.email),
        originalFilename: safeFilename,
        resumeRef,
        durationMs: Date.now() - startMs,
        status: 200,
      },
      "Career application accepted",
    );

    return ok(
      {
        referenceNumber: applicationId,
        message:
          "Application received. We'll be in touch if there's a fit, usually within 5 business days.",
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
    logger.error({ ...logCtx, durationMs }, "Unhandled error in career apply", err);
    return failUnknown(requestId);
  }
}

/**
 * services/contact.ts — Client-side contact enquiry submission service.
 *
 * Sends a JSON POST to /api/contact.
 * Uses fetch (no file upload, so XHR progress events aren't needed).
 *
 * Retry policy:
 *   - Retries on network errors and 5xx (max 2 retries, exponential backoff)
 *   - Never retries 400 / 401 / 403 / 404 / 422 / 429
 */

import type { ContactEnquiryRequestDTO, ContactEnquiryResponseDTO } from "@/types/contact";
import type { ApiResponse } from "@/types/api";
import { REQUEST_TIMEOUT_MS, MAX_RETRIES } from "@/lib/env";

export interface ContactSuccess {
  ok: true;
  data: ContactEnquiryResponseDTO;
  requestId: string;
}

export interface ContactFailure {
  ok: false;
  kind:
    | "validation"
    | "rate_limited"
    | "network"
    | "timeout"
    | "server"
    | "aborted"
    | "bad_request";
  message: string;
  fieldErrors?: { field: string; message: string }[];
  requestId?: string;
}

export type ContactResult = ContactSuccess | ContactFailure;

export interface ContactOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

const NO_RETRY_STATUSES = new Set([400, 401, 403, 404, 422, 429]);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptSubmit(
  dto: ContactEnquiryRequestDTO,
  options: ContactOptions,
  attempt: number,
): Promise<ContactResult> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;

  // Chain with caller's signal if provided
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const cleanup = () => clearTimeout(timeoutId);

  if (options.signal?.aborted) {
    cleanup();
    return { ok: false, kind: "aborted", message: "Request cancelled." };
  }

  options.signal?.addEventListener("abort", () => controller.abort());

  let response: Response;
  try {
    response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
      signal: controller.signal,
    });
  } catch (err) {
    cleanup();
    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        ok: false,
        kind: controller.signal.reason === "timeout" ? "timeout" : "aborted",
        message:
          controller.signal.reason === "timeout"
            ? "The request timed out. Please try again."
            : "Request cancelled.",
      };
    }
    // Network error — maybe retry
    if (attempt < MAX_RETRIES) {
      await delay(1000 * Math.pow(2, attempt));
      return attemptSubmit(dto, options, attempt + 1);
    }
    return {
      ok: false,
      kind: "network",
      message: "Could not reach the server. Check your connection and try again.",
    };
  } finally {
    cleanup();
  }

  let parsed: ApiResponse<ContactEnquiryResponseDTO> | null = null;
  try {
    parsed = (await response.json()) as ApiResponse<ContactEnquiryResponseDTO>;
  } catch {
    // JSON parse failure — treat as server error
  }

  const requestId = parsed?.requestId;

  if (response.ok && parsed?.success && parsed.data) {
    return { ok: true, data: parsed.data, requestId: requestId ?? "" };
  }

  if (response.status === 422) {
    return {
      ok: false,
      kind: "validation",
      message: parsed?.error?.message ?? "Please check the form and try again.",
      fieldErrors: parsed?.error?.fieldErrors,
      requestId,
    };
  }

  if (response.status === 429) {
    return {
      ok: false,
      kind: "rate_limited",
      message: parsed?.error?.message ?? "Too many submissions. Please try again later.",
      requestId,
    };
  }

  if (response.status === 400) {
    return {
      ok: false,
      kind: "bad_request",
      message: parsed?.error?.message ?? "Invalid submission.",
      requestId,
    };
  }

  // 5xx — retry if attempts remaining
  if (!NO_RETRY_STATUSES.has(response.status) && attempt < MAX_RETRIES) {
    await delay(1000 * Math.pow(2, attempt));
    return attemptSubmit(dto, options, attempt + 1);
  }

  return {
    ok: false,
    kind: "server",
    message: parsed?.error?.message ?? "Something went wrong. Please try again.",
    requestId,
  };
}

/**
 * Submit a contact enquiry.
 *
 * @param dto     — sanitized and validated contact form data
 * @param options — AbortSignal, timeout override
 */
export function submitContact(
  dto: ContactEnquiryRequestDTO,
  options: ContactOptions = {},
): Promise<ContactResult> {
  return attemptSubmit(dto, options, 0);
}

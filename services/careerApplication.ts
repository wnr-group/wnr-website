/**
 * services/careerApplication.ts — Client-side career application submission service.
 *
 * Sends a multipart/form-data POST to /api/careers/apply.
 * Uses XHR (not fetch) to support upload progress events.
 *
 * Retry policy:
 *   - Retries on network errors and 5xx responses (max 2 retries, exponential backoff)
 *   - Never retries 400 / 401 / 403 / 404 / 413 / 415 / 422 / 429
 */

import type { CareerApplicationResponseDTO } from "@/types/career";
import type { ApiResponse } from "@/types/api";
import { REQUEST_TIMEOUT_MS, MAX_RETRIES } from "@/lib/env";

export interface CareerApplicationSuccess {
  ok: true;
  data: CareerApplicationResponseDTO;
  requestId: string;
}

export interface CareerApplicationFailure {
  ok: false;
  kind:
    | "validation"
    | "rate_limited"
    | "network"
    | "timeout"
    | "server"
    | "aborted"
    | "bad_request"
    | "payload_too_large";
  message: string;
  fieldErrors?: { field: string; message: string }[];
  requestId?: string;
}

export type CareerApplicationResult =
  | CareerApplicationSuccess
  | CareerApplicationFailure;

export interface CareerApplicationOptions {
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
  timeoutMs?: number;
}

/** Status codes that should never trigger a retry. */
const NO_RETRY_STATUSES = new Set([400, 401, 403, 404, 413, 415, 422, 429]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseApiResponse(
  text: string,
): ApiResponse<CareerApplicationResponseDTO> | null {
  try {
    const parsed: unknown = JSON.parse(text);
    return isRecord(parsed) ? (parsed as unknown as ApiResponse<CareerApplicationResponseDTO>) : null;
  } catch {
    return null;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function xhrUpload(
  formData: FormData,
  options: CareerApplicationOptions,
  attempt: number,
): Promise<CareerApplicationResult> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    let settled = false;

    const finish = (result: CareerApplicationResult) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && options.onProgress) {
        options.onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.addEventListener("timeout", () =>
      finish({
        ok: false,
        kind: "timeout",
        message: "The upload timed out. Please try again.",
      }),
    );

    xhr.addEventListener("error", () =>
      finish({
        ok: false,
        kind: "network",
        message: "Could not reach the server. Check your connection and try again.",
      }),
    );

    xhr.addEventListener("abort", () =>
      finish({ ok: false, kind: "aborted", message: "Upload cancelled." }),
    );

    xhr.addEventListener("load", () => {
      const parsed = parseApiResponse(xhr.responseText);
      const requestId = parsed?.requestId;

      if (xhr.status >= 200 && xhr.status < 300 && parsed?.success && parsed.data) {
        finish({
          ok: true,
          data: parsed.data,
          requestId: requestId ?? "",
        });
        return;
      }

      if (xhr.status === 422) {
        finish({
          ok: false,
          kind: "validation",
          message: parsed?.error?.message ?? "Please check the form and try again.",
          fieldErrors: parsed?.error?.fieldErrors,
          requestId,
        });
        return;
      }

      if (xhr.status === 429) {
        finish({
          ok: false,
          kind: "rate_limited",
          message: parsed?.error?.message ?? "Too many submissions. Please try again later.",
          requestId,
        });
        return;
      }

      if (xhr.status === 413) {
        finish({
          ok: false,
          kind: "payload_too_large",
          message: parsed?.error?.message ?? "File is too large.",
          requestId,
        });
        return;
      }

      if (xhr.status === 400) {
        finish({
          ok: false,
          kind: "bad_request",
          message: parsed?.error?.message ?? "Invalid submission.",
          requestId,
        });
        return;
      }

      // 5xx — caller may retry
      void (async () => {
        if (attempt < MAX_RETRIES && !NO_RETRY_STATUSES.has(xhr.status)) {
          await delay(1000 * Math.pow(2, attempt));
          const retried = await xhrUpload(formData, options, attempt + 1);
          finish(retried);
        } else {
          finish({
            ok: false,
            kind: "server",
            message: parsed?.error?.message ?? "Something went wrong. Please try again.",
            requestId,
          });
        }
      })();
    });

    if (options.signal) {
      if (options.signal.aborted) {
        xhr.abort();
        return;
      }
      options.signal.addEventListener("abort", () => xhr.abort());
    }

    xhr.timeout = options.timeoutMs ?? REQUEST_TIMEOUT_MS;
    xhr.open("POST", "/api/careers/apply");
    xhr.send(formData);
  });
}

/**
 * Submit a career application.
 *
 * @param formData — multipart form data including all fields + resume file
 * @param options  — progress callback, AbortSignal, timeout override
 */
export function submitCareerApplication(
  formData: FormData,
  options: CareerApplicationOptions = {},
): Promise<CareerApplicationResult> {
  return xhrUpload(formData, options, 0);
}

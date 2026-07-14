/**
 * lib/api-response.ts — Uniform API response contract.
 *
 * Every endpoint returns the same envelope:
 *   { success, data?, error?, requestId, timestamp }
 *
 * Consumers should only import `ok` / `fail` — never construct the
 * shape inline so the contract stays consistent automatically.
 */

import { NextResponse } from "next/server";
import type { AppError, FieldError } from "@/lib/errors";

// ── Shared types ─────────────────────────────────────────────────────────────

export interface ErrorPayload {
  code: string;
  message: string;
  fieldErrors?: FieldError[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ErrorPayload;
  requestId: string;
  timestamp: string;
}

// ── Builders ─────────────────────────────────────────────────────────────────

/** Build the shared security response headers. */
function securityHeaders(): Record<string, string> {
  return {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };
}

/** 2xx success response. */
export function ok<T>(
  data: T,
  requestId: string,
  status = 200,
): NextResponse<ApiResponse<T>> {
  const body: ApiResponse<T> = {
    success: true,
    data,
    requestId,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, { status, headers: securityHeaders() });
}

/** Error response derived from an AppError instance. */
export function fail(
  error: AppError,
  requestId: string,
): NextResponse<ApiResponse<never>> {
  const body: ApiResponse<never> = {
    success: false,
    error: error.toJSON() as ErrorPayload,
    requestId,
    timestamp: new Date().toISOString(),
  };

  const headers: Record<string, string> = securityHeaders();

  // Attach Retry-After for rate-limit errors
  if ("retryAfterMs" in error && typeof error.retryAfterMs === "number") {
    headers["Retry-After"] = String(Math.ceil(error.retryAfterMs / 1000));
  }

  return NextResponse.json(body, { status: error.statusCode, headers });
}

/** 500 fallback for unknown errors — never leaks internals. */
export function failUnknown(requestId: string): NextResponse<ApiResponse<never>> {
  const body: ApiResponse<never> = {
    success: false,
    error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." },
    requestId,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, { status: 500, headers: securityHeaders() });
}

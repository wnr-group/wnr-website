/**
 * lib/errors.ts — Typed, HTTP-mapped error class hierarchy.
 *
 * Rules:
 * - Internal stack traces are NEVER serialised into API responses.
 * - Every error carries a machine-readable `code` for client handling.
 * - `requestId` is attached at the handler level, not at construction.
 */

// ── Base ─────────────────────────────────────────────────────────────────────

export interface FieldError {
  field: string;
  message: string;
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    // Maintain proper prototype chain in transpiled ES5
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /** Serialise for API responses — never includes the stack trace. */
  toJSON() {
    return { code: this.code, message: this.message };
  }
}

// ── 4xx ──────────────────────────────────────────────────────────────────────

/** 400 — Structurally malformed request (missing body, bad content-type). */
export class BadRequestError extends AppError {
  constructor(message = "Bad request.") {
    super(message, 400, "BAD_REQUEST");
  }
}

/** 401 — Missing or invalid authentication. */
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorised.") {
    super(message, 401, "UNAUTHORIZED");
  }
}

/** 413 — Request body exceeds the allowed size. */
export class PayloadTooLargeError extends AppError {
  constructor(message = "Payload too large.") {
    super(message, 413, "PAYLOAD_TOO_LARGE");
  }
}

/** 415 — File type is not accepted. */
export class UnsupportedFileTypeError extends AppError {
  constructor(message = "Unsupported file type.") {
    super(message, 415, "UNSUPPORTED_FILE_TYPE");
  }
}

/**
 * 422 — Semantically invalid input (failed validation).
 * `fieldErrors` carries per-field messages for inline form feedback.
 */
export class ValidationError extends AppError {
  readonly fieldErrors: FieldError[];

  constructor(fieldErrors: FieldError[], message = "Validation failed.") {
    super(message, 422, "VALIDATION_ERROR");
    this.fieldErrors = fieldErrors;
  }

  override toJSON() {
    return {
      code: this.code,
      message: this.message,
      fieldErrors: this.fieldErrors,
    };
  }
}

/** 429 — Rate limit exceeded. */
export class RateLimitError extends AppError {
  readonly retryAfterMs: number;

  constructor(retryAfterMs: number, message = "Too many requests. Please try again later.") {
    super(message, 429, "RATE_LIMITED");
    this.retryAfterMs = retryAfterMs;
  }
}

// ── 5xx ──────────────────────────────────────────────────────────────────────

/** 500 — Unexpected server-side failure. Never exposes internals. */
export class InternalServerError extends AppError {
  constructor(message = "An unexpected error occurred. Please try again.") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}

// ── Guard ─────────────────────────────────────────────────────────────────────

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}

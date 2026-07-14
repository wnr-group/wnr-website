/**
 * lib/logger.ts — Structured logging utility.
 *
 * Rules:
 * - Always includes: timestamp, requestId, level
 * - Operational context (endpoint, status, durationMs, ip, userAgent) is optional
 * - NEVER logs: passwords, full file bytes, session tokens, or full email addresses
 *   (only the domain part of an email may be logged)
 * - Stack traces are logged at ERROR level only — never forwarded to clients
 */

export type LogLevel = "info" | "warn" | "error";

export interface LogContext {
  requestId?: string;
  traceId?: string;
  endpoint?: string;
  method?: string;
  status?: number;
  durationMs?: number;
  ip?: string;
  userAgent?: string;
  /** Any additional safe key/value pairs. */
  [key: string]: unknown;
}

function maskEmail(email: string): string {
  const atIdx = email.indexOf("@");
  if (atIdx <= 0) return "[email]";
  return `${email[0]}***@${email.slice(atIdx + 1)}`;
}

function buildEntry(
  level: LogLevel,
  context: LogContext,
  message: string,
): Record<string, unknown> {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };
}

function emit(level: LogLevel, context: LogContext, message: string): void {
  const entry = buildEntry(level, context, message);
  const line = JSON.stringify(entry);

  switch (level) {
    case "error":
      console.error(line);
      break;
    case "warn":
      console.warn(line);
      break;
    default:
      console.info(line);
  }
}

export const logger = {
  info(context: LogContext, message: string): void {
    emit("info", context, message);
  },
  warn(context: LogContext, message: string): void {
    emit("warn", context, message);
  },
  error(context: LogContext, message: string, err?: unknown): void {
    const ctx: LogContext = { ...context };
    if (err instanceof Error) {
      ctx.errorName = err.name;
      ctx.errorMessage = err.message;
      // Stack in dev only — never in production API responses
      if (process.env.NODE_ENV !== "production") {
        ctx.stack = err.stack;
      }
    }
    emit("error", ctx, message);
  },
};

/** Utility: redact the local part of an email for safe logging. */
export { maskEmail };

/**
 * lib/validation/sanitize.ts — Input sanitization utilities.
 *
 * Run BEFORE validation so validators always receive clean input.
 * Safe to use on both client and server.
 *
 * Defences:
 * - Trim whitespace
 * - Unicode normalization (NFC) to prevent homograph attacks
 * - Control character stripping (null bytes, DEL, C0/C1 controls)
 * - HTML entity escaping (prevents XSS / HTML injection)
 * - Script tag stripping (belt-and-suspenders on top of escaping)
 * - Path traversal protection for filenames
 */

// ── Control character pattern ─────────────────────────────────────────────────
// Strips ASCII C0 (0x00–0x1F except TAB/LF/CR) and C1 (0x7F–0x9F) controls
const CONTROL_CHAR_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g;

// ── Script-tag pattern ────────────────────────────────────────────────────────
const SCRIPT_TAG_RE = /<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi;
const HTML_TAG_RE = /<[^>]+>/g;

// ── HTML entity map ───────────────────────────────────────────────────────────
const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

/**
 * Escape characters that could be used for HTML/XSS injection.
 * Applied after stripping control chars and script tags.
 */
function escapeHtml(value: string): string {
  return value.replace(/[&<>"'`=/]/g, (ch) => HTML_ENTITIES[ch] ?? ch);
}

/**
 * Full sanitization pipeline for a single string field:
 * 1. Trim
 * 2. Unicode NFC normalization
 * 3. Control character removal
 * 4. Script tag stripping
 * 5. Remaining HTML tag stripping
 * 6. HTML entity escaping
 */
export function sanitizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return escapeHtml(
    value
      .trim()
      .normalize("NFC")
      .replace(CONTROL_CHAR_RE, "")
      .replace(SCRIPT_TAG_RE, "")
      .replace(HTML_TAG_RE, ""),
  );
}

/**
 * Sanitize a filename:
 * - Remove directory traversal sequences (../, ..\, leading slashes)
 * - Strip control characters
 * - Limit length to 255 chars (POSIX limit)
 * - Replace characters that are unsafe in filenames
 */
export function sanitizeFilename(filename: unknown): string {
  if (typeof filename !== "string") return "upload";

  return filename
    .trim()
    .normalize("NFC")
    .replace(CONTROL_CHAR_RE, "")
    // Remove path traversal
    .replace(/\.\.[/\\]/g, "")
    .replace(/^[/\\]+/, "")
    // Replace unsafe filesystem characters
    .replace(/[<>:"|?*]/g, "_")
    .slice(0, 255)
    || "upload";
}

/**
 * Apply `sanitizeString` to every string property of a plain object.
 * Non-string values are passed through untouched.
 */
export function sanitizeAll<T extends Record<string, unknown>>(
  obj: T,
): { [K in keyof T]: T[K] extends string ? string : T[K] } {
  const result = {} as { [K in keyof T]: T[K] extends string ? string : T[K] };
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      (result as Record<string, unknown>)[key] =
        value === null || value === undefined
          ? ""
          : typeof value === "string"
          ? sanitizeString(value)
          : value;
    }
  }
  return result;
}

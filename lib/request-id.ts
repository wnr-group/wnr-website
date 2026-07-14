/**
 * lib/request-id.ts — Request and trace ID generation.
 *
 * RequestId: correlates a single HTTP request across logs and the API response.
 * TraceId:   correlates a distributed flow across multiple services.
 *
 * Format: `req_<8-char hex>` / `trc_<8-char hex>` — short enough to be
 * readable in logs, unique enough for single-instance production use.
 * Multi-instance deployments should inject a shared ID generator.
 */

import { randomBytes } from "node:crypto";

function hexId(prefix: string, byteLength = 8): string {
  return `${prefix}_${randomBytes(byteLength).toString("hex")}`;
}

export function generateRequestId(): string {
  return hexId("req");
}

export function generateTraceId(): string {
  return hexId("trc");
}

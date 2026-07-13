/**
 * types/api.ts — Shared API response types.
 *
 * These are the client-side mirror of lib/api-response.ts.
 * Import these in client code; import lib/api-response.ts in server routes.
 */

export interface FieldError {
  field: string;
  message: string;
}

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

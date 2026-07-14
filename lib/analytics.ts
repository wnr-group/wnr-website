/**
 * lib/analytics.ts — Analytics event abstraction.
 *
 * Fires named events with optional properties.
 * No vendor dependency — swap the implementation for GA4, Segment,
 * PostHog, Mixpanel, etc. without touching any form component.
 *
 * Only runs in browser environments (guards against SSR).
 */

import { ANALYTICS_ENABLED } from "@/lib/env";

export type AnalyticsEvent =
  | "career_started"
  | "resume_uploaded"
  | "career_submitted"
  | "career_failed"
  | "contact_started"
  | "contact_submitted"
  | "contact_failed";

export type EventProperties = Record<string, unknown>;

/**
 * Track an analytics event.
 *
 * Current implementation: structured console.info in development,
 * silent in production until a real provider is wired.
 *
 * To integrate GA4:
 *   window.gtag?.("event", event, properties);
 * To integrate Segment:
 *   window.analytics?.track(event, properties);
 */
export function trackEvent(
  event: AnalyticsEvent,
  properties: EventProperties = {},
): void {
  if (typeof window === "undefined") return; // guard SSR
  if (!ANALYTICS_ENABLED) return;

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", event, properties);
  }

  // TODO: Replace with real analytics call
  // Example GA4:
  //   window.gtag?.("event", event, properties);
}

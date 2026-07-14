/**
 * types/caseStudy.ts — Case study domain model for the Insights page.
 *
 * Content is sourced from the WnR case studies collateral and is deliberately
 * client-anonymous: titles describe the solution category, never the customer.
 */

/** Which generic UI mockup CaseStudyVisual renders when no real screenshot is set. */
export type CaseStudyVisualKind =
  | "student-analytics"
  | "university-erp"
  | "career-guidance"
  | "fashion-commerce"
  | "pharma-commerce"
  | "food-marketplace"
  | "recruitment-ats"
  | "production-portfolio"
  | "travel-booking";

/** Rotates across industry groups so the grid isn't monotone green. */
export type CaseStudyAccent = "forest" | "teal" | "amber";

export interface CaseStudy {
  id: string;
  slug: string;
  /** Industry group this case belongs to — drives clustering on the page. */
  industry: string;
  /** Short badge shown on the card image — a solution category, never a client name. */
  industryLabel: string;
  accent: CaseStudyAccent;
  title: string;
  /** 2–3 line summary. */
  summary: string;
  /** 3–5 solution highlights, most representative first. */
  highlights: string[];
  /**
   * Real product screenshot, once available. When unset, the card falls back
   * to the generic `visual` mockup — swap this in later with no component or
   * data-model changes required.
   */
  image?: string;
  visual: CaseStudyVisualKind;
  tags: string[];
}

export interface CaseStudyIndustryGroup {
  id: string;
  name: string;
  accent: CaseStudyAccent;
  studies: CaseStudy[];
}

import { describe, expect, it } from "vitest";
import { caseStudies } from "@/data/caseStudies";

describe("caseStudies content", () => {
  it("contains no em dash characters in any summary", () => {
    for (const study of caseStudies) {
      expect(study.summary).not.toMatch(/—/);
    }
  });

  it("contains no em dash characters in any title, result, highlight, or industryLabel", () => {
    for (const study of caseStudies) {
      expect(study.title).not.toMatch(/—/);
      expect(study.industryLabel).not.toMatch(/—/);
      if (study.result) expect(study.result).not.toMatch(/—/);
      for (const highlight of study.highlights) {
        expect(highlight).not.toMatch(/—/);
      }
    }
  });

  it("preserves the exact updated University Management System summary text", () => {
    const uni = caseStudies.find((s) => s.id === "university-management-system");
    expect(uni?.summary).toBe(
      "A comprehensive digital ERP platform modernizing university administration: admissions, academics, finance, examinations, HR, and campus operations, in one unified ecosystem."
    );
  });
});
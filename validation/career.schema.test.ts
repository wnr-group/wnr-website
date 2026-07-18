import { describe, expect, it } from "vitest";
import { validateCareerApplication } from "./career.schema";
import type { CareerApplicationRequestDTO } from "@/types/career";

function validDTO(overrides: Partial<CareerApplicationRequestDTO> = {}): CareerApplicationRequestDTO {
  return {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    phone: "+91 98765 43210",
    currentLocation: "Chennai, India",
    yearsOfExperience: "5",
    resumeRef: "abc123.pdf",
    honeypot: "",
    ...overrides,
  };
}

describe("validateCareerApplication", () => {
  it("returns valid for a complete correct DTO", () => {
    expect(validateCareerApplication(validDTO()).valid).toBe(true);
  });

  it("fails when firstName is missing", () => {
    const result = validateCareerApplication(validDTO({ firstName: "" }));
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.field === "firstName")).toBe(true);
    }
  });

  it("fails for invalid email", () => {
    const result = validateCareerApplication(validDTO({ email: "notanemail" }));
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.field === "email")).toBe(true);
    }
  });

  it("fails for negative experience", () => {
    const result = validateCareerApplication(validDTO({ yearsOfExperience: "-1" }));
    expect(result.valid).toBe(false);
  });

  it("fails when resumeRef is missing", () => {
    const result = validateCareerApplication(validDTO({ resumeRef: "" }));
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.field === "resumeRef")).toBe(true);
    }
  });

  it("fails for invalid noticePeriod value", () => {
    const result = validateCareerApplication(validDTO({ noticePeriod: "tomorrow" }));
    expect(result.valid).toBe(false);
  });

  it("accepts valid optional fields", () => {
    const result = validateCareerApplication(
      validDTO({
        linkedInUrl: "https://linkedin.com/in/janedoe",
        portfolioUrl: "https://github.com/janedoe",
        noticePeriod: "30 days",
        heardAboutUs: "LinkedIn",
        coverLetter: "I would love to join WnRTech because...",
        expectedCtc: "1200000",
      }),
    );
    expect(result.valid).toBe(true);
  });

  it("rejects honeypot when filled (bot detection)", () => {
    const result = validateCareerApplication(validDTO({ honeypot: "bot-filled" }));
    expect(result.valid).toBe(false);
  });

  it("collects multiple errors at once", () => {
    const result = validateCareerApplication(
      validDTO({ firstName: "", lastName: "", email: "bad" }),
    );
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.length).toBeGreaterThan(1);
    }
  });
});

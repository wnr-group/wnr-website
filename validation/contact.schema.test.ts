import { describe, expect, it } from "vitest";
import { validateContactEnquiry } from "./contact.schema";
import type { ContactEnquiryRequestDTO } from "@/types/contact";

function validDTO(overrides: Partial<ContactEnquiryRequestDTO> = {}): ContactEnquiryRequestDTO {
  return {
    name: "John Smith",
    email: "john@acme.com",
    organization: "Acme Corp",
    contactNumber: "+1 555 000 0000",
    region: "Asia",
    inquiryType: "General Enquiry",
    message: "We are looking to digitally transform our operations team.",
    honeypot: "",
    ...overrides,
  };
}

describe("validateContactEnquiry", () => {
  it("returns valid for a complete correct DTO", () => {
    expect(validateContactEnquiry(validDTO()).valid).toBe(true);
  });

  it("fails when name is empty", () => {
    const result = validateContactEnquiry(validDTO({ name: "" }));
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.field === "name")).toBe(true);
    }
  });

  it("fails for invalid email", () => {
    const result = validateContactEnquiry(validDTO({ email: "bad-email" }));
    expect(result.valid).toBe(false);
  });

  it("fails when organization is empty", () => {
    const result = validateContactEnquiry(validDTO({ organization: "" }));
    expect(result.valid).toBe(false);
  });

  it("fails for invalid region", () => {
    const result = validateContactEnquiry(validDTO({ region: "Atlantis" }));
    expect(result.valid).toBe(false);
  });

  it("fails for invalid inquiryType", () => {
    const result = validateContactEnquiry(validDTO({ inquiryType: "Hacking" }));
    expect(result.valid).toBe(false);
  });

  it("fails when message is too short", () => {
    const result = validateContactEnquiry(validDTO({ message: "Hi" }));
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.field === "message")).toBe(true);
    }
  });

  it("fails when message is too long", () => {
    const result = validateContactEnquiry(validDTO({ message: "a".repeat(5001) }));
    expect(result.valid).toBe(false);
  });

  it("rejects honeypot when filled", () => {
    const result = validateContactEnquiry(validDTO({ honeypot: "spambot" }));
    expect(result.valid).toBe(false);
  });

  it("accepts all valid region values", () => {
    const regions = ["Asia", "Europe", "North America", "South America", "Middle East", "Africa", "Australia"] as const;
    for (const region of regions) {
      expect(validateContactEnquiry(validDTO({ region })).valid).toBe(true);
    }
  });
});

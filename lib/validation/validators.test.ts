import { describe, expect, it } from "vitest";
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validateMinLength,
  validateMaxLength,
  validateNumeric,
  validatePositiveInt,
  validateOneOf,
  validateUrl,
  validateHoneypot,
  validateFile,
} from "./validators";

describe("validateRequired", () => {
  it("returns null for non-empty strings", () => {
    expect(validateRequired("hello", "Field")).toBeNull();
  });
  it("returns an error for empty string", () => {
    expect(validateRequired("", "Field")).toMatch(/required/i);
  });
  it("returns an error for whitespace-only string", () => {
    expect(validateRequired("   ", "Field")).toMatch(/required/i);
  });
});

describe("validateEmail", () => {
  it("accepts valid emails", () => {
    expect(validateEmail("user@example.com")).toBeNull();
    expect(validateEmail("a+b@sub.domain.org")).toBeNull();
  });
  it("rejects missing @", () => {
    expect(validateEmail("notanemail")).not.toBeNull();
  });
  it("rejects missing TLD", () => {
    expect(validateEmail("user@domain")).not.toBeNull();
  });
  it("rejects empty", () => {
    expect(validateEmail("")).not.toBeNull();
  });
  it("rejects over-long email", () => {
    expect(validateEmail("a".repeat(250) + "@b.com")).not.toBeNull();
  });
});

describe("validatePhone", () => {
  it("accepts international numbers", () => {
    expect(validatePhone("+91 98765 43210")).toBeNull();
    expect(validatePhone("+1 555-000-0000")).toBeNull();
    expect(validatePhone("00447700900900")).toBeNull();
  });
  it("rejects too-short numbers", () => {
    expect(validatePhone("123")).not.toBeNull();
  });
  it("returns null for empty when not required", () => {
    expect(validatePhone("", false)).toBeNull();
  });
  it("returns error for empty when required", () => {
    expect(validatePhone("", true)).not.toBeNull();
  });
});

describe("validateMinLength", () => {
  it("passes when at or above minimum", () => {
    expect(validateMinLength("hello", 5, "Field")).toBeNull();
    expect(validateMinLength("hello world", 5, "Field")).toBeNull();
  });
  it("fails when below minimum", () => {
    expect(validateMinLength("hi", 5, "Field")).not.toBeNull();
  });
});

describe("validateMaxLength", () => {
  it("passes when at or below maximum", () => {
    expect(validateMaxLength("hi", 5, "Field")).toBeNull();
  });
  it("fails when above maximum", () => {
    expect(validateMaxLength("hello world", 5, "Field")).not.toBeNull();
  });
});

describe("validateNumeric", () => {
  it("accepts integers and decimals", () => {
    expect(validateNumeric("42", "Field")).toBeNull();
    expect(validateNumeric("3.14", "Field")).toBeNull();
  });
  it("rejects non-numeric", () => {
    expect(validateNumeric("abc", "Field")).not.toBeNull();
  });
  it("returns null for empty when not required", () => {
    expect(validateNumeric("", "Field", false)).toBeNull();
  });
});

describe("validatePositiveInt", () => {
  it("accepts zero and positive integers", () => {
    expect(validatePositiveInt("0", "Field")).toBeNull();
    expect(validatePositiveInt("5", "Field")).toBeNull();
  });
  it("rejects negative numbers", () => {
    expect(validatePositiveInt("-1", "Field")).not.toBeNull();
  });
  it("rejects floats", () => {
    expect(validatePositiveInt("2.5", "Field")).not.toBeNull();
  });
});

describe("validateOneOf", () => {
  const options = ["Asia", "Europe", "Africa"] as const;
  it("accepts valid options", () => {
    expect(validateOneOf("Asia", options, "Region")).toBeNull();
  });
  it("rejects invalid options", () => {
    expect(validateOneOf("Antarctica", options, "Region")).not.toBeNull();
  });
  it("rejects empty", () => {
    expect(validateOneOf("", options, "Region")).not.toBeNull();
  });
});

describe("validateUrl", () => {
  it("accepts valid https URLs", () => {
    expect(validateUrl("https://example.com", "URL")).toBeNull();
    expect(validateUrl("http://example.com/path", "URL")).toBeNull();
  });
  it("returns null for empty (optional field)", () => {
    expect(validateUrl("", "URL")).toBeNull();
  });
  it("rejects non-URLs", () => {
    expect(validateUrl("not a url", "URL")).not.toBeNull();
  });
});

describe("validateHoneypot", () => {
  it("returns null for empty string (human)", () => {
    expect(validateHoneypot("")).toBeNull();
  });
  it("returns error for non-empty (bot)", () => {
    expect(validateHoneypot("filled")).not.toBeNull();
  });
});

describe("validateFile", () => {
  const constraints = {
    maxSizeBytes: 4 * 1024 * 1024,
    allowedExtensions: [".pdf", ".doc", ".docx"],
    allowedMimeTypes: ["application/pdf"],
  };

  it("passes for valid PDF", () => {
    expect(
      validateFile({ name: "resume.pdf", size: 1000, type: "application/pdf" }, constraints),
    ).toBeNull();
  });
  it("fails for empty file", () => {
    expect(
      validateFile({ name: "resume.pdf", size: 0, type: "application/pdf" }, constraints),
    ).not.toBeNull();
  });
  it("fails for oversized file", () => {
    expect(
      validateFile(
        { name: "resume.pdf", size: 5 * 1024 * 1024, type: "application/pdf" },
        constraints,
      ),
    ).not.toBeNull();
  });
  it("fails for unsupported extension", () => {
    expect(
      validateFile({ name: "resume.exe", size: 1000, type: "" }, constraints),
    ).not.toBeNull();
  });
  it("fails for mismatched MIME type", () => {
    expect(
      validateFile(
        { name: "resume.pdf", size: 1000, type: "application/msword" },
        constraints,
      ),
    ).not.toBeNull();
  });
});

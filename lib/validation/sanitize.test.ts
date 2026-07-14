import { describe, expect, it } from "vitest";
import { sanitizeString, sanitizeFilename, sanitizeAll } from "./sanitize";

describe("sanitizeString", () => {
  it("trims whitespace", () => {
    expect(sanitizeString("  hello  ")).toBe("hello");
  });

  it("removes control characters", () => {
    expect(sanitizeString("hel\x00lo")).toBe("hello");
    expect(sanitizeString("hel\x1Flo")).toBe("hello");
  });

  it("escapes HTML entities", () => {
    expect(sanitizeString("<script>alert(1)</script>")).not.toContain("<script>");
    expect(sanitizeString('<img src="x" onerror="alert(1)">')).not.toContain("<img");
  });

  it("strips script tags", () => {
    const result = sanitizeString("<script>evil()</script>safe text");
    expect(result).not.toContain("evil");
    expect(result).toContain("safe text");
  });

  it("handles non-string input", () => {
    expect(sanitizeString(42 as unknown as string)).toBe("");
    expect(sanitizeString(null as unknown as string)).toBe("");
    expect(sanitizeString(undefined as unknown as string)).toBe("");
  });

  it("normalizes unicode (NFC)", () => {
    // Combining character form should normalize
    const combined = "\u00e9"; // é precomposed
    const decomposed = "e\u0301"; // e + combining accent
    expect(sanitizeString(decomposed)).toBe(sanitizeString(combined));
  });

  it("passes through clean text unchanged", () => {
    expect(sanitizeString("Hello World")).toBe("Hello World");
  });
});

describe("sanitizeFilename", () => {
  it("removes path traversal sequences", () => {
    expect(sanitizeFilename("../../../etc/passwd")).not.toContain("..");
  });
  it("removes leading slashes", () => {
    const result = sanitizeFilename("/absolute/path.pdf");
    expect(result).not.toMatch(/^\//);
  });
  it("replaces unsafe filesystem characters", () => {
    expect(sanitizeFilename("file<>:.pdf")).not.toContain("<");
    expect(sanitizeFilename("file<>:.pdf")).not.toContain(">");
  });
  it("limits to 255 chars", () => {
    expect(sanitizeFilename("a".repeat(300) + ".pdf").length).toBeLessThanOrEqual(255);
  });
  it("returns upload for empty or non-string", () => {
    expect(sanitizeFilename("")).toBe("upload");
    expect(sanitizeFilename(null as unknown as string)).toBe("upload");
  });
  it("keeps clean filenames unchanged", () => {
    expect(sanitizeFilename("my-resume.pdf")).toBe("my-resume.pdf");
  });
});

describe("sanitizeAll", () => {
  it("sanitizes every string field", () => {
    const result = sanitizeAll({
      name: "  John  ",
      age: 25,
      note: "<b>bold</b>",
    });
    expect(result.name).toBe("John");
    expect(result.age).toBe(25); // non-string untouched
    expect(result.note).not.toContain("<b>");
  });

  it("returns empty strings for null/undefined string fields", () => {
    const result = sanitizeAll({ name: null as unknown as string });
    expect(result.name).toBe("");
  });
});

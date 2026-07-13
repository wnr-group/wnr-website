import { describe, expect, it, vi, afterEach } from "vitest";
import { submitContact } from "./contact";
import type { ContactEnquiryRequestDTO } from "@/types/contact";

function validPayload(): ContactEnquiryRequestDTO {
  return {
    name: "Jane",
    email: "jane@acme.com",
    organization: "Acme",
    contactNumber: "+44 7700 900900",
    region: "Europe",
    inquiryType: "Cloud",
    message: "We want to migrate our workloads to cloud.",
    honeypot: "",
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("submitContact", () => {
  it("resolves ok on 200 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: { referenceNumber: "WNR-ENQ-ABCD1234", message: "Thank you." },
          requestId: "req_abc",
          timestamp: new Date().toISOString(),
        }),
      }),
    );

    const result = await submitContact(validPayload());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.referenceNumber).toBe("WNR-ENQ-ABCD1234");
    }
  });

  it("resolves validation failure on 422", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Validation failed.",
            fieldErrors: [{ field: "email", message: "Invalid email." }],
          },
          requestId: "req_abc",
          timestamp: new Date().toISOString(),
        }),
      }),
    );

    const result = await submitContact(validPayload());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.kind).toBe("validation");
      expect(result.fieldErrors).toHaveLength(1);
    }
  });

  it("resolves rate_limited on 429", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({
          success: false,
          error: { code: "RATE_LIMITED", message: "Too many requests." },
          requestId: "req_abc",
          timestamp: new Date().toISOString(),
        }),
      }),
    );

    const result = await submitContact(validPayload());
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("rate_limited");
  });

  it("resolves network failure when fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network failure")),
    );

    const result = await submitContact(validPayload(), { timeoutMs: 100 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      // After retries, should be network
      expect(["network", "server"]).toContain(result.kind);
    }
  });
});

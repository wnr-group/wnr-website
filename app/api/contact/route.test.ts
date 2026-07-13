import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function makeRequest(body: unknown, ip = "10.2.0.1"): Request {
  const request = new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
  vi.spyOn(request, "json").mockResolvedValue(body);
  return request;
}

const VALID_BODY = {
  name: "John Smith",
  email: "john@acme.com",
  organization: "Acme Corp",
  contactNumber: "+1 555 000 0000",
  region: "Asia",
  inquiryType: "General Enquiry",
  message: "We are interested in your digital transformation services.",
  honeypot: "",
};

describe("POST /api/contact", () => {
  it("accepts a valid contact enquiry", async () => {
    const response = await POST(makeRequest(VALID_BODY, "10.2.1.1"));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.referenceNumber).toMatch(/WNR-ENQ-/);
    expect(data.requestId).toBeTruthy();
    expect(data.timestamp).toBeTruthy();
  });

  it("rejects missing required field — name", async () => {
    const response = await POST(
      makeRequest({ ...VALID_BODY, name: "" }, "10.2.1.2"),
    );
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.fieldErrors.some((e: { field: string }) => e.field === "name")).toBe(true);
  });

  it("rejects invalid email", async () => {
    const response = await POST(
      makeRequest({ ...VALID_BODY, email: "bad-email" }, "10.2.1.3"),
    );
    expect(response.status).toBe(422);
  });

  it("rejects invalid region", async () => {
    const response = await POST(
      makeRequest({ ...VALID_BODY, region: "Narnia" }, "10.2.1.4"),
    );
    expect(response.status).toBe(422);
  });

  it("rejects invalid inquiryType", async () => {
    const response = await POST(
      makeRequest({ ...VALID_BODY, inquiryType: "Hacking" }, "10.2.1.5"),
    );
    expect(response.status).toBe(422);
  });

  it("rejects too-short message", async () => {
    const response = await POST(
      makeRequest({ ...VALID_BODY, message: "Hi" }, "10.2.1.6"),
    );
    expect(response.status).toBe(422);
  });

  it("rejects honeypot when filled", async () => {
    const response = await POST(
      makeRequest({ ...VALID_BODY, honeypot: "bot-fill" }, "10.2.1.7"),
    );
    expect(response.status).toBe(422);
  });

  it("rejects non-JSON body", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "x-forwarded-for": "10.2.1.8" },
      body: "not json",
    });
    vi.spyOn(request, "json").mockRejectedValue(new SyntaxError("JSON parse error"));
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns security headers", async () => {
    const response = await POST(makeRequest(VALID_BODY, "10.2.1.9"));
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("rate limits after repeated submissions from same IP", async () => {
    const ip = "10.2.0.99";
    let lastStatus = 200;
    for (let i = 0; i < 12; i++) {
      const resp = await POST(makeRequest(VALID_BODY, ip));
      lastStatus = resp.status;
    }
    expect(lastStatus).toBe(429);
  });
});

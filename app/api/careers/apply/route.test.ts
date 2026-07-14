import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const PDF_BYTES = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37, 0x0a, 0x25]);
const EXE_BYTES = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);

function makeRequest(fields: Record<string, string>, file?: File, ip = "10.0.0.1"): Request {
  const formData = new FormData();
  for (const [k, v] of Object.entries(fields)) formData.append(k, v);
  if (file) formData.append("resume", file);

  const request = new Request("http://localhost/api/careers/apply", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
    body: formData,
  });
  vi.spyOn(request, "formData").mockResolvedValue(formData);
  return request;
}

const VALID_FIELDS = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "+91 98765 43210",
  currentLocation: "Chennai, India",
  yearsOfExperience: "5",
  honeypot: "",
};

describe("POST /api/careers/apply", () => {
  it("accepts a valid application with a PDF", async () => {
    const file = new File([PDF_BYTES], "resume.pdf", { type: "application/pdf" });
    const response = await POST(makeRequest(VALID_FIELDS, file, "10.1.0.1"));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.referenceNumber).toMatch(/WNR-APP-/);
    expect(data.requestId).toBeTruthy();
    expect(data.timestamp).toBeTruthy();
  });

  it("rejects missing required fields (firstName empty)", async () => {
    const file = new File([PDF_BYTES], "resume.pdf", { type: "application/pdf" });
    const response = await POST(
      makeRequest({ ...VALID_FIELDS, firstName: "" }, file, "10.1.0.2"),
    );
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.fieldErrors.some((e: { field: string }) => e.field === "firstName")).toBe(true);
  });

  it("rejects missing resume file", async () => {
    const response = await POST(makeRequest(VALID_FIELDS, undefined, "10.1.0.3"));
    expect(response.status).toBe(422);
  });

  it("rejects an oversized file", async () => {
    const big = new Uint8Array(4 * 1024 * 1024 + 1);
    big.set(PDF_BYTES);
    const file = new File([big], "big.pdf", { type: "application/pdf" });
    const response = await POST(makeRequest(VALID_FIELDS, file, "10.1.0.4"));
    expect(response.status).toBe(422);
  });

  it("rejects a renamed executable", async () => {
    const file = new File([EXE_BYTES], "resume.pdf", { type: "application/pdf" });
    const response = await POST(makeRequest(VALID_FIELDS, file, "10.1.0.5"));
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error.message).toMatch(/executable/i);
  });

  it("rejects honeypot filled", async () => {
    const file = new File([PDF_BYTES], "resume.pdf", { type: "application/pdf" });
    const response = await POST(
      makeRequest({ ...VALID_FIELDS, honeypot: "bot-fill" }, file, "10.1.0.6"),
    );
    expect(response.status).toBe(422);
  });

  it("returns security headers", async () => {
    const file = new File([PDF_BYTES], "resume.pdf", { type: "application/pdf" });
    const response = await POST(makeRequest(VALID_FIELDS, file, "10.1.0.7"));
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("rate limits after repeated submissions from same IP", async () => {
    const ip = "10.1.0.99";
    let lastStatus = 200;
    for (let i = 0; i < 7; i++) {
      const file = new File([PDF_BYTES], "resume.pdf", { type: "application/pdf" });
      const resp = await POST(makeRequest(VALID_FIELDS, file, ip));
      lastStatus = resp.status;
    }
    expect(lastStatus).toBe(429);
  });
});

import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const PDF_BYTES = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37, 0x0a, 0x25]);
const EXE_BYTES = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);

function makeRequest(file: File, ip = "203.0.113.1"): Request {
  const formData = new FormData();
  formData.append("resume", file);
  const request = new Request("http://localhost/api/careers/resume", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
    body: formData,
  });
  // Mock formData() to return our FormData object since jsdom doesn't properly serialize FormData bodies
  vi.spyOn(request, "formData").mockResolvedValue(formData);
  return request;
}

describe("POST /api/careers/resume", () => {
  it("accepts a well-formed PDF", async () => {
    const file = new File([PDF_BYTES], "resume.pdf", { type: "application/pdf" });
    const response = await POST(makeRequest(file, "203.0.113.20"));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
  });

  it("rejects a missing file", async () => {
    const formData = new FormData();
    const request = new Request("http://localhost/api/careers/resume", {
      method: "POST",
      headers: { "x-forwarded-for": "203.0.113.21" },
      body: formData,
    });
    vi.spyOn(request, "formData").mockResolvedValue(formData);
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("rejects a file over the size limit", async () => {
    const big = new Uint8Array(4 * 1024 * 1024 + 1);
    big.set(PDF_BYTES);
    const file = new File([big], "resume.pdf", { type: "application/pdf" });
    const response = await POST(makeRequest(file, "203.0.113.22"));
    expect(response.status).toBe(400);
  });

  it("rejects a renamed executable even with a .pdf extension and matching claimed type", async () => {
    const file = new File([EXE_BYTES], "resume.pdf", { type: "application/pdf" });
    const response = await POST(makeRequest(file, "203.0.113.23"));
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toMatch(/executable/i);
  });

  it("rejects an unsupported extension", async () => {
    const file = new File([PDF_BYTES], "resume.exe", { type: "" });
    const response = await POST(makeRequest(file, "203.0.113.24"));
    expect(response.status).toBe(400);
  });

  it("rate limits after repeated uploads from the same IP", async () => {
    const ip = "203.0.113.98";
    let lastStatus = 200;
    for (let i = 0; i < 6; i++) {
      const file = new File([PDF_BYTES], "resume.pdf", { type: "application/pdf" });
      const response = await POST(makeRequest(file, ip));
      lastStatus = response.status;
    }
    expect(lastStatus).toBe(429);
  });
});

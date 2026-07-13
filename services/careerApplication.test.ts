import { describe, expect, it, afterEach, vi } from "vitest";
import { submitCareerApplication } from "./careerApplication";

class FakeXhr {
  static instances: FakeXhr[] = [];
  upload = {
    addEventListener: vi.fn((event: string, handler: (e: unknown) => void) => {
      this.uploadHandlers[event] = handler;
    }),
  };
  uploadHandlers: Record<string, (e: unknown) => void> = {};
  handlers: Record<string, () => void> = {};
  status = 0;
  responseText = "";
  timeout = 0;
  addEventListener = vi.fn((event: string, handler: () => void) => {
    this.handlers[event] = handler;
  });
  open = vi.fn();
  send = vi.fn();
  abort = vi.fn(() => this.handlers.abort?.());

  constructor() {
    FakeXhr.instances.push(this);
  }

  respond(status: number, body: unknown) {
    this.status = status;
    this.responseText = JSON.stringify(body);
    this.handlers.load?.();
  }
}

function makeFormData() {
  return new FormData();
}

afterEach(() => {
  FakeXhr.instances = [];
  vi.unstubAllGlobals();
});

describe("submitCareerApplication", () => {
  it("resolves ok on 200 response", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr as unknown as typeof XMLHttpRequest);

    const promise = submitCareerApplication(makeFormData());
    FakeXhr.instances[0].respond(200, {
      success: true,
      data: { referenceNumber: "WNR-APP-ABCD1234", message: "Received." },
      requestId: "req_abc",
      timestamp: new Date().toISOString(),
    });

    const result = await promise;
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.referenceNumber).toBe("WNR-APP-ABCD1234");
    }
  });

  it("resolves validation failure on 422", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr as unknown as typeof XMLHttpRequest);

    const promise = submitCareerApplication(makeFormData());
    FakeXhr.instances[0].respond(422, {
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Validation failed.", fieldErrors: [{ field: "email", message: "Invalid." }] },
      requestId: "req_abc",
      timestamp: new Date().toISOString(),
    });

    const result = await promise;
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.kind).toBe("validation");
      expect(result.fieldErrors).toHaveLength(1);
    }
  });

  it("resolves rate_limited on 429", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr as unknown as typeof XMLHttpRequest);

    const promise = submitCareerApplication(makeFormData());
    FakeXhr.instances[0].respond(429, {
      success: false,
      error: { code: "RATE_LIMITED", message: "Too many." },
      requestId: "req_abc",
      timestamp: new Date().toISOString(),
    });

    const result = await promise;
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("rate_limited");
  });

  it("resolves aborted on abort signal", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr as unknown as typeof XMLHttpRequest);
    const controller = new AbortController();
    const promise = submitCareerApplication(makeFormData(), { signal: controller.signal });
    controller.abort();
    const result = await promise;
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("aborted");
  });

  it("reports progress via onProgress callback", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr as unknown as typeof XMLHttpRequest);
    const onProgress = vi.fn();

    const promise = submitCareerApplication(makeFormData(), { onProgress });
    const xhr = FakeXhr.instances[0];
    xhr.uploadHandlers.progress?.({ lengthComputable: true, loaded: 50, total: 100 });
    xhr.respond(200, {
      success: true,
      data: { referenceNumber: "WNR-APP-XYZ", message: "ok" },
      requestId: "req_123",
      timestamp: new Date().toISOString(),
    });

    await promise;
    expect(onProgress).toHaveBeenCalledWith(50);
  });
});

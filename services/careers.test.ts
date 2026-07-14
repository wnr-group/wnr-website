import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadResume } from "./careers";

class FakeXhr {
  static instances: FakeXhr[] = [];
  upload = { addEventListener: vi.fn((event: string, handler: (e: unknown) => void) => {
    this.uploadHandlers[event] = handler;
  }) };
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

  progress(loaded: number, total: number) {
    this.uploadHandlers.progress?.({ lengthComputable: true, loaded, total });
  }
}

function makeFile(name = "resume.pdf", size = 1000, type = "application/pdf"): File {
  return new File([new Uint8Array(size)], name, { type });
}

describe("uploadResume", () => {
  afterEach(() => {
    FakeXhr.instances = [];
    vi.unstubAllGlobals();
  });

  it("resolves ok on a 2xx response and reports progress", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr as unknown as typeof XMLHttpRequest);
    const onProgress = vi.fn();

    const promise = uploadResume(makeFile(), { onProgress });
    const xhr = FakeXhr.instances[0];
    xhr.progress(50, 100);
    xhr.respond(200, { ok: true, message: "Resume received." });

    const result = await promise;
    expect(result).toEqual({ ok: true, message: "Resume received." });
    expect(onProgress).toHaveBeenCalledWith(50);
  });

  it("resolves a validation failure on a 400 response", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr as unknown as typeof XMLHttpRequest);

    const promise = uploadResume(makeFile());
    FakeXhr.instances[0].respond(400, { ok: false, message: "That file could not be accepted." });

    const result = await promise;
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("validation");
  });

  it("resolves a rate_limited failure on a 429 response", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr as unknown as typeof XMLHttpRequest);

    const promise = uploadResume(makeFile());
    FakeXhr.instances[0].respond(429, { ok: false, message: "Too many uploads." });

    const result = await promise;
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("rate_limited");
  });

  it("resolves a network failure on an error event", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr as unknown as typeof XMLHttpRequest);

    const promise = uploadResume(makeFile());
    FakeXhr.instances[0].handlers.error?.();

    const result = await promise;
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("network");
  });

  it("aborts the underlying request when the caller's signal aborts", async () => {
    vi.stubGlobal("XMLHttpRequest", FakeXhr as unknown as typeof XMLHttpRequest);
    const controller = new AbortController();

    const promise = uploadResume(makeFile(), { signal: controller.signal });
    controller.abort();

    const result = await promise;
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.kind).toBe("aborted");
    expect(FakeXhr.instances[0].abort).toHaveBeenCalled();
  });
});

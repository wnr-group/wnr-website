export interface ResumeUploadSuccess {
  ok: true;
  message: string;
}

export interface ResumeUploadFailure {
  ok: false;
  kind: "validation" | "rate_limited" | "network" | "timeout" | "server" | "aborted";
  message: string;
}

export type ResumeUploadResult = ResumeUploadSuccess | ResumeUploadFailure;

export interface UploadResumeOptions {
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

const UPLOAD_TIMEOUT_MS = 30_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseMessage(responseText: string): string | undefined {
  try {
    const data: unknown = JSON.parse(responseText);
    return isRecord(data) && typeof data.message === "string" ? data.message : undefined;
  } catch {
    return undefined;
  }
}

export function uploadResume(file: File, options: UploadResumeOptions = {}): Promise<ResumeUploadResult> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("resume", file);

    let settled = false;
    const finish = (result: ResumeUploadResult) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    xhr.upload.addEventListener("progress", (event) => {
      const progressEvent = event as ProgressEvent;
      if (progressEvent.lengthComputable && options.onProgress) {
        options.onProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
      }
    });

    xhr.addEventListener("timeout", () =>
      finish({ ok: false, kind: "timeout", message: "The upload timed out. Please try again." }),
    );
    xhr.addEventListener("error", () =>
      finish({
        ok: false,
        kind: "network",
        message: "Could not reach the server. Check your connection and try again.",
      }),
    );
    xhr.addEventListener("abort", () =>
      finish({ ok: false, kind: "aborted", message: "Upload cancelled." }),
    );

    xhr.addEventListener("load", () => {
      const message = parseMessage(xhr.responseText);

      if (xhr.status >= 200 && xhr.status < 300) {
        finish({ ok: true, message: message ?? "Resume received." });
        return;
      }
      if (xhr.status === 429) {
        finish({ ok: false, kind: "rate_limited", message: message ?? "Too many uploads. Please try again later." });
        return;
      }
      if (xhr.status === 400) {
        finish({ ok: false, kind: "validation", message: message ?? "That file couldn't be accepted." });
        return;
      }
      finish({ ok: false, kind: "server", message: message ?? "Something went wrong. Please try again." });
    });

    if (options.signal) {
      if (options.signal.aborted) {
        xhr.abort();
      } else {
        options.signal.addEventListener("abort", () => xhr.abort());
      }
    }

    xhr.timeout = UPLOAD_TIMEOUT_MS;
    xhr.open("POST", "/api/careers/resume");
    xhr.send(formData);
  });
}

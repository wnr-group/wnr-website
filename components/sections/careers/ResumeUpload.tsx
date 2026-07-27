"use client";

import { useCallback, useId, useRef, useState } from "react";
import { UploadCloud, FileText, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateFileMeta } from "@/lib/file-validation";
import { resumeConfig } from "@/content/careers";
import { uploadResume } from "@/services/careers";

type UploadState =
  | { status: "idle" }
  | { status: "selected"; file: File }
  | { status: "uploading"; file: File; progress: number }
  | { status: "success"; message: string }
  | { status: "error"; message: string; file?: File };

function fileOf(state: UploadState): File | undefined {
  switch (state.status) {
    case "selected":
    case "uploading":
      return state.file;
    case "error":
      return state.file;
    default:
      return undefined;
  }
}

export function ResumeUpload() {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const errorId = useId();

  const acceptAttr = resumeConfig.acceptedExtensions.join(",");

  const selectFile = useCallback((file: File) => {
    const error = validateFileMeta({ name: file.name, size: file.size, type: file.type }, resumeConfig);
    if (error) {
      setState({ status: "error", message: error });
      return;
    }
    setState({ status: "selected", file });
  }, []);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) selectFile(file);
    event.target.value = "";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) selectFile(file);
  };

  const submit = async () => {
    if (state.status !== "selected") return;
    const file = state.file;
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: "uploading", file, progress: 0 });

    const result = await uploadResume(file, {
      signal: controller.signal,
      onProgress: (percent) => {
        setState((current) => (current.status === "uploading" ? { ...current, progress: percent } : current));
      },
    });

    if (result.ok) {
      setState({ status: "success", message: result.message });
    } else {
      setState({ status: "error", message: result.message, file });
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setState({ status: "idle" });
  };

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-forest/20 bg-forest-wash p-8 text-center">
        <CheckCircle2 className="text-forest" size={32} aria-hidden="true" />
        <p className="font-display text-lg font-semibold text-ink">Resume received</p>
        <p className="text-sm text-body">{state.message}</p>
      </div>
    );
  }

  const file = fileOf(state);

  return (
    <div className="flex flex-col gap-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        aria-describedby={state.status === "error" ? errorId : undefined}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2",
          dragActive ? "border-forest bg-forest-wash" : "border-line-strong bg-mist",
        )}
      >
        <UploadCloud className="text-forest" size={28} aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-ink">
            Drag and drop your resume, or{" "}
            <span className="text-forest underline underline-offset-2">browse</span>
          </p>
          <p className="mt-1 text-xs text-muted">PDF, DOC, or DOCX, up to 4MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          onChange={onInputChange}
          className="sr-only"
          aria-label="Browse for a resume file"
        />
      </div>

      {file && (
        <div className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3">
          <FileText size={18} className="shrink-0 text-forest" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-sm text-ink">{file.name}</span>
          {state.status === "uploading" ? (
            <span className="flex shrink-0 items-center gap-2 text-xs font-semibold text-muted">
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              {state.progress}%
            </span>
          ) : (
            <button
              type="button"
              onClick={reset}
              aria-label="Remove selected file"
              className="shrink-0 text-muted transition-colors hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {state.status === "error" && (
        <p id={errorId} role="alert" className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle size={15} className="shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={state.status !== "selected"}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_-14px_rgba(18,71,52,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
      >
        {state.status === "uploading" ? "Uploading..." : "Upload Resume"}
      </button>
    </div>
  );
}

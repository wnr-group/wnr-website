import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { validateFileMeta, validateFileSignature, getExtension } from "@/lib/file-validation";
import { resumeConfig } from "@/content/careers";
import { rateLimit } from "@/lib/rate-limit";

function clientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`resume:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", message: "Too many uploads. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_body", message: "Expected multipart form data." },
      { status: 400 },
    );
  }

  const file = formData.get("resume");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "missing_file", message: "No file was uploaded." },
      { status: 400 },
    );
  }

  const metaError = validateFileMeta({ name: file.name, size: file.size, type: file.type }, resumeConfig);
  if (metaError) {
    return NextResponse.json({ ok: false, error: "invalid_file", message: metaError }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const extension = getExtension(file.name);
  const signatureError = validateFileSignature(bytes, extension);
  if (signatureError) {
    return NextResponse.json({ ok: false, error: "invalid_file", message: signatureError }, { status: 400 });
  }

  const uploadDir = path.join(tmpdir(), "wnr-resumes");
  await mkdir(uploadDir, { recursive: true });
  const storedName = `${randomUUID()}${extension}`;
  await writeFile(path.join(uploadDir, storedName), bytes);

  console.info("[careers] resume received", { originalName: file.name, size: file.size, ip });

  return NextResponse.json(
    { ok: true, message: "Resume received. We'll be in touch if there's a fit." },
    { status: 200 },
  );
}

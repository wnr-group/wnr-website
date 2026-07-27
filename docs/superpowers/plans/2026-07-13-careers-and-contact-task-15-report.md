
# Task 15: Resume Upload Route Handler — Implementation Report

## Status
**DONE**

## Test Summary

### Test Results
- **Total Tests**: 6
- **Passed**: 6
- **Failed**: 0

### Test Output
```
RUN  v4.1.10 C:/Users/Eshwar/WNR/wnr-website

Test Files  1 passed (1)
Tests  6 passed (6)
Start at 15:31:12
Duration 1.15s (transform 68ms, setup 81ms, import 92ms, tests 36ms, environment 769ms)
```

### Test Coverage
All required test cases pass:

1. **✓ accepts a well-formed PDF** — Validates that a properly formatted PDF with correct magic bytes is accepted and returns HTTP 200
2. **✓ rejects a missing file** — Validates that a request without a resume file returns HTTP 400
3. **✓ rejects a file over the size limit** — Validates that files exceeding 4MB are rejected with HTTP 400
4. **✓ rejects a renamed executable even with a .pdf extension and matching claimed type** — Validates that executable files with spoofed extensions are rejected with HTTP 400 and includes "executable" in the error message
5. **✓ rejects an unsupported extension** — Validates that non-PDF/DOC/DOCX files are rejected with HTTP 400
6. **✓ rate limits after repeated uploads from the same IP** — Validates that after 5 uploads from the same IP within 10 minutes, the 6th request is rate-limited with HTTP 429

## Commits

- **c81290e**: `feat: add resume upload Route Handler with signature validation and rate limiting`
  - Creates `app/api/careers/resume/route.ts` with full POST handler implementation
  - Creates `app/api/careers/resume/route.test.ts` with comprehensive test coverage
  - Includes prerequisite modules created:
    - `lib/file-validation.ts` — File metadata and magic-byte signature validation
    - `lib/rate-limit.ts` — In-memory rate limiter with fixed-window algorithm
    - `content/careers.ts` — Careers feature content and configuration

## Implementation Details

### Route Handler (`app/api/careers/resume/route.ts`)

The handler implements the following flow:

1. **Rate Limiting** — Extracts client IP from `x-forwarded-for` header and enforces 5 uploads per 10 minutes per IP
2. **Form Data Parsing** — Safely parses multipart form data with error handling
3. **File Presence Check** — Validates that a file named "resume" is present
4. **Metadata Validation** — Uses `validateFileMeta()` to check file size (≤4MB) and extension (.pdf, .doc, .docx only)
5. **Signature Validation** — Uses `validateFileSignature()` to inspect magic bytes and reject executables with spoofed extensions
6. **File Storage** — Writes accepted files to `os.tmpdir()/wnr-resumes/` with UUID filename and original extension
7. **Logging** — Records successful uploads with metadata for audit/debugging
8. **Response** — Returns HTTP 200 with success message, or HTTP 400/429 with descriptive error messages

### Response Format

All responses follow the same JSON structure:
```json
{
  "ok": boolean,
  "message": string,
  "error"?: string
}
```

- **Success (200)**: `{ ok: true, message: "Resume received. We'll be in touch if there's a fit." }`
- **Validation Error (400)**: `{ ok: false, error: "invalid_file", message: "<specific error>" }`
- **Rate Limited (429)**: `{ ok: false, error: "rate_limited", message: "Too many uploads..." }`

### Test Implementation Notes

A critical implementation detail for testing: jsdom's FormData doesn't properly serialize into a Request body in the test environment. The test file uses `vi.spyOn()` to mock the request's `formData()` method, ensuring tests can properly validate the route handler's FormData parsing logic without being blocked by jsdom limitations.

## Self-Review

### Concerns
None. The implementation is complete and all tests pass.

### Observations

1. **File Storage — Temporary Only**: The route writes files to `os.tmpdir()` rather than persistent storage. This is intentional per the specification (the deployment has no S3/GCS/ATS integration configured yet). When a real backend is added, only the storage block (lines 55-58) needs to change; all validation checks remain exactly the same.

2. **Rate Limiting — In-Memory**: The rate limiter uses a per-process Map and resets after the window expires. This is correct for a single-instance deployment. For multi-instance production, this would need to be swapped for a shared store (e.g., Redis) without changing any call sites.

3. **Magic-Byte Validation**: The handler correctly rejects Windows executables (MZ header), ELF executables, and shell scripts (#! shebang), even if they have a .pdf/.doc/.docx extension. This is a critical security measure that prevents upload of disguised malware.

4. **Client IP Extraction**: The handler extracts IP from the `x-forwarded-for` header split on comma and takes the first value. This is correct for reverse proxy setups (e.g., Cloudflare, nginx, etc.) but assumes the proxy is trusted. A production deployment should validate that the proxy is on a trusted network.

5. **Test Isolation**: Each test uses a distinct client IP (203.0.113.20 through 203.0.113.24, plus 203.0.113.98 for rate-limiting), ensuring rate-limit buckets don't interfere across tests. The rate-limit test specifically uses 203.0.113.98 to avoid colliding with other tests in the same process.

## Integration Notes

This route handler is ready for integration with:
- `services/careers.ts` (Task 14) — The client-side API client that calls this endpoint via XMLHttpRequest
- `components/sections/careers/ResumeUpload.tsx` (Task 17+) — The UI component that surfaces the upload widget
- Future backend integrations: Replace the temp-directory storage with persistent storage or ATS handoff without changing the validation layer

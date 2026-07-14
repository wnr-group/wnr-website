// Resume upload validation. `validateFileMeta` runs on both the browser
// (fast feedback before uploading) and the server (never trust the client).
// `validateFileSignature` is server-only: it inspects the actual file bytes,
// which is the only thing an attacker can't spoof without also breaking the
// file format itself — unlike the filename extension or the browser-reported
// MIME type, both of which are just labels the client sends along.

export interface FileValidationOptions {
  maxSizeBytes: number;
  acceptedExtensions: readonly string[];
  acceptedMimeTypes: readonly string[];
}

export interface FileMeta {
  name: string;
  size: number;
  type: string;
}

export function getExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx === -1 ? "" : filename.slice(idx).toLowerCase();
}

export function validateFileMeta(file: FileMeta, options: FileValidationOptions): string | null {
  if (file.size <= 0) return "File is empty.";
  if (file.size > options.maxSizeBytes) {
    const mb = Math.round(options.maxSizeBytes / (1024 * 1024));
    return `File must be under ${mb}MB.`;
  }
  const extension = getExtension(file.name);
  if (!options.acceptedExtensions.includes(extension)) {
    return "Only PDF, DOC, and DOCX files are accepted.";
  }
  if (file.type && !options.acceptedMimeTypes.includes(file.type)) {
    return "Only PDF, DOC, and DOCX files are accepted.";
  }
  return null;
}

interface Signature {
  extension: string;
  matches: (bytes: Uint8Array) => boolean;
}

const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46, 0x2d]; // "%PDF-"
const DOC_SIGNATURE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]; // OLE compound file
const DOCX_ZIP_MARKERS = [0x03, 0x05, 0x07]; // PK local-file / empty-archive / spanned-archive markers

function startsWith(bytes: Uint8Array, prefix: number[]): boolean {
  if (bytes.length < prefix.length) return false;
  return prefix.every((value, i) => bytes[i] === value);
}

const SIGNATURES: Signature[] = [
  { extension: ".pdf", matches: (bytes) => startsWith(bytes, PDF_SIGNATURE) },
  { extension: ".doc", matches: (bytes) => startsWith(bytes, DOC_SIGNATURE) },
  {
    extension: ".docx",
    matches: (bytes) =>
      bytes.length >= 4 &&
      bytes[0] === 0x50 &&
      bytes[1] === 0x4b &&
      DOCX_ZIP_MARKERS.includes(bytes[2]) &&
      (bytes[3] === 0x04 || bytes[3] === 0x06 || bytes[3] === 0x08),
  },
];

const DANGEROUS_SIGNATURES: { name: string; matches: (bytes: Uint8Array) => boolean }[] = [
  { name: "Windows executable", matches: (bytes) => startsWith(bytes, [0x4d, 0x5a]) },
  { name: "ELF executable", matches: (bytes) => startsWith(bytes, [0x7f, 0x45, 0x4c, 0x46]) },
  { name: "script", matches: (bytes) => startsWith(bytes, [0x23, 0x21]) }, // "#!" shebang
];

export function validateFileSignature(bytes: Uint8Array, extension: string): string | null {
  const dangerous = DANGEROUS_SIGNATURES.find((sig) => sig.matches(bytes));
  if (dangerous) return `File content looks like an executable or script and was rejected.`;

  const signature = SIGNATURES.find((sig) => sig.extension === extension);
  if (!signature) return "Unsupported file type.";
  if (!signature.matches(bytes)) return "File content does not match its extension.";
  return null;
}

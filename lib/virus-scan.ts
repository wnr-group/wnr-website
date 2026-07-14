/**
 * lib/virus-scan.ts — Virus/malware scan abstraction.
 *
 * The stub returns clean immediately. Swap `scanResume` for a real provider
 * (ClamAV, VirusTotal, Cloudflare Stream) without changing any call site.
 *
 * The interface is intentionally minimal — production integrations may add
 * `threatName`, `scanEngine`, `scanDurationMs` to the result without
 * breaking callers that only check `clean`.
 */

export interface VirusScanResult {
  clean: boolean;
  /** Set when `clean === false` — describes the detected threat. */
  threat?: string;
}

/**
 * Scan a file's bytes for malware.
 *
 * Current implementation: stub — always returns clean.
 * Replace the body of this function to integrate a real scanner.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- stub function ignores parameter until real scanner is integrated
export async function scanResume(_bytes: Uint8Array): Promise<VirusScanResult> {
  // TODO: integrate a real virus scanner (ClamAV, VirusTotal, etc.)
  // Example Resend/ClamAV integration:
  //   const result = await clamav.scanBuffer(_bytes);
  //   return { clean: result.isClean, threat: result.virusName };
  return { clean: true };
}

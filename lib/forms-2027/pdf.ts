/**
 * The exhibitor company profile (INTEGRATION-CONTRACT-v1.1 section 6),
 * checked and prepared on the website server: PDF only, 1 byte to 3 MB, a
 * ".pdf" name of at most 120 characters, bytes that begin "%PDF-". SHA-256 and
 * base64 are computed here. The file lives in memory for the request only;
 * nothing is written to disk.
 *
 * Real uploads stay off (UPLOADS_ENABLED in config.ts) until malware scanning
 * or secure quarantine is approved (contract open item O-3).
 */
import { createHash } from "node:crypto";

export const PDF_MAX_BYTES = 3_000_000;
export const PDF_NAME_MAX = 120;

export interface UploadedFile {
  name: string;
  type: string;
  bytes: Uint8Array;
}

export interface PreparedPdf {
  file_name: string;
  content_type: "application/pdf";
  size_bytes: number;
  sha256: string;
  data_base64: string;
}

export type PdfCheck = { ok: true; profile: PreparedPdf } | { ok: false; error: string };

const MAGIC = [0x25, 0x50, 0x44, 0x46, 0x2d]; // "%PDF-"

/** Strips any path and control characters a browser or client may send. */
function cleanName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "";
  return base.replace(/[\u0000-\u001f\u007f]/g, "").trim();
}

export function preparePdf(file: UploadedFile): PdfCheck {
  const name = cleanName(file.name);
  if (!name || !/\.pdf$/i.test(name) || name.length > PDF_NAME_MAX) {
    return { ok: false, error: "Please choose a PDF whose name ends in .pdf (up to 120 characters)." };
  }
  if (file.type !== "application/pdf") return { ok: false, error: "Please choose a PDF file." };
  if (file.bytes.length < 1) return { ok: false, error: "The file is empty." };
  if (file.bytes.length > PDF_MAX_BYTES) return { ok: false, error: "Please choose a PDF of 3 MB or less." };
  if (!MAGIC.every((b, i) => file.bytes[i] === b)) return { ok: false, error: "This file is not a PDF." };
  const buf = Buffer.from(file.bytes.buffer, file.bytes.byteOffset, file.bytes.byteLength);
  return {
    ok: true,
    profile: {
      file_name: name,
      content_type: "application/pdf",
      size_bytes: buf.length,
      sha256: createHash("sha256").update(buf).digest("hex"),
      data_base64: buf.toString("base64"),
    },
  };
}

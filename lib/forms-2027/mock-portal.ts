/**
 * A stand-in for the portal's evSubmitPublicForm, following
 * INTEGRATION-CONTRACT-v1.1 and checked against its 15 official test vectors
 * and its request schema (tests/forms-2027.test.ts). Development and tests
 * only: synthetic records in memory, never Base44.
 */
import { createHash, timingSafeEqual } from "node:crypto";
import { signBody } from "./sign";

export interface MockPortalOptions {
  secret: string | null;
  open?: Partial<Record<string, boolean>>;
  nowSeconds?: () => number;
  /** Answer 503 to the next N calls (simulated downtime). */
  downFor?: number;
  /** Never answer the next N calls (simulated timeout). */
  hangFor?: number;
}

type FieldRule = { t: "string"; max: number; enum?: readonly string[]; url?: boolean; email?: boolean } | { t: "boolean" } | { t: "true" } | { t: "file" };

const S = (max: number, extra: Partial<{ enum: readonly string[]; url: boolean; email: boolean }> = {}): FieldRule => ({ t: "string", max, ...extra });
const COMMON: Record<string, FieldRule> = {
  privacy_acknowledged: { t: "true" }, privacy_notice_version: S(40), consent_marketing: { t: "boolean" }, consent_version: S(40), country: S(100),
};
const WEB = { website_url: S(300, { url: true }), social_media: S(300) };

/** v1.1 section 4, per form: allowed fields and the required ones. */
export const MOCK_SCHEMA: Record<string, { required: string[]; fields: Record<string, FieldRule> }> = {
  priority: {
    required: ["full_name", "email", "privacy_acknowledged", "privacy_notice_version"],
    fields: {
      ...COMMON, ...WEB, full_name: S(200), email: S(200, { email: true }), phone: S(40), city: S(100), company: S(200),
      interest: S(60, { enum: ["Attendee", "Competitor", "Educator", "Sponsor", "Exhibitor", "Media", "Other"] }),
      category_interest: S(200), utm_source: S(100), utm_medium: S(100), utm_campaign: S(100),
    },
  },
  sponsor: {
    required: ["company_name", "email", "privacy_acknowledged", "privacy_notice_version"],
    fields: {
      ...COMMON, ...WEB, company_name: S(200), email: S(200, { email: true }), contact_person: S(200), phone: S(40),
      tier_interest: S(60), budget_range: S(60), message: S(2000), prospectus_requested: { t: "boolean" },
    },
  },
  exhibitor: {
    required: ["business_name", "email", "privacy_acknowledged", "privacy_notice_version"],
    fields: {
      ...COMMON, ...WEB, business_name: S(200), email: S(200, { email: true }), contact_person: S(200), phone: S(40),
      business_category: S(100), product_service: S(1000), booth_requirement: S(60), company_profile: { t: "file" },
    },
  },
  enquiry: {
    required: ["name", "email", "message", "privacy_acknowledged", "privacy_notice_version"],
    fields: { ...COMMON, name: S(200), email: S(200, { email: true }), message: S(2000), phone: S(40), subject: S(200) },
  },
};

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const PREFIX: Record<string, string> = { priority: "PRI", sponsor: "SPN", exhibitor: "EXH", enquiry: "ENQ" };
const TOP = new Set(["form", "edition", "client_request_id", "website", "data"]);
const FILE_KEYS = ["file_name", "content_type", "size_bytes", "sha256", "data_base64"];

export function createMockPortal(o: MockPortalOptions) {
  const now = o.nowSeconds ?? (() => Math.floor(Date.now() / 1000));
  const byRequest = new Map<string, string>();
  const priorityEmails = new Set<string>();
  let down = o.downFor ?? 0;
  let hang = o.hangFor ?? 0;
  let seq = 0;
  const calls: { status: number; body?: Record<string, unknown> }[] = [];

  const reply = (status: number, body: Record<string, unknown>) => {
    calls.push({ status, body });
    return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  };
  const err = (status: number, error: string, field?: string) => reply(status, field ? { error, field } : { error });
  const reference = (form: string) => {
    seq += 1;
    let n = seq * 7919 + 104729, s = "";
    for (let i = 0; i < 6; i++) { s += ALPHABET[n % ALPHABET.length]; n = Math.floor(n / ALPHABET.length) + i * 13; }
    return `H27-${PREFIX[form]}-${s}`;
  };

  function checkFile(v: unknown): { error: string } | null {
    if (!v || typeof v !== "object" || Array.isArray(v)) return { error: "invalid_value" };
    const f = v as Record<string, unknown>;
    if (Object.keys(f).some((k) => !FILE_KEYS.includes(k)) || FILE_KEYS.some((k) => !(k in f))) return { error: "invalid_value" };
    if (f.content_type !== "application/pdf" || typeof f.file_name !== "string" || !/\.pdf$/i.test(f.file_name) || f.file_name.length > 120) {
      return { error: "unsupported_file_type" };
    }
    if (typeof f.size_bytes !== "number" || f.size_bytes > 3_000_000) return { error: "file_too_large" };
    if (typeof f.data_base64 !== "string" || !/^[A-Za-z0-9+/]*={0,2}$/.test(f.data_base64) || f.data_base64.length % 4 !== 0) return { error: "invalid_value" };
    const bytes = Buffer.from(f.data_base64, "base64");
    if (bytes.length > 3_000_000) return { error: "file_too_large" };
    if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") return { error: "unsupported_file_type" };
    if (bytes.length < 1 || bytes.length !== f.size_bytes || createHash("sha256").update(bytes).digest("hex") !== f.sha256) return { error: "file_mismatch" };
    return null;
  }

  async function handle(raw: string, headers: Headers): Promise<Response> {
    if (!o.secret || o.secret.length < 32) return err(503, "not_configured");
    const ts = Number(headers.get("x-hebs-timestamp"));
    const sig = headers.get("x-hebs-signature") ?? "";
    const expected = signBody(o.secret, ts, raw);
    const good = sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    if (!Number.isFinite(ts) || !good || Math.abs(now() - ts) > 300) return err(401, "unauthorized");
    const bytes = Buffer.byteLength(raw, "utf8");
    if (bytes > 4_200_000) return err(413, "too_large");
    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { return err(400, "invalid_json"); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return err(400, "invalid_json");
    const extraTop = Object.keys(body).find((k) => !TOP.has(k));
    if (extraTop) return err(400, "unknown_field", extraTop);
    const form = String(body.form);
    if (!PREFIX[form]) return err(400, "unknown_form");
    if (body.edition !== "2027") return err(400, "unknown_edition");
    if (typeof body.client_request_id !== "string" || !body.client_request_id) return err(400, "client_request_id_required");
    if (typeof body.website === "string" && body.website !== "") return reply(202, { accepted: true });
    if (!(o.open?.[form] ?? false)) return reply(403, { error: "not_open", form });
    const data = (body.data && typeof body.data === "object" && !Array.isArray(body.data) ? body.data : {}) as Record<string, unknown>;
    if (bytes > 20_000 && !(form === "exhibitor" && data.company_profile)) return err(413, "too_large");
    const schema = MOCK_SCHEMA[form];
    const unknown = Object.keys(data).find((k) => !(k in schema.fields));
    if (unknown) return err(400, "unknown_field", unknown);
    const given = (k: string) => data[k] !== undefined && data[k] !== null && data[k] !== "";
    for (const k of schema.required) {
      if (!given(k)) return err(400, k === "privacy_acknowledged" ? "privacy_ack_required" : "missing_field", k);
    }
    for (const [k, rule] of Object.entries(schema.fields)) {
      if (!given(k)) continue;
      const v = data[k];
      if (rule.t === "true") { if (v !== true) return err(400, "privacy_ack_required", k); continue; }
      if (rule.t === "boolean") { if (typeof v !== "boolean") return err(400, "invalid_value", k); continue; }
      if (rule.t === "file") { const bad = checkFile(v); if (bad) return err(400, bad.error, k); continue; }
      if (typeof v !== "string") return err(400, "invalid_value", k);
      if (v.length > rule.max) return err(400, "too_long", k);
      if (rule.enum && !rule.enum.includes(v)) return err(400, "invalid_value", k);
      if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return err(400, "invalid_email", k);
      if (rule.url && !/^https?:\/\/\S+$/.test(v)) return err(400, "invalid_url", k);
    }
    if (data.consent_marketing === true && !given("consent_version")) return err(400, "missing_field", "consent_version");
    const prior = byRequest.get(body.client_request_id);
    if (prior) return reply(200, { reference: prior, duplicate: true });
    if (form === "priority") {
      const email = String(data.email).toLowerCase();
      if (priorityEmails.has(email)) return reply(200, { already_registered: true });
      priorityEmails.add(email);
    }
    const ref = reference(form);
    byRequest.set(body.client_request_id, ref);
    return reply(201, { reference: ref });
  }

  /** fetch-compatible entry point. */
  const fetchImpl = async (_url: string, init: RequestInit): Promise<Response> => {
    if (hang > 0) {
      hang -= 1;
      return new Promise<Response>((_, reject) => init.signal?.addEventListener("abort", () => reject(new Error("aborted"))));
    }
    if (down > 0) { down -= 1; return err(503, "server_error"); }
    return handle(String(init.body ?? ""), new Headers(init.headers));
  };
  return { fetch: fetchImpl, handle, calls, stored: () => byRequest.size };
}

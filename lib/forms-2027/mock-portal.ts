/**
 * A stand-in for the portal's evSubmitPublicForm, following
 * INTEGRATION-CONTRACT-v1.0 revision 1 and checked against its official test
 * vectors (tests/forms-contract.test.ts). Development and tests only: it keeps
 * synthetic records in memory and never talks to Base44.
 */
import { timingSafeEqual } from "node:crypto";
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

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const PREFIX: Record<string, string> = { priority: "PRI", sponsor: "SPN", exhibitor: "EXH", enquiry: "ENQ" };
const REQUIRED: Record<string, string[]> = {
  priority: ["full_name", "email"], sponsor: ["company_name", "email"], exhibitor: ["business_name", "email"], enquiry: ["name", "email", "message"],
};

export function createMockPortal(o: MockPortalOptions) {
  const now = o.nowSeconds ?? (() => Math.floor(Date.now() / 1000));
  const byRequest = new Map<string, string>();
  const priorityEmails = new Set<string>();
  let down = o.downFor ?? 0;
  let hang = o.hangFor ?? 0;
  let seq = 0;
  const calls: { status: number }[] = [];

  const reply = (status: number, body: unknown) => {
    calls.push({ status });
    return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  };
  const reference = (form: string) => {
    seq += 1;
    let n = seq * 7919 + 104729, s = "";
    for (let i = 0; i < 6; i++) { s += ALPHABET[n % ALPHABET.length]; n = Math.floor(n / ALPHABET.length) + i * 13; }
    return `H27-${PREFIX[form]}-${s}`;
  };

  async function handle(raw: string, headers: Headers): Promise<Response> {
    if (!o.secret) return reply(503, { error: "not_configured" });
    const ts = Number(headers.get("x-hebs-timestamp"));
    const sig = headers.get("x-hebs-signature") ?? "";
    const expected = signBody(o.secret, ts, raw);
    const good = sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    if (!Number.isFinite(ts) || !good || Math.abs(now() - ts) > 300) return reply(401, { error: "unauthorized" });
    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { return reply(400, { error: "invalid_json" }); }
    const form = String(body.form);
    if (!PREFIX[form]) return reply(400, { error: "unknown_form" });
    if (body.edition !== "2027") return reply(400, { error: "unknown_edition" });
    if (typeof body.client_request_id !== "string" || !body.client_request_id) return reply(400, { error: "client_request_id_required" });
    if (typeof body.website === "string" && body.website !== "") return reply(202, { accepted: true });
    if (!(o.open?.[form] ?? false)) return reply(403, { error: "not_open", form });
    const data = (body.data ?? {}) as Record<string, unknown>;
    if (REQUIRED[form].some((k) => typeof data[k] !== "string" || !data[k])) return reply(400, { error: "missing_field" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) return reply(400, { error: "invalid_email" });
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
    if (down > 0) { down -= 1; return reply(503, { error: "unavailable" }); }
    return handle(String(init.body ?? ""), new Headers(init.headers));
  };
  return { fetch: fetchImpl, handle, calls, stored: () => byRequest.size };
}

/**
 * The HEBS 2027 form submission handler behind POST /api/hebs2027/submit.
 * Pure: every dependency is passed in, so each rule is tested directly.
 *
 * Order of checks, cheapest and safest first; any failure ends the request
 * and nothing is stored:
 *   1  POST, JSON only (no multipart, so no file can arrive), at most 20 KB
 *   2  same-origin request
 *   3  forms switched on for this deployment
 *   4  shared rate limit, by salted hash of the visitor's IP (5 per 10 minutes)
 *   5  honeypot and minimum fill time: bots get a plain thank-you, nothing is sent
 *   6  field validation (the same rules the browser ran)
 *   7  one client_request_id per form attempt, held in the shared store
 *   8  signed call to the portal; only a portal reference is a confirmation
 */
import { createHash, randomUUID } from "node:crypto";
import { FORM_FIELDS } from "../integrations/registration-2027";
import { ContractGapError, classify, toPortalBody, type Outcome } from "./contract";
import { formEnabled, type SubmitConfig } from "./config";
import { logSubmit } from "./log";
import { callPortal, type FetchLike } from "./portal-client";
import type { SharedStore } from "./store";
import { isFormId, validateForm } from "./validate";

export const MAX_BODY_BYTES = 20 * 1024;
export const RATE_LIMIT = { max: 5, windowSeconds: 600 } as const;
export const MIN_FILL_MS = 1500;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface SubmitRequest {
  method: string;
  contentType: string | null;
  origin: string | null;
  host: string | null;
  ip: string | null;
  body: string;
}

export interface SubmitDeps {
  config: SubmitConfig;
  store: SharedStore | null;
  portalFetch?: FetchLike;
  nowSeconds?: () => number;
  sleep?: (ms: number) => Promise<void>;
  newId?: () => string;
  log?: (line: string) => void;
}

export interface SubmitResponse {
  httpStatus: number;
  outcome: Outcome | { status: "bad_request" } | { status: "not_found" };
}

const HTTP: Record<Outcome["status"], number> = {
  confirmed: 201, already_registered: 200, received: 200, closed: 403, invalid: 400, rate_limited: 429, unavailable: 503,
};
const done = (o: Outcome): SubmitResponse => ({ httpStatus: HTTP[o.status], outcome: o });
const bad = (httpStatus: number): SubmitResponse => ({ httpStatus, outcome: { status: "bad_request" } });

function sameOrigin(origin: string | null, host: string | null): boolean {
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function handleSubmit(req: SubmitRequest, deps: SubmitDeps): Promise<SubmitResponse> {
  const { config } = deps;
  const log = (form: string, outcome: string, extra: { portalStatus?: number; clientRequestId?: string } = {}) =>
    logSubmit({ form, outcome, ...extra }, deps.log);

  // A production deployment with forms off does not reveal that the route exists.
  if (config.mode === "off" && config.environment === "production") return { httpStatus: 404, outcome: { status: "not_found" } };
  if (req.method !== "POST") return bad(405);
  if (!req.contentType || !/^application\/json\b/i.test(req.contentType)) return bad(415);
  if (Buffer.byteLength(req.body, "utf8") > MAX_BODY_BYTES) return bad(413);
  if (!sameOrigin(req.origin, req.host)) return bad(403);

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(req.body);
  } catch {
    return bad(400);
  }
  if (!parsed || typeof parsed !== "object" || !isFormId(parsed.form)) return bad(400);
  const form = parsed.form;

  if (!formEnabled(form, config)) {
    log(form, "closed");
    return done({ status: "closed" });
  }
  if (!deps.store || !config.ipSalt) {
    log(form, "no_rate_limit_store");
    return done({ status: "unavailable" });
  }

  try {
    const who = createHash("sha256").update(`${config.ipSalt}:${req.ip ?? "unknown"}`).digest("hex");
    const n = await deps.store.hit(`hebs27:rl:${who}`, RATE_LIMIT.windowSeconds);
    if (n > RATE_LIMIT.max) {
      log(form, "rate_limited");
      return done({ status: "rate_limited" });
    }
  } catch {
    log(form, "store_error");
    return done({ status: "unavailable" });
  }

  const elapsed = typeof parsed.elapsed_ms === "number" ? parsed.elapsed_ms : 0;
  if ((typeof parsed.website === "string" && parsed.website !== "") || elapsed < MIN_FILL_MS) {
    log(form, "spam_filtered");
    return done({ status: "received" });
  }

  const v = validateForm(form, parsed.values);
  if (!v.ok) {
    log(form, "invalid");
    return done({ status: "invalid", errors: v.errors });
  }

  // One portal request id per form attempt: a double click or a resend reuses it.
  const attempt = typeof parsed.attempt_id === "string" && UUID.test(parsed.attempt_id) ? parsed.attempt_id : null;
  if (!attempt) return bad(400);
  let clientRequestId: string;
  try {
    const attemptKey = createHash("sha256").update(`${config.ipSalt}:${attempt}`).digest("hex");
    clientRequestId = await deps.store.claim(`hebs27:id:${attemptKey}`, (deps.newId ?? randomUUID)(), 3600);
  } catch {
    log(form, "store_error");
    return done({ status: "unavailable" });
  }

  let body: ReturnType<typeof toPortalBody>;
  try {
    body = toPortalBody(form, v.values, clientRequestId);
  } catch (e) {
    if (e instanceof ContractGapError) {
      log(form, "contract_gap", { clientRequestId });
      const field = FORM_FIELDS[form].find((f) => f.kind === "select")?.name ?? "_form";
      return done({ status: "invalid", errors: { [field]: "This option cannot be accepted yet. Please choose another for now." } });
    }
    throw e;
  }

  const portal = config.portal!;
  const res = await callPortal({
    url: portal.url, appId: portal.appId, secret: portal.secret, body,
    fetch: deps.portalFetch, nowSeconds: deps.nowSeconds, sleep: deps.sleep,
  });
  const outcome = classify(res.status, res.json);
  log(form, outcome.status, { portalStatus: res.status, clientRequestId });
  return done(outcome);
}

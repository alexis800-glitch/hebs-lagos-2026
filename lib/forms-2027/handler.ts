/**
 * The HEBS 2027 form submission handler behind POST /api/hebs2027/submit.
 * Pure: every dependency is passed in, so each rule is tested directly.
 *
 * Order of checks, cheapest and safest first; any failure ends the request
 * and nothing is stored:
 *   1  unpublished feature: anything but a POST, or any request while forms are
 *      off, is 404, as if the route did not exist
 *   2  JSON only, at most 20,000 bytes; a multipart upload only for the
 *      exhibitor form and only while uploads are enabled (off: contract O-3)
 *   3  same-origin request
 *   4  form switched on for this deployment
 *   5  shared rate limit, by salted hash of the visitor's IP (5 per 10 minutes)
 *   6  honeypot and minimum fill time: bots get a plain thank-you, nothing is sent
 *   7  field validation (the same rules the browser ran), then the PDF checks
 *   8  one client_request_id per form attempt, held in the shared store
 *   9  v1.1 request body; any field without a contract field refuses the request
 *  10  signed call to the portal; only a portal reference is a confirmation
 *
 * In private-test mode (config.ts) step 7 also refuses anything outside the
 * synthetic identity convention (TEST names and companies, @hebs-e2e.test), and a same-origin {"probe":"reachability"} carrying
 * the operator's X-HEBS-Probe-Token runs the run sheet's E0 check
 * (reachability.ts); without that token it answers 404.
 * The test-only notice version is refused in every other mode.
 */
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { ContractGapError, LIMITS, classify, toPortalBody, type Outcome } from "./contract";
import { formEnabled, syntheticIdentityErrors, type SubmitConfig } from "./config";
import { logSubmit } from "./log";
import { preparePdf, type PreparedPdf, type UploadedFile } from "./pdf";
import { callPortal, type FetchLike } from "./portal-client";
import { PRIVATE_TEST } from "./private-test.mjs";
import { probePortal, type ProbeResult } from "./reachability";
import type { SharedStore } from "./store";
import { isFormId, validateForm } from "./validate";

export const MAX_BODY_BYTES = LIMITS.bodyBytes;
/** Browser-to-website request carrying a PDF: the 3 MB file plus the form fields. */
export const MAX_UPLOAD_REQUEST_BYTES = 3_200_000;
export const RATE_LIMIT = { max: 5, windowSeconds: 600 } as const;
export const MIN_FILL_MS = 1500;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface SubmitRequest {
  method: string;
  contentType: string | null;
  origin: string | null;
  host: string | null;
  ip: string | null;
  /** The JSON form payload (for a multipart upload, its "payload" part). */
  body: string;
  /** The company-profile part of a multipart upload, if any. */
  file?: UploadedFile | null;
  /** The X-HEBS-Probe-Token header: the operator's authorisation for the E0 probe. */
  probeToken?: string | null;
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
  outcome: Outcome | { status: "bad_request" } | { status: "not_found" } | { status: "probe"; results: ProbeResult[] };
}

const HTTP: Record<Outcome["status"], number> = {
  confirmed: 201, already_registered: 200, received: 200, closed: 403, invalid: 400, rate_limited: 429, busy: 503, unavailable: 503,
};
const done = (o: Outcome): SubmitResponse => ({ httpStatus: HTTP[o.status], outcome: o });
const bad = (httpStatus: number): SubmitResponse => ({ httpStatus, outcome: { status: "bad_request" } });
const NOT_FOUND: SubmitResponse = { httpStatus: 404, outcome: { status: "not_found" } };
/** Shared-store key prefix: the private test's keys never share a namespace with any other mode's. */
export const storePrefix = (config: SubmitConfig) => (config.mode === "private-test" ? "hebs27-e2e:" : "hebs27:");

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

  // While the feature is unpublished the route answers like a missing page.
  if (req.method !== "POST" || config.mode === "off") return NOT_FOUND;

  const multipart = !!req.contentType && /^multipart\/form-data\b/i.test(req.contentType);
  const json = !!req.contentType && /^application\/json\b/i.test(req.contentType);
  if (!json && !(multipart && config.uploads)) return bad(415);
  if (Buffer.byteLength(req.body, "utf8") > MAX_BODY_BYTES) return bad(413);
  if (!sameOrigin(req.origin, req.host)) return bad(403);

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(req.body);
  } catch {
    return bad(400);
  }
  if (parsed && typeof parsed === "object" && "probe" in parsed) return probe(parsed, req, deps);
  if (!parsed || typeof parsed !== "object" || !isFormId(parsed.form)) return bad(400);
  const form = parsed.form;
  if (multipart && form !== "exhibitor") return bad(415);

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
    const n = await deps.store.hit(`${storePrefix(config)}rl:${who}`, RATE_LIMIT.windowSeconds);
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
  // The private test takes synthetic identities only (TEST-PLAN-E0-E12.md): TEST names and companies,
  // @hebs-e2e.test addresses, the reserved phone range. Nothing else is sent.
  if (config.mode === "private-test") {
    const notSynthetic = syntheticIdentityErrors(v.values);
    if (Object.keys(notSynthetic).length) {
      log(form, "not_synthetic");
      return done({ status: "invalid", errors: notSynthetic });
    }
  }

  let profile: PreparedPdf | undefined;
  if (req.file) {
    if (!config.uploads || form !== "exhibitor") {
      log(form, "upload_refused");
      return done({ status: "invalid", errors: { company_profile: "Uploads are not accepted yet." } });
    }
    const pdf = preparePdf(req.file);
    if (!pdf.ok) {
      log(form, "upload_invalid");
      return done({ status: "invalid", errors: { company_profile: pdf.error } });
    }
    profile = pdf.profile;
  }

  // One portal request id per form attempt: a double click or a resend reuses it.
  const attempt = typeof parsed.attempt_id === "string" && UUID.test(parsed.attempt_id) ? parsed.attempt_id : null;
  if (!attempt) return bad(400);
  let clientRequestId: string;
  try {
    const attemptKey = createHash("sha256").update(`${config.ipSalt}:${attempt}`).digest("hex");
    clientRequestId = await deps.store.claim(`${storePrefix(config)}id:${attemptKey}`, (deps.newId ?? randomUUID)(), 3600);
  } catch {
    log(form, "store_error");
    return done({ status: "unavailable" });
  }

  let body: ReturnType<typeof toPortalBody>;
  try {
    body = toPortalBody(form, v.values, clientRequestId, config.notices, profile);
    const test = PRIVATE_TEST.noticeVersion;
    if (config.mode !== "private-test" && (body.data.privacy_notice_version === test || body.data.consent_version === test)) {
      throw new ContractGapError("the test-only notice is never sent outside the private test");
    }
  } catch (e) {
    if (e instanceof ContractGapError) {
      // Refused rather than sent incomplete: nothing the visitor entered is dropped.
      log(form, "contract_gap", { clientRequestId });
      return done({ status: "invalid", errors: { _form: "This form cannot be sent yet. Nothing was saved." } });
    }
    throw e;
  }

  const portal = config.portal!;
  const res = await callPortal({
    url: portal.url, appId: portal.appId, secret: portal.secret, body,
    fetch: deps.portalFetch, nowSeconds: deps.nowSeconds, sleep: deps.sleep,
    timeoutMs: profile ? LIMITS.timeoutWithFileMs : LIMITS.timeoutMs,
  });
  const outcome = classify(form, res.status, res.json, res.retryAfter);
  log(form, outcome.status, { portalStatus: res.status, clientRequestId });
  return done(outcome);
}

const digest = (s: string) => createHash("sha256").update(s, "utf8").digest();

/** Whether the request carries the operator token, compared in constant time. */
function operatorAuthorised(expected: string | undefined, given: string | null | undefined): boolean {
  if (!expected || !given) return false;
  return timingSafeEqual(digest(expected), digest(given));
}

/**
 * Run sheet E0: only in private-test mode, only with the operator's token, and
 * otherwise as if it did not exist (404). It writes nothing anywhere: not even
 * the rate-limit store; the token is what limits it.
 */
async function probe(parsed: Record<string, unknown>, req: SubmitRequest, deps: SubmitDeps): Promise<SubmitResponse> {
  const { config } = deps;
  if (config.mode !== "private-test" || parsed.probe !== "reachability" || !config.portal) return NOT_FOUND;
  if (!operatorAuthorised(config.probeToken, req.probeToken)) return NOT_FOUND;
  const results = await probePortal({
    url: config.portal.url, appId: config.portal.appId, secret: config.portal.secret,
    fetch: deps.portalFetch, nowSeconds: deps.nowSeconds, newId: deps.newId,
  });
  for (const r of results) logSubmit({ form: "probe", outcome: `${r.request}:${r.error ?? "none"}`, portalStatus: r.status }, deps.log);
  return { httpStatus: 200, outcome: { status: "probe", results } };
}

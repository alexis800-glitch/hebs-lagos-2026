/**
 * HEBS 2027 website forms against INTEGRATION-CONTRACT-v1.1: validation,
 * mapping, signing, the official test vectors, the submission handler, the PDF
 * path and production isolation. Synthetic data only; no network, no real
 * portal, no live secret.
 */
import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FORM_FIELDS, INTEREST_OPTIONS } from "../lib/integrations/registration-2027";
import { validateForm } from "../lib/forms-2027/validate";
import { signBody, signedRequest } from "../lib/forms-2027/sign";
import { createMockPortal, MOCK_SCHEMA } from "../lib/forms-2027/mock-portal";
import { handleSubmit, RATE_LIMIT, type SubmitDeps, type SubmitRequest } from "../lib/forms-2027/handler";
import { MOCK_NOTICES, MOCK_SECRET, UPLOADS_ENABLED, formEnabled, submitConfig, type SubmitConfig } from "../lib/forms-2027/config";
import { memoryStore, restStore, type SharedStore } from "../lib/forms-2027/store";
import {
  BLOCKED_FIELDS, CONTRACT, FIELD_MAP, MAX_INLINE_BUSY_WAIT_S, NOTICE_VERSIONS, OWNER_INTERESTS, PROFILE_ACCEPTED, RETRYABLE, busyDelaySeconds, classify, toPortalBody,
} from "../lib/forms-2027/contract";
import { PARTNERSHIP_OPTIONS } from "../lib/integrations/registration-2027";
import { preparePdf, PDF_MAX_BYTES } from "../lib/forms-2027/pdf";
import { callPortal } from "../lib/forms-2027/portal-client";
import * as route from "../app/api/hebs2027/submit/route";

const ROOT = join(__dirname, "..");
const V11 = join(ROOT, "docs/integration/hebs-2027-contract-v1.1");
const VECTORS = JSON.parse(readFileSync(join(V11, "hebs-2027-form-test-vectors.v1.1.json"), "utf8"));
const SCHEMA = JSON.parse(readFileSync(join(V11, "hebs-2027-form-request.v1.1.schema.json"), "utf8"));
const NOW = 1793750400;

const priority = (over: Record<string, unknown> = {}) => ({
  full_name: "Synthetic Person", email: "person@synthetic.test", country: "Testland", interest: "Attendee", privacy_acknowledged: true, ...over,
});
const sponsor = {
  company_name: "Synthetic Brand", contact_name: "Synthetic Contact", email: "brand@synthetic.test", country: "Testland",
  partnership_interest: "Sponsorship", prospectus_requested: true, website_url: "https://brand.synthetic.test", social_media: "@synthetic", privacy_acknowledged: true,
};
const exhibitor = {
  company_name: "Synthetic Tools", contact_name: "Synthetic Contact", email: "tools@synthetic.test", country: "Testland",
  products: "Synthetic combs", website_url: "https://tools.synthetic.test", social_media: "@tools", privacy_acknowledged: true,
};
const enquiry = { full_name: "Synthetic Person", email: "ask@synthetic.test", topic: "General question", message: "A synthetic question.", privacy_acknowledged: true };
const PDF = new Uint8Array(Buffer.from("%PDF-1.4\n% synthetic test file\n%%EOF\n", "latin1"));
const pdfFile = (over: Partial<{ name: string; type: string; bytes: Uint8Array }> = {}) => ({ name: "Synthetic Profile.pdf", type: "application/pdf", bytes: PDF, ...over });

let uuidN = 0;
const uuid = () => `00000000-0000-4000-8000-${String(++uuidN).padStart(12, "0")}`;

function mockConfig(over: Partial<SubmitConfig> = {}): SubmitConfig {
  return {
    environment: "development", mode: "mock", store: { kind: "memory" }, ipSalt: "test-salt", notices: MOCK_NOTICES, uploads: false,
    portal: { url: "https://mock.portal.invalid/evSubmitPublicForm", appId: "mock-app", secret: MOCK_SECRET }, ...over,
  };
}

function rig(opts: { portal?: Parameters<typeof createMockPortal>[0]; config?: Partial<SubmitConfig>; store?: SharedStore | null; now?: () => number } = {}) {
  const portal = createMockPortal(opts.portal ?? { secret: MOCK_SECRET, open: { priority: true, sponsor: true, exhibitor: true, enquiry: true }, nowSeconds: () => NOW });
  const lines: string[] = [];
  const sleeps: number[] = [];
  const deps: SubmitDeps = {
    config: mockConfig(opts.config),
    store: opts.store === undefined ? memoryStore() : opts.store,
    portalFetch: portal.fetch,
    nowSeconds: opts.now ?? (() => NOW),
    sleep: async (ms) => { sleeps.push(ms); },
    log: (l) => lines.push(l),
  };
  const send = (body: Record<string, unknown>, req: Partial<SubmitRequest> = {}) =>
    handleSubmit({
      method: "POST", contentType: "application/json", origin: "https://staging.example.test", host: "staging.example.test", ip: "203.0.113.7",
      body: JSON.stringify({ elapsed_ms: 5000, website: "", attempt_id: uuid(), ...body }), ...req,
    }, deps);
  const lastBody = () => portal.calls.length ? JSON.parse(JSON.stringify(portal.calls)) : [];
  return { portal, deps, lines, sleeps, send, lastBody };
}

/* ── Contract v1.1 fidelity ─────────────────────────────────────────── */

describe("contract v1.1 files", () => {
  it("are the reviewed copies (checksums recorded in docs/integration)", () => {
    const sums = readFileSync(join(V11, "SHA256SUMS"), "utf8").trim().split("\n").map((l) => l.split(/\s+/));
    expect(sums).toHaveLength(4);
    for (const [hash, name] of sums) expect(createHash("sha256").update(readFileSync(join(V11, name))).digest("hex"), name).toBe(hash);
  });

  it("the mock portal accepts exactly the fields, lengths and requirements of the request schema", () => {
    for (const block of SCHEMA.allOf) {
      const form = block.if.properties.form.const as string;
      const data = block.then.properties.data;
      const mock = MOCK_SCHEMA[form];
      expect(Object.keys(mock.fields).sort(), form).toEqual(Object.keys(data.properties).sort());
      expect([...mock.required].sort(), form).toEqual([...data.required].sort());
      for (const [k, p] of Object.entries<Record<string, unknown>>(data.properties)) {
        const rule = mock.fields[k] as { t: string; max?: number; enum?: readonly string[] };
        if (p.maxLength) expect(rule.max, `${form}.${k}`).toBe(p.maxLength);
        if (p.enum) expect(rule.enum, `${form}.${k}`).toEqual(p.enum);
      }
    }
  });

  it("is not yet final, so real-portal mode stays off", () => {
    expect(CONTRACT.final).toBe(false);
    const env = { HEBS_FORMS_MODE: "portal", HEBS_PORTAL_FORM_URL: "https://p.test/x", HEBS_PORTAL_APP_ID: "a", HEBS_PORTAL_FORM_SECRET: "s".repeat(40), HEBS_RATE_LIMIT_REST_URL: "https://kv.test", HEBS_RATE_LIMIT_REST_TOKEN: "t", HEBS_RATE_LIMIT_SALT: "x" };
    expect(submitConfig(env).mode).toBe("off");
  });
});

/* ── Fields and mapping ─────────────────────────────────────────────── */

describe("fields and mapping", () => {
  it("offers exactly the owner's six priority interests, never Media", () => {
    expect([...INTEREST_OPTIONS]).toEqual(["Attendee", "Competitor", "Educator", "Exhibitor", "Sponsor", "Other"]);
    expect([...OWNER_INTERESTS]).toEqual([...INTEREST_OPTIONS]);
    expect(validateForm("priority", priority({ interest: "Media" })).errors.interest).toBeTruthy();
    expect(validateForm("priority", priority({ interest: "Contestant" })).errors.interest).toBeTruthy();
  });

  it("sends each of the six interests unchanged, with no remapping", async () => {
    const r = rig();
    for (let i = 0; i < OWNER_INTERESTS.length; i++) {
      const interest = OWNER_INTERESTS[i];
      const res = await r.send({ form: "priority", values: priority({ interest, email: `p${i}@synthetic.test` }) }, { ip: `192.0.2.${i + 1}` });
      expect(res.outcome.status, interest).toBe("confirmed");
      expect(r.portal.calls.at(-1)?.status).toBe(201);
    }
    const sent = toPortalBody("priority", validateForm("priority", priority({ interest: "Competitor" })).values, uuid(), MOCK_NOTICES);
    expect(sent.data.interest).toBe("Competitor");
  });

  it("maps every website field to a v1.1 field, so nothing is dropped", () => {
    for (const form of ["priority", "sponsor", "exhibitor", "enquiry"] as const) {
      const allowed = Object.keys(MOCK_SCHEMA[form].fields);
      for (const f of FORM_FIELDS[form]) {
        if (f.consent || f.kind === "file") continue;
        if (BLOCKED_FIELDS[form][f.name]) {
          expect(FIELD_MAP[form][f.name], `${form}.${f.name} is blocked, so unmapped`).toBeUndefined();
          continue;
        }
        expect(FIELD_MAP[form][f.name], `${form}.${f.name}`).toBeDefined();
        expect(allowed, `${form}.${f.name} -> ${FIELD_MAP[form][f.name]}`).toContain(FIELD_MAP[form][f.name]);
      }
    }
  });

  it("refuses, rather than drops, a value it has no contract field for", () => {
    const v = { ...validateForm("enquiry", enquiry).values, stray: "x" };
    expect(() => toPortalBody("enquiry", v, uuid(), MOCK_NOTICES)).toThrow(/no v1.1 field/);
  });

  it("sends the partnership type as its own required field, with exactly the contract's four values, never as tier_interest", async () => {
    const schemaEnum = SCHEMA.allOf.find((b: { if: { properties: { form: { const: string } } } }) => b.if.properties.form.const === "sponsor")
      .then.properties.data.properties.partnership_interest.enum;
    expect([...PARTNERSHIP_OPTIONS]).toEqual(schemaEnum);
    expect(Object.keys(BLOCKED_FIELDS.sponsor)).toEqual([]);
    expect(FIELD_MAP.sponsor.partnership_interest).toBe("partnership_interest");
    expect(Object.values(FIELD_MAP.sponsor)).not.toContain("tier_interest");
    expect(validateForm("sponsor", { ...sponsor, partnership_interest: "" }).errors.partnership_interest).toBeTruthy();
    expect(validateForm("sponsor", { ...sponsor, partnership_interest: "Gold tier" }).errors.partnership_interest).toBeTruthy();
    const r = rig();
    for (let i = 0; i < PARTNERSHIP_OPTIONS.length; i++) {
      const res = await r.send({ form: "sponsor", values: { ...sponsor, partnership_interest: PARTNERSHIP_OPTIONS[i] } }, { ip: `192.0.2.${i + 50}` });
      expect(res.outcome.status, PARTNERSHIP_OPTIONS[i]).toBe("confirmed");
    }
    expect(r.portal.calls.every((c) => c.status === 201)).toBe(true);
  });

  it("carries the partnership type, prospectus request, country, website and social fields", () => {
    const s = toPortalBody("sponsor", validateForm("sponsor", sponsor).values, uuid(), MOCK_NOTICES).data;
    expect(s).toMatchObject({ partnership_interest: "Sponsorship", prospectus_requested: true, country: "Testland", website_url: "https://brand.synthetic.test", social_media: "@synthetic" });
    expect(s).not.toHaveProperty("tier_interest");
    const e = toPortalBody("exhibitor", validateForm("exhibitor", exhibitor).values, uuid(), MOCK_NOTICES).data;
    expect(e).toMatchObject({ country: "Testland", website_url: "https://tools.synthetic.test", social_media: "@tools", business_name: "Synthetic Tools", product_service: "Synthetic combs" });
  });
});

/* ── Privacy acknowledgement and marketing consent ──────────────────── */

describe("privacy acknowledgement and marketing consent (v1.1 section 5)", () => {
  it("requires the acknowledgement on every form and keeps marketing optional and unticked", () => {
    for (const form of ["priority", "sponsor", "exhibitor", "enquiry"] as const) {
      const ack = FORM_FIELDS[form].filter((f) => f.consent === "acknowledgement");
      expect(ack, form).toHaveLength(1);
      expect(ack[0].required).toBe(true);
      for (const m of FORM_FIELDS[form].filter((f) => f.consent === "marketing")) expect(m.required).toBe(false);
    }
    expect(validateForm("priority", priority({ privacy_acknowledged: false })).errors.privacy_acknowledged).toBeTruthy();
    expect(validateForm("priority", priority()).values.marketing_opt_in).toBe(false);
  });

  it("sends the acknowledgement with the notice version, and consent only when ticked, with its version", () => {
    const no = toPortalBody("priority", validateForm("priority", priority()).values, uuid(), MOCK_NOTICES).data;
    expect(no).toMatchObject({ privacy_acknowledged: true, privacy_notice_version: MOCK_NOTICES.privacy });
    expect(no).not.toHaveProperty("consent_marketing");
    expect(no).not.toHaveProperty("consent_version");
    const yes = toPortalBody("priority", validateForm("priority", priority({ marketing_opt_in: true })).values, uuid(), MOCK_NOTICES).data;
    expect(yes).toMatchObject({ consent_marketing: true, consent_version: MOCK_NOTICES.consent });
  });

  it("cannot build a real submission until the D13 privacy notice exists", () => {
    expect(NOTICE_VERSIONS.privacy).toBeNull();
    expect(() => toPortalBody("priority", validateForm("priority", priority()).values, uuid(), NOTICE_VERSIONS)).toThrow(/D13/);
    expect(formEnabled("priority", { ...mockConfig(), mode: "portal", notices: NOTICE_VERSIONS })).toBe(false);
  });

  it("refuses a ticked marketing box without a consent version instead of sending it incomplete", async () => {
    const r = rig({ config: { notices: { privacy: "2027-01", consent: null } } });
    const res = await r.send({ form: "priority", values: priority({ marketing_opt_in: true }) });
    expect(res.outcome).toMatchObject({ status: "invalid" });
    expect(r.portal.calls).toHaveLength(0);
  });
});

/* ── Signing and the official vectors ───────────────────────────────── */

describe("signing and the 21 official v1.1 test vectors (Gate A corrections revision)", () => {
  const secret = VECTORS.secret as string;
  it("reproduces every correctly signed vector", () => {
    expect(VECTORS.vectors).toHaveLength(21);
    for (const x of VECTORS.vectors) {
      const ours = signBody(secret, x.timestamp, x.raw_body);
      if (/wrong secret|altered after signing/.test(x.name)) expect(ours, x.name).not.toBe(x.signature);
      else expect(ours, x.name).toBe(x.signature);
    }
  });

  it("matches the contract's worked example", () => {
    const raw = '{"form":"priority","edition":"2027","client_request_id":"6f1c2a9e-4b7d-4c3e-9a1f-2d8e5b7c0a14","website":"","data":{"full_name":"Synthetic Person","email":"person@synthetic.test","country":"Nigeria","interest":"Attendee","privacy_acknowledged":true,"privacy_notice_version":"2027-01"}}';
    expect(signBody("synthetic-secret-synthetic-secret-0123456789", 1793750400, raw)).toBe("efb7d843c436d6897806664e84119826a0c727a3d2b499e6935f25c5ef5eaeb8");
  });

  it("signs the exact string it sends and sends no Authorization header", () => {
    const r = signedRequest("s".repeat(32), "app", { b: 1, a: [2] }, NOW);
    expect(r.raw).toBe('{"b":1,"a":[2]}');
    expect(r.headers["X-HEBS-Signature"]).toBe(signBody("s".repeat(32), NOW, r.raw));
    expect(r.headers).not.toHaveProperty("Authorization");
  });

  it("gets the expected status and body from the mock portal for every vector, in order", async () => {
    const open = { priority: true, sponsor: true, exhibitor: true, enquiry: true };
    const shared = createMockPortal({ secret, nowSeconds: () => VECTORS.portal_clock_for_vectors, open });
    for (const x of VECTORS.vectors) {
      const portal = /form closed/.test(x.name) ? createMockPortal({ secret, nowSeconds: () => NOW, open: {} }) : shared;
      const res = await portal.handle(x.raw_body, new Headers({ "x-hebs-timestamp": String(x.timestamp), "x-hebs-signature": x.signature }));
      expect(res.status, x.name).toBe(x.expected_status);
      const body = await res.json();
      const shape = x.expected_body_shape as Record<string, unknown>;
      for (const [k, v] of Object.entries(shape)) {
        if (k === "reference") expect(body.reference, x.name).toMatch(new RegExp(`^${String(v).replace(/X+$/, "[2-9A-HJKMNP-Z]{6}")}$`));
        else expect(body[k], `${x.name}: ${k}`).toEqual(v);
      }
      expect(Object.keys(body).sort(), x.name).toEqual(Object.keys(shape).sort());
    }
  });
});

/* ── Submission handler ─────────────────────────────────────────────── */

describe("submission handler with the mock portal", () => {
  it("submits all four forms and confirms only with a portal reference", async () => {
    const r = rig();
    for (const [form, values] of [["priority", priority()], ["sponsor", sponsor], ["exhibitor", exhibitor], ["enquiry", enquiry]] as const) {
      const res = await r.send({ form, values });
      expect(res.outcome, form).toMatchObject({ status: "confirmed", reference: expect.stringMatching(/^H27-(PRI|SPN|EXH|ENQ)-[2-9A-HJKMNP-Z]{6}$/) });
    }
  });

  it("validates before calling the portal", async () => {
    const r = rig();
    let ip = 0;
    const from = () => ({ ip: `192.0.2.${++ip}` });
    for (const bad of [priority({ email: "bad" }), priority({ full_name: "" }), priority({ is_test: true }), priority({ country: "c".repeat(101) })]) {
      expect((await r.send({ form: "priority", values: bad }, from())).outcome.status).toBe("invalid");
    }
    expect((await r.send({ form: "sponsor", values: { ...sponsor, website_url: "javascript:alert(1)" } }, from())).outcome).toMatchObject({ errors: { website_url: expect.any(String) } });
    expect((await r.send({ form: "exhibitor", values: { ...exhibitor, social_media: "s".repeat(301) } }, from())).outcome).toMatchObject({ errors: { social_media: expect.any(String) } });
    expect(r.portal.calls).toHaveLength(0);
  });

  it("shows a portal field error against the right website field", () => {
    expect(classify("sponsor", 400, { error: "invalid_url", field: "website_url" })).toEqual({ status: "invalid", errors: { website_url: expect.any(String) } });
    expect(classify("exhibitor", 400, { error: "too_long", field: "business_name" })).toEqual({ status: "invalid", errors: { company_name: expect.any(String) } });
    expect(classify("priority", 400, { error: "privacy_ack_required", field: "privacy_acknowledged" })).toEqual({ status: "invalid", errors: { privacy_acknowledged: expect.any(String) } });
    expect(classify("priority", 400, { error: "unknown_field", field: "status" })).toMatchObject({ status: "invalid", errors: { _form: expect.any(String) } });
  });

  it("treats a double submission as one record, and a second priority sign-up as already registered", async () => {
    const r = rig();
    const attempt_id = uuid();
    const a = await r.send({ form: "enquiry", values: enquiry, attempt_id });
    const b = await r.send({ form: "enquiry", values: enquiry, attempt_id });
    expect(b.outcome).toEqual(a.outcome);
    expect(r.portal.calls.map((c) => c.status)).toEqual([201, 200]);
    expect(r.portal.stored()).toBe(1);
    await r.send({ form: "priority", values: priority() });
    expect((await r.send({ form: "priority", values: priority({ full_name: "Someone Else" }) })).outcome).toEqual({ status: "already_registered" });
  });

  it("retries once, with the same request id, on 500 and 503 only", async () => {
    expect(Array.from(RETRYABLE).sort()).toEqual([500, 503]);
    const r = rig({ portal: { secret: MOCK_SECRET, open: { priority: true }, nowSeconds: () => NOW, downFor: 1 } });
    expect((await r.send({ form: "priority", values: priority() })).outcome.status).toBe("confirmed");
    expect(r.portal.calls.map((c) => c.status)).toEqual([503, 201]);
    expect(r.sleeps).toEqual([2000]);
    let n = 0;
    const once = await callPortal({ url: "https://x.invalid", appId: "a", secret: MOCK_SECRET, body: {}, fetch: async () => { n++; return new Response('{"error":"too_large"}', { status: 413 }); }, sleep: async () => {} });
    expect(once).toMatchObject({ status: 413, attempts: 1 });
    expect(n).toBe(1);
  });

  it("on 503 busy waits retry_after_s and retries once with the same request id", async () => {
    const r = rig({ portal: { secret: MOCK_SECRET, open: { priority: true }, nowSeconds: () => NOW, busyFor: 1, busyRetryAfter: 3 } });
    const res = await r.send({ form: "priority", values: priority() });
    expect(res.outcome.status).toBe("confirmed");
    expect(r.portal.calls.map((c) => c.status)).toEqual([503, 201]);
    expect(r.sleeps).toEqual([3000]);
  });

  it("does not wait out a long busy delay inside one request: no confirmation, the visitor is told when to resend", async () => {
    const r = rig({ portal: { secret: MOCK_SECRET, open: { priority: true }, nowSeconds: () => NOW, busyFor: 1, busyRetryAfter: 30 } });
    const attempt_id = uuid();
    const first = await r.send({ form: "priority", values: priority(), attempt_id });
    expect(first).toEqual({ httpStatus: 503, outcome: { status: "busy", retryAfterSeconds: 30 } });
    expect(r.portal.calls).toHaveLength(1);
    expect(r.sleeps).toEqual([]);
    // The visitor's resend carries the same attempt, so the portal sees the same client_request_id.
    const again = await r.send({ form: "priority", values: priority(), attempt_id });
    expect(again.outcome.status).toBe("confirmed");
    const ids = r.portal.calls.map((c, i) => i);
    expect(ids).toHaveLength(2);
  });

  it("keeps the same client_request_id across every permitted retry and resend", async () => {
    const seen: string[] = [];
    const portal = createMockPortal({ secret: MOCK_SECRET, open: { priority: true }, nowSeconds: () => NOW, busyFor: 2, busyRetryAfter: 1 });
    const r = rig();
    r.deps.portalFetch = async (url, init) => { seen.push(JSON.parse(String(init.body)).client_request_id); return portal.fetch(url, init); };
    const attempt_id = uuid();
    expect((await r.send({ form: "priority", values: priority(), attempt_id })).outcome).toEqual({ status: "busy", retryAfterSeconds: 1 });
    expect((await r.send({ form: "priority", values: priority(), attempt_id })).outcome.status).toBe("confirmed");
    expect(seen).toHaveLength(3);
    expect(new Set(seen).size).toBe(1);
  });

  it("bounds every busy delay to 1-60 s and never makes more than two calls", async () => {
    expect(busyDelaySeconds({ retry_after_s: 0 }, null)).toBe(1);
    expect(busyDelaySeconds({ retry_after_s: 999 }, null)).toBe(60);
    expect(busyDelaySeconds({ retry_after_s: 2.2 }, null)).toBe(3);
    expect(busyDelaySeconds({}, "7")).toBe(7);
    expect(busyDelaySeconds({}, "soon")).toBe(2);
    expect(busyDelaySeconds({ retry_after_s: "4" }, null)).toBe(2);
    expect(busyDelaySeconds({}, null)).toBe(2);
    expect(busyDelaySeconds({ retry_after_s: Number.NaN }, null)).toBe(2);
    expect(MAX_INLINE_BUSY_WAIT_S).toBeLessThanOrEqual(5);
    // Every combination of two bad answers ends after at most two calls and never confirms.
    const answers: [number, unknown][] = [[503, { error: "busy", retry_after_s: 1 }], [503, { error: "audit_failed" }], [500, { error: "server_error" }], [0, null], [413, { error: "too_large" }]];
    for (const a of answers) for (const b of answers) {
      let n = 0;
      const seq = [a, b, [201, { reference: "H27-PRI-ABCDEF" }]] as [number, unknown][];
      const res = await callPortal({
        url: "https://x.invalid", appId: "a", secret: MOCK_SECRET, body: {}, sleep: async () => {},
        fetch: async () => { const [st, body] = seq[n++]; if (st === 0) throw new Error("down"); return new Response(JSON.stringify(body), { status: st }); },
      });
      expect(n, JSON.stringify([a, b])).toBeLessThanOrEqual(2);
      expect(classify("priority", res.status, res.json, res.retryAfter).status).not.toBe("confirmed");
    }
  });

  it("on 503 audit_failed retries once with the same id; a second failure confirms nothing and stores nothing", async () => {
    const once = rig({ portal: { secret: MOCK_SECRET, open: { priority: true }, nowSeconds: () => NOW, auditFailFor: 1 } });
    expect((await once.send({ form: "priority", values: priority() })).outcome.status).toBe("confirmed");
    expect(once.portal.calls.map((c) => c.status)).toEqual([503, 201]);
    expect(once.portal.stored()).toBe(1);
    const twice = rig({ portal: { secret: MOCK_SECRET, open: { priority: true }, nowSeconds: () => NOW, auditFailFor: 2 } });
    expect((await twice.send({ form: "priority", values: priority() })).outcome).toEqual({ status: "unavailable" });
    expect(twice.portal.stored()).toBe(0);
  });

  it("stores one record for simultaneous identical requests: one 201, the rest duplicates of the same reference", async () => {
    const portal = createMockPortal({ secret: MOCK_SECRET, open: { priority: true, sponsor: true, exhibitor: true, enquiry: true }, nowSeconds: () => NOW });
    for (const [form, values] of [["priority", priority()], ["sponsor", sponsor], ["exhibitor", exhibitor], ["enquiry", enquiry]] as const) {
      const body = toPortalBody(form, validateForm(form, values).values, uuid(), MOCK_NOTICES);
      const { raw, headers } = signedRequest(MOCK_SECRET, "a", body, NOW);
      const answers = await Promise.all(Array.from({ length: 8 }, () => portal.handle(raw, new Headers(headers)).then(async (r) => ({ status: r.status, body: await r.json() }))));
      expect(answers.filter((a) => a.status === 201), form).toHaveLength(1);
      expect(answers.filter((a) => a.status === 200 && a.body.duplicate === true), form).toHaveLength(7);
      expect(new Set(answers.map((a) => a.body.reference)).size, form).toBe(1);
    }
    expect(portal.stored()).toBe(4);
  });

  it("never confirms when the portal is down, unreachable, hanging or refuses the signature", async () => {
    const down = rig({ portal: { secret: MOCK_SECRET, open: { priority: true }, nowSeconds: () => NOW, downFor: 2 } });
    expect((await down.send({ form: "priority", values: priority() })).outcome).toEqual({ status: "unavailable" });
    const unreachable = rig();
    unreachable.deps.portalFetch = async () => { throw new Error("ECONNREFUSED"); };
    expect((await unreachable.send({ form: "priority", values: priority() })).outcome).toEqual({ status: "unavailable" });
    const hang = createMockPortal({ secret: MOCK_SECRET, nowSeconds: () => NOW, hangFor: 2 });
    expect(await callPortal({ url: "https://x.invalid", appId: "a", secret: MOCK_SECRET, body: {}, fetch: hang.fetch, sleep: async () => {}, timeoutMs: 20 })).toMatchObject({ status: 0, attempts: 2 });
    const wrong = rig({ config: { portal: { url: "https://x.invalid", appId: "mock-app", secret: "a-different-secret-that-is-long-enough-000" } } });
    expect((await wrong.send({ form: "priority", values: priority() })).outcome).toEqual({ status: "unavailable" });
    const late = rig({ now: () => NOW - 600 });
    expect((await late.send({ form: "priority", values: priority() })).outcome).toEqual({ status: "unavailable" });
  });

  it("reports a closed portal form as closed, not saved", async () => {
    const r = rig({ portal: { secret: MOCK_SECRET, open: {}, nowSeconds: () => NOW } });
    expect((await r.send({ form: "priority", values: priority() })).outcome).toEqual({ status: "closed" });
  });

  it("filters the honeypot and instant submissions without calling the portal", async () => {
    const r = rig();
    expect((await r.send({ form: "priority", values: priority(), website: "https://spam.example" })).outcome).toEqual({ status: "received" });
    expect((await r.send({ form: "priority", values: priority(), elapsed_ms: 200 })).outcome).toEqual({ status: "received" });
    expect(r.portal.calls).toHaveLength(0);
  });

  it(`rate-limits each visitor to ${RATE_LIMIT.max} per ${RATE_LIMIT.windowSeconds / 60} minutes across instances, and fails closed without a store`, async () => {
    const shared = memoryStore();
    const a = rig({ store: shared });
    const b = rig({ store: shared });
    for (let i = 0; i < RATE_LIMIT.max; i++) expect((await (i % 2 ? b : a).send({ form: "enquiry", values: enquiry })).outcome.status).not.toBe("rate_limited");
    expect((await b.send({ form: "enquiry", values: enquiry })).outcome).toEqual({ status: "rate_limited" });
    expect((await a.send({ form: "enquiry", values: enquiry }, { ip: "198.51.100.9" })).outcome.status).not.toBe("rate_limited");
    const none = rig({ store: null });
    expect((await none.send({ form: "priority", values: priority() })).outcome).toEqual({ status: "unavailable" });
    const broken = rig({ store: { hit: async () => { throw new Error("down"); }, claim: async () => { throw new Error("down"); } } });
    expect((await broken.send({ form: "priority", values: priority() })).outcome).toEqual({ status: "unavailable" });
  });

  it("refuses cross-origin posts, oversized bodies and other content types", async () => {
    const r = rig();
    expect((await r.send({ form: "priority", values: priority() }, { origin: "https://evil.example" })).httpStatus).toBe(403);
    expect((await r.send({ form: "priority", values: priority() }, { origin: "null" })).httpStatus).toBe(403);
    expect((await r.send({ form: "enquiry", values: { ...enquiry, message: "m".repeat(20_500) } })).httpStatus).toBe(413);
    expect((await r.send({ form: "priority", values: priority() }, { contentType: "text/plain" })).httpStatus).toBe(415);
  });

  it("logs only form, outcome, status and request id", async () => {
    const r = rig();
    await r.send({ form: "priority", values: priority({ phone: "+234 800 000 0000", marketing_opt_in: true }) });
    await r.send({ form: "sponsor", values: sponsor });
    const all = r.lines.join("\n");
    for (const s of ["Synthetic Person", "person@synthetic.test", "+234 800", "Testland", "Synthetic Brand", "@synthetic", "203.0.113.7", MOCK_SECRET]) expect(all).not.toContain(s);
    expect(all).not.toMatch(/[0-9a-f]{64}/);
    for (const l of r.lines) expect(Object.keys(JSON.parse(l.replace("[hebs2027-forms] ", ""))).every((k) => ["form", "outcome", "portalStatus", "clientRequestId"].includes(k))).toBe(true);
  });
});

/* ── Exhibitor company profile (PDF) ────────────────────────────────── */

describe("exhibitor company profile (v1.1 section 6)", () => {
  it("is disabled for real uploads until malware checking is approved, and not accepted by this contract release", () => {
    expect(UPLOADS_ENABLED).toBe(false);
    expect(PROFILE_ACCEPTED).toBe(false);
    expect(submitConfig({ HEBS_FORMS_MODE: "mock", HEBS_FORMS_MOCK_UPLOADS: "yes" }).uploads).toBe(false);
    expect(submitConfig({ HEBS_FORMS_MODE: "mock", HEBS_FORMS_MOCK_UPLOADS: "yes", VERCEL_ENV: "preview" }).uploads).toBe(false);
    expect(FORM_FIELDS.exhibitor.find((f) => f.kind === "file")?.inactive).toBeTruthy();
  });

  it("refuses any file while uploads are off, and multipart altogether", async () => {
    const r = rig();
    expect((await r.send({ form: "exhibitor", values: exhibitor }, { contentType: "multipart/form-data; boundary=x", file: pdfFile() })).httpStatus).toBe(415);
    expect((await r.send({ form: "exhibitor", values: exhibitor }, { file: pdfFile() })).outcome).toMatchObject({ status: "invalid", errors: { company_profile: expect.any(String) } });
    expect((await r.send({ form: "exhibitor", values: { ...exhibitor, company_profile: "JVBERi0=" } })).outcome).toMatchObject({ errors: { company_profile: expect.any(String) } });
    expect(r.portal.calls).toHaveLength(0);
  });

  it("checks name, type, size and PDF signature, and computes the hash and base64 on the server", () => {
    const ok = preparePdf(pdfFile());
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.profile).toEqual({
        file_name: "Synthetic Profile.pdf", content_type: "application/pdf", size_bytes: PDF.length,
        sha256: createHash("sha256").update(PDF).digest("hex"), data_base64: Buffer.from(PDF).toString("base64"),
      });
    }
    expect(preparePdf(pdfFile({ name: "profile.exe" })).ok).toBe(false);
    expect(preparePdf(pdfFile({ name: `${"n".repeat(117)}.pdf` })).ok).toBe(false);
    expect(preparePdf(pdfFile({ type: "image/png" })).ok).toBe(false);
    expect(preparePdf(pdfFile({ bytes: new Uint8Array(Buffer.from("MZ not a pdf")) })).ok).toBe(false);
    expect(preparePdf(pdfFile({ bytes: new Uint8Array(0) })).ok).toBe(false);
    const big = new Uint8Array(PDF_MAX_BYTES + 1); big.set(PDF);
    expect(preparePdf(pdfFile({ bytes: big })).ok).toBe(false);
    const named = preparePdf(pdfFile({ name: "C:\\fakepath\\../Profile.pdf" }));
    expect(named.ok && named.profile.file_name).toBe("Profile.pdf");
  });

  it("never sends a profile, even if the website's upload switch were forced on", async () => {
    const r = rig({ config: { uploads: true } });
    const res = await r.send({ form: "exhibitor", values: exhibitor }, { contentType: "multipart/form-data; boundary=x", file: pdfFile() });
    expect(res.outcome).toMatchObject({ status: "invalid" });
    expect(() => toPortalBody("exhibitor", validateForm("exhibitor", exhibitor).values, uuid(), MOCK_NOTICES, (preparePdf(pdfFile()) as unknown as { profile: never }).profile)).toThrow(/not accepted/);
    expect(r.portal.calls).toHaveLength(0);
  });

  it("the mock portal answers upload_disabled to any company_profile, and 413 above 20,000 bytes", async () => {
    const portal = createMockPortal({ secret: MOCK_SECRET, nowSeconds: () => NOW, open: { exhibitor: true, enquiry: true } });
    const base = toPortalBody("exhibitor", validateForm("exhibitor", exhibitor).values, uuid(), MOCK_NOTICES);
    const withFile = { ...base, data: { ...base.data, company_profile: { file_name: "a.pdf", content_type: "application/pdf", size_bytes: 1, sha256: "0".repeat(64), data_base64: "JQ==" } } };
    const a = signedRequest(MOCK_SECRET, "a", withFile, NOW);
    const ra = await portal.handle(a.raw, new Headers(a.headers));
    expect([ra.status, await ra.json()]).toEqual([400, { error: "upload_disabled", field: "company_profile" }]);
    const big = toPortalBody("enquiry", validateForm("enquiry", enquiry).values, uuid(), MOCK_NOTICES);
    const b = signedRequest(MOCK_SECRET, "a", { ...big, data: { ...big.data, subject: "s".repeat(20_001) } }, NOW);
    const rb = await portal.handle(b.raw, new Headers(b.headers));
    expect([rb.status, await rb.json()]).toEqual([413, { error: "too_large" }]);
  });

  it("renders no upload control while uploads are off (corrected v1.1 section 6)", () => {
    const src = readFileSync(join(ROOT, "components/2027/editorial/HebsForm.tsx"), "utf8");
    expect(src).toContain('fields.filter((f) => f.kind !== "file" || uploads)');
  });
});

/* ── Production isolation ───────────────────────────────────────────── */

describe("production isolation and the unpublished route", () => {
  it("gives the route enough time for two 10 s calls and the longest inline busy wait", () => {
    expect(route.maxDuration).toBeGreaterThanOrEqual(2 * 10 + MAX_INLINE_BUSY_WAIT_S);
  });

  it("answers 404 for GET and every unsupported method", async () => {
    for (const m of ["GET", "HEAD", "PUT", "PATCH", "DELETE", "OPTIONS"] as const) {
      const res = await (route[m] as () => Response)();
      expect(res.status, m).toBe(404);
    }
  });

  it("answers 404 to POST while forms are off, in every environment", async () => {
    const post = new Request("https://staging.example.test/api/hebs2027/submit", {
      method: "POST", headers: { "content-type": "application/json", origin: "https://staging.example.test" }, body: JSON.stringify({ form: "priority" }),
    });
    expect((await route.POST(post)).status).toBe(404);
    for (const environment of ["development", "preview", "production"] as const) {
      const r = rig({ config: { mode: "off", portal: undefined, environment } });
      expect((await r.send({ form: "priority", values: priority() })).httpStatus, environment).toBe(404);
      expect(r.portal.calls).toHaveLength(0);
    }
  });

  it("refuses mock mode on every Vercel deployment and keeps forms off by default", () => {
    expect(submitConfig({ HEBS_FORMS_MODE: "mock" }).mode).toBe("mock");
    expect(submitConfig({ HEBS_FORMS_MODE: "mock", VERCEL_ENV: "preview" }).mode).toBe("off");
    expect(submitConfig({ HEBS_FORMS_MODE: "mock", VERCEL_ENV: "production" }).mode).toBe("off");
    expect(submitConfig({}).mode).toBe("off");
    expect(submitConfig({ VERCEL_ENV: "preview" }).store).toBeNull();
    for (const form of ["priority", "sponsor", "exhibitor", "enquiry"] as const) expect(formEnabled(form, submitConfig({ VERCEL_ENV: "preview" }))).toBe(false);
  });

  it("talks to the shared store in one transaction each: SET NX EX then INCR, and SET NX EX then GET (tests/forms-store-2027.test.ts)", async () => {
    const seen: unknown[] = [];
    const s = restStore({ url: "https://kv.test", token: "t" }, async (u, init) => {
      const cmds = JSON.parse(String(init.body));
      seen.push([new URL(u).pathname, cmds]);
      return new Response(JSON.stringify(cmds[1][0] === "INCR" ? [{ result: null }, { result: 3 }] : [{ result: "OK" }, { result: "id-1" }]));
    });
    expect(await s.hit("k", 600)).toBe(3);
    expect(await s.claim("c", "id-1", 3600)).toBe("id-1");
    expect(seen).toEqual([
      ["/multi-exec", [["SET", "k", "0", "EX", 600, "NX"], ["INCR", "k"]]],
      ["/multi-exec", [["SET", "c", "id-1", "NX", "EX", 3600], ["GET", "c"]]],
    ]);
    await expect(restStore({ url: "https://kv.test", token: "t" }, async () => new Response("no", { status: 500 })).hit("k", 600)).rejects.toThrow();
  });
});

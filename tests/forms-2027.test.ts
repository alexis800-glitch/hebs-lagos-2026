/**
 * HEBS 2027 website forms: validation, signing, the submission handler and the
 * mock portal. Synthetic data only; no network, no real portal, no live secret.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FORM_FIELDS, INTEREST_OPTIONS } from "../lib/integrations/registration-2027";
import { validateForm } from "../lib/forms-2027/validate";
import { signBody, signedRequest } from "../lib/forms-2027/sign";
import { createMockPortal } from "../lib/forms-2027/mock-portal";
import { handleSubmit, RATE_LIMIT, type SubmitDeps, type SubmitRequest } from "../lib/forms-2027/handler";
import { MOCK_SECRET, submitConfig, type SubmitConfig } from "../lib/forms-2027/config";
import { memoryStore, restStore, type SharedStore } from "../lib/forms-2027/store";
import { classify, CONTRACT, CONTRACT_GAPS, toPortalBody } from "../lib/forms-2027/contract";
import { callPortal } from "../lib/forms-2027/portal-client";

const ROOT = join(__dirname, "..");
const VECTORS = JSON.parse(readFileSync(join(ROOT, "docs/integration/hebs-2027-contract-v1.0-rev1/hebs-2027-form-test-vectors.json"), "utf8"));
const NOW = 1793750400;

const priority = (over: Record<string, unknown> = {}) => ({
  full_name: "Synthetic Person", email: "person@synthetic.test", country: "Testland", interest: "Attendee",
  privacy_acknowledged: true, ...over,
});
const sponsor = { company_name: "Synthetic Brand", contact_name: "Synthetic Contact", email: "brand@synthetic.test", country: "Testland", partnership_interest: "Sponsorship", privacy_acknowledged: true, prospectus_requested: true };
const exhibitor = { company_name: "Synthetic Tools", contact_name: "Synthetic Contact", email: "tools@synthetic.test", country: "Testland", products: "Synthetic combs", privacy_acknowledged: true };
const enquiry = { full_name: "Synthetic Person", email: "ask@synthetic.test", topic: "General question", message: "A synthetic question.", privacy_acknowledged: true };

let uuidN = 0;
const uuid = () => `00000000-0000-4000-8000-${String(++uuidN).padStart(12, "0")}`;

function mockConfig(over: Partial<SubmitConfig> = {}): SubmitConfig {
  return {
    environment: "development", mode: "mock", store: { kind: "memory" }, ipSalt: "test-salt",
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
  return { portal, deps, lines, sleeps, send };
}

describe("form fields (owner instruction 2026-11-04)", () => {
  it("offers the six directive interests on the priority list", () => {
    expect([...INTEREST_OPTIONS]).toEqual(["Attendee", "Competitor", "Educator", "Exhibitor", "Sponsor", "Other"]);
  });
  it("has an optional prospectus request on the sponsorship inquiry", () => {
    const f = FORM_FIELDS.sponsor.find((x) => x.name === "prospectus_requested");
    expect(f?.kind).toBe("checkbox");
    expect(f?.required).toBe(false);
  });
  it("shows the company-profile upload but keeps it inactive", () => {
    const f = FORM_FIELDS.exhibitor.find((x) => x.kind === "file");
    expect(f?.required).toBe(false);
    expect(f?.inactive).toBeTruthy();
  });
});

describe("validation (shared by browser and server)", () => {
  it("accepts a complete priority registration and drops unticked marketing to false", () => {
    const v = validateForm("priority", priority());
    expect(v.ok).toBe(true);
    expect(v.values.marketing_opt_in).toBe(false);
  });
  it("requires every required field", () => {
    const v = validateForm("priority", {});
    expect(v.ok).toBe(false);
    expect(Object.keys(v.errors).sort()).toEqual(["country", "email", "full_name", "interest", "privacy_acknowledged"]);
  });
  it("requires the privacy acknowledgement but never the marketing consent", () => {
    expect(validateForm("priority", priority({ privacy_acknowledged: false })).errors.privacy_acknowledged).toBeTruthy();
    expect(validateForm("priority", priority({ marketing_opt_in: true })).values.marketing_opt_in).toBe(true);
    for (const form of ["sponsor", "exhibitor"] as const) {
      const base = form === "sponsor" ? sponsor : exhibitor;
      expect(validateForm(form, base).ok).toBe(true);
    }
  });
  it("rejects bad emails, phone numbers, web addresses, options and over-long values", () => {
    expect(validateForm("priority", priority({ email: "not-an-email" })).errors.email).toBeTruthy();
    expect(validateForm("priority", priority({ phone: "call me" })).errors.phone).toBeTruthy();
    expect(validateForm("priority", priority({ interest: "Media" })).errors.interest).toBeTruthy();
    expect(validateForm("priority", priority({ full_name: "x".repeat(201) })).errors.full_name).toBeTruthy();
    expect(validateForm("exhibitor", { ...exhibitor, company_website: "javascript:alert(1)" }).errors.company_website).toBeTruthy();
    expect(validateForm("enquiry", { ...enquiry, message: "m".repeat(2001) }).errors.message).toBeTruthy();
  });
  it("rejects unknown fields and any value for the inactive upload", () => {
    expect(validateForm("priority", priority({ is_test: true })).errors.is_test).toBeTruthy();
    expect(validateForm("exhibitor", { ...exhibitor, company_profile: "data:application/pdf;base64,AAAA" }).errors.company_profile).toBeTruthy();
  });
});

describe("signing and the official v1.0 test vectors", () => {
  const secret = VECTORS.secret as string;
  it("reproduces the signature of every correctly signed vector", () => {
    for (const x of VECTORS.vectors) {
      const ours = signBody(secret, x.timestamp, x.raw_body);
      if (/wrong secret|body changed/.test(x.name)) expect(ours, x.name).not.toBe(x.signature);
      else expect(ours, x.name).toBe(x.signature);
    }
  });
  it("matches the contract's worked example", () => {
    const raw = '{"form":"priority","edition":"2027","client_request_id":"6f1c2a9e-4b7d-4c3e-9a1f-2d8e5b7c0a14","website":"","data":{"full_name":"Synthetic Person","email":"person@synthetic.test"}}';
    expect(signBody("synthetic-secret-synthetic-secret-0123456789", 1793750400, raw)).toBe("bd3f37d33d4fa04120ae35e8cd4a7bf53e551371d96d7827fcd7a044c138a890");
  });
  it("signs the exact string it sends", () => {
    const r = signedRequest("s".repeat(32), "app", { b: 1, a: [2] }, NOW);
    expect(r.raw).toBe('{"b":1,"a":[2]}');
    expect(r.headers["X-HEBS-Signature"]).toBe(signBody("s".repeat(32), NOW, r.raw));
    expect(r.headers).not.toHaveProperty("Authorization");
  });
  it("gets the expected answer from the mock portal for all eleven vectors", async () => {
    for (const x of VECTORS.vectors) {
      const portal = createMockPortal({ secret, nowSeconds: () => NOW, open: { priority: !/form closed/.test(x.name), sponsor: true, exhibitor: true, enquiry: true } });
      const headers = new Headers({ "x-hebs-timestamp": String(x.timestamp), "x-hebs-signature": x.signature });
      const first = await portal.handle(x.raw_body, headers);
      if ("expected_status_first" in x) {
        expect(first.status, x.name).toBe(x.expected_status_first);
        const a = await first.json();
        const second = await portal.handle(x.raw_body, headers);
        expect(second.status, x.name).toBe(x.expected_status_second);
        expect(await second.json()).toEqual({ reference: a.reference, duplicate: true });
      } else {
        expect(first.status, x.name).toBe(x.expected_status);
        const b = await first.json();
        if (x.expected_body) expect(b, x.name).toEqual(x.expected_body);
        if (x.expected_body_shape?.reference) expect(b.reference, x.name).toMatch(new RegExp(`^${x.expected_body_shape.reference.replace(/X+$/, "[2-9A-HJKMNP-Z]{6}")}$`));
      }
    }
  });
});

describe("submission handler with the mock portal", () => {
  it("confirms a valid registration only with a portal reference", async () => {
    const r = rig();
    const res = await r.send({ form: "priority", values: priority() });
    expect(res.httpStatus).toBe(201);
    expect(res.outcome).toMatchObject({ status: "confirmed", reference: expect.stringMatching(/^H27-PRI-[2-9A-HJKMNP-Z]{6}$/) });
  });
  it("submits all four forms", async () => {
    const r = rig();
    for (const [form, values] of [["priority", priority()], ["sponsor", sponsor], ["exhibitor", exhibitor], ["enquiry", enquiry]] as const) {
      const res = await r.send({ form, values });
      expect(res.outcome.status, form).toBe("confirmed");
    }
  });
  it("sends marketing consent only when ticked", async () => {
    const yes = toPortalBody("priority", validateForm("priority", priority({ marketing_opt_in: true })).values, uuid());
    const no = toPortalBody("priority", validateForm("priority", priority()).values, uuid());
    expect(yes.data.consent_marketing).toBe(true);
    expect(no.data).not.toHaveProperty("consent_marketing");
  });
  it("returns field errors and calls nothing for invalid input", async () => {
    const r = rig();
    const res = await r.send({ form: "priority", values: priority({ email: "bad" }) });
    expect(res.httpStatus).toBe(400);
    expect(res.outcome).toMatchObject({ status: "invalid", errors: { email: expect.any(String) } });
    expect(r.portal.calls).toHaveLength(0);
  });
  it("treats a double submission of one attempt as one registration", async () => {
    const r = rig();
    const attempt_id = uuid();
    const a = await r.send({ form: "sponsor", values: sponsor, attempt_id });
    const b = await r.send({ form: "sponsor", values: sponsor, attempt_id });
    expect(a.outcome).toMatchObject({ status: "confirmed" });
    expect(b.outcome).toEqual(a.outcome);
    expect(r.portal.stored()).toBe(1);
  });
  it("says 'already registered' for a second priority registration with the same email", async () => {
    const r = rig();
    await r.send({ form: "priority", values: priority() });
    const again = await r.send({ form: "priority", values: priority({ full_name: "Someone Else" }) });
    expect(again.outcome).toEqual({ status: "already_registered" });
  });
  it("retries once with the same request id when the portal is briefly down", async () => {
    const r = rig({ portal: { secret: MOCK_SECRET, open: { priority: true }, nowSeconds: () => NOW, downFor: 1 } });
    const res = await r.send({ form: "priority", values: priority() });
    expect(res.outcome.status).toBe("confirmed");
    expect(r.portal.calls.map((c) => c.status)).toEqual([503, 201]);
    expect(r.sleeps).toEqual([2000]);
  });
  it("never confirms when the portal stays down or does not answer", async () => {
    const down = rig({ portal: { secret: MOCK_SECRET, open: { priority: true }, nowSeconds: () => NOW, downFor: 2 } });
    expect((await down.send({ form: "priority", values: priority() })).outcome).toEqual({ status: "unavailable" });
    const unreachable = rig();
    unreachable.deps.portalFetch = async () => { throw new Error("ECONNREFUSED"); };
    const res = await unreachable.send({ form: "priority", values: priority() });
    expect(res).toEqual({ httpStatus: 503, outcome: { status: "unavailable" } });
  });
  it("times out a hanging portal after the contract's 10 seconds", async () => {
    const portal = createMockPortal({ secret: MOCK_SECRET, open: { priority: true }, nowSeconds: () => NOW, hangFor: 2 });
    const res = await callPortal({ url: "https://mock.portal.invalid/x", appId: "a", secret: MOCK_SECRET, body: { a: 1 }, fetch: portal.fetch, nowSeconds: () => NOW, sleep: async () => {}, timeoutMs: 20 });
    expect(res).toMatchObject({ status: 0, attempts: 2 });
  });
  it("does not confirm when the signature is wrong or expired", async () => {
    const wrong = rig({ config: { portal: { url: "https://mock.portal.invalid/x", appId: "mock-app", secret: "a-different-secret-that-is-long-enough-000" } } });
    expect((await wrong.send({ form: "priority", values: priority() })).outcome).toEqual({ status: "unavailable" });
    expect(wrong.portal.calls.map((c) => c.status)).toEqual([401]);
    const late = rig({ now: () => NOW - 600 });
    expect((await late.send({ form: "priority", values: priority() })).outcome).toEqual({ status: "unavailable" });
  });
  it("reports a closed portal form as closed, not as saved", async () => {
    const r = rig({ portal: { secret: MOCK_SECRET, open: {}, nowSeconds: () => NOW } });
    expect((await r.send({ form: "priority", values: priority() })).outcome).toEqual({ status: "closed" });
  });
  it("filters the honeypot and instant submissions without calling the portal", async () => {
    const r = rig();
    expect((await r.send({ form: "priority", values: priority(), website: "https://spam.example" })).outcome).toEqual({ status: "received" });
    expect((await r.send({ form: "priority", values: priority(), elapsed_ms: 200 })).outcome).toEqual({ status: "received" });
    expect(r.portal.calls).toHaveLength(0);
  });
  it(`rate-limits each visitor to ${RATE_LIMIT.max} attempts per ${RATE_LIMIT.windowSeconds / 60} minutes, across instances`, async () => {
    const shared = memoryStore();
    const a = rig({ store: shared });
    const b = rig({ store: shared }); // a second "instance" sharing the store
    for (let i = 0; i < RATE_LIMIT.max; i++) {
      const res = await (i % 2 ? b : a).send({ form: "enquiry", values: enquiry });
      expect(res.outcome.status).not.toBe("rate_limited");
    }
    expect((await b.send({ form: "enquiry", values: enquiry })).outcome).toEqual({ status: "rate_limited" });
    expect((await a.send({ form: "enquiry", values: enquiry }, { ip: "198.51.100.9" })).outcome.status).not.toBe("rate_limited");
  });
  it("fails closed without a shared store, or when the store errors", async () => {
    const none = rig({ store: null });
    expect((await none.send({ form: "priority", values: priority() })).outcome).toEqual({ status: "unavailable" });
    const broken = rig({ store: { hit: async () => { throw new Error("down"); }, claim: async () => { throw new Error("down"); } } });
    expect((await broken.send({ form: "priority", values: priority() })).outcome).toEqual({ status: "unavailable" });
    expect(none.portal.calls.length + broken.portal.calls.length).toBe(0);
  });
  it("accepts JSON only: no multipart, so no file can be uploaded; at most 20 KB", async () => {
    const r = rig();
    expect((await r.send({ form: "exhibitor", values: exhibitor }, { contentType: "multipart/form-data; boundary=x" })).httpStatus).toBe(415);
    expect((await r.send({ form: "enquiry", values: { ...enquiry, message: "m".repeat(21_000) } })).httpStatus).toBe(413);
    const upload = await r.send({ form: "exhibitor", values: { ...exhibitor, company_profile: "JVBERi0xLjQK" } });
    expect(upload.outcome).toMatchObject({ status: "invalid", errors: { company_profile: expect.any(String) } });
    expect(r.portal.calls).toHaveLength(0);
  });
  it("refuses cross-origin posts and non-POST methods", async () => {
    const r = rig();
    expect((await r.send({ form: "priority", values: priority() }, { origin: "https://evil.example" })).httpStatus).toBe(403);
    expect((await r.send({ form: "priority", values: priority() }, { origin: "null" })).httpStatus).toBe(403);
    expect((await r.send({ form: "priority", values: priority() }, { method: "PUT" })).httpStatus).toBe(405);
  });
  it("keeps every form closed when submission is off, and hides the route in production", async () => {
    const off = rig({ config: { mode: "off", portal: undefined } });
    expect((await off.send({ form: "priority", values: priority() })).outcome).toEqual({ status: "closed" });
    const prod = rig({ config: { mode: "off", portal: undefined, environment: "production" } });
    expect((await prod.send({ form: "priority", values: priority() })).httpStatus).toBe(404);
    expect(off.portal.calls.length + prod.portal.calls.length).toBe(0);
  });
  it("logs only form, outcome, status and request id: no personal data, secret or signature", async () => {
    const r = rig();
    await r.send({ form: "priority", values: priority({ phone: "+234 800 000 0000", marketing_opt_in: true }) });
    await r.send({ form: "enquiry", values: enquiry });
    const all = r.lines.join("\n");
    for (const s of ["Synthetic Person", "person@synthetic.test", "+234 800", "Testland", "synthetic question", "203.0.113.7", MOCK_SECRET]) expect(all).not.toContain(s);
    expect(all).not.toMatch(/[0-9a-f]{64}/);
    for (const l of r.lines) expect(Object.keys(JSON.parse(l.replace("[hebs2027-forms] ", ""))).every((k) => ["form", "outcome", "portalStatus", "clientRequestId"].includes(k))).toBe(true);
  });
});

describe("provisional contract mapping (v1.0 revision 1, awaiting v1.1)", () => {
  it("is marked not final, which keeps real-portal mode off", () => {
    expect(CONTRACT.final).toBe(false);
    expect(submitConfig({ HEBS_FORMS_MODE: "portal", HEBS_PORTAL_FORM_URL: "https://p.test/x", HEBS_PORTAL_APP_ID: "a", HEBS_PORTAL_FORM_SECRET: "s".repeat(40), HEBS_RATE_LIMIT_REST_URL: "https://kv.test", HEBS_RATE_LIMIT_REST_TOKEN: "t", HEBS_RATE_LIMIT_SALT: "x" }).mode).toBe("off");
  });
  it("cannot yet send Educator, the directive interest v1.0 lacks", async () => {
    const r = rig();
    const res = await r.send({ form: "priority", values: priority({ interest: "Educator" }) });
    expect(res.outcome).toMatchObject({ status: "invalid" });
    expect(r.portal.calls).toHaveLength(0);
    expect(CONTRACT_GAPS.priority.join()).toMatch(/Educator/);
  });
  it("only treats a well-formed reference as confirmation", () => {
    expect(classify(201, { reference: "H27-PRI-ABC234" })).toEqual({ status: "confirmed", reference: "H27-PRI-ABC234" });
    expect(classify(201, {})).toEqual({ status: "unavailable" });
    expect(classify(201, { reference: "<script>" })).toEqual({ status: "unavailable" });
    expect(classify(200, { reference: "H27-PRI-ABC234" })).toEqual({ status: "unavailable" });
    expect(classify(418, { reference: "H27-PRI-ABC234" })).toEqual({ status: "unavailable" });
  });
});

describe("configuration", () => {
  it("refuses mock mode on every Vercel deployment", () => {
    expect(submitConfig({ HEBS_FORMS_MODE: "mock" }).mode).toBe("mock");
    expect(submitConfig({ HEBS_FORMS_MODE: "mock", VERCEL_ENV: "preview" }).mode).toBe("off");
    expect(submitConfig({ HEBS_FORMS_MODE: "mock", VERCEL_ENV: "production" }).mode).toBe("off");
  });
  it("is off by default, and never uses per-instance memory as a deployed rate limiter", () => {
    expect(submitConfig({}).mode).toBe("off");
    expect(submitConfig({ VERCEL_ENV: "preview" }).store).toBeNull();
    expect(submitConfig({ VERCEL_ENV: "preview" }).ipSalt).toBeNull();
  });
  it("talks to the shared store with one pipelined INCR/EXPIRE and SET NX", async () => {
    const seen: unknown[] = [];
    const s = restStore({ url: "https://kv.test", token: "t" }, async (_u, init) => {
      const cmds = JSON.parse(String(init.body));
      seen.push(cmds);
      return new Response(JSON.stringify(cmds[0][0] === "INCR" ? [{ result: 3 }, { result: 1 }] : [{ result: "OK" }, { result: "id-1" }]));
    });
    expect(await s.hit("k", 600)).toBe(3);
    expect(await s.claim("c", "id-1", 3600)).toBe("id-1");
    expect(seen).toEqual([[["INCR", "k"], ["EXPIRE", "k", 600, "NX"]], [["SET", "c", "id-1", "NX", "EX", 3600], ["GET", "c"]]]);
    const failing = restStore({ url: "https://kv.test", token: "t" }, async () => new Response("no", { status: 500 }));
    await expect(failing.hit("k", 600)).rejects.toThrow();
  });
});

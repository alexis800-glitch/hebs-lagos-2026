/**
 * The private end-to-end test switch (Gate C run sheet rev 2, P4, P5, P8):
 * it works only on a Vercel Preview of the test branch, against the private
 * Base44 copy only, with synthetic data only; production and the normal
 * protected staging baseline are unaffected. Synthetic values throughout; no
 * network: the private copy is played by the mock portal.
 */
import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PRIVATE_TEST, PUBLISHED_SECRETS, privateTestBuildErrors } from "../lib/forms-2027/private-test.mjs";
import { SYNTHETIC_EMAIL, TEST_NOTICES, formEnabled, submitConfig, type SubmitConfig } from "../lib/forms-2027/config";
import { CONTRACT, NOTICE_VERSIONS } from "../lib/forms-2027/contract";
import { handleSubmit, type SubmitDeps, type SubmitRequest } from "../lib/forms-2027/handler";
import { createMockPortal } from "../lib/forms-2027/mock-portal";
import { probeBody } from "../lib/forms-2027/reachability";
import { attemptFor, type AttemptStore } from "../lib/forms-2027/attempt";
import { createHash } from "node:crypto";
import { memoryStore } from "../lib/forms-2027/store";
import { FORMS_OPEN, FORM_FIELDS, type FormId } from "../lib/integrations/registration-2027";
import HebsForm from "../components/2027/editorial/HebsForm";

const ROOT = join(__dirname, "..");
const NOW = 1793750400;
const FORMS: FormId[] = ["priority", "sponsor", "exhibitor", "enquiry"];
/** A made-up staging secret for these tests only; the real one is typed in by Lex (P2) and never seen here. */
const TEST_SECRET = "synthetic-private-test-secret-for-unit-tests-only-000";
const SALT = "synthetic-salt-0123456789";
/** A made-up E0 operator token for these tests only; the real one is typed in by Lex and sent by the operator. */
const PROBE_TOKEN = "synthetic-operator-probe-token-for-unit-tests-0001";

/** The Preview settings the private test needs (run sheet P2, P3), with synthetic values. */
const PREVIEW_TEST_ENV = {
  VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: PRIVATE_TEST.branch, HEBS_FORMS_MODE: "private-test",
  HEBS_PORTAL_FORM_URL: PRIVATE_TEST.url, HEBS_PORTAL_APP_ID: PRIVATE_TEST.appId, HEBS_PORTAL_FORM_SECRET: TEST_SECRET,
  HEBS_RATE_LIMIT_REST_URL: "https://kv.synthetic.test", HEBS_RATE_LIMIT_REST_TOKEN: "synthetic-token", HEBS_RATE_LIMIT_SALT: SALT,
} as const;
/** The normal protected staging baseline (5055340): no form settings at all. */
const STAGING_ENV = { VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "website/2027-pages-batch-1" } as const;

const values: Record<FormId, Record<string, unknown>> = {
  priority: { full_name: "TEST Synthetic Person", email: "person@synthetic.test", country: "Testland", interest: "Attendee", privacy_acknowledged: true },
  sponsor: {
    company_name: "TEST Synthetic Brand", contact_name: "TEST Contact", email: "brand@synthetic.test", country: "Testland",
    partnership_interest: "Sponsorship", privacy_acknowledged: true,
  },
  exhibitor: { company_name: "TEST Synthetic Tools", contact_name: "TEST Contact", email: "tools@synthetic.example", country: "Testland", products: "Synthetic combs", privacy_acknowledged: true },
  enquiry: { full_name: "TEST Synthetic Person", email: "ask@synthetic.test", topic: "General question", message: "A synthetic question.", privacy_acknowledged: true },
};

let n = 0;
const uuid = () => `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`;

function testRig(config: SubmitConfig, open: Partial<Record<FormId, boolean>> = { priority: true, sponsor: true, exhibitor: true, enquiry: true }) {
  const portal = createMockPortal({ secret: TEST_SECRET, open, nowSeconds: () => NOW });
  const seen: { url: string; headers: Record<string, string>; body: string }[] = [];
  const lines: string[] = [];
  const memory = memoryStore();
  const storeWrites: string[] = [];
  const store = {
    hit: (k: string, w: number) => { storeWrites.push(k); return memory.hit(k, w); },
    claim: (k: string, v: string, t: number) => { storeWrites.push(k); return memory.claim(k, v, t); },
  };
  const deps: SubmitDeps = {
    config, store, nowSeconds: () => NOW, sleep: async () => {}, log: (l) => lines.push(l),
    portalFetch: async (url, init) => {
      seen.push({ url, headers: init.headers as Record<string, string>, body: String(init.body) });
      return portal.fetch(url, init);
    },
  };
  let ip = 0;
  const send = (body: Record<string, unknown>, req: Partial<SubmitRequest> = {}) =>
    handleSubmit({
      method: "POST", contentType: "application/json", origin: "https://preview.synthetic.test", host: "preview.synthetic.test", ip: `203.0.113.${++ip}`,
      body: JSON.stringify({ elapsed_ms: 5000, website: "", attempt_id: uuid(), ...body }), ...req,
    }, deps);
  return { portal, seen, lines, send, storeWrites };
}

const testConfig = (over: Record<string, string | undefined> = {}) => submitConfig({ ...PREVIEW_TEST_ENV, ...over });

/* ── P4: the build fails anywhere but the test branch's Preview ─────── */

describe("build guard (run sheet P4)", () => {
  it("fails a production build with the test switch on", () => {
    expect(privateTestBuildErrors({ ...PREVIEW_TEST_ENV, VERCEL_ENV: "production" })).not.toEqual([]);
    expect(privateTestBuildErrors({ VERCEL_ENV: "production", HEBS_FORMS_MODE: "private-test" })).not.toEqual([]);
  });

  it("fails the test switch on a local build and on any other branch's Preview, including the normal staging branch", () => {
    expect(privateTestBuildErrors({ HEBS_FORMS_MODE: "private-test" })).not.toEqual([]);
    expect(privateTestBuildErrors({ ...PREVIEW_TEST_ENV, VERCEL_GIT_COMMIT_REF: "website/2027-pages-batch-1" })).not.toEqual([]);
    expect(privateTestBuildErrors({ ...PREVIEW_TEST_ENV, VERCEL_GIT_COMMIT_REF: "master" })).not.toEqual([]);
    expect(privateTestBuildErrors({ ...PREVIEW_TEST_ENV, VERCEL_GIT_COMMIT_REF: undefined })).not.toEqual([]);
  });

  it("fails a production build pointing at the private copy, carrying the test notice, or with the probe set", () => {
    expect(privateTestBuildErrors({ VERCEL_ENV: "production", HEBS_PORTAL_APP_ID: PRIVATE_TEST.appId })).not.toEqual([]);
    expect(privateTestBuildErrors({ VERCEL_ENV: "production", HEBS_PORTAL_FORM_URL: PRIVATE_TEST.url })).not.toEqual([]);
    expect(privateTestBuildErrors({ VERCEL_ENV: "production", ANY_SETTING: PRIVATE_TEST.noticeVersion })).not.toEqual([]);
    expect(privateTestBuildErrors({ VERCEL_ENV: "production", HEBS_PRIVATE_TEST_PROBE_TOKEN: PROBE_TOKEN })).not.toEqual([]);
    expect(privateTestBuildErrors({ ...STAGING_ENV, HEBS_PRIVATE_TEST_PROBE_TOKEN: PROBE_TOKEN })).not.toEqual([]);
  });

  it("passes the test branch's Preview, the normal staging baseline and an ordinary production build", () => {
    expect(privateTestBuildErrors({ ...PREVIEW_TEST_ENV, HEBS_PRIVATE_TEST_PROBE_TOKEN: PROBE_TOKEN })).toEqual([]);
    expect(privateTestBuildErrors(STAGING_ENV)).toEqual([]);
    expect(privateTestBuildErrors({ VERCEL_ENV: "production" })).toEqual([]);
    expect(privateTestBuildErrors({})).toEqual([]);
  });

  it("is wired into next.config.mjs, so loading the config for such a build throws", () => {
    const load = (env: Record<string, string>) =>
      execFileSync(process.execPath, ["--input-type=module", "-e", "await import('./next.config.mjs')"], {
        cwd: ROOT, env: { PATH: process.env.PATH ?? "", ...env } as unknown as NodeJS.ProcessEnv, stdio: "pipe",
      });
    expect(() => load({ VERCEL_ENV: "production", HEBS_FORMS_MODE: "private-test" })).toThrow(/private-test guard/);
    expect(() => load({ VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "website/2027-pages-batch-1", HEBS_FORMS_MODE: "private-test" })).toThrow(/private-test guard/);
    expect(() => load({ VERCEL_ENV: "production" })).not.toThrow();
    expect(() => load({ ...STAGING_ENV })).not.toThrow();
  });
});

/* ── Run-time switch: the same rules again, failing closed ──────────── */

describe("private-test configuration", () => {
  it("opens only on the test branch's Preview with every setting, against the private copy, with the test notice and no uploads", () => {
    const cfg = testConfig();
    expect(cfg.mode).toBe("private-test");
    expect(cfg.portal).toEqual({ url: PRIVATE_TEST.url, appId: PRIVATE_TEST.appId, secret: TEST_SECRET });
    expect(cfg.notices).toEqual({ privacy: "TEST-ONLY-NOT-D13", consent: "TEST-ONLY-NOT-D13" });
    expect(cfg.uploads).toBe(false);
    expect(cfg.probeToken).toBeUndefined();
    expect(testConfig({ HEBS_PRIVATE_TEST_PROBE_TOKEN: PROBE_TOKEN }).probeToken).toBe(PROBE_TOKEN);
    // A short token, the signing secret itself or a published value never authorises the probe.
    for (const t of ["short-token", TEST_SECRET, ...PUBLISHED_SECRETS]) expect(testConfig({ HEBS_PRIVATE_TEST_PROBE_TOKEN: t }).probeToken).toBeUndefined();
    // Nothing else in the configuration carries the token.
    expect(submitConfig({ ...STAGING_ENV, HEBS_PRIVATE_TEST_PROBE_TOKEN: PROBE_TOKEN }).probeToken).toBeUndefined();
    expect(CONTRACT.final).toBe(false);
  });

  it("stays off for each missing or wrong setting", () => {
    const off: Record<string, string | undefined>[] = [
      { VERCEL_ENV: "production" }, { VERCEL_ENV: undefined }, { VERCEL_GIT_COMMIT_REF: "website/2027-pages-batch-1" }, { VERCEL_GIT_COMMIT_REF: undefined },
      { HEBS_PORTAL_FORM_URL: undefined }, { HEBS_PORTAL_FORM_URL: "https://base44.app/api/apps/other/functions/evSubmitPublicForm" },
      { HEBS_PORTAL_FORM_URL: `https://base44.app/api/apps/${PRIVATE_TEST.liveAppId}/functions/evSubmitPublicForm` },
      { HEBS_PORTAL_APP_ID: PRIVATE_TEST.liveAppId }, { HEBS_PORTAL_APP_ID: undefined },
      { HEBS_PORTAL_FORM_SECRET: undefined }, { HEBS_PORTAL_FORM_SECRET: "short" },
      ...PUBLISHED_SECRETS.map((s) => ({ HEBS_PORTAL_FORM_SECRET: s })),
      { HEBS_RATE_LIMIT_REST_URL: undefined }, { HEBS_RATE_LIMIT_REST_TOKEN: undefined }, { HEBS_RATE_LIMIT_REST_URL: "http://kv.synthetic.test" },
      { HEBS_RATE_LIMIT_SALT: undefined }, { HEBS_RATE_LIMIT_SALT: "short-salt" },
    ];
    for (const o of off) {
      const cfg = testConfig(o);
      expect(cfg.mode, JSON.stringify(o)).toBe("off");
      for (const form of FORMS) expect(formEnabled(form, cfg)).toBe(false);
    }
  });

  it("keeps the test notice out of the real notice versions", () => {
    expect(NOTICE_VERSIONS).toEqual({ privacy: null, consent: null });
    expect(TEST_NOTICES.privacy).toBe(PRIVATE_TEST.noticeVersion);
  });
});

/* ── Production and the normal staging baseline are unaffected ──────── */

describe("production and the normal staging baseline", () => {
  it("keep every form closed and the route off, even with every test setting present", () => {
    const envs = [
      STAGING_ENV, { VERCEL_ENV: "production" },
      { ...PREVIEW_TEST_ENV, VERCEL_GIT_COMMIT_REF: "website/2027-pages-batch-1" },
      { ...PREVIEW_TEST_ENV, VERCEL_ENV: "production" },
      { ...PREVIEW_TEST_ENV, VERCEL_ENV: "production", HEBS_FORMS_PRODUCTION_APPROVED: "yes" },
      { ...PREVIEW_TEST_ENV, HEBS_FORMS_MODE: "portal" },
      { ...PREVIEW_TEST_ENV, HEBS_FORMS_MODE: "portal", VERCEL_ENV: "production", HEBS_FORMS_PRODUCTION_APPROVED: "yes" },
    ];
    for (const env of envs) {
      const cfg = submitConfig(env);
      expect(cfg.mode, JSON.stringify(env)).toBe("off");
      expect(cfg.notices.privacy).toBeNull();
      for (const form of FORMS) expect(formEnabled(form, cfg)).toBe(false);
    }
    expect(Object.values(FORMS_OPEN).every((v) => v === false)).toBe(true);
  });

  it("answer 404 to a probe and to every form while off", async () => {
    for (const env of [STAGING_ENV, { VERCEL_ENV: "production" }]) {
      const r = testRig(submitConfig(env));
      expect((await r.send({ probe: "reachability" })).httpStatus).toBe(404);
      for (const form of FORMS) expect((await r.send({ form, values: values[form] })).httpStatus).toBe(404);
      expect(r.seen).toHaveLength(0);
    }
  });

  it("never send the test notice outside the private test", async () => {
    // A configuration handed the test notice by mistake, in any other mode, refuses before calling anyone.
    for (const mode of ["mock", "portal"] as const) {
      const r = testRig({ ...testConfig(), mode });
      for (const form of FORMS) {
        const marketing = FORM_FIELDS[form].some((f) => f.name === "marketing_opt_in") ? { marketing_opt_in: true } : {};
        const res = await r.send({ form, values: { ...values[form], ...marketing } });
        // Portal mode is stopped earlier still: its forms are closed (FORMS_OPEN).
        expect(res.outcome.status, `${mode} ${form}`).toBe(mode === "mock" ? "invalid" : "closed");
      }
      expect(r.seen, mode).toHaveLength(0);
      if (mode === "mock") expect(r.lines.every((l) => l.includes("contract_gap")), r.lines.join("\n")).toBe(true);
    }
  });
});

/* ── The four forms against the private copy (played by the mock) ───── */

describe("forms in the private test", () => {
  it("send all four forms to the copy with the test notice and confirm with its reference (E2, E4, E5, E6)", async () => {
    const r = testRig(testConfig());
    for (const form of FORMS) {
      const res = await r.send({ form, values: values[form] });
      expect(res.outcome.status, form).toBe("confirmed");
    }
    expect(r.seen.map((c) => c.url)).toEqual(FORMS.map(() => PRIVATE_TEST.url));
    for (const c of r.seen) {
      expect(c.headers["X-App-Id"]).toBe(PRIVATE_TEST.appId);
      expect(JSON.parse(c.body).data.privacy_notice_version).toBe("TEST-ONLY-NOT-D13");
      expect(c.body).not.toContain("company_profile");
    }
  });

  it("refuse an address that could reach a real person, before anything is sent", async () => {
    const r = testRig(testConfig());
    for (const email of ["someone@gmail.com", "owner@hebslagos.com", "x@test.com", "x@example.co", "x@synthetic.testing"]) {
      const res = await r.send({ form: "priority", values: { ...values.priority, email } });
      expect(res.outcome, email).toEqual({ status: "invalid", errors: { email: expect.stringContaining(".test") } });
    }
    expect(r.seen).toHaveLength(0);
    for (const ok of ["a@synthetic.test", "a@b.example", "a@example.com", "a@mail.example.org"]) expect(SYNTHETIC_EMAIL.test(ok), ok).toBe(true);
  });

  it("shows a form closed by the copy's admin as closed, not saved (E9)", async () => {
    const r = testRig(testConfig(), {});
    for (const form of FORMS) expect((await r.send({ form, values: values[form] })).outcome).toEqual({ status: "closed" });
  });

  it("keep one record and one reference for a double click and a resend (E7)", async () => {
    const r = testRig(testConfig());
    const attempt_id = uuid();
    const a = await r.send({ form: "enquiry", values: values.enquiry, attempt_id });
    const b = await r.send({ form: "enquiry", values: values.enquiry, attempt_id }, { ip: "203.0.113.1" });
    expect(a.outcome).toEqual(b.outcome);
    const ids = r.seen.map((c) => JSON.parse(c.body).client_request_id);
    expect(new Set(ids).size).toBe(1);
  });

  it("reuse the attempt id when the same details are resent after a refresh, and only then (E7)", async () => {
    const tab = new Map<string, string>();
    const store: AttemptStore = { get: (k) => tab.get(k) ?? null, set: (k, v) => void tab.set(k, v) };
    const deps = { store, digest: async (x: string) => createHash("sha256").update(x).digest("hex"), newSalt: () => "synthetic-salt" };
    const first = await attemptFor("enquiry", values.enquiry as never, uuid(), deps);
    // A refresh: the page starts with a new in-memory attempt id; the tab storage remains.
    expect(await attemptFor("enquiry", { ...values.enquiry } as never, uuid(), deps)).toBe(first);
    const other = uuid();
    expect(await attemptFor("enquiry", { ...values.enquiry, message: "Another synthetic question." } as never, other, deps)).toBe(other);
    // The tab keeps a salted hash and the id only, never the details.
    const kept = Array.from(tab.values()).join(" ");
    for (const v of ["ask@synthetic.test", "TEST Synthetic Person", "synthetic question"]) expect(kept).not.toContain(v);
    // Without storage the in-page id is used, and nothing breaks.
    const broken: AttemptStore = { get: () => { throw new Error("blocked"); }, set: () => { throw new Error("blocked"); } };
    const own = uuid();
    expect(await attemptFor("enquiry", values.enquiry as never, own, { ...deps, store: broken })).toBe(own);
    expect(await attemptFor("enquiry", values.enquiry as never, own, { ...deps, store: null })).toBe(own);
    // The same attempt id after a refresh gives the copy the same client_request_id: one record, the same reference.
    const r = testRig(testConfig());
    const a = await r.send({ form: "enquiry", values: values.enquiry, attempt_id: first });
    const b = await r.send({ form: "enquiry", values: values.enquiry, attempt_id: first });
    expect(a.outcome).toMatchObject({ status: "confirmed" });
    expect(b.outcome).toEqual(a.outcome);
  });

  it("keep their rate-limit and request-id keys in their own store namespace", async () => {
    const r = testRig(testConfig());
    await r.send({ form: "priority", values: values.priority });
    expect(r.storeWrites.length).toBeGreaterThan(0);
    for (const k of r.storeWrites) expect(k.startsWith("hebs27-e2e:"), k).toBe(true);
  });

  it("never upload, pay or email: no upload in the configuration and no email or payment code on the form path", () => {
    expect(testConfig().uploads).toBe(false);
    const dir = join(ROOT, "lib/forms-2027");
    const sources = [...readdirSync(dir).map((f) => join(dir, f)), join(ROOT, "app/api/hebs2027/submit/route.ts")];
    const banned = /from\s+["'](resend|stripe|nodemailer|@sendgrid\/[^"']*|paystack[^"']*|flutterwave[^"']*)["']|api\.(resend|stripe|paystack|sendgrid)\.com/i;
    for (const f of sources) expect(readFileSync(f, "utf8"), f).not.toMatch(banned);
  });
});

/* ── E0 / P8: reachability, with no separate self-check endpoint ────── */

describe("reachability probe (run sheet E0)", () => {
  const probeCfg = () => testConfig({ HEBS_PRIVATE_TEST_PROBE_TOKEN: PROBE_TOKEN });

  it("answers 404, calls nobody and writes nothing without the operator token, a wrong one, or outside the test", async () => {
    const cases: [SubmitConfig, string | null][] = [
      [probeCfg(), null], [probeCfg(), ""], [probeCfg(), "wrong-token-wrong-token-wrong-token-00"], [probeCfg(), PROBE_TOKEN + "x"], [probeCfg(), TEST_SECRET],
      [testConfig(), PROBE_TOKEN],
      [submitConfig({ ...STAGING_ENV, HEBS_PRIVATE_TEST_PROBE_TOKEN: PROBE_TOKEN }), PROBE_TOKEN],
      [submitConfig({ VERCEL_ENV: "production", HEBS_PRIVATE_TEST_PROBE_TOKEN: PROBE_TOKEN }), PROBE_TOKEN],
    ];
    for (const [cfg, probeToken] of cases) {
      const r = testRig(cfg);
      expect((await r.send({ probe: "reachability" }, { probeToken })).httpStatus, `${cfg.mode} ${probeToken}`).toBe(404);
      expect(r.seen).toHaveLength(0);
      expect(r.storeWrites).toHaveLength(0);
    }
  });

  it("with the token, sends one unsigned and one signed request that cannot store anything, writes nothing, and reports only status and error code", async () => {
    const r = testRig(probeCfg(), {});
    const res = await r.send({ probe: "reachability" }, { probeToken: PROBE_TOKEN });
    expect(res).toEqual({ httpStatus: 200, outcome: { status: "probe", results: [
      { request: "unsigned", status: 401, error: "unauthorized" },
      { request: "signed", status: 403, error: "not_open" },
    ] } });
    expect(r.storeWrites).toHaveLength(0);
    expect(r.seen).toHaveLength(2);
    expect(r.seen[0].headers["X-HEBS-Signature"]).toBeUndefined();
    expect(r.seen[1].headers["X-HEBS-Signature"]).toMatch(/^[0-9a-f]{64}$/);
    for (const c of r.seen) {
      expect(JSON.parse(c.body).data).toEqual({});
      expect(JSON.stringify(c.headers)).not.toContain(PROBE_TOKEN);
    }
    for (const out of [JSON.stringify(res), r.lines.join("\n")]) {
      expect(out).not.toContain(TEST_SECRET);
      expect(out).not.toContain(PROBE_TOKEN);
    }
    // Even with a form open, the empty signed body is refused, never stored.
    const open = testRig(probeCfg());
    const o = await open.send({ probe: "reachability" }, { probeToken: PROBE_TOKEN });
    expect(o.outcome).toMatchObject({ results: [{ status: 401 }, { status: 400, error: "missing_field" }] });
    expect(probeBody("x").data).toEqual({});
  });

  it("refuses a cross-origin probe, even with the token", async () => {
    const r = testRig(probeCfg());
    expect((await r.send({ probe: "reachability" }, { origin: "https://elsewhere.synthetic.test", probeToken: PROBE_TOKEN })).httpStatus).toBe(403);
    expect(r.seen).toHaveLength(0);
  });

  it("reads the token from the X-HEBS-Probe-Token header on the server only", () => {
    const route = readFileSync(join(ROOT, "app/api/hebs2027/submit/route.ts"), "utf8");
    expect(route).toContain('probeToken: req.headers.get("x-hebs-probe-token")');
    for (const f of ["components/2027/editorial/HebsForm.tsx", "components/2027/editorial/site.tsx"]) {
      const src = readFileSync(join(ROOT, f), "utf8");
      expect(src, f).not.toMatch(/probe/i);
    }
  });
});

/* ── P5: the visible test-only label ────────────────────────────────── */

describe("test-only notice banner (run sheet P5)", () => {
  const render = (testNotice?: { title: string; detail: string; version: string }) =>
    renderToStaticMarkup(createElement(HebsForm, {
      form: "exhibitor", fields: FORM_FIELDS.exhibitor, enabled: true, gate: "Opens soon", submitLabel: "Send", title: "Exhibitor application", testNotice,
    }));

  it("labels the form in the private test, with no upload control", () => {
    const html = render({ title: PRIVATE_TEST.banner, detail: PRIVATE_TEST.bannerDetail, version: PRIVATE_TEST.noticeVersion });
    expect(html).toContain("TEST ONLY – not the approved HEBS privacy notice");
    expect(html).toContain("TEST-ONLY-NOT-D13");
    expect(html).not.toContain('type="file"');
  });

  it("is absent everywhere else, and its text lives on the server only", () => {
    expect(render()).not.toContain("TEST");
    const client = readFileSync(join(ROOT, "components/2027/editorial/HebsForm.tsx"), "utf8");
    expect(client).not.toContain("TEST-ONLY-NOT-D13");
    expect(client).not.toContain("private-test.mjs");
  });
});

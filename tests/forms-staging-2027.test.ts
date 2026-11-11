/**
 * Staging integration mode (lib/forms-2027/config.ts, mode "staging"): the
 * website submits to the private Base44 TEST copy, from protected previews and
 * local development only. Never production, never the live portal, never 2026.
 */
import { describe, expect, it } from "vitest";
import { STAGING_NOTICES, formEnabled, formsUnderTest, stagingEndpointRefusal, submitConfig, type SubmitConfig } from "../lib/forms-2027/config";
import { createMockPortal } from "../lib/forms-2027/mock-portal";
import { handleSubmit } from "../lib/forms-2027/handler";
import { memoryStore } from "../lib/forms-2027/store";

// A synthetic test-copy endpoint in the contract's form (section 2). Not a real host.
const APP = "synthtestcopy0001";
const URL_OK = `https://staging-portal.example.test/api/apps/${APP}/functions/evSubmitPublicForm`;
const SECRET = "staging-synthetic-secret-for-tests-only-0123456789";
const base = {
  HEBS_FORMS_MODE: "staging", HEBS_STAGING_PORTAL_FORM_URL: URL_OK, HEBS_STAGING_PORTAL_APP_ID: APP,
  HEBS_STAGING_PORTAL_FORM_SECRET: SECRET, HEBS_STAGING_ALLOW_MEMORY_STORE: "yes",
};

describe("staging mode configuration", () => {
  it("runs on a protected preview and locally, with test notice versions and no uploads", () => {
    for (const env of [{ ...base, VERCEL_ENV: "preview" }, { ...base }]) {
      const c = submitConfig(env);
      expect(c.mode, JSON.stringify(env)).toBe("staging");
      expect(c.notices).toEqual(STAGING_NOTICES);
      expect(c.uploads).toBe(false);
      expect(c.portal?.url).toBe(URL_OK);
      expect(formsUnderTest(c)).toBe(true);
    }
  });

  it("is refused on production and on the client design-review preview", () => {
    expect(submitConfig({ ...base, VERCEL_ENV: "production" }).mode).toBe("off");
    expect(submitConfig({ ...base, VERCEL_ENV: "preview", HEBS_CLIENT_PREVIEW: "on" }).mode).toBe("off");
  });

  it("never reaches the live portal, and only the contract's endpoint form", () => {
    expect(stagingEndpointRefusal(URL_OK, APP)).toBeNull();
    expect(stagingEndpointRefusal(`https://hebseventportal.com/api/apps/${APP}/functions/evSubmitPublicForm`, APP)).toMatch(/live portal host/);
    expect(stagingEndpointRefusal(`https://www.hebseventportal.com/api/apps/${APP}/functions/evSubmitPublicForm`, APP)).toMatch(/live portal host/);
    expect(stagingEndpointRefusal(URL_OK.replace("https:", "http:"), APP)).toMatch(/https/);
    expect(stagingEndpointRefusal(URL_OK, "otherapp")).toMatch(/does not match/);
    expect(stagingEndpointRefusal(URL_OK.replace("evSubmitPublicForm", "evAdmin"), APP)).toMatch(/does not match/);
    expect(stagingEndpointRefusal(undefined, APP)).toMatch(/missing/);
  });

  it("needs a real-length secret and a shared store, unless memory is asked for", () => {
    expect(submitConfig({ ...base, HEBS_STAGING_PORTAL_FORM_SECRET: "short" }).mode).toBe("off");
    const { HEBS_STAGING_ALLOW_MEMORY_STORE: _m, ...noMemory } = base;
    void _m;
    expect(submitConfig({ ...noMemory, VERCEL_ENV: "preview" }).mode).toBe("off");
  });

  it("offers every form (the test copy decides), and caps a raised rate limit", () => {
    const c = submitConfig({ ...base, HEBS_STAGING_RATE_LIMIT_MAX: "500" });
    for (const f of ["priority", "sponsor", "exhibitor", "enquiry"] as const) expect(formEnabled(f, c)).toBe(true);
    expect(c.rateLimitMax).toBe(100);
  });
});

describe("a staging submission end to end, against a contract-faithful portal", () => {
  async function run(over: Partial<SubmitConfig> = {}, open = { priority: true, sponsor: true, exhibitor: true, enquiry: true }) {
    const config = { ...submitConfig(base), ...over };
    const portal = createMockPortal({ secret: SECRET, open });
    const seen: { url: string; body: Record<string, unknown> }[] = [];
    const fetch = async (url: string, init: RequestInit) => {
      seen.push({ url, body: JSON.parse(String(init.body)) });
      return portal.fetch(url, init);
    };
    const deps = { config, store: memoryStore(), portalFetch: fetch, sleep: async () => {}, log: () => {} };
    const attempt = "00000000-0000-4000-8000-000000000101";
    const send = (values: Record<string, unknown>, form = "priority", attemptId = attempt, website = "") => handleSubmit({
      method: "POST", contentType: "application/json", origin: "https://preview.example.test", host: "preview.example.test", ip: "203.0.113.9",
      body: JSON.stringify({ form, values, website, attempt_id: attemptId, elapsed_ms: 4000 }),
    }, deps);
    return { send, seen, portal };
  }
  const priority = { full_name: "Synthetic Person", email: "person@synthetic.test", country: "Nigeria", interest: "Attendee", privacy_acknowledged: true };

  it("sends edition 2027 to the configured test endpoint, with the test notice version", async () => {
    const { send, seen } = await run();
    const r = await send(priority);
    expect(r.httpStatus).toBe(201);
    expect(r.outcome).toMatchObject({ status: "confirmed" });
    expect((r.outcome as { reference: string }).reference).toMatch(/^H27-PRI-[A-HJKMNP-Z2-9]{6}$/);
    expect(seen).toHaveLength(1);
    expect(seen[0].url).toBe(URL_OK);
    expect(seen[0].body.edition).toBe("2027");
    expect((seen[0].body.data as Record<string, unknown>).privacy_notice_version).toBe("staging-2027-00");
  });

  it("returns the same reference for a resend, never a second record", async () => {
    const { send, portal } = await run();
    const a = await send(priority);
    const b = await send(priority);
    expect((b.outcome as { reference: string }).reference).toBe((a.outcome as { reference: string }).reference);
    expect(portal.stored()).toBe(1);
  });

  it("shows a closed form when the test copy has not opened it", async () => {
    const { send } = await run({}, { priority: false, sponsor: true, exhibitor: true, enquiry: true });
    expect((await send(priority)).outcome).toMatchObject({ status: "closed" });
  });
});

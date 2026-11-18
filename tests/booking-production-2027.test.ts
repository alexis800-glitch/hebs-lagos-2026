/**
 * Production booking links (public launch): the same contract as staging
 * (tickets, compete?category=<CODE>, booking) with no test dataset, closed until
 * the 2027 production portal is accepted and approved in a reviewed commit.
 */
import { describe, expect, it } from "vitest";
import { PRIVATE_TEST } from "../lib/forms-2027/private-test.mjs";
import {
  bookingLink, COMPETITION_CODES, COMPETITION_CODE_PARAM, PRODUCTION_PORTAL, PRODUCTION_PORTAL_HOSTS,
  productionOriginRefusal, STAGING_DATA_ENV, type ProductionPortal,
} from "../lib/integrations/booking-2027";

const ORIGIN = "https://portal.example.test";
const OPEN: ProductionPortal = {
  portal: { status: "approved", value: ORIGIN, source: "test" },
  hosts: ["portal.example.test"],
  ticketSales: { prices: true, payment: true },
};
const PROD = { VERCEL_ENV: "production" };
const LAUNCH_PR = { VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "website/2027-launch" };
const contract = { codes: COMPETITION_CODES, param: COMPETITION_CODE_PARAM };
const link = (j: "tickets" | "compete" | "booking", slug: string | undefined, env: Record<string, string>, p = OPEN) => bookingLink(j, slug, env, contract, p);

describe("as shipped", () => {
  it("is closed: no approved production portal and no listed host", () => {
    expect(PRODUCTION_PORTAL.status).not.toBe("approved");
    expect(PRODUCTION_PORTAL_HOSTS).toHaveLength(0);
    for (const j of ["tickets", "booking"] as const) expect(bookingLink(j, undefined, PROD)).toBeNull();
    for (const slug of Object.keys(COMPETITION_CODES)) expect(bookingLink("compete", slug, PROD)).toBeNull();
  });
});

describe("once approved", () => {
  it("links to the contract paths with the competition code, and never the test dataset", () => {
    for (const env of [PROD, LAUNCH_PR]) {
      for (const [slug, code] of Object.entries(COMPETITION_CODES)) {
        const u = new URL(link("compete", slug, env)!);
        expect(u.origin + u.pathname).toBe(`${ORIGIN}/2027/compete`);
        expect(u.searchParams.get("category")).toBe(code);
        expect(u.searchParams.has(STAGING_DATA_ENV.param)).toBe(false);
      }
      expect(link("tickets", undefined, env)).toBe(`${ORIGIN}/2027/tickets`);
      expect(link("booking", undefined, env)).toBe(`${ORIGIN}/2027/booking`);
    }
  });

  it("carries no dev dataset, sandbox checkout, preview token or credentials", () => {
    const all = [link("tickets", undefined, PROD), link("booking", undefined, PROD), ...Object.keys(COMPETITION_CODES).map((s) => link("compete", s, PROD))];
    for (const l of all) expect(l).not.toMatch(/base44_data_env|\/pay\b|_vercel_share|token|preview--|@/i);
  });

  it("sells tickets only when prices and the payment gateway are both approved", () => {
    for (const ticketSales of [{ prices: false, payment: false }, { prices: true, payment: false }, { prices: false, payment: true }]) {
      const p = { ...OPEN, ticketSales };
      expect(link("tickets", undefined, PROD, p)).toBeNull();
      expect(link("booking", undefined, PROD, p)).not.toBeNull();
    }
  });
});

describe("refusals", () => {
  const refused = (portal: string, hosts = [new URL(portal.startsWith("http") ? portal : "https://x").hostname]) =>
    productionOriginRefusal(PROD, { ...OPEN, portal: { status: "approved", value: portal, source: "test" }, hosts });

  it("refuses anything but an approved https origin on a listed host", () => {
    expect(productionOriginRefusal(PROD, { ...OPEN, portal: { status: "provisional", value: ORIGIN, source: "t" } as never })).not.toBeNull();
    expect(productionOriginRefusal(PROD, { ...OPEN, hosts: [] })).not.toBeNull();
    for (const bad of ["http://portal.example.test", "https://u:p@portal.example.test", `${ORIGIN}/2027`, `${ORIGIN}/?x=1`, `${ORIGIN}/#x`, "not a url"]) {
      expect(refused(bad), bad).not.toBeNull();
    }
  });

  it("never treats the test copy or a Base44 preview as production", () => {
    expect(refused("https://preview--hebs-lagos-event-portal-copy-f4788d9a.base44.app")).not.toBeNull();
    expect(refused(`https://x.example.test`, ["x.example.test"])).toBeNull();
    expect(PRIVATE_TEST.appId).toBeTruthy();
  });

  it("is not used in development, on the client design preview, or on the private test branch", () => {
    expect(link("booking", undefined, {})).toBeNull();
    expect(link("booking", undefined, { VERCEL_ENV: "development" })).toBeNull();
    expect(link("booking", undefined, { ...PROD, HEBS_CLIENT_PREVIEW: "on" })).toBeNull();
    expect(link("booking", undefined, { VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: PRIVATE_TEST.branch })).toBeNull();
  });

  it("the private test branch keeps the staging copy and its test dataset, even with production approved", () => {
    const env = { VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: PRIVATE_TEST.branch, HEBS_STAGING_PORTAL_ORIGIN: "https://copy.example.test" };
    const u = new URL(link("tickets", undefined, env)!);
    expect(u.origin).toBe("https://copy.example.test");
    expect(u.searchParams.get(STAGING_DATA_ENV.param)).toBe(STAGING_DATA_ENV.value);
  });
});

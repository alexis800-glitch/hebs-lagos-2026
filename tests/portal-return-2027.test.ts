/**
 * The return link to the website (portal "Back to website", `site` parameter):
 * every staging booking link is marked for it, the value is only ever the
 * website's https origin, and anything else fails safe (link unchanged).
 */
import { afterEach, describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PRIVATE_TEST } from "../lib/forms-2027/private-test.mjs";
import { bookingLink, COMPETITION_CODES, STAGING_DATA_ENV, SITE_PARAM, siteOrigin, withSite } from "../lib/integrations/booking-2027";

const ORIGIN = "https://hebs-test-copy.example.test";
const STAGING = { VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: PRIVATE_TEST.branch, HEBS_STAGING_PORTAL_ORIGIN: ORIGIN };
const SITE = "https://hebs-lagos-2026-abc123xyz-veridion-systems-projects.vercel.app";
const KEYS = ["VERCEL_ENV", "VERCEL_GIT_COMMIT_REF", "HEBS_STAGING_PORTAL_ORIGIN"] as const;

describe("the website origin on portal links", () => {
  it("adds only the https origin, keeping the category code and test dataset", () => {
    for (const [slug, code] of Object.entries(COMPETITION_CODES)) {
      const u = new URL(withSite(bookingLink("compete", slug, STAGING)!, SITE));
      expect(u.searchParams.get("category"), slug).toBe(code);
      expect(u.searchParams.get(STAGING_DATA_ENV.param), slug).toBe(STAGING_DATA_ENV.value);
      expect(u.searchParams.get(SITE_PARAM), slug).toBe(SITE);
    }
    for (const j of ["tickets", "booking"] as const) {
      expect(new URL(withSite(bookingLink(j, undefined, STAGING)!, SITE)).searchParams.get(SITE_PARAM)).toBe(SITE);
    }
  });

  it("never sends a path, query, share token or credentials, only the origin", () => {
    expect(siteOrigin(`${SITE}/2027/tickets?_vercel_share=SECRET#x`)).toBe(SITE);
    const link = withSite(bookingLink("tickets", undefined, STAGING)!, `${SITE}/2027/tickets?_vercel_share=SECRET`);
    expect(link).not.toMatch(/SECRET|_vercel_share|%2F2027/);
    expect(siteOrigin("https://user:pw@example.test")).toBeNull();
  });

  it("fails safe: a missing or non-https origin leaves the link exactly as it was", () => {
    const base = bookingLink("tickets", undefined, STAGING)!;
    for (const bad of ["", "not a url", "http://example.test", "javascript:alert(1)", "data:text/html,x", "ftp://example.test"]) {
      expect(withSite(base, bad), bad).toBe(base);
    }
  });

  it("is set in the browser from window.location.origin, never from VERCEL_URL", () => {
    const client = readFileSync(join(__dirname, "../components/2027/site/portal-return.tsx"), "utf8");
    expect(client).toContain("window.location.origin");
    expect(client).not.toMatch(/VERCEL_URL|process\.env/);
    const helper = readFileSync(join(__dirname, "../lib/integrations/portal-site.ts"), "utf8");
    expect(helper).not.toMatch(/process\.env|HEBS_STAGING_PORTAL_ORIGIN/);
  });
});

describe("which links carry it", () => {
  const saved = { ...process.env };
  afterEach(() => { for (const k of KEYS) { if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; } });

  it("on the test branch Preview, all 15 portal links are marked (2 on Tickets, 13 on Competitions)", async () => {
    Object.assign(process.env, STAGING);
    const { TicketsPage, CompetitionsPage } = await import("../components/2027/editorial/inner");
    const tickets = renderToStaticMarkup(createElement(TicketsPage, { environment: "preview", notes: "inline" }));
    const comps = renderToStaticMarkup(createElement(CompetitionsPage, { environment: "preview", notes: "inline" }));
    const marked = (html: string) => Array.from(html.matchAll(/<a\b[^>]*data-portal=""[^>]*>/g), (m) => m[0]);
    expect(marked(tickets)).toHaveLength(2);
    expect(marked(comps)).toHaveLength(13);
    for (const a of [...marked(tickets), ...marked(comps)]) expect(a).toContain(ORIGIN);
  });

  it("without staging (production included) no link is marked and booking stays closed", async () => {
    delete process.env.HEBS_STAGING_PORTAL_ORIGIN;
    const { TicketsPage, CompetitionsPage } = await import("../components/2027/editorial/inner");
    for (const P of [TicketsPage, CompetitionsPage]) {
      expect(renderToStaticMarkup(createElement(P, { environment: "preview", notes: "inline" }))).not.toContain("data-portal");
    }
    process.env.VERCEL_ENV = "production";
    expect(bookingLink("tickets")).toBeNull();
  });
});

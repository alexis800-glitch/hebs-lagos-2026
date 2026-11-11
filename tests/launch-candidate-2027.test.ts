/**
 * The first launch candidate: the homepage and Tickets, rendered as production
 * would render them once that launch is authorised (lib/launch-2027-candidate.ts).
 * The launch switch itself stays closed; this file substitutes the candidate
 * configuration only inside the test.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("../lib/launch-2027-config", async () => {
  const { LAUNCH_CANDIDATE } = await import("../lib/launch-2027-candidate");
  return { LAUNCH_2027: { ...LAUNCH_CANDIDATE, authorisation: { by: "Test only", on: "2027-01-01", reference: "test" } } };
});
// The content approvals are not given yet; open the pages for rendering only.
vi.mock("../lib/launch-2027", async (orig) => ({ ...(await orig<object>()), site2027Open: () => true, pagePublished: () => true }));

const saved = process.env.VERCEL_ENV;
beforeAll(() => { process.env.VERCEL_ENV = "production"; });
afterAll(() => { if (saved === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = saved; });

async function pages() {
  const { PreferredHomepage } = await import("../components/2027/home/HomePage");
  const { TicketsPage } = await import("../components/2027/editorial/inner");
  const { SiteFooter } = await import("../components/2027/site/SiteFooter");
  return {
    home: renderToStaticMarkup(createElement(PreferredHomepage)) + renderToStaticMarkup(createElement(SiteFooter)),
    tickets: renderToStaticMarkup(createElement(TicketsPage, { environment: "production", notes: "inline" })) + renderToStaticMarkup(createElement(SiteFooter)),
  };
}

describe("launch candidate: homepage and Tickets", () => {
  it("is the homepage and Tickets only, with the launch switch still closed", async () => {
    const { LAUNCH_CANDIDATE } = await import("../lib/launch-2027-candidate");
    const real = await vi.importActual<typeof import("../lib/launch-2027-config")>("../lib/launch-2027-config");
    expect(LAUNCH_CANDIDATE.pages).toEqual(["home", "tickets"]);
    expect(real.LAUNCH_2027.authorisation).toBeNull();
    expect(real.LAUNCH_2027.pages).toEqual([]);
  });

  it("links only to published pages, the 2026 privacy notice and in-page anchors", async () => {
    for (const [name, html] of Object.entries(await pages())) {
      const hrefs = Array.from(html.matchAll(/<a\b[^>]*?href="([^"]*)"/g)).map((m) => m[1]);
      for (const h of hrefs) expect(h, `${name}: ${h}`).toMatch(/^(\/2027|\/2027\/tickets(#[\w-]+)?|\/privacy|#[\w-]+)$/);
      // No anchor without a destination: a launch that leaves a page out renders no button for it.
      expect(html, name).not.toMatch(/<a(?![^>]*href=)[^>]*>/);
    }
  });

  it("shows no staging, review or restricted material", async () => {
    const { REVIEW_ASSETS } = await import("../lib/assets/home-2027-review");
    for (const [name, html] of Object.entries(await pages())) {
      expect(html, name).not.toMatch(/data-staging|Internal preview|Staging note|Approval status|held for review|\/_review\//);
      for (const a of REVIEW_ASSETS.filter((x) => !x.published)) expect(html.includes(a.src), `${name}: ${a.id}`).toBe(false);
      const media = Array.from(html.matchAll(/(?:src|srcSet|poster)="([^"]+)"/gi)).flatMap((m) => m[1].split(",").map((s) => s.trim().split(" ")[0]));
      for (const m of media.filter((x) => x.startsWith("/"))) expect(m, `${name}: ${m}`).toMatch(/^\/(2027\/media\/|assets\/logos\/)/);
    }
  });

  it("keeps Tickets informational: no sales, prices or payment", async () => {
    const { tickets } = await pages();
    expect(tickets).toMatch(/not on sale/);
    expect(tickets).not.toMatch(/Buy tickets|Book now|Checkout|Add to cart|Pay now|₦|\$\d|NGN|USD/i);
    expect(tickets).not.toMatch(/Secure online payment|How registration will work/);
    expect(tickets).not.toMatch(/<form|<input/);
  });

  it("defers resort photography, the priority list, the QR code and partner inquiries only with the owner's authorisation", async () => {
    const { pageStatuses } = await vi.importActual<typeof import("../lib/launch-2027")>("../lib/launch-2027");
    const { LAUNCH_CANDIDATE } = await import("../lib/launch-2027-candidate");
    expect(LAUNCH_CANDIDATE.deferred).toEqual(["imagery", "priority-form", "qr", "partner-inquiry"]);
    const pending = (authorised: boolean) => pageStatuses("home", {
      ...LAUNCH_CANDIDATE, authorisation: authorised ? { by: "Test only", on: "2027-01-01", reference: "test" } : null,
    }).filter((x) => x !== "approved").length;
    expect(pending(false) - pending(true)).toBe(4);
  });
});

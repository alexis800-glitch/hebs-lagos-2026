/**
 * 2027 email addresses: enquiries@ and sponsors@hebslagos.com (tested 23 Nov 2026),
 * never info@thehebs.com, and none shown until it is approved and its mail flow tested.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CONTACTS_2027, MAIL_FLOW, publicContact } from "@/lib/site/contacts-2027";
import { ContactPage, ExhibitorsPage, SponsorshipPage } from "@/components/2027/editorial/inner";
import { SiteFooter } from "@/components/2027/site/SiteFooter";

const ROOT = join(__dirname, "..");
const files = (dir: string): string[] => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? files(p) : /\.(tsx?|mjs|json)$/.test(f) ? [p] : [];
});

describe("2027 contacts", () => {
  it("are the two official, tested hebslagos.com addresses; exhibitors@ and tickets@ are not configured", () => {
    expect(CONTACTS_2027.enquiries.address).toMatchObject({ status: "approved", value: "enquiries@hebslagos.com" });
    expect(CONTACTS_2027.sponsors.address).toMatchObject({ status: "approved", value: "sponsors@hebslagos.com" });
    expect(CONTACTS_2027.exhibitors.address.status).not.toBe("approved");
    expect(CONTACTS_2027.tickets.address.status).not.toBe("approved");
    expect(CONTACTS_2027.enquiries.purpose).toBe("General enquiries, tickets and visitor support");
    expect(CONTACTS_2027.sponsors.purpose).toBe("Sponsorships, exhibitors and corporate partnerships");
  });

  it("never uses a thehebs.com address anywhere in the 2027 site", () => {
    const scope = [
      ...files(join(ROOT, "components/2027")), ...files(join(ROOT, "lib/site")), ...files(join(ROOT, "lib/content")),
      ...files(join(ROOT, "app/(edition)/2027")),
    ];
    for (const f of scope) expect(readFileSync(f, "utf8"), f).not.toMatch(/@thehebs\.com/i);
  });

  it("publishes enquiries@ and sponsors@ (inbound and reply tested 23 Nov 2026), never exhibitors@ or tickets@", () => {
    expect(MAIL_FLOW.enquiries).toEqual({ inbound: "2026-11-23", reply: "2026-11-23" });
    expect(MAIL_FLOW.sponsors).toEqual({ inbound: "2026-11-23", reply: "2026-11-23" });
    expect(publicContact("enquiries")).toBe("enquiries@hebslagos.com");
    expect(publicContact("sponsors")).toBe("sponsors@hebslagos.com");
    expect(publicContact("exhibitors")).toBeNull();
    expect(publicContact("tickets")).toBeNull();
    for (const environment of ["production", "development"] as const) {
      const pages = {
        contact: renderToStaticMarkup(createElement(ContactPage, { environment })),
        sponsorship: renderToStaticMarkup(createElement(SponsorshipPage, { environment })),
        exhibitors: renderToStaticMarkup(createElement(ExhibitorsPage, { environment })),
      };
      expect(pages.contact).toContain('href="mailto:enquiries@hebslagos.com"');
      expect(pages.contact).toContain('href="mailto:sponsors@hebslagos.com"');
      expect(pages.sponsorship).toContain('href="mailto:sponsors@hebslagos.com"');
      expect(pages.exhibitors).toContain('href="mailto:sponsors@hebslagos.com"');
      for (const html of Object.values(pages)) {
        expect(html).not.toMatch(/(exhibitors|tickets)@hebslagos\.com/);
        // Every mailto on a 2027 page is one of the two tested addresses.
        for (const m of Array.from(html.matchAll(/mailto:([^"?]+)/g))) expect(["enquiries@hebslagos.com", "sponsors@hebslagos.com"]).toContain(m[1]);
      }
    }
  });

  it("lists both addresses, with their purposes, in the footer on production", () => {
    const prev = process.env.VERCEL_ENV;
    process.env.VERCEL_ENV = "production";
    try {
      const html = renderToStaticMarkup(createElement(SiteFooter));
      expect(html).toContain('href="mailto:enquiries@hebslagos.com"');
      expect(html).toContain('href="mailto:sponsors@hebslagos.com"');
      expect(html).toContain("General enquiries, tickets and visitor support");
      expect(html).not.toMatch(/(exhibitors|tickets)@hebslagos\.com|thehebs\.com/);
    } finally {
      if (prev === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = prev;
    }
  });

  it("keeps the gate: an address needs approval and both tests", () => {
    const none = { enquiries: { inbound: null, reply: null }, sponsors: { inbound: null, reply: null }, exhibitors: { inbound: null, reply: null }, tickets: { inbound: null, reply: null } };
    for (const id of ["enquiries", "sponsors", "exhibitors", "tickets"] as const) expect(publicContact(id, CONTACTS_2027, none)).toBeNull();
    const half = { ...none, enquiries: { inbound: "2026-11-23", reply: null } };
    expect(publicContact("enquiries", CONTACTS_2027, half)).toBeNull();
    const all = { enquiries: { inbound: "d", reply: "d" }, sponsors: { inbound: "d", reply: "d" }, exhibitors: { inbound: "d", reply: "d" }, tickets: { inbound: "d", reply: "d" } };
    expect(publicContact("tickets", CONTACTS_2027, all)).toBeNull(); // not approved: not a configured mailbox
    expect(publicContact("exhibitors", CONTACTS_2027, all)).toBeNull();
  });
});

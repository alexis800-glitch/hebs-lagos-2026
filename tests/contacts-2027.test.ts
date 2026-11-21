/**
 * 2027 email addresses: enquiries@ and tickets@hebslagos.com, never
 * info@thehebs.com, and none shown until it is approved and its mail flow tested.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CONTACTS_2027, MAIL_FLOW, publicContact } from "@/lib/site/contacts-2027";
import { ContactPage, SponsorshipPage } from "@/components/2027/editorial/inner";

const ROOT = join(__dirname, "..");
const files = (dir: string): string[] => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? files(p) : /\.(tsx?|mjs|json)$/.test(f) ? [p] : [];
});

describe("2027 contacts", () => {
  it("are the two official hebslagos.com addresses", () => {
    expect(CONTACTS_2027.enquiries.address).toMatchObject({ status: "approved", value: "enquiries@hebslagos.com" });
    expect(CONTACTS_2027.tickets.address).toMatchObject({ status: "approved", value: "tickets@hebslagos.com" });
  });

  it("never uses a thehebs.com address anywhere in the 2027 site", () => {
    const scope = [
      ...files(join(ROOT, "components/2027")), ...files(join(ROOT, "lib/site")), ...files(join(ROOT, "lib/content")),
      ...files(join(ROOT, "app/(edition)/2027")),
    ];
    for (const f of scope) expect(readFileSync(f, "utf8"), f).not.toMatch(/@thehebs\.com/i);
  });

  it("shows no address until it is approved and its inbound and reply tests have passed", () => {
    expect(MAIL_FLOW.enquiries).toEqual({ inbound: null, reply: null });
    expect(MAIL_FLOW.tickets).toEqual({ inbound: null, reply: null });
    expect(publicContact("enquiries")).toBeNull();
    expect(publicContact("tickets")).toBeNull();
    expect(publicContact("sponsors")).toBeNull();
    expect(publicContact("exhibitors")).toBeNull();
    for (const Page of [ContactPage, SponsorshipPage]) {
      const html = renderToStaticMarkup(createElement(Page, { environment: "development" }));
      expect(html).not.toMatch(/(enquiries|sponsors|exhibitors|tickets)@hebslagos\.com/);
    }
    const tested = { enquiries: { inbound: "2026-11-21", reply: null }, sponsors: { inbound: null, reply: null }, exhibitors: { inbound: null, reply: null }, tickets: { inbound: "2026-11-21", reply: "2026-11-21" } };
    expect(publicContact("enquiries", CONTACTS_2027, tested)).toBeNull();
    expect(publicContact("tickets", CONTACTS_2027, tested)).toBe("tickets@hebslagos.com");
    const unapproved = { ...CONTACTS_2027, tickets: { ...CONTACTS_2027.tickets, address: { status: "provisional" as const, value: "tickets@hebslagos.com", note: "t" } } };
    expect(publicContact("tickets", unapproved, tested)).toBeNull();
  });
});

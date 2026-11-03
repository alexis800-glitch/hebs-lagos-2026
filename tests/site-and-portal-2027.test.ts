import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { BASE, SITE_NAV, SITE_PAGES, pageHref } from "../lib/site/2027";
import {
  CONTACT_FIELDS, EXHIBITOR_APPLICATION_FIELDS, INTEREST_OPTIONS, PORTAL_2027, PORTAL_HOSTS, PRIORITY_LIST_FIELDS, SPONSOR_INQUIRY_FIELDS, portalLink,
  type PortalDestination,
} from "../lib/integrations/registration-2027";
import { EDITION_DAYS, PROGRAMME_2027 } from "../lib/editions/2027";
import { contentRegister, previewStatuses } from "../lib/content/2027";
import type { Gated } from "../lib/publication";

const ROOT = join(__dirname, "..");
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));

describe("2027 site map (directive section 5)", () => {
  it("lists the thirteen required pages in directive order", () => {
    expect(SITE_PAGES.map((p) => p.title)).toEqual([
      "Home", "About HEBS", "HEBS 2027 experience", "Event programme", "Education & masterclasses", "Competitions",
      "Speakers & educators", "Exhibitors", "Sponsorship & partnerships", "Tickets & registration", "Travel & accommodation",
      "Gallery & past events", "Contact us",
    ]);
  });

  it("marks a page built exactly when its route exists", () => {
    for (const p of SITE_PAGES) {
      const route = join(ROOT, "app", ...p.path.split("/").filter(Boolean), "page.tsx");
      expect(existsSync(route), `${p.id} at ${p.path}`).toBe(p.built);
    }
  });

  it("never links to a page that is not built", () => {
    for (const p of SITE_PAGES.filter((x) => !x.built)) expect(pageHref(p.id)).toBeNull();
    const unbuilt = SITE_PAGES.filter((x) => !x.built).map((x) => x.path);
    const files = [...walk(join(ROOT, "components/2027")), ...walk(join(ROOT, "app/2027"))].filter((f) => /\.tsx?$/.test(f));
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      for (const path of unbuilt) expect(src, f).not.toContain(`"${path}`);
    }
  });

  it("navigates only to built pages under the staging prefix", () => {
    expect(SITE_NAV.length).toBeGreaterThan(0);
    for (const n of SITE_NAV) expect(n.href.startsWith(`${BASE}/`)).toBe(true);
  });

  it("withholds every inner page's copy in production while it is provisional", () => {
    expect(contentRegister().some((c) => c.key.startsWith("pages."))).toBe(true);
    expect(previewStatuses()).toContain("provisional");
  });
});

describe("2027 event programme", () => {
  it("has a session list for each of the three days, empty until sessions are confirmed", () => {
    expect(Object.keys(PROGRAMME_2027).sort()).toEqual(EDITION_DAYS.map((d) => d.isoDate).sort());
    for (const s of Object.values(PROGRAMME_2027)) expect(s).toEqual([]);
  });
});

describe("Base44 2027 portal hand-off", () => {
  const approved = (url: string): Gated<string> => ({ status: "approved", value: url, source: "test" });
  const routes = (url: string) =>
    Object.fromEntries(Object.keys(PORTAL_2027).map((k) => [k, approved(url)])) as Record<PortalDestination, Gated<string>>;

  it("links nowhere today: no destination approved, no host allowlisted", () => {
    expect(PORTAL_HOSTS).toEqual([]);
    for (const d of Object.keys(PORTAL_2027) as PortalDestination[]) {
      expect(PORTAL_2027[d].status).toBe("awaiting-confirmation");
      for (const env of ["production", "preview", "development"] as const) expect(portalLink(d, env)).toBeNull();
    }
  });

  it("links only to an approved https address on an allowlisted host, without credentials", () => {
    const host = ["portal.example.test"];
    expect(portalLink("priority-list", "production", routes("https://portal.example.test/priority"), host)).toBe("https://portal.example.test/priority");
    expect(portalLink("priority-list", "production", routes("http://portal.example.test/priority"), host)).toBeNull();
    expect(portalLink("priority-list", "production", routes("https://other.example.test/priority"), host)).toBeNull();
    expect(portalLink("priority-list", "production", routes("https://u:p@portal.example.test/x"), host)).toBeNull();
    expect(portalLink("priority-list", "production", routes("not a url"), host)).toBeNull();
    expect(portalLink("priority-list", "production", routes("https://portal.example.test/x"), [])).toBeNull();
    const provisional = { ...routes("https://portal.example.test/x"), "priority-list": { status: "provisional", value: "https://portal.example.test/x", note: "t" } } as Record<PortalDestination, Gated<string>>;
    expect(portalLink("priority-list", "preview", provisional, host)).toBeNull();
  });

  it("asks the priority list for exactly the directive section 6 fields", () => {
    expect(PRIORITY_LIST_FIELDS.map((f) => f.name)).toEqual([
      "full_name", "email", "country", "phone", "interest", "privacy_acknowledged", "marketing_opt_in",
    ]);
    expect(PRIORITY_LIST_FIELDS.find((f) => f.name === "phone")?.required).toBe(false);
    expect([...INTEREST_OPTIONS]).toEqual(["Attendee", "Competitor", "Educator", "Exhibitor", "Sponsor", "Other"]);
  });

  it("covers the section 8 partner tasks: inquiry, prospectus request, exhibition application, company information", () => {
    expect(SPONSOR_INQUIRY_FIELDS.some((f) => f.name === "prospectus_requested")).toBe(true);
    expect(EXHIBITOR_APPLICATION_FIELDS.some((f) => f.kind === "file")).toBe(true);
    const names = (fs: readonly { name: string }[]) => new Set(fs.map((f) => f.name));
    expect(names(SPONSOR_INQUIRY_FIELDS).size).toBe(SPONSOR_INQUIRY_FIELDS.length);
    expect(names(EXHIBITOR_APPLICATION_FIELDS).size).toBe(EXHIBITOR_APPLICATION_FIELDS.length);
  });

  it("separates the required acknowledgement from optional marketing consent on every form", () => {
    for (const list of [PRIORITY_LIST_FIELDS, SPONSOR_INQUIRY_FIELDS, EXHIBITOR_APPLICATION_FIELDS, CONTACT_FIELDS]) {
      const ack = list.filter((f) => f.consent === "acknowledgement");
      expect(ack).toHaveLength(1);
      expect(ack[0].required).toBe(true);
      for (const m of list.filter((f) => f.consent === "marketing")) expect(m.required).toBe(false);
      expect(list.some((f) => f.consent === "acknowledgement" && /news|offers|unsubscribe/i.test(f.label))).toBe(false);
    }
  });

  it("never renders a prize amount while D8 is open", () => {
    const files = [...walk(join(ROOT, "components/2027")), ...walk(join(ROOT, "app/2027"))].filter((f) => /\.tsx?$/.test(f));
    for (const f of files) expect(readFileSync(f, "utf8"), f).not.toMatch(/prizeUsd|TOTAL_PRIZE|PRIZE_TOTAL|NGN_PER_USD/);
  });

  it("keeps every form preview disabled", () => {
    const site = readFileSync(join(ROOT, "components/2027/editorial/site.tsx"), "utf8");
    expect(site).toMatch(/<fieldset disabled/);
  });
});

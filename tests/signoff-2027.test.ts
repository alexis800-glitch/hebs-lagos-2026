/**
 * The content sign-off register (lib/content/signoff-2027.ts), its decision
 * record (lib/content/signoff-decisions-2027.ts) and the review page.
 */
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { blockStatus, contentRegister } from "../lib/content/2027";
import { HOME, homeCopyBlocks, homeCopyStatus } from "../lib/content/home-2027";
import { SIGNOFF_DECISIONS, wordingApproved, type SignoffDecision } from "../lib/content/signoff-decisions-2027";
import { firstLaunchDecisions, mediaRecords, signoffCounts, signoffItems } from "../lib/content/signoff-2027";
import { isWithheld } from "../middleware";
import type { LaunchConfig } from "../lib/launch-2027";
import { SITE_PAGES } from "../lib/site/2027";

const OPEN: LaunchConfig = {
  authorisation: { by: "Owner (test)", on: "2027-06-01", reference: "test" },
  pages: SITE_PAGES.map((p) => p.id),
  origin: { status: "approved", value: "https://www.hebslagos.com", source: "test" },
};

describe("sign-off register", () => {
  const items = signoffItems();

  it("lists every unapproved copy block on the 13 pages, once", () => {
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    const pending = contentRegister().filter((e) => e.status !== "approved" && !/^(education|qr)\./.test(e.key));
    for (const e of pending) expect(ids, e.key).toContain(e.key);
  });

  it("lists every homepage line except the directive's own headlines", () => {
    const listed = new Set(items.filter((i) => i.id.startsWith("home.")).map((i) => i.id));
    for (const b of homeCopyBlocks()) expect(listed.has(b.key), b.key).toBe(!b.directive);
    expect(homeCopyBlocks().filter((b) => b.directive).map((b) => b.key)).toEqual(
      expect.arrayContaining(["home.hero.lines.0", "home.hero.accent", "home.welcome.title", "home.final.cta", "home.sponsors.accent"]),
    );
  });

  it("gives every item a group, an approver, a page and a priority", () => {
    for (const i of items) {
      expect(["shared", "factual", "organiser", "commercial"]).toContain(i.group);
      expect(["Veridion", "Mrs. Shuler", "HEBS organisers"]).toContain(i.approver);
      expect(i.pages.length, i.id).toBeGreaterThan(0);
      expect([1, 2, 3]).toContain(i.tier);
    }
  });

  it("counts add up", () => {
    const c = signoffCounts(items);
    const sum = (r: Record<string, number>) => Object.values(r).reduce((a, b) => a + b, 0);
    expect(sum(c.byApprover)).toBe(c.open);
    expect(sum(c.byGroup)).toBe(c.open);
    expect(sum(c.byTier)).toBe(c.open);
  });

  it("puts the shared facts first, needed for the first launch", () => {
    const shared = items.filter((i) => i.group === "shared").map((i) => i.id);
    expect(shared).toEqual(expect.arrayContaining(["fact.venue-name", "fact.mark-2027"]));
    expect(items.filter((i) => i.group === "shared").every((i) => i.tier === 1)).toBe(true);
  });

  it("status notices can be approved now; what replaces them is listed separately", () => {
    const notices = items.filter((i) => i.kind === "Status notice" && !/NJS/.test(i.text));
    expect(notices.length).toBeGreaterThan(10);
    for (const n of notices) expect(n.dependsOn, n.id).toEqual([]);
    expect(items.find((i) => i.id === "pages.tickets.categories")?.replacedWhen.length).toBeGreaterThan(0);
  });

  it("names the decisions blocking the first launch, D9 and D3 first", () => {
    const d = firstLaunchDecisions(items).map((x) => x.decision);
    expect(d[0]).toMatch(/D9/);
    expect(d[1]).toMatch(/D3/);
    expect(d.join(" ")).toMatch(/House of Snapp written usage terms/);
    expect(d.join(" ")).toMatch(/Written launch authorisation/);
  });
});

describe("venue wording", () => {
  it("keeps the Atlantic location without placing HEBS on the beach", () => {
    const all = [...contentRegister().map((e) => e.text), ...homeCopyBlocks().map((b) => b.text)];
    for (const t of all) expect(t).not.toMatch(/beachfront|on the beach/i);
    expect(all.some((t) => /Atlantic coast/.test(t))).toBe(true);
  });
});

describe("decisions", () => {
  it("none is recorded on anyone's behalf yet", () => {
    expect(SIGNOFF_DECISIONS).toEqual([]);
  });

  it("an approval covers exactly the wording approved", () => {
    const block = { status: "provisional" as const, text: "Contact us" };
    const ok: SignoffDecision[] = [{ item: "pages.contact.title", decision: "approved", text: "Contact us", by: "Test", on: "2026-11-11", reference: "test" }];
    expect(blockStatus("pages.contact.title", block, ok)).toBe("approved");
    expect(blockStatus("pages.contact.title", { ...block, text: "Contact HEBS" }, ok)).toBe("provisional");
    expect(blockStatus("pages.travel.title", block, ok)).toBe("provisional");
    const later: SignoffDecision[] = [...ok, { item: "pages.contact.title", decision: "revision-required", by: "Test", on: "2026-11-12", reference: "test" }];
    expect(wordingApproved("pages.contact.title", "Contact us", later)).toBe(false);
  });

  it("the homepage copy is approved only when every listed line is", () => {
    expect(homeCopyStatus()).toBe("provisional");
    const all: SignoffDecision[] = homeCopyBlocks().filter((b) => !b.directive)
      .map((b) => ({ item: b.key, decision: "approved", text: b.text, by: "Test", on: "2026-11-11", reference: "test" }));
    expect(homeCopyStatus(all)).toBe("approved");
    expect(homeCopyStatus(all.slice(1))).toBe("provisional");
    expect(HOME.hero.kicker).toBe("HEBS Lagos 2027");
  });
});

describe("media records", () => {
  it("keeps the House of Snapp approval and the outstanding written terms distinct", () => {
    const hos = mediaRecords().find((m) => m.id === "house-of-snapp")!;
    expect(hos.state).toBe("Approved; written terms outstanding");
    expect(hos.settled).toMatch(/Approved by Mrs\. Shuler/);
    expect(hos.settled).toMatch(/payment alone is not a publishing licence/);
    expect(hos.outstanding).toMatch(/written usage terms/);
  });

  it("keeps pre-party and concept media excluded", () => {
    const m = mediaRecords();
    expect(m.find((x) => x.id === "vmm-preparty")?.state).toBe("Excluded from publication");
    expect(m.find((x) => x.id === "njs-concept")?.state).toBe("Excluded from publication");
  });
});

describe("review page", () => {
  it("is never served on production, even with every page launched", () => {
    expect(isWithheld("/2027/review", "production", ["approved"], { config: OPEN, reviewMedia: {} })).toBe(true);
    expect(isWithheld("/2027/review", "preview", ["approved", "provisional"])).toBe(false);
  });

  it("renders the groups, the record method and no form submission", async () => {
    const { default: Page } = await import("../app/(edition)/2027/review/page");
    const html = renderToStaticMarkup(createElement(Page));
    for (const t of ["Content sign-off", "Shared across pages", "Factual content Veridion can verify", "Organiser wording for Mrs. Shuler",
      "Commercial and registration information", "Media rights and photograph records", "Approved", "Revision required", "Pending decision"]) {
      expect(html).toContain(t);
    }
    expect(html).not.toMatch(/<form|action=/);
    expect(html).not.toMatch(/DSC00\d{3}\.|drive\.google|_vercel_share/);
  });
});

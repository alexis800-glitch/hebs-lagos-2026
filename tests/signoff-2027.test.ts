/**
 * The content sign-off register (lib/content/signoff-2027.ts), its decision
 * record (lib/content/signoff-decisions-2027.ts), the media records and the
 * review page.
 */
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { blockStatus, contentRegister } from "../lib/content/2027";
import { HOME, homeCopyBlocks, homeCopyStatus } from "../lib/content/home-2027";
import { LAYOUT_COPY, layoutStatuses } from "../lib/content/layout-copy-2027";
import { SIGNOFF_DECISIONS, wordingApproved, type SignoffDecision } from "../lib/content/signoff-decisions-2027";
import {
  FIRST_LAUNCH, PAGE_KIND, approvalBlocks, firstLaunchDecisions, mediaRecords, pendingDecisions, signoffCounts, signoffItems,
} from "../lib/content/signoff-2027";
import { REVIEW_ASSETS } from "../lib/assets/home-2027-review";
import { TICKET_SALES, portalLink } from "../lib/integrations/registration-2027";
import { launchBlockers, pageStatuses, type LaunchConfig } from "../lib/launch-2027";
import { isWithheld } from "../middleware";
import { SITE_PAGES } from "../lib/site/2027";
import { TicketsPage } from "../components/2027/editorial/inner";

const OPEN: LaunchConfig = {
  authorisation: { by: "Owner (test)", on: "2027-06-01", reference: "test" },
  pages: SITE_PAGES.map((p) => p.id),
  origin: { status: "approved", value: "https://www.hebslagos.com", source: "test" },
};
const decided = (item: string, extra: Partial<SignoffDecision>): SignoffDecision => ({ item, decision: "approved", by: "Test", on: "2026-11-11", reference: "test", ...extra });

describe("sign-off register", () => {
  const items = signoffItems();

  it("lists every unapproved copy block and every inventoried layout string, once", () => {
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of contentRegister().filter((x) => x.status !== "approved" && !/^(education|qr)\./.test(x.key))) expect(ids, e.key).toContain(e.key);
    for (const s of LAYOUT_COPY) expect(ids, s.key).toContain(s.key);
  });

  it("lists every homepage line except the directive's own headlines", () => {
    const listed = new Set(items.filter((i) => i.id.startsWith("home.")).map((i) => i.id));
    for (const b of homeCopyBlocks()) expect(listed.has(b.key), b.key).toBe(!b.directive);
  });

  it("puts every item in one category, and A and B items in a block", () => {
    for (const i of items) {
      expect(["A", "B", "C"]).toContain(i.category);
      if (i.category === "C") expect(i.dependsOn.length, i.id).toBeGreaterThan(0);
      else expect(i.block, i.id).toBeDefined();
      if (i.category === "A") expect(i.approver).toBe("Veridion");
      if (i.category === "B") expect(["Mrs. Shuler", "HEBS organisers"]).toContain(i.approver);
    }
  });

  it("keeps navigation, buttons, notices and image descriptions routine", () => {
    const of = (text: string) => items.find((i) => i.text === text);
    for (const t of ["Skip to content", "Privacy Policy", "Take part", "Priority list opens soon", "Ticket sales."]) expect(of(t)?.category, t).toBe("A");
    expect(items.filter((i) => i.kind === "Image description" || i.kind === "Search and social").every((i) => i.category === "A")).toBe(true);
    expect(items.filter((i) => i.kind === "Status notice" && i.category !== "A").every((i) => i.approver === "HEBS organisers")).toBe(true);
  });

  it("holds form wording and ticket commitments until their decisions", () => {
    expect(items.filter((i) => i.kind === "Form wording").every((i) => i.category === "C")).toBe(true);
    expect(items.find((i) => i.text === "Secure online payment")?.category).toBe("C");
  });

  it("counts add up, and Mrs. Shuler's share is a short list of blocks", () => {
    const c = signoffCounts(items);
    const sum = (r: Record<string, number>) => Object.values(r).reduce((a, b) => a + b, 0);
    expect(sum(c.byCategory)).toBe(c.open);
    expect(sum(c.byApprover)).toBe(c.open);
    expect(c.byCategory.A).toBeGreaterThan(c.byCategory.B);
    expect(c.blocks.owner).toBeLessThan(20);
  });

  it("lists the outstanding decisions with the venue name and mark first", () => {
    const d = pendingDecisions(items).map((x) => x.decision);
    expect(d[0]).toMatch(/D9/);
    expect(d[1]).toMatch(/D3/);
    expect(firstLaunchDecisions(items).map((x) => x.decision).join(" ")).toMatch(/Written launch authorisation/);
  });
});

describe("decisions", () => {
  it("none is recorded on anyone's behalf yet", () => {
    expect(SIGNOFF_DECISIONS).toEqual([]);
  });

  it("an approval covers exactly the wording approved", () => {
    const block = { status: "provisional" as const, text: "Contact us" };
    const ok = [decided("pages.contact.title", { text: "Contact us" })];
    expect(blockStatus("pages.contact.title", block, ok)).toBe("approved");
    expect(blockStatus("pages.contact.title", { ...block, text: "Contact HEBS" }, ok)).toBe("provisional");
    const later = [...ok, decided("pages.contact.title", { decision: "revision-required" })];
    expect(wordingApproved("pages.contact.title", "Contact us", later)).toBe(false);
  });

  it("a block approval approves each line in its exact wording only", () => {
    const b = approvalBlocks().find((x) => x.id === "owner-home-welcome")!;
    const rec = [decided(`block:${b.id}`, { texts: b.texts })];
    for (const [k, t] of Object.entries(b.texts)) {
      expect(wordingApproved(k, t, rec)).toBe(true);
      expect(wordingApproved(k, `${t} (changed)`, rec)).toBe(false);
    }
  });

  it("the homepage copy is approved only when every listed line is", () => {
    expect(homeCopyStatus()).toBe("provisional");
    const all = homeCopyBlocks().filter((b) => !b.directive).map((b) => decided(b.key, { text: b.text }));
    expect(homeCopyStatus(all)).toBe("approved");
    expect(homeCopyStatus(all.slice(1))).toBe("provisional");
    expect(HOME.hero.kicker).toBe("HEBS Lagos 2027");
  });

  it("the launch gate counts layout wording on each page", () => {
    for (const p of SITE_PAGES) {
      const layout = layoutStatuses(p.id);
      expect(layout.length, p.id).toBeGreaterThan(0);
      expect(pageStatuses(p.id).length, p.id).toBeGreaterThanOrEqual(layout.length);
    }
  });
});

describe("venue wording", () => {
  it("keeps the Atlantic location without placing HEBS on the beach", () => {
    const all = [...contentRegister().map((e) => e.text), ...homeCopyBlocks().map((b) => b.text), ...LAYOUT_COPY.map((s) => s.text)];
    for (const t of all) expect(t).not.toMatch(/beachfront|on the beach/i);
  });
});

describe("media", () => {
  it("records the event owner's approval of the selected website media", () => {
    const m = mediaRecords();
    for (const id of ["house-of-snapp", "vmm-summit"] as const) {
      const r = m.find((x) => x.id === id)!;
      expect(r.state, id).toBe("Approved by the event owner");
      expect(r.basis).toMatch(/Mrs\. Shuler/);
    }
  });

  it("keeps restrictions only where there is evidence", () => {
    const m = mediaRecords();
    expect(m.find((x) => x.id === "vmm-preparty")?.basis).toMatch(/disputed/);
    expect(m.find((x) => x.id === "njs-concept")?.state).toBe("Restricted");
    for (const a of REVIEW_ASSETS.filter((x) => x.collection === "house-of-snapp")) expect(a.restricted, a.id).toBeUndefined();
  });

  it("does not block a launch for paperwork; only restricted media or files still in the review folder", () => {
    const b = launchBlockers({ config: { ...OPEN, pages: ["home", "tickets", "gallery"] }, statuses: ["approved"] }).map((x) => x.id);
    expect(b).toContain("media-restricted-home");
    expect(b).not.toContain("media-restricted-gallery");
    expect(b).toContain("review-media-gallery");
    expect(b.join(" ")).not.toMatch(/terms|licence/);
  });
});

describe("launch readiness", () => {
  it("classifies every page, and the smallest launch is the homepage and Tickets", () => {
    for (const p of SITE_PAGES) expect(PAGE_KIND[p.id]).toBeDefined();
    expect(FIRST_LAUNCH).toEqual(["home", "tickets"]);
  });

  it("Tickets never implies sales are open before prices and payment are approved", () => {
    expect(TICKET_SALES.prices && TICKET_SALES.payment).toBe(false);
    const approvedRoute = { tickets: { status: "approved", value: "https://hebseventportal.com/tickets", source: "test" } } as never;
    expect(portalLink("tickets", "production", approvedRoute, ["hebseventportal.com"])).toBeNull();
    const html = renderToStaticMarkup(createElement(TicketsPage, { environment: "preview", notes: "inline" }));
    expect(html).not.toMatch(/Buy tickets|Book now|Checkout|Add to cart|Pay now/i);
    expect(html).toMatch(/not on sale/);
  });
});

describe("review page", () => {
  it("is never served on production, even with every page launched", () => {
    expect(isWithheld("/2027/review", "production", ["approved"], { config: OPEN, reviewMedia: {} })).toBe(true);
    expect(isWithheld("/2027/review", "preview", ["approved", "provisional"])).toBe(false);
  });

  it("renders the three categories and block decisions, with no form submission", async () => {
    const { default: Page } = await import("../app/(edition)/2027/review/page");
    const html = renderToStaticMarkup(createElement(Page));
    for (const t of ["Content sign-off", "A. Routine wording Veridion verifies", "B. Substantive wording", "C. Waiting on an outstanding decision",
      "Launch readiness by page", "Approved", "Revision required", "Pending decision", "Approved by the event owner"]) {
      expect(html).toContain(t);
    }
    expect(html).not.toMatch(/<form|action=/);
    expect(html).not.toMatch(/drive\.google|_vercel_share/);
  });
});

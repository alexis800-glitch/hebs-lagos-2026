/**
 * Launch readiness of the HEBS Lagos 2027 site (lib/launch-2027.ts): the single
 * publication switch, its mandatory requirements, route separation, metadata,
 * sitemap, structured data, form safeguards, rollback and the 2026 routes.
 *
 * LAUNCHED describes a launch with everything in place; it exists only here, to
 * prove the open path works. The real switch stays closed (see "today").
 */
import { afterEach, describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { config as middlewareConfig, isWithheld } from "../middleware";
import { PreferredHomepage } from "@/components/2027/home/HomePage";
import { eventJsonLd } from "@/components/2027/site/EventJsonLd";
import { previewStatuses } from "@/lib/content/2027";
import { PAGES } from "@/lib/content/2027-pages";
import { EDITION_DAYS } from "@/lib/editions/2027";
import { REVIEW_ASSETS, findReviewAsset } from "@/lib/assets/home-2027-review";
import {
  AboutPage, CompetitionsPage, ContactPage, EducationPage, ExhibitorsPage, ExperiencePage, GalleryPage, ProgrammePage,
  SpeakersPage, SponsorshipPage, TicketsPage, TravelPage,
} from "@/components/2027/editorial/inner";
import { FORMS_OPEN, PORTAL_2027 } from "@/lib/integrations/registration-2027";
import {
  LAUNCH_2027, REVIEW_MEDIA_BY_PAGE, launchBlockers, pagePublished, pageReadiness, pageStatuses, pathPublished, site2027Open, type LaunchConfig, type LaunchInputs,
} from "@/lib/launch-2027";
import { PRIORITY_CTA, SITE_PAGES, type PageId } from "@/lib/site/2027";
import { pageMetadata, sitemapXml } from "@/lib/site/seo-2027";

const ROOT = join(__dirname, "..");
const APPROVED = ["approved"] as const;
const LAUNCHED: LaunchConfig = {
  authorisation: { by: "Owner (test)", on: "2027-06-01", reference: "test" },
  pages: ["home", "tickets", "about"],
  origin: { status: "approved", value: "https://www.hebslagos.com", source: "test" },
};
/** Everything in place: approvals, authorisation, no review media, forms closed. */
const OPEN: LaunchInputs = { config: LAUNCHED, statuses: APPROVED, reviewMedia: {}, withhold: undefined };
const ids = (b: { id: string }[]) => b.map((x) => x.id);

const ENV = { ...process.env };
afterEach(() => {
  process.env = { ...ENV };
});

describe("the launch switch today", () => {
  it("is closed, with no authorisation and no pages chosen", () => {
    expect(LAUNCH_2027.authorisation).toBeNull();
    expect(LAUNCH_2027.pages).toEqual([]);
    expect(site2027Open("production")).toBe(false);
  });

  it("lists today's launch blockers", () => {
    expect(ids(launchBlockers())).toEqual(["authorisation", "pages"]);
  });

  it("withholds every 2027 address on production, pages and site files alike", () => {
    for (const p of [...SITE_PAGES.map((x) => x.path), "/2027/sitemap.xml", "/2027/social-card", "/2027/status"]) {
      expect(pathPublished(p, "production"), p).toBe(false);
      expect(isWithheld(p, "production", previewStatuses()), p).toBe(true);
    }
  });
});

describe("production publication controls", () => {
  it("opens only when every mandatory requirement is met", () => {
    expect(launchBlockers(OPEN)).toEqual([]);
    expect(site2027Open("production", OPEN)).toBe(true);
  });

  it("stays closed if any single requirement fails", () => {
    const cases: [string, LaunchInputs][] = [
      ["authorisation", { ...OPEN, config: { ...LAUNCHED, authorisation: null } }],
      ["authorisation", { ...OPEN, config: { ...LAUNCHED, authorisation: { by: "Owner", on: "2027-06-01", reference: "" } } }],
      ["pages", { ...OPEN, config: { ...LAUNCHED, pages: ["tickets"] } }],
      ["pages-tickets", { ...OPEN, config: { ...LAUNCHED, pages: ["home"] } }],
      ["approvals-home", { ...OPEN, statuses: ["approved", "provisional"] }],
      ["approvals-tickets", { ...OPEN, statuses: ["approved", "awaiting-confirmation"] }],
      ["media-release-home", { ...OPEN, reviewMedia: { home: ["hero-loop-wide"] } }],
      ["form-priority", { ...OPEN, formsOpen: { ...FORMS_OPEN, priority: true } }],
      ["origin", { ...OPEN, config: { ...LAUNCHED, origin: { status: "provisional", value: "https://www.hebslagos.com", note: "D7" } } }],
      ["withhold", { ...OPEN, withhold: "on" }],
    ];
    for (const [id, inputs] of cases) {
      expect(ids(launchBlockers(inputs)), id).toContain(id);
      expect(site2027Open("production", inputs), id).toBe(false);
    }
  });

  it("reads the emergency switch from the environment", () => {
    process.env.HEBS_2027_WITHHOLD = "on";
    const { withhold: _ignored, ...fromEnv } = OPEN;
    expect(site2027Open("production", fromEnv)).toBe(false);
    process.env.HEBS_2027_WITHHOLD = "off";
    expect(site2027Open("production", fromEnv)).toBe(true);
  });

  it("leaves previews and development on today's staging rule", () => {
    expect(site2027Open("preview")).toBe(true);
    expect(site2027Open("development")).toBe(true);
    expect(site2027Open("preview", { statuses: ["draft"] })).toBe(false);
  });
});

describe("page-by-page approvals", () => {
  it("judges each launched page on its own content only", () => {
    const real = { ...OPEN, statuses: undefined };
    const blockers = ids(launchBlockers({ ...real, config: { ...LAUNCHED, pages: ["home", "tickets"] } }));
    expect(blockers).toContain("approvals-home");
    expect(blockers).toContain("approvals-tickets");
    // The gallery's unapproved copy does not hold back a launch that leaves it out.
    expect(blockers.filter((b) => b.includes("gallery"))).toEqual([]);
  });

  it("counts the homepage's own copy, which has no per-block states", () => {
    expect(pageStatuses("home")).toContain("provisional");
  });

  it("summarises every page's readiness", () => {
    const r = pageReadiness();
    expect(r.map((p) => p.id)).toEqual(SITE_PAGES.map((p) => p.id));
    for (const p of r) expect(p.ready, p.id).toBe(p.pending === 0 && p.reviewMedia === 0);
  });
});

describe("image-usage authorisation", () => {
  it("knows every review photograph the homepage renders", () => {
    const html = renderToStaticMarkup(createElement(PreferredHomepage));
    const rendered = REVIEW_ASSETS.filter((a) => html.includes(a.src) || (a.poster && html.includes(a.poster))).map((a) => a.id);
    expect(rendered.length).toBeGreaterThan(40);
    for (const id of rendered) expect(REVIEW_MEDIA_BY_PAGE.home, id).toContain(id);
  });

  it("knows every review photograph each inner page renders", () => {
    const render = (Page: (p: { environment: "development" }) => React.ReactElement) => renderToStaticMarkup(createElement(Page, { environment: "development" }));
    const pages: [PageId, (p: { environment: "development" }) => React.ReactElement][] = [
      ["about", AboutPage], ["experience", ExperiencePage], ["programme", ProgrammePage], ["education", EducationPage],
      ["competitions", CompetitionsPage], ["speakers", SpeakersPage], ["exhibitors", ExhibitorsPage], ["sponsorship", SponsorshipPage],
      ["tickets", TicketsPage], ["travel", TravelPage], ["gallery", GalleryPage], ["contact", ContactPage],
    ];
    for (const [id, Page] of pages) {
      const html = render(Page);
      const used = REVIEW_ASSETS.filter((a) => a.kind === "image" && html.includes(`src="${a.src}"`)).map((a) => a.id);
      for (const u of used) expect(REVIEW_MEDIA_BY_PAGE[id] ?? [], `${id} uses ${u}`).toContain(u);
      // Never the pre-party photographs (ownership unresolved) or concept films.
      for (const u of used) expect(findReviewAsset(u).source, `${id} uses ${u}`).not.toMatch(/Pre-Party|DSC00\d{3}|WhatsApp|Seedance/);
    }
  });

  it("blocks every page that shows media until the prepared files are in the release", () => {
    for (const page of ["home", "education", "gallery"] as const) {
      expect(REVIEW_MEDIA_BY_PAGE[page]?.length, page).toBeGreaterThan(0);
      const blockers = launchBlockers({ ...OPEN, config: { ...LAUNCHED, pages: ["home", "tickets", page] }, reviewMedia: REVIEW_MEDIA_BY_PAGE });
      expect(ids(blockers), page).toContain(`media-release-${page}`);
      const released = launchBlockers({ ...OPEN, config: { ...LAUNCHED, pages: ["home", "tickets", page] }, reviewMedia: REVIEW_MEDIA_BY_PAGE, mediaReleased: true });
      expect(ids(released).filter((b) => b.startsWith("media-")), page).toEqual([]);
    }
  });

  it("shows no restricted media on the homepage", () => {
    const html = renderToStaticMarkup(createElement(PreferredHomepage));
    for (const a of REVIEW_ASSETS.filter((x) => x.restricted)) {
      expect(html.includes(a.src) || Boolean(a.poster && html.includes(a.poster)), a.id).toBe(false);
      expect(REVIEW_MEDIA_BY_PAGE.home ?? [], a.id).not.toContain(a.id);
    }
  });

  it("never serves review media on production, launched or not", () => {
    expect(isWithheld("/_review/home-2027/gal-img_6721.webp", "production", APPROVED, OPEN)).toBe(true);
    expect(middlewareConfig.matcher).toContain("/_review/:path*");
  });
});

describe("public and private route separation", () => {
  it("serves only the launched pages and the site files", () => {
    for (const p of ["/2027", "/2027/tickets", "/2027/about", "/2027/sitemap.xml", "/2027/social-card"]) {
      expect(pathPublished(p, "production", OPEN), p).toBe(true);
    }
    for (const p of ["/2027/gallery", "/2027/education", "/2027/status", "/2027/homepage", "/2027/concepts/home", "/2027/brand-study/a", "/2027/not-a-page"]) {
      expect(pathPublished(p, "production", OPEN), p).toBe(false);
    }
    expect(pagePublished("gallery", "production", OPEN)).toBe(false);
    expect(pagePublished("gallery", "preview", OPEN)).toBe(true);
  });
});

describe("sitemap and metadata", () => {
  it("has no sitemap on production before launch, and only launched pages after", () => {
    expect(sitemapXml("production")).toBeNull();
    const xml = sitemapXml("production", OPEN)!;
    const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1]);
    expect(locs).toEqual(["https://www.hebslagos.com/2027", "https://www.hebslagos.com/2027/about", "https://www.hebslagos.com/2027/tickets"]);
    const preview = Array.from(sitemapXml("preview")!.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1]);
    expect(preview).toHaveLength(SITE_PAGES.filter((p) => p.built).length);
    expect(new Set(preview).size).toBe(preview.length);
  });

  it("gives withheld pages no metadata, and launched pages a title, description, canonical address and social card", () => {
    expect(pageMetadata("home", "production")).toEqual({});
    for (const p of SITE_PAGES) {
      const m = pageMetadata(p.id, "production", { ...OPEN, config: { ...LAUNCHED, pages: SITE_PAGES.map((x) => x.id) } });
      const url = `https://www.hebslagos.com${p.path}`;
      expect(m.alternates?.canonical, p.id).toBe(url);
      expect(m.robots, p.id).toEqual({ index: true, follow: true });
      expect(String((m.title as { absolute: string }).absolute), p.id).not.toMatch(/staging/);
      expect((m.description ?? "").length, p.id).toBeGreaterThan(40);
      expect((m.description ?? "").length, p.id).toBeLessThanOrEqual(160);
      expect(m.openGraph?.url, p.id).toBe(url);
      expect(JSON.stringify(m.openGraph?.images), p.id).toContain("/2027/social-card");
    }
  });

  it("keeps previews out of search engines", () => {
    for (const p of SITE_PAGES) {
      const m = pageMetadata(p.id, "preview");
      expect(m.robots, p.id).toEqual({ index: false, follow: false, nocache: true });
      expect(String((m.title as { absolute: string }).absolute), p.id).toMatch(/\(staging\)$/);
    }
  });

  it("takes every description from the page's own copy", () => {
    for (const p of SITE_PAGES.filter((x) => x.id !== "home" && x.id !== "about")) {
      const intro = PAGES[p.id as Exclude<typeof p.id, "home" | "about">].intro.text;
      expect(intro.startsWith(String(pageMetadata(p.id, "preview").description).replace(/…$/, "")), p.id).toBe(true);
    }
  });
});

describe("Event structured data", () => {
  it("states only confirmed facts, and nothing unapproved on production", () => {
    const prod = eventJsonLd("production");
    expect(prod.startDate).toBe(EDITION_DAYS[0].isoDate);
    expect(prod.endDate).toBe("2027-07-25");
    // The venue name is confirmed (D9); its street address is not, so none is stated.
    expect(prod).toHaveProperty("location.name", "NJS Beach Resort");
    expect(JSON.stringify(prod)).not.toMatch(/streetAddress/);
    expect(prod).not.toHaveProperty("description");
    for (const key of ["offers", "performer", "doorTime", "price"]) expect(prod, key).not.toHaveProperty(key);
    const preview = eventJsonLd("preview");
    expect(preview).toHaveProperty("location.name", "NJS Beach Resort");
  });
});

describe("registration form safeguards", () => {
  it("keeps every form closed and every portal link unset", () => {
    expect(Object.values(FORMS_OPEN).every((open) => open === false)).toBe(true);
    expect(Object.values(PORTAL_2027).every((r) => r.status !== "approved")).toBe(true);
    expect(PRIORITY_CTA).toBe("The 2027 priority list");
  });
});

describe("rollback readiness", () => {
  it("documents all three rollback routes", () => {
    const doc = readFileSync(join(ROOT, "docs/launch/LAUNCH-2027.md"), "utf8");
    for (const s of ["Instant Rollback", "HEBS_2027_WITHHOLD=on", "Revert the launch commit"]) expect(doc).toContain(s);
  });

  it("closes again when the authorisation is reverted", () => {
    expect(site2027Open("production", OPEN)).toBe(true);
    expect(site2027Open("production", { ...OPEN, config: { ...LAUNCHED, authorisation: null } })).toBe(false);
  });

  it("keeps the launch switch in one place", () => {
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const n of readdirSync(dir)) {
        const p = join(dir, n);
        if (statSync(p).isDirectory()) { if (!["node_modules", ".next", "public", ".git"].includes(n)) walk(p); continue; }
        if (/\.(ts|tsx)$/.test(n) && /authorisation:\s*(null|\{)/.test(readFileSync(p, "utf8"))) hits.push(relative(ROOT, p));
      }
    };
    for (const d of ["app", "components", "lib"]) walk(join(ROOT, d));
    expect(hits).toEqual(["lib/launch-2027-config.ts"]);
  });
});

describe("the live 2026 site", () => {
  const ROUTES_2026 = [
    "/", "/about", "/competitions", "/contact", "/gallery", "/hebs-legacy/2024", "/hebs-legacy/2025",
    "/hebs-legacy/media-gallery", "/privacy", "/sponsors", "/tickets", "/vendors",
  ];

  it("keeps every 2026 route", () => {
    const found: string[] = [];
    const walk = (dir: string) => {
      for (const n of readdirSync(dir)) {
        const p = join(dir, n);
        if (statSync(p).isDirectory()) walk(p);
        else if (n === "page.tsx") found.push("/" + relative(join(ROOT, "app/(site)"), dir).replace(/\\/g, "/"));
      }
    };
    walk(join(ROOT, "app/(site)"));
    expect(found.map((p) => (p === "/" ? p : p.replace(/\/$/, ""))).sort()).toEqual([...ROUTES_2026].sort());
  });

  it("is never withheld, before or after a 2027 launch", () => {
    for (const p of ROUTES_2026) {
      expect(isWithheld(p, "production", previewStatuses()), p).toBe(false);
      expect(isWithheld(p, "production", APPROVED, OPEN), p).toBe(false);
    }
  });

  it("gets no root robots.txt or sitemap from the 2027 work", () => {
    for (const f of ["app/robots.ts", "app/sitemap.ts", "app/robots.txt", "app/sitemap.xml", "public/robots.txt", "public/sitemap.xml"]) {
      expect(existsSync(join(ROOT, f)), f).toBe(false);
    }
  });
});

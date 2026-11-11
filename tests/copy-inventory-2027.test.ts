/**
 * The layout-wording inventory (lib/content/layout-copy-2027.json): every piece
 * of visible 2027 wording that the content modules do not already hold, taken
 * from what the pages actually render, so the launch gate can account for all
 * of it. Staging-only parts (data-staging) are left out: production never shows them.
 *
 * `npm run copy:inventory` rewrites the file; otherwise this test fails when a
 * page's wording has changed and the inventory has not.
 */
import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CAMPAIGN, EDITION_DAYS, VENUE } from "../lib/editions/2027";
import { CATEGORIES, COMPETITIONS } from "../lib/competitions";
import { contentRegister } from "../lib/content/2027";
import { HOME, homeCopyBlocks } from "../lib/content/home-2027";
import { DIRECTIVE_HEADLINES } from "../lib/content/directive-headlines-2027";
import type { LayoutString } from "../lib/content/layout-copy-2027";
import { SITE_PAGES, type PageId } from "../lib/site/2027";
import { SOCIAL_CARD, pageDescription, pageTitle } from "../lib/site/seo-2027";
import { PreferredHomepage } from "../components/2027/home/HomePage";
import { SiteFooter } from "../components/2027/site/SiteFooter";
import {
  AboutPage, CompetitionsPage, ContactPage, EducationPage, ExhibitorsPage, ExperiencePage, GalleryPage,
  ProgrammePage, SpeakersPage, SponsorshipPage, TicketsPage, TravelPage,
} from "../components/2027/editorial/inner";

const FILE = join(__dirname, "../lib/content/layout-copy-2027.json");
type Inner = (p: { environment: "preview"; notes: "inline" }) => React.ReactElement;
const INNER: Record<Exclude<PageId, "home">, Inner> = {
  about: AboutPage, experience: ExperiencePage, programme: ProgrammePage, education: EducationPage, competitions: CompetitionsPage,
  speakers: SpeakersPage, exhibitors: ExhibitorsPage, sponsorship: SponsorshipPage, tickets: TicketsPage, travel: TravelPage,
  gallery: GalleryPage, contact: ContactPage,
};

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: " " };
const decode = (s: string) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&(\w+);/g, (m, n) => ENTITIES[n] ?? m);
// The footer's copyright year follows the calendar; it is recorded as "{year}" so its approval does not lapse each January.
const clean = (s: string) => decode(s).replace(/\s+/g, " ").trim().replace(/^© \d{4} /, "© {year} ");
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\u00C0-\u024F]+/g, " ").trim();

/** Removes every element marked data-staging, with all it contains. */
function dropStaging(html: string): string {
  for (;;) {
    const m = /<([a-z0-9]+)\b[^>]*\bdata-staging=""[^>]*>/i.exec(html);
    if (!m) return html;
    const tag = m[1];
    const re = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, "gi");
    re.lastIndex = m.index + m[0].length;
    let depth = 1;
    let end = html.length;
    for (let t = re.exec(html); t; t = re.exec(html)) {
      depth += t[0].startsWith("</") ? -1 : 1;
      if (depth === 0) { end = t.index + t[0].length; break; }
    }
    html = html.slice(0, m.index) + html.slice(end);
  }
}

/** Visible strings and image descriptions in rendered markup, block by block. */
function strings(markup: string): { text: string; where: "page" | "alt" }[] {
  // Text drawn inside an SVG (the homepage seal) is visible too: keep it, drop the rest of the drawing.
  const svgText = Array.from(dropStaging(markup).matchAll(/<(?:text|textPath)\b[^>]*>([^<]+)</g)).map((m) => clean(m[1]));
  let html = dropStaging(markup).replace(/<(style|script|svg)\b[\s\S]*?<\/\1>/gi, "");
  const alts = Array.from(html.matchAll(/\b(?:alt|aria-label)="([^"]+)"/g)).map((m) => clean(m[1]));
  // Inline elements, links included, join their text; buttons and pill labels stand alone.
  html = html.replace(/<br\s*\/?>/gi, " ").replace(/<\/?(span|a|b|i|em|strong|time|small|sup|sub|abbr|u)\b(?![^>]*\b(s27-btn|btn)\b)[^>]*>/gi, " ");
  const texts = html.split(/<[^>]+>/).map((t) => clean(t).replace(/ ([.,;:!?])/g, "$1"));
  return [...texts.map((text) => ({ text, where: "page" as const })), ...svgText.map((text) => ({ text, where: "page" as const })), ...alts.map((text) => ({ text, where: "alt" as const }))]
    .filter((s) => /[A-Za-z]/.test(s.text));
}

/** Wording the content modules already hold, approved or not: covered there, not here. */
function known(): string[] {
  return [
    ...contentRegister().map((e) => e.text),
    ...homeCopyBlocks().map((b) => b.text),
    // Homepage headlines the page sets in two styles, as read together.
    ...[HOME.welcome, HOME.numbers, HOME.days, HOME.experiences, HOME.destination, HOME.competitions, HOME.competitions.winners, HOME.highlights, HOME.sponsors, HOME.final]
      .map((h) => `${h.title} ${h.accent}`),
    [...HOME.hero.lines, HOME.hero.accent].join(" "),
    ...Object.values(DIRECTIVE_HEADLINES),
    CAMPAIGN.name, CAMPAIGN.theme, CAMPAIGN.datesDisplay, VENUE.name.value, VENUE.locality,
    ...EDITION_DAYS.flatMap((d) => [d.title, d.officialName, d.description, d.weekday, d.shortDate]),
    ...CATEGORIES.map((c) => c.name),
    ...COMPETITIONS.flatMap((c) => [c.name, c.description]),
  ].map(norm);
}

/**
 * Rendered as a preview without review media: what a launched page shows, since
 * review photographs and internal-review panels never reach production.
 */
function inventory(): LayoutString[] {
  const saved = { env: process.env.VERCEL_ENV, media: process.env.HEBS_REVIEW_MEDIA };
  process.env.VERCEL_ENV = "preview";
  delete process.env.HEBS_REVIEW_MEDIA;
  try {
    return collect();
  } finally {
    if (saved.env === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = saved.env;
    if (saved.media !== undefined) process.env.HEBS_REVIEW_MEDIA = saved.media;
  }
}

function collect(): LayoutString[] {
  const have = known();
  // A short string must match held wording exactly; a longer one may be part of it
  // (a sentence the page sets across two styles, a description clipped for search).
  const covered = (t: string) => {
    const n = norm(t.replace(/…$/, ""));
    if (n.length === 0) return true;
    return n.split(" ").length < 4 ? have.includes(n) : have.some((h) => h.includes(n));
  };
  const seen = new Map<string, { where: LayoutString["where"]; pages: Set<PageId | "site"> }>();
  const add = (text: string, where: LayoutString["where"], page: PageId | "site") => {
    if (covered(text)) return;
    const e = seen.get(text) ?? { where, pages: new Set() };
    e.pages.add(page);
    seen.set(text, e);
  };
  // The homepage component has no launch check of its own (its route does), so it
  // renders as production; inner pages check theirs and render as a preview.
  const render = (id: PageId) => {
    if (id !== "home") return renderToStaticMarkup(createElement(INNER[id], { environment: "preview", notes: "inline" }));
    process.env.VERCEL_ENV = "production";
    try {
      return renderToStaticMarkup(createElement(PreferredHomepage));
    } finally {
      process.env.VERCEL_ENV = "preview";
    }
  };
  for (const p of SITE_PAGES) {
    for (const s of strings(render(p.id))) add(s.text, s.where, p.id);
    add(pageTitle(p.id), "seo", p.id);
    add(pageDescription(p.id), "seo", p.id);
  }
  for (const s of strings(renderToStaticMarkup(createElement(SiteFooter)))) add(s.text, s.where, "site");
  for (const t of [SOCIAL_CARD.alt, ...Object.values(SOCIAL_CARD.lines)]) add(t, "social", "site");

  const out: LayoutString[] = [];
  for (const [text, e] of Array.from(seen.entries())) {
    // Site-wide: the footer, the social card, and wording on nearly every page (navigation).
    // Anything else is recorded for each page it appears on, so it counts only there.
    const pages = e.pages.has("site") || e.pages.size >= SITE_PAGES.length - 1 ? ["site"] : Array.from(e.pages);
    for (const s of pages) {
      out.push({ key: `layout.${s}.${createHash("sha1").update(text).digest("hex").slice(0, 10)}`, scope: s as LayoutString["scope"], where: e.where, text });
    }
  }
  const order = ["site", ...SITE_PAGES.map((p) => p.id)];
  return out.sort((a, b) => order.indexOf(a.scope) - order.indexOf(b.scope));
}

describe("layout wording inventory", () => {
  const current = inventory();

  it("is up to date with what the pages render", () => {
    const body = JSON.stringify({ note: "Generated by npm run copy:inventory. Do not edit by hand.", strings: current }, null, 1) + "\n";
    if (process.env.UPDATE_COPY_INVENTORY === "1") writeFileSync(FILE, body);
    expect(JSON.parse(readFileSync(FILE, "utf8")).strings, "Page wording changed: run npm run copy:inventory and review the new items").toEqual(current);
  });

  it("leaves out staging-only wording", () => {
    for (const s of current) expect(s.text, s.key).not.toMatch(/Internal preview|Staging note|Pending approval|not for publication/i);
  });

  it("finds the navigation, footer and search wording", () => {
    const texts = current.map((s) => s.text);
    expect(texts).toEqual(expect.arrayContaining(["Take part", "Plan your visit", "Privacy Policy", "Skip to content", "Ticket sales."]));
    expect(current.some((s) => s.where === "seo")).toBe(true);
    expect(current.some((s) => s.where === "social")).toBe(true);
  });
});

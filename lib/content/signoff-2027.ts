/**
 * The HEBS Lagos 2027 content sign-off register: every piece of wording and
 * every fact the 13 pages show that is not approved yet, in three categories:
 *
 *   A  routine     navigation, headings, buttons, captions, image descriptions,
 *                  search titles, status notices and facts checkable against a
 *                  source. Veridion verifies these, page by page.
 *   B  substantive the summit's own voice and its business and commercial
 *                  statements. Mrs. Shuler (or the HEBS organisers, for
 *                  commercial wording) approves these in coherent blocks: the
 *                  executive content package (approvalBlocks).
 *   C  waiting     wording or facts that cannot be approved until an outstanding
 *                  decision is made (venue D9, mark D3, routes D1, privacy D13,
 *                  prizes D8, contacts D10, ticket prices and payment, ...).
 *
 * Derived from the content itself (lib/content/2027.ts, 2027-pages.ts,
 * home-2027.ts), the layout wording the pages render (layout-copy-2027.ts) and
 * the facts the launch gate reads, so it cannot fall out of date. Decisions are
 * recorded in lib/content/signoff-decisions-2027.ts, for one item or a whole
 * block, always with the exact wording. The review page /2027/review (previews
 * only) shows it all and drafts decisions.
 *
 * Media is not decided here: the event owner's approval of the website media is
 * recorded (lib/assets/home-2027-review.ts). mediaRecords() reports only
 * evidence-based restrictions and third-party paperwork to file.
 */
import { COPY, contentRegister } from "./2027";
import { PAGES } from "./2027-pages";
import { homeCopyBlocks } from "./home-2027";
import { LAYOUT_COPY, layoutStatus, type LayoutString } from "./layout-copy-2027";
import { SIGNOFF_DECISIONS, latestDecision, wordingApproved, type SignoffDecision } from "./signoff-decisions-2027";
import { EDITION_DAYS, VENUE } from "../editions/2027";
import { findAsset } from "../assets/register";
import { OWNER_MEDIA_APPROVAL, REVIEW_ASSETS, type ReviewCollection } from "../assets/home-2027-review";
import { REVIEW_MEDIA_BY_PAGE } from "../launch-2027";
import { LAUNCH_2027 } from "../launch-2027-config";
import { SITE_PAGES, type PageId } from "../site/2027";
import { CATEGORIES as COMPETITION_CATEGORIES } from "../competitions";
import type { PublicationStatus } from "../publication";

export type Category = "A" | "B" | "C";
export type Approver = "Veridion" | "Mrs. Shuler" | "HEBS organisers";
/** 1: needed for the smallest public launch; 2: the next pages; 3: pages waiting on forms or commercial decisions. */
export type Tier = 1 | 2 | 3;
type Area = "shared" | "factual" | "organiser" | "commercial";

export const CATEGORIES: Record<Category, { title: string; summary: string }> = {
  A: {
    title: "A. Routine wording Veridion verifies",
    summary: "Navigation, headings, buttons, captions, image descriptions, search titles, notices that say something is not open yet, and facts checkable against the directive or the 2026 site. Verified page by page; none needs the organisers.",
  },
  B: {
    title: "B. Substantive wording for Mrs. Shuler and the HEBS organisers",
    summary: "What HEBS says about itself, the summit and its offers. Approved block by block in the executive content package, never line by line.",
  },
  C: {
    title: "C. Waiting on an outstanding decision",
    summary: "Wording and facts that cannot be approved until the decision named is made. Listed by decision, so each decision clears its items at once.",
  },
};

export interface SignoffItem {
  /** Register key; also the key a decision is recorded under. */
  id: string;
  category: Category;
  /** Who approves it; for category C, who makes the decision it waits on. */
  approver: Approver;
  tier: Tier;
  /** The wording as it stands. */
  text: string;
  kind: "Fact" | "Status notice" | "Caption" | "Label or heading" | "Image description" | "Search and social" | "Form wording" | "Commitment" | "Copy";
  pages: PageId[];
  /** Section of the page, in words. */
  section: string;
  status: PublicationStatus;
  /** Category C: the decisions it waits on. */
  dependsOn: string[];
  /** A status notice: the decisions that will replace it with real details. The notice is true until then. */
  replacedWhen: string[];
  /** The approval block it belongs to (categories A and B). */
  block?: string;
  /** Where the wording comes from: the evidence behind an approval. */
  source: string;
  proposed?: { text: string; why: string };
  revised?: { from: string; why: string };
  recorded?: SignoffDecision;
  /** Where approval is written down: "decision" (signoff-decisions-2027.ts) or the record named. */
  recordIn: string;
}

/* ------------------------------------------------------------------ */
/* Where each key appears                                              */
/* ------------------------------------------------------------------ */

const ALL_PAGES = SITE_PAGES.map((p) => p.id);

/** Register keys that no page of the 13 renders (the earlier editorial homepage only). */
const OFF_SITE = /^(education|qr)\./;

const PLACE: [RegExp, PageId[] | ((m: RegExpMatchArray) => PageId[]), string][] = [
  [/^home\.(\w+)/, ["home"], ""],
  [/^seo\.home/, ["home"], "Hero"],
  [/^seo\.about/, ["about"], "Search and social preview"],
  [/^welcome\./, ["about"], "Welcome"],
  [/^experience\./, ["experience"], "Six experiences"],
  [/^destination\./, ["experience"], "The destination"],
  [/^competitions\./, ["competitions"], "Overview"],
  [/^partners\./, ["sponsorship"], "Partnership pathways"],
  [/^priorityList\./, ["tickets"], "Priority list"],
  [/^highlights\./, ["gallery"], "HEBS Lagos 2026 highlights"],
  [/^finalCta\./, ALL_PAGES, "Closing call to action"],
  [/^pages\.(\w+)\./, (m) => [m[1] as PageId], ""],
];

const SECTION_WORDS: Record<string, string> = {
  title: "Page title", intro: "Introduction", hero: "Hero", welcome: "Welcome", numbers: "Three numbers", days: "Three days",
  experiences: "Six experiences", destination: "The destination", competitions: "Competitions", winners: "2026 winners",
  highlights: "2026 highlights", sponsors: "Sponsors and exhibitors", final: "Closing call to action", more: "Six experiences",
  daysIntro: "Three days", empty: "Each day", tracks: "Learning tracks", educators: "Educators", registration: "Registration",
  leadCaption: "Lead photograph", photos: "Photographs", photosCaption: "Photographs", speakerCaption: "Speaker photograph",
  eligibility: "Eligibility", rules: "Rules", apply: "Applications", awards: "Awards", steps: "How it works",
  prospectus: "Prospectus", contact: "Contact", opportunities: "Opportunities", brands: "Participating brands",
  venue: "The venue", directions: "Directions", arrival: "Arriving in Lagos", airport: "From the airport",
  accommodation: "Accommodation", visas: "Visas", support: "Visitor support", faqs: "Questions", status: "Ticket status",
  categories: "Categories", willSupportNote: "What registration will include", pending: "Waiting notice", archive: "Archive",
  earlier: "Earlier editions", photosTitle: "Photographs", photosIntro: "Photographs", emails: "Email", social: "Social media",
  history: "History", next: "2027", pillars: "Mission", vision: "Vision", profile: "Profiles", teach: "Teaching at HEBS",
};

function place(key: string): { pages: PageId[]; section: string } {
  for (const [re, pages, label] of PLACE) {
    const m = key.match(re);
    if (!m) continue;
    const field = key.startsWith("pages.") ? key.split(".")[2] : key.startsWith("home.") ? key.split(".")[1] : "";
    return { pages: typeof pages === "function" ? pages(m) : pages, section: label || SECTION_WORDS[field] || field };
  }
  throw new Error(`[signoff-2027] no page for ${key}`);
}

/* ------------------------------------------------------------------ */
/* Who approves it, and what it waits for                               */
/* ------------------------------------------------------------------ */

type Rule = [RegExp, { group: Area; approver: Approver; kind: RuleKind }];
type RuleKind = "Fact" | "Status notice" | "Caption" | "Label or button" | "Copy";
const COMMERCIAL: Approver = "HEBS organisers";
const rule = (group: Area, approver: Approver, kind: RuleKind) => ({ group, approver, kind });

/** First match wins. Keys first, then the shape of the wording. */
const KEY_RULES: Rule[] = [
  // Offers, registration and money.
  [/^pages\.tickets\.willSupportNote$/, rule("commercial", COMMERCIAL, "Copy")],
  [/^priorityList\.intro$/, rule("commercial", COMMERCIAL, "Copy")],
  [/^pages\.sponsorship\.(intro|steps\.)/, rule("commercial", COMMERCIAL, "Copy")],
  [/^partners\.(body|pathways\.|gate)/, rule("commercial", COMMERCIAL, "Copy")],
  [/^pages\.exhibitors\.(intro|opportunities\.)/, rule("commercial", COMMERCIAL, "Copy")],
  [/^pages\.competitions\.(eligibility|rules|apply|awards)$/, rule("commercial", COMMERCIAL, "Status notice")],
  [/^pages\.travel\.(accommodation|faqs\.2\.a)$/, rule("commercial", COMMERCIAL, "Status notice")],
  [/^home\.sponsors\.offers\./, rule("commercial", COMMERCIAL, "Copy")],
  // Checkable against the directive, the 2026 site or public sources.
  [/^(competitions\.body|pages\.competitions\.intro)$/, rule("factual", "Veridion", "Fact")],
  [/^pages\.experience\.more\.exp-(competitions|entertainment)$/, rule("factual", "Veridion", "Fact")],
  [/^pages\.travel\.(arrival|visas|faqs\.[01]\.a)$/, rule("factual", "Veridion", "Fact")],
  [/^pages\.about\.history$/, rule("factual", "Veridion", "Fact")],
  [/^pages\.gallery\.(photosTitle|photosIntro|archive|earlier|categories\.)/, rule("factual", "Veridion", "Caption")],
  [/^pages\.education\.(leadCaption|photos|photosCaption|speakerCaption)$/, rule("factual", "Veridion", "Caption")],
  [/^highlights\.headline$/, rule("factual", "Veridion", "Caption")],
  [/^seo\.homeTitle$/, rule("factual", "Veridion", "Fact")],
  [/^home\.(hero\.(when|where|live)|final\.when|highlights\.credit|sponsors\.caption|numbers\.items\.[012]\.text)$/, rule("factual", "Veridion", "Fact")],
  [/^home\.days\.items\.\d\.(date|title|text)$/, rule("factual", "Veridion", "Fact")],
  [/^home\.competitions\.winners\.note$/, rule("factual", "Veridion", "Status notice")],
  [/^home\.(.*\.label|.*\.cta\w*|hero\.kicker)$/, rule("factual", "Veridion", "Label or button")],
  [/^home\.experiences\.items\.\d\.title$/, rule("factual", "Veridion", "Label or button")],
  [/^experience\.items\.\d\.title$/, rule("factual", "Veridion", "Label or button")],
  [/^pages\.\w+\.title$/, rule("factual", "Veridion", "Label or button")],
];

/** Wording that only reports that something is not open or not confirmed yet. */
const NOTICE = /once (it is |they are |each is |officially )?(officially )?(approved|confirmed|opened)|published (here )?once|published (with|as)|(added|listed|appear) here as|as (they are|each one is|sessions are|it is) (officially )?(confirmed|cleared)|is confirmed yet|not on sale|are not open|until ticket sales|being explored/i;

function classify(key: string, text: string): { group: Area; approver: Approver; kind: RuleKind } {
  for (const [re, r] of KEY_RULES) if (re.test(key)) return r;
  if (NOTICE.test(text)) return rule("factual", "Veridion", "Status notice");
  return rule("organiser", "Mrs. Shuler", "Copy");
}

/** Decisions some wording waits on, by register key. */
const DEPENDS: [RegExp, string][] = [
  [/^pages\.tickets/, "Ticket categories, prices and payment gateway; ticketing route (D1)"],
  [/^priorityList/, "Priority list storage and administration (D1) and privacy notice (D13)"],
  [/^pages\.sponsorship|^partners|^home\.sponsors\.offers/, "Approved 2027 prospectus and packages; inquiry route (D1); public contacts (D10)"],
  [/^pages\.exhibitors/, "Exhibitor application route (D1); confirmed participating brands"],
  [/^pages\.competitions\.(eligibility|rules|apply|awards)/, "2027 rules, eligibility, fees, schedule and deadline; prize presentation (D8); application route (D1)"],
  [/^pages\.travel\.(directions|airport|support)|^pages\.travel\.faqs\.[34]/, "Venue address and transport (D9); visitor support contacts (D10)"],
  [/^pages\.travel\.(accommodation|faqs\.2)/, "Approved accommodation packages with NJS"],
  [/^pages\.contact/, "Public contacts and social accounts (D10); contact route (D1)"],
  [/^pages\.education\.(registration|educators)/, "Confirmed educators and sessions; registration route (D1)"],
  [/^pages\.speakers\.(intro|pending)$/, "At least one officially confirmed speaker or educator"],
  [/^pages\.programme/, "Confirmed 2027 sessions and times"],
];

/* ------------------------------------------------------------------ */
/* Corrections                                                          */
/* ------------------------------------------------------------------ */

/** Suggested wording, where the current text overstates, misspells or relies on something unconfirmed. */
const PROPOSALS: Record<string, { text: string; why: string }> = {
  "home.destination.body": {
    text: "NJS Royale Beach Resort, on the Atlantic coast of Lagos, is the official home of HEBS Lagos 2027: all three days of the summit in one resort setting.",
    why: "The ocean-facing pool terrace is shown only in NJS concept visuals, not the completed property. Describe it once NJS confirms it is complete and part of the HEBS programme.",
  },
  "home.experiences.items.4.text": {
    text: "An opening celebration at the resort and closing celebrations on the final day.",
    why: "Only one evening event, the Welcome Pre-Party, is confirmed. \"Evenings\" promises more than one.",
  },
  "pages.gallery.intro": {
    text: "Photographs and highlights from HEBS Lagos 2026. More material is added as it is cleared for use.",
    why: "The page shows photographs only. No video or testimonial is cleared.",
  },
  "pages.about.pillars.1.body": {
    text: "Creating a global network and a physical hub where hairstylists, master barbers, makeup artists, fashion stylists, educators and brand leaders collaborate, share stories and grow together.",
    why: "Corrects \"masters barbers\" and removes stacked adjectives. The meaning of the 2026 wording is kept.",
  },
  "pages.about.pillars.2.body": {
    text: "Keeping the future of beauty, grooming and fashion inclusive, inventive and driven by technical excellence.",
    why: "Plainer wording with the same meaning (\"completely inclusive, boundary-pushing, hyper-innovative\").",
  },
};

/** Wording changed in this round, with what it said before (venue rule of 11 Nov 2026). */
const VENUE_RULE = "Venue wording rule (11 Nov 2026): keep the accurate Atlantic location, without suggesting HEBS activities take place on the beach.";
const REVISIONS: Record<string, { from: string; why: string }> = {
  "experience.items.5.body": { from: "A beachfront destination that turns a professional summit into a place to stay and enjoy.", why: VENUE_RULE },
  "destination.body": {
    from: "For the first time, the entire HEBS experience takes place at NJS Royale Beach Resort on the Atlantic Ocean beachfront in Lagos: education, competitions, exhibitions, networking and celebrations in one destination.",
    why: VENUE_RULE,
  },
  "pages.experience.more.exp-destination": { from: "For the first time, the whole summit takes place at one beachfront resort on the Atlantic, so the event is also a place to stay and enjoy.", why: VENUE_RULE },
  "pages.travel.venue": { from: "For the first time, the entire HEBS experience takes place at NJS Royale Beach Resort on the Atlantic beachfront in Lagos.", why: VENUE_RULE },
  "pages.about.next": { from: "In 2027, for the first time, the entire HEBS experience takes place at one destination: NJS Royale Beach Resort, on the Atlantic beachfront in Lagos.", why: VENUE_RULE },
};

/* ------------------------------------------------------------------ */
/* Layout wording                                                       */
/* ------------------------------------------------------------------ */

const CATEGORY_NAMES = COMPETITION_CATEGORIES.map((c) => c.name);
const FORM_WORDS = /^(Your name|Work email|Email|Company or brand|Country|Website|Phone number|Social media|Handles or links|Message|Topic|Choose one|General question|Attending|Competing|Business inquiries|What you would exhibit|What would you like|Contact form|Sponsorship inquiry|Exhibitor application|Sponsorship inquiries|Exhibitor applications|Tell (us|the HEBS team) about)|\(optional\)$|^I understand HEBS|^Send me/;
const FORM_DECISION = "Form contract and route (D1) and privacy notice (D13); the form stays closed until then";
const LAYOUT_NOTICE = /not open yet|opens soon|Nothing can be (sent|submitted)|No payment is requested|are published when|is not open/i;

function classifyLayout(s: LayoutString): Pick<SignoffItem, "category" | "approver" | "kind" | "dependsOn" | "replacedWhen"> {
  const base = { dependsOn: [] as string[], replacedWhen: [] as string[] };
  if (/Concept$|Photographed$|^CONCEPT/.test(s.text)) {
    return { ...base, category: "C", approver: "Veridion", kind: "Label or heading", dependsOn: ["Replace the homepage destination scenes, which use restricted media (NJS concept films, disputed pre-party photographs)"] };
  }
  if (FORM_WORDS.test(s.text)) return { ...base, category: "C", approver: "HEBS organisers", kind: "Form wording", dependsOn: [FORM_DECISION] };
  if (s.scope === "tickets" && (PAGES.tickets.willSupport as readonly string[]).includes(s.text)) {
    return { ...base, category: "C", approver: "HEBS organisers", kind: "Commitment", dependsOn: ["Ticket categories, prices and payment gateway; ticketing route (D1)"] };
  }
  if (LAYOUT_NOTICE.test(s.text) || NOTICE.test(s.text)) return { ...base, category: "A", approver: "Veridion", kind: "Status notice" };
  const rest = CATEGORY_NAMES.reduce((t, n) => t.split(n).join(" "), s.text);
  if (!/[A-Za-z]/.test(rest)) return { ...base, category: "A", approver: "Veridion", kind: "Fact" };
  if (/^©|^See |\? See |\?( \+)?$/.test(s.text)) return { ...base, category: "A", approver: "Veridion", kind: "Label or heading" };
  if (s.where === "alt") return { ...base, category: "A", approver: "Veridion", kind: "Image description" };
  if (s.where === "seo" || s.where === "social") return { ...base, category: "A", approver: "Veridion", kind: "Search and social" };
  if ((s.text.match(/[A-Za-z']+/g) ?? []).length <= 6) return { ...base, category: "A", approver: "Veridion", kind: "Label or heading" };
  if (/sponsor|exhibit|ticket|payment|price|prize|package|prospectus|registration|appl(y|ication)/i.test(s.text)) {
    return { ...base, category: "B", approver: "HEBS organisers", kind: "Copy" };
  }
  return { ...base, category: "B", approver: "Mrs. Shuler", kind: "Copy" };
}

/* ------------------------------------------------------------------ */
/* The register                                                         */
/* ------------------------------------------------------------------ */

/**
 * What each page is, for launch: information only; availability notices (what
 * opens later, with nothing for sale or submission); or forms and commercial
 * functions, which need their routes and terms (D1, D13) before they can work.
 */
export const PAGE_KIND: Record<PageId, "information" | "notices" | "forms"> = {
  home: "information", about: "information", experience: "information", travel: "information", gallery: "information",
  tickets: "notices", programme: "notices", speakers: "notices", competitions: "notices", education: "notices",
  sponsorship: "forms", exhibitors: "forms", contact: "forms",
};
export const PAGE_KIND_WORDS = {
  information: "Public information",
  notices: "Future availability notices",
  forms: "Forms or commercial functions",
} as const;

/** The smallest public launch the gate allows: the homepage and Tickets, which every priority-list button leads to. */
export const FIRST_LAUNCH: readonly PageId[] = ["home", "tickets"];
const NEXT: readonly PageId[] = ["speakers", "programme", "travel", "about", "experience", "gallery"];

function tierOf(pages: readonly PageId[], shared = false): Tier {
  if (shared || pages.some((p) => FIRST_LAUNCH.includes(p))) return 1;
  return pages.some((p) => NEXT.includes(p)) ? 2 : 3;
}

const SOURCE = {
  directive: "Written for the preview from the owner directive's own wording (HEBS LAGOS 2027.pdf)",
  home: "Homepage design approved by Mrs. Shuler on 7 Nov 2026; its wording is provisional until approved",
  about2026: "HEBS Lagos 2026 About page, as published on hebslagos.com",
  layout: "Wording in the page layout, as the page renders it",
  fact: "Owner directive; official confirmation outstanding",
} as const;

function sourceOf(key: string): string {
  if (/^pages\.about\.(history|pillars)/.test(key)) return SOURCE.about2026;
  if (key.startsWith("home.")) return SOURCE.home;
  return SOURCE.directive;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function blockOf(i: Pick<SignoffItem, "category" | "approver" | "pages" | "section">): string | undefined {
  if (i.category === "C") return undefined;
  const page = i.pages.length >= 13 ? "site" : i.pages[0];
  if (i.category === "A") return `routine-${page}`;
  return `${i.approver === "Mrs. Shuler" ? "owner" : "organisers"}-${page}${page === "home" ? `-${slug(i.section)}` : ""}`;
}

function finish(i: Omit<SignoffItem, "category" | "block">, category: Category): SignoffItem {
  const out: SignoffItem = { ...i, category };
  out.block = blockOf(out);
  return out;
}

function copyItem(key: string, text: string, status: PublicationStatus, decisions: readonly SignoffDecision[]): SignoffItem {
  const { pages, section } = place(key);
  const c = classify(key, text);
  const waits = /\.title$/.test(key) ? [] : DEPENDS.filter(([re]) => re.test(key)).map(([, d]) => d);
  const notice = c.kind === "Status notice";
  const dependsOn = notice ? [] : waits;
  const kind: SignoffItem["kind"] = c.kind === "Label or button" ? "Label or heading" : c.kind;
  return finish({
    id: key, approver: c.approver, kind, text, pages, section, status, dependsOn, replacedWhen: notice ? waits : [],
    tier: tierOf(pages),
    source: sourceOf(key),
    proposed: PROPOSALS[key],
    revised: REVISIONS[key],
    recorded: latestDecision(key, decisions),
    recordIn: "decision",
  }, dependsOn.length > 0 ? "C" : c.approver === "Veridion" ? "A" : "B");
}

function layoutItem(s: LayoutString, decisions: readonly SignoffDecision[]): SignoffItem {
  const c = classifyLayout(s);
  const pages = s.scope === "site" ? SITE_PAGES.map((p) => p.id) : [s.scope];
  return finish({
    id: s.key, approver: c.approver, kind: c.kind, text: s.text, pages,
    section: s.scope === "site" ? "Navigation, footer and shared elements" : s.where === "seo" ? "Search and social preview" : s.where === "alt" ? "Image descriptions and labels" : "Page layout",
    status: layoutStatus(s, decisions), dependsOn: c.dependsOn, replacedWhen: c.replacedWhen,
    tier: tierOf(pages, s.scope === "site"), source: SOURCE.layout,
    recorded: latestDecision(s.key, decisions), recordIn: "decision",
  }, c.category);
}

/** Wording written as `approved` (directive headlines) is not listed; everything else is, approved by sign-off or not. */
function writtenStatus(key: string): PublicationStatus {
  const node = key.split(".").reduce<unknown>((n, k) => (n as Record<string, unknown>)?.[k], { ...COPY, pages: PAGES });
  return (node as { status: PublicationStatus }).status;
}

export function signoffItems(decisions: readonly SignoffDecision[] = SIGNOFF_DECISIONS): SignoffItem[] {
  const copy = contentRegister(undefined, "", decisions)
    .filter((e) => !OFF_SITE.test(e.key) && writtenStatus(e.key) !== "approved")
    .map((e) => copyItem(e.key, e.text, e.status, decisions));

  const home = homeCopyBlocks().filter((b) => !b.directive).map((b) =>
    copyItem(b.key, b.text, wordingApproved(b.key, b.text, decisions) ? "approved" : "provisional", decisions));

  const layout = LAYOUT_COPY.map((s) => layoutItem(s, decisions));

  const fact = (id: string, text: string, status: PublicationStatus, pages: PageId[], section: string, approver: Approver, dependsOn: string[], recordIn: string): SignoffItem =>
    finish({ id, tier: 1, approver, kind: "Fact", text, pages, section, status, dependsOn, replacedWhen: [], source: SOURCE.fact, recordIn, recorded: latestDecision(id, decisions) }, "C");
  const facts: SignoffItem[] = [
    fact("fact.venue-name", VENUE.name.value, VENUE.name.status, ALL_PAGES, "Dates-and-venue line, hero and footer", "Mrs. Shuler",
      ["Official venue name (D9)"], "VENUE.name in lib/editions/2027.ts"),
    fact("fact.mark-2027", "The HEBS mark in the header and footer, until the official 2027 mark is confirmed", findAsset("hebs-logo-nav").status, ALL_PAGES,
      "Header, footer and social card", "Mrs. Shuler", ["Official 2027 mark (D3)"], "hebs-logo-nav in lib/assets/register.ts"),
    ...EDITION_DAYS.map((d, i) => fact(`fact.hours.${d.isoDate}`, `${d.weekday}, ${d.shortDate}: ${d.title}. Opening hours not set.`, d.hours.status,
      ["home", "experience", "programme"], "Three days", "HEBS organisers", ["2027 opening hours for each day"], `EDITION_DAYS[${i}].hours in lib/editions/2027.ts`)),
  ];

  const order = { C: 2, A: 0, B: 1 };
  return [...facts, ...home, ...copy, ...layout].sort((a, b) => order[a.category] - order[b.category] || a.tier - b.tier);
}

/* ------------------------------------------------------------------ */
/* Approval blocks: the executive content package                       */
/* ------------------------------------------------------------------ */

export interface ApprovalBlock {
  /** Recorded as "block:<id>". */
  id: string;
  category: Exclude<Category, "C">;
  approver: Approver;
  title: string;
  tier: Tier;
  items: SignoffItem[];
  /** The exact wording of every item, as a decision on the block records it. */
  texts: Record<string, string>;
}

const PAGE_WORDS = (id: string) => (id === "site" ? "Every page" : PAGE_TITLE[id as PageId]);

/** The open items of categories A and B, in blocks that can each be approved in one decision. */
export function approvalBlocks(items: readonly SignoffItem[] = signoffItems()): ApprovalBlock[] {
  const map = new Map<string, ApprovalBlock>();
  for (const i of items) {
    if (!i.block || i.status === "approved") continue;
    const [, page] = /^(?:routine|owner|organisers)-([a-z]+)/.exec(i.block) ?? [];
    const b = map.get(i.block) ?? {
      id: i.block, category: i.category as "A" | "B", approver: i.approver, tier: i.tier, items: [], texts: {},
      title: i.category === "A" ? `${PAGE_WORDS(page)}: routine wording` : page === "home" ? `Homepage: ${i.section}` : `${PAGE_WORDS(page)}${i.approver === "HEBS organisers" ? ": commercial terms" : ""}`,
    };
    b.items.push(i);
    b.texts[i.id] = i.text;
    b.tier = Math.min(b.tier, i.tier) as Tier;
    map.set(i.block, b);
  }
  return Array.from(map.values()).sort((a, b) => a.category.localeCompare(b.category) || a.tier - b.tier);
}

/** A short fingerprint of a block's wording, so a decision can be checked against the package it was made on. */
export function blockFingerprint(texts: Record<string, string>): string {
  let h = 0x811c9dc5;
  for (const [k, v] of Object.entries(texts).sort(([a], [b]) => a.localeCompare(b))) {
    for (const ch of `${k}=${v};`) h = Math.imul(h ^ ch.charCodeAt(0), 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

/** The outstanding decisions that category C waits on, each with the items it clears. */
export function pendingDecisions(items: readonly SignoffItem[] = signoffItems()): { decision: string; approver: Approver; items: SignoffItem[] }[] {
  const map = new Map<string, { decision: string; approver: Approver; items: SignoffItem[] }>();
  for (const i of items) {
    if (i.category !== "C" || i.status === "approved") continue;
    const d = i.dependsOn[0] ?? "Outstanding decision";
    const e = map.get(d) ?? { decision: d, approver: i.approver, items: [] };
    e.items.push(i);
    map.set(d, e);
  }
  const facts = (d: { items: SignoffItem[] }) => (d.items.some((i) => i.kind === "Fact" && i.pages.length >= 13) ? 0 : 1);
  return Array.from(map.values()).sort((a, b) => facts(a) - facts(b)
    || Math.min(...a.items.map((i) => i.tier)) - Math.min(...b.items.map((i) => i.tier)) || b.items.length - a.items.length);
}

/* ------------------------------------------------------------------ */
/* Media records                                                        */
/* ------------------------------------------------------------------ */

export interface MediaRecord {
  id: ReviewCollection;
  title: string;
  count: number;
  pages: PageId[];
  state: "Approved by the event owner" | "Restricted";
  /** The approval, or the evidence for the restriction. */
  basis: string;
  /** Third-party paperwork to file, which does not hold the media back. */
  followUp?: string;
}

const MEDIA_TITLE: Record<ReviewCollection, string> = {
  "house-of-snapp": "House of Snapp photographs, HEBS Lagos 2026 summit days",
  "vmm-summit": "VMM film of the 2026 styling floor",
  "vmm-preparty": "VMM photographs of the 2026 Welcome Pre-Party (DSC00261–00353)",
  "vmm-oct22": "VMM photographs of the 22 Oct 2026 gathering",
  "njs-concept": "NJS concept films of the pool terrace and guests",
  "brand-mark": "Provisional 2027 mark",
};

export function mediaRecords(): MediaRecord[] {
  return (Object.keys(MEDIA_TITLE) as ReviewCollection[]).filter((c) => c !== "brand-mark").map((id) => {
    const assets = REVIEW_ASSETS.filter((a) => a.collection === id);
    const ids = assets.map((a) => a.id);
    const pages = (Object.entries(REVIEW_MEDIA_BY_PAGE) as [PageId, readonly string[]][])
      .filter(([, used]) => used.some((u) => ids.includes(u))).map(([p]) => p);
    const restricted = Array.from(new Set(assets.map((a) => a.restricted).filter(Boolean))).join(" ") || undefined;
    const followUp = assets.find((a) => a.followUp)?.followUp;
    return restricted
      ? { id, title: MEDIA_TITLE[id], count: assets.length, pages, state: "Restricted" as const, basis: restricted }
      : { id, title: MEDIA_TITLE[id], count: assets.length, pages, state: "Approved by the event owner" as const,
          basis: `${OWNER_MEDIA_APPROVAL.by}, ${OWNER_MEDIA_APPROVAL.date}.`, followUp };
  }).filter((r) => r.count > 0);
}

/* ------------------------------------------------------------------ */
/* Summary                                                              */
/* ------------------------------------------------------------------ */

export interface LaunchDecision {
  decision: string;
  who: string;
  why: string;
}

/** What still stands between today and the smallest public launch (FIRST_LAUNCH), most far-reaching first. */
export function firstLaunchDecisions(items: readonly SignoffItem[] = signoffItems()): LaunchDecision[] {
  const blocks = approvalBlocks(items).filter((b) => b.tier === 1);
  const out: LaunchDecision[] = [];
  if ((VENUE.name.status as PublicationStatus) !== "approved") out.push({ decision: "Official venue name (D9)", who: "Mrs. Shuler, with NJS", why: "Shown on every page." });
  if (findAsset("hebs-logo-nav").status !== "approved") out.push({ decision: "The 2027 mark (D3)", who: "Mrs. Shuler", why: "In the header and footer of every page." });
  if (LAUNCH_2027.origin.status !== "approved") out.push({ decision: "The public web address (D7)", who: "Mrs. Shuler", why: "Canonical links, the sitemap and the social card use it." });
  const owner = blocks.filter((b) => b.category === "B");
  if (owner.length) out.push({ decision: `Homepage and Tickets wording: ${owner.length} blocks in the executive content package`, who: "Mrs. Shuler", why: "Editorial and commercial statements on the two launch pages." });
  const routine = blocks.filter((b) => b.category === "A");
  if (routine.length) out.push({ decision: `Routine wording on the launch pages: ${routine.reduce((n, b) => n + b.items.length, 0)} items in ${routine.length} blocks`, who: "Veridion", why: "Navigation, headings, buttons, notices and descriptions, verified page by page." });
  out.push({ decision: "Homepage destination scenes and pre-party positions", who: "Veridion, then Mrs. Shuler to confirm", why: "They use restricted media (disputed pre-party photographs, NJS concept films). Replace them with owner-approved House of Snapp photographs." });
  out.push({ decision: "Move the owner-approved media into the published assets", who: "Veridion", why: "A technical step: production never serves the private review folder." });
  if (!LAUNCH_2027.authorisation) out.push({ decision: "Written launch authorisation", who: "Mrs. Shuler", why: "The final switch, recorded in lib/launch-2027-config.ts." });
  return out;
}

export interface SignoffCounts {
  total: number;
  open: number;
  byCategory: Record<Category, number>;
  byApprover: Record<Approver, number>;
  byTier: Record<Tier, number>;
  blocks: { A: number; B: number; owner: number; organisers: number };
  pendingDecisions: number;
}

export function signoffCounts(items: readonly SignoffItem[] = signoffItems()): SignoffCounts {
  const open = items.filter((i) => i.status !== "approved");
  const tally = <K extends string>(keys: readonly K[], f: (i: SignoffItem) => K) =>
    Object.fromEntries(keys.map((k) => [k, open.filter((i) => f(i) === k).length])) as Record<K, number>;
  const blocks = approvalBlocks(items);
  return {
    total: items.length,
    open: open.length,
    byCategory: tally(["A", "B", "C"] as const, (i) => i.category),
    byApprover: tally(["Veridion", "Mrs. Shuler", "HEBS organisers"] as const, (i) => i.approver),
    byTier: { 1: open.filter((i) => i.tier === 1).length, 2: open.filter((i) => i.tier === 2).length, 3: open.filter((i) => i.tier === 3).length },
    blocks: {
      A: blocks.filter((b) => b.category === "A").length,
      B: blocks.filter((b) => b.category === "B").length,
      owner: blocks.filter((b) => b.category === "B" && b.approver === "Mrs. Shuler").length,
      organisers: blocks.filter((b) => b.category === "B" && b.approver === "HEBS organisers").length,
    },
    pendingDecisions: pendingDecisions(items).length,
  };
}

export const TIER_WORDS: Record<Tier, string> = { 1: "the first launch", 2: "the next pages", 3: "later pages" };

/** The 13 pages' titles. */
export const PAGE_TITLE = Object.fromEntries(SITE_PAGES.map((p) => [p.id, p.title])) as Record<PageId, string>;

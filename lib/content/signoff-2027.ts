/**
 * The HEBS Lagos 2027 content sign-off register: every piece of wording and
 * every fact the 13 pages show that is not approved yet, sorted by who can
 * approve it, how soon it is needed, and what it waits for.
 *
 * Derived from the content itself (lib/content/2027.ts, 2027-pages.ts,
 * home-2027.ts) and the facts the launch gate reads, so it cannot fall out of
 * date. Decisions are recorded in lib/content/signoff-decisions-2027.ts; the
 * review page /2027/review (previews only) shows this register and drafts them.
 *
 * Five groups, not equally urgent:
 *   shared      - facts every page shows: the venue name, the 2027 mark, day hours
 *   factual     - wording Veridion can check against a source: facts from the
 *                 directive or the 2026 site, status notices ("published once
 *                 approved"), captions, labels and buttons
 *   organiser   - the summit's own voice and claims, for Mrs. Shuler
 *   commercial  - offers, registration and money, needing business decisions
 *   media       - photograph and film publication records (no re-review: the
 *                 House of Snapp approval stands; the written terms are outstanding)
 */
import { COPY, contentRegister } from "./2027";
import { PAGES } from "./2027-pages";
import { homeCopyBlocks } from "./home-2027";
import { SIGNOFF_DECISIONS, latestDecision, wordingApproved, type SignoffDecision } from "./signoff-decisions-2027";
import { EDITION_DAYS, VENUE } from "../editions/2027";
import { findAsset } from "../assets/register";
import { REVIEW_ASSETS, SNAPP_APPROVAL, type ReviewCollection } from "../assets/home-2027-review";
import { REVIEW_MEDIA_BY_PAGE } from "../launch-2027";
import { LAUNCH_2027 } from "../launch-2027-config";
import { SITE_PAGES, type PageId } from "../site/2027";
import type { PublicationStatus } from "../publication";

export type SignoffGroup = "shared" | "factual" | "organiser" | "commercial" | "media";
export type Approver = "Veridion" | "Mrs. Shuler" | "HEBS organisers";
/** 1: needed for the first public launch; 2: the next pages; 3: pages with outside dependencies. */
export type Tier = 1 | 2 | 3;

export const GROUPS: Record<SignoffGroup, { title: string; summary: string }> = {
  shared: {
    title: "Shared across pages",
    summary: "Facts every page shows. One decision clears the item on every page at once, so these come first.",
  },
  factual: {
    title: "Factual content Veridion can verify",
    summary: "Facts taken from the directive or the 2026 site, status notices that say what is not open yet, captions, labels and buttons. Each can be checked against a source, so Veridion approves them without waiting for the organisers.",
  },
  organiser: {
    title: "Organiser wording for Mrs. Shuler",
    summary: "The summit's own voice: what HEBS is, what the days hold, what visitors can expect. Only Mrs. Shuler can confirm these.",
  },
  commercial: {
    title: "Commercial and registration information",
    summary: "What is offered, sold or registered, and on what terms. Each waits on a business decision (routes D1, privacy D13, prize presentation D8, contacts D10, prospectus, packages).",
  },
  media: {
    title: "Media rights and photograph records",
    summary: "Where each set of photographs and film stands. Mrs. Shuler's approval of the House of Snapp photography is recorded and is not reopened; what remains is filing the written usage terms.",
  },
};

export interface SignoffItem {
  /** Register key; also the key a decision is recorded under. */
  id: string;
  group: Exclude<SignoffGroup, "media">;
  tier: Tier;
  approver: Approver;
  /** The wording as it stands. */
  text: string;
  /** Kind of wording, for the reviewer. */
  kind: "Fact" | "Status notice" | "Caption" | "Label or button" | "Copy";
  pages: PageId[];
  /** Section of the page, in words. */
  section: string;
  status: PublicationStatus;
  /** Open decisions or facts this wording depends on. Empty = it can be decided now. */
  dependsOn: string[];
  /**
   * For a status notice: the decisions that will replace it with real details. The
   * notice itself is true until then, so it can be approved now.
   */
  replacedWhen: string[];
  /** A suggested correction, where one is needed. */
  proposed?: { text: string; why: string };
  /** Wording already changed in this round, with the earlier text. */
  revised?: { from: string; why: string };
  /** The standing recorded decision, if any. */
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
  [/^seo\.home/, ["home"], "Search and social preview"],
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

type Rule = [RegExp, Pick<SignoffItem, "group" | "approver" | "kind">];
const COMMERCIAL: SignoffItem["approver"] = "HEBS organisers";
const rule = (group: SignoffItem["group"], approver: Approver, kind: SignoffItem["kind"]) => ({ group, approver, kind });

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

function classify(key: string, text: string): Pick<SignoffItem, "group" | "approver" | "kind"> {
  for (const [re, r] of KEY_RULES) if (re.test(key)) return r;
  if (NOTICE.test(text)) return rule("factual", "Veridion", "Status notice");
  return rule("organiser", "Mrs. Shuler", "Copy");
}

const DEPENDS: [RegExp, string][] = [
  [/^pages\.tickets|^priorityList/, "Ticket categories, prices and payment gateway; registration route (D1) and privacy notice (D13)"],
  [/^pages\.sponsorship|^partners|^home\.sponsors\.offers/, "Approved 2027 prospectus and packages; inquiry route (D1); public contacts (D10)"],
  [/^pages\.exhibitors/, "Exhibitor application route (D1); confirmed participating brands"],
  [/^pages\.competitions\.(eligibility|rules|apply|awards)/, "2027 rules, eligibility, fees, schedule and deadline; prize presentation (D8); application route (D1)"],
  [/^pages\.travel\.(directions|airport|support)|^pages\.travel\.faqs\.[34]/, "Venue address and transport (D9); visitor support contacts (D10)"],
  [/^pages\.travel\.(accommodation|faqs\.2)/, "Approved accommodation packages with NJS"],
  [/^pages\.contact/, "Public contacts and social accounts (D10); contact route (D1)"],
  [/^pages\.education\.(registration|educators)/, "Confirmed educators and sessions; registration route (D1)"],
  [/^pages\.speakers/, "At least one officially confirmed speaker or educator"],
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
/* The register                                                         */
/* ------------------------------------------------------------------ */

/** The pages of the recommended first public launch: the two the gate requires, and two with no review media. */
export const FIRST_LAUNCH: readonly PageId[] = ["home", "tickets", "contact", "speakers"];
const NEXT: readonly PageId[] = ["travel", "about", "experience", "programme"];

function tierOf(pages: readonly PageId[], group: SignoffItem["group"]): Tier {
  if (group === "shared" || pages.some((p) => FIRST_LAUNCH.includes(p))) return 1;
  return pages.some((p) => NEXT.includes(p)) ? 2 : 3;
}

function copyItem(key: string, text: string, status: PublicationStatus, decisions: readonly SignoffDecision[]): SignoffItem {
  const { pages, section } = place(key);
  const c = classify(key, text);
  const waits = /\.title$/.test(key) ? [] : DEPENDS.filter(([re]) => re.test(key)).map(([, d]) => d);
  const notice = c.kind === "Status notice";
  const dependsOn = [...(/NJS Royale Beach Resort/.test(text) ? ["Official venue name (D9)"] : []), ...(notice ? [] : waits)];
  return {
    id: key, ...c, text, pages, section, status, dependsOn, replacedWhen: notice ? waits : [],
    tier: tierOf(pages, c.group),
    proposed: PROPOSALS[key],
    revised: REVISIONS[key],
    recorded: latestDecision(key, decisions),
    recordIn: "decision",
  };
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

  const fact = (id: string, text: string, status: PublicationStatus, pages: PageId[], section: string, approver: Approver, dependsOn: string[], recordIn: string): SignoffItem => ({
    id, group: "shared", tier: 1, approver, kind: "Fact", text, pages, section, status, dependsOn, replacedWhen: [], recordIn,
    recorded: latestDecision(id, decisions),
  });
  const facts: SignoffItem[] = [
    fact("fact.venue-name", VENUE.name.value, VENUE.name.status, ALL_PAGES, "Dates-and-venue line, hero and footer", "Mrs. Shuler",
      ["Official venue name (D9)"], "VENUE.name in lib/editions/2027.ts"),
    fact("fact.mark-2027", "The HEBS mark in the header and footer, until the official 2027 mark is confirmed", findAsset("hebs-logo-nav").status, ALL_PAGES,
      "Header, footer and social card", "Mrs. Shuler", ["Official 2027 mark (D3)"], "hebs-logo-nav in lib/assets/register.ts"),
    ...EDITION_DAYS.map((d, i) => fact(`fact.hours.${d.isoDate}`, `${d.weekday}, ${d.shortDate}: ${d.title}. Opening hours not set.`, d.hours.status,
      ["home", "experience", "programme"], "Three days", "HEBS organisers", ["2027 opening hours for this day"], `EDITION_DAYS[${i}].hours in lib/editions/2027.ts`)),
  ];

  const order = { shared: 0, factual: 1, organiser: 2, commercial: 3 };
  return [...facts, ...home, ...copy].sort((a, b) => order[a.group] - order[b.group] || a.tier - b.tier);
}

/* ------------------------------------------------------------------ */
/* Media records                                                        */
/* ------------------------------------------------------------------ */

export interface MediaRecord {
  id: ReviewCollection;
  title: string;
  count: number;
  pages: PageId[];
  state: "Approved; written terms outstanding" | "Permission needed" | "Excluded from publication" | "Recorded under the 2027 mark";
  /** What has been decided already. */
  settled: string;
  /** What is still needed, and from whom. */
  outstanding: string;
  approver: Approver;
  tier: Tier;
}

const MEDIA_TEXT: Record<Exclude<ReviewCollection, "brand-mark">, Omit<MediaRecord, "id" | "count" | "pages" | "tier">> = {
  "house-of-snapp": {
    title: "House of Snapp photographs, HEBS Lagos 2026 summit days",
    state: "Approved; written terms outstanding",
    settled: SNAPP_APPROVAL,
    outstanding: "File the photographer's written usage terms. Then the photographs move into the rights-gated register and stop counting as review media. Competition names, placings and prize amounts stay unpublished until the organisers verify them (D8).",
    approver: "Mrs. Shuler",
  },
  "vmm-summit": {
    title: "VMM film of the 2026 styling floor (homepage hero loop)",
    state: "Permission needed",
    settled: "Chosen with no sponsor logos in shot.",
    outstanding: "VMM's written permission and the consent of everyone recognisable. Without them, the homepage hero needs a House of Snapp photograph instead.",
    approver: "HEBS organisers",
  },
  "vmm-preparty": {
    title: "VMM photographs of the 2026 Welcome Pre-Party (DSC00261–00353)",
    state: "Excluded from publication",
    settled: "Ownership is disputed; kept out of public publication.",
    outstanding: "Nothing for launch. The homepage positions that use them need House of Snapp photographs or typographic panels before the homepage can launch.",
    approver: "HEBS organisers",
  },
  "vmm-oct22": {
    title: "VMM photographs of the 22 Oct 2026 gathering",
    state: "Excluded from publication",
    settled: "Not confirmed as an official HEBS activity; never described as NJS.",
    outstanding: "Nothing for launch. Replace wherever used.",
    approver: "HEBS organisers",
  },
  "njs-concept": {
    title: "NJS concept films of the pool terrace and guests",
    state: "Excluded from publication",
    settled: "Concept visuals, one marked AI-generated; the guests film is kept out of public publication.",
    outstanding: "Nothing for launch. Use only with NJS's permission and confirmation of the finished design, always labelled as a concept.",
    approver: "HEBS organisers",
  },
};

export function mediaRecords(): MediaRecord[] {
  return (Object.keys(MEDIA_TEXT) as (keyof typeof MEDIA_TEXT)[]).map((id) => {
    const ids = REVIEW_ASSETS.filter((a) => a.collection === id).map((a) => a.id);
    const pages = (Object.entries(REVIEW_MEDIA_BY_PAGE) as [PageId, readonly string[]][])
      .filter(([, used]) => used.some((u) => ids.includes(u))).map(([p]) => p);
    const t = MEDIA_TEXT[id];
    return { id, ...t, count: ids.length, pages, tier: t.state === "Excluded from publication" ? 3 : tierOf(pages, "factual") };
  }).filter((r) => r.count > 0);
}

/* ------------------------------------------------------------------ */
/* Summary                                                              */
/* ------------------------------------------------------------------ */

export interface LaunchDecision {
  decision: string;
  who: Approver | "Mrs. Shuler and NJS" | "Mrs. Shuler (written)";
  why: string;
}

/** What has to be decided before the first public launch, in the order it unblocks the most. */
export function firstLaunchDecisions(items: readonly SignoffItem[] = signoffItems()): LaunchDecision[] {
  const open = (pred: (i: SignoffItem) => boolean) => items.filter((i) => i.status !== "approved" && i.tier === 1 && pred(i)).length;
  const out: LaunchDecision[] = [];
  if ((VENUE.name.status as PublicationStatus) !== "approved") out.push({ decision: "Official venue name (D9)", who: "Mrs. Shuler and NJS", why: "Shown on every page; no page can launch without it." });
  if (findAsset("hebs-logo-nav").status !== "approved") out.push({ decision: "The 2027 mark (D3)", who: "Mrs. Shuler", why: "In the header and footer of every page." });
  if (LAUNCH_2027.origin.status !== "approved") out.push({ decision: "The public web address (D7)", who: "Mrs. Shuler", why: "Canonical links, the sitemap and the social card depend on it." });
  out.push({ decision: `Homepage wording (${open((i) => i.pages.includes("home") && i.approver === "Mrs. Shuler")} items for Mrs. Shuler)`, who: "Mrs. Shuler", why: "The gate requires the homepage in every launch." });
  out.push({ decision: "House of Snapp written usage terms", who: "Mrs. Shuler", why: "The homepage relies on review photographs until the terms are filed." });
  out.push({ decision: "Homepage film and pre-party positions", who: "HEBS organisers", why: "The VMM hero film needs VMM's permission; pre-party and concept media are excluded, so those positions need House of Snapp photographs." });
  if (!LAUNCH_2027.authorisation) out.push({ decision: "Written launch authorisation", who: "Mrs. Shuler (written)", why: "The final switch, recorded in lib/launch-2027-config.ts." });
  return out;
}

export interface SignoffCounts {
  total: number;
  open: number;
  byApprover: Record<Approver, number>;
  byGroup: Record<Exclude<SignoffGroup, "media">, number>;
  byTier: Record<Tier, number>;
  /** Open items that wait on no outstanding decision: they can be signed off now. */
  decidableNow: number;
}

export function signoffCounts(items: readonly SignoffItem[] = signoffItems()): SignoffCounts {
  const open = items.filter((i) => i.status !== "approved");
  const tally = <K extends string>(keys: readonly K[], f: (i: SignoffItem) => K) =>
    Object.fromEntries(keys.map((k) => [k, open.filter((i) => f(i) === k).length])) as Record<K, number>;
  return {
    total: items.length,
    open: open.length,
    byApprover: tally(["Veridion", "Mrs. Shuler", "HEBS organisers"] as const, (i) => i.approver),
    byGroup: tally(["shared", "factual", "organiser", "commercial"] as const, (i) => i.group),
    byTier: { 1: open.filter((i) => i.tier === 1).length, 2: open.filter((i) => i.tier === 2).length, 3: open.filter((i) => i.tier === 3).length },
    decidableNow: open.filter((i) => i.dependsOn.length === 0).length,
  };
}

/** For the review page: the 13 pages' titles. */
export const PAGE_TITLE = Object.fromEntries(SITE_PAGES.map((p) => [p.id, p.title])) as Record<PageId, string>;

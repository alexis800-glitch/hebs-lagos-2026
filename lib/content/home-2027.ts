/**
 * Copy for the preferred HEBS Lagos 2027 homepage design (owner approval of
 * 2026-11-07). The structure and headlines follow Mrs. Shuler's directive.
 * Counts come from lib/competitions.ts so they cannot drift.
 *
 * Wording rule (owner, 2026-11-07): the page shows no beach imagery, and the
 * copy speaks of the resort, poolside and terrace. Accurate references to NJS
 * Royale Beach Resort and its Atlantic location stay.
 */

import { CATEGORIES, CATEGORY_COUNT, COMPETITION_COUNT } from "../competitions";
import type { PublicationStatus } from "../publication";
import { isDirectiveHeadline } from "./directive-headlines-2027";
import { SIGNOFF_DECISIONS, wordingApproved, type SignoffDecision } from "./signoff-decisions-2027";

export const HOME = {
  strip:
    "Internal concept, not for publication. All footage and photographs are real HEBS Lagos 2026 material from VMM and the House of Snapp collection, not yet cleared. The destination's pool and guest scenes are NJS concept visuals. The 2027 mark is provisional.",
  hero: {
    kicker: "HEBS Lagos 2027",
    lines: ["Bigger.", "Bolder."],
    accent: "Beyond Beauty.",
    sub: "Three extraordinary days of beauty, education, innovation, competition, networking, and unforgettable luxury resort experiences.",
    when: "July 23–25, 2027",
    where: "NJS Royale Beach Resort, Lagos, Nigeria",
    live: "HEBS Lagos 2026, the styling floor",
    // The primary button is the site-wide priority-list call to action (PRIORITY_CTA in
    // lib/site/2027.ts): the directive's "Join the 2027 Priority List" only once the list is open.
    ctaSecondary: "Explore the experience",
  },
  /** The header links, as pages of the 2027 site map (lib/site/2027.ts). */
  nav: ["experience", "programme", "competitions", "education", "travel"],
  welcome: {
    label: "Welcome to HEBS 2027",
    title: "Where beauty, education",
    accent: "& opportunity meet.",
    body: "HEBS brings together the beauty industry's professionals, educators, innovators, entrepreneurs and emerging talent. For the first time, the whole experience takes place at one destination on the Atlantic: three days of learning, competition, business and celebration.",
  },
  numbers: {
    label: "HEBS Lagos 2027",
    title: "The summit,",
    accent: "in three numbers.",
    items: [
      { value: "3", label: "Days", media: "num-days", text: "July 23–25, 2027. An opening celebration, then two full summit days." },
      { value: String(COMPETITION_COUNT), label: "Competitions", media: "num-competitions", text: "Thirteen competitions, with categories and prizes the same as 2026." },
      { value: String(CATEGORY_COUNT), label: "Categories", media: "num-categories", text: `${CATEGORIES.map((c) => c.name).join(", ")}.` },
    ],
  },
  days: {
    title: "Three days, one",
    accent: "extraordinary destination.",
    body: "From an opening celebration at the resort to two full summit days of education, competitions and exhibitions.",
    items: [
      { date: "July 23", title: "The Welcome Pre-Party", text: "An exclusive opening celebration introducing guests to the HEBS 2027 experience.", media: "day-1" },
      { date: "July 24", title: "The Summit Begins", text: "Professional education, live demonstrations, beauty competitions, exhibitions and networking.", media: "day-2" },
      { date: "July 25", title: "The Experience Continues", text: "Industry engagement, competitions, learning opportunities and closing celebrations.", media: "day-3" },
    ],
    cta: "The programme",
  },
  experiences: {
    label: "The HEBS experience",
    title: "Six ways",
    accent: "to be part of it.",
    items: [
      { title: "Professional Beauty Education", text: "Masterclasses, demonstrations and technical training.", media: "exp-education" },
      { title: "Hair and Beauty Competitions", text: "Thirteen competitions across seven categories.", media: "exp-competitions" },
      { title: "Exhibitions and Brand Showcases", text: "The brands shaping the industry.", media: "exp-exhibitions" },
      { title: "International Networking", text: "Nigeria, Africa, the US, Europe and beyond.", media: "exp-networking-desktop", phoneMedia: "exp-networking-phone" },
      { title: "Entertainment and Celebrations", text: "Glamorous evenings at the resort.", media: "exp-entertainment" },
      { title: "Luxury Destination Experiences", text: "A resort setting for the whole summit.", media: "exp-destination" },
    ],
  },
  destination: {
    label: "The destination",
    title: "Beauty meets",
    accent: "paradise.",
    body: "NJS Royale Beach Resort in Lagos is the official home of HEBS Lagos 2027: golden evenings around an ocean-facing pool terrace, with the energy of the summit all around you.",
    cta: "Explore the destination",
    scenes: [
      { title: "Sunset by the pool", kind: "concept", seconds: 4.0, wide: "dest-guests-wide", tall: "dest-guests-tall",
        note: "Concept from NJS: illustrative guests at the second-floor pool. Not real attendees or the completed property." },
      { title: "The pool terrace", kind: "concept", seconds: 5.6, wide: "dest-pool-wide", tall: "dest-pool-tall",
        note: "Concept from the NJS website: the second-floor pool terrace. Not the completed property." },
      { title: "HEBS at NJS, 2026", kind: "photographed", seconds: 6.0, pair: ["dest-terrace", "dest-guest"],
        note: "HEBS Lagos 2026 pre-party guests on the NJS terrace, 23 Oct 2026. VMM." },
    ],
  },
  competitions: {
    label: "Competitions",
    title: "The next generation of",
    accent: "beauty champions.",
    body: "Thirteen competitions across seven categories. Categories and prizes remain the same as 2026.",
    ctaPrimary: "See the competitions",
    ctaSecondary: "Rules and eligibility",
    winners: {
      label: "Celebrating the 2026 winners",
      title: "Champions of",
      accent: "HEBS Lagos 2026.",
      note: "Each winner appears only once their approved photograph and verified details are in.",
    },
  },
  highlights: {
    label: "HEBS 2026 highlights",
    title: "Lagos, 2026.",
    accent: "The energy we carry forward.",
    credit: "Photographed at HEBS Lagos 2026",
    rows: [
      [["hl-guest-a", "w2"], ["hl-floor-a", "w3"], ["hl-performance", "w1"], ["hl-guest-b", "w2"], ["hl-hall", "w4"]],
      [["hl-trophy", "w1"], ["hl-floor-b", "w3"], ["hl-guest-c", "w2"], ["hl-speaker", "w1"], ["hl-floor-c", "w3"], ["hl-guest-d", "w2"]],
    ] as [string, string][][],
  },
  sponsors: {
    label: "Sponsors and exhibitors",
    title: "Position your brand at the center of",
    accent: "beauty innovation.",
    offers: ["Sponsorship", "Exhibition space", "Brand activations", "Strategic partnerships"],
    ctaPrimary: "Become a sponsor",
    ctaSecondary: "Exhibit at HEBS",
    caption: "The 2026 hall",
  },
  final: {
    label: "HEBS Lagos 2027",
    title: "Your next beauty experience",
    accent: "starts here.",
    when: "July 23–25, 2027  |  NJS Royale Beach Resort, Lagos, Nigeria",
    cta: "Be first to experience HEBS 2027",
  },
} as const;

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

/**
 * Fields of HOME that are not visitor-facing wording: media ids, layout, the
 * internal staging strip, figures derived from lib/competitions.ts, and the
 * destination scenes, which belong to concept and pre-party media that cannot be
 * published (their records are in lib/assets/home-2027-review.ts).
 */
const NOT_COPY = new Set(["strip", "media", "phoneMedia", "wide", "tall", "pair", "kind", "seconds", "nav", "rows", "scenes", "value"]);

export interface HomeCopyBlock {
  key: string;
  text: string;
  /** Part of a headline the directive quotes word for word, so approved as written. */
  directive: boolean;
}

/**
 * The full headline a homepage line belongs to: the hero's lines and accent, or a
 * section's title and accent, which the page sets in two styles.
 */
function headlineOf(path: string, parent: Record<string, unknown>): string | null {
  if (/^home\.hero\.(lines\.\d|accent)$/.test(path)) return [...HOME.hero.lines, HOME.hero.accent].join(" ");
  if (/\.(title|accent)$/.test(path) && typeof parent.title === "string" && typeof parent.accent === "string") return `${parent.title} ${parent.accent}`;
  return null;
}

/** Every piece of homepage wording, keyed "home.<path>" for sign-off (lib/content/signoff-2027.ts). */
export function homeCopyBlocks(node: unknown = HOME, path = "home", parent: Record<string, unknown> = {}): HomeCopyBlock[] {
  if (typeof node === "string") {
    const headline = headlineOf(path, parent);
    return [{ key: path, text: node, directive: isDirectiveHeadline(headline ?? node) }];
  }
  if (!node || typeof node !== "object") return [];
  const own = node as Record<string, unknown>;
  return Object.entries(own).flatMap(([k, v]) => (NOT_COPY.has(k) ? [] : homeCopyBlocks(v, `${path}.${k}`, Array.isArray(own) ? parent : own)));
}

/**
 * The approval state of the homepage copy, which carries no per-block states of
 * its own: approved once every piece of its wording is a directive headline or
 * has a recorded sign-off of exactly that wording. The launch gate (lib/launch-2027.ts) reads it.
 */
export function homeCopyStatus(decisions: readonly SignoffDecision[] = SIGNOFF_DECISIONS): PublicationStatus {
  return homeCopyBlocks().every((b) => b.directive || wordingApproved(b.key, b.text, decisions)) ? "approved" : "provisional";
}

export const HOME_COPY_STATUS: PublicationStatus = homeCopyStatus();

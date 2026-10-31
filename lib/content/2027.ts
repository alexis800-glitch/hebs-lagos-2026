/**
 * HEBS 2027 page content and traceability.
 *
 * Two deliverables, kept distinct (Phase 2A instruction 2):
 *   - ANNOUNCEMENT_ITEMS: the eight launch requirements of directive section 11
 *   - HOMEPAGE_SECTIONS: the ten homepage sections A-J of directive section 4
 *
 * Headlines quoted in the directive are `approved`. Body copy written for the
 * preview from the directive's own wording is `provisional` until the owner
 * signs it off. Nothing here states a fact the directive or the owner has not
 * supplied: no speakers, sponsors, prices, times, amenities or figures.
 */

import type { PublicationStatus } from "../publication";
import { EDITION_DAYS, VENUE } from "../editions/2027";
import { MEDIA_SLOTS, findAsset } from "../assets/register";

export interface CopyBlock {
  status: PublicationStatus;
  text: string;
}

const directive = (text: string): CopyBlock => ({ status: "approved", text });
const draft = (text: string): CopyBlock => ({ status: "provisional", text });

export type HomepageSectionId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";

export interface HomepageSection {
  id: HomepageSectionId;
  anchor: string;
  name: string;
  /** Phase in which the section is complete with approved content. */
  completesIn: "2A" | "2B" | "3" | "4" | "5";
  /** Structure is built in the Phase 2A preview. */
  structureBuilt: boolean;
  /** What still blocks the finished section. Empty = nothing. */
  dependencies: string[];
}

/** Directive section 4, A-J. Completion phase per the Phase 2A plan. */
export const HOMEPAGE_SECTIONS: HomepageSection[] = [
  { id: "A", anchor: "hero", name: "Main hero", completesIn: "2B", structureBuilt: true,
    dependencies: ["Approved resort hero media", "Official logo (D3)", "Venue confirmation (D9)", "Priority list live (D1, D13)"] },
  { id: "B", anchor: "welcome", name: "Welcome to HEBS 2027", completesIn: "2B", structureBuilt: true,
    dependencies: ["Owner approval of body copy"] },
  { id: "C", anchor: "three-days", name: "Three days, one extraordinary destination", completesIn: "4", structureBuilt: true,
    dependencies: ["Day photography", "Event Program page (Phase 4)"] },
  { id: "D", anchor: "experience", name: "The HEBS experience (six experiences)", completesIn: "4", structureBuilt: true,
    dependencies: ["One approved image per experience", "Destination pages each card links to (Phase 4)", "Owner approval of body copy"] },
  { id: "E", anchor: "destination", name: "The destination: Beauty meets paradise", completesIn: "2B", structureBuilt: true,
    dependencies: ["NJS-approved photography and promotional video", "Venue confirmation (D9)"] },
  { id: "F", anchor: "competitions", name: "Competitions", completesIn: "4", structureBuilt: true,
    dependencies: ["2027 rules, eligibility, fees, schedule and deadline approvals", "Prize currency presentation (D8)", "Application route (D1)"] },
  { id: "G", anchor: "education", name: "Education and masterclasses", completesIn: "4", structureBuilt: true,
    dependencies: ["Confirmed educators and sessions", "Education imagery"] },
  { id: "H", anchor: "partners", name: "Sponsors and exhibitors", completesIn: "3", structureBuilt: true,
    dependencies: ["Inquiry storage and administration (D1)", "Approved 2027 prospectus", "Public contacts (D10)"] },
  { id: "I", anchor: "highlights-2026", name: "HEBS 2026 highlights", completesIn: "5", structureBuilt: true,
    dependencies: ["Approved Lagos 2026 photos, video and testimonials", "2026 archive page (Phase 5)"] },
  { id: "J", anchor: "final-cta", name: "Final call to action", completesIn: "2B", structureBuilt: true,
    dependencies: ["Priority list live (D1, D13)"] },
];

export interface AnnouncementItem {
  requirement: string;
  where: string;
  state: "built" | "built-pending-content" | "gated";
  dependency: string;
}

/** Directive section 11: the eight launch items. */
export const ANNOUNCEMENT_ITEMS: AnnouncementItem[] = [
  { requirement: "Official 2027 campaign identity", where: "Hero", state: "built-pending-content", dependency: "Official logo (D3)" },
  { requirement: "July 23–25, 2027 dates", where: "Hero, three-day overview, final CTA", state: "built", dependency: "" },
  { requirement: "NJS Royale Beach Resort venue", where: "Hero, destination", state: "built-pending-content", dependency: "Venue confirmation (D9)" },
  { requirement: "Three-day event overview", where: "Three-day overview", state: "built", dependency: "" },
  { requirement: "Luxury promotional imagery", where: "Hero, destination", state: "built-pending-content", dependency: "Approved NJS and campaign media" },
  { requirement: "Working priority registration form", where: "Priority list", state: "gated", dependency: "Storage and administration (D1), privacy terms (D13)" },
  { requirement: "QR code for immediate access", where: "QR block", state: "gated", dependency: "Final landing URL and publication date (D7)" },
  { requirement: "Sponsor/exhibitor inquiry option", where: "Partners", state: "gated", dependency: "Inquiry storage (D1), public contacts (D10)" },
  // "Mobile-friendly presentation" is verified by the responsive checks, not rendered.
];

export const COPY = {
  welcome: {
    headline: directive("WHERE BEAUTY, EDUCATION & OPPORTUNITY MEET."),
    body: draft(
      "HEBS brings together the beauty industry's professionals, educators, innovators, entrepreneurs and emerging talents. For three days in Lagos, the summit is built around education, professional development, excellence, collaboration and opportunity.",
    ),
  },
  experience: {
    headline: draft("THE HEBS EXPERIENCE"),
    items: [
      { slot: "exp-education", title: "Professional Beauty Education", body: draft("Hair education, technical training and live demonstrations led by working professionals.") },
      { slot: "exp-competitions", title: "Hair and Beauty Competitions", body: draft("Competitions that recognise talent, creativity and technical excellence across every category.") },
      { slot: "exp-exhibitions", title: "Exhibitions and Brand Showcases", body: draft("Brands and businesses presenting products, tools and services to the professionals who use them.") },
      { slot: "exp-networking", title: "International Networking", body: draft("Built to bring together beauty professionals from Nigeria, across Africa, the United States, Europe and beyond.") },
      { slot: "exp-entertainment", title: "Entertainment and Celebrations", body: draft("An opening celebration, live moments on stage and closing celebrations across the three days.") },
      { slot: "exp-destination", title: "Luxury Destination Experiences", body: draft("A beachfront destination that turns a professional summit into a place to stay and enjoy.") },
    ],
  },
  destination: {
    headline: directive("BEAUTY MEETS PARADISE."),
    body: draft(
      "For the first time, the entire HEBS experience takes place at NJS Royale Beach Resort on the Atlantic Ocean beachfront in Lagos: education, competitions, exhibitions, networking and celebrations in one destination.",
    ),
    restriction: "Rooms, packages, availability and amenities are published only once approved.",
  },
  competitions: {
    headline: directive("THE NEXT GENERATION OF BEAUTY CHAMPIONS."),
    body: draft(
      "HEBS competitions recognise talent, creativity and professional excellence. The 2027 competition categories and prize values remain the same as 2026.",
    ),
    pending: "2027 rules, eligibility, schedule, entry fees and application dates will be published once approved.",
  },
  education: {
    headline: draft("EDUCATION & MASTERCLASSES"),
    body: draft(
      "Professional education is one of HEBS's strongest foundations. Speakers and instructors are announced as they are officially confirmed.",
    ),
    tracks: ["Hair education", "Technical training", "Live demonstrations", "Beauty business development", "Professional masterclasses"],
  },
  partners: {
    headline: directive("POSITION YOUR BRAND AT THE CENTER OF BEAUTY INNOVATION."),
    body: draft(
      "Sponsorship, exhibition, brand activation and strategic partnership opportunities for businesses that want to reach the beauty industry in Lagos and beyond.",
    ),
    pathways: ["Sponsorship", "Exhibitions", "Brand activation", "Strategic partnerships"],
  },
  highlights: {
    headline: draft("HEBS LAGOS 2026 HIGHLIGHTS"),
    body: draft(
      "Photographs, videos, testimonials, competition highlights and major moments from HEBS Lagos 2026 will be added here once approved. The 2026 programme remains available in the archive.",
    ),
  },
  finalCta: {
    headline: directive("YOUR NEXT BEAUTY EXPERIENCE STARTS HERE."),
    button: directive("BE FIRST TO EXPERIENCE HEBS 2027"),
  },
  priorityList: {
    headline: directive("JOIN THE 2027 PRIORITY LIST"),
    gateNotice:
      "Preview only. The priority list is not collecting registrations yet. It opens once secure storage, administration and privacy terms are approved.",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Approval states the preview pages render                            */
/* ------------------------------------------------------------------ */

function copyStatuses(node: unknown): PublicationStatus[] {
  if (!node || typeof node !== "object") return [];
  if ("status" in node && "text" in node) return [(node as CopyBlock).status];
  return Object.values(node).flatMap(copyStatuses);
}

/**
 * Every approval state rendered by the 2027 pages, derived from the content
 * itself so it cannot fall out of date: all copy blocks, the venue name, the
 * day hours, the logo, every media slot, and the gated items (priority list,
 * QR, partner inquiries) that have no approved implementation yet.
 * app/2027/layout.tsx withholds the pages in production unless all are approved.
 */
export function previewStatuses(): PublicationStatus[] {
  return [
    ...copyStatuses(COPY),
    VENUE.name.status,
    ...EDITION_DAYS.map((d) => d.hours.status),
    findAsset("hebs-logo-nav").status,
    ...MEDIA_SLOTS.map((s) => (s.assetId ? findAsset(s.assetId).status : "awaiting-confirmation" as const)),
    ...ANNOUNCEMENT_ITEMS.map((i) => (i.state === "built" ? "approved" as const : "awaiting-confirmation" as const)),
  ];
}

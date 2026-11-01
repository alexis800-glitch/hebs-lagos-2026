/**
 * Every staging note on the Direction A pages, keyed to the section it
 * qualifies. Inline mode renders each beside its section; panel mode lists the
 * same notes after the page, so a clean screenshot never loses a safeguard.
 */
import { findSlot } from "@/lib/assets/register";
import { EDITION_DAYS } from "@/lib/editions/2027";
import { slotWords } from "./parts";
import type { BrandVariant } from "./tokens";

const reserved = (id: string) => `${findSlot(id).label} image reserved for ${slotWords(findSlot(id))}.`;
const COPY_DRAFT = "Body copy provisional, awaiting owner approval.";

export const EXPERIENCE_SLOTS = ["exp-education", "exp-competitions", "exp-exhibitions", "exp-networking", "exp-entertainment", "exp-destination"];

export function reviewNotes(brand: BrandVariant) {
  return {
    hero: [
      brand === "champagne"
        ? "The logo shown is a champagne-and-ivory colour study of the official HEBS mark, for internal comparison only (D3). The official mark itself is unchanged."
        : "Official HEBS mark shown as supplied; the 2027 logo treatment is open until confirmed (D3).",
      "Venue name provisional until confirmed (D9).",
      "Hero photography reserved for approved HEBS Lagos event and NJS Royale Beach Resort media; until then the hero is set in type only.",
    ],
    welcome: [COPY_DRAFT, reserved("welcome")],
    threeDays: [
      "No 2027 session times are approved; the horizon is one abstract panorama and implies no time of day.",
      "Each day links to the Event Programme page once it is built (Phase 4).",
      ...EDITION_DAYS.map((_, i) => reserved(`day-${i + 1}`)),
    ],
    experience: [
      COPY_DRAFT,
      "Each experience links to its own page once those pages are built (Phase 4).",
      "Experience images reserved: five for approved HEBS Lagos event photographs, the destination one for an approved NJS Royale Beach Resort photograph.",
    ],
    destination: [
      COPY_DRAFT,
      "Venue name provisional until confirmed (D9).",
      "Rooms, packages, availability and amenities are not shown until approved.",
      reserved("destination-gallery"),
      reserved("destination-video"),
    ],
    competitions: [
      COPY_DRAFT,
      "Categories are carried from 2026 as the directive states. 2027 rules, eligibility, fees, schedule and deadlines await approval.",
      "Prize amounts are not shown until the 2027 currency presentation is decided (D8).",
      "Each of the five items becomes a link when its Competitions page exists (Phase 4).",
    ],
    education: [COPY_DRAFT, "No speaker or educator is confirmed, so none is named.", reserved("education")],
    partners: [
      COPY_DRAFT,
      "No inquiry form is shown until storage and administration (D1) and public contacts (D10) are approved. The prospectus download appears with an approved 2027 prospectus.",
    ],
    highlights: [
      COPY_DRAFT,
      reserved("highlights-2026"),
      "The live 2026 website serves as the archive until the 2026 archive page is built (Phase 5).",
    ],
    priority: ["The form is inactive: every control is disabled and nothing can be sent until storage (D1) and privacy terms (D13) are approved."],
    qr: ["The QR code is generated only once the final page address and publication date are approved (D7), so no printed code points at a preview."],
    finalCta: [],
  };
}

export type ReviewNotes = ReturnType<typeof reviewNotes>;

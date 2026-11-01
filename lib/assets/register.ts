/**
 * HEBS 2027 asset approval register.
 *
 * Every image, video and brand file a 2027 page may use is listed here with
 * where it came from (event year, edition, location, provenance), its approval
 * state, the rights and consent behind it, and where it may be used. Every
 * media slot on a 2027 page names the kind of source it needs. Pages render a
 * slot only through `resolveSlot`, so:
 *
 *   - unapproved media never reaches a production page,
 *   - a beauty-event slot takes only HEBS Lagos event media, and a beachfront
 *     or resort slot takes only NJS Royale Beach Resort media (owner
 *     instruction of 2026-11-01),
 *   - photographs from the HEBS United States editions stay in the historical
 *     archive and can never fill a 2027 slot,
 *   - AI-generated or concept media can never fill a slot that depicts a real
 *     place, event or person (directive section 4A),
 *   - an empty slot renders a clearly labelled placeholder that names what it
 *     is waiting for, never stock or invented imagery.
 *
 * Changing an asset's status to "approved" is an owner decision: record who
 * approved it and when in `approval`, and record the rights in `rights`.
 */

import { isRenderable, type DeployEnvironment, type PublicationStatus } from "../publication";

export type Provenance =
  | "hebs-brand"
  | "hebs-event-photo"
  | "venue-supplied"
  | "ai-generated"
  | "concept-render"
  | "undocumented";

/** Which body of material an asset belongs to. Slots match on this. */
export type Origin =
  | "hebs-brand"
  | "hebs-lagos-event"
  | "hebs-us-edition"
  | "njs-resort"
  | "generated"
  | "unknown";

/** What an asset is allowed to stand for on the page. */
export type Depiction =
  | "brand"
  | "real-venue"
  | "real-event"
  | "decorative";

/** Where an asset may appear. */
export type Usage =
  | "2027-site"
  | "historical-archive"
  | "internal-review";

export interface AssetRights {
  /** Who owns the material. null = not recorded. */
  holder: string | null;
  /** Written permission to publish it on hebslagos.com is on file. */
  permission: "recorded" | "not-recorded";
  /** Where the permission is kept, once recorded. */
  evidence?: string;
  /** Consent of identifiable people shown. */
  peopleConsent: "obtained" | "not-obtained" | "unknown" | "not-applicable";
}

export interface AssetRecord {
  id: string;
  src: string;
  alt: string;
  /** Year the event took place or the media was made. null = not recorded. */
  eventYear: number | null;
  /** Edition or body of work, in words, e.g. "HEBS Lagos 2026". */
  edition: string | null;
  location: string | null;
  origin: Origin;
  provenance: Provenance;
  status: PublicationStatus;
  approval?: { by: string; date: string };
  rights: AssetRights;
  /** Which depictions this asset may be used for. Empty = none. */
  permittedDepictions: Depiction[];
  /** Where this asset may be used. Empty = nowhere. */
  permittedUsage: Usage[];
  restriction: string;
}

const NOT_RECORDED: AssetRights = { holder: null, permission: "not-recorded", peopleConsent: "unknown" };

export const ASSETS: AssetRecord[] = [
  {
    id: "hebs-logo-nav",
    src: "/assets/logos/hebs_logo_nav.png",
    alt: "HEBS, Hair Education Beauty Summit",
    eventYear: null,
    edition: "HEBS brand",
    location: null,
    origin: "hebs-brand",
    provenance: "hebs-brand",
    status: "provisional",
    rights: { holder: "HEBS", permission: "not-recorded", peopleConsent: "not-applicable" },
    permittedDepictions: ["brand"],
    permittedUsage: ["2027-site", "historical-archive"],
    restriction:
      "Official 2027 mark not yet confirmed (D3); its pink/purple palette differs from the 2027 black and champagne direction. Preview only.",
  },
  {
    id: "hero-video-higgsfield",
    src: "/videos/higgsfield/hebs-hero-competition-desktop-v1-optimized.mp4",
    alt: "",
    eventYear: null,
    edition: null,
    location: null,
    origin: "generated",
    provenance: "ai-generated",
    status: "provisional",
    rights: { ...NOT_RECORDED, peopleConsent: "not-applicable" },
    permittedDepictions: [],
    permittedUsage: [],
    restriction:
      "AI-generated (Higgsfield). Must never represent a real event, venue, attendee or resort facility.",
  },
  // HEBS United States editions. These photographs belong to the 2025 archive
  // page (/hebs-legacy/2025), where they stay. The owner has ruled them out of
  // the 2027 design (2026-11-01), so they carry no 2027 usage.
  {
    id: "archive-2025-us-winner-05",
    src: "/images/hebs-2025/winners/winner-05.png",
    alt: "HEBS 2025 competitor with sculpted natural hair in a black gown at the awards evening",
    eventYear: 2025,
    edition: "HEBS 2025",
    location: "New Jersey, USA",
    origin: "hebs-us-edition",
    provenance: "hebs-event-photo",
    status: "provisional",
    rights: { ...NOT_RECORDED, holder: "HEBS" },
    permittedDepictions: [],
    permittedUsage: ["historical-archive"],
    restriction: "US edition archive photograph. Historical archive only; never used in the 2027 design.",
  },
  {
    id: "archive-2025-us-crowd-01",
    src: "/images/hebs-2025/crowd/crowd-01.jpg",
    alt: "Avant-garde competition look on the HEBS 2025 stage",
    eventYear: 2025,
    edition: "HEBS 2025",
    location: "New Jersey, USA",
    origin: "hebs-us-edition",
    provenance: "hebs-event-photo",
    status: "provisional",
    rights: { ...NOT_RECORDED, holder: "HEBS" },
    permittedDepictions: [],
    permittedUsage: ["historical-archive"],
    restriction: "US edition archive photograph. Historical archive only; never used in the 2027 design.",
  },
  {
    id: "hebs-2026-trailer",
    src: "/videos/hebs-2026-official-event-trailer.mp4",
    alt: "HEBS Lagos 2026 official event trailer",
    eventYear: 2026,
    edition: "HEBS Lagos 2026 (pre-event promotion)",
    location: null,
    origin: "unknown",
    provenance: "undocumented",
    status: "awaiting-confirmation",
    rights: NOT_RECORDED,
    permittedDepictions: [],
    permittedUsage: [],
    restriction: "Pre-event promotional trailer; content and provenance to be confirmed for reuse.",
  },
];

/** The kind of source a slot needs. */
export type SlotSource = "hebs-lagos-event" | "njs-resort";

export interface MediaSlot {
  id: string;
  /** Plain-language label shown on the placeholder. */
  label: string;
  depiction: Depiction;
  /** The only origin that may fill this slot. */
  source: SlotSource;
  /** Asset assigned to this slot, once one is approved. */
  assetId: string | null;
  /** What has to happen before this slot can be filled. */
  dependency: string;
}

const NJS_MEDIA = "Approved NJS Royale Beach Resort photography or video, with written permission";
const HEBS_LAGOS_MEDIA = "Approved HEBS Lagos event photography or video, with rights and consent recorded";

const venue = (id: string, label: string): MediaSlot =>
  ({ id, label, depiction: "real-venue", source: "njs-resort", assetId: null, dependency: NJS_MEDIA });
const event = (id: string, label: string): MediaSlot =>
  ({ id, label, depiction: "real-event", source: "hebs-lagos-event", assetId: null, dependency: HEBS_LAGOS_MEDIA });

export const MEDIA_SLOTS: MediaSlot[] = [
  venue("hero", "Beachfront hero"),
  event("hero-beauty", "Hero beauty imagery"),
  event("welcome", "Welcome to HEBS 2027"),
  venue("day-1", "Welcome Pre-Party"),
  event("day-2", "Summit Day One"),
  event("day-3", "Summit Day Two"),
  event("exp-education", "Professional beauty education"),
  event("exp-competitions", "Hair and beauty competitions"),
  event("exp-exhibitions", "Exhibitions and brand showcases"),
  event("exp-networking", "International networking"),
  event("exp-entertainment", "Entertainment and celebrations"),
  venue("exp-destination", "Luxury destination experiences"),
  venue("destination-gallery", "Resort photo gallery"),
  venue("destination-video", "Resort promotional video"),
  event("education", "Education and masterclasses"),
  event("highlights-2026", "HEBS Lagos 2026 highlights"),
];

export type ResolvedSlot =
  | { kind: "asset"; asset: AssetRecord; slot: MediaSlot }
  | { kind: "placeholder"; slot: MediaSlot; reason: string };

export function findAsset(id: string): AssetRecord {
  const found = ASSETS.find((a) => a.id === id);
  if (!found) throw new Error(`[assets] unknown asset ${id}`);
  return found;
}

export function findSlot(id: string): MediaSlot {
  const found = MEDIA_SLOTS.find((s) => s.id === id);
  if (!found) throw new Error(`[assets] unknown media slot ${id}`);
  return found;
}

const isGenerated = (a: AssetRecord) =>
  a.origin === "generated" || a.provenance === "ai-generated" || a.provenance === "concept-render";

/** Whether `asset` may fill a slot showing `depiction` in `environment`. */
export function mayDepict(asset: AssetRecord, depiction: Depiction, environment: DeployEnvironment): boolean {
  if (!isRenderable(asset.status, environment)) return false;
  // Generated or concept media may never stand for a real place, event or person.
  if (isGenerated(asset) && (depiction === "real-venue" || depiction === "real-event")) return false;
  return asset.permittedDepictions.includes(depiction);
}

/** Why `asset` may not fill `slot` in `environment`, or null when it may. */
export function slotRefusal(asset: AssetRecord, slot: MediaSlot, environment: DeployEnvironment): string | null {
  if (!asset.permittedUsage.includes("2027-site")) return "not permitted on the 2027 site";
  if (asset.origin !== slot.source) return `needs ${slot.source} media, this is ${asset.origin}`;
  if (!mayDepict(asset, slot.depiction, environment)) return "not approved for this use";
  if (asset.rights.permission !== "recorded") return "publication permission not recorded";
  if (asset.rights.peopleConsent === "not-obtained") return "consent of the people shown not obtained";
  if (environment === "production" && asset.rights.peopleConsent === "unknown") {
    return "consent of the people shown not recorded";
  }
  return null;
}

export function resolveSlot(slotId: string, environment: DeployEnvironment): ResolvedSlot {
  const slot = findSlot(slotId);
  if (!slot.assetId) return { kind: "placeholder", slot, reason: slot.dependency };
  const asset = findAsset(slot.assetId);
  const refusal = slotRefusal(asset, slot, environment);
  if (refusal) {
    return { kind: "placeholder", slot, reason: `${asset.id}: ${refusal}. ${asset.restriction}` };
  }
  return { kind: "asset", asset, slot };
}

/* Invariants: run at import. */
for (const slot of MEDIA_SLOTS) {
  if (slot.assetId) findAsset(slot.assetId);
  const expected: SlotSource = slot.depiction === "real-venue" ? "njs-resort" : "hebs-lagos-event";
  if (slot.source !== expected) {
    throw new Error(`[assets] slot ${slot.id} shows ${slot.depiction} but takes ${slot.source} media`);
  }
}
if (new Set(MEDIA_SLOTS.map((s) => s.id)).size !== MEDIA_SLOTS.length) {
  throw new Error("[assets] media slot ids must be unique");
}
if (new Set(ASSETS.map((a) => a.id)).size !== ASSETS.length) {
  throw new Error("[assets] asset ids must be unique");
}
for (const a of ASSETS) {
  if (a.status === "approved" && !a.approval) {
    throw new Error(`[assets] ${a.id} is approved without a recorded approval`);
  }
  if (a.status === "approved" && a.permittedUsage.includes("2027-site") && a.rights.permission !== "recorded") {
    throw new Error(`[assets] ${a.id} is approved for the 2027 site without recorded permission`);
  }
  if (isGenerated(a) && a.permittedDepictions.some((d) => d === "real-venue" || d === "real-event")) {
    throw new Error(`[assets] ${a.id} is generated or concept media and cannot depict a real venue or event`);
  }
  if (a.origin === "hebs-us-edition" && a.permittedUsage.includes("2027-site")) {
    throw new Error(`[assets] ${a.id} is from a HEBS US edition and is barred from the 2027 site`);
  }
  if ((a.origin === "hebs-lagos-event" || a.origin === "hebs-us-edition") && (a.eventYear === null || a.location === null)) {
    throw new Error(`[assets] ${a.id} is event media without a recorded year and location`);
  }
}

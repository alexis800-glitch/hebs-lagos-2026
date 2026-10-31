/**
 * HEBS 2027 asset approval register.
 *
 * Every image, video and brand file a 2027 page may use is listed here with its
 * provenance and approval state, and every media slot on a 2027 page names the
 * asset it needs. MediaFrame renders a slot only through `resolveSlot`, so:
 *
 *   - unapproved media never reaches a production page,
 *   - AI-generated or concept media can never fill a slot that depicts a real
 *     place or event (directive section 4A; Phase 2A instruction 1),
 *   - an empty slot renders a clearly labelled "pending media" placeholder that
 *     names its dependency, never stock or invented imagery.
 *
 * Changing an asset's status to "approved" is an owner decision: record who
 * approved it and when in `approval`.
 */

import { isRenderable, type DeployEnvironment, type PublicationStatus } from "../publication";

export type Provenance =
  | "hebs-brand"
  | "hebs-event-photo"
  | "venue-supplied"
  | "ai-generated"
  | "concept-render"
  | "undocumented";

/** What an asset is allowed to stand for on the page. */
export type Depiction =
  | "brand"
  | "real-venue"
  | "real-event"
  | "decorative";

export interface AssetRecord {
  id: string;
  src: string;
  alt: string;
  provenance: Provenance;
  status: PublicationStatus;
  /** Which depictions this asset may be used for. Empty = none. */
  permittedDepictions: Depiction[];
  restriction: string;
  approval?: { by: string; date: string };
}

export const ASSETS: AssetRecord[] = [
  {
    id: "hebs-logo-nav",
    src: "/assets/logos/hebs_logo_nav.png",
    alt: "HEBS, Hair Education Beauty Summit",
    provenance: "hebs-brand",
    status: "provisional",
    permittedDepictions: ["brand"],
    restriction:
      "Official 2027 mark not yet confirmed (D3); its pink/purple palette differs from the 2027 black and champagne direction. Preview only.",
  },
  {
    id: "hero-video-higgsfield",
    src: "/videos/higgsfield/hebs-hero-competition-desktop-v1-optimized.mp4",
    alt: "",
    provenance: "ai-generated",
    status: "provisional",
    permittedDepictions: [],
    restriction:
      "AI-generated (Higgsfield). Must never represent a real event, venue or resort facility.",
  },
  // Concept references: HEBS archive photographs from the US editions, used only
  // in the /2027/concepts design exploration with a visible reference label.
  // No permitted depictions, so they can never fill a 2027 media slot.
  {
    id: "ref-hebs-portrait",
    src: "/images/hebs-2025/winners/winner-05.png",
    alt: "HEBS competitor with sculpted natural hair in a black gown at a HEBS awards evening (archive reference)",
    provenance: "hebs-event-photo",
    status: "provisional",
    permittedDepictions: [],
    restriction: "Concept reference only. US edition, not 2027. Consent and approval needed before any publication.",
  },
  {
    id: "ref-hebs-avant-garde",
    src: "/images/hebs-2025/crowd/crowd-01.jpg",
    alt: "Avant-garde competition look on the HEBS stage (archive reference)",
    provenance: "hebs-event-photo",
    status: "provisional",
    permittedDepictions: [],
    restriction: "Concept reference only. US edition, not 2027. Consent and approval needed before any publication.",
  },
  {
    id: "hebs-2026-trailer",
    src: "/videos/hebs-2026-official-event-trailer.mp4",
    alt: "HEBS Lagos 2026 official event trailer",
    provenance: "undocumented",
    status: "awaiting-confirmation",
    permittedDepictions: [],
    restriction: "Pre-event promotional trailer; content and provenance to be confirmed for reuse.",
  },
];

export interface MediaSlot {
  id: string;
  /** Plain-language label shown on the placeholder. */
  label: string;
  depiction: Depiction;
  /** Asset assigned to this slot, once one is approved. */
  assetId: string | null;
  /** What has to happen before this slot can be filled. */
  dependency: string;
}

const NJS_MEDIA = "Approved NJS Royale Beach Resort photography or video, with written permission";
const HEBS_2026_MEDIA = "Approved HEBS Lagos 2026 event photography or video";

export const MEDIA_SLOTS: MediaSlot[] = [
  { id: "hero", label: "Beachfront hero", depiction: "real-venue", assetId: null, dependency: NJS_MEDIA },
  { id: "day-1", label: "Welcome Pre-Party", depiction: "real-venue", assetId: null, dependency: NJS_MEDIA },
  { id: "day-2", label: "Summit Day One", depiction: "real-event", assetId: null, dependency: HEBS_2026_MEDIA },
  { id: "day-3", label: "Summit Day Two", depiction: "real-event", assetId: null, dependency: HEBS_2026_MEDIA },
  { id: "exp-education", label: "Professional beauty education", depiction: "real-event", assetId: null, dependency: HEBS_2026_MEDIA },
  { id: "exp-competitions", label: "Hair and beauty competitions", depiction: "real-event", assetId: null, dependency: HEBS_2026_MEDIA },
  { id: "exp-exhibitions", label: "Exhibitions and brand showcases", depiction: "real-event", assetId: null, dependency: HEBS_2026_MEDIA },
  { id: "exp-networking", label: "International networking", depiction: "real-event", assetId: null, dependency: HEBS_2026_MEDIA },
  { id: "exp-entertainment", label: "Entertainment and celebrations", depiction: "real-event", assetId: null, dependency: HEBS_2026_MEDIA },
  { id: "exp-destination", label: "Luxury destination experiences", depiction: "real-venue", assetId: null, dependency: NJS_MEDIA },
  { id: "destination-gallery", label: "Resort photo gallery", depiction: "real-venue", assetId: null, dependency: NJS_MEDIA },
  { id: "destination-video", label: "Resort promotional video", depiction: "real-venue", assetId: null, dependency: NJS_MEDIA },
  { id: "education", label: "Education and masterclasses", depiction: "real-event", assetId: null, dependency: HEBS_2026_MEDIA },
  { id: "highlights-2026", label: "HEBS Lagos 2026 highlights", depiction: "real-event", assetId: null, dependency: HEBS_2026_MEDIA },
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

/** Whether `asset` may fill a slot showing `depiction` in `environment`. */
export function mayDepict(asset: AssetRecord, depiction: Depiction, environment: DeployEnvironment): boolean {
  if (!isRenderable(asset.status, environment)) return false;
  if (asset.provenance === "ai-generated" || asset.provenance === "concept-render") {
    // Generated or concept media may never stand for a real place or event.
    if (depiction === "real-venue" || depiction === "real-event") return false;
  }
  return asset.permittedDepictions.includes(depiction);
}

export function resolveSlot(slotId: string, environment: DeployEnvironment): ResolvedSlot {
  const slot = findSlot(slotId);
  if (!slot.assetId) return { kind: "placeholder", slot, reason: slot.dependency };
  const asset = findAsset(slot.assetId);
  if (!mayDepict(asset, slot.depiction, environment)) {
    return { kind: "placeholder", slot, reason: `${asset.id} is not approved for this use. ${asset.restriction}` };
  }
  return { kind: "asset", asset, slot };
}

/* Invariants: run at import. */
for (const slot of MEDIA_SLOTS) {
  if (slot.assetId) findAsset(slot.assetId);
}
if (new Set(MEDIA_SLOTS.map((s) => s.id)).size !== MEDIA_SLOTS.length) {
  throw new Error("[assets] media slot ids must be unique");
}
for (const a of ASSETS) {
  if (a.status === "approved" && !a.approval) {
    throw new Error(`[assets] ${a.id} is approved without a recorded approval`);
  }
  if ((a.provenance === "ai-generated" || a.provenance === "concept-render") &&
      a.permittedDepictions.some((d) => d === "real-venue" || d === "real-event")) {
    throw new Error(`[assets] ${a.id} is generated or concept media and cannot depict a real venue or event`);
  }
}

/**
 * NJS Beach Resort for HEBS Lagos 2027: what the Travel page may say about the
 * venue's location and facilities. Owner decisions of 21 Nov 2026:
 *
 * - "NJS Beach Resort" stays the public venue name (lib/editions/2027.ts, VENUE).
 * - "NJS Royale Event & Conference Center" may name the specific facility only
 *   after its official naming is verified.
 * - Completed facilities and development plans are kept clearly apart. Guest rooms
 *   are never advertised as available until their opening and booking arrangements
 *   are confirmed.
 * - One authentic, dated construction-progress photograph may be proposed for a
 *   development update, subject to NJS approval, and never as a completed facility.
 *
 * Nothing here is invented. Each item stays "awaiting-confirmation" until NJS
 * material confirms it, and the page renders only what isRenderable allows.
 */
import { isRenderable, type DeployEnvironment, type Gated } from "@/lib/publication";

export interface MapPoint {
  lat: number;
  lng: number;
}

export const VENUE_LOCATION: { address: Gated<string>; map: Gated<MapPoint> } = {
  address: {
    status: "awaiting-confirmation",
    note:
      "Candidate description from earlier NJS project material: \"Mosere-Kogo Village, via Eko Akete, Ibeju-Lekki, Lagos State, Nigeria\". " +
      "The NJS IT Blueprint (v1.3–v1.5, Sept 2026) records it as supplied to Veridion and marks it [OWNER] requiring written confirmation. " +
      "Other NJS documents describe the site differently (\"Coastal Road, Ibeju-Lekki\" on the Glo order; \"Lagos–Calabar Coastal Highway, Eko Akete\" on the 23 Oct 2026 invitation). " +
      "Publish only once NJS confirms the exact wording in writing.",
  },
  map: {
    status: "awaiting-confirmation",
    note: "No surveyed GPS point exists (IT Blueprint, item R-27: to be captured on site at the main entrance). Map links appear only from a verified point.",
  },
};

/**
 * Name of a conference facility at the resort. Not used: the 2026 summit days were
 * held at NJS Royale Events Center, Richland Garden Estate, Lekki-Epe Expressway
 * (origin/master app/layout.tsx and app/page.tsx), a separate NJS venue, and the
 * "NJS Royale Event & Conference Center" stage backdrop in the 2026 films belongs
 * to that venue. Whether NJS Beach Resort has its own named conference facility for
 * 2027 is unconfirmed, so no facility name is stated.
 */
export const CONFERENCE_CENTRE_NAME: Gated<string> = {
  status: "awaiting-confirmation",
  note: "The 2026 backdrop name belongs to the Lekki events venue, not the beach resort. A resort facility name needs NJS confirmation.",
};

export type FacilityState = "in-use" | "in-development";

export interface VenueFacility {
  id: "terrace" | "guest-rooms" | "pool";
  state: FacilityState;
  /** Public label. Generic until the official facility name is verified. */
  label: string;
  /** Opening date of a facility in development, only once NJS confirms it. */
  opening?: Gated<string>;
  /** Why this item is stated at all. */
  evidence: string;
}

export const VENUE_FACILITIES: readonly VenueFacility[] = [
  {
    id: "terrace",
    state: "in-use",
    label: "Event terrace",
    evidence: "Hosted the HEBS Lagos 2026 Welcome Pre-Party on Oct 23, 2026 (VMM Pre Party 2 footage at NJS Beach Resort; terrace signage visible).",
  },
  {
    id: "guest-rooms",
    state: "in-development",
    label: "Guest rooms",
    opening: { status: "awaiting-confirmation", note: "No confirmed opening date, room availability or booking arrangement (owner decision, 21 Nov 2026)." },
    evidence: "NJS construction-progress photographs show the guest-room block under construction.",
  },
  {
    id: "pool",
    state: "in-development",
    label: "Swimming pool",
    opening: { status: "awaiting-confirmation", note: "An opening of 12 Dec 2026 was mentioned earlier; it needs NJS's written reconfirmation and a real photograph." },
    evidence: "NJS POOL SECTION drawing and construction-progress photographs.",
  },
];

/**
 * The one dated development-update photograph (registered as "travel-progress").
 * It renders only when both the photograph is registered and this record is
 * renderable, so a photograph alone never appears without its date and label.
 */
export const DEVELOPMENT_UPDATE: Gated<{ date: string }> = {
  status: "awaiting-confirmation",
  note: "Awaiting NJS approval of one authentic construction-progress photograph and its capture date (owner decision, 21 Nov 2026).",
};

/** Map links built only from a verified point; none otherwise. No embedded map script. */
export function mapLinks(environment: DeployEnvironment, map: Gated<MapPoint> = VENUE_LOCATION.map): { google: string; apple: string } | null {
  if (map.status === "awaiting-confirmation" || !isRenderable(map.status, environment)) return null;
  const { lat, lng } = map.value;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const q = `${lat.toFixed(6)},${lng.toFixed(6)}`;
  return {
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
    apple: `https://maps.apple.com/?ll=${q}&q=${encodeURIComponent("NJS Beach Resort")}`,
  };
}

/** A gated value's text, when it may be shown here. */
export function shown<T>(g: Gated<T> | undefined, environment: DeployEnvironment): T | null {
  if (!g || g.status === "awaiting-confirmation") return null;
  return isRenderable(g.status, environment) ? g.value : null;
}

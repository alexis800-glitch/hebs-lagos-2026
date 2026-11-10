/**
 * Internal-review media for the preferred 2027 homepage design.
 *
 * None of this material is cleared for publication. The files live only in
 * public/_review/home-2027/, which is gitignored, so a clean checkout, a preview
 * build and a production build never contain them. The homepage renders a file
 * only in local development, only when it is present on disk, and otherwise
 * shows a labelled placeholder (see components/2027/home/media.tsx).
 *
 * Each record says where the material came from and what it may stand for, so
 * the eventual permission requests can be made item by item. No Drive links or
 * file IDs are recorded here: the source folders are editable by anyone with
 * the link and must not be exposed in this public repository.
 */

import type { AssetRecord } from "./register";

/** How a picture must be labelled when it is shown. */
export type ReviewBadge =
  | "concept" // a visualisation, never presented as the real property or a real event
  | "photographed" // genuine HEBS Lagos 2026 material
  | "brand"; // provisional HEBS mark

export interface ReviewAsset extends AssetRecord {
  kind: "image" | "video";
  badge: ReviewBadge;
  /** What the media is, in words, for the rights register. */
  source: string;
  /**
   * Pre-sized widths of a responsive image, each a separate file named
   * <src without .webp>-<width>.webp, so the browser picks one close to the
   * displayed size instead of shrinking or stretching a single file.
   */
  widths?: number[];
  /** Natural width of `src`. When set, `src` itself is the largest size; smaller ones are <name>-480/-800.webp. */
  fullWidth?: number;
  /** For films: a still of the first frame, <clip>-poster.webp, shown until the film plays and when it cannot. */
  poster?: string;
}

/** Review images wider than 800 px, with their natural widths (480 and 800 px copies exist beside them). */
const IMAGE_WIDTH: Record<string, number> = {
  "comp-main.webp": 843, "day-2.webp": 843, "dest-guest.webp": 1000, "exp-competitions.webp": 843, "exp-destination.webp": 900,
  "exp-education.webp": 1200, "exp-entertainment.webp": 900, "exp-networking-desktop.webp": 900, "exp-networking-phone.webp": 1400,
  "hero-card-guest.webp": 1000, "hero-card-terrace.webp": 900, "hl-floor-a.webp": 843, "hl-floor-b.webp": 843, "hl-floor-c.webp": 843,
  "hl-guest-a.webp": 900, "hl-guest-b.webp": 900, "hl-guest-c.webp": 900, "hl-guest-d.webp": 900, "hl-hall.webp": 1200,
  "sp-hall.webp": 1200, "welcome-arch.webp": 900,
};

/** Champions photographs: the role each one plays, and the widths cut for it. */
const CHAMP_WIDTHS = { featured: [640, 960, 1280, 1800], highlight: [640, 960, 1280, 1600, 2000], card: [320, 600, 900] } as const;
const CHAMP_ROLE: Record<string, keyof typeof CHAMP_WIDTHS> = {
  "champ-img_7897": "featured", "champ-img_7854": "featured",
  "champ-img_8012": "highlight", "champ-dsc_1897": "highlight",
};

export const REVIEW_DIR = "/_review/home-2027/";

const VMM = "Visualmedia Marketing (VMM)";
const VMM_PENDING = {
  holder: VMM,
  permission: "not-recorded" as const,
  peopleConsent: "unknown" as const,
};

const S06 = "Frame or loop from VMM clip S06, the HEBS Lagos 2026 styling floor, chosen with no sponsor logos in shot";
const PREVIEW = "Frame from a VMM clip preview of the HEBS Lagos 2026 summit days";
const PREPARTY = "VMM photograph, HEBS Lagos 2026 Welcome Pre-Party at NJS Royale Beach Resort, 23 Oct 2026";
const SNAPP_D1 = "House of Snapp photograph, HEBS Lagos 2026 summit day 1 prize presentation, 24 Oct 2026";
const SNAPP_D2 = "Photograph from the House of Snapp collection, HEBS Lagos 2026 summit day 2 prize presentation, 25 Oct 2026";
const CHAMP_ALT = "HEBS Lagos 2026 prize presentation: recipients on stage with a ceremonial cheque";
const OCT22 =
  "VMM photograph of the 22 Oct 2026 gathering at a different Lagos hotel. Not confirmed as an official HEBS activity; never described as NJS";

type Spec = [id: string, kind: "image" | "video", file: string, alt: string, badge: ReviewBadge, kindOf: "s06" | "preview" | "preparty" | "oct22" | "njs-ai" | "njs-unknown" | "mark" | "snapp-d1" | "snapp-d2", detail?: string];

const SPECS: Spec[] = [
  ["hero-loop-wide", "video", "hair-wide.mp4", "", "photographed", "s06", "S06 0:32–0:35.5 and 0:01–0:04.5, half speed, colour graded"],
  ["hero-loop-tall", "video", "hair-tall.mp4", "", "photographed", "s06", "Phone crop of the same loop"],
  ["hero-poster", "image", "hero-poster.webp", "", "photographed", "s06"],
  ["hero-card-guest", "image", "hero-card-guest.webp", "A guest at the HEBS Lagos 2026 pre-party", "photographed", "preparty", "DSC00318"],
  ["hero-card-terrace", "image", "hero-card-terrace.webp", "Guests on the NJS terrace at the 2026 pre-party", "photographed", "preparty", "DSC00261"],
  ["welcome-arch", "image", "welcome-arch.webp", "A guest at the floral entrance, HEBS Lagos 2026 pre-party", "photographed", "preparty", "DSC00353"],
  ["welcome-inset", "image", "welcome-inset.webp", "A speaker at HEBS Lagos 2026", "photographed", "preview"],
  ["num-days", "image", "num-days.webp", "", "photographed", "preparty", "DSC00262, used as numeral texture"],
  ["num-competitions", "image", "num-competitions.webp", "", "photographed", "s06", "Numeral texture"],
  ["num-categories", "image", "num-categories.webp", "", "photographed", "s06", "Numeral texture"],
  ["day-1", "image", "day-1.webp", "A guest at the HEBS Lagos 2026 pre-party", "photographed", "preparty", "DSC00278"],
  ["day-2", "image", "day-2.webp", "Hair styling at HEBS Lagos 2026", "photographed", "s06"],
  ["day-3", "image", "day-3.webp", "The 2026 runway", "photographed", "preview"],
  ["exp-education", "image", "exp-education.webp", "A packed hall at HEBS Lagos 2026", "photographed", "preview"],
  ["exp-competitions", "image", "exp-competitions.webp", "A model on the 2026 styling floor", "photographed", "s06"],
  ["exp-exhibitions", "image", "exp-exhibitions.webp", "An exhibitor at HEBS Lagos 2026", "photographed", "preview", "Exhibitor brand visible; brand agreement needed"],
  ["exp-networking-desktop", "image", "exp-networking-desktop.webp", "HEBS Lagos 2026 guests", "photographed", "oct22", "DSC00242, cropped to keep all six guests"],
  ["exp-networking-phone", "image", "exp-networking-phone.webp", "HEBS Lagos 2026 guests", "photographed", "oct22", "DSC00257, shown in full"],
  ["exp-entertainment", "image", "exp-entertainment.webp", "A guest celebrating at the 2026 pre-party", "photographed", "preparty", "DSC00294"],
  ["exp-destination", "image", "exp-destination.webp", "A guest at the NJS floral entrance, 2026", "photographed", "preparty", "DSC00347"],
  ["dest-guests-wide", "video", "guests-wide.mp4", "", "concept", "njs-unknown", "0:00.2–0:03.2 at 75% speed"],
  ["dest-guests-tall", "video", "guests-tall.mp4", "", "concept", "njs-unknown", "Phone crop"],
  ["dest-pool-wide", "video", "pool-wide.mp4", "", "concept", "njs-ai", "0:00–0:02.9 at half speed, before any beach enters the shot"],
  ["dest-pool-tall", "video", "pool-tall.mp4", "", "concept", "njs-ai", "Phone crop"],
  ["dest-cinema-wide", "video", "cinema-wide.mp4", "", "concept", "njs-unknown", "0:12.2–0:17.0 at 75% speed"],
  ["dest-cinema-tall", "video", "cinema-tall.mp4", "", "concept", "njs-unknown", "Phone crop"],
  ["dest-poster", "image", "dest-poster.webp", "", "concept", "njs-unknown"],
  ["dest-terrace", "image", "hero-card-terrace.webp", "Guests on the NJS terrace at the HEBS Lagos 2026 pre-party", "photographed", "preparty", "DSC00261"],
  ["dest-guest", "image", "dest-guest.webp", "A guest at the HEBS Lagos 2026 pre-party at NJS", "photographed", "preparty", "DSC00318"],
  ["comp-main", "image", "comp-main.webp", "A competitor on the 2026 styling floor", "photographed", "s06"],
  ["comp-trophy", "image", "comp-trophy.webp", "The HEBS 2026 trophy", "photographed", "preview"],
  ["hl-guest-a", "image", "hl-guest-a.webp", "", "photographed", "preparty", "DSC00317"],
  ["hl-guest-b", "image", "hl-guest-b.webp", "", "photographed", "preparty", "DSC00276"],
  ["hl-performance", "image", "hl-performance.webp", "", "photographed", "preview"],
  ["hl-speaker", "image", "hl-speaker.webp", "", "photographed", "preview"],
  ["hl-guest-c", "image", "hl-guest-c.webp", "", "photographed", "preparty", "DSC00326"],
  ["hl-guest-d", "image", "hl-guest-d.webp", "", "photographed", "preparty", "DSC00294"],
  ["hl-hall", "image", "hl-hall.webp", "", "photographed", "preview"],
  ["hl-runway", "image", "hl-runway.webp", "", "photographed", "preview"],
  ["hl-trophy", "image", "hl-trophy.webp", "", "photographed", "preview"],
  ["hl-floor-a", "image", "hl-floor-a.webp", "", "photographed", "s06"],
  ["hl-floor-b", "image", "hl-floor-b.webp", "", "photographed", "s06"],
  ["hl-floor-c", "image", "hl-floor-c.webp", "", "photographed", "s06"],
  ["sp-hall", "image", "sp-hall.webp", "A packed hall at HEBS Lagos 2026", "photographed", "preview"],
  ["sp-exhibitor", "image", "sp-exhibitor.webp", "An exhibitor at HEBS Lagos 2026", "photographed", "preview", "Exhibitor brand visible; brand agreement needed"],
  ["champ-img_7897", "image", "champions/champ-img_7897.webp", CHAMP_ALT, "photographed", "snapp-d1", "IMG_7897, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["champ-img_7854", "image", "champions/champ-img_7854.webp", CHAMP_ALT, "photographed", "snapp-d1", "IMG_7854, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["champ-img_8012", "image", "champions/champ-img_8012.webp", CHAMP_ALT, "photographed", "snapp-d1", "IMG_8012, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["champ-dsc_1897", "image", "champions/champ-dsc_1897.webp", CHAMP_ALT, "photographed", "snapp-d1", "DSC_1897, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["champ-img_8022", "image", "champions/champ-img_8022.webp", CHAMP_ALT, "photographed", "snapp-d1", "IMG_8022, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["champ-img_8085", "image", "champions/champ-img_8085.webp", CHAMP_ALT, "photographed", "snapp-d1", "IMG_8085, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["champ-0q1a0290", "image", "champions/champ-0q1a0290.webp", CHAMP_ALT, "photographed", "snapp-d2", "0Q1A0290, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["champ-dsc_1883", "image", "champions/champ-dsc_1883.webp", CHAMP_ALT, "photographed", "snapp-d1", "DSC_1883, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["champ-img_7895", "image", "champions/champ-img_7895.webp", CHAMP_ALT, "photographed", "snapp-d1", "IMG_7895, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["champ-0q1a0140", "image", "champions/champ-0q1a0140.webp", CHAMP_ALT, "photographed", "snapp-d2", "0Q1A0140, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["champ-0q1a0215", "image", "champions/champ-0q1a0215.webp", CHAMP_ALT, "photographed", "snapp-d2", "0Q1A0215, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["champ-0q1a0190", "image", "champions/champ-0q1a0190.webp", CHAMP_ALT, "photographed", "snapp-d2", "0Q1A0190, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["champ-img_7964", "image", "champions/champ-img_7964.webp", CHAMP_ALT, "photographed", "snapp-d1", "IMG_7964, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["champ-0q1a0163", "image", "champions/champ-0q1a0163.webp", CHAMP_ALT, "photographed", "snapp-d2", "0Q1A0163, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["champ-0q1a0242", "image", "champions/champ-0q1a0242.webp", CHAMP_ALT, "photographed", "snapp-d2", "0Q1A0242, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["champ-img_8112", "image", "champions/champ-img_8112.webp", CHAMP_ALT, "photographed", "snapp-d1", "IMG_8112, cropped and tone-corrected working copy; the original is preserved unaltered"],
  ["mark-2027-a", "image", "mark-2027-a.png", "HEBS Lagos 2027, provisional mark", "brand", "mark", "Version A: 2027 on one line inside the continent"],
];

function record([id, kind, file, alt, badge, kindOf, detail]: Spec): ReviewAsset {
  const base = {
    id,
    kind,
    badge,
    src: REVIEW_DIR + file,
    alt,
    status: "provisional" as const,
    permittedUsage: ["internal-review" as const],
    ...(id.startsWith("champ-") ? { widths: [...CHAMP_WIDTHS[CHAMP_ROLE[id] ?? "card"]] } : {}),
    ...(IMAGE_WIDTH[file] ? { widths: [480, 800, IMAGE_WIDTH[file]], fullWidth: IMAGE_WIDTH[file] } : {}),
    ...(file === "mark-2027-a.png" ? { widths: [240, 480] } : {}),
    ...(kind === "video" ? { poster: REVIEW_DIR + file.replace(/\.mp4$/, "-poster.webp") } : {}),
  };
  const note = detail ? `. ${detail}` : "";
  switch (kindOf) {
    case "s06":
    case "preview":
      return {
        ...base,
        eventYear: 2026,
        edition: "HEBS Lagos 2026",
        location: "Lagos, Nigeria (summit days)",
        origin: "hebs-lagos-event",
        provenance: "hebs-event-photo",
        rights: VMM_PENDING,
        permittedDepictions: ["real-event"],
        source: (kindOf === "s06" ? S06 : PREVIEW) + note,
        restriction: "Internal review only until VMM's written permission and the consent of everyone recognisable are recorded.",
      };
    case "preparty":
      return {
        ...base,
        eventYear: 2026,
        edition: "HEBS Lagos 2026",
        location: "NJS Royale Beach Resort, Lagos",
        origin: "hebs-lagos-event",
        provenance: "hebs-event-photo",
        rights: VMM_PENDING,
        permittedDepictions: ["real-event"],
        source: PREPARTY + note,
        restriction: "Internal review only until VMM's written permission and guest consent are recorded.",
      };
    case "oct22":
      return {
        ...base,
        eventYear: 2026,
        edition: "HEBS Lagos 2026 (22 Oct gathering, official status unconfirmed)",
        location: "Lagos, Nigeria (a hotel other than NJS)",
        origin: "hebs-lagos-event",
        provenance: "hebs-event-photo",
        rights: VMM_PENDING,
        permittedDepictions: ["real-event"],
        source: OCT22 + note,
        restriction:
          "Internal review only. Needs HEBS to confirm the gathering was official, organisers to identify the guests (no nationality is assumed), each guest's consent and VMM's permission.",
      };
    case "njs-ai":
      return {
        ...base,
        eventYear: null,
        edition: "NJS Royale Beach Resort website concept media",
        location: null,
        origin: "generated",
        provenance: "ai-generated",
        rights: { holder: "NJS Royale Beach Resort", permission: "not-recorded", peopleConsent: "not-applicable" },
        permittedDepictions: ["decorative"],
        source:
          "NJS website master njs-hero-02-sunset-pool-approved.mp4. Its C2PA content credentials mark it as AI-generated (Seedance 2.0). The building differs from the building photographed in Oct 2026" + note,
        restriction:
          "Concept only: always labelled as a concept, never presented as the completed property. Needs NJS permission to reuse and NJS confirmation of the approved design.",
      };
    case "njs-unknown":
      return {
        ...base,
        eventYear: null,
        edition: "NJS Royale Beach Resort concept media",
        location: null,
        origin: "unknown",
        provenance: "undocumented",
        rights: { holder: null, permission: "not-recorded", peopleConsent: "not-applicable" },
        permittedDepictions: ["decorative"],
        source:
          "Clip in the NJS website folder, received by WhatsApp on 7 Oct 2026 (content credentials stripped). Appears AI-generated; its guests are illustrative and the terrace cinema is not a confirmed facility or event" + note,
        restriction:
          "Concept only: always labelled as a concept, never suggesting real people attended an NJS event. Needs confirmed origin and rights, and NJS permission.",
      };
    case "snapp-d1":
    case "snapp-d2":
      return {
        ...base,
        eventYear: 2026,
        edition: "HEBS Lagos 2026",
        location: "Lagos, Nigeria (summit days)",
        origin: "hebs-lagos-event",
        provenance: "hebs-event-photo",
        rights: {
          holder: kindOf === "snapp-d1" ? "House of Snapp" : "Day 2 photographer in the House of Snapp collection (owner recorded privately)",
          permission: "not-recorded",
          peopleConsent: "unknown",
        },
        permittedDepictions: ["real-event"],
        source: (kindOf === "snapp-d1" ? SNAPP_D1 : SNAPP_D2) + note,
        restriction:
          "Internal review only. Needs the photographer's written permission, each recognisable person's consent, and the organisers' verification of the competition, placing, winner and prize before any public use.",
      };
    case "mark":
      return {
        ...base,
        eventYear: null,
        edition: "HEBS brand, provisional 2027 adaptation",
        location: null,
        origin: "hebs-brand",
        provenance: "hebs-brand",
        rights: { holder: "HEBS", permission: "not-recorded", peopleConsent: "not-applicable" },
        permittedDepictions: ["brand"],
        source:
          "Adaptation of the official HEBS Lagos 2026 mark: the year digits redrawn as 2027 inside the gold continent. The 2026 master is unchanged" + note,
        restriction: "Provisional, awaiting Mrs. Shuler's brand approval. The official mark stays in use until then.",
      };
  }
}

export const REVIEW_ASSETS: ReviewAsset[] = SPECS.map(record);

export function findReviewAsset(id: string): ReviewAsset {
  const found = REVIEW_ASSETS.find((a) => a.id === id);
  if (!found) throw new Error(`[review-media] unknown review asset ${id}`);
  return found;
}

/* Invariants: run at import. */
if (new Set(REVIEW_ASSETS.map((a) => a.id)).size !== REVIEW_ASSETS.length) {
  throw new Error("[review-media] ids must be unique");
}
for (const a of REVIEW_ASSETS) {
  if (!a.src.startsWith(REVIEW_DIR)) throw new Error(`[review-media] ${a.id} must live in ${REVIEW_DIR}`);
  if (a.permittedUsage.length !== 1 || a.permittedUsage[0] !== "internal-review") {
    throw new Error(`[review-media] ${a.id} may only be used for internal review`);
  }
  if (a.status === "approved" || a.rights.permission === "recorded") {
    throw new Error(`[review-media] ${a.id} is cleared; move it to the main asset register instead`);
  }
  if ((a.origin === "generated" || a.provenance === "undocumented") && a.badge !== "concept") {
    throw new Error(`[review-media] ${a.id} is generated or undocumented and must be labelled as a concept`);
  }
}

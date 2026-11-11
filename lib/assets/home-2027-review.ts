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

/** Where review material came from, for its publication record (lib/content/signoff-2027.ts). */
export type ReviewCollection = "house-of-snapp" | "vmm-summit" | "vmm-preparty" | "vmm-oct22" | "njs-concept" | "brand-mark";

export interface ReviewAsset extends AssetRecord {
  kind: "image" | "video";
  badge: ReviewBadge;
  collection: ReviewCollection;
  /** The event owner's approval for the website, when given (OWNER_MEDIA_APPROVAL, MARK_APPROVAL). */
  ownerApproval?: { readonly by: string; readonly date: string; readonly reference: string };
  /** A restriction backed by evidence: disputed ownership or a known usage limit. Restricted media is not published. */
  restricted?: string;
  /** Third-party paperwork still to file. Recorded, but it does not hold the media back. */
  followUp?: string;
  /** Approved and prepared for publication: served from MEDIA_DIR, in every environment once the page is published. */
  published: boolean;
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
  /** Width over height, for layouts that keep each photograph's own shape (the gallery). */
  aspect?: number;
}

/** Review images wider than 800 px, with their natural widths (480 and 800 px copies exist beside them). */
const IMAGE_WIDTH: Record<string, number> = {
  "x-dest-guest.webp": 1000, "x-exp-destination.webp": 900, "x-exp-entertainment.webp": 900, "x-hero-card-guest.webp": 1000,
  "x-hero-card-terrace.webp": 900, "x-hl-guest-a.webp": 900, "x-hl-guest-b.webp": 900, "x-hl-guest-c.webp": 900,
  "x-welcome-arch.webp": 900,
};

/**
 * House of Snapp summit photographs in homepage slots: the widths cut for each by
 * docs/design/2027-home/tools/hos-images.py (hos-crops.json). The largest is the
 * slot's own file; smaller ones are <slot>-<width>.webp.
 */
const HOS_WIDTHS: Record<string, number[]> = {
  "welcome-inset": [480, 800], "day-2": [480, 800, 920], "day-3": [480, 800, 920],
  "exp-education": [480, 800, 1120], "exp-competitions": [480, 800, 1120], "exp-exhibitions": [480, 800, 1120],
  "exp-networking-desktop": [480, 800, 1120], "exp-networking-phone": [480, 800, 1260],
  "comp-main": [480, 800], "comp-trophy": [480], "sp-hall": [480, 800, 1400], "sp-exhibitor": [480],
  "hero-card-guest": [480, 800, 1000], "hero-card-terrace": [480, 800, 900], "welcome-arch": [480, 800, 900], "num-days": [900],
  "day-1": [480, 800, 920], "exp-entertainment": [480, 800, 900], "exp-destination": [480, 800, 900],
  "dest-terrace": [480, 800, 1000], "dest-guest": [480, 800, 1000], "dest-floor-a": [480, 800, 1000], "dest-floor-b": [480, 800, 1000],
  "hl-guest-a": [480, 800, 900], "hl-guest-b": [480, 800, 900], "hl-guest-c": [480, 800, 900],
  "hl-floor-a": [480, 800], "hl-performance": [480], "hl-hall": [480, 840], "hl-trophy": [480],
  "hl-floor-b": [480, 800], "hl-speaker": [480], "hl-floor-c": [480, 800], "hl-guest-d": [480, 800],
  "edu-session": [480, 800, 1200], "edu-styling": [480, 800], "edu-skincare": [480, 800], "edu-technique": [480, 800], "edu-loc": [480, 800],
  "gal-img_6721": [480, 800, 1100], "gal-img_6724": [480, 800], "gal-dsc_1947": [480, 800], "gal-dsc_1395": [480, 800],
  "gal-img_6824": [480, 800, 1100], "gal-dsc_2148": [480, 800], "gal-dsc_1969": [480, 800, 1100], "gal-dsc_2239": [480, 800],
  "gal-img_6688": [480, 800], "gal-img_8357": [480, 800], "gal-img_6755": [480, 800, 1100], "gal-img_7937": [480, 800, 1100],
  "gal-img_7821": [480, 800, 1100], "gal-dsc_1489": [480, 800, 1100], "gal-dsc_1452": [480, 800, 1100], "gal-dsc_1276": [480, 800],
  "gal-dsc_1194": [480, 800], "gal-dsc_1305": [480, 800, 1100], "gal-0q1a0444": [480, 800, 1100], "gal-0q1a0445": [480, 800, 1100],
  "gal-img_7809": [480, 800, 1100], "gal-dsc_1786": [480, 800], "gal-dsc_1798": [480, 800], "gal-dsc_2093": [480, 800],
  "gal-dsc_2097": [480, 800], "gal-dsc_2034": [480, 800, 1100], "gal-dsc_2037": [480, 800, 1100], "gal-0q1a0481": [480, 800],
  "gal-0q1a0117": [480, 800], "gal-0q1a0074": [480, 800, 1100], "gal-dsc_1734": [480, 800, 1100], "gal-0q1a0098": [480, 800],
  "gal-dsc_1727": [480, 800, 1100], "gal-0q1a0470": [480, 800, 1100], "gal-img_7144": [480, 800, 1100], "gal-img_7147": [480, 800, 1100],
  "gal-img_7139": [480, 800, 1100], "gal-0q1a0374": [480, 800, 1100], "gal-img_7299": [480, 800, 1100],
};

/** Gallery photographs keep their own shape: width over height of each crop (tools/hos-crops.json). */
const GALLERY_ASPECT: Record<string, number> = {
  "gal-img_6721": 1.5, "gal-img_6724": 0.6667, "gal-dsc_1947": 0.6667, "gal-dsc_1395": 0.6667,
  "gal-img_6824": 1.5, "gal-dsc_2148": 0.6666, "gal-dsc_1969": 1.5001, "gal-dsc_2239": 0.6667,
  "gal-img_6688": 0.8, "gal-img_8357": 0.6667, "gal-img_6755": 1.2501, "gal-img_7937": 1.5,
  "gal-img_7821": 1.5001, "gal-dsc_1489": 1.5, "gal-dsc_1452": 1.5, "gal-dsc_1276": 0.75,
  "gal-dsc_1194": 0.6667, "gal-dsc_1305": 1.5001, "gal-0q1a0444": 1.5, "gal-0q1a0445": 1.5,
  "gal-img_7809": 1.25, "gal-dsc_1786": 0.6667, "gal-dsc_1798": 0.8, "gal-dsc_2093": 0.6667,
  "gal-dsc_2097": 0.8, "gal-dsc_2034": 1.5, "gal-dsc_2037": 1.25, "gal-0q1a0481": 0.6667,
  "gal-0q1a0117": 0.6667, "gal-0q1a0074": 1.2501, "gal-dsc_1734": 1.4999, "gal-0q1a0098": 0.6666,
  "gal-dsc_1727": 1.1809, "gal-0q1a0470": 1.5, "gal-img_7144": 1.2501, "gal-img_7147": 1.25,
  "gal-img_7139": 1.2501, "gal-0q1a0374": 1.4999, "gal-img_7299": 1.5,
};

/** Champions photographs: the role each one plays, and the widths cut for it. */
const CHAMP_WIDTHS = { featured: [640, 960, 1280, 1800], highlight: [640, 960, 1280, 1600, 2000], card: [320, 600, 900] } as const;
const CHAMP_ROLE: Record<string, keyof typeof CHAMP_WIDTHS> = {
  "champ-img_7897": "featured", "champ-img_7854": "featured",
  "champ-img_8012": "highlight", "champ-dsc_1897": "highlight",
};

export const REVIEW_DIR = "/_review/home-2027/";
/**
 * Where media approved for publication lives: public/2027/media/. Like the review
 * folder it is gitignored until launch, because this repository is public and a
 * committed photograph would be downloadable before the site opens; the launch
 * commit adds the files (lib/assets/published-media-2027.ts, MEDIA_RELEASED).
 * The middleware answers /2027/media/* as a missing page on production until the
 * 2027 site is open.
 */
export const MEDIA_DIR = "/2027/media/";

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
/** Summit-day photographs from the same collection that are not prize presentations. */
const SNAPP_D1_FLOOR = "House of Snapp photograph, HEBS Lagos 2026 summit day 1, 24 Oct 2026 (collection folder \"HEBS DAY 1\")";
const SNAPP_D2_FLOOR = "Photograph from the House of Snapp collection, HEBS Lagos 2026 summit day 2, 25 Oct 2026 (collection folder \"HEBS DAY 2\")";
/**
 * The event owner's approval of the website media (Mrs. Shuler, confirmed on
 * 11 Nov 2026 and repeatedly since). It covers the photographs and films selected
 * for the 2027 pages. It does not override third-party rights: media with
 * disputed ownership or a known usage limit keeps its restriction (`restricted`).
 * Paperwork that is simply not on file yet is a records follow-up (`followUp`),
 * not a reason to withhold the media.
 */
export const OWNER_MEDIA_APPROVAL = {
  by: "Mrs. Shuler, event owner",
  date: "2026-11-11",
  reference: "Owner's confirmation to Veridion, 11 Nov 2026, restated on later instructions",
} as const;

/** Decision D3: the existing HEBS Lagos 2027 logo (2027 inside the gold continent) is approved. */
export const MARK_APPROVAL = {
  by: "Mrs. Shuler, event owner",
  date: "2026-11-11",
  reference: "Decision D3: the existing HEBS Lagos 2027 logo is approved",
} as const;

export const SNAPP_APPROVAL =
  "Approved for the website by Mrs. Shuler, the event owner, who has also paid the photographer (11 Nov 2026). Filing the photographer's written usage terms is a records follow-up.";
const CHAMP_ALT = "HEBS Lagos 2026 prize presentation: recipients on stage with a ceremonial cheque";
const OCT22 =
  "VMM photograph of the 22 Oct 2026 gathering at a different Lagos hotel. Not confirmed as an official HEBS activity; never described as NJS";

type Spec = [id: string, kind: "image" | "video", file: string, alt: string, badge: ReviewBadge, kindOf: "s06" | "preview" | "preparty" | "oct22" | "njs-ai" | "njs-unknown" | "mark" | "snapp-d1" | "snapp-d2" | "snapp-d1-floor" | "snapp-d2-floor", detail?: string];

const SPECS: Spec[] = [
  ["hero-loop-wide", "video", "hair-wide.mp4", "", "photographed", "s06", "S06 0:32–0:35.5 and 0:01–0:04.5, half speed, colour graded"],
  ["hero-loop-tall", "video", "hair-tall.mp4", "", "photographed", "s06", "Phone crop of the same loop"],
  ["hero-poster", "image", "hero-poster.webp", "", "photographed", "s06"],
  ["x-hero-card-guest", "image", "x-hero-card-guest.webp", "A guest at the HEBS Lagos 2026 pre-party", "photographed", "preparty", "DSC00318"],
  ["x-hero-card-terrace", "image", "x-hero-card-terrace.webp", "Guests on the NJS terrace at the 2026 pre-party", "photographed", "preparty", "DSC00261"],
  ["x-welcome-arch", "image", "x-welcome-arch.webp", "A guest at the floral entrance, HEBS Lagos 2026 pre-party", "photographed", "preparty", "DSC00353"],
  ["welcome-inset", "image", "welcome-inset.webp", "A speaker addressing the audience at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_7809, cropped to the frame; a product name is visible on the speaker's top, so that brand's agreement is needed"],
  ["x-num-days", "image", "x-num-days.webp", "", "photographed", "preparty", "DSC00262, used as numeral texture"],
  ["num-competitions", "image", "num-competitions.webp", "", "photographed", "s06", "Numeral texture"],
  ["num-categories", "image", "num-categories.webp", "", "photographed", "s06", "Numeral texture"],
  ["x-day-1", "image", "x-day-1.webp", "A guest at the HEBS Lagos 2026 pre-party", "photographed", "preparty", "DSC00278"],
  ["day-2", "image", "day-2.webp", "A stylist styling a client's hair at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1320, cropped to the frame; the Men'T stand and cape are visible, so the brand's agreement is needed"],
  ["day-3", "image", "day-3.webp", "A model in a feathered headdress and gown at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "DSC_2093, cropped head to gown; one resample per width, no other change; the original is preserved unaltered"],
  ["exp-education", "image", "exp-education.webp", "A stylist demonstrating on a mannequin head at the HEBS stand, 2026", "photographed", "snapp-d1-floor", "DSC_1194, cropped to the frame; a product brand is visible behind, so its agreement is needed"],
  ["exp-competitions", "image", "exp-competitions.webp", "A barber competing in front of the 2026 trophies", "photographed", "snapp-d1-floor", "IMG_6755, cropped to the frame"],
  ["exp-exhibitions", "image", "exp-exhibitions.webp", "An exhibitor presenting products at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "0Q1A0074, cropped to the frame; exhibitor brand visible, so the brand's agreement is needed"],
  ["exp-networking-desktop", "image", "exp-networking-desktop.webp", "Two attendees greeting each other at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "0Q1A0470, cropped to the two attendees; a summit-day photograph, replacing the unconfirmed 22 Oct gathering"],
  ["exp-networking-phone", "image", "exp-networking-phone.webp", "Two attendees greeting each other at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "0Q1A0470, the same crop as the desktop image"],
  ["x-exp-entertainment", "image", "x-exp-entertainment.webp", "A guest celebrating at the 2026 pre-party", "photographed", "preparty", "DSC00294"],
  ["x-exp-destination", "image", "x-exp-destination.webp", "A guest at the NJS floral entrance, 2026", "photographed", "preparty", "DSC00347"],
  ["x-dest-guests-wide", "video", "guests-wide.mp4", "", "concept", "njs-unknown", "0:00.2–0:03.2 at 75% speed"],
  ["x-dest-guests-tall", "video", "guests-tall.mp4", "", "concept", "njs-unknown", "Phone crop"],
  ["x-dest-pool-wide", "video", "pool-wide.mp4", "", "concept", "njs-ai", "0:00–0:02.9 at half speed, before any beach enters the shot"],
  ["x-dest-pool-tall", "video", "pool-tall.mp4", "", "concept", "njs-ai", "Phone crop"],
  ["x-dest-poster", "image", "x-dest-poster.webp", "", "concept", "njs-unknown"],
  ["x-dest-terrace", "image", "x-hero-card-terrace.webp", "Guests on the NJS terrace at the HEBS Lagos 2026 pre-party", "photographed", "preparty", "DSC00261"],
  ["x-dest-guest", "image", "x-dest-guest.webp", "A guest at the HEBS Lagos 2026 pre-party at NJS", "photographed", "preparty", "DSC00318"],
  ["comp-main", "image", "comp-main.webp", "A braiding competitor at work, HEBS Lagos 2026", "photographed", "snapp-d2-floor", "IMG_8357, cropped to the frame"],
  ["comp-trophy", "image", "comp-trophy.webp", "A winner celebrating beside the HEBS trophy, 2026", "photographed", "snapp-d1-floor", "IMG_7937, cropped to the winner and trophy; no prize wording in frame (D8)"],
  ["x-hl-guest-a", "image", "x-hl-guest-a.webp", "", "photographed", "preparty", "DSC00317"],
  ["x-hl-guest-b", "image", "x-hl-guest-b.webp", "", "photographed", "preparty", "DSC00276"],
  ["hl-performance", "image", "hl-performance.webp", "", "photographed", "snapp-d2-floor", "0Q1A0481, cropped to the tile"],
  ["hl-speaker", "image", "hl-speaker.webp", "", "photographed", "snapp-d2-floor", "DSC_1996, cropped to the tile"],
  ["x-hl-guest-c", "image", "x-hl-guest-c.webp", "", "photographed", "preparty", "DSC00326"],
  ["hl-guest-d", "image", "hl-guest-d.webp", "", "photographed", "snapp-d1-floor", "IMG_7144, cropped to the tile; replaces a repeat of the entertainment photograph"],
  ["hl-hall", "image", "hl-hall.webp", "", "photographed", "snapp-d1-floor", "IMG_6995, cropped to the tile"],
  ["hl-trophy", "image", "hl-trophy.webp", "", "photographed", "snapp-d2-floor", "0Q1A0117, cropped to the tile"],
  ["hl-floor-a", "image", "hl-floor-a.webp", "", "photographed", "snapp-d1-floor", "IMG_6721, cropped to the tile"],
  ["hl-floor-b", "image", "hl-floor-b.webp", "", "photographed", "snapp-d2-floor", "DSC_2034, cropped to the tile"],
  ["hl-floor-c", "image", "hl-floor-c.webp", "", "photographed", "snapp-d1-floor", "IMG_7299, cropped to the tile"],
  ["sp-hall", "image", "sp-hall.webp", "A full session at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "0Q1A0444, cropped to the stage and the front of the audience so that no child is in frame; a session sponsor's name is on the backdrop and Men'T is on the speaker's shirt, so their agreement is needed"],
  ["sp-exhibitor", "image", "sp-exhibitor.webp", "A wig and styling exhibitor's display at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1734, cropped to the frame; exhibitor brand visible, so the brand's agreement is needed"],
  // Education & Masterclasses page (DSC_1194 and IMG_7809 reuse exp-education and welcome-inset; 0Q1A0444 reuses sp-hall).
  ["edu-session", "image", "edu-session.webp", "A speaker addressing a seated session at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1305, shown in full; an organisation's name is visible on attendees' shirts"],
  ["edu-styling", "image", "edu-styling.webp", "A stylist shaping a client's curls with a comb at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "DSC_1942, cropped to the frame; the Men'T stand is visible, so the brand's agreement is needed"],
  ["edu-skincare", "image", "edu-skincare.webp", "A skincare treatment on a client at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1276, cropped below the stand's banner so its treatment claim is out of frame; the PureO stand is visible, so the brand's agreement is needed"],
  ["edu-technique", "image", "edu-technique.webp", "A design being cut into a client's short hair at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "DSC_1996, cropped to the frame"],
  ["edu-loc", "image", "edu-loc.webp", "A stylist retwisting a client's locs at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "DSC_2239, cropped to the frame; the PureO stand is visible, so the brand's agreement is needed"],
  // Gallery & past events: summit-day photographs only (no pre-party, cheque or prize frames).
  ["gal-img_6721", "image", "gal-img_6721.webp", "Cornrows being braided, seen from above at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_6721, full frame"],
  ["gal-img_6724", "image", "gal-img_6724.webp", "A braider parting a client's hair for cornrows at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_6724, full frame"],
  ["gal-dsc_1947", "image", "gal-dsc_1947.webp", "A stylist shaping a client's twists at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "DSC_1947, full frame"],
  ["gal-dsc_1395", "image", "gal-dsc_1395.webp", "A barber at work on a client's cut at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1395, full frame"],
  ["gal-img_6824", "image", "gal-img_6824.webp", "A barber's clippers at the back of a client's neck at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_6824, full frame"],
  ["gal-dsc_2148", "image", "gal-dsc_2148.webp", "A barber grooming a client's beard at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "DSC_2148, full frame"],
  ["gal-dsc_1969", "image", "gal-dsc_1969.webp", "A stylist working on a client's hair at a product stand at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "DSC_1969, full frame"],
  ["gal-dsc_2239", "image", "gal-dsc_2239.webp", "A stylist retwisting a client's locs at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "DSC_2239, full frame"],
  ["gal-img_6688", "image", "gal-img_6688.webp", "A client wearing a numbered competition bib during a haircut at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_6688, full frame"],
  ["gal-img_8357", "image", "gal-img_8357.webp", "A braiding competitor at work at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "IMG_8357, full frame"],
  ["gal-img_6755", "image", "gal-img_6755.webp", "A barber competing in front of the 2026 trophies at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_6755, full frame"],
  ["gal-img_7937", "image", "gal-img_7937.webp", "A winner celebrating beside the HEBS trophy at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_7937, full frame"],
  ["gal-img_7821", "image", "gal-img_7821.webp", "Guests on stage with a HEBS trophy at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_7821, full frame"],
  ["gal-dsc_1489", "image", "gal-dsc_1489.webp", "A nail technician painting a client's nails at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1489, full frame"],
  ["gal-dsc_1452", "image", "gal-dsc_1452.webp", "A manicure in progress at a beauty station at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1452, full frame"],
  ["gal-dsc_1276", "image", "gal-dsc_1276.webp", "A skincare treatment on a client at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1276, cropped below the stand's banner so its treatment claim is out of frame"],
  ["gal-dsc_1194", "image", "gal-dsc_1194.webp", "A stylist demonstrating on a mannequin head at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1194, full frame"],
  ["gal-dsc_1305", "image", "gal-dsc_1305.webp", "A speaker addressing a seated session at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1305, full frame"],
  ["gal-0q1a0444", "image", "gal-0q1a0444.webp", "A speaker on stage before a full audience at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "0Q1A0444, cropped to the stage and the front of the audience so that no child is in frame"],
  ["gal-0q1a0445", "image", "gal-0q1a0445.webp", "Speakers on stage before an audience at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "0Q1A0445, full frame"],
  ["gal-img_7809", "image", "gal-img_7809.webp", "A speaker addressing the audience at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_7809, full frame"],
  ["gal-dsc_1786", "image", "gal-dsc_1786.webp", "A speaker on stage in candlelight at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1786, full frame"],
  ["gal-dsc_1798", "image", "gal-dsc_1798.webp", "A speaker on stage, seen past the audience at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1798, full frame"],
  ["gal-dsc_2093", "image", "gal-dsc_2093.webp", "A model in a feathered headdress and gown at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "DSC_2093, full frame"],
  ["gal-dsc_2097", "image", "gal-dsc_2097.webp", "Models in feathered costumes with guests at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "DSC_2097, full frame"],
  ["gal-dsc_2034", "image", "gal-dsc_2034.webp", "A model in a red embroidered robe walking the floor at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "DSC_2034, full frame"],
  ["gal-dsc_2037", "image", "gal-dsc_2037.webp", "Models in gowns walking the floor at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "DSC_2037, full frame"],
  ["gal-0q1a0481", "image", "gal-0q1a0481.webp", "A guest in a green gele and fuchsia gown at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "0Q1A0481, full frame"],
  ["gal-0q1a0117", "image", "gal-0q1a0117.webp", "A sculptural braided hairstyle at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "0Q1A0117, full frame"],
  ["gal-0q1a0074", "image", "gal-0q1a0074.webp", "An exhibitor presenting products at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "0Q1A0074, full frame"],
  ["gal-dsc_1734", "image", "gal-dsc_1734.webp", "A wig and styling exhibitor's display at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1734, full frame"],
  ["gal-0q1a0098", "image", "gal-0q1a0098.webp", "A stylist working on a client's braids at an exhibitor's stand at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "0Q1A0098, full frame"],
  ["gal-dsc_1727", "image", "gal-dsc_1727.webp", "Garments on display at a fashion exhibitor's stand at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1727, cropped to the garments, leaving out the exhibitor's banner with its phone numbers and portraits"],
  ["gal-0q1a0470", "image", "gal-0q1a0470.webp", "Two attendees greeting each other at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "0Q1A0470, full frame"],
  ["gal-img_7144", "image", "gal-img_7144.webp", "An attendee in a HEBS T-shirt at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_7144, full frame"],
  ["gal-img_7147", "image", "gal-img_7147.webp", "Attendees smiling for the camera at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_7147, full frame"],
  ["gal-img_7139", "image", "gal-img_7139.webp", "An attendee with a gift bag in the crowd at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_7139, full frame"],
  ["gal-0q1a0374", "image", "gal-0q1a0374.webp", "A performer on stage with a microphone at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "0Q1A0374, full frame"],
  ["gal-img_7299", "image", "gal-img_7299.webp", "A performer singing in candlelight at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_7299, full frame"],
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
  ["mark-2027-a", "image", "mark-2027-a.png", "HEBS Lagos 2027", "brand", "mark", "Version A: 2027 on one line inside the continent"],
  // Replacements for positions that held restricted media (11 Nov 2026).
  ["hero-card-guest", "image", "hero-card-guest.webp", "A guest smiling with a gift bag at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_7139"],
  ["hero-card-terrace", "image", "hero-card-terrace.webp", "Guests in the crowd at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_7147"],
  ["welcome-arch", "image", "welcome-arch.webp", "Models in carnival costumes and gowns with guests at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "DSC_2097"],
  ["num-days", "image", "num-days.webp", "", "photographed", "snapp-d1-floor", "DSC_1727, used as numeral texture"],
  ["day-1", "image", "day-1.webp", "A performer singing on stage at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "0Q1A0374"],
  ["exp-entertainment", "image", "exp-entertainment.webp", "A host performing on stage at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1786"],
  ["exp-destination", "image", "exp-destination.webp", "Models walking through the hall at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "DSC_2037"],
  ["dest-terrace", "image", "dest-terrace.webp", "A session on the main stage at HEBS Lagos 2026, NJS Royale Events Center", "photographed", "snapp-d1-floor", "DSC_1305"],
  ["dest-guest", "image", "dest-guest.webp", "A speaker in front of the NJS crest at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1798"],
  ["dest-floor-a", "image", "dest-floor-a.webp", "A nail technician at work at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1452"],
  ["dest-floor-b", "image", "dest-floor-b.webp", "A braider at work at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_6724"],
  ["hl-guest-a", "image", "hl-guest-a.webp", "A barbering competitor in the chair at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "IMG_6688"],
  ["hl-guest-b", "image", "hl-guest-b.webp", "A barber cutting a client's hair at HEBS Lagos 2026", "photographed", "snapp-d1-floor", "DSC_1395"],
  ["hl-guest-c", "image", "hl-guest-c.webp", "A loctician retwisting locs at HEBS Lagos 2026", "photographed", "snapp-d2-floor", "DSC_2239"],
];

function record([id, kind, file, alt, badge, kindOf, detail]: Spec): ReviewAsset {
  const collection: ReviewCollection =
    kindOf === "s06" || kindOf === "preview" ? "vmm-summit"
    : kindOf === "preparty" ? "vmm-preparty"
    : kindOf === "oct22" ? "vmm-oct22"
    : kindOf === "njs-ai" || kindOf === "njs-unknown" ? "njs-concept"
    : kindOf === "mark" ? "brand-mark"
    : "house-of-snapp";
  // The event owner's approval covers the House of Snapp photographs and the VMM
  // styling-floor film; D3 covers the 2027 logo. Everything else stays review-only.
  // Prize-presentation photographs (champ-*) stay review-only: the winners rail shows
  // them only in review until the organisers verify names, placings and prizes (D8).
  const published = (collection === "house-of-snapp" && !id.startsWith("champ-")) || collection === "vmm-summit" || collection === "brand-mark";
  const dir = published ? MEDIA_DIR : REVIEW_DIR;
  const base = {
    id,
    kind,
    badge,
    collection,
    published,
    src: dir + file,
    alt,
    status: published ? ("approved" as const) : ("provisional" as const),
    ...(published ? { approval: { by: collection === "brand-mark" ? MARK_APPROVAL.by : OWNER_MEDIA_APPROVAL.by, date: OWNER_MEDIA_APPROVAL.date } } : {}),
    permittedUsage: published ? ["2027-site" as const] : ["internal-review" as const],
    ...(id.startsWith("champ-") ? { widths: [...CHAMP_WIDTHS[CHAMP_ROLE[id] ?? "card"]] } : {}),
    ...(IMAGE_WIDTH[file] ? { widths: [480, 800, IMAGE_WIDTH[file]], fullWidth: IMAGE_WIDTH[file] } : {}),
    ...(HOS_WIDTHS[id] ? { widths: HOS_WIDTHS[id], fullWidth: HOS_WIDTHS[id][HOS_WIDTHS[id].length - 1] } : {}),
    ...(GALLERY_ASPECT[id] ? { aspect: GALLERY_ASPECT[id] } : {}),
    ...(file === "mark-2027-a.png" ? { widths: [240, 480] } : {}),
    ...(kind === "video" ? { poster: dir + file.replace(/\.mp4$/, "-poster.webp") } : {}),
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
        ownerApproval: OWNER_MEDIA_APPROVAL,
        followUp: "VMM's written licence for the film is not on file. No restriction on its use is known.",
        restriction: "Approved by the event owner. VMM licence to file for the records.",
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
        restricted: "Ownership of the pre-party photographs is disputed. They stay off public pages until it is resolved.",
        restriction: "Disputed ownership: not for public pages.",
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
        restricted: "Not confirmed as an official HEBS activity, and the guests are not identified.",
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
        restricted: "NJS's AI-generated concept of an unfinished property: needs NJS's permission and confirmation of the design, and may only ever be shown labelled as a concept.",
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
          "Clip in the NJS website folder, received by WhatsApp on 7 Oct 2026 (content credentials stripped). Appears AI-generated; its guests are illustrative" + note,
        restricted: "Origin and rights undocumented (received by WhatsApp, credentials stripped), and excluded from public use on Veridion's instruction.",
        restriction:
          "Concept only: always labelled as a concept, never suggesting real people attended an NJS event. Needs confirmed origin and rights, and NJS permission.",
      };
    case "snapp-d1":
    case "snapp-d2":
    case "snapp-d1-floor":
    case "snapp-d2-floor":
      return {
        ...base,
        eventYear: 2026,
        edition: "HEBS Lagos 2026",
        location: "Lagos, Nigeria (summit days)",
        origin: "hebs-lagos-event",
        provenance: "hebs-event-photo",
        rights: {
          holder: kindOf === "snapp-d1" || kindOf === "snapp-d1-floor" ? "House of Snapp" : "Day 2 photographer in the House of Snapp collection (owner recorded privately)",
          permission: "not-recorded",
          peopleConsent: "unknown",
        },
        permittedDepictions: ["real-event"],
        ownerApproval: OWNER_MEDIA_APPROVAL,
        followUp: "The photographer's written usage terms are to be filed for the records.",
        source: ({ "snapp-d1": SNAPP_D1, "snapp-d2": SNAPP_D2, "snapp-d1-floor": SNAPP_D1_FLOOR, "snapp-d2-floor": SNAPP_D2_FLOOR } as const)[kindOf] + note,
        restriction: kindOf === "snapp-d1-floor" || kindOf === "snapp-d2-floor"
          ? SNAPP_APPROVAL
          : `${SNAPP_APPROVAL} Competition names, placings and prizes stay unpublished until the organisers verify them (D8).`,
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
        ownerApproval: MARK_APPROVAL,
        restriction: "The approved HEBS Lagos 2027 logo (D3).",
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
  if (!a.src.startsWith(a.published ? MEDIA_DIR : REVIEW_DIR)) throw new Error(`[media] ${a.id} must live in ${a.published ? MEDIA_DIR : REVIEW_DIR}`);
  if (a.published && (!a.ownerApproval || a.restricted)) throw new Error(`[media] ${a.id} is published without an approval, or despite a restriction`);
  if (!a.published && a.permittedUsage.join() !== "internal-review") throw new Error(`[media] ${a.id} may only be used for internal review`);
  if (a.restricted && a.published) throw new Error(`[media] ${a.id} is restricted and cannot be published`);
  if ((a.origin === "generated" || a.provenance === "undocumented") && a.badge !== "concept") {
    throw new Error(`[media] ${a.id} is generated or undocumented and must be labelled as a concept`);
  }
}

/** The approval state of the HEBS Lagos 2027 logo, which every 2027 page shows. */
export const MARK_2027_STATUS: "approved" | "provisional" = findReviewAsset("mark-2027-a").ownerApproval ? "approved" : "provisional";

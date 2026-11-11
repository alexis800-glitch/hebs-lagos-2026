/**
 * Which HEBS Lagos 2026 summit photograph (review media, lib/assets/home-2027-review.ts)
 * each 2027 inner page shows, in one place so the pages and the launch gate
 * (lib/launch-2027.ts) can never disagree. Pre-party photographs (ownership
 * unresolved) and concept films are never chosen; a position without a suitable
 * photograph takes a typographic composition instead.
 */
import type { PageId } from "./2027";

/** The photograph beside each page's title. Pages not listed take a typographic composition. */
export const HERO_MEDIA: Partial<Record<PageId, string>> = {
  about: "gal-0q1a0445",
  experience: "gal-dsc_2034",
  programme: "gal-dsc_1305",
  education: "gal-img_6724",
  competitions: "gal-img_6755",
  sponsorship: "gal-0q1a0444",
  exhibitors: "gal-0q1a0074",
};

/**
 * The six experiences on the Experience page. Entertainment uses a summit-day
 * performer rather than the homepage's pre-party photograph; the destination has
 * no authorised photograph.
 */
export const EXPERIENCE_PHOTOS: Record<string, string | undefined> = {
  "exp-education": "exp-education", "exp-competitions": "exp-competitions", "exp-exhibitions": "exp-exhibitions",
  "exp-networking": "exp-networking-desktop", "exp-entertainment": "gal-0q1a0374", "exp-destination": undefined,
};

/** The summit days' photographs (Experience and Programme); July 23, the pre-party, has none. */
export const DAY_PHOTOS: readonly (string | undefined)[] = [undefined, "day-2", "day-3"];

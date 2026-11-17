/**
 * Wording and media for the two photo-and-film sections added for the private
 * preview on 17 Nov 2026: "HEBS 2026 Awards & Competition Moments" (homepage,
 * inside Competitions) and "Watch HEBS 2026" (homepage and Gallery). Kept apart
 * from the owner-approved homepage copy (home-2027.ts): their visible wording is
 * inventoried as page wording (layout-copy-2027.json) like other section labels.
 */

/**
 * Approved House of Snapp trophy, celebration and competition-floor photographs,
 * with no cheque, name, placing or prize in frame. comp-trophy is IMG_7937,
 * cropped to the winner and trophy. Shown while the 2026 Champions block waits
 * for D8 verification.
 */
export const AWARDS = {
  label: "HEBS Lagos 2026",
  title: "HEBS 2026 Awards",
  accent: "& Competition Moments",
  note: "Trophies, celebrations and the competition floor, 24–25 October 2026. Winners and placings are published once the organisers have verified them.",
  photos: ["gal-img_7821", "comp-trophy", "gal-dsc_2148", "gal-dsc_1489"],
} as const;

/**
 * "Watch HEBS 2026": owner-approved footage only (VMM S06, owner media approval
 * of 11 Nov 2026). Clips from the Lagos Event shortlist join only once their
 * exact selection and usage permissions are confirmed. The 2026 site's trailer
 * is not used: most of it is HEBS US footage and it quotes an outdated prize total.
 */
export const WATCH = {
  label: "Watch HEBS 2026",
  title: "Watch",
  accent: "HEBS Lagos 2026.",
  body: "The styling floor at HEBS Lagos 2026, filmed by VMM. More films from the summit days will be added once they are selected.",
  films: [
    { wide: "hero-loop-wide", tall: "hero-loop-tall", title: "The styling floor", meta: "HEBS Lagos 2026 · Film by VMM · 12 seconds, silent" },
  ],
} as const;

/** Every asset the two sections use, by page (for the launch media registry). */
export const WATCH_MEDIA: string[] = WATCH.films.flatMap((f) => [f.wide, f.tall]);

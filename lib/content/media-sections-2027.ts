/**
 * Wording and media for the two photo-and-film sections added for the private
 * preview: "Winners & Prize Presentations" (homepage, inside Competitions) and
 * "Watch HEBS 2026" (homepage and Gallery). Kept apart
 * from the owner-approved homepage copy (home-2027.ts): their visible wording is
 * inventoried as page wording (layout-copy-2027.json) like other section labels.
 */

/**
 * Winners & Prize Presentations (homepage, inside Competitions): genuine on-stage
 * cheque presentations from the House of Snapp collection (review-only champ-*
 * photographs). Internal review only: shown in the protected preview, never on
 * production, and never as verified results. No names, placings or amounts are
 * stated; the D8 verification, including the conflicting Freestyle Braid Art
 * first-place records, is open. The full set is in the Gallery.
 */
export const PRIZES = {
  label: "HEBS Lagos 2026",
  title: "Winners &",
  accent: "Prize Presentations",
  note: "Not for publication. Prize presentations as photographed on 24 and 25 October 2026. Winners, placings and prize amounts are not verified and await the organisers' confirmation.",
  cta: "See every prize presentation",
  photos: ["champ-0q1a0215", "champ-img_7964", "champ-img_8022", "champ-0q1a0190", "champ-0q1a0163", "champ-img_8112"],
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
  body: "Moments from the HEBS Lagos 2026 summit days, filmed by VMM. Choose a film to play. Films marked internal review are candidates for the team and are not cleared for publication.",
  /**
   * The film library, in order. Each film names its register assets and their pixel
   * sizes. A film's status follows its register entry: owner-approved and published,
   * or review-only (shown in the protected preview, marked as not cleared, never on
   * production). A film whose files are absent is simply left out.
   */
  films: [
    { key: "styling-floor", title: "The styling floor", meta: "HEBS Lagos 2026 · Film by VMM · 12 seconds, silent", wide: { id: "hero-loop-wide", w: 960, h: 900 }, tall: { id: "hero-loop-tall", w: 720, h: 1280 } },
  ],
} as const;

/** Every asset the films use (for the launch media registry). */
type FilmCuts = { wide: { id: string }; tall?: { id: string } };
export const WATCH_MEDIA: string[] = (WATCH.films as readonly FilmCuts[]).flatMap((f) => (f.tall ? [f.wide.id, f.tall.id] : [f.wide.id]));

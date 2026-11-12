/**
 * HEBS Lagos 2026 winners, for the "Celebrating the winners" block.
 *
 * Nothing here is invented. Each winner is added only from the approved
 * photograph and verified details supplied by HEBS: competition, placing, the
 * winner's name as they wish it shown, and the prize wording exactly as
 * approved (shown verbatim, never calculated). Until an entry is marked
 * approved it does not render.
 *
 * Internal review shows every competition, a gold placeholder for each one
 * without a confirmed winner, and a count. The public site shows approved
 * winners only, and hides the block entirely while there are none.
 */

import { CATEGORIES, COMPETITIONS } from "../competitions";
import type { DeployEnvironment } from "../publication";

export interface Winner {
  /** Must match a competition name in lib/competitions.ts exactly. */
  competition: string;
  /** As confirmed, e.g. the wording on the approved record. */
  place: string;
  name: string;
  /** Verbatim approved prize wording. */
  prize: string;
  /** Path of the approved photograph. */
  photo: string;
  featured?: boolean;
  approved: boolean;
  /** Who approved this entry for publication, and when. */
  approval?: { by: string; date: string };
}

/** Confirmed winners. Empty until the approved photographs and details arrive. */
export const WINNERS: Winner[] = [];

/**
 * Internal review only: the prize-presentation photographs the owner approved for
 * the Champions review (2026-11-10). They show what each competition's cheque
 * says; they name nobody and state no prize. `place` is the placing printed on
 * the cheque, unverified. None of this ever reaches a production build: the
 * view below drops it there, and the photographs are review media.
 */
export interface ReviewChampion {
  competition: string;
  place: "1st Place" | "2nd Place" | "3rd Place";
  /** Review asset id (lib/assets/home-2027-review.ts). */
  media: string;
  role: "featured" | "highlight" | "card";
  /** Shown with the photograph, e.g. why a 3rd-place presentation stands in. */
  note?: string;
}

export const REVIEW_CHAMPIONS: ReviewChampion[] = [
  { competition: "Freestyle Braid Art Competition", place: "1st Place", media: "champ-img_7897", role: "featured" },
  { competition: "Fast & Flawless Braiding Competition", place: "1st Place", media: "champ-img_7854", role: "featured" },
  { competition: "Battle of the Fades Competition", place: "2nd Place", media: "champ-img_8012", role: "highlight" },
  { competition: "Freestyle Braid Art Competition", place: "3rd Place", media: "champ-dsc_1897", role: "highlight" },
  { competition: "Battle of the Fades Competition", place: "1st Place", media: "champ-img_8022", role: "card" },
  { competition: "Freestyle Design Competition", place: "1st Place", media: "champ-img_8085", role: "card" },
  { competition: "Fast & Flawless Barber Competition", place: "3rd Place", media: "champ-0q1a0290", role: "card",
    note: "3rd-place presentation shown; no usable 1st-place photograph yet" },
  { competition: "Fast & Flawless Braiding Competition", place: "1st Place", media: "champ-dsc_1883", role: "card" },
  { competition: "Freestyle Braid Art Competition", place: "1st Place", media: "champ-img_7895", role: "card" },
  { competition: "Traditional Braiding Competition", place: "1st Place", media: "champ-0q1a0140", role: "card" },
  { competition: "Flawless Frontals Competition", place: "1st Place", media: "champ-0q1a0215", role: "card" },
  { competition: "Bridal Beauty Makeup Competition", place: "1st Place", media: "champ-0q1a0190", role: "card" },
  { competition: "Gilded Heritage Nail Art Competition", place: "1st Place", media: "champ-img_7964", role: "card" },
  { competition: "Roots to Royalty Fashion Runway Competition", place: "1st Place", media: "champ-0q1a0163", role: "card" },
  { competition: "Taste of Culture Food Tasting Competition", place: "1st Place", media: "champ-0q1a0242", role: "card" },
  { competition: "Loc Retwist & Style Competition", place: "1st Place", media: "champ-img_8112", role: "card" },
];

export interface WinnerCard {
  category: string;
  competition: string;
  winner: Winner | null;
  /** Internal review only: the presentation photograph for this competition. */
  review: ReviewChampion | null;
}

export interface WinnersView {
  visible: boolean;
  review: boolean;
  featured: Winner | null;
  /** Internal review only; empty on production. */
  reviewFeatured: ReviewChampion[];
  reviewHighlights: ReviewChampion[];
  cards: WinnerCard[];
  /** Internal-review count, e.g. "0 of 13 confirmed". Null on the public site. */
  count: string | null;
  heading: string;
}

const categoryOf = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

export function winnersView(
  environment: DeployEnvironment,
  winners: readonly Winner[] = WINNERS,
  reviewChampions: readonly ReviewChampion[] = REVIEW_CHAMPIONS,
): WinnersView {
  const review = environment !== "production";
  const ok = winners.filter((w) => w.approved && w.approval);
  const featured = ok.find((w) => w.featured) ?? null;
  const rc = review ? reviewChampions : [];
  const cards: WinnerCard[] = [];
  for (const c of COMPETITIONS) {
    const ws = ok.filter((w) => w.competition === c.name && w !== featured);
    const photo = rc.find((r) => r.role === "card" && r.competition === c.name) ?? null;
    if (ws.length === 0) {
      if (review) cards.push({ category: categoryOf(c.category), competition: c.name, winner: null, review: photo });
      continue;
    }
    for (const w of ws) cards.push({ category: categoryOf(c.category), competition: c.name, winner: w, review: null });
  }
  return {
    visible: review || ok.length > 0,
    review,
    featured,
    reviewFeatured: rc.filter((r) => r.role === "featured"),
    reviewHighlights: rc.filter((r) => r.role === "highlight"),
    cards,
    count: review ? `${ok.length} of ${COMPETITIONS.length} confirmed, shown in review only` : null,
    heading: review ? "All thirteen competitions" : "The 2026 champions",
  };
}

/* Invariants: run at import. */
for (const w of WINNERS) {
  if (!COMPETITIONS.some((c) => c.name === w.competition)) {
    throw new Error(`[winners] unknown competition "${w.competition}"`);
  }
  if (w.approved && !w.approval) throw new Error(`[winners] ${w.name} is approved without a recorded approval`);
}
for (const r of REVIEW_CHAMPIONS) {
  if (!COMPETITIONS.some((c) => c.name === r.competition)) {
    throw new Error(`[winners] review photograph for unknown competition "${r.competition}"`);
  }
}

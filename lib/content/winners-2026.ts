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

export interface WinnerCard {
  category: string;
  competition: string;
  winner: Winner | null;
}

export interface WinnersView {
  visible: boolean;
  review: boolean;
  featured: Winner | null;
  cards: WinnerCard[];
  /** Internal-review count, e.g. "0 of 13 confirmed". Null on the public site. */
  count: string | null;
  heading: string;
}

const categoryOf = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

export function winnersView(environment: DeployEnvironment, winners: readonly Winner[] = WINNERS): WinnersView {
  const review = environment !== "production";
  const ok = winners.filter((w) => w.approved && w.approval);
  const featured = ok.find((w) => w.featured) ?? null;
  const cards: WinnerCard[] = [];
  for (const c of COMPETITIONS) {
    const ws = ok.filter((w) => w.competition === c.name && w !== featured);
    if (ws.length === 0) {
      if (review) cards.push({ category: categoryOf(c.category), competition: c.name, winner: null });
      continue;
    }
    for (const w of ws) cards.push({ category: categoryOf(c.category), competition: c.name, winner: w });
  }
  return {
    visible: review || ok.length > 0,
    review,
    featured,
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

/**
 * HEBS Lagos 2027 edition data.
 *
 * Source: owner directive "HEBS LAGOS 2027 - Official Website Redesign &
 * Development Directive" (HEBS LAGOS 2027.pdf) and the Phase 2A instructions
 * of 2026-10-30.
 *
 * Separation from 2026:
 *   lib/competitions.ts stays the frozen 2026 edition, unchanged. This file reads
 *   from it ONLY what the directive carries forward - competition names, their
 *   categories and prize values ("All 2027 competition categories and prize values
 *   remains the same as 2026"). The carry-over goes through an explicit allowlist
 *   type, so 2026 fees, sessions, event hours, deadlines, ticket prices and the
 *   NGN exchange rate cannot leak into 2027 by accident.
 *
 * Everything 2027 that is not yet approved is typed as `awaiting-confirmation`
 * or `provisional` (see lib/publication.ts) rather than left blank or guessed.
 * The invariants at the bottom run at import, so `next build` fails if this
 * file stops matching the directive.
 */

import { CATEGORIES, COMPETITIONS, TOTAL_PRIZE_USD, type CategorySlug } from "../competitions";
import type { Gated } from "../publication";

const DIRECTIVE = "Owner directive, HEBS LAGOS 2027.pdf";

export const EDITION_YEAR = 2027;

/** Official campaign identity (directive, header and section 4A). */
export const CAMPAIGN = {
  name: "HEBS LAGOS 2027",
  theme: "BIGGER. BOLDER. BEYOND BEAUTY.",
  subheading:
    "Three extraordinary days of beauty, education, innovation, competition, networking, and unforgettable beachfront experiences.",
  datesDisplay: "July 23–25, 2027",
  source: `${DIRECTIVE}, section 4A`,
} as const;

/**
 * Venue. The directive names NJS Royale Beach Resort, but the official name,
 * address and whether all three days share one site are an owner approval gate
 * (decision D9), so the name is provisional and the address is not stated.
 */
export const VENUE = {
  name: {
    status: "provisional",
    value: "NJS Royale Beach Resort",
    note: "Named in the directive; official name and address awaiting confirmation (D9).",
  } satisfies Gated<string>,
  locality: "Lagos, Nigeria",
  address: {
    status: "awaiting-confirmation",
    note: "Street address not confirmed (D9).",
  } satisfies Gated<string>,
  /** Directive, section 4E: "Provide a link to www.njsbeachresort.com." */
  website: "https://www.njsbeachresort.com",
} as const;

export interface EditionDay {
  isoDate: "2027-07-23" | "2027-07-24" | "2027-07-25";
  weekday: "Friday" | "Saturday" | "Sunday";
  /** "July 23" */
  shortDate: string;
  /** Card title from directive section 4C. */
  title: string;
  /** Official name from directive section 2. */
  officialName: string;
  /** Card description from directive section 4C. */
  description: string;
  /** No session times are approved for 2027. */
  hours: Gated<string>;
}

/** Directive sections 2 and 4C. Wording is the directive's own. */
export const EDITION_DAYS: EditionDay[] = [
  {
    isoDate: "2027-07-23",
    weekday: "Friday",
    shortDate: "July 23",
    title: "The Welcome Pre-Party",
    officialName: "HEBS Welcome Pre-Party",
    description: "An exclusive opening celebration introducing guests to the HEBS 2027 experience.",
    hours: { status: "awaiting-confirmation", note: "No 2027 times approved." },
  },
  {
    isoDate: "2027-07-24",
    weekday: "Saturday",
    shortDate: "July 24",
    title: "The Summit Begins",
    officialName: "HEBS Summit Day One",
    description:
      "Professional education, live demonstrations, beauty competitions, exhibitions, and networking.",
    hours: { status: "awaiting-confirmation", note: "No 2027 times approved." },
  },
  {
    isoDate: "2027-07-25",
    weekday: "Sunday",
    shortDate: "July 25",
    title: "The Experience Continues",
    officialName: "HEBS Summit Day Two",
    description:
      "Industry engagement, competitions, learning opportunities, and closing celebrations.",
    hours: { status: "awaiting-confirmation", note: "No 2027 times approved." },
  },
];

/**
 * Countdown target: the first day, midnight in Lagos (WAT, UTC+1, no daylight
 * saving). This is a date, not an event start time - none is approved.
 */
export const COUNTDOWN_TARGET_ISO = "2027-07-23T00:00:00+01:00";

/* ------------------------------------------------------------------ */
/* Competitions - carried forward from 2026 by explicit allowlist      */
/* ------------------------------------------------------------------ */

/** The only competition fields 2027 inherits. Nothing operational. */
export interface CarriedCompetition {
  slug: string;
  name: string;
  category: CategorySlug;
  prizeUsd: number;
  prizeIsUpTo: boolean;
  order: number;
}

/** 2027 operating details. None is approved; each needs fresh owner approval. */
export interface Competition2027 extends CarriedCompetition {
  description: Gated<string>;
  rulesAndEligibility: Gated<string>;
  sessions: Gated<string>;
  entryFee: Gated<string>;
  registrationDeadline: Gated<string>;
  applicationUrl: Gated<string>;
}

const PENDING = (what: string): Gated<string> => ({
  status: "awaiting-confirmation",
  note: `2027 ${what} not approved; 2026 values are not reused.`,
});

export const COMPETITIONS_2027: Competition2027[] = COMPETITIONS.map(
  ({ slug, name, category, prizeUsd, prizeIsUpTo, order }) => ({
    slug,
    name,
    category,
    prizeUsd,
    prizeIsUpTo,
    order,
    description: PENDING("description and format"),
    rulesAndEligibility: PENDING("rules and eligibility"),
    sessions: PENDING("schedule"),
    entryFee: PENDING("entry fee"),
    registrationDeadline: PENDING("registration deadline"),
    applicationUrl: PENDING("application route"),
  }),
);

export const CATEGORIES_2027 = CATEGORIES;
export const COMPETITION_COUNT_2027 = COMPETITIONS_2027.length;
export const CATEGORY_COUNT_2027 = CATEGORIES_2027.length;
export const TOTAL_PRIZE_USD_2027 = COMPETITIONS_2027.reduce((s, c) => s + c.prizeUsd, 0);

/**
 * Prize currency presentation for 2027 is an owner decision (D8): USD only, or
 * USD plus naira at a newly approved rate. The 2026 rate of N1,400 is not reused.
 */
export const PRIZE_TOTAL_DISPLAY_2027: Gated<string> = {
  status: "awaiting-confirmation",
  note: "Currency presentation for 2027 awaiting decision D8.",
};

/* ------------------------------------------------------------------ */
/* Invariants - run at import, so `next build` fails on breakage        */
/* ------------------------------------------------------------------ */

function invariant(condition: boolean, message: string): void {
  if (!condition) throw new Error(`[lib/editions/2027] ${message}`);
}

invariant(COMPETITION_COUNT_2027 === 13, `expected 13 competitions, found ${COMPETITION_COUNT_2027}`);
invariant(CATEGORY_COUNT_2027 === 7, `expected 7 categories, found ${CATEGORY_COUNT_2027}`);
invariant(
  TOTAL_PRIZE_USD_2027 === 87500 && TOTAL_PRIZE_USD_2027 === TOTAL_PRIZE_USD,
  `2027 prize values must equal 2026 ($87,500), computed ${TOTAL_PRIZE_USD_2027}`,
);
for (const c of COMPETITIONS_2027) {
  const prior = COMPETITIONS.find((p) => p.slug === c.slug);
  invariant(
    !!prior && prior.prizeUsd === c.prizeUsd && prior.prizeIsUpTo === c.prizeIsUpTo,
    `${c.slug} prize must match 2026`,
  );
  for (const field of [c.sessions, c.entryFee, c.registrationDeadline] as const) {
    invariant(
      field.status === "awaiting-confirmation",
      `${c.slug} has an operating detail marked ${field.status} without owner approval`,
    );
  }
}
invariant(EDITION_DAYS.length === 3, "2027 runs three days (directive section 2)");
invariant(
  EDITION_DAYS.every((d) => new Date(`${d.isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "Africa/Lagos",
  }) === d.weekday),
  "2027 weekday names must match their dates",
);
invariant(
  EDITION_DAYS.every((d) => d.hours.status === "awaiting-confirmation"),
  "no 2027 day may carry hours until approved",
);

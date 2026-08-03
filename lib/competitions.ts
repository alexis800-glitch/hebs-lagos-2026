/**
 * Single authoritative source for the HEBS Lagos 2026 competition programme.
 *
 * Sources of truth (organiser-supplied, 2026-08-03):
 *   - "Hebs Lagos Competitions. reviewed.docx" - names, categories, descriptions, schedule
 *   - Management price revision, 2026-08-03    - flat N50,000 entry fee, 13th competition
 *   - Competition flyers linked from the doc   - prize ceilings
 *   - Approved concept note review draft       - $87,500 USD / N122,500,000 total
 *
 * Contestant entry fees are quoted in naira only. The approved 2026 price revision
 * sets one flat fee for every competition and withdraws USD entry-fee pricing from
 * the public site, so there is deliberately no `feeUsd` field. Prizes stay in USD.
 *
 * Every competition count, category list, fee, prize, schedule row and total shown
 * anywhere on the site is derived from this file. Do not hard-code those values in
 * components - import them from here so they cannot drift apart.
 *
 * The invariants at the bottom run at module load, so `npm run build` fails loudly
 * if the data stops satisfying the approved programme.
 */

export const REGISTRATION_URL = 'https://hebseventportal.com/register'

/** Approved conversion rate for the 2026 programme: N1,400 per USD. Prizes only. */
export const NGN_PER_USD = 1400

/**
 * Flat contestant entry fee for every competition, in naira.
 * Management decision of 2026-08-03. Never convert this to USD for display.
 */
export const ENTRY_FEE_NGN = 50000

/** "N50,000" - the only entry-fee wording the public site may show. */
export const ENTRY_FEE_DISPLAY = `₦${ENTRY_FEE_NGN.toLocaleString('en-US')}`

export type CategorySlug =
  | 'barbering'
  | 'braiding'
  | 'hair-installation-styling'
  | 'beauty'
  | 'fashion'
  | 'culinary-culture'
  | 'music-live-entertainment'

export interface Category {
  slug: CategorySlug
  /** Display name, exactly as the organiser document writes it. */
  name: string
  order: number
}

/** One scheduled appearance. Taste of Culture has two; every other competition has one. */
export interface Session {
  /** Human date, e.g. "Saturday, October 24, 2026". */
  date: string
  /** Short date for compact UI, e.g. "Sat 24 Oct". */
  shortDate: string
  /** ISO calendar date, for grouping and structured data. */
  isoDate: '2026-10-24' | '2026-10-25'
  /** e.g. "12:30 - 1:00 PM" */
  time: string
  /** e.g. "30 min" */
  duration: string
  /** ISO 8601 start/end, used for JSON-LD subEvents. */
  startIso: string
  endIso: string
}

export interface Competition {
  slug: string
  name: string
  category: CategorySlug
  /** Organiser-supplied description, used verbatim. */
  description: string
  sessions: Session[]
  /** Ready-to-render fee string, or the portal-confirmation wording. Naira only. */
  feeDisplay: string
  /** Numeric entry fee in naira. Null means unconfirmed. */
  feeNgn: number | null
  /** True once the fee is approved for publication. */
  feeConfirmed: boolean
  /** Approved prize ceiling in USD. */
  prizeUsd: number
  /** Flyers word most prizes as "up to"; Roots to Royalty states a flat figure. */
  prizeIsUpTo: boolean
  registrationUrl: string
  order: number
  note?: string
}

export const CATEGORIES: Category[] = [
  { slug: 'barbering', name: 'Barbering', order: 1 },
  { slug: 'braiding', name: 'Braiding', order: 2 },
  { slug: 'hair-installation-styling', name: 'Hair Installation & Styling', order: 3 },
  { slug: 'beauty', name: 'Beauty', order: 4 },
  { slug: 'fashion', name: 'Fashion', order: 5 },
  { slug: 'culinary-culture', name: 'Culinary & Culture', order: 6 },
  { slug: 'music-live-entertainment', name: 'Music & Live Entertainment', order: 7 },
]

const SAT = {
  date: 'Saturday, October 24, 2026',
  shortDate: 'Sat 24 Oct',
  isoDate: '2026-10-24' as const,
}
const SUN = {
  date: 'Sunday, October 25, 2026',
  shortDate: 'Sun 25 Oct',
  isoDate: '2026-10-25' as const,
}

const session = (
  day: typeof SAT | typeof SUN,
  time: string,
  duration: string,
  startIso: string,
  endIso: string,
): Session => ({ ...day, time, duration, startIso, endIso })

export const COMPETITIONS: Competition[] = [
  {
    slug: 'battle-of-the-fades',
    name: 'Battle of the Fades Competition',
    category: 'barbering',
    description:
      'Battle of the Fades focuses on precision, control, and clean barbering execution. Barbers complete a full fade with a properly cut and styled top, demonstrating seamless blending, sharp detailing, balanced structure, and a polished finish. Each haircut should complement the model’s head shape while showcasing strong technical skill and professional presentation.',
    sessions: [session(SAT, '12:30 – 1:00 PM', '30 min', '2026-10-24T12:30:00+01:00', '2026-10-24T13:00:00+01:00')],
    feeDisplay: ENTRY_FEE_DISPLAY,
    feeNgn: ENTRY_FEE_NGN,
    feeConfirmed: true,
    prizeUsd: 5000,
    prizeIsUpTo: true,
    registrationUrl: REGISTRATION_URL,
    order: 1,
  },
  {
    slug: 'freestyle-design',
    name: 'Freestyle Design Competition',
    category: 'barbering',
    description:
      'Freestyle Design explores the intersection of barbering, creativity, and visual art. Barbers create an original haircut design using clean lines, patterns, shapes, and precision detailing. The finished look should be imaginative, balanced, technically clean, and visually impactful from every angle.',
    sessions: [session(SAT, '2:45 – 3:45 PM', '60 min', '2026-10-24T14:45:00+01:00', '2026-10-24T15:45:00+01:00')],
    feeDisplay: ENTRY_FEE_DISPLAY,
    feeNgn: ENTRY_FEE_NGN,
    feeConfirmed: true,
    prizeUsd: 7500,
    prizeIsUpTo: true,
    registrationUrl: REGISTRATION_URL,
    order: 2,
  },
  {
    slug: 'fast-and-flawless-barber',
    name: 'Fast & Flawless Barber Competition',
    category: 'barbering',
    description:
      'The Fast & Flawless Barber Competition is a timed barbering challenge designed to showcase speed, precision, technical control, and professional execution under intense time pressure. Competitors must complete a professional-quality full haircut on one live model within 15 minutes. The finished look must include a clean, consistent full fade extending around the head and over the occipital bone, a sharp and balanced lineup, a properly cut and styled top, and a polished, competition-ready finish.',
    sessions: [session(SUN, '4:00 – 4:15 PM', '15 min', '2026-10-25T16:00:00+01:00', '2026-10-25T16:15:00+01:00')],
    feeDisplay: ENTRY_FEE_DISPLAY,
    feeNgn: ENTRY_FEE_NGN,
    feeConfirmed: true,
    prizeUsd: 5000,
    prizeIsUpTo: true,
    registrationUrl: REGISTRATION_URL,
    order: 3,
  },
  {
    slug: 'fast-and-flawless-braiding',
    name: 'Fast & Flawless Braiding Competition',
    category: 'braiding',
    description:
      'Fast & Flawless Braiding focuses on speed, precision, and natural-hair technique. Braiders complete eight full-head cornrows within 30 minutes using only the model’s natural hair. The finished design should demonstrate clean parting, consistent braid size, even spacing, controlled tension, and polished execution.',
    sessions: [session(SAT, '12:30 – 1:00 PM', '30 min', '2026-10-24T12:30:00+01:00', '2026-10-24T13:00:00+01:00')],
    feeDisplay: ENTRY_FEE_DISPLAY,
    feeNgn: ENTRY_FEE_NGN,
    feeConfirmed: true,
    prizeUsd: 5000,
    prizeIsUpTo: true,
    registrationUrl: REGISTRATION_URL,
    order: 4,
  },
  {
    slug: 'freestyle-braid-art',
    name: 'Freestyle Braid Art Competition',
    category: 'braiding',
    description:
      'Freestyle Braid Art explores creativity, innovation, and technical mastery through braiding. Braiders transform natural hair into intricate works of braid art using original patterns, dimensional structure, creative direction, and artistic detail. The finished design should be cohesive, technically clean, visually impactful, and recognizable as a braid-driven work of art.',
    sessions: [session(SAT, '1:15 – 2:30 PM', '75 min', '2026-10-24T13:15:00+01:00', '2026-10-24T14:30:00+01:00')],
    feeDisplay: ENTRY_FEE_DISPLAY,
    feeNgn: ENTRY_FEE_NGN,
    feeConfirmed: true,
    prizeUsd: 10000,
    prizeIsUpTo: true,
    registrationUrl: REGISTRATION_URL,
    order: 5,
  },
  {
    slug: 'traditional-braiding',
    name: 'Traditional Braiding Competition',
    category: 'braiding',
    description:
      'Traditional Braiding celebrates the artistry, cultural significance, and technical mastery of African braiding traditions. Braiders create a polished natural-hair design inspired by traditional African patterns, techniques, and cultural influence. The finished style should demonstrate precise sectioning, consistent technique, thoughtful design, and respect for traditional braiding artistry.',
    sessions: [session(SUN, '11:30 AM – 12:30 PM', '60 min', '2026-10-25T11:30:00+01:00', '2026-10-25T12:30:00+01:00')],
    feeDisplay: ENTRY_FEE_DISPLAY,
    feeNgn: ENTRY_FEE_NGN,
    feeConfirmed: true,
    prizeUsd: 7500,
    prizeIsUpTo: true,
    registrationUrl: REGISTRATION_URL,
    order: 6,
  },
  {
    slug: 'flawless-frontals',
    name: 'Flawless Frontals Competition',
    category: 'hair-installation-styling',
    description:
      'Flawless Frontals focuses on creating a seamless, natural-looking frontal installation. Stylists customize, place, secure, blend, and style the frontal while complementing the model’s features and desired look. The finished installation should demonstrate a refined hairline, clean application, balanced styling, and a polished finish from every angle.',
    sessions: [session(SUN, '2:45 – 3:45 PM', '60 min', '2026-10-25T14:45:00+01:00', '2026-10-25T15:45:00+01:00')],
    feeDisplay: ENTRY_FEE_DISPLAY,
    feeNgn: ENTRY_FEE_NGN,
    feeConfirmed: true,
    prizeUsd: 5000,
    prizeIsUpTo: true,
    registrationUrl: REGISTRATION_URL,
    order: 7,
  },
  {
    slug: 'bridal-beauty-makeup',
    name: 'Bridal Beauty Makeup Competition',
    category: 'beauty',
    description:
      'Bridal Beauty focuses on creating a radiant, elegant, wedding-ready look. Artists present their interpretation of the modern bride while complementing the model’s features, skin tone, and personal beauty, anywhere from soft and timeless to bold and glamorous. Judged on complexion work, balanced colour, clean application, attention to detail, and long-lasting wear.',
    sessions: [session(SUN, '1:30 – 3:00 PM', '90 min', '2026-10-25T13:30:00+01:00', '2026-10-25T15:00:00+01:00')],
    feeDisplay: ENTRY_FEE_DISPLAY,
    feeNgn: ENTRY_FEE_NGN,
    feeConfirmed: true,
    prizeUsd: 7500,
    prizeIsUpTo: true,
    registrationUrl: REGISTRATION_URL,
    order: 8,
  },
  {
    slug: 'lash-couture',
    name: 'Lash Couture Competition',
    category: 'beauty',
    description:
      'Lash Couture focuses on creating a customized, polished lash look that enhances the model’s natural eye shape. Artists demonstrate precise isolation, controlled placement, symmetry, balance, and thoughtful lash mapping. The finished set should be clean, comfortable, technically sound, and professionally finished.',
    sessions: [session(SUN, '1:45 – 2:30 PM', '45 min', '2026-10-25T13:45:00+01:00', '2026-10-25T14:30:00+01:00')],
    feeDisplay: ENTRY_FEE_DISPLAY,
    feeNgn: ENTRY_FEE_NGN,
    feeConfirmed: true,
    prizeUsd: 5000,
    prizeIsUpTo: true,
    registrationUrl: REGISTRATION_URL,
    order: 9,
  },
  {
    slug: 'gilded-heritage-nail-art',
    name: 'Gilded Heritage Nail Art Competition',
    category: 'beauty',
    description:
      'Gilded Heritage explores culture, craftsmanship, and luxury through nail design. Artists create a complete set inspired by heritage, traditional patterns, precious metals, textiles, jewellery, and cultural detail, using rich colour, gold accents, sculpted elements, intricate pattern, embellishment, and creative texture. The finished set should be original, balanced, technically clean, and a modern take on culture and elegance.',
    sessions: [session(SAT, '2:00 – 3:15 PM', '75 min', '2026-10-24T14:00:00+01:00', '2026-10-24T15:15:00+01:00')],
    feeDisplay: ENTRY_FEE_DISPLAY,
    feeNgn: ENTRY_FEE_NGN,
    feeConfirmed: true,
    prizeUsd: 7500,
    prizeIsUpTo: true,
    registrationUrl: REGISTRATION_URL,
    order: 10,
  },
  {
    slug: 'roots-to-royalty-fashion-runway',
    name: 'Roots to Royalty Fashion Runway Competition',
    category: 'fashion',
    description:
      'Roots to Royalty celebrates the journey from cultural heritage to modern-day royalty. Designers create an original, runway-ready look inspired by ancestry, legacy, leadership, and the spirit of Lagos, using regal silhouettes, bold colour, rich fabric, cultural influence, symbolic detail, and statement accessories. Each look should honour its roots while presenting a fresh, elevated take on royalty, with cultural inspiration represented thoughtfully and respectfully.',
    sessions: [session(SUN, '12:45 – 1:30 PM', '45 min', '2026-10-25T12:45:00+01:00', '2026-10-25T13:30:00+01:00')],
    feeDisplay: ENTRY_FEE_DISPLAY,
    feeNgn: ENTRY_FEE_NGN,
    feeConfirmed: true,
    prizeUsd: 7500,
    // Its flyer states a flat figure rather than a ceiling.
    prizeIsUpTo: false,
    registrationUrl: REGISTRATION_URL,
    order: 11,
  },
  {
    slug: 'taste-of-culture',
    name: 'Taste of Culture Food Tasting Competition',
    category: 'culinary-culture',
    description:
      'Taste of Culture celebrates heritage, community, and creativity through food. Competitors present a dish inspired by their culture, family traditions, regional influence, or personal story. Each entry should demonstrate balanced flavour, thoughtful presentation, quality preparation, and a meaningful connection to the culture it represents.',
    sessions: [
      session(SAT, '12:00 Noon – 5:00 PM', '5 hours', '2026-10-24T12:00:00+01:00', '2026-10-24T17:00:00+01:00'),
      session(SUN, '11:00 AM – 4:00 PM', '5 hours', '2026-10-25T11:00:00+01:00', '2026-10-25T16:00:00+01:00'),
    ],
    feeDisplay: ENTRY_FEE_DISPLAY,
    feeNgn: ENTRY_FEE_NGN,
    feeConfirmed: true,
    prizeUsd: 10000,
    prizeIsUpTo: true,
    registrationUrl: REGISTRATION_URL,
    order: 12,
    note: 'Runs across both event days.',
  },
  {
    slug: 'mic-drop-live-vocalist',
    name: 'Mic Drop Live Vocalist Competition',
    category: 'music-live-entertainment',
    description:
      'Mic Drop celebrates live vocal talent, individuality, and powerful stage performance. Vocalists present a song that showcases their voice, musical interpretation, emotional connection, and personal artistry. Each performance should demonstrate vocal control, confidence, originality, stage presence, and the ability to connect with a live audience.',
    sessions: [session(SAT, '4:00 – 5:15 PM', '75 min', '2026-10-24T16:00:00+01:00', '2026-10-24T17:15:00+01:00')],
    feeDisplay: ENTRY_FEE_DISPLAY,
    feeNgn: ENTRY_FEE_NGN,
    feeConfirmed: true,
    prizeUsd: 5000,
    prizeIsUpTo: true,
    registrationUrl: REGISTRATION_URL,
    order: 13,
  },
]

/* ------------------------------------------------------------------ */
/* Derived values - never hard-code these in components                */
/* ------------------------------------------------------------------ */

export const COMPETITION_COUNT = COMPETITIONS.length
export const CATEGORY_COUNT = CATEGORIES.length

export const TOTAL_PRIZE_USD = COMPETITIONS.reduce((sum, c) => sum + c.prizeUsd, 0)
export const TOTAL_PRIZE_NGN = TOTAL_PRIZE_USD * NGN_PER_USD

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const ngn = (n: number) => `₦${n.toLocaleString('en-US')}`

/** "$87,500" */
export const TOTAL_PRIZE_USD_DISPLAY = usd(TOTAL_PRIZE_USD)
/** "N122,500,000" */
export const TOTAL_PRIZE_NGN_DISPLAY = ngn(TOTAL_PRIZE_NGN)
/** "$87,500 USD / N122,500,000" */
export const TOTAL_PRIZE_DISPLAY = `${TOTAL_PRIZE_USD_DISPLAY} USD / ${TOTAL_PRIZE_NGN_DISPLAY}`

export function prizeDisplay(c: Competition): string {
  return c.prizeIsUpTo ? `Up to ${usd(c.prizeUsd)}` : usd(c.prizeUsd)
}

export function prizeDisplayWithNgn(c: Competition): string {
  return `${prizeDisplay(c)} (${ngn(c.prizeUsd * NGN_PER_USD)})`
}

export function categoryName(slug: CategorySlug): string {
  const found = CATEGORIES.find((c) => c.slug === slug)
  if (!found) throw new Error(`Unknown category slug: ${slug}`)
  return found.name
}

export function competitionsByCategory(slug: CategorySlug): Competition[] {
  return COMPETITIONS.filter((c) => c.category === slug).sort((a, b) => a.order - b.order)
}

/** Categories in display order, each with its competitions. Empty categories are omitted. */
export function groupedByCategory(): { category: Category; competitions: Competition[] }[] {
  return [...CATEGORIES]
    .sort((a, b) => a.order - b.order)
    .map((category) => ({ category, competitions: competitionsByCategory(category.slug) }))
    .filter((g) => g.competitions.length > 0)
}

export interface ScheduleRow {
  competition: Competition
  session: Session
}

export interface ScheduleDay {
  isoDate: string
  date: string
  shortDate: string
  rows: ScheduleRow[]
}

/**
 * Schedule grouped by day and ordered by start time. Overlapping entries are expected
 * and preserved exactly as supplied by the organiser.
 */
export function scheduleByDay(): ScheduleDay[] {
  const days = new Map<string, ScheduleDay>()
  for (const competition of COMPETITIONS) {
    for (const s of competition.sessions) {
      let day = days.get(s.isoDate)
      if (!day) {
        day = { isoDate: s.isoDate, date: s.date, shortDate: s.shortDate, rows: [] }
        days.set(s.isoDate, day)
      }
      day.rows.push({ competition, session: s })
    }
  }
  return Array.from(days.values())
    .sort((a: ScheduleDay, b: ScheduleDay) => a.isoDate.localeCompare(b.isoDate))
    .map((d: ScheduleDay) => ({
      ...d,
      rows: d.rows.sort((a, b) => a.session.startIso.localeCompare(b.session.startIso)),
    }))
}

/** Competitions appearing on more than one day. */
export function multiDayCompetitions(): Competition[] {
  return COMPETITIONS.filter((c) => c.sessions.length > 1)
}

/**
 * Resolves a ?track= value onto a category.
 * Accepts current category slugs plus the retired `barber` alias.
 * Null means "show everything", which is also what the retired `signature` value does.
 */
export function resolveLegacyTrack(track: string | null | undefined): CategorySlug | null {
  if (!track) return null
  if (track === 'barber') return 'barbering'
  const match = CATEGORIES.find((c) => c.slug === track)
  return match ? match.slug : null
}

/** True for retired track values that should trigger the "programme updated" notice. */
export function isRetiredTrack(track: string | null | undefined): boolean {
  return track === 'signature'
}

/* ------------------------------------------------------------------ */
/* Invariants - these run at import, so `next build` fails on breakage */
/* ------------------------------------------------------------------ */

function invariant(condition: boolean, message: string): void {
  if (!condition) throw new Error(`[lib/competitions] ${message}`)
}

invariant(COMPETITION_COUNT === 13, `expected 13 competitions, found ${COMPETITION_COUNT}`)
invariant(CATEGORY_COUNT === 7, `expected 7 categories, found ${CATEGORY_COUNT}`)
invariant(
  competitionsByCategory('barbering').length === 3,
  `expected 3 barbering competitions, found ${competitionsByCategory('barbering').length}`,
)
invariant(
  TOTAL_PRIZE_USD === 87500,
  `prize total must be $87,500, computed ${TOTAL_PRIZE_USD}`,
)
invariant(
  TOTAL_PRIZE_NGN === 122500000,
  `naira prize total must be 122,500,000, computed ${TOTAL_PRIZE_NGN}`,
)
invariant(
  new Set(COMPETITIONS.map((c) => c.slug)).size === COMPETITION_COUNT,
  'competition slugs must be unique',
)
invariant(
  new Set(CATEGORIES.map((c) => c.slug)).size === CATEGORY_COUNT,
  'category slugs must be unique',
)
invariant(
  new Set(COMPETITIONS.map((c) => c.order)).size === COMPETITION_COUNT,
  'competition display order must be unique',
)
for (const c of COMPETITIONS) {
  invariant(c.name.trim().length > 0, `competition ${c.slug} needs a name`)
  invariant(c.description.trim().length > 0, `competition ${c.slug} needs a description`)
  invariant(c.sessions.length > 0, `competition ${c.slug} needs at least one session`)
  invariant(
    CATEGORIES.some((cat) => cat.slug === c.category),
    `competition ${c.slug} has unknown category ${c.category}`,
  )
  invariant(c.prizeUsd > 0, `competition ${c.slug} needs a prize amount`)
  for (const s of c.sessions) {
    invariant(s.date.trim().length > 0, `competition ${c.slug} session needs a date`)
    invariant(s.duration.trim().length > 0, `competition ${c.slug} session needs a duration`)
    invariant(s.time.trim().length > 0, `competition ${c.slug} session needs a time`)
  }
  // A confirmed fee must carry a naira value; an unconfirmed one must not.
  invariant(
    c.feeConfirmed ? c.feeNgn !== null : c.feeNgn === null,
    `competition ${c.slug} has inconsistent fee data`,
  )
  // The 2026 revision sets one flat naira fee, published without any USD equivalent.
  invariant(
    c.feeNgn === ENTRY_FEE_NGN,
    `competition ${c.slug} entry fee must be ${ENTRY_FEE_NGN}, found ${c.feeNgn}`,
  )
  invariant(
    c.feeDisplay === ENTRY_FEE_DISPLAY,
    `competition ${c.slug} must display the entry fee as ${ENTRY_FEE_DISPLAY}`,
  )
  invariant(
    !/\$|USD/i.test(c.feeDisplay),
    `competition ${c.slug} must not publish a USD entry fee`,
  )
}
invariant(
  CATEGORIES.every((cat) => competitionsByCategory(cat.slug).length > 0),
  'every category must contain at least one competition',
)

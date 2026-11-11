/**
 * The recorded sign-off decisions for HEBS Lagos 2027 copy and facts.
 *
 * This file is the record. The review page (/2027/review, previews only) lets a
 * reviewer draft decisions in their own browser and export them; Veridion then
 * adds the exported entries here, so every decision is in Git with who made it,
 * when, and on what authority. Nothing is recorded on anyone's behalf: an entry
 * is added only from a decision the named person actually gave.
 *
 * An approval is bound to the exact wording it approved (`text`). If the copy
 * changes afterwards, the approval no longer applies and the item returns to the
 * review list, so approved status can never carry over to wording nobody saw.
 *
 * Pure data with no imports from the content modules, so the content, the launch
 * gate (lib/launch-2027.ts) and the middleware can all read it.
 */

export type SignoffDecisionKind = "approved" | "revision-required" | "pending-decision";

export interface SignoffDecision {
  /**
   * The sign-off item, e.g. "pages.travel.venue" or "home.welcome.body", or a
   * whole approval block, "block:<id>" (lib/content/signoff-2027.ts, APPROVAL_BLOCKS).
   */
  item: string;
  decision: SignoffDecisionKind;
  /** The exact wording decided on. Required for an approval of one item. */
  text?: string;
  /**
   * For a block: every item in it, with the exact wording decided on, as the
   * approval package showed it. Each item is approved only for that wording.
   */
  texts?: Readonly<Record<string, string>>;
  /** Who decided: "Mrs. Shuler", "HEBS organisers (name)", "Veridion (name)". */
  by: string;
  /** ISO date of the decision. */
  on: string;
  /** Where the decision is evidenced: an email, a meeting note, a signed document. */
  reference: string;
  /** Requested wording or what the decision waits for. */
  note?: string;
}

/** Oldest first; the latest entry for an item is the one that counts. */
export const SIGNOFF_DECISIONS: readonly SignoffDecision[] = [
  // Category A, routine wording for the first launch (homepage, Tickets, navigation and footer).
  {
    item: "block:routine-home",
    decision: "approved",
    by: "Veridion",
    on: "2026-11-11",
    reference: "Veridion content verification of the first-launch routine wording, block reference 0cb9977c; evidence per line in docs/launch/2027-veridion-verification.md. Verified by Claude at Veridion's instruction of 11 Nov 2026.",
    texts: {
      "home.hero.kicker": "HEBS Lagos 2027",
      "home.hero.when": "July 23–25, 2027",
      "home.hero.where": "NJS Beach Resort, Lagos, Nigeria",
      "home.hero.live": "HEBS Lagos 2026, the styling floor",
      "home.hero.ctaSecondary": "Explore the experience",
      "home.welcome.label": "Welcome to HEBS 2027",
      "home.numbers.label": "HEBS Lagos 2027",
      "home.numbers.items.0.label": "Days",
      "home.numbers.items.0.text": "July 23–25, 2027. An opening celebration, then two full summit days.",
      "home.numbers.items.1.label": "Competitions",
      "home.numbers.items.1.text": "Thirteen competitions, with categories and prizes the same as 2026.",
      "home.numbers.items.2.label": "Categories",
      "home.numbers.items.2.text": "Barbering, Braiding, Hair Installation & Styling, Beauty, Fashion, Culinary & Culture, Loc/Styling.",
      "home.days.items.0.date": "July 23",
      "home.days.items.0.title": "The Welcome Pre-Party",
      "home.days.items.0.text": "An exclusive opening celebration introducing guests to the HEBS 2027 experience.",
      "home.days.items.1.date": "July 24",
      "home.days.items.1.title": "The Summit Begins",
      "home.days.items.1.text": "Professional education, live demonstrations, beauty competitions, exhibitions and networking.",
      "home.days.items.2.date": "July 25",
      "home.days.items.2.title": "The Experience Continues",
      "home.days.items.2.text": "Industry engagement, competitions, learning opportunities and closing celebrations.",
      "home.days.cta": "The programme",
      "home.experiences.label": "The HEBS experience",
      "home.experiences.items.0.title": "Professional Beauty Education",
      "home.experiences.items.1.title": "Hair and Beauty Competitions",
      "home.experiences.items.2.title": "Exhibitions and Brand Showcases",
      "home.experiences.items.3.title": "International Networking",
      "home.experiences.items.4.title": "Entertainment and Celebrations",
      "home.experiences.items.5.title": "Luxury Destination Experiences",
      "home.destination.label": "The destination",
      "home.destination.cta": "Explore the destination",
      "home.competitions.label": "Competitions",
      "home.competitions.ctaPrimary": "See the competitions",
      "home.competitions.ctaSecondary": "Rules and eligibility",
      "home.competitions.winners.label": "Celebrating the 2026 winners",
      "home.competitions.winners.note": "Each winner appears only once their approved photograph and verified details are in.",
      "home.highlights.label": "HEBS 2026 highlights",
      "home.highlights.credit": "Photographed at HEBS Lagos 2026",
      "home.sponsors.label": "Sponsors and exhibitors",
      "home.sponsors.offers.0": "Sponsorship",
      "home.sponsors.offers.1": "Exhibition space",
      "home.sponsors.offers.2": "Brand activations",
      "home.sponsors.offers.3": "Strategic partnerships",
      "home.sponsors.ctaPrimary": "Become a sponsor",
      "home.sponsors.ctaSecondary": "Exhibit at HEBS",
      "home.sponsors.caption": "The 2026 hall",
      "home.final.label": "HEBS Lagos 2027",
      "home.final.when": "July 23–25, 2027  |  NJS Beach Resort, Lagos, Nigeria",
      "seo.homeTitle": "HEBS Lagos 2027 | Hair Education Beauty Summit",
      "layout.home.9f9511c48b": "– Days – Hours – Minutes – Seconds",
      "layout.home.0ea58db9e7": "PHOTOGRAPHED HEBS Lagos 2026 at the NJS Royale Events Center, 24 Oct 2026. House of Snapp.",
      "layout.home.edbd493852": "HEBS at NJS, 2026 Photographed",
      "layout.home.d3cb683091": "The summit floor Photographed",
      "layout.home.1c2595a317": "Barbering Braiding Hair Installation & Styling Beauty Fashion Culinary & Culture Loc/Styling Barbering Braiding Hair Installation & Styling Beauty Fashion Culinary & Culture Loc/Styling",
      "layout.home.777333ca30": "HAIR · EDUCATION · BEAUTY · SUMMIT · LAGOS ·",
      "layout.home.59cb14182d": "Film of the 2026 styling floor",
      "layout.home.bce7739928": "Play the styling-floor film",
      "layout.home.72c1d21cd1": "Counting down to July 23, 2027",
      "layout.home.0ee22ae360": "Models in carnival costumes and gowns with guests at HEBS Lagos 2026",
      "layout.home.fbf6d43cfe": "A speaker addressing the audience at HEBS Lagos 2026",
      "layout.home.e419628ea5": "HEBS Lagos 2027 in numbers: 3 days, 13 competitions, 7 categories",
      "layout.home.b7e5351b77": "A performer singing on stage at HEBS Lagos 2026",
      "layout.home.f4e3da7971": "A stylist styling a client's hair at HEBS Lagos 2026",
      "layout.home.7784311f31": "A model in a feathered headdress and gown at HEBS Lagos 2026",
      "layout.home.8e192d5eff": "A stylist demonstrating on a mannequin head at the HEBS stand, 2026",
      "layout.home.80a06ab08b": "A barber competing in front of the 2026 trophies",
      "layout.home.dec917624f": "An exhibitor presenting products at HEBS Lagos 2026",
      "layout.home.17092e65fa": "Two attendees greeting each other at HEBS Lagos 2026",
      "layout.home.40972a2b69": "A speaker with a microphone on stage at HEBS Lagos 2026",
      "layout.home.851fc4c9fb": "Models walking through the hall at HEBS Lagos 2026",
      "layout.home.4fc180f0f3": "A session on stage at HEBS Lagos 2026, NJS Royale Events Center",
      "layout.home.ac42129e22": "A speaker in front of the NJS crest at HEBS Lagos 2026",
      "layout.home.990bb45fc5": "A nail technician at work at HEBS Lagos 2026",
      "layout.home.737ad42d61": "A braider at work at HEBS Lagos 2026",
      "layout.home.41ca744484": "Destination scenes",
      "layout.home.2e2230a07a": "Pause the destination scenes",
      "layout.home.54f56a34be": "A braiding competitor at work, HEBS Lagos 2026",
      "layout.home.665c525c5c": "A winner celebrating beside the HEBS trophy, 2026",
      "layout.home.a9b54743d5": "The seven categories",
      "layout.home.4199de24d9": "A full session at HEBS Lagos 2026",
      "layout.home.9ab373439c": "A wig and styling exhibitor's display at HEBS Lagos 2026",
      "layout.home.03db82b6cc": "Closing film of the 2026 styling floor",
      "layout.home.b86096005d": "Play the closing film",
    },
  },
  {
    item: "block:routine-tickets",
    decision: "approved",
    by: "Veridion",
    on: "2026-11-11",
    reference: "Veridion content verification of the first-launch routine wording, block reference 85b438b9; evidence per line in docs/launch/2027-veridion-verification.md. Verified by Claude at Veridion's instruction of 11 Nov 2026.",
    texts: {
      "pages.tickets.title": "Tickets & registration",
      "pages.tickets.intro": "Tickets for HEBS Lagos 2027 are not on sale yet. Ticket categories, prices and registration open once they are officially approved.",
      "pages.tickets.status": "Ticket sales are not open. No payment is taken through this website until ticket sales are officially opened.",
      "pages.tickets.categories": "Ticket categories and prices are published here once approved.",
      "layout.tickets.82cda900c5": "July 2027",
      "layout.tickets.e409afb22b": "Ticket sales.",
      "layout.tickets.760b0716ca": "Ticket categories.",
      "layout.tickets.8e6cd6c289": "No payment is requested through the priority list.",
      "layout.tickets.1a2d8a3ad8": "Nothing can be submitted here for now, and no personal details are collected. When the list opens, the sign-up form appears in this section.",
      "layout.tickets.ab6675f9a8": "Tickets & registration | HEBS Lagos 2027",
    },
  },
  {
    item: "block:routine-site",
    decision: "approved",
    by: "Veridion",
    on: "2026-11-11",
    reference: "Veridion content verification of the first-launch routine wording, block reference 18f6f91f; evidence per line in docs/launch/2027-veridion-verification.md. Verified by Claude at Veridion's instruction of 11 Nov 2026.",
    texts: {
      "layout.site.4260d60952": "Experience Programme Competitions Education Travel",
      "layout.site.57f5f5efbc": "Menu",
      "layout.site.bbfa773e5a": "Close",
      "layout.site.70f8bb9a8a": "Home",
      "layout.site.6b21fb791a": "About",
      "layout.site.5b5aafe6b9": "Experience",
      "layout.site.8682d73e62": "Programme",
      "layout.site.aaf87fe57a": "Education",
      "layout.site.e10d3eee70": "Speakers",
      "layout.site.5c622a5170": "Tickets",
      "layout.site.22fb76e46f": "Travel",
      "layout.site.9c30a3485a": "Gallery",
      "layout.site.b37456c453": "Contact",
      "layout.site.a2c3f44283": "HEBS Lagos 2027 home",
      "layout.site.62bce9422f": "Main",
      "layout.site.897fae50cd": "All HEBS 2027 pages",
      "layout.site.0a4470d64e": "Skip to content",
      "layout.site.527617b32e": "The priority list is not open yet.",
      "layout.site.508e91d0b6": "HEBS, Hair Education Beauty Summit",
      "layout.site.b6223b97ec": "Lagos",
      "layout.site.e7ce5ba37b": "HEBS 2027 experience",
      "layout.site.f1fa8fd60c": "Take part",
      "layout.site.b8ee41860e": "Sponsorship & partnerships",
      "layout.site.ee79c420a6": "Plan your visit",
      "layout.site.c9e85e00e6": "© {year} Hair Education Beauty Summit. All rights reserved.",
      "layout.site.9db108ba6b": "Privacy Policy",
      "layout.site.e6e178ccc8": "Cookie Policy",
      "layout.site.e7d3061b5e": "Cookie preferences",
      "layout.site.b0651ff59c": "HEBS Lagos 2027, July 23–25, 2027",
      "layout.site.94912f1544": "HEBS",
      "layout.site.64e0cfdcb9": "2027",
    },
  },
];

/** The decision that currently stands for `item`, made on the item itself or on a block that includes it. */
export function latestDecision(item: string, decisions: readonly SignoffDecision[] = SIGNOFF_DECISIONS): SignoffDecision | undefined {
  for (let i = decisions.length - 1; i >= 0; i--) {
    const d = decisions[i];
    if (d.item === item || (d.texts && item in d.texts)) return d;
  }
  return undefined;
}

/** Whether `text` at `item` carries a standing approval of exactly that wording. */
export function wordingApproved(item: string, text: string, decisions: readonly SignoffDecision[] = SIGNOFF_DECISIONS): boolean {
  const d = latestDecision(item, decisions);
  if (d?.decision !== "approved") return false;
  return d.item === item ? d.text === text : d.texts?.[item] === text;
}

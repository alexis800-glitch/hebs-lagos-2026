/**
 * The HEBS Lagos 2027 site map: the thirteen pages of directive section 5, in
 * the directive's order, with where each one lives on staging and whether it
 * is built.
 *
 * Every link between 2027 pages is taken from here, so a page that is not built
 * yet can never be linked to, and moving the site from /2027 to the root at
 * publication is one change (BASE).
 */

/** Staging prefix. The 2026 site keeps the root until publication is approved. */
export const BASE = "/2027";

export type PageId =
  | "home" | "about" | "experience" | "programme" | "education" | "competitions" | "speakers"
  | "exhibitors" | "sponsorship" | "tickets" | "travel" | "gallery" | "contact";

export interface SitePage {
  id: PageId;
  /** The directive's page name, in sentence case. */
  title: string;
  /** Short label for the navigation. */
  nav: string;
  path: string;
  /** Directive section 5, what the page holds. */
  purpose: string;
  built: boolean;
  /** What the finished page still needs. Empty = nothing beyond approvals already tracked. */
  waitingOn: string[];
}

const page = (id: PageId, title: string, nav: string, slug: string, purpose: string, built: boolean, waitingOn: string[] = []): SitePage =>
  ({ id, title, nav, path: slug ? `${BASE}/${slug}` : `${BASE}/homepage`, purpose, built, waitingOn });

export const SITE_PAGES: SitePage[] = [
  page("home", "Home", "Home", "", "The complete premium landing page.", true),
  page("about", "About HEBS", "About", "about", "History, mission, vision, purpose and impact on the beauty industry.", false,
    ["Owner-approved history, mission and vision copy"]),
  page("experience", "HEBS 2027 experience", "Experience", "experience", "Overview of the three-day event and planned activities.", true,
    ["Approved event and resort photography"]),
  page("programme", "Event programme", "Programme", "programme", "A detailed daily schedule, updated as programming is confirmed.", true,
    ["Confirmed 2027 sessions and times"]),
  page("education", "Education & masterclasses", "Education", "education", "Training opportunities, educators, learning tracks and registration details.", true,
    ["Confirmed educators and sessions", "Education registration route (D1)"]),
  page("competitions", "Competitions", "Competitions", "competitions", "Categories, rules, eligibility, applications and awards.", true,
    ["2027 rules, eligibility, fees, schedule and deadline", "Prize currency presentation (D8)", "Application route (D1)"]),
  page("speakers", "Speakers & educators", "Speakers", "speakers", "Professional profiles, biographies, photographs and sessions.", false,
    ["At least one officially confirmed speaker or educator"]),
  page("exhibitors", "Exhibitors", "Exhibitors", "exhibitors", "Exhibition opportunities, application forms and confirmed participating brands.", true,
    ["Exhibitor application route (D1)", "Confirmed participating brands"]),
  page("sponsorship", "Sponsorship & partnerships", "Sponsorship", "sponsorship", "Partnership opportunities, sponsorship packages, inquiry forms and contact details.", true,
    ["Sponsor inquiry route (D1)", "Approved 2027 prospectus and packages", "Public contacts (D10)"]),
  page("tickets", "Tickets & registration", "Tickets", "tickets", "Ticket categories, registration forms and payment when ticket sales officially open.", false,
    ["Ticket categories, prices and payment gateway approval", "Ticketing route (D1)"]),
  page("travel", "Travel & accommodation", "Travel", "travel", "Venue information, transport, accommodation, travel information and international visitor guidance.", true,
    ["Venue address and directions (D9)", "Approved accommodation packages", "Visitor support contacts (D10)"]),
  page("gallery", "Gallery & past events", "Gallery", "gallery", "HEBS event history, photographs, videos, testimonials and highlights.", false,
    ["Approved HEBS Lagos 2026 photographs, video and testimonials"]),
  page("contact", "Contact us", "Contact", "contact", "Contact form, official email addresses, social media links and business inquiries.", false,
    ["Public contacts and social accounts (D10)", "Contact route (D1)"]),
];

export function sitePage(id: PageId): SitePage {
  const p = SITE_PAGES.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown 2027 page: ${id}`);
  return p;
}

/** The path of a built page, or null when it is not built yet (render text, not a link). */
export function pageHref(id: PageId, hash = ""): string | null {
  const p = sitePage(id);
  return p.built ? `${p.path}${hash ? `#${hash}` : ""}` : null;
}

/** Where every "Join the 2027 Priority List" button leads. */
export const PRIORITY_HREF = `${BASE}/homepage#priority-list`;

/** Main navigation: the built guest and partner pages, in directive order. */
export const SITE_NAV = SITE_PAGES.filter((p) => p.built && p.id !== "home").map((p) => ({ label: p.nav, href: p.path }));

if (SITE_PAGES.length !== 13) throw new Error("[lib/site/2027] directive section 5 lists thirteen pages");

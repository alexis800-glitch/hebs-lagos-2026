/**
 * Links from the 2027 website to the booking system on the private Base44 test
 * copy, for staging integration only.
 *
 * The website never takes a booking, a payment or a booking lookup itself. Each
 * journey is a plain link to the portal, which owns reservation, payment,
 * confirmation, the QR pass and "my booking":
 *   - buy tickets             -> <portal origin>/2027/tickets
 *   - competition registration -> <portal origin>/2027/compete?category=<code>
 *   - my booking              -> <portal origin>/2027/booking
 * Education registration stays "Opens soon": the portal has no such page yet.
 * The sandbox checkout (/2027/pay) is never linked: payment stays inside the
 * portal's own booking journey.
 *
 * One setting decides where the links point: HEBS_STAGING_PORTAL_ORIGIN, the
 * test copy's page origin, typed by the owner into Vercel (Preview scope of the
 * test branch). It is honoured only on a Preview of the private test branch
 * (PRIVATE_TEST.branch); everywhere else, production included, every booking
 * link stays closed and the pages say "Opens soon". The live portal is refused.
 * Production booking links follow the same contract without the test dataset
 * (PRODUCTION_PORTAL below). They stay closed until the 2027 production portal
 * passes acceptance with this website and its origin is approved.
 *
 * Every link also carries base44_data_env=dev, so the copy serves its test
 * dataset (booking open, sandbox payments) rather than its main data.
 *
 * The competition codes and their parameter are copied exactly from booking
 * contract v1.0, which is kept privately outside Git. Its public extract,
 * tests/fixtures/booking-contract-v1.0-competitions.json (codes and exact names
 * only), is what tests/booking-2027.test.ts checks them against. No Base44
 * preview token is ever added: the tester's browser holds its own.
 */
import { PRIVATE_TEST } from "../forms-2027/private-test.mjs";
import type { Gated } from "../publication";
import { TICKET_SALES } from "./registration-2027";
// The return link: the website's own origin, added in the browser (portal-site.ts, PortalReturn).
export { SITE_PARAM, siteOrigin, withSite } from "./portal-site";
import { COMPETITIONS } from "../competitions";

export type BookingJourney = "tickets" | "compete" | "booking";

/** The portal paths, as specified for the 2027 booking system. */
export const BOOKING_PATHS: Readonly<Record<BookingJourney, string>> = {
  tickets: "/2027/tickets",
  compete: "/2027/compete",
  booking: "/2027/booking",
};

/** Competition codes from booking contract v1.0, by the website's competition slug (lib/competitions.ts). */
export const COMPETITION_CODES: Readonly<Record<string, string>> = {
  "battle-of-the-fades": "BOF",
  "freestyle-design": "FDB",
  "fast-and-flawless-barber": "FFR",
  "fast-and-flawless-braiding": "FFB",
  "freestyle-braid-art": "FBA",
  "traditional-braiding": "TBC",
  "flawless-frontals": "FLF",
  "bridal-beauty-makeup": "MKP",
  "lash-couture": "LSH",
  "gilded-heritage-nail-art": "NAL",
  "roots-to-royalty-fashion-runway": "FRW",
  "taste-of-culture": "TOC",
  "loc-retwist-and-style": "LRS",
};

/**
 * The only competition codes the portal accepts: booking contract v1.0, confirmed
 * unchanged for the 2027 production candidate by Claude Desktop (18 Nov 2026). A
 * code outside this list is never put on a link, whatever table is passed in.
 */
export const CONTRACT_COMPETITION_CODES: readonly string[] = [
  "BOF", "FDB", "FFR", "FFB", "FBA", "TBC", "FLF", "MKP", "LSH", "NAL", "FRW", "TOC", "LRS",
];

/** The query parameter the portal reads the competition code from (booking contract v1.0, section 2). */
export const COMPETITION_CODE_PARAM: string | null = "category";

/** The copy's test dataset, selected on every staging link (contract annex A, section 3). */
export const STAGING_DATA_ENV = { param: "base44_data_env", value: "dev" } as const;

const LIVE_PORTAL_HOST = /(^|\.)hebseventportal\.com$/i;

type Env = Record<string, string | undefined>;
const runtimeEnv = (): Env => ({
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
  HEBS_CLIENT_PREVIEW: process.env.HEBS_CLIENT_PREVIEW,
  HEBS_STAGING_PORTAL_ORIGIN: process.env.HEBS_STAGING_PORTAL_ORIGIN,
});

/** Why the staging portal origin is not used, or null when it is. */
export function stagingOriginRefusal(env: Env = runtimeEnv()): string | null {
  if (env.VERCEL_ENV !== "preview" || env.HEBS_CLIENT_PREVIEW === "on") return "booking links are staging-only (test branch Preview)";
  if (env.VERCEL_GIT_COMMIT_REF !== PRIVATE_TEST.branch) return "booking links run only on the private test branch";
  const raw = env.HEBS_STAGING_PORTAL_ORIGIN;
  if (!raw) return "HEBS_STAGING_PORTAL_ORIGIN is not set";
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return "HEBS_STAGING_PORTAL_ORIGIN is not a URL";
  }
  if (u.protocol !== "https:") return "the portal origin must be https";
  if (u.username || u.password || u.search || u.hash || (u.pathname !== "/" && u.pathname !== "")) return "the portal origin must be an origin only";
  if (LIVE_PORTAL_HOST.test(u.hostname) || raw.includes(PRIVATE_TEST.liveAppId)) return "the live portal is not configured here";
  return null;
}

/** The staging portal origin, or null (every booking link closed). */
export function stagingPortalOrigin(env: Env = runtimeEnv()): string | null {
  return stagingOriginRefusal(env) ? null : new URL(env.HEBS_STAGING_PORTAL_ORIGIN!).origin;
}

/**
 * The 2027 production portal: the same three journeys (tickets, compete, booking)
 * with no test dataset, no sandbox and no preview token. Closed until BOTH:
 *   - Claude Desktop's production portal passes acceptance together with this
 *     website, and the owner approves its origin (status "approved");
 *   - its host is listed in PRODUCTION_PORTAL_HOSTS.
 * Setting them is a reviewed commit, never an environment variable, so a stray
 * setting cannot open real bookings.
 */
export const PRODUCTION_PORTAL: Gated<string> = {
  status: "awaiting-confirmation",
  // Paths, codes and live-data isolation confirmed by Claude Desktop (18 Nov 2026). The
  // public domain is proposed but not yet connected or approved, so no origin is set
  // here and every production link fails closed.
  note: "2027 production portal domain not yet connected or approved; paths and codes confirmed 18 Nov 2026.",
};

/**
 * The website origins the portal's "Back to website" accepts as `site` (portal
 * handoff, Claude Desktop, 17 Nov 2026): the production domain, with or without
 * www, and a deployment's own Vercel host. A branch alias (…-git-…) is not
 * accepted. The website sends window.location.origin (portal-site.ts), so on
 * production that is https://www.hebslagos.com.
 */
export const PORTAL_RETURN_ORIGIN = /^https:\/\/((www\.)?hebslagos\.com|hebs-lagos-2026-[a-z0-9]+-veridion-systems-projects\.vercel\.app)$/;

/** The only return origins a production deployment sends: the public domain, with or without www. */
export const PUBLIC_RETURN_ORIGIN = /^https:\/\/(www\.)?hebslagos\.com$/;

/**
 * Which website origins may be sent as `site` on production booking links, as a
 * pattern source for the browser (PortalReturn), or undefined when production links
 * are not in use (staging links keep their existing behaviour unchanged).
 *   - production: hebslagos.com and www.hebslagos.com only, so a visitor on a
 *     *.vercel.app host never sends it after public launch;
 *   - the launch PR's protected Preview: also the deployment's own host, for joint
 *     acceptance testing only.
 */
export function portalReturnRule(env: Env = runtimeEnv(), p: ProductionPortal = PRODUCTION): string | undefined {
  if (stagingPortalOrigin(env) || !productionPortalOrigin(env, p)) return undefined;
  return (env.VERCEL_ENV === "production" ? PUBLIC_RETURN_ORIGIN : PORTAL_RETURN_ORIGIN).source;
}

/** Hosts a production booking link may point at. Empty until the production portal is accepted. */
export const PRODUCTION_PORTAL_HOSTS: readonly string[] = [];

export interface ProductionPortal {
  portal: Gated<string>;
  hosts: readonly string[];
  /** Ticket sales need approved prices and an approved payment gateway (registration-2027.ts). */
  ticketSales: { prices: boolean; payment: boolean };
}

const PRODUCTION: ProductionPortal = { portal: PRODUCTION_PORTAL, hosts: PRODUCTION_PORTAL_HOSTS, ticketSales: TICKET_SALES };

/** Why the production portal origin is not used, or null when it is. */
export function productionOriginRefusal(env: Env = runtimeEnv(), p: ProductionPortal = PRODUCTION): string | null {
  // Production, or a Preview of any branch except the private test branch (the launch PR's
  // preview, where the website and the production portal are accepted together). Never the
  // client design preview, never development.
  if (env.HEBS_CLIENT_PREVIEW === "on") return "the client design preview never links to the portal";
  if (env.VERCEL_ENV !== "production" && env.VERCEL_ENV !== "preview") return "production booking links run only on Vercel deployments";
  if (env.VERCEL_ENV === "preview" && env.VERCEL_GIT_COMMIT_REF === PRIVATE_TEST.branch) return "the private test branch uses the staging portal";
  if (p.portal.status !== "approved") return "the 2027 production portal is not approved";
  let u: URL;
  try {
    u = new URL(p.portal.value);
  } catch {
    return "the production portal origin is not a URL";
  }
  if (u.protocol !== "https:") return "the portal origin must be https";
  if (u.username || u.password || u.search || u.hash || (u.pathname !== "/" && u.pathname !== "")) return "the portal origin must be an origin only";
  if (!p.hosts.includes(u.hostname)) return "the production portal host is not listed";
  if (u.hostname.startsWith("preview--") || p.portal.value.includes(PRIVATE_TEST.appId)) return "a test copy or Base44 preview is never the production portal";
  // The 2027 production portal is its own Base44 app; the 2026 live app is never its address.
  if (p.portal.value.includes(PRIVATE_TEST.liveAppId)) return "the 2026 live portal app is not the 2027 production portal";
  return null;
}

/** The approved production portal origin, or null. */
export function productionPortalOrigin(env: Env = runtimeEnv(), p: ProductionPortal = PRODUCTION): string | null {
  return productionOriginRefusal(env, p) || p.portal.status !== "approved" ? null : new URL(p.portal.value).origin;
}

export interface BookingContractValues {
  codes: Readonly<Record<string, string>>;
  param: string | null;
}

/** A booking link, or null ("Opens soon"). Competition registration also needs the competition's contract code. */
export function bookingLink(
  journey: BookingJourney,
  competitionSlug?: string,
  env: Env = runtimeEnv(),
  contract: BookingContractValues = { codes: COMPETITION_CODES, param: COMPETITION_CODE_PARAM },
  production: ProductionPortal = PRODUCTION,
): string | null {
  const staging = stagingPortalOrigin(env);
  const origin = staging ?? productionPortalOrigin(env, production);
  if (!origin) return null;
  // Production sells tickets only once prices and the payment gateway are approved.
  if (!staging && journey === "tickets" && !(production.ticketSales.prices && production.ticketSales.payment)) return null;
  const url = new URL(BOOKING_PATHS[journey], origin);
  if (journey === "compete") {
    // Own keys only (never an inherited property such as "constructor"), and only a contract code.
    const code = competitionSlug && Object.prototype.hasOwnProperty.call(contract.codes, competitionSlug) ? contract.codes[competitionSlug] : undefined;
    if (typeof code !== "string" || !CONTRACT_COMPETITION_CODES.includes(code) || !contract.param) return null;
    url.searchParams.set(contract.param, code);
  }
  // The copy's test dataset, on staging links only. Production links never carry it.
  if (staging) url.searchParams.set(STAGING_DATA_ENV.param, STAGING_DATA_ENV.value);
  return url.toString();
}

/**
 * What is wrong with a set of competition codes, or an empty list: exactly one
 * unique code for each of the 13 competitions, three capital letters as the
 * contract defines them (tests/booking-2027.test.ts).
 */
export function competitionCodeProblems(codes: Readonly<Record<string, string>>): string[] {
  const slugs = COMPETITIONS.map((c) => c.slug);
  const out: string[] = [];
  for (const s of slugs) if (!codes[s]?.trim()) out.push(`no code for ${s}`);
  for (const [k, v] of Object.entries(codes)) if (v?.trim() && !/^[A-Z]{3}$/.test(v)) out.push(`${k}: code ${v} is not three capital letters`);
  for (const k of Object.keys(codes)) if (!slugs.includes(k)) out.push(`${k} is not a competition`);
  const values = Object.values(codes);
  if (new Set(values).size !== values.length) out.push("codes are not unique");
  return out;
}

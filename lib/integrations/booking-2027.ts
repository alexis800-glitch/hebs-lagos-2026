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
 * Production booking links are a separate, later decision (not configured here).
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
): string | null {
  const origin = stagingPortalOrigin(env);
  if (!origin) return null;
  const url = new URL(BOOKING_PATHS[journey], origin);
  if (journey === "compete") {
    const code = competitionSlug ? contract.codes[competitionSlug] : undefined;
    if (!code || !contract.param) return null;
    url.searchParams.set(contract.param, code);
  }
  url.searchParams.set(STAGING_DATA_ENV.param, STAGING_DATA_ENV.value);
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

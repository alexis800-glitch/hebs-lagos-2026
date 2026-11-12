/**
 * Server-side configuration of HEBS 2027 form submission. Read only on the
 * server (the route handler); nothing here is ever sent to the browser.
 *
 * Modes, failing closed at every step:
 *   off    - default. Forms render disabled; the route accepts nothing.
 *   mock   - local development and tests only: a mock portal, synthetic data.
 *            Refused on any Vercel deployment.
 *   portal - the real Base44 portal. Needs the final integration contract
 *            (CONTRACT.final), all three portal settings and a shared rate-limit
 *            store; on production it also needs HEBS_FORMS_PRODUCTION_APPROVED=yes.
 *   private-test - the private end-to-end test with the Base44 test copy only
 *            (lib/forms-2027/private-test.mjs): Vercel Preview of the test
 *            branch only, the copy's exact URL and app id, a shared store, the
 *            synthetic TEST-ONLY-NOT-D13 notice, synthetic addresses only, no
 *            uploads. Does not need CONTRACT.final, which stays false.
 *
 * Test and production use different secrets and URLs, set per Vercel
 * environment. None is ever committed.
 */
import { deployEnvironment, type DeployEnvironment } from "../publication";
import { FORMS_OPEN, type FormId } from "../integrations/registration-2027";
import { CONTRACT, NOTICE_VERSIONS, PROFILE_ACCEPTED, type NoticeVersions } from "./contract";
import { PRIVATE_TEST, PUBLISHED_SECRETS } from "./private-test.mjs";

// The test-only notice is never the real one (run sheet P5); a failure here stops the build.
if (NOTICE_VERSIONS.privacy === PRIVATE_TEST.noticeVersion || NOTICE_VERSIONS.consent === PRIVATE_TEST.noticeVersion) {
  throw new Error("NOTICE_VERSIONS must never be the TEST-ONLY-NOT-D13 notice");
}

/**
 * Real company-profile uploads. Off until malware scanning or secure quarantine
 * is approved (contract v1.1 open item O-3). The checks run in mock mode only.
 */
export const UPLOADS_ENABLED = false;

export type SubmitMode = "off" | "mock" | "portal" | "private-test";

export interface StoreConfig {
  kind: "rest" | "memory";
  url?: string;
  token?: string;
}

export interface SubmitConfig {
  environment: DeployEnvironment;
  mode: SubmitMode;
  /** Why the mode is off, for the server log (never shown to visitors). */
  reason?: string;
  portal?: { url: string; appId: string; secret: string };
  store: StoreConfig | null;
  /** Salt for hashing visitor IP addresses before they are used as rate-limit keys. */
  ipSalt: string | null;
  /** Privacy-notice and consent versions sent with each submission (D13). */
  notices: NoticeVersions;
  /** Whether a company-profile PDF may be uploaded. */
  uploads: boolean;
  /**
   * Private test only: the operator token that authorises the E0 reachability
   * probe (HEBS_PRIVATE_TEST_PROBE_TOKEN). Server only; absent means no probe.
   */
  probeToken?: string;
}

type Env = Record<string, string | undefined>;

function storeFrom(env: Env, environment: DeployEnvironment): StoreConfig | null {
  const url = env.HEBS_RATE_LIMIT_REST_URL ?? env.KV_REST_API_URL ?? env.UPSTASH_REDIS_REST_URL;
  const token = env.HEBS_RATE_LIMIT_REST_TOKEN ?? env.KV_REST_API_TOKEN ?? env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token && url.startsWith("https://")) return { kind: "rest", url, token };
  // Memory is per instance, so it is never a rate limiter on Vercel; development only.
  return environment === "development" ? { kind: "memory" } : null;
}

export function submitConfig(env: Env = process.env): SubmitConfig {
  const environment = deployEnvironment(env);
  const store = storeFrom(env, environment);
  const ipSalt = env.HEBS_RATE_LIMIT_SALT ?? (environment === "development" ? "development-only-salt" : null);
  const off = (reason: string): SubmitConfig => ({ environment, mode: "off", reason, store, ipSalt, notices: NOTICE_VERSIONS, uploads: false });
  const wanted = env.HEBS_FORMS_MODE ?? "off";

  if (wanted === "mock") {
    if (environment !== "development") return off("mock mode is refused on Vercel deployments");
    return {
      environment, mode: "mock", store, ipSalt,
      portal: { url: "https://mock.portal.invalid/evSubmitPublicForm", appId: "mock-app", secret: MOCK_SECRET },
      notices: MOCK_NOTICES,
      // Local testing of the upload path only, and only once the contract accepts profiles again.
      uploads: PROFILE_ACCEPTED && env.HEBS_FORMS_MOCK_UPLOADS === "yes",
    };
  }
  if (wanted === "private-test") {
    // The same rules as the build guard, checked again at run time.
    if (environment !== "preview") return off("private-test runs only on Vercel Preview");
    if (env.VERCEL_GIT_COMMIT_REF !== PRIVATE_TEST.branch) return off("private-test runs only on the test branch");
    const url = env.HEBS_PORTAL_FORM_URL;
    const appId = env.HEBS_PORTAL_APP_ID;
    const secret = env.HEBS_PORTAL_FORM_SECRET;
    if (appId === PRIVATE_TEST.liveAppId || (url ?? "").includes(PRIVATE_TEST.liveAppId)) return off("private-test never targets the live portal");
    if (url !== PRIVATE_TEST.url || appId !== PRIVATE_TEST.appId) return off("private-test targets the private test copy only");
    if (!secret || secret.length < 32 || PUBLISHED_SECRETS.includes(secret)) return off("private-test secret missing, short or published");
    if (store?.kind !== "rest" || !ipSalt || ipSalt.length < 16) return off("private-test needs the shared store and a salt of 16+ characters");
    return {
      environment, mode: "private-test", store, ipSalt, portal: { url, appId, secret },
      notices: TEST_NOTICES, uploads: false, probeToken: probeTokenFrom(env.HEBS_PRIVATE_TEST_PROBE_TOKEN, secret),
    };
  }
  if (wanted !== "portal") return off("HEBS_FORMS_MODE is not set");
  if (!CONTRACT.final) return off(`integration contract ${CONTRACT.version} is not final`);
  const url = env.HEBS_PORTAL_FORM_URL;
  const appId = env.HEBS_PORTAL_APP_ID;
  const secret = env.HEBS_PORTAL_FORM_SECRET;
  if (!url || !url.startsWith("https://") || !appId || !secret || secret.length < 32) return off("portal settings incomplete");
  if (!store || !ipSalt) return off("no shared rate-limit store or salt");
  if (environment === "production" && env.HEBS_FORMS_PRODUCTION_APPROVED !== "yes") return off("production forms not approved");
  return { environment, mode: "portal", store, ipSalt, portal: { url, appId, secret }, notices: NOTICE_VERSIONS, uploads: UPLOADS_ENABLED && PROFILE_ACCEPTED };
}

/** Synthetic notice versions for the mock portal; real versions come with the approved privacy notice (D13). */
export const MOCK_NOTICES: NoticeVersions = { privacy: "mock-2027-00", consent: "mock-2027-00" };

/** A usable E0 operator token: 32+ characters, not the signing secret and not a published value. */
function probeTokenFrom(token: string | undefined, secret: string): string | undefined {
  if (!token || token.length < 32 || token === secret || PUBLISHED_SECRETS.includes(token)) return undefined;
  return token;
}

/** The private test's synthetic-only notice (run sheet P5), for privacy and the optional marketing box alike. */
export const TEST_NOTICES: NoticeVersions = { privacy: PRIVATE_TEST.noticeVersion, consent: PRIVATE_TEST.noticeVersion };

/**
 * Private test only: the synthetic identity convention of
 * docs/integration/private-e2e-test/TEST-PLAN-E0-E12.md, checked on the
 * server, so every test record is plainly synthetic and no real person,
 * company or address can be entered. Other modes never apply it.
 */
export const SYNTHETIC = {
  /** The reserved test domain (RFC 6761 .test): never delivers to anyone. */
  email: /^[a-z0-9._+-]+@hebs-e2e\.test$/i,
  /** Names and companies: "TEST" in capitals, then the rest of the name. */
  name: /^TEST\s+\S/,
  /** +234 800 000 0000 to 0099, spaces optional. */
  phoneDigits: /^23480000000\d{2}$/,
  /** Social handles: "TEST" or "@test", any case. */
  social: /^@?test/i,
} as const;

const NAME_FIELDS = ["full_name", "contact_name", "company_name"] as const;

/** Website-field errors for values that break the synthetic convention; empty when all are synthetic. */
export function syntheticIdentityErrors(values: Record<string, unknown>): Record<string, string> {
  const errors: Record<string, string> = {};
  const given = (k: string) => (typeof values[k] === "string" && values[k] !== "" ? (values[k] as string) : null);
  const email = given("email");
  if (!email || !SYNTHETIC.email.test(email)) errors.email = "This test accepts only made-up addresses ending in @hebs-e2e.test.";
  for (const k of NAME_FIELDS) {
    const v = given(k);
    if (v !== null && !SYNTHETIC.name.test(v)) errors[k] = 'This test accepts only made-up names starting with "TEST ".';
  }
  const phone = given("phone");
  if (phone !== null && !SYNTHETIC.phoneDigits.test(phone.replace(/[\s()+-]/g, ""))) {
    errors.phone = "This test accepts only +234 800 000 0000 to +234 800 000 0099.";
  }
  const site = given("website_url");
  if (site !== null) {
    let host = "";
    try { host = new URL(site).hostname.toLowerCase(); } catch { host = ""; }
    if (host !== "hebs-e2e.test" && !host.endsWith(".hebs-e2e.test")) errors.website_url = "This test accepts only addresses on hebs-e2e.test.";
  }
  const social = given("social_media");
  if (social !== null && !SYNTHETIC.social.test(social)) errors.social_media = 'This test accepts only made-up handles starting with "TEST".';
  return errors;
}

/** The mock portal's secret: synthetic, development and tests only. */
export const MOCK_SECRET = "mock-secret-synthetic-not-for-use-0123456789abcdef";

/**
 * Whether a form accepts submissions. Mock mode opens every form locally for
 * testing; the private test sends every form to the test copy, which keeps
 * each one closed (403 not_open, "Opens soon") until its admin opens it under
 * run sheet P7; the real portal also needs the owner's FORMS_OPEN switch.
 */
export function formEnabled(form: FormId, cfg: SubmitConfig): boolean {
  if (cfg.mode === "mock" || cfg.mode === "private-test") return true;
  // A real form also needs the approved privacy notice it refers to.
  return cfg.mode === "portal" && FORMS_OPEN[form] && !!cfg.notices.privacy;
}

/** Whether this deployment submits to a test system (the local mock, or the private test copy), so the forms under test are shown. */
export function formsUnderTest(cfg: SubmitConfig = submitConfig()): boolean {
  return cfg.mode === "mock" || cfg.mode === "private-test";
}

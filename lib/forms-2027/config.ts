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
 *
 * Test and production use different secrets and URLs, set per Vercel
 * environment. None is ever committed.
 */
import { deployEnvironment, type DeployEnvironment } from "../publication";
import { FORMS_OPEN, type FormId } from "../integrations/registration-2027";
import { CONTRACT, NOTICE_VERSIONS, type NoticeVersions } from "./contract";

/**
 * Real company-profile uploads. Off until malware scanning or secure quarantine
 * is approved (contract v1.1 open item O-3). The checks run in mock mode only.
 */
export const UPLOADS_ENABLED = false;

export type SubmitMode = "off" | "mock" | "portal";

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
      // Local testing of the upload path only; never real files on a deployment.
      uploads: env.HEBS_FORMS_MOCK_UPLOADS === "yes",
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
  return { environment, mode: "portal", store, ipSalt, portal: { url, appId, secret }, notices: NOTICE_VERSIONS, uploads: UPLOADS_ENABLED };
}

/** Synthetic notice versions for the mock portal; real versions come with the approved privacy notice (D13). */
export const MOCK_NOTICES: NoticeVersions = { privacy: "mock-2027-00", consent: "mock-2027-00" };

/** The mock portal's secret: synthetic, development and tests only. */
export const MOCK_SECRET = "mock-secret-synthetic-not-for-use-0123456789abcdef";

/**
 * Whether a form accepts submissions. Mock mode opens every form locally for
 * testing; the real portal also needs the owner's FORMS_OPEN switch.
 */
export function formEnabled(form: FormId, cfg: SubmitConfig): boolean {
  if (cfg.mode === "mock") return true;
  // A real form also needs the approved privacy notice it refers to.
  return cfg.mode === "portal" && FORMS_OPEN[form] && !!cfg.notices.privacy;
}

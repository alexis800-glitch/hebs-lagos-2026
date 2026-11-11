/**
 * Server-side configuration of HEBS 2027 form submission. Read only on the
 * server (the route handler); nothing here is ever sent to the browser.
 *
 * Modes, failing closed at every step:
 *   off    - default. Forms render disabled; the route accepts nothing.
 *   mock   - local development and tests only: a mock portal, synthetic data.
 *            Refused on any Vercel deployment.
 *   staging - the private Base44 TEST copy, for integration testing: protected
 *            preview deployments and local development only, never production
 *            (nor the client design-review preview, which renders as production).
 *            Its own settings (HEBS_STAGING_PORTAL_*), set by the owner; the
 *            endpoint must have the contract's form (section 2) and must not be
 *            the live portal. Every form is offered; the test copy's own per-form
 *            flags decide what it accepts (403 not_open shows as closed).
 *   portal - the real Base44 portal. Needs the final integration contract
 *            (CONTRACT.final), all three portal settings and a shared rate-limit
 *            store; on production it also needs HEBS_FORMS_PRODUCTION_APPROVED=yes.
 *
 * Test and production use different secrets and URLs, set per Vercel
 * environment. None is ever committed.
 */
import { createHash } from "node:crypto";
import { deployEnvironment, type DeployEnvironment } from "../publication";
import { FORMS_OPEN, type FormId } from "../integrations/registration-2027";
import { CONTRACT, NOTICE_VERSIONS, PROFILE_ACCEPTED, type NoticeVersions } from "./contract";

/**
 * Real company-profile uploads. Off until malware scanning or secure quarantine
 * is approved (contract v1.1 open item O-3). The checks run in mock mode only.
 */
export const UPLOADS_ENABLED = false;

export type SubmitMode = "off" | "mock" | "staging" | "portal";

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
  /** Submissions allowed per visitor per 10 minutes (RATE_LIMIT.max unless a staging run raises it). */
  rateLimitMax?: number;
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
  if (wanted === "staging") return stagingConfig(env, environment, store, ipSalt, off);
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

/** The mock portal's secret: synthetic, development and tests only. */
export const MOCK_SECRET = "mock-secret-synthetic-not-for-use-0123456789abcdef";

/**
 * Whether a form accepts submissions. Mock mode opens every form locally for
 * testing; the real portal also needs the owner's FORMS_OPEN switch.
 */
export function formEnabled(form: FormId, cfg: SubmitConfig): boolean {
  if (cfg.mode === "mock") return true;
  // Staging offers every form; the test copy's per-form flags decide what it accepts.
  if (cfg.mode === "staging") return true;
  // A real form also needs the approved privacy notice it refers to.
  return cfg.mode === "portal" && FORMS_OPEN[form] && !!cfg.notices.privacy;
}

/**
 * The live portal, which staging must never reach: its app id by SHA-256 (the id
 * itself is not committed) and its public host.
 */
const LIVE_APP_ID_SHA256 = "e190eb6ffff5f64c4f0bd1a057d354d0fc4b8961e6d9a7e6d8cfc5fb92feb1e5";
const LIVE_PORTAL_HOST = /(^|\.)hebseventportal\.com$/i;

/** Privacy-notice and consent versions sent to the test copy: plainly test values, never the approved notice. */
export const STAGING_NOTICES: NoticeVersions = { privacy: "staging-2027-00", consent: "staging-2027-00" };

/** Why a staging endpoint is refused, or null. Contract v1.1 section 2: https://<portal host>/api/apps/<app id>/functions/evSubmitPublicForm. */
export function stagingEndpointRefusal(url: string | undefined, appId: string | undefined): string | null {
  if (!url || !appId) return "staging portal URL or app id missing";
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return "staging portal URL is not a URL";
  }
  if (u.protocol !== "https:") return "staging portal URL is not https";
  if (LIVE_PORTAL_HOST.test(u.hostname)) return "staging may not call the live portal host";
  if (createHash("sha256").update(appId).digest("hex") === LIVE_APP_ID_SHA256) return "staging may not call the live portal app";
  if (u.pathname !== `/api/apps/${appId}/functions/evSubmitPublicForm`) return "staging portal URL does not match the contract endpoint for this app id";
  return null;
}

function stagingConfig(env: Env, environment: DeployEnvironment, store: StoreConfig | null, ipSalt: string | null, off: (r: string) => SubmitConfig): SubmitConfig {
  if (environment === "production") return off("staging mode is refused on production and on the client preview");
  const url = env.HEBS_STAGING_PORTAL_FORM_URL;
  const appId = env.HEBS_STAGING_PORTAL_APP_ID;
  const secret = env.HEBS_STAGING_PORTAL_FORM_SECRET;
  const refusal = stagingEndpointRefusal(url, appId);
  if (refusal) return off(refusal);
  if (!secret || secret.length < 32) return off("staging portal secret missing or shorter than 32 characters");
  // A shared store keeps one client_request_id per attempt across instances. Memory is accepted for a
  // staging run only when asked for: a resend landing on another instance could then make a second test record.
  const s = store ?? (env.HEBS_STAGING_ALLOW_MEMORY_STORE === "yes" ? { kind: "memory" as const } : null);
  const salt = ipSalt ?? (env.HEBS_STAGING_ALLOW_MEMORY_STORE === "yes" ? "staging-only-salt" : null);
  if (!s || !salt) return off("no shared rate-limit store for staging");
  const max = Number(env.HEBS_STAGING_RATE_LIMIT_MAX);
  return {
    environment, mode: "staging", store: s, ipSalt: salt,
    portal: { url: url!, appId: appId!, secret },
    notices: STAGING_NOTICES, uploads: false,
    rateLimitMax: Number.isInteger(max) && max > 0 ? Math.min(max, 100) : undefined,
  };
}

/** Whether this deployment submits to a test system (the mock, or the Base44 test copy), so every form says so. */
export function formsUnderTest(cfg: SubmitConfig = submitConfig()): boolean {
  return cfg.mode === "mock" || cfg.mode === "staging";
}

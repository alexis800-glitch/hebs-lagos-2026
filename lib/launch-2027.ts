/**
 * The one place the HEBS Lagos 2027 website is published.
 *
 * Until launch, production answers every 2027 address as a missing page. The
 * site opens on production only when ALL of these hold, and stays closed if any
 * one fails (see `launchBlockers`):
 *   - LAUNCH_2027.authorisation records the owner's written authorisation;
 *   - every 2027 copy block, fact, media slot and launch item is approved;
 *   - no published page relies on review media (public/_review is never served
 *     on production, so such a page would show placeholders);
 *   - no form is switched on without its approved contract and privacy notice;
 *   - the canonical web address is approved (D7);
 *   - the emergency switch HEBS_2027_WITHHOLD is not "on".
 * Only the pages listed in LAUNCH_2027.pages are published; every other 2027
 * address stays a missing page, and nothing links to it.
 *
 * Previews and development are unchanged: they show the full staging site.
 * The launch and rollback procedure is docs/launch/LAUNCH-2027.md.
 *
 * Everything here is static data, safe for the Edge runtime (middleware).
 */
import { PAGES } from "./content/2027-pages";
import { previewStatuses } from "./content/2027";
import { CONTRACT, NOTICE_VERSIONS } from "./forms-2027/contract";
import { FORMS_OPEN, type FormId } from "./integrations/registration-2027";
import { REVIEW_ASSETS } from "./assets/home-2027-review";
import { isPagePublishable, type DeployEnvironment, type PublicationStatus } from "./publication";
import { BASE, SITE_PAGES, type PageId } from "./site/2027";
import { LAUNCH_2027, type LaunchConfig } from "./launch-2027-config";

export { LAUNCH_2027, type LaunchAuthorisation, type LaunchConfig } from "./launch-2027-config";

/**
 * Review media each page renders: owner-authorised material for the private
 * preview only (lib/assets/home-2027-review.ts). Production never serves it.
 */
export const REVIEW_MEDIA_BY_PAGE: Partial<Record<PageId, readonly string[]>> = {
  home: REVIEW_ASSETS.filter((a) => !/^(edu|gal)-/.test(a.id)).map((a) => a.id),
  education: REVIEW_ASSETS.filter((a) => a.id.startsWith("edu-")).map((a) => a.id).concat(["exp-education", "welcome-inset", "sp-hall"]),
  gallery: PAGES.gallery.categories.flatMap((c) => c.photos),
};

export interface LaunchBlocker {
  /** Stable key, for tests and the checklist. */
  id: string;
  requirement: string;
  detail: string;
}

export interface LaunchInputs {
  config?: LaunchConfig;
  statuses?: readonly PublicationStatus[];
  formsOpen?: Readonly<Record<FormId, boolean>>;
  contractFinal?: boolean;
  privacyNotice?: string | null;
  withhold?: string | undefined;
  reviewMedia?: Partial<Record<PageId, readonly string[]>>;
}

/**
 * Every mandatory launch requirement that is not met. An empty list is the only
 * state in which production may serve the 2027 site.
 */
export function launchBlockers({
  config = LAUNCH_2027,
  statuses = previewStatuses(),
  formsOpen = FORMS_OPEN,
  contractFinal = CONTRACT.final,
  privacyNotice = NOTICE_VERSIONS.privacy,
  withhold = undefined,
  reviewMedia = REVIEW_MEDIA_BY_PAGE,
}: LaunchInputs = {}): LaunchBlocker[] {
  const out: LaunchBlocker[] = [];
  const add = (id: string, requirement: string, detail: string) => out.push({ id, requirement, detail });

  if (withhold === "on") add("withhold", "Emergency withholding is off", "HEBS_2027_WITHHOLD is \"on\", so the 2027 site is withheld.");
  if (!config.authorisation || !config.authorisation.by || !config.authorisation.on || !config.authorisation.reference) {
    add("authorisation", "Written launch authorisation recorded", "LAUNCH_2027.authorisation is empty.");
  }
  if (config.pages.length === 0 || !config.pages.includes("home")) {
    add("pages", "Pages chosen for launch, including the homepage", "LAUNCH_2027.pages does not list the homepage.");
  }
  if (config.pages.length > 0 && !config.pages.includes("tickets")) {
    add("pages-tickets", "The Tickets page is launched", "Every priority-list button leads to the Tickets page, so it must be published with the homepage.");
  }
  for (const id of config.pages) {
    const p = SITE_PAGES.find((x) => x.id === id);
    if (!p?.built) add(`page-${id}`, "Every launched page is built", `${id} is not built.`);
  }
  const pending = statuses.filter((s) => s !== "approved").length;
  if (pending > 0) {
    add("approvals", "Every 2027 copy block, fact, media slot and launch item approved", `${pending} of ${statuses.length} items are not approved.`);
  }
  for (const id of config.pages) {
    const media = reviewMedia[id] ?? [];
    if (media.length > 0) {
      const unrecorded = REVIEW_ASSETS.filter((a) => media.includes(a.id) && a.rights.permission !== "recorded").length;
      add(
        `review-media-${id}`,
        "No launched page relies on review media",
        `${id} renders ${media.length} review items (${unrecorded} without recorded written usage terms); each must be cleared and moved into the rights-gated register.`,
      );
    }
  }
  for (const form of Object.keys(formsOpen) as FormId[]) {
    if (formsOpen[form] && (!contractFinal || !privacyNotice)) {
      add(`form-${form}`, "No form opens without its final contract and privacy notice", `${form} is switched on without a final contract (D1) or an approved privacy notice (D13).`);
    }
  }
  if (config.origin.status !== "approved") {
    add("origin", "Canonical web address approved", config.origin.status === "awaiting-confirmation" ? config.origin.note : `${config.origin.value}: ${config.origin.note}`);
  }
  return out;
}

/** The emergency switch, read literally so Next.js passes it to middleware. */
export const withholdSwitch = (): string | undefined => process.env.HEBS_2027_WITHHOLD;

/**
 * Whether the 2027 site is open in `environment`. Previews and development keep
 * today's staging rule; production needs an empty blocker list.
 */
export function site2027Open(environment: DeployEnvironment, inputs: LaunchInputs = {}): boolean {
  if (environment !== "production") return isPagePublishable(inputs.statuses ?? previewStatuses(), environment);
  return launchBlockers({ withhold: withholdSwitch(), ...inputs }).length === 0;
}

/** Whether one 2027 page may be served in `environment`. */
export function pagePublished(id: PageId, environment: DeployEnvironment, inputs: LaunchInputs = {}): boolean {
  if (!site2027Open(environment, inputs)) return false;
  if (environment !== "production") return true;
  return (inputs.config ?? LAUNCH_2027).pages.includes(id);
}

/** Addresses under /2027 that are not pages but belong to the published site. */
const siteFiles = () => [`${BASE}/sitemap.xml`, `${BASE}/social-card`];

/** Whether a /2027 address may be served in `environment`. Unknown addresses fall through to Next.js's 404. */
export function pathPublished(pathname: string, environment: DeployEnvironment, inputs: LaunchInputs = {}): boolean {
  if (!site2027Open(environment, inputs)) return false;
  if (environment !== "production") return true;
  const path = pathname.replace(/\/$/, "") || "/";
  if (siteFiles().includes(path)) return true;
  const page = SITE_PAGES.find((p) => p.path === path);
  return page ? pagePublished(page.id, environment, inputs) : false;
}

/** The canonical origin: the approved address on production, the provisional one elsewhere for review. */
export function siteOrigin(config: LaunchConfig = LAUNCH_2027): string {
  return config.origin.status === "awaiting-confirmation" ? "https://www.hebslagos.com" : config.origin.value;
}

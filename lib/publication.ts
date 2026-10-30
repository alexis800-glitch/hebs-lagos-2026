/**
 * Publication states for HEBS 2027 content.
 *
 * Every 2027 fact, piece of copy and media slot carries one of these states, so
 * the site can tell approved material from material still waiting on the owner.
 *
 *   approved               - signed off by the owner; may appear on a public page
 *   provisional            - usable in a staging preview, clearly marked, not approved
 *   awaiting-confirmation  - the fact does not exist yet; render "To be announced"
 *   draft                  - work in progress; never rendered outside development
 *
 * The rule the guard enforces: a production deployment may only render
 * `approved` material. Anything else fails closed - the page is withheld, not
 * shown with unapproved content in it.
 */

export type PublicationStatus = "approved" | "provisional" | "awaiting-confirmation" | "draft";

/** A value whose approval state travels with it. */
export type Gated<T> =
  | { status: "approved"; value: T; source: string }
  | { status: "provisional"; value: T; note: string }
  | { status: "awaiting-confirmation"; note: string }
  | { status: "draft"; value: T; note: string };

export type DeployEnvironment = "production" | "preview" | "development";

/** The environment this build is for. Vercel sets VERCEL_ENV; local builds are development. */
export function deployEnvironment(env: Record<string, string | undefined> = process.env): DeployEnvironment {
  if (env.VERCEL_ENV === "production") return "production";
  if (env.VERCEL_ENV === "preview") return "preview";
  return "development";
}

/** Whether material in `status` may be rendered in `environment`. */
export function isRenderable(status: PublicationStatus, environment: DeployEnvironment): boolean {
  if (environment === "production") return status === "approved";
  if (environment === "preview") return status !== "draft";
  return true;
}

/**
 * Whether a page built from these statuses may be served in `environment`.
 * One unapproved item is enough to withhold a production page.
 */
export function isPagePublishable(
  statuses: readonly PublicationStatus[],
  environment: DeployEnvironment,
): boolean {
  return statuses.every((s) => isRenderable(s, environment));
}

/** The value if it exists and may be shown, otherwise null (render "To be announced"). */
export function gatedValue<T>(field: Gated<T>, environment: DeployEnvironment): T | null {
  if (field.status === "awaiting-confirmation") return null;
  return isRenderable(field.status, environment) ? field.value : null;
}

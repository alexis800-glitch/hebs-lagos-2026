import { existsSync } from "node:fs";
import { join } from "node:path";
import { findReviewAsset, type ReviewAsset } from "@/lib/assets/home-2027-review";
import { deployEnvironment, type DeployEnvironment } from "@/lib/publication";

/**
 * Review media is the owner-authorised HEBS Lagos 2026 and NJS material for the
 * private 2027 preview. It is never committed (public/_review/ is gitignored),
 * so it can only be present in a local checkout or in a deployment built from
 * one. It renders:
 *   - in local development, when the file is present;
 *   - in a preview deployment built with HEBS_REVIEW_MEDIA=on (set only on the
 *     CLI deploy of the protected review preview, never as a project setting),
 *     when the file is present;
 *   - never on production.
 * Anywhere else the labelled placeholder is shown instead.
 */
export function reviewMediaAllowed(
  environment: DeployEnvironment = deployEnvironment(),
  env: Record<string, string | undefined> = process.env,
): boolean {
  if (environment === "production") return false;
  if (environment === "development") return true;
  return env.HEBS_REVIEW_MEDIA === "on";
}

/**
 * Media approved and prepared for publication (asset.published) renders on
 * production too, once its page is published; until launch every such page is
 * withheld, and so is /2027/media/ itself. Review-only media never does.
 */
export function reviewMedia(
  id: string,
  environment: DeployEnvironment = deployEnvironment(),
  env: Record<string, string | undefined> = process.env,
): ReviewAsset | null {
  const asset = findReviewAsset(id);
  const allowed = asset.published ? environment === "production" || reviewMediaAllowed(environment, env) : reviewMediaAllowed(environment, env);
  if (!allowed) return null;
  return existsSync(join(process.cwd(), "public", asset.src)) ? asset : null;
}

export function reviewSrc(id: string): string | null {
  return reviewMedia(id)?.src ?? null;
}

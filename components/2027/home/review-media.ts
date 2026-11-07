import { existsSync } from "node:fs";
import { join } from "node:path";
import { findReviewAsset, type ReviewAsset } from "@/lib/assets/home-2027-review";
import { deployEnvironment, type DeployEnvironment } from "@/lib/publication";

/**
 * Review media is shown only in local development and only when the file is
 * present in the gitignored public/_review/ folder. A clean checkout, a preview
 * build and a production build therefore get the labelled placeholder.
 */
export function reviewMedia(id: string, environment: DeployEnvironment = deployEnvironment()): ReviewAsset | null {
  const asset = findReviewAsset(id);
  if (environment !== "development") return null;
  return existsSync(join(process.cwd(), "public", asset.src)) ? asset : null;
}

export function reviewSrc(id: string): string | null {
  return reviewMedia(id)?.src ?? null;
}

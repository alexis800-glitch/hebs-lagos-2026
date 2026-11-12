/**
 * The media prepared for publication on the 2027 site: every file of every
 * approved asset (lib/assets/home-2027-review.ts, `published`), with the SHA-256
 * of the exact file approved.
 *
 * `npm run media:prepare` copies the files from the review folder into
 * public/2027/media/ and records their hashes in published-media-2027.json;
 * tests/published-media-2027.test.ts checks both. The folder is gitignored while
 * the site is closed, because this repository is public: the launch commit adds
 * the files, removes the ignore rule and sets MEDIA_RELEASED, and the launch gate
 * (lib/launch-2027.ts) refuses to open any page that shows media before then.
 */
import manifest from "./published-media-2027.json";
import type { ReviewAsset } from "./home-2027-review";

/** True only in the launch commit that adds public/2027/media/ to the repository. */
export const MEDIA_RELEASED = false;

export const PUBLISHED_MEDIA: Readonly<Record<string, string>> = manifest.files;

/** The file names one asset is served from: the main file, its pre-cut widths and a film's poster. */
export function assetFiles(a: Pick<ReviewAsset, "src" | "widths" | "fullWidth" | "poster">): string[] {
  const name = (p: string) => p.slice(p.lastIndexOf("/") + 1);
  const widths = (a.widths ?? []).filter((w) => w !== a.fullWidth).map((w) => name(a.src).replace(/\.(webp|png|jpe?g)$/, `-${w}.webp`));
  return [name(a.src), ...widths, ...(a.poster ? [name(a.poster)] : [])];
}

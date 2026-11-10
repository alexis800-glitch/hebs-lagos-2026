/* eslint-disable @next/next/no-img-element -- review files are local-only and never optimised or deployed */
import type { CSSProperties } from "react";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { findReviewAsset, type ReviewAsset } from "@/lib/assets/home-2027-review";
import { reviewMedia, reviewSrc } from "./review-media";
import { SmartVideo } from "./client";

export { reviewMedia, reviewSrc };

/** srcset for a review image cut in several widths, or undefined. */
export function srcSetOf(a: ReviewAsset): string | undefined {
  return a.widths
    ?.map((w) => `${w === a.fullWidth ? a.src : a.src.replace(/\.(webp|png|jpe?g)$/, `-${w}.webp`)} ${w}w`)
    .join(", ");
}

/**
 * An image held for review, or the placeholder when it isn't available.
 * Images load lazily unless `priority` (first screen), and pick the closest
 * pre-cut width for the slot described by `sizes`.
 */
export function Pic({
  id, className, style, alt, sizes = "(max-width: 600px) 100vw, 600px", priority = false,
}: { id: string; className?: string; style?: CSSProperties; alt?: string; sizes?: string; priority?: boolean }) {
  const a = reviewMedia(id);
  if (!a) {
    const label = alt ?? findReviewAsset(id).alt;
    return label ? (
      <div className="rv" role="img" aria-label={`${label} (held for review)`}>Image held for review</div>
    ) : (
      <div className="rv" aria-hidden="true">Image held for review</div>
    );
  }
  const srcSet = srcSetOf(a);
  return (
    <img
      className={className}
      src={a.src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt ?? a.alt}
      style={style}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
    />
  );
}

const posterOf = (a: ReviewAsset) => (a.poster && existsSync(join(process.cwd(), "public", a.poster)) ? a.poster : undefined);

/**
 * A film with separate desktop and phone crops. Its first-frame still shows at
 * once and stays whenever the film cannot or should not play; the film itself
 * loads only when needed (see SmartVideo). Placeholder when unavailable.
 */
export function Clip({
  wide, tall, id, label, loop = false, autoPlay = false, priority = false,
}: { wide: string; tall: string; id?: string; label: string; loop?: boolean; autoPlay?: boolean; priority?: boolean }) {
  const w = reviewMedia(wide);
  const t = reviewMedia(tall);
  if (!w || !t) return <div className="rv" role="img" aria-label="Film held for review">Film held for review</div>;
  return (
    <SmartVideo
      id={id}
      wide={w.src}
      tall={t.src}
      widePoster={posterOf(w)}
      tallPoster={posterOf(t)}
      label={label}
      loop={loop}
      autoPlay={autoPlay}
      priority={priority}
    />
  );
}

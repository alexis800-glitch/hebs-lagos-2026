/* eslint-disable @next/next/no-img-element -- review files are local-only and never optimised or deployed */
import type { CSSProperties } from "react";
import { findReviewAsset } from "@/lib/assets/home-2027-review";
import { reviewMedia, reviewSrc } from "./review-media";

export { reviewMedia, reviewSrc };

/** An image held for review, or the placeholder when it isn't available. */
export function Pic({ id, className, style, alt }: { id: string; className?: string; style?: CSSProperties; alt?: string }) {
  const a = reviewMedia(id);
  if (!a) {
    const label = alt ?? findReviewAsset(id).alt;
    return label ? (
      <div className="rv" role="img" aria-label={`${label} (held for review)`}>Image held for review</div>
    ) : (
      <div className="rv" aria-hidden="true">Image held for review</div>
    );
  }
  return <img className={className} src={a.src} alt={alt ?? a.alt} style={style} />;
}

/** A clip with separate desktop and phone crops; placeholder when unavailable. */
export function Clip({
  wide,
  tall,
  poster,
  loop = false,
  autoPlay = false,
}: {
  wide: string;
  tall: string;
  poster?: string;
  loop?: boolean;
  autoPlay?: boolean;
}) {
  const w = reviewSrc(wide);
  const t = reviewSrc(tall);
  if (!w || !t) return <div className="rv" role="img" aria-label="Film held for review">Film held for review</div>;
  return (
    <video muted playsInline preload="auto" loop={loop} autoPlay={autoPlay} poster={poster ? reviewSrc(poster) ?? undefined : undefined}>
      <source media="(max-width: 600px)" src={t} type="video/mp4" />
      <source src={w} type="video/mp4" />
    </video>
  );
}

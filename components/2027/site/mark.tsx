/* eslint-disable @next/next/no-img-element -- review files are local-only; the official mark is a small static logo */
import { reviewMedia, srcSetOf } from "@/components/2027/home/media";

/** Official mark, used whenever the provisional 2027 mark isn't loaded for review. */
const OFFICIAL_MARK = "/assets/logos/hebs_logo_nav.png";

/**
 * The HEBS Lagos 2027 mark, the same on every 2027 page: the provisional 2027
 * mark in internal review (awaiting Mrs. Shuler's approval, A1), the official
 * HEBS mark everywhere else. Loaded as 240/480 px WebP cuts.
 */
export function Mark({ className = "logo", sizes = "(max-width: 600px) 84px, (max-width: 1279px) 96px, 108px", lazy = false }: { className?: string; sizes?: string; lazy?: boolean }) {
  const provisional = reviewMedia("mark-2027-a");
  if (!provisional) return <img className={className} src={OFFICIAL_MARK} alt="HEBS, Hair Education Beauty Summit" />;
  // The 520 px PNG master is kept for reference; pages load the 240/480 px WebP cuts.
  return <img className={className} src={provisional.src.replace(/\.png$/, "-480.webp")} srcSet={srcSetOf(provisional)} sizes={sizes} width={520} height={487} alt={provisional.alt} loading={lazy ? "lazy" : "eager"} decoding="async" />;
}

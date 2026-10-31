import Image from "next/image";
import { resolveSlot } from "@/lib/assets/register";
import type { DeployEnvironment } from "@/lib/publication";

/**
 * Renders a media slot from the asset register. Unapproved or missing media
 * becomes a labelled placeholder naming what it is waiting for; it is never
 * filled with stock, generated or unrelated imagery.
 */
export default function MediaFrame({
  slotId,
  environment,
  ratio = "aspect-[4/3]",
  className = "",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  fill = false,
}: {
  slotId: string;
  environment: DeployEnvironment;
  ratio?: string;
  className?: string;
  sizes?: string;
  /** Cover the nearest positioned ancestor (e.g. a hero background) instead of sizing by ratio. */
  fill?: boolean;
}) {
  const resolved = resolveSlot(slotId, environment);
  const box = fill ? "absolute inset-0" : `relative ${ratio}`;

  if (resolved.kind === "asset") {
    return (
      <div className={`${box} overflow-hidden ${className}`}>
        <Image src={resolved.asset.src} alt={resolved.asset.alt} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  return (
    <figure
      className={`${box} flex overflow-hidden border border-dashed border-h27-ocean-light/40 bg-gradient-to-br from-h27-ink-2 via-h27-ink to-h27-ocean/30 ${className}`}
      data-media-slot={resolved.slot.id}
      data-media-state="pending"
    >
      <figcaption className="mt-auto p-4 sm:p-5">
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-h27-ocean-light">
          Pending approved media
        </span>
        <span className="mt-1 block font-serif text-lg text-h27-ivory">{resolved.slot.label}</span>
        <span className="mt-1 block text-xs leading-relaxed text-h27-muted">Needs: {resolved.reason}</span>
      </figcaption>
    </figure>
  );
}

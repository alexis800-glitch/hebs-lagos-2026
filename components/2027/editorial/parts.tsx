/**
 * Shared parts of the Direction A pages: staging notes, register-backed image
 * positions, the brand and the navigation.
 */
import Image from "next/image";
import { findAsset, resolveSlot, type MediaSlot } from "@/lib/assets/register";
import type { DeployEnvironment } from "@/lib/publication";
import { C, GROUND, type BrandVariant, type Ground } from "./tokens";

export interface Opts {
  environment: DeployEnvironment;
  brand: BrandVariant;
  /** Staging notes beside what they qualify (true) or listed after the page (false). */
  inline: boolean;
}

/** Internal staging label. Never part of the design; removed before publication. */
export function StagingNote({ children, light = false, className = "" }: { children: React.ReactNode; light?: boolean; className?: string }) {
  return (
    <span
      className={`inline-block max-w-full border border-dashed px-2 py-1 text-[11px] leading-snug ${className}`}
      style={light ? { borderColor: "#5E5034", color: "#33291A" } : { borderColor: "rgba(200,169,106,.55)", color: "rgba(245,239,228,.82)" }}
    >
      Staging note: {children}
    </span>
  );
}

/** A section's staging notes, in inline mode only. */
export function SectionNotes({ notes, opts, ground, className = "" }: { notes: string[]; opts: Opts; ground: Ground; className?: string }) {
  if (!opts.inline || notes.length === 0) return null;
  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      {notes.map((n) => <StagingNote key={n} light={GROUND[ground].light}>{n}</StagingNote>)}
    </div>
  );
}

const SOURCE_WORDS: Record<string, string> = {
  "njs-resort": "an approved NJS Royale Beach Resort photograph",
  "hebs-lagos-event": "an approved HEBS Lagos event photograph",
};

export function slotWords(slot: MediaSlot) {
  if (slot.id.endsWith("-video")) return SOURCE_WORDS[slot.source].replace("photograph", "video");
  if (slot.source === "hebs-lagos-event" && slot.eventYear) {
    return `an approved HEBS Lagos ${slot.eventYear} event photograph`;
  }
  return SOURCE_WORDS[slot.source];
}

/**
 * A register slot. Approved media fills it; until then the abstract `tone`
 * stands in. In inline mode it is labelled with the source it is reserved for.
 */
export function Plate({
  slotId,
  opts,
  tone,
  sizes,
  className = "",
  style,
  noteLight = false,
  priority = false,
  children,
}: {
  slotId: string;
  opts: Opts;
  tone: string;
  sizes: string;
  className?: string;
  style?: React.CSSProperties;
  noteLight?: boolean;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  const r = resolveSlot(slotId, opts.environment);
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={r.kind === "asset" ? style : { background: tone, ...style }}
      data-media-slot={slotId}
      data-media-state={r.kind === "asset" ? "approved" : "reserved"}
    >
      {r.kind === "asset" ? (
        <Image src={r.asset.src} alt={r.asset.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <>
          {children}
          {opts.inline && (
            <StagingNote light={noteLight} className="absolute bottom-2 left-2 right-2 w-fit">
              reserved for {slotWords(r.slot)}.
            </StagingNote>
          )}
        </>
      )}
    </div>
  );
}

/**
 * The official HEBS mark, or (comparison only) the same mark recoloured
 * champagne and ivory. Never a different logo.
 */
export function Brand({ brand, className = "h-11 w-auto lg:h-12" }: { brand: BrandVariant; className?: string }) {
  const logo = findAsset(brand === "champagne" ? "hebs-logo-champagne-ivory" : "hebs-logo-nav");
  // Declared at display size (the PNG is 634 x 529) so the browser fetches a 1x/2x file of about 53px, not 640px.
  return <Image src={logo.src} alt="" width={53} height={44} priority unoptimized={brand === "champagne"} className={className} />;
}

export interface NavLink {
  label: string;
  href: string;
}

export function Nav({ brand, links, priorityHref, homeHref }: { brand: BrandVariant; links: NavLink[]; priorityHref: string; homeHref: string }) {
  return (
    <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(0,0,0,.92)", borderColor: "rgba(200,169,106,.22)" }}>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:px-4 focus-visible:py-3"
        style={{ background: C.ivory, color: C.black }}
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-3 lg:px-12">
        <a href={homeHref} className="flex min-h-[44px] items-center" aria-label="HEBS Lagos 2027, home">
          <Brand brand={brand} className="h-10 w-auto lg:h-11" />
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-8 text-[14px]" style={{ color: "rgba(245,239,228,.8)" }}>
            {links.map((l) => (
              <li key={l.label}>
                <a className="transition-colors duration-200 hover:text-white" href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <a
            href={priorityHref}
            className="hidden min-h-[44px] items-center border px-5 text-[13px] font-semibold transition-colors duration-200 hover:bg-[#C8A96A] hover:text-black lg:inline-flex"
            style={{ borderColor: C.champ, color: C.champL }}
          >
            Join the 2027 Priority List
          </a>
          <details className="relative lg:hidden">
            <summary
              className="flex min-h-[44px] min-w-[44px] cursor-pointer list-none items-center justify-end gap-3 text-[14px] [&::-webkit-details-marker]:hidden"
              style={{ color: C.ivory }}
            >
              Menu
              <span aria-hidden="true" className="flex flex-col gap-[5px]">
                <span className="block h-px w-6" style={{ background: C.champ }} />
                <span className="block h-px w-6" style={{ background: C.champ }} />
              </span>
            </summary>
            <ul
              className="absolute right-0 mt-3 w-64 space-y-1 border p-3 text-[15px]"
              style={{ background: C.black, borderColor: "rgba(200,169,106,.4)", color: C.ivory }}
            >
              {links.map((l) => (
                <li key={l.label}><a className="flex min-h-[44px] items-center px-3" href={l.href}>{l.label}</a></li>
              ))}
              <li><a className="flex min-h-[44px] items-center px-3" href={priorityHref} style={{ color: C.champL }}>Join the 2027 Priority List</a></li>
            </ul>
          </details>
        </div>
      </div>
    </header>
  );
}

/** Section wrapper: ground colour, label, padding and the light/dark focus rule. */
export function Section({
  id,
  ground,
  labelledBy,
  className = "",
  innerClassName = "",
  children,
}: {
  id: string;
  ground: Ground;
  labelledBy: string;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  const g = GROUND[ground];
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`${g.light ? "da-on-light" : ""} ${className}`}
      style={{ background: g.bg, color: g.fg }}
    >
      <div className={`mx-auto max-w-[1440px] px-5 py-20 lg:px-12 lg:py-28 ${innerClassName}`}>{children}</div>
    </section>
  );
}

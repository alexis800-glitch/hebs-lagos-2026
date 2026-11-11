import { Pic, reviewMedia } from "@/components/2027/home/media";
import { Kicker } from "@/components/2027/site/ui";
import { resolveSlot } from "@/lib/assets/register";
import { EDITION_DAYS, VENUE } from "@/lib/editions/2027";
import type { DeployEnvironment } from "@/lib/publication";
import { Plate, type Opts } from "./parts";
import { C, display } from "./tokens";

/**
 * Image positions on the 2027 inner pages, in order of preference:
 *   1. an approved asset for the slot (the rights-gated register, lib/assets/register.ts);
 *   2. an approved HEBS Lagos 2026 summit photograph from the review media, which
 *      renders only in development and the protected review preview;
 *   3. a typographic composition built from confirmed facts (dates, city), so no
 *      position is left as an empty panel.
 * Pre-party photographs (ownership unresolved) and concept films are never used here.
 */

/** A 2026 summit photograph, captioned as such so it is never read as 2027. */
export function EventPhoto({ id, environment, className = "", sizes, tone = "dark" }: {
  id: string;
  environment: DeployEnvironment;
  className?: string;
  sizes: string;
  tone?: "dark" | "light";
}) {
  if (!reviewMedia(id, environment)) return null;
  return (
    <figure className="m-0">
      <div className={`relative overflow-hidden ${className}`}>
        <Pic id={id} className="absolute inset-0 h-full w-full object-cover" sizes={sizes} />
        <span aria-hidden="true" className="pointer-events-none absolute inset-3 border" style={{ borderColor: "rgba(217,193,146,.35)" }} />
      </div>
      <figcaption className="mt-3"><Kicker tone={tone} className="!text-[11px] !tracking-[.28em]">HEBS Lagos 2026</Kicker></figcaption>
    </figure>
  );
}

export type Composition = "dates" | "lagos" | "day1" | "archive";

/** A refined typographic panel from confirmed facts only. */
export function TypePanel({ variant, className = "", tone = "dark" }: { variant: Composition; className?: string; tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  const bg = dark
    ? "radial-gradient(80% 90% at 75% 15%, #2A2016 0%, #17130E 55%, #0D0B08 100%)"
    : "radial-gradient(90% 90% at 70% 15%, #FFFDF8 0%, #F6EFE2 55%, #EFE3C8 100%)";
  const big = { ...display, fontWeight: 500, lineHeight: 0.9, color: dark ? C.ivory : "#16110A" };
  const day = EDITION_DAYS[0];
  return (
    <div aria-hidden="true" className={`relative flex flex-col justify-between overflow-hidden p-7 lg:p-9 ${className}`} style={{ background: bg }}>
      <span className="pointer-events-none absolute inset-3 border" style={{ borderColor: dark ? "rgba(217,193,146,.35)" : "rgba(140,107,52,.35)" }} />
      {variant === "dates" && (
        <>
          <Kicker tone={tone}>July 2027</Kicker>
          <p style={{ ...big, fontSize: "clamp(84px, 9vw, 150px)" }}>23<span className={`s27-accent${dark ? "" : " s27-on-light"}`}>–25</span></p>
          <p className="s27-meta" style={{ color: dark ? "#F0E2C4" : "#5E5034" }}>{VENUE.locality}</p>
        </>
      )}
      {variant === "lagos" && (
        <>
          <Kicker tone={tone}>Nigeria</Kicker>
          <p style={{ ...big, fontSize: "clamp(72px, 7.6vw, 128px)" }}><span className={`s27-accent${dark ? "" : " s27-on-light"}`}>Lagos</span></p>
          <p className="s27-meta" style={{ color: dark ? "#F0E2C4" : "#5E5034" }}>July 23–25, 2027</p>
        </>
      )}
      {variant === "archive" && (
        <>
          <Kicker tone={tone}>The summit days</Kicker>
          <p style={{ ...big, fontSize: "clamp(84px, 9vw, 150px)" }}>20<span className={`s27-accent${dark ? "" : " s27-on-light"}`}>26</span></p>
          <p className="s27-meta" style={{ color: dark ? "#F0E2C4" : "#5E5034" }}>24–25 October, Lagos</p>
        </>
      )}
      {variant === "day1" && (
        <>
          <Kicker tone={tone}>{day.weekday}</Kicker>
          <p style={{ ...big, fontSize: "clamp(84px, 8vw, 132px)" }}>{day.shortDate.split(" ")[1]}</p>
          <p className="s27-meta" style={{ color: dark ? "#F0E2C4" : "#5E5034" }}>{day.title}</p>
        </>
      )}
    </div>
  );
}

/**
 * One image position: the slot's approved asset if there is one, else the 2026
 * summit photograph `reviewId`, else the typographic composition.
 */
export function SlotImage({ slotId, reviewId, composition, opts, className, sizes, tone = "dark", children }: {
  slotId?: string;
  reviewId?: string;
  composition: Composition;
  opts: Opts;
  className: string;
  sizes: string;
  tone?: "dark" | "light";
  children?: React.ReactNode;
}) {
  if (slotId && resolveSlot(slotId, opts.environment).kind === "asset") {
    return <Plate slotId={slotId} opts={opts} sizes={sizes} className={className} tone={C.black}>{children}</Plate>;
  }
  if (reviewId && reviewMedia(reviewId, opts.environment)) {
    return <EventPhoto id={reviewId} environment={opts.environment} className={className} sizes={sizes} tone={tone} />;
  }
  return <TypePanel variant={composition} className={className} tone={tone} />;
}

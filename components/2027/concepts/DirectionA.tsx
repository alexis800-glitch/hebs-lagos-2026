/**
 * Direction A, refined: The Beauty Editorial with the Atlantic beachfront of
 * Concept B. Owner choice of 2026-11-01, revised after the owner review of the
 * same day. Hero, Welcome and the three-day presentation only; the other
 * homepage sections follow once these are approved.
 *
 * No photograph appears until a real, approved HEBS Lagos or NJS Royale Beach
 * Resort one exists. Every image position is a register slot (lib/assets/
 * register.ts): it renders the approved asset, or a designed placeholder for
 * the source it is waiting for. The horizon is an abstract colour field, not a
 * picture of the resort, and it implies no time of day.
 *
 * Review variants (staging only):
 *  - brand "mark" shows the existing official HEBS mark; "type" an internal
 *    typographic treatment for comparison. Neither changes the official logo.
 *  - notes "inline" places each staging note beside what it qualifies; "panel"
 *    keeps the composition clean and lists the same notes after it.
 */
import Image from "next/image";
import ConceptCountdown from "./ConceptCountdown";
import { CAMPAIGN, EDITION_DAYS, VENUE } from "@/lib/editions/2027";
import { COPY } from "@/lib/content/2027";
import { findAsset, findSlot, resolveSlot, type MediaSlot } from "@/lib/assets/register";
import type { DeployEnvironment } from "@/lib/publication";

export type BrandVariant = "mark" | "type";
export type NotesMode = "inline" | "panel";

interface Opts {
  environment: DeployEnvironment;
  brand: BrandVariant;
  inline: boolean;
}

const C = {
  black: "#000000",
  champ: "#C8A96A",
  champL: "#EAD7A8",
  ivory: "#F5EFE4",
  atlantic: "#0E3A3F",
  body: "#3B362F",
};

/* Bodoni Moda is set at optical size 28 for display. Left to font-optical-sizing
   auto, the browser picks the 96 master at these sizes, whose hairlines all but
   vanish on screen; with negative tracking its serifs also collide. */
const display: React.CSSProperties = {
  fontFamily: "var(--c-bodoni), serif",
  fontVariationSettings: '"opsz" 28',
  letterSpacing: "0.005em",
};

/** Targets that already exist in the staging preview. */
const HREF = {
  priority: "/2027/homepage#priority-list",
  experience: "/2027/homepage#experience",
  sponsor: "/2027/homepage#partners",
  programme: "/2027/status#program",
};

const NAV = [
  { label: "Experience", href: HREF.experience },
  { label: "Programme", href: "#three-days" },
  { label: "Competitions", href: "/2027/homepage#competitions" },
  { label: "Destination", href: "/2027/homepage#destination" },
  { label: "Partners", href: HREF.sponsor },
];

/* One orchestrated moment on load (the horizon draws, the metallic line catches
   the light once); nothing else moves. Reduced motion: the final state, still. */
const CSS = `
.da { font-family: var(--c-manrope), sans-serif; }
.da a:focus-visible, .da summary:focus-visible { outline: 2px solid ${C.champL}; outline-offset: 3px; }
.da .da-on-light a:focus-visible { outline-color: ${C.black}; }
.da a, .da summary { touch-action: manipulation; -webkit-tap-highlight-color: rgba(200,169,106,.25); }
.da h2, .da h3 { text-wrap: balance; }
/* Each theme line is sized to fit its measured width (BIGGER. BOLDER. is 9.1em
   wide, BEYOND BEAUTY. 8.4em) so neither wraps or overflows on a phone. */
.da-theme-1 { font-size: min(calc((100vw - 40px) / 9.5), 80px); line-height: 1; white-space: nowrap; }
.da-theme-2 { font-size: min(calc((100vw - 40px) / 8.8), 88px); line-height: 1; white-space: nowrap; }
@media (min-width: 1024px) {
  .da-theme-1 { font-size: clamp(64px, 5.2vw, 84px); }
  .da-theme-2 { font-size: clamp(76px, 6.3vw, 100px); }
}
.da-metal {
  display: inline-block;
  padding: 0 .1em .12em 0; margin-bottom: -.12em;
  background-image: linear-gradient(100deg, #A4844C 0%, ${C.champ} 26%, #EBD7A6 44%, #F6E8C6 50%, #EBD7A6 56%, ${C.champ} 74%, #AC8C54 100%);
  background-size: 240% 100%;
  background-position: 0% 0;
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}
@media (forced-colors: active) { .da-metal { background: none; color: CanvasText; } }
@media (prefers-reduced-motion: no-preference) {
  .da-metal { animation: da-sheen 2.6s cubic-bezier(.2,.7,.2,1) .6s 1 both; }
  .da-horizon { transform-origin: left center; animation: da-draw 1.8s cubic-bezier(.2,.7,.2,1) .2s 1 both; }
}
@keyframes da-sheen { from { background-position: 100% 0; } to { background-position: 0% 0; } }
@keyframes da-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
`;

function sentenceCase(s: string) {
  const lower = s.toLowerCase().replace(/\s+([,.])/g, "$1");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

const SOURCE_WORDS: Record<string, string> = {
  "njs-resort": "an approved NJS Royale Beach Resort photograph",
  "hebs-lagos-event": "an approved HEBS Lagos event photograph",
};

function slotWords(slot: MediaSlot) {
  if (slot.source === "hebs-lagos-event" && slot.eventYear) {
    return `an approved HEBS Lagos ${slot.eventYear} event photograph`;
  }
  return SOURCE_WORDS[slot.source];
}

/**
 * Every staging note, keyed to the section it qualifies. Inline mode renders
 * each one in place; panel mode renders the same list after the composition,
 * so a clean screenshot never loses a safeguard, it only moves it.
 */
function reviewNotes(brand: BrandVariant) {
  const reserved = (id: string) => `${findSlot(id).label} image reserved for ${slotWords(findSlot(id))}.`;
  return {
    hero: [
      brand === "type"
        ? "The HEBS wordmark here is an internal typographic treatment for comparison only. It does not replace the official HEBS mark (D3)."
        : "Official HEBS mark shown as supplied; the 2027 logo is provisional until confirmed (D3).",
      "Venue name provisional until confirmed (D9).",
      "Hero photography reserved for approved HEBS Lagos event and NJS Royale Beach Resort media; until then the hero is set in type only.",
    ],
    welcome: ["Welcome body copy provisional, awaiting owner approval.", reserved("welcome")],
    threeDays: [
      "No 2027 session times are approved; the horizon is one abstract panorama and implies no time of day.",
      "Programme links open the status page until the Event Programme page is built (Phase 4).",
      ...EDITION_DAYS.map((_, i) => reserved(`day-${i + 1}`)),
    ],
  };
}

/** Internal staging label. Never part of the design; removed before publication. */
function StagingNote({ children, light = false, className = "" }: { children: React.ReactNode; light?: boolean; className?: string }) {
  return (
    <span
      className={`inline-block max-w-full border border-dashed px-2 py-1 text-[11px] leading-snug ${className}`}
      style={light ? { borderColor: "#8A7A58", color: "#5E5034" } : { borderColor: "rgba(200,169,106,.55)", color: "rgba(245,239,228,.82)" }}
    >
      Staging note: {children}
    </span>
  );
}

/**
 * A register slot. Approved media fills it; until then the abstract `tone`
 * stands in. In inline mode it is labelled with the source it is reserved for.
 */
function Plate({
  slotId,
  opts,
  tone,
  sizes,
  className = "",
  style,
  noteLight = false,
  children,
}: {
  slotId: string;
  opts: Opts;
  tone: string;
  sizes: string;
  className?: string;
  style?: React.CSSProperties;
  noteLight?: boolean;
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
        <Image src={r.asset.src} alt={r.asset.alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <>
          {children}
          {opts.inline && (
            <StagingNote light={noteLight} className="absolute bottom-3 left-3 right-3 w-fit">
              reserved for {slotWords(r.slot)}.
            </StagingNote>
          )}
        </>
      )}
    </div>
  );
}

/** The brand in the navigation: the official mark, or the comparison wordmark. */
function Brand({ brand }: { brand: BrandVariant }) {
  if (brand === "type") {
    return (
      <span className="flex flex-col leading-none" translate="no">
        <span style={{ ...display, fontWeight: 700, fontSize: "26px", letterSpacing: "0.12em", color: C.ivory }}>HEBS</span>
        <span className="mt-1.5 text-[8.5px] font-semibold tracking-[0.22em]" style={{ color: C.champ }}>
          HAIR EDUCATION BEAUTY SUMMIT
        </span>
      </span>
    );
  }
  const logo = findAsset("hebs-logo-nav");
  return <Image src={logo.src} alt="" width={634} height={529} priority className="h-11 w-auto lg:h-12" />;
}

function Nav({ brand }: { brand: BrandVariant }) {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:px-4 focus-visible:py-3"
        style={{ background: C.ivory, color: C.black }}
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-4 lg:px-12 lg:py-6">
        <a href="#hero" className="flex min-h-[44px] items-center" aria-label="HEBS Lagos 2027, home">
          <Brand brand={brand} />
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-8 text-[14px]" style={{ color: "rgba(245,239,228,.78)" }}>
            {NAV.map((l) => (
              <li key={l.label}>
                <a className="transition-colors duration-200 hover:text-white" href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <a
            href={HREF.priority}
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
              className="absolute right-0 mt-3 w-60 space-y-1 border p-3 text-[15px]"
              style={{ background: C.black, borderColor: "rgba(200,169,106,.4)", color: C.ivory }}
            >
              {NAV.map((l) => (
                <li key={l.label}><a className="flex min-h-[44px] items-center px-3" href={l.href}>{l.label}</a></li>
              ))}
              <li><a className="flex min-h-[44px] items-center px-3" href={HREF.priority} style={{ color: C.champL }}>Join the 2027 Priority List</a></li>
            </ul>
          </details>
        </div>
      </div>
    </header>
  );
}

function Hero({ opts, notes }: { opts: Opts; notes: string[] }) {
  const media = resolveSlot("hero", opts.environment);
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden" style={{ background: C.black, color: C.ivory }}>
      {media.kind === "asset" && (
        <>
          <Image src={media.asset.src} alt={media.asset.alt} fill priority sizes="100vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-black/60" />
        </>
      )}

      <div id="main-content" className="relative mx-auto flex w-full max-w-[1440px] flex-auto flex-col justify-start px-5 pb-8 pt-24 lg:justify-center lg:px-12 lg:pb-12 lg:pt-32">
        {/* Masthead: the event, its dates and its venue read first, like the
            cover line and issue date of a magazine. */}
        <div className="flex flex-col gap-3 border-b pb-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:pb-7" style={{ borderColor: "rgba(200,169,106,.35)" }}>
          <h1 id="hero-title" translate="no" style={{ ...display, fontWeight: 600, fontSize: "clamp(25px, 3.4vw, 50px)", lineHeight: 1, letterSpacing: "0.14em" }}>
            {CAMPAIGN.name}
          </h1>
          <div className="lg:text-right">
            <p style={{ ...display, fontWeight: 500, fontSize: "clamp(26px, 2.5vw, 36px)", lineHeight: 1.1, color: C.champL }}>
              <time dateTime="2027-07-23/2027-07-25">{CAMPAIGN.datesDisplay}</time>
            </p>
            <p className="mt-1.5 text-[15px] lg:text-[16px]" style={{ color: "rgba(245,239,228,.86)" }}>
              <span translate="no">{VENUE.name.value}</span> <span aria-hidden="true" style={{ color: C.champ }}>|</span> {VENUE.locality}
            </p>
            {opts.inline && <StagingNote className="mt-2">{notes[1]}</StagingNote>}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:mt-10 lg:grid-cols-12 lg:items-end lg:gap-10">
          {/* The theme performs itself: Bolder is set heavier, and Beyond Beauty
              is the larger, metallic line. */}
          <p className="uppercase lg:col-span-8" style={display}>
            <span className="da-theme-1 block">
              <span style={{ fontWeight: 400 }}>Bigger.</span>{" "}
              <span style={{ fontWeight: 900 }}>Bolder.</span>
            </span>
            <span className="da-theme-2 block" style={{ fontStyle: "italic", fontWeight: 500 }}>
              <span className="da-metal">Beyond Beauty.</span>
            </span>
          </p>
          <p className="max-w-[44ch] text-[16px] leading-[1.6] lg:col-span-4 lg:pb-3 lg:text-[18px]" style={{ color: "rgba(245,239,228,.8)" }}>
            {CAMPAIGN.subheading}
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:mt-10">
          <a
            href={HREF.priority}
            className="inline-flex min-h-[56px] items-center justify-center px-9 text-[13px] font-bold uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-[#EAD7A8]"
            style={{ background: C.champ, color: C.black }}
          >
            Join the 2027 Priority List
          </a>
          <a
            href={HREF.experience}
            className="inline-flex min-h-[52px] items-center justify-center border px-7 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 hover:border-[#C8A96A] sm:min-h-[56px]"
            style={{ borderColor: "rgba(245,239,228,.45)", color: C.ivory }}
          >
            Explore the Experience
          </a>
          <a
            href={HREF.sponsor}
            className="inline-flex min-h-[44px] items-center justify-center px-3 text-[12px] font-semibold uppercase tracking-[0.18em] underline decoration-[#C8A96A] underline-offset-[8px] transition-colors duration-200 hover:text-white sm:min-h-[56px]"
            style={{ color: C.champL }}
          >
            Become a Sponsor
          </a>
        </div>
      </div>

      {/* The Atlantic: the hero's lower edge becomes the sea, and the countdown sits on the water. */}
      <div className="relative shrink-0" style={{ background: `linear-gradient(180deg, #03161A 0%, ${C.atlantic} 100%)` }}>
        <span aria-hidden="true" className="da-horizon absolute inset-x-0 top-0 block h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.champL} 30%, #FFF6DE 50%, ${C.champL} 70%, transparent)` }} />
        <div className="relative mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-5 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-7">
          <div className="flex flex-wrap items-end gap-x-5 gap-y-1">
            <ConceptCountdown
              inline
              className="min-h-[40px]"
              numberClassName="tabular-nums leading-none text-[32px] sm:text-[40px]"
              numberStyle={{ ...display, fontWeight: 500, color: C.champL }}
              labelClassName="text-[13px] text-[#F5EFE4]/80"
              dividerClassName=""
              fallbackClassName="flex items-end text-[15px] text-[#F5EFE4]/80"
            />
            <p className="pb-0.5 text-[13px]" style={{ color: "rgba(245,239,228,.72)" }}>until July 23, 2027, Lagos time</p>
          </div>
          {opts.inline && (
            <StagingNote className="lg:max-w-[46ch]">
              {notes[2]} {notes[0]}
            </StagingNote>
          )}
        </div>
      </div>
    </section>
  );
}

function Welcome({ opts, notes }: { opts: Opts; notes: string[] }) {
  return (
    <section id="welcome" aria-labelledby="welcome-title" className="da-on-light" style={{ background: C.ivory, color: C.black }}>
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:px-12 lg:py-28">
        <div className="lg:col-span-6 lg:pr-4">
          <h2
            id="welcome-title"
            className="max-w-[14ch]"
            style={{ ...display, fontWeight: 500, fontSize: "clamp(40px, 4.6vw, 72px)", lineHeight: 1.04 }}
          >
            {sentenceCase(COPY.welcome.headline.text)}
          </h2>
          <span aria-hidden="true" className="mt-9 block h-px w-16 lg:mt-11" style={{ background: C.champ }} />
          <p className="mt-9 max-w-[46ch] text-[18px] leading-[1.7] lg:mt-11 lg:text-[19px]" style={{ color: C.body }}>
            {COPY.welcome.body.text}
          </p>
          {opts.inline && <StagingNote light className="mt-6">{notes[0]}</StagingNote>}
        </div>
        <Plate
          slotId="welcome"
          opts={opts}
          noteLight
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="aspect-[4/5] w-full lg:col-span-5 lg:col-start-8"
          tone="radial-gradient(120% 80% at 70% 18%, #FFFFFF 0%, #EFE5D2 45%, #E2D3B6 100%)"
        >
          <span aria-hidden="true" className="absolute inset-4 border" style={{ borderColor: "rgba(160,128,72,.45)" }} />
        </Plate>
      </div>
    </section>
  );
}

/* One panorama cut into three: the same sea at the same light, each day a third
   of it. Nothing in it stands for a time of day. */
const HORIZON = "62%";
const PANORAMA = [
  `radial-gradient(60% 7% at 50% ${HORIZON}, rgba(234,215,168,.20), transparent 85%)`,
  `linear-gradient(180deg, #000 0%, #071A1D 42%, #1E3B3C ${HORIZON}, #123F44 ${HORIZON}, #051719 100%)`,
].join(", ");

function ThreeDays({ opts, notes }: { opts: Opts; notes: string[] }) {
  return (
    <section id="three-days" aria-labelledby="three-days-title" style={{ background: C.black, color: C.ivory }}>
      <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-12 lg:py-28">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <h2
            id="three-days-title"
            className="max-w-[18ch]"
            style={{ ...display, fontWeight: 500, fontSize: "clamp(38px, 4.4vw, 68px)", lineHeight: 1.04 }}
          >
            Three days, one extraordinary destination.
          </h2>
          <div className="max-w-[40ch] lg:text-right">
            <p className="text-[15px] leading-relaxed" style={{ color: "rgba(245,239,228,.75)" }}>
              Session times are published when the 2027 programme is approved.
            </p>
            {opts.inline && <StagingNote className="mt-3">{notes[1]}</StagingNote>}
          </div>
        </div>

        <ol className="mt-12 grid gap-12 lg:mt-14 lg:grid-cols-3 lg:gap-x-3">
          {EDITION_DAYS.map((d, i) => (
            <li key={d.isoDate} className="flex flex-col">
              <Plate
                slotId={`day-${i + 1}`}
                opts={opts}
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="aspect-[16/10] w-full lg:aspect-[5/6]"
                tone={PANORAMA}
                style={{ backgroundSize: "300% 100%", backgroundPosition: `${i * 50}% 0` }}
              >
                <span aria-hidden="true" className="absolute inset-x-0 block h-px" style={{ top: HORIZON, background: "rgba(234,215,168,.45)" }} />
                <span
                  aria-hidden="true"
                  className="absolute left-5 top-4 leading-none lg:left-6 lg:top-5"
                  style={{ ...display, fontWeight: 500, fontSize: "clamp(80px, 7.6vw, 124px)", color: C.ivory }}
                >
                  {d.shortDate.split(" ")[1]}
                </span>
              </Plate>
              <div className="flex flex-1 flex-col pt-6 lg:pr-8">
                <p className="text-[14px] font-medium" style={{ color: C.champ }}>
                  <time dateTime={d.isoDate}>{d.weekday}, {d.shortDate}, 2027</time>
                </p>
                <h3 className="mt-2" style={{ ...display, fontWeight: 500, fontSize: "28px", lineHeight: 1.15 }}>{d.title}</h3>
                <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed" style={{ color: "rgba(245,239,228,.75)" }}>
                  {d.description}
                </p>
                <a
                  href={HREF.programme}
                  className="mt-auto inline-flex min-h-[44px] w-fit items-end pt-5 text-[14px] underline decoration-[#C8A96A] underline-offset-[8px] transition-colors duration-200 hover:text-white"
                  style={{ color: C.champL }}
                >
                  View the event programme<span className="sr-only"> for {d.weekday}, {d.shortDate}</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
        {opts.inline && <StagingNote className="mt-10">{notes[0]}</StagingNote>}
      </div>
    </section>
  );
}

/** Panel mode: the same staging notes, separated from the composition. */
function ReviewNotes({ notes, brand }: { notes: ReturnType<typeof reviewNotes>; brand: BrandVariant }) {
  const groups: [string, string[]][] = [
    ["Hero", notes.hero],
    ["Welcome to HEBS 2027", notes.welcome],
    ["Three days", notes.threeDays],
  ];
  const view = (b: BrandVariant, n: NotesMode) => `?brand=${b}&notes=${n}`;
  return (
    <aside aria-labelledby="review-notes-title" className="border-t-2 border-dashed" style={{ background: "#0B2226", borderColor: "rgba(200,169,106,.6)", color: C.ivory }}>
      <div className="mx-auto max-w-[1440px] px-5 py-12 lg:px-12">
        <h2 id="review-notes-title" className="text-[18px] font-semibold">Staging review notes</h2>
        <p className="mt-2 max-w-[70ch] text-[14px] leading-relaxed" style={{ color: "rgba(245,239,228,.8)" }}>
          This view keeps the composition clean for design review. Every note below still applies to the sections
          above, and none of them is lifted by this view.
        </p>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {groups.map(([title, list]) => (
            <section key={title} aria-label={title}>
              <h3 className="text-[14px] font-semibold" style={{ color: C.champL }}>{title}</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-relaxed" style={{ color: "rgba(245,239,228,.85)" }}>
                {list.map((n) => <li key={n}>{n}</li>)}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
          <a className="underline underline-offset-4" href={view(brand, "inline")}>Show notes in place</a>
          <a className="underline underline-offset-4" href={view(brand === "mark" ? "type" : "mark", "panel")}>
            {brand === "mark" ? "Compare the typographic wordmark" : "Show the official HEBS mark"}
          </a>
        </p>
      </div>
    </aside>
  );
}

export default function DirectionA({
  environment,
  brand = "mark",
  notes = "inline",
}: {
  environment: DeployEnvironment;
  brand?: BrandVariant;
  notes?: NotesMode;
}) {
  const opts: Opts = { environment, brand, inline: notes === "inline" };
  const n = reviewNotes(brand);
  return (
    <div className="da relative">
      <style>{CSS}</style>
      <Nav brand={brand} />
      <main>
        <Hero opts={opts} notes={n.hero} />
        <Welcome opts={opts} notes={n.welcome} />
        <ThreeDays opts={opts} notes={n.threeDays} />
      </main>
      {notes === "panel" && <ReviewNotes notes={n} brand={brand} />}
    </div>
  );
}

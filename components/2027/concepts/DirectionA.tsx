/**
 * Direction A, refined: The Beauty Editorial with the Atlantic beachfront of
 * Concept B. Owner choice of 2026-11-01. Hero, Welcome and the three-day
 * presentation only; the other homepage sections follow once this is approved.
 *
 * No photograph appears until a real, approved HEBS Lagos or NJS Royale Beach
 * Resort one exists. Every image position is a register slot (lib/assets/
 * register.ts): it renders the approved asset, or a designed placeholder with
 * a staging label naming the source it is waiting for. The horizons are
 * abstract colour fields, not pictures of the resort.
 */
import Image from "next/image";
import ConceptCountdown from "./ConceptCountdown";
import { CAMPAIGN, EDITION_DAYS, VENUE } from "@/lib/editions/2027";
import { COPY } from "@/lib/content/2027";
import { findAsset, resolveSlot, type SlotSource } from "@/lib/assets/register";
import type { DeployEnvironment } from "@/lib/publication";

const C = {
  black: "#000000",
  champ: "#C8A96A",
  champL: "#EAD7A8",
  ivory: "#F5EFE4",
  atlantic: "#0E3A3F",
  body: "#3B362F",
};

const display: React.CSSProperties = { fontFamily: "var(--c-bodoni), serif" };

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

/* One orchestrated moment on load (horizon draws, the metallic line catches the
   light once); nothing else moves. Reduced motion: the final state, still. */
const CSS = `
.da { font-family: var(--c-manrope), sans-serif; }
.da a:focus-visible, .da summary:focus-visible { outline: 2px solid ${C.champL}; outline-offset: 3px; }
.da .da-on-light a:focus-visible { outline-color: ${C.black}; }
.da a, .da summary { touch-action: manipulation; -webkit-tap-highlight-color: rgba(200,169,106,.25); }
.da h2, .da h3 { text-wrap: balance; }
.da-theme-1 { font-size: clamp(52px, 8.2vw, 128px); line-height: .92; letter-spacing: -0.02em; }
.da-theme-2 { font-size: min(19.5vw, 132px); line-height: .9; letter-spacing: -0.02em; }
@media (min-width: 1024px) {
  .da-theme-2 { font-size: clamp(100px, 11.2vw, 162px); white-space: nowrap; }
}
.da-metal {
  display: inline-block;
  padding: 0 .12em .14em 0; margin-bottom: -.14em;
  background-image: linear-gradient(100deg, #9E7E46 0%, ${C.champ} 26%, #F1E0B6 44%, #FFF6DE 50%, #F1E0B6 56%, ${C.champ} 74%, #A88850 100%);
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

const SOURCE_WORDS: Record<SlotSource, string> = {
  "njs-resort": "an approved NJS Royale Beach Resort photograph",
  "hebs-lagos-event": "an approved HEBS Lagos event photograph",
};

/**
 * A register slot. Approved media fills it; until then the abstract `tone`
 * stands in, labelled with the source the slot is reserved for.
 */
function Plate({
  slotId,
  environment,
  tone,
  sizes,
  className = "",
  noteLight = false,
  children,
}: {
  slotId: string;
  environment: DeployEnvironment;
  tone: string;
  sizes: string;
  className?: string;
  noteLight?: boolean;
  children?: React.ReactNode;
}) {
  const r = resolveSlot(slotId, environment);
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={r.kind === "asset" ? undefined : { background: tone }}
      data-media-slot={slotId}
      data-media-state={r.kind === "asset" ? "approved" : "reserved"}
    >
      {r.kind === "asset" ? (
        <Image src={r.asset.src} alt={r.asset.alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <>
          {children}
          <StagingNote light={noteLight} className="absolute bottom-3 left-3 right-3 w-fit">
            reserved for {SOURCE_WORDS[r.slot.source]}.
          </StagingNote>
        </>
      )}
    </div>
  );
}

function Nav() {
  const logo = findAsset("hebs-logo-nav");
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:px-4 focus-visible:py-3"
        style={{ background: C.ivory, color: C.black }}
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-5 lg:px-12 lg:py-7">
        <a href="#hero" className="flex min-h-[44px] items-center" aria-label="HEBS Lagos 2027, home">
          <Image src={logo.src} alt="" width={44} height={37} priority className="h-9 w-auto" />
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
            className="hidden min-h-[44px] items-center border px-5 text-[13px] font-semibold transition-colors duration-200 hover:bg-[#C8A96A] hover:text-black sm:inline-flex"
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

function Hero({ environment }: { environment: DeployEnvironment }) {
  const media = resolveSlot("hero", environment);
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden" style={{ background: C.black, color: C.ivory }}>
      {media.kind === "asset" && (
        <>
          <Image src={media.asset.src} alt={media.asset.alt} fill priority sizes="100vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-black/60" />
        </>
      )}

      <div id="main-content" className="relative mx-auto flex w-full max-w-[1440px] flex-auto flex-col justify-center px-5 pb-10 pt-28 lg:px-12 lg:pb-12 lg:pt-32">
        <h1 id="hero-title">
          <span className="block text-[17px] tracking-[0.32em] sm:text-[21px]" style={{ ...display, fontWeight: 500 }}>
            <span translate="no">{CAMPAIGN.name}</span>
          </span>
          {/* The theme performs itself: Bolder is set heavier, and Beyond
              Beauty breaks out of the text column in metallic champagne. */}
          <span className="mt-5 block uppercase lg:mt-6" style={display}>
            <span className="da-theme-1 block">
              <span style={{ fontWeight: 400 }}>Bigger.</span>{" "}
              <span style={{ fontWeight: 900 }}>Bolder.</span>
            </span>
            <span className="da-theme-2 block" style={{ fontStyle: "italic", fontWeight: 400 }}>
              <span className="da-metal">
                <span className="block lg:inline">Beyond</span>{" "}
                <span className="block lg:inline">Beauty.</span>
              </span>
            </span>
          </span>
        </h1>

        <div className="mt-8 grid gap-7 lg:mt-10 lg:grid-cols-12 lg:items-end">
          <p className="max-w-[46ch] text-[16px] leading-[1.65] sm:text-[18px] lg:col-span-6" style={{ color: "rgba(245,239,228,.8)" }}>
            {CAMPAIGN.subheading}
          </p>
          <div className="lg:col-span-6 lg:justify-self-end lg:text-right">
            <p style={{ ...display, fontWeight: 500, fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1.1 }}>
              <time dateTime="2027-07-23/2027-07-25">{CAMPAIGN.datesDisplay}</time>
            </p>
            <p className="mt-2 text-[15px]" style={{ color: "rgba(245,239,228,.8)" }}>
              <span translate="no">{VENUE.name.value}</span> <span aria-hidden="true" style={{ color: C.champ }}>|</span> {VENUE.locality}
            </p>
            <StagingNote className="mt-3">venue name provisional until confirmed (D9).</StagingNote>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={HREF.priority}
            className="inline-flex min-h-[52px] items-center justify-center px-7 text-[12px] font-bold uppercase tracking-[0.2em] transition-colors duration-200 hover:bg-[#EAD7A8]"
            style={{ background: C.champ, color: C.black }}
          >
            Join the 2027 Priority List
          </a>
          <a
            href={HREF.experience}
            className="inline-flex min-h-[52px] items-center justify-center border px-7 text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors duration-200 hover:border-[#C8A96A]"
            style={{ borderColor: "rgba(245,239,228,.45)", color: C.ivory }}
          >
            Explore the Experience
          </a>
          <a
            href={HREF.sponsor}
            className="inline-flex min-h-[52px] items-center justify-center px-3 text-[12px] font-semibold uppercase tracking-[0.2em] underline decoration-[#C8A96A] underline-offset-[10px] transition-colors duration-200 hover:text-white sm:justify-start"
            style={{ color: C.champL }}
          >
            Become a Sponsor
          </a>
        </div>
      </div>

      {/* The Atlantic: the hero's lower edge becomes the sea, and the countdown sits on the water. */}
      <div className="relative shrink-0" style={{ background: `linear-gradient(180deg, #03161A 0%, ${C.atlantic} 100%)` }}>
        <span aria-hidden="true" className="da-horizon absolute inset-x-0 top-0 block h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.champL} 30%, #FFF6DE 50%, ${C.champL} 70%, transparent)` }} />
        <div className="relative mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-6 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-7">
          <div>
            <ConceptCountdown
              inline
              className="min-h-[48px]"
              numberClassName="tabular-nums leading-none text-[36px] sm:text-[44px]"
              numberStyle={{ ...display, fontWeight: 500, color: C.champL }}
              labelClassName="text-[14px] text-[#F5EFE4]/80"
              dividerClassName=""
              fallbackClassName="flex items-end text-[15px] text-[#F5EFE4]/80"
            />
            <p className="mt-2 text-[14px]" style={{ color: "rgba(245,239,228,.72)" }}>until July 23, 2027, Lagos time</p>
          </div>
          <StagingNote className="lg:max-w-[46ch]">
            hero photography reserved for approved HEBS Lagos event and NJS Royale Beach Resort media. Logo provisional (D3).
          </StagingNote>
        </div>
      </div>
    </section>
  );
}

function Welcome({ environment }: { environment: DeployEnvironment }) {
  return (
    <section id="welcome" aria-labelledby="welcome-title" className="da-on-light" style={{ background: C.ivory, color: C.black }}>
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-32">
        <div className="flex flex-col justify-between gap-12 lg:col-span-7">
          <h2
            id="welcome-title"
            style={{ ...display, fontWeight: 500, fontSize: "clamp(44px, 6vw, 100px)", lineHeight: 0.98, letterSpacing: "-0.015em" }}
          >
            {sentenceCase(COPY.welcome.headline.text)}
          </h2>
          <div>
            <p className="max-w-[52ch] text-[18px] leading-[1.7] sm:text-[21px]" style={{ color: C.body }}>
              {COPY.welcome.body.text}
            </p>
            <StagingNote light className="mt-6">body copy provisional, awaiting owner approval.</StagingNote>
          </div>
        </div>
        <Plate
          slotId="welcome"
          environment={environment}
          noteLight
          sizes="(min-width: 1024px) 38vw, 100vw"
          className="aspect-[4/5] w-full lg:col-span-5"
          tone="radial-gradient(120% 80% at 70% 18%, #FFFFFF 0%, #EFE5D2 45%, #E2D3B6 100%)"
        >
          <span aria-hidden="true" className="absolute inset-4 border" style={{ borderColor: "rgba(160,128,72,.45)" }} />
        </Plate>
      </div>
    </section>
  );
}

/** Abstract horizon for each day, horizon at the same height so the three read as one sea. */
const HORIZON = "64%";
const DAY_TONES = [
  {
    // July 23, evening: the Pre-Party.
    sky: `linear-gradient(180deg, #000 0%, #06171A 40%, #1C3A39 ${HORIZON}, #0B2A2E ${HORIZON}, #020A0B 100%)`,
    glow: `radial-gradient(55% 7% at 50% ${HORIZON}, rgba(234,215,168,.5), transparent 75%)`,
    numeral: C.ivory,
  },
  {
    // July 24, daylight: the summit begins.
    sky: `linear-gradient(180deg, #FFFFFF 0%, #FBF7EF 40%, #F5EFE4 ${HORIZON}, #5C9496 ${HORIZON}, ${C.atlantic} 100%)`,
    glow: `radial-gradient(50% 7% at 50% ${HORIZON}, rgba(255,255,255,.75), transparent 75%)`,
    numeral: C.black,
  },
  {
    // July 25, golden hour: the experience continues to the closing celebrations.
    sky: `linear-gradient(180deg, #120D06 0%, #5A4220 38%, ${C.champ} ${HORIZON}, #3E3522 ${HORIZON}, ${C.atlantic} 100%)`,
    glow: `radial-gradient(60% 8% at 50% ${HORIZON}, rgba(255,240,205,.7), transparent 75%)`,
    numeral: C.ivory,
  },
];

function ThreeDays({ environment }: { environment: DeployEnvironment }) {
  return (
    <section id="three-days" aria-labelledby="three-days-title" style={{ background: C.black, color: C.ivory }}>
      <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-12 lg:py-32">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2
            id="three-days-title"
            className="max-w-[18ch]"
            style={{ ...display, fontWeight: 500, fontSize: "clamp(40px, 5vw, 80px)", lineHeight: 1, letterSpacing: "-0.01em" }}
          >
            Three days, one extraordinary destination.
          </h2>
          <div className="max-w-[40ch] lg:text-right">
            <p className="text-[15px] leading-relaxed" style={{ color: "rgba(245,239,228,.75)" }}>
              Session times are published when the 2027 programme is approved.
            </p>
            <StagingNote className="mt-3">programme links open the status page until the Event Programme page is built (Phase 4).</StagingNote>
          </div>
        </div>

        <ol className="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-2">
          {EDITION_DAYS.map((d, i) => {
            const tone = DAY_TONES[i];
            return (
              <li key={d.isoDate} className="flex flex-col">
                <Plate
                  slotId={`day-${i + 1}`}
                  environment={environment}
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="aspect-[16/11] w-full lg:aspect-[4/5]"
                  tone={`${tone.glow}, ${tone.sky}`}
                >
                  <span aria-hidden="true" className="absolute inset-x-0 block h-px" style={{ top: HORIZON, background: "rgba(234,215,168,.55)" }} />
                  <span
                    aria-hidden="true"
                    className="absolute left-5 top-3 leading-none lg:left-6 lg:top-5"
                    style={{ ...display, fontWeight: 500, fontSize: "clamp(88px, 8.4vw, 140px)", fontVariationSettings: '"opsz" 36', color: tone.numeral }}
                  >
                    {d.shortDate.split(" ")[1]}
                  </span>
                </Plate>
                <div className="flex flex-1 flex-col pt-6 lg:px-1">
                  <p className="text-[14px]" style={{ color: C.champ }}>
                    <time dateTime={d.isoDate}>{d.weekday}, {d.shortDate}, 2027</time>
                  </p>
                  <h3 className="mt-3" style={{ ...display, fontWeight: 500, fontSize: "30px", lineHeight: 1.1 }}>{d.title}</h3>
                  <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed" style={{ color: "rgba(245,239,228,.75)" }}>
                    {d.description}
                  </p>
                  <a
                    href={HREF.programme}
                    className="mt-auto inline-flex min-h-[44px] w-fit items-center pt-4 text-[14px] underline decoration-[#C8A96A] underline-offset-[8px] transition-colors duration-200 hover:text-white"
                    style={{ color: C.champL }}
                  >
                    View the event programme<span className="sr-only"> for {d.weekday}, {d.shortDate}</span>
                  </a>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default function DirectionA({ environment }: { environment: DeployEnvironment }) {
  return (
    <div className="da relative">
      <style>{CSS}</style>
      <Nav />
      <main>
        <Hero environment={environment} />
        <Welcome environment={environment} />
        <ThreeDays environment={environment} />
      </main>
    </div>
  );
}

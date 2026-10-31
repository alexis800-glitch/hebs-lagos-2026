/**
 * Concept B — The Luxury Destination.
 *
 * A beachfront hospitality treatment: warm ivory sky, champagne light and an
 * ocean horizon; Italiana display capitals with wide-tracked Jost text; arched,
 * resort-architecture card shapes. Hero, navigation, and the first two sections
 * below the hero (B. Welcome, C. Three days) only.
 *
 * All imagery here is illustration drawn in SVG and labelled as such. Nothing
 * depicts, or should be read as, NJS Royale Beach Resort.
 */
import Image from "next/image";
import ConceptCountdown from "./ConceptCountdown";
import ReferenceLabel from "./ReferenceLabel";
import { CAMPAIGN, EDITION_DAYS } from "@/lib/editions/2027";
import { COPY } from "@/lib/content/2027";
import { findAsset } from "@/lib/assets/register";

const C = {
  ivory: "#F7F2E9",
  sand: "#EFE6D6",
  ink: "#1C1A17",
  champ: "#BE9A5E",
  champText: "#7A5C2B",
  ocean: "#1F4E57",
  oceanText: "#32686A",
  muted: "#5F5A52",
};
const display: React.CSSProperties = { fontFamily: "var(--c-italiana), serif" };
const text: React.CSSProperties = { fontFamily: "var(--c-jost), sans-serif" };

/** Illustrated horizon: low sun, champagne haze, layered sea with soft swell lines. */
function SeaBand({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 1440 360" preserveAspectRatio="xMidYMin slice" aria-hidden="true" className="absolute inset-0 h-full w-full">
      <defs>
        <radialGradient id={`${id}-sun`} cx="69%" cy="18%" r="44%">
          <stop offset="0" stopColor="#F6DDAF" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#EBCB94" stopOpacity="0.45" />
          <stop offset="1" stopColor="#EBCB94" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9BC1BC" />
          <stop offset="0.28" stopColor="#5C8F8E" />
          <stop offset="0.62" stopColor="#2C5F66" />
          <stop offset="1" stopColor="#173F47" />
        </linearGradient>
        {/* Fades the glow in from the top edge so the band meets the sky without a seam. */}
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.16" stopColor="#FFFFFF" stopOpacity="1" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect x="0" y="0" width="1440" height="360" fill={`url(#${id}-fade)`} />
        </mask>
        <linearGradient id={`${id}-haze`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7F2E9" stopOpacity="0" />
          <stop offset="1" stopColor="#F3E3C6" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1440" height="66" fill={`url(#${id}-haze)`} />
      <circle cx="1000" cy="64" r="46" fill="#EDC987" opacity="0.9" />
      <rect x="0" y="64" width="1440" height="296" fill={`url(#${id}-sea)`} />
      <rect x="0" y="0" width="1440" height="360" fill={`url(#${id}-sun)`} mask={`url(#${id}-mask)`} />
      <line x1="0" y1="64.5" x2="1440" y2="64.5" stroke="#FFFFFF" strokeOpacity="0.7" />
      {/* sun path on the water */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line
          key={i}
          x1={1000 - (60 - i * 5)}
          x2={1000 + (60 - i * 5)}
          y1={80 + i * 13}
          y2={80 + i * 13}
          stroke="#F6DDAF"
          strokeOpacity={0.55 - i * 0.06}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
      {/* swell lines */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          d={`M0 ${120 + i * 38} C 240 ${108 + i * 38}, 480 ${134 + i * 38}, 720 ${120 + i * 38} S 1200 ${108 + i * 38}, 1440 ${122 + i * 38}`}
          fill="none"
          stroke="#F7F2E9"
          strokeOpacity={0.16 - i * 0.015}
        />
      ))}
    </svg>
  );
}

function Nav() {
  const logo = findAsset("hebs-logo-nav");
  const left = ["Experience", "Destination", "Programme"];
  const right = ["Competitions", "Partners"];
  const link = "transition-colors hover:text-[#1F4E57]";
  return (
    <header className="relative z-20" style={text}>
      <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 py-5 lg:px-12 lg:py-6">
        <nav aria-label="Concept B primary" className="hidden lg:block">
          <ul className="flex gap-8 text-[11px] font-medium uppercase tracking-[0.3em]" style={{ color: C.muted }}>
            {left.map((l) => <li key={l}><a className={link} href="#b-welcome">{l}</a></li>)}
          </ul>
        </nav>
        <span className="lg:hidden" />
        <a href="#b-hero" className="flex flex-col items-center" aria-label="HEBS Lagos 2027, concept B">
          <Image src={logo.src} alt="" width={40} height={34} className="h-8 w-auto" />
          <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.5em]" style={{ ...text, color: C.ink }}>
            Lagos · 2027
          </span>
        </a>
        <div className="flex items-center justify-end gap-8">
          <ul className="hidden gap-8 text-[11px] font-medium uppercase tracking-[0.3em] xl:flex" style={{ color: C.muted }}>
            {right.map((l) => <li key={l}><a className={link} href="#b-welcome">{l}</a></li>)}
          </ul>
          <a
            href="#b-hero"
            className="hidden min-h-[44px] items-center rounded-full px-6 text-[10px] font-medium uppercase tracking-[0.3em] sm:inline-flex"
            style={{ background: C.ocean, color: C.ivory }}
          >
            Priority List
          </a>
          <details className="relative lg:hidden">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: C.ink }}>
              Menu
            </summary>
            <ul className="absolute right-0 mt-3 w-56 space-y-4 rounded-2xl p-6 text-[11px] uppercase tracking-[0.26em] shadow-none" style={{ background: C.ivory, border: `1px solid ${C.champ}`, color: C.ink }}>
              {[...left, ...right].map((l) => <li key={l}><a href="#b-welcome">{l}</a></li>)}
              <li><a href="#b-hero" style={{ color: C.oceanText }}>Priority List</a></li>
            </ul>
          </details>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="b-hero"
      aria-labelledby="b-title"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FBF8F2 0%, #F7F2E9 45%, #F2E4CB 100%)", color: C.ink }}
    >
      <Nav />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-10 pt-6 text-center lg:pb-8 lg:pt-4" style={text}>
        <p className="text-[10px] font-medium uppercase tracking-[0.42em] sm:text-[11px]" style={{ color: C.oceanText }}>
          NJS Royale Beach Resort · Lagos, Nigeria
          <span className="ml-3 inline-block rounded-full border px-2 py-0.5 align-middle text-[8px] tracking-[0.2em]" style={{ borderColor: C.champ, color: C.champText }}>
            Provisional venue name
          </span>
        </p>
        <h1 id="b-title" className="mt-5 lg:mt-6">
          <span
            className="block uppercase lg:whitespace-nowrap"
            style={{ ...display, fontSize: "clamp(48px, 7.4vw, 124px)", lineHeight: 0.98, letterSpacing: "0.03em" }}
          >
            HEBS Lagos 2027
          </span>
          <span
            className="mt-3 block uppercase"
            style={{ ...display, fontSize: "clamp(20px, 2.3vw, 34px)", letterSpacing: "0.22em", color: C.champText }}
          >
            Bigger. Bolder. Beyond Beauty.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-[16px] font-light leading-relaxed sm:text-[17px]" style={{ color: C.muted }}>
          {CAMPAIGN.subheading}
        </p>
        <p className="mt-5 flex items-center gap-4" style={{ ...display, fontSize: "clamp(22px, 2vw, 28px)", color: C.ink }}>
          <span aria-hidden="true" className="h-px w-10" style={{ background: C.champ }} />
          {CAMPAIGN.datesDisplay}
          <span aria-hidden="true" className="h-px w-10" style={{ background: C.champ }} />
        </p>
        <div className="mt-7 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <a
            href="#b-hero"
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-8 text-[11px] font-medium uppercase tracking-[0.28em] sm:w-auto"
            style={{ background: C.ocean, color: C.ivory }}
          >
            Join the 2027 Priority List
          </a>
          <a
            href="#b-welcome"
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border px-8 text-[11px] font-medium uppercase tracking-[0.28em] sm:w-auto"
            style={{ borderColor: C.champ, color: C.ink }}
          >
            Explore the Experience
          </a>
          <a
            href="#b-hero"
            className="inline-flex min-h-[52px] items-center justify-center px-4 text-[11px] font-medium uppercase tracking-[0.28em] underline decoration-[#BE9A5E] underline-offset-[10px]"
            style={{ color: C.champText }}
          >
            Become a Sponsor
          </a>
        </div>
      </div>

      {/* Illustrated sea band with the countdown set on the water */}
      <div className="relative h-[220px] w-full shrink-0 sm:h-[240px] lg:h-[clamp(190px,24vh,260px)]">
        <SeaBand id="b-hero-sea" />
        <div className="absolute inset-x-0 bottom-9 flex justify-center sm:bottom-10">
          <ConceptCountdown
            numberClassName="leading-none tabular-nums text-[40px] sm:text-[52px] text-[#F7F2E9]"
            numberStyle={display}
            labelClassName="mt-2 text-center text-[9px] uppercase tracking-[0.34em] text-[#F7F2E9]"
            dividerClassName="mx-5 mb-6 block h-8 w-px bg-[#F7F2E9]/40 sm:mx-8"
            fallbackClassName="text-[10px] uppercase tracking-[0.3em] text-[#F7F2E9]"
          />
        </div>
        <ReferenceLabel kind="illustration" className="absolute bottom-2 right-2" />
      </div>
    </section>
  );
}

function SunArc() {
  return (
    <svg viewBox="0 0 120 40" aria-hidden="true" className="h-8 w-24">
      <path d="M10 36 A50 50 0 0 1 110 36" fill="none" stroke={C.champ} strokeWidth="1" />
      <path d="M30 36 A30 30 0 0 1 90 36" fill="none" stroke={C.champ} strokeWidth="1" opacity="0.6" />
      <line x1="0" y1="36.5" x2="120" y2="36.5" stroke={C.champ} strokeWidth="1" />
    </svg>
  );
}

function Welcome() {
  return (
    <section id="b-welcome" aria-labelledby="b-welcome-title" style={{ background: C.sand, color: C.ink }}>
      <div className="mx-auto max-w-5xl px-5 py-24 text-center lg:py-36" style={text}>
        <div className="flex justify-center"><SunArc /></div>
        <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.42em]" style={{ color: C.oceanText }}>
          Welcome to HEBS 2027
        </p>
        <h2
          id="b-welcome-title"
          className="mx-auto mt-6 max-w-4xl uppercase"
          style={{ ...display, fontSize: "clamp(34px, 5vw, 72px)", lineHeight: 1.08, letterSpacing: "0.03em" }}
        >
          Where beauty, education &amp; opportunity meet.
        </h2>
        <p className="mx-auto mt-10 max-w-2xl text-[17px] font-light leading-[1.9] sm:text-[19px]" style={{ color: C.muted }}>
          {COPY.welcome.body.text}
        </p>
        <ul className="mx-auto mt-14 grid max-w-3xl grid-cols-1 border-y sm:grid-cols-3" style={{ borderColor: "rgba(190,154,94,0.55)" }}>
          {["Education", "Competition", "Destination"].map((p, i) => (
            <li
              key={p}
              className={`py-6 text-[12px] font-medium uppercase tracking-[0.42em] ${i > 0 ? "border-t sm:border-l sm:border-t-0" : ""}`}
              style={{ borderColor: "rgba(190,154,94,0.55)", color: C.ink }}
            >
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-6 inline-block rounded-full border px-3 py-1 text-[9px] uppercase tracking-[0.2em]" style={{ borderColor: C.champ, color: C.champText }}>
          Provisional copy
        </p>
      </div>
    </section>
  );
}

const DAY_SKIES = [
  { top: "#FBEFDF", mid: "#F2CFA8", sea: "#6F9E9C" }, // dawn
  { top: "#EEF4F2", mid: "#CFE2DF", sea: "#3E7A7E" }, // midday
  { top: "#F3DDBE", mid: "#D9A877", sea: "#1F4E57" }, // dusk
];

function ThreeDays() {
  return (
    <section aria-labelledby="b-days-title" style={{ background: C.ivory, color: C.ink }}>
      <div className="mx-auto max-w-[1280px] px-5 py-24 lg:px-12 lg:py-32" style={text}>
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.42em]" style={{ color: C.oceanText }}>July 23–25, 2027</p>
          <h2
            id="b-days-title"
            className="mx-auto mt-5 max-w-3xl uppercase"
            style={{ ...display, fontSize: "clamp(32px, 4.4vw, 64px)", lineHeight: 1.1, letterSpacing: "0.03em" }}
          >
            Three days, one extraordinary destination
          </h2>
        </div>
        <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {EDITION_DAYS.map((d, i) => {
            const sky = DAY_SKIES[i];
            return (
              <li key={d.isoDate} className="flex flex-col items-center text-center">
                <div className="relative aspect-[3/4] w-full max-w-[340px] overflow-hidden rounded-t-full">
                  <svg viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
                    <defs>
                      <linearGradient id={`b-day-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor={sky.top} />
                        <stop offset="0.62" stopColor={sky.mid} />
                        <stop offset="0.62" stopColor={sky.sea} />
                        <stop offset="1" stopColor="#173F47" />
                      </linearGradient>
                    </defs>
                    <rect width="300" height="400" fill={`url(#b-day-${i})`} />
                    <circle cx={i === 0 ? 90 : i === 1 ? 150 : 210} cy={i === 1 ? 120 : 236} r="26" fill="#F6DDAF" opacity="0.9" />
                    {[0, 1, 2, 3].map((k) => (
                      <path key={k} d={`M0 ${270 + k * 30} Q 75 ${262 + k * 30} 150 ${270 + k * 30} T 300 ${270 + k * 30}`} fill="none" stroke="#F7F2E9" strokeOpacity="0.18" />
                    ))}
                  </svg>
                  <span className="absolute inset-x-0 top-[34%] text-center" style={{ ...display, fontSize: "72px", color: C.ink, lineHeight: 1 }}>
                    {d.shortDate.split(" ")[1]}
                  </span>
                  <ReferenceLabel kind="illustration" className="absolute bottom-2 left-2 text-left" />
                </div>
                <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.36em]" style={{ color: C.oceanText }}>
                  {d.weekday} · {d.shortDate}
                </p>
                <h3 className="mt-3 uppercase" style={{ ...display, fontSize: "28px", letterSpacing: "0.04em" }}>{d.title}</h3>
                <p className="mt-3 max-w-xs text-[15px] font-light leading-relaxed" style={{ color: C.muted }}>{d.description}</p>
                <p className="mt-5 text-[10px] uppercase tracking-[0.3em]" style={{ color: C.muted }}>Times to be announced</p>
                <a href="#b-hero" className="mt-3 text-[11px] font-medium uppercase tracking-[0.3em] underline decoration-[#BE9A5E] underline-offset-[8px]" style={{ color: C.champText }}>
                  Event programme
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default function ConceptB() {
  return (
    <main>
      <Hero />
      <Welcome />
      <ThreeDays />
    </main>
  );
}

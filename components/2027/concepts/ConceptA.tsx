/**
 * Concept A — The Beauty Editorial.
 *
 * A fashion-magazine treatment: oversized Bodoni Moda display type against a
 * single dramatic portrait, black and champagne, editorial page furniture
 * (section numbers, hairlines, a drop cap). Hero, navigation, and the first
 * two sections below the hero (B. Welcome, C. Three days) only.
 *
 * Images are HEBS archive photographs from the US editions, used as labelled
 * concept references. They are not 2027 imagery and not approved to publish.
 */
import Image from "next/image";
import ConceptCountdown from "./ConceptCountdown";
import ReferenceLabel from "./ReferenceLabel";
import { CAMPAIGN, EDITION_DAYS } from "@/lib/editions/2027";
import { COPY } from "@/lib/content/2027";
import { findAsset } from "@/lib/assets/register";

const C = {
  ink: "#0B0A08",
  ink2: "#141210",
  ivory: "#F4EEE3",
  champ: "#C9A96E",
  champL: "#E6CF9F",
  muted: "#A79F92",
};
const display: React.CSSProperties = { fontFamily: "var(--c-bodoni), serif" };
const text: React.CSSProperties = { fontFamily: "var(--c-manrope), sans-serif" };

function Nav() {
  const logo = findAsset("hebs-logo-nav");
  const links = ["Experience", "Programme", "Competitions", "Destination", "Partners"];
  return (
    <header className="absolute inset-x-0 top-0 z-30" style={text}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-5 lg:px-10 lg:py-7">
        <a href="#a-hero" className="flex items-center gap-3" aria-label="HEBS Lagos 2027, concept A">
          <Image src={logo.src} alt="" width={44} height={37} className="h-9 w-auto" />
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.34em] sm:inline" style={{ color: C.ivory }}>
            Lagos <span style={{ color: C.champ }}>2027</span>
          </span>
        </a>
        <nav aria-label="Concept A" className="hidden lg:block">
          <ul className="flex gap-9 text-[11px] font-medium uppercase tracking-[0.26em]" style={{ color: "rgba(244,238,227,0.72)" }}>
            {links.map((l) => (
              <li key={l}><a className="transition-colors hover:text-white" href="#a-welcome">{l}</a></li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#a-hero"
            className="hidden min-h-[44px] items-center border px-5 text-[10px] font-semibold uppercase tracking-[0.28em] transition-colors hover:bg-[#C9A96E] hover:text-[#0B0A08] sm:inline-flex"
            style={{ borderColor: C.champ, color: C.champL }}
          >
            Priority List
          </a>
          <details className="relative lg:hidden">
            <summary
              className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: C.ivory }}
            >
              Menu
              <span aria-hidden="true" className="flex flex-col gap-[5px]">
                <span className="block h-px w-6" style={{ background: C.champ }} />
                <span className="block h-px w-4 self-end" style={{ background: C.champ }} />
              </span>
            </summary>
            <ul
              className="absolute right-0 mt-3 w-56 space-y-4 border p-6 text-[11px] uppercase tracking-[0.24em]"
              style={{ background: C.ink2, borderColor: "rgba(201,169,110,0.35)", color: C.ivory }}
            >
              {links.map((l) => (
                <li key={l}><a href="#a-welcome">{l}</a></li>
              ))}
              <li><a href="#a-hero" style={{ color: C.champL }}>Priority List</a></li>
            </ul>
          </details>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const portrait = findAsset("ref-hebs-portrait");
  return (
    <section id="a-hero" aria-labelledby="a-title" className="relative overflow-hidden" style={{ background: C.ink, color: C.ivory }}>
      <Nav />
      <div className="mx-auto grid max-w-[1440px] lg:min-h-[100svh] lg:grid-cols-12">
        {/* Portrait: first on phones (full bleed), right-hand plate on desktop */}
        <div className="relative order-first h-[44svh] min-h-[300px] lg:order-last lg:col-span-5 lg:h-auto">
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover object-[58%_28%]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0B0A08] via-[#0B0A08]/10 to-[#0B0A08]/60 lg:bg-gradient-to-r lg:from-[#0B0A08] lg:via-transparent lg:to-transparent" />
          <span
            aria-hidden="true"
            className="absolute -bottom-6 right-2 select-none leading-none lg:bottom-16 lg:right-8"
            style={{ ...display, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(96px, 17vw, 260px)", color: "transparent", WebkitTextStroke: `1px ${C.champ}` }}
          >
            27
          </span>
          <ReferenceLabel kind="hebs-archive" className="absolute bottom-3 left-3 lg:bottom-6 lg:left-auto lg:right-6" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-5 pb-14 pt-6 lg:col-span-7 lg:px-10 lg:pb-12 lg:pt-32" style={text}>
          <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.34em]" style={{ color: C.champ }}>
            <span>Hair Education Beauty Summit</span>
            <span aria-hidden="true" className="hidden h-px max-w-[120px] flex-1 sm:block" style={{ background: C.champ, opacity: 0.6 }} />
            <span className="hidden sm:inline" style={{ color: C.muted }}>Edition 2027</span>
          </div>

          <h1 id="a-title" className="mt-6 lg:mt-8">
            <span className="block text-[22px] tracking-[0.28em] sm:text-[28px]" style={{ ...display, fontWeight: 500, color: C.ivory }}>
              HEBS LAGOS 2027
            </span>
            {/* Phones: four stacked lines. Desktop: two wide lines that run across
                into the photograph, an editorial overlap. */}
            <span
              className="mt-3 block uppercase lg:whitespace-nowrap"
              style={{ ...display, fontWeight: 600, fontSize: "clamp(56px, 7.6vw, 140px)", lineHeight: 0.88, letterSpacing: "-0.02em" }}
            >
              <span className="block">
                <span className="block lg:inline">Bigger.</span>{" "}
                <span className="block lg:inline">Bolder.</span>
              </span>
              <span className="block">
                <span className="block lg:inline" style={{ fontStyle: "italic", fontWeight: 400, color: C.champ, textTransform: "none" }}>
                  Beyond
                </span>{" "}
                <span className="block lg:inline" style={{ color: C.champL }}>Beauty.</span>
              </span>
            </span>
          </h1>

          <div className="mt-8 grid gap-8 lg:mt-9 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <div>
              <p className="max-w-md text-[15px] leading-relaxed sm:text-[17px]" style={{ color: "rgba(244,238,227,0.78)" }}>
                {CAMPAIGN.subheading}
              </p>
              <p className="mt-6" style={{ ...display, fontStyle: "italic", fontSize: "clamp(24px, 2.4vw, 34px)", color: C.ivory }}>
                {CAMPAIGN.datesDisplay}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.muted }}>
                NJS Royale Beach Resort · Lagos, Nigeria{" "}
                <span className="ml-2 border px-1.5 py-0.5 tracking-[0.16em]" style={{ borderColor: "rgba(201,169,110,0.5)", color: C.champ }}>
                  Provisional venue name
                </span>
              </p>
            </div>
            <ConceptCountdown
              numberClassName="leading-none tabular-nums text-[40px] sm:text-[52px]"
              numberStyle={{ ...display, fontWeight: 500, color: C.champL }}
              labelClassName="mt-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#A79F92]"
              dividerClassName="mx-4 mb-7 block h-10 w-px bg-[#C9A96E]/40 sm:mx-6"
              fallbackClassName="text-[10px] uppercase tracking-[0.3em] text-[#A79F92]"
            />
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="#a-hero"
              className="inline-flex min-h-[52px] items-center justify-center px-7 text-[11px] font-bold uppercase tracking-[0.24em] transition-colors hover:bg-[#E6CF9F]"
              style={{ background: C.champ, color: C.ink }}
            >
              Join the 2027 Priority List
            </a>
            <a
              href="#a-welcome"
              className="inline-flex min-h-[52px] items-center justify-center gap-3 border px-7 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors hover:border-[#C9A96E]"
              style={{ borderColor: "rgba(244,238,227,0.35)", color: C.ivory }}
            >
              Explore the Experience <span aria-hidden="true">→</span>
            </a>
            <a
              href="#a-hero"
              className="inline-flex min-h-[52px] items-center justify-center px-2 text-[11px] font-semibold uppercase tracking-[0.24em] underline decoration-[#C9A96E] underline-offset-[10px] sm:justify-start"
              style={{ color: C.champL }}
            >
              Become a Sponsor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Welcome() {
  const avant = findAsset("ref-hebs-avant-garde");
  const body = COPY.welcome.body.text;
  const first = body.charAt(0);
  const rest = body.slice(1);
  return (
    <section id="a-welcome" aria-labelledby="a-welcome-title" style={{ background: C.ivory, color: C.ink }}>
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-32">
        <div className="lg:col-span-7">
          <p className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.34em]" style={{ ...text, color: "#6B5A3A" }}>
            <span>02</span>
            <span aria-hidden="true" className="h-px w-16" style={{ background: "#6B5A3A" }} />
            <span>Welcome to HEBS 2027</span>
          </p>
          <h2
            id="a-welcome-title"
            className="mt-8"
            style={{ ...display, fontWeight: 500, fontSize: "clamp(40px, 5.6vw, 96px)", lineHeight: 0.98, letterSpacing: "-0.015em" }}
          >
            Where beauty, <span style={{ fontStyle: "italic", fontWeight: 400 }}>education</span> &amp; opportunity meet.
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2" style={text}>
            <p className="text-[16px] leading-[1.75]" style={{ color: "#3A352E" }}>
              <span
                className="float-left mr-3 mt-1 leading-[0.8]"
                style={{ ...display, fontSize: "76px", fontWeight: 600, color: C.ink }}
                aria-hidden="true"
              >
                {first}
              </span>
              <span className="sr-only">{first}</span>
              {rest}
            </p>
            <div className="text-[13px] leading-relaxed" style={{ color: "#4A443B" }}>
              <p className="border-t pt-4 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ borderColor: "#CDBF9F" }}>
                Built around
              </p>
              <ul className="mt-4 space-y-3" style={{ ...display, fontSize: "24px", fontStyle: "italic", color: C.ink }}>
                <li>Education</li>
                <li>Professional development</li>
                <li>Excellence &amp; collaboration</li>
                <li>Opportunity</li>
              </ul>
              <p className="mt-6 inline-block border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: "#8A7A58", color: "#5E5034" }}>
                Provisional copy
              </p>
            </div>
          </div>
        </div>
        <figure className="relative lg:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image src={avant.src} alt={avant.alt} fill sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover object-[50%_25%]" />
            <ReferenceLabel kind="hebs-archive" className="absolute bottom-3 left-3" />
          </div>
          <figcaption className="mt-3 flex justify-between text-[10px] font-semibold uppercase tracking-[0.26em]" style={{ ...text, color: "#5E5034" }}>
            <span>Competition · avant-garde</span>
            <span>Plate 02</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function ThreeDays() {
  return (
    <section aria-labelledby="a-days-title" style={{ background: C.ink, color: C.ivory }}>
      <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-32">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.34em]" style={{ ...text, color: C.champ }}>
              <span>03</span>
              <span aria-hidden="true" className="h-px w-16" style={{ background: C.champ }} />
              <span>The Programme</span>
            </p>
            <h2
              id="a-days-title"
              className="mt-6 max-w-3xl"
              style={{ ...display, fontWeight: 500, fontSize: "clamp(36px, 4.6vw, 76px)", lineHeight: 1, letterSpacing: "-0.01em" }}
            >
              Three days, one <span style={{ fontStyle: "italic", color: C.champL }}>extraordinary</span> destination.
            </h2>
          </div>
          <p className="max-w-xs text-[13px] leading-relaxed" style={{ ...text, color: C.muted }}>
            Session times are published as the programme is confirmed.
          </p>
        </div>

        <ol className="mt-16 grid border-t lg:grid-cols-3" style={{ borderColor: "rgba(201,169,110,0.35)" }}>
          {EDITION_DAYS.map((d, i) => (
            <li
              key={d.isoDate}
              className={`flex flex-col pt-8 pb-10 lg:px-8 lg:pb-4 ${i > 0 ? "border-t lg:border-l lg:border-t-0" : ""} ${i === 0 ? "lg:pl-0" : ""}`}
              style={{ borderColor: "rgba(201,169,110,0.35)" }}
            >
              <div className="flex items-end gap-4">
                <span style={{ ...display, fontWeight: 400, fontSize: "clamp(96px, 9vw, 150px)", lineHeight: 0.8, color: i === 1 ? C.champL : C.ivory }}>
                  {d.shortDate.split(" ")[1]}
                </span>
                <span className="mb-2 text-[10px] font-bold uppercase leading-relaxed tracking-[0.3em]" style={{ ...text, color: C.champ }}>
                  July 2027<br />
                  <span style={{ color: C.muted }}>{d.weekday}</span>
                </span>
              </div>
              <h3 className="mt-8" style={{ ...display, fontStyle: "italic", fontSize: "30px", lineHeight: 1.1 }}>{d.title}</h3>
              <p className="mt-4 max-w-sm text-[14px] leading-relaxed" style={{ ...text, color: "rgba(244,238,227,0.72)" }}>
                {d.description}
              </p>
              <div className="mt-auto flex items-center justify-between pt-8 text-[10px] font-semibold uppercase tracking-[0.26em]" style={text}>
                <span style={{ color: C.muted }}>Times to be announced</span>
                <a href="#a-hero" className="underline decoration-[#C9A96E] underline-offset-[8px]" style={{ color: C.champL }}>
                  Programme <span aria-hidden="true">→</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function ConceptA() {
  return (
    <main>
      <Hero />
      <Welcome />
      <ThreeDays />
    </main>
  );
}

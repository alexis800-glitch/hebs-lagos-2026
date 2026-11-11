/**
 * HEBS Lagos 2027, Direction A: homepage sections A-J (directive section 4),
 * the priority list (section 6) and the QR block (section 11). Copy and
 * approval states come from lib/content/2027.ts, dates and venue from
 * lib/editions/2027.ts, images from the register slots.
 *
 * Nothing here pretends to work: a pathway that will become a page stays text
 * until that page exists, and forms are previews with every control disabled.
 */
import Image from "next/image";
import ConceptCountdown from "@/components/2027/concepts/ConceptCountdown";
import { COPY } from "@/lib/content/2027";
import { CAMPAIGN, CATEGORIES_2027, COMPETITIONS_2027, EDITION_DAYS, VENUE } from "@/lib/editions/2027";
import { resolveSlot } from "@/lib/assets/register";
import { PRIORITY_CTA, type PageId } from "@/lib/site/2027";
import { FORMS_OPEN } from "@/lib/integrations/registration-2027";
import { Plate, Section, SectionNotes, type Opts } from "./parts";
import { EXPERIENCE_SLOTS } from "./notes";
import { FormBlock, PageLink } from "./site";
import { C, PANORAMA, TONE, display, h2Style, sentenceCase } from "./tokens";
import { Button, MetaLine } from "@/components/2027/site/ui";
import { SlotImage } from "./media";
import { DAY_PHOTOS } from "@/lib/site/page-media-2027";

export interface Targets {
  priority: string;
  experience: string;
  sponsor: string;
}

type SectionProps = { opts: Opts; notes: string[] };

/** Where each of the six experiences (directive 4D) leads. */
export const EXPERIENCE_LINKS: Record<string, [PageId, string?]> = {
  "exp-education": ["education"],
  "exp-competitions": ["competitions"],
  "exp-exhibitions": ["exhibitors"],
  "exp-networking": ["experience", "exp-networking"],
  "exp-entertainment": ["programme", "july-23"],
  "exp-destination": ["travel"],
};

/** The anchor of a day on the event programme page. */
export const dayAnchor = (shortDate: string) => shortDate.toLowerCase().replace(" ", "-");

const quietLink = "underline decoration-[#C8A96A] underline-offset-[6px] transition-colors duration-200";

const venueLine = (
  <>
    <span translate="no">{VENUE.name.value}</span> <span aria-hidden="true" style={{ color: C.champ }}>|</span> {VENUE.locality}
  </>
);

/* ── A. Main hero ───────────────────────────────────────────────────── */

export function Hero({ opts, notes, to }: SectionProps & { to: Targets }) {
  const media = resolveSlot("hero", opts.environment);
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative flex min-h-[calc(100svh-68px)] flex-col overflow-hidden" style={{ background: C.black, color: C.ivory }}>
      {media.kind === "asset" && (
        <>
          <Image src={media.asset.src} alt={media.asset.alt} fill priority sizes="100vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-black/60" />
        </>
      )}

      <div id="main-content" className="relative mx-auto flex w-full max-w-[1440px] flex-auto flex-col justify-start px-5 pb-8 pt-8 lg:justify-center lg:px-12 lg:pb-12 lg:pt-12">
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
            <p className="mt-1.5 text-[15px] lg:text-[16px]" style={{ color: "rgba(245,239,228,.86)" }}>{venueLine}</p>
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
            href={to.priority}
            className="inline-flex min-h-[56px] items-center justify-center px-9 text-[13px] font-bold uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-[#EAD7A8]"
            style={{ background: C.champ, color: C.black }}
          >
            {PRIORITY_CTA}
          </a>
          <a
            href={to.experience}
            className="inline-flex min-h-[52px] items-center justify-center border px-7 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 hover:border-[#C8A96A] sm:min-h-[56px]"
            style={{ borderColor: "rgba(245,239,228,.45)", color: C.ivory }}
          >
            Explore the Experience
          </a>
          <a
            href={to.sponsor}
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
          <SectionNotes notes={notes} opts={opts} ground="atlantic" className="lg:max-w-[52ch]" />
        </div>
      </div>
    </section>
  );
}

/* ── B. Welcome ─────────────────────────────────────────────────────── */

export function Welcome({ opts, notes }: SectionProps) {
  return (
    <section id="welcome" aria-labelledby="welcome-title" className="da-on-light" style={{ background: C.ivory, color: C.black }}>
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:px-12 lg:py-28">
        <div className="lg:col-span-6 lg:pr-4">
          <h2 id="welcome-title" className="max-w-[14ch]" style={{ ...display, fontWeight: 500, fontSize: "clamp(40px, 4.6vw, 72px)", lineHeight: 1.04 }}>
            {sentenceCase(COPY.welcome.headline.text)}
          </h2>
          <span aria-hidden="true" className="mt-9 block h-px w-16 lg:mt-11" style={{ background: C.champ }} />
          <p className="mt-9 max-w-[46ch] text-[18px] leading-[1.7] lg:mt-11 lg:text-[19px]" style={{ color: C.body }}>
            {COPY.welcome.body.text}
          </p>
          <SectionNotes notes={notes.slice(0, 1)} opts={opts} ground="ivory" className="mt-6" />
        </div>
        <Plate slotId="welcome" opts={opts} noteLight sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/5] w-full lg:col-span-5 lg:col-start-8" tone={TONE.light}>
          <span aria-hidden="true" className="absolute inset-4 border" style={{ borderColor: "rgba(160,128,72,.45)" }} />
        </Plate>
      </div>
    </section>
  );
}

/* ── C. Three days ──────────────────────────────────────────────────── */

/** The three days: a 2026 summit photograph for each summit day, the opening evening as a typographic panel. */
export function ThreeDays({ opts, notes }: SectionProps) {
  return (
    <section id="three-days" aria-labelledby="three-days-title" style={{ background: C.black, color: C.ivory }}>
      <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-12 lg:py-28">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="three-days-title" className="max-w-[18ch]" style={{ ...display, fontWeight: 500, fontSize: "clamp(38px, 4.4vw, 68px)", lineHeight: 1.04 }}>
            Three days, one extraordinary destination.
          </h2>
          <p className="max-w-[40ch] text-[15px] leading-relaxed lg:text-right" style={{ color: "rgba(245,239,228,.75)" }}>
            Session times are published when the 2027 programme is approved.
          </p>
        </div>

        {/* One panorama cut into three: the same sea at the same light, each day a third of it. */}
        <ol className="mt-12 grid gap-12 lg:mt-14 lg:grid-cols-3 lg:gap-x-3">
          {EDITION_DAYS.map((d, i) => (
            <li key={d.isoDate} className="flex flex-col">
              <SlotImage slotId={`day-${i + 1}`} reviewId={DAY_PHOTOS[i]} composition="day1" opts={opts}
                sizes="(min-width: 1024px) 33vw, 100vw" className="aspect-[16/10] w-full lg:aspect-[5/6]" />
              <div className="flex flex-1 flex-col pt-6 lg:pr-8">
                <p className="text-[14px] font-medium" style={{ color: C.champ }}>
                  <time dateTime={d.isoDate}>{d.weekday}, {d.shortDate}, 2027</time>
                </p>
                <h3 className="mt-2" style={{ ...display, fontWeight: 500, fontSize: "28px", lineHeight: 1.15 }}>{d.title}</h3>
                <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed" style={{ color: "rgba(245,239,228,.75)" }}>{d.description}</p>
                <p className="mt-auto pt-5 text-[14px]">
                  <PageLink to="programme" hash={dayAnchor(d.shortDate)} className={`inline-flex min-h-[44px] items-center ${quietLink} hover:text-white`} style={{ color: C.champL }}>
                    {d.shortDate} on the programme
                  </PageLink>
                </p>
              </div>
            </li>
          ))}
        </ol>
        <SectionNotes notes={notes.slice(0, 2)} opts={opts} ground="black" className="mt-10" />
      </div>
    </section>
  );
}

/* ── D. The HEBS experience ─────────────────────────────────────────── */

/** A magazine contents page: the directive numbers the six experiences 1-6, so the numerals carry information. */
export function Experience({ opts, notes }: SectionProps) {
  return (
    <Section id="experience" ground="white" labelledBy="experience-title">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 id="experience-title" style={h2Style}>{sentenceCase(COPY.experience.headline.text)}</h2>
            <p className="mt-6 max-w-[34ch] text-[17px] leading-[1.7]" style={{ color: C.body }}>
              Six experiences in one destination, across three days on the Atlantic beachfront.
            </p>
            <SectionNotes notes={notes} opts={opts} ground="white" className="mt-6" />
          </div>
        </div>
        <ol className="border-t lg:col-span-8" style={{ borderColor: "rgba(0,0,0,.18)" }}>
          {COPY.experience.items.map((item, i) => (
            <li
              key={item.slot}
              className="grid grid-cols-[2.25rem_minmax(0,1fr)_88px] gap-x-4 gap-y-2 border-b py-6 sm:grid-cols-[3rem_minmax(0,1fr)_120px] lg:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1fr)_128px] lg:items-center lg:gap-x-8 lg:py-5"
              style={{ borderColor: "rgba(0,0,0,.18)" }}
            >
              <span aria-hidden="true" className="row-span-2 leading-none lg:row-span-1" style={{ ...display, fontWeight: 500, fontSize: "40px", color: "#8A6D3B" }}>
                {i + 1}
              </span>
              <h3 style={{ ...display, fontWeight: 500, fontSize: "clamp(22px, 2vw, 28px)", lineHeight: 1.15 }}>
                <PageLink to={EXPERIENCE_LINKS[item.slot][0]} hash={EXPERIENCE_LINKS[item.slot][1]} className="underline decoration-[#C8A96A] decoration-1 underline-offset-[6px] hover:decoration-2">
                  {item.title}
                </PageLink>
              </h3>
              <Plate
                slotId={EXPERIENCE_SLOTS[i]}
                opts={{ ...opts, inline: false }}
                sizes="128px"
                className="row-span-2 aspect-square w-full self-start lg:order-last lg:row-span-1"
                tone={i === 5 ? PANORAMA : TONE.light}
                style={i === 5 ? { backgroundSize: "300% 100%", backgroundPosition: "50% 0" } : undefined}
              />
              <p className="col-start-2 text-[15px] leading-relaxed lg:col-start-auto" style={{ color: C.body }}>{item.body.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* ── E. The destination ─────────────────────────────────────────────── */

/** The destination: no resort photograph is authorised, so its image position is a typographic composition until one is. */
export function Destination({ opts, notes }: SectionProps) {
  return (
    <section id="destination" aria-labelledby="destination-title" style={{ background: C.atlantic, color: C.ivory }}>
      <div className="relative mx-auto max-w-[1440px] px-5 py-20 lg:px-12 lg:py-28">
        <h2 id="destination-title" style={{ ...display, fontWeight: 500, fontSize: "clamp(44px, 6vw, 96px)", lineHeight: 1 }}>
          {sentenceCase(COPY.destination.headline.text)}
        </h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="text-[18px] leading-[1.7]" style={{ color: "rgba(245,239,228,.88)" }}>{COPY.destination.body.text}</p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px]" style={{ color: C.champL }}>
              {COPY.destination.topics.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <p className="mt-3 text-[14px]" style={{ color: "rgba(245,239,228,.7)" }}>{COPY.destination.topicsNote.text}</p>
            <Button href={VENUE.website} variant="ghost" className="mt-8">Visit njsbeachresort.com</Button>
            <SectionNotes notes={notes.slice(0, 3)} opts={opts} ground="atlantic" className="mt-8" />
          </div>
          <div className="lg:col-span-7">
            <SlotImage slotId="destination-gallery" composition="lagos" opts={opts} sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[16/10] w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── F. Competitions ────────────────────────────────────────────────── */

export function Competitions({ opts, notes }: SectionProps) {
  const countFor = (slug: string) => COMPETITIONS_2027.filter((c) => c.category === slug).length;
  return (
    <Section id="competitions" ground="ivory" labelledBy="competitions-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 id="competitions-title" className="max-w-[16ch]" style={h2Style}>{sentenceCase(COPY.competitions.headline.text)}</h2>
          <p className="mt-6 max-w-[44ch] text-[17px] leading-[1.7]" style={{ color: C.body }}>{COPY.competitions.body.text}</p>
          <h3 className="mt-12 text-[14px] font-semibold" style={{ color: C.black }}>On the competitions page</h3>
          <ul className="mt-4 border-t" style={{ borderColor: "rgba(0,0,0,.18)" }}>
            {COPY.competitions.pathways.map((p, i) => (
              <li key={p} className="border-b text-[16px]" style={{ borderColor: "rgba(0,0,0,.18)" }}>
                <PageLink to="competitions" hash={COMPETITION_ANCHORS[i]} className="flex min-h-[48px] items-center py-2 hover:underline">{p}</PageLink>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[48ch] text-[14px] leading-relaxed" style={{ color: "#5E5546" }}>{COPY.competitions.pending}</p>
          <SectionNotes notes={notes} opts={opts} ground="ivory" className="mt-6" />
        </div>
        {/* The seven categories as an index, each with its number of competitions. */}
        <div className="lg:col-span-6 lg:col-start-7">
          <h3 className="text-[14px] font-semibold">The categories</h3>
          <ul className="mt-4 border-t" style={{ borderColor: C.black }}>
            {CATEGORIES_2027.map((cat) => {
              const n = countFor(cat.slug);
              return (
                <li key={cat.slug} className="flex items-baseline justify-between gap-6 border-b py-4 lg:py-5" style={{ borderColor: "rgba(0,0,0,.18)" }}>
                  <span style={{ ...display, fontWeight: 500, fontSize: "clamp(24px, 2.4vw, 34px)", lineHeight: 1.1 }}>{cat.name}</span>
                  <span className="shrink-0 text-[14px] tabular-nums" style={{ color: "#5E5546" }}>
                    {n} {n === 1 ? "competition" : "competitions"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ── G. Education & masterclasses ───────────────────────────────────── */

export function Education({ opts, notes }: SectionProps) {
  return (
    <Section id="education" ground="black" labelledBy="education-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-12">
        <div className="lg:col-span-7">
          <h2 id="education-title" style={h2Style}>{sentenceCase(COPY.education.headline.text)}</h2>
          <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.7]" style={{ color: "rgba(245,239,228,.8)" }}>{COPY.education.body.text}</p>
          {/* The syllabus: the directive's five areas of study. */}
          <ul className="mt-10 border-t" style={{ borderColor: "rgba(200,169,106,.45)" }}>
            {COPY.education.tracks.map((t) => (
              <li key={t} className="border-b py-4 lg:py-5" style={{ borderColor: "rgba(245,239,228,.14)", ...display, fontWeight: 500, fontSize: "clamp(24px, 2.6vw, 38px)", lineHeight: 1.1 }}>
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[15px]" style={{ color: "rgba(245,239,228,.7)" }}>Speakers and educators are announced as they are officially confirmed.</p>
          <p className="mt-6 text-[15px]">
            <PageLink to="education" className={`inline-flex min-h-[44px] items-center ${quietLink} hover:text-white`} style={{ color: C.champL }}>
              Education and masterclasses at HEBS 2027
            </PageLink>
          </p>
          <SectionNotes notes={notes.slice(0, 2)} opts={opts} ground="black" className="mt-6" />
        </div>
        <Plate slotId="education" opts={opts} sizes="(min-width: 1024px) 36vw, 100vw" className="aspect-[4/5] w-full lg:col-span-4 lg:col-start-9 lg:mt-20" tone={TONE.dark}>
          <span aria-hidden="true" className="absolute inset-4 border" style={{ borderColor: "rgba(200,169,106,.28)" }} />
        </Plate>
      </div>
    </Section>
  );
}

/* ── H. Sponsors & exhibitors ───────────────────────────────────────── */

/** The one champagne ground: the business section reads differently from the guest sections. */
export function Partners({ opts, notes }: SectionProps) {
  return (
    <Section id="partners" ground="champagne" labelledBy="partners-title">
      <h2 id="partners-title" className="max-w-[22ch]" style={h2Style}>{sentenceCase(COPY.partners.headline.text)}</h2>
      <p className="mt-6 max-w-[56ch] text-[17px] leading-[1.7]">{COPY.partners.body.text}</p>
      <ul className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {COPY.partners.pathways.map((p) => (
          <li key={p.title} className="border-t pt-5" style={{ borderColor: C.onChamp }}>
            <h3 style={{ ...display, fontWeight: 600, fontSize: "26px", lineHeight: 1.15 }}>{p.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed">{p.body.text}</p>
          </li>
        ))}
      </ul>
      <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <PageLink to="sponsorship" className="inline-flex min-h-[52px] items-center justify-center px-7 text-[12px] font-bold uppercase tracking-[0.16em] transition-colors duration-200 hover:bg-[#2B2416]" style={{ background: C.onChamp, color: C.champL }}>
          Sponsorship and partnerships
        </PageLink>
        <PageLink to="exhibitors" className="inline-flex min-h-[52px] items-center justify-center border px-7 text-[12px] font-bold uppercase tracking-[0.16em] transition-colors duration-200 hover:bg-[#1C170E] hover:text-[#EAD7A8]" style={{ borderColor: C.onChamp, color: C.onChamp }}>
          Exhibit at HEBS 2027
        </PageLink>
      </div>
      <p className="mt-8 max-w-[60ch] border-l-2 pl-4 text-[16px] font-medium leading-relaxed" style={{ borderColor: C.onChamp }}>
        {COPY.partners.gate.text}
      </p>
      <SectionNotes notes={notes} opts={opts} ground="champagne" className="mt-6" />
    </Section>
  );
}

/* ── I. HEBS Lagos 2026 highlights ──────────────────────────────────── */

export function Highlights({ opts, notes }: SectionProps) {
  return (
    <Section id="highlights-2026" ground="white" labelledBy="highlights-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-4">
          <h2 id="highlights-title" style={h2Style}>{sentenceCase(COPY.highlights.headline.text)}</h2>
          <p className="mt-6 max-w-[40ch] text-[17px] leading-[1.7]" style={{ color: C.body }}>{COPY.highlights.body.text}</p>
          <a
            href="/"
            className="mt-8 inline-flex min-h-[48px] items-center border px-6 text-[13px] font-semibold transition-colors duration-200 hover:bg-black hover:text-white"
            style={{ borderColor: C.black, color: C.black }}
          >
            Visit the HEBS Lagos 2026 website
          </a>
          <SectionNotes notes={[notes[0], notes[2]]} opts={opts} ground="white" className="mt-6" />
        </div>
        <div className="lg:col-span-8">
          <Plate slotId="highlights-2026" opts={opts} noteLight sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-video w-full" tone={TONE.light}>
            <span aria-hidden="true" className="absolute inset-4 border" style={{ borderColor: "rgba(160,128,72,.4)" }} />
          </Plate>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[14px]" style={{ color: C.body }}>
            {COPY.highlights.kinds.map((k) => <li key={k}>{k}</li>)}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ── Priority list (directive section 6; inactive) ──────────────────── */

/** The anchors of the five pathways (directive 4F) on the competitions page, in COPY order. */
export const COMPETITION_ANCHORS = ["categories", "eligibility", "rules", "apply", "awards"];


/**
 * The priority list (directive section 6). Until the owner opens the list it is
 * a closed notice with no form and no fields, so nothing can be entered or sent.
 * Once FORMS_OPEN.priority is true the approved form (the working HebsForm)
 * takes the notice's place, at the same #priority-list anchor.
 */
export function PriorityList({ opts, notes }: SectionProps) {
  return (
    <Section id="priority-list" ground="ivory" labelledBy="priority-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          {/* The directive's headline once the list can be joined; until then it names the list without inviting a sign-up. */}
          <h2 id="priority-title" style={h2Style}>{FORMS_OPEN.priority ? sentenceCase(COPY.priorityList.headline.text) : "The 2027 priority list"}</h2>
          <p className="mt-6 max-w-[40ch] text-[17px] leading-[1.7]" style={{ color: C.body }}>{COPY.priorityList.intro.text}</p>
          <p className="mt-8 text-[14px]" style={{ color: "#5E5546" }}>No payment is requested through the priority list.</p>
          <SectionNotes notes={notes} opts={opts} ground="ivory" className="mt-6" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          {FORMS_OPEN.priority ? (
            <FormBlock form="priority" title="2027 priority list" gate="The priority list is not open yet. Nothing can be sent." submitLabel="Join the priority list" />
          ) : (
            <div role="status" className="border p-8 sm:p-10" style={{ borderColor: "rgba(122,90,34,.45)", background: "rgba(255,255,255,.55)" }}>
              <p className="text-[13px] font-bold uppercase tracking-[0.18em]" style={{ color: "#7A5A22" }}>{PRIORITY_CTA}</p>
              <p className="mt-5 text-[22px] leading-[1.35]" style={{ ...display, fontWeight: 500, color: C.black }}>The priority list is not open yet.</p>
              <p className="mt-4 max-w-[46ch] text-[17px] leading-[1.7]" style={{ color: C.body }}>
                Nothing can be submitted here for now, and no personal details are collected. When the list opens, the sign-up form appears in this section.
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ── QR access (directive section 11; announcement page) ───────────── */

export function QrAccess({ opts, notes }: SectionProps) {
  return (
    <Section id="qr" ground="white" labelledBy="qr-title" innerClassName="lg:py-20">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
        <div aria-hidden="true" className="relative h-36 w-36 shrink-0 border" style={{ borderColor: "rgba(0,0,0,.2)" }}>
          {[["left-3 top-3"], ["right-3 top-3"], ["bottom-3 left-3"]].map(([pos]) => (
            <span key={pos} className={`absolute h-8 w-8 border-[5px] ${pos}`} style={{ borderColor: "rgba(0,0,0,.18)" }} />
          ))}
        </div>
        <div>
          <h2 id="qr-title" style={{ ...display, fontWeight: 500, fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1.1 }}>{COPY.qr.headline.text}</h2>
          <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed" style={{ color: C.body }}>{COPY.qr.body.text}</p>
          <SectionNotes notes={notes} opts={opts} ground="white" className="mt-4" />
        </div>
      </div>
    </Section>
  );
}

/* ── J. Final call to action ────────────────────────────────────────── */

export function FinalCta({ to }: { to: Targets }) {
  return (
    <section id="final-cta" aria-labelledby="final-title" className="relative overflow-hidden" style={{ background: C.black, color: C.ivory }}>
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "radial-gradient(70% 60% at 50% 0%, #2A2016 0%, #0D0B08 70%)" }} />
      <div className="relative mx-auto max-w-[1440px] px-5 py-24 text-center lg:px-12 lg:py-32">
        <h2 id="final-title" className="mx-auto max-w-[18ch]" style={{ ...display, fontWeight: 500, fontSize: "clamp(40px, 5vw, 80px)", lineHeight: 1.04 }}>
          {sentenceCase(COPY.finalCta.headline.text)}
        </h2>
        <MetaLine className="mt-8" style={{ color: "#F0E2C4" }} />
        <Button href={to.priority} className="mt-10">{COPY.finalCta.button.text}</Button>
        {!FORMS_OPEN.priority && (
          <p className="mt-4 text-[14px]" style={{ color: "rgba(245,239,228,.72)" }}>The priority list opens soon.</p>
        )}
      </div>
      <span aria-hidden="true" className="relative block h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.champL} 30%, #FFF6DE 50%, ${C.champL} 70%, transparent)` }} />
    </section>
  );
}

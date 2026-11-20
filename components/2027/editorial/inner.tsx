/**
 * HEBS Lagos 2027 inner pages, batch 1 (directive section 5): Experience,
 * Event programme, Education & masterclasses, Competitions, Sponsorship &
 * partnerships, Exhibitors, Travel & accommodation.
 *
 * Same rules as the homepage: copy and approval states from lib/content,
 * dates, venue, competitions and programme from lib/editions/2027.ts, images
 * from register slots, and no control that pretends to work.
 */
import type { CSSProperties } from "react";
import { COPY } from "@/lib/content/2027";
import { PAGES } from "@/lib/content/2027-pages";
import { ticketingDetailsApproved } from "@/lib/content/2027";
import {
  CATEGORIES_2027, COMPETITIONS_2027, COMPETITION_COUNT_2027, EDITION_DAYS, PROGRAMME_2027, VENUE,
} from "@/lib/editions/2027";
import { portalLink } from "@/lib/integrations/registration-2027";
import { bookingLink, portalReturnRule } from "@/lib/integrations/booking-2027";
import { formEnabled, submitConfig } from "@/lib/forms-2027/config";
import { CONTACTS_2027, publicContact } from "@/lib/site/contacts-2027";
import { TICKET_CATALOGUE_2027, formatNgn } from "@/lib/content/tickets-2027";
import { PRIORITY_CTA, PRIORITY_HREF, pageHref, type PageId } from "@/lib/site/2027";
import { Pic, reviewMedia } from "@/components/2027/home/media";
import { REVIEW_ASSETS, findReviewAsset } from "@/lib/assets/home-2027-review";
import { type PageProps, Shell } from "./pages";
import { Plate, Section, SectionNotes, type Opts } from "./parts";
import { SlotImage } from "./media";
import { DAY_PHOTOS, EXPERIENCE_PHOTOS, HERO_MEDIA } from "@/lib/site/page-media-2027";
import { Button, Kicker, MetaLine } from "@/components/2027/site/ui";
import { WatchFilms, hasWatchFilms } from "@/components/2027/site/watch";
import { EXHIBITION, SUMMIT_DAYS, WATCH } from "@/lib/content/media-sections-2027";
import { GalleryNav } from "./gallery-nav";
import { LightboxGroup, LightboxTrigger, type LightboxItem } from "@/components/2027/site/lightbox";
import { PortalReturn } from "@/components/2027/site/portal-return";
import { COMPETITION_ANCHORS, Destination, EXPERIENCE_LINKS, FinalCta, PriorityList, ThreeDays, dayAnchor, type Targets } from "./sections";
import { FormBlock, PageContents, PageHero, PageLink, Pending } from "./site";
import { C, TONE, display, h2Style, sentenceCase } from "./tokens";

const COPY_DRAFT = "Body copy provisional, awaiting owner approval.";

const TARGETS: Targets = {
  priority: PRIORITY_HREF,
  experience: pageHref("experience") ?? PRIORITY_HREF,
  sponsor: pageHref("sponsorship") ?? PRIORITY_HREF,
};

const optsOf = ({ environment, brand = "mark", notes = "inline" }: PageProps): Opts => ({ environment, brand, inline: notes === "inline" });

const quietLink = "inline-flex min-h-[44px] items-center underline decoration-[#C8A96A] underline-offset-[7px] transition-colors duration-200";

/** What a link to another page says, by page. */
const LINK_WORDS: Partial<Record<PageId, string>> = {
  education: "Education & masterclasses",
  competitions: "The competitions",
  exhibitors: "Exhibit at HEBS 2027",
  programme: "July 23 on the programme",
  travel: "Travel & accommodation",
};

/* ── Experience ─────────────────────────────────────────────────────── */

export function ExperiencePage(props: PageProps) {
  const opts = optsOf(props);
  const notes = {
    hero: [COPY_DRAFT],
    experiences: ["Experience images reserved: five for approved HEBS Lagos event photographs, the destination one for an approved NJS Beach Resort photograph."],
    days: ["No 2027 session times are approved; the horizon is one abstract panorama and implies no time of day."],
  };
  return (
    <Shell page="experience" opts={opts} notes={props.notes ?? "inline"} groups={[["Page", notes.hero], ["Three days", notes.days], ["Six experiences", notes.experiences]]}>
      <PageHero accent={1} media={HERO_MEDIA.experience} title={PAGES.experience.title.text} intro={PAGES.experience.intro.text} opts={opts} notes={notes.hero}>
        <PageContents items={[{ href: "#three-days", label: "The three days" }, { href: "#six-experiences", label: "The six experiences" }, { href: "#destination", label: "The destination" }]} />
      </PageHero>
      <ThreeDays opts={opts} notes={notes.days} />
      <Section id="six-experiences" ground="white" labelledBy="six-title">
        <h2 id="six-title" className="max-w-[20ch]" style={h2Style}>Six experiences, one destination.</h2>
        <SectionNotes notes={notes.experiences} opts={opts} ground="white" className="mt-6" />
        {/* The directive numbers the six experiences, so the numerals carry information. */}
        <ol className="mt-14 grid gap-x-12 gap-y-16 md:grid-cols-2">
          {COPY.experience.items.map((item, i) => {
            const [to, hash] = EXPERIENCE_LINKS[item.slot];
            const self = to === "experience";
            // An approved photograph where one exists (the 2026 summit photographs in review);
            // the destination, with no authorised photograph, takes a typographic composition.
            return (
              <li key={item.slot} id={item.slot} className="flex flex-col">
                <SlotImage slotId={item.slot} reviewId={EXPERIENCE_PHOTOS[item.slot]} composition="lagos" tone="light" opts={opts}
                  sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/3] w-full" />
                <div className="mt-6 grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4">
                  <span aria-hidden="true" className="leading-none" style={{ ...display, fontWeight: 500, fontSize: "44px", color: "#8A6D3B" }}>{i + 1}</span>
                  <div>
                    <h3 style={{ ...display, fontWeight: 500, fontSize: "clamp(26px, 2.4vw, 34px)", lineHeight: 1.12 }}>{item.title}</h3>
                    <p className="mt-3 max-w-[48ch] text-[16px] leading-[1.7]" style={{ color: C.body }}>{PAGES.experience.more[item.slot].text}</p>
                    {!self && pageHref(to, hash) && (
                      <p className="mt-3 text-[15px]">
                        <PageLink to={to} hash={hash} className={quietLink} style={{ color: C.black }}>{LINK_WORDS[to]}</PageLink>
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Section>
      <Destination opts={opts} notes={[COPY_DRAFT, "Venue name provisional until confirmed (D9)."]} />
      <FinalCta to={TARGETS} />
    </Shell>
  );
}

/* ── Event programme ────────────────────────────────────────────────── */

const KIND_WORDS = {
  education: "Education", competition: "Competition", demonstration: "Demonstration", exhibition: "Exhibition",
  networking: "Networking", celebration: "Celebration", other: "Session",
} as const;

export function ProgrammePage(props: PageProps) {
  const opts = optsOf(props);
  const notes = [COPY_DRAFT, "No 2027 session is approved. Sessions are added to lib/editions/2027.ts only once confirmed, and appear here with their times."];
  return (
    <Shell page="programme" opts={opts} notes={props.notes ?? "inline"} groups={[["Event programme", notes]]}>
      <PageHero accent={1} media={HERO_MEDIA.programme} title={PAGES.programme.title.text} intro={PAGES.programme.intro.text} opts={opts} notes={notes}>
        <PageContents items={EDITION_DAYS.map((d) => ({ href: `#${dayAnchor(d.shortDate)}`, label: `${d.weekday}, ${d.shortDate}` }))} />
      </PageHero>
      {EDITION_DAYS.map((d, i) => {
        const sessions = PROGRAMME_2027[d.isoDate];
        const ground = i % 2 === 0 ? "ivory" : "white";
        return (
          <Section key={d.isoDate} id={dayAnchor(d.shortDate)} ground={ground} labelledBy={`${d.isoDate}-title`}>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <p aria-hidden="true" className="leading-[0.85]" style={{ ...display, fontWeight: 500, fontSize: "clamp(110px, 12vw, 180px)", color: "#8A6D3B" }}>
                  {d.shortDate.split(" ")[1]}
                </p>
                <p className="mt-4 text-[15px] font-medium">
                  <time dateTime={d.isoDate}>{d.weekday}, {d.shortDate}, 2027</time>
                </p>
                {/* July 23's large numeral is its typographic panel; the summit days carry their 2026 photograph. */}
                {i > 0 && (
                  <div className="mt-8">
                    <SlotImage slotId={`day-${i + 1}`} reviewId={DAY_PHOTOS[i]} composition="dates" tone="light" opts={opts}
                      sizes="(min-width: 1024px) 28vw, 100vw" className="aspect-[16/10] w-full" />
                  </div>
                )}
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <p className="text-[15px] font-semibold" style={{ color: "#5E5034" }}>{d.officialName}</p>
                <h2 id={`${d.isoDate}-title`} className="mt-2" style={h2Style}>{d.title}</h2>
                <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.7]" style={{ color: C.body }}>{d.description}</p>
                <h3 className="mt-12 text-[14px] font-semibold">Sessions</h3>
                {sessions.length === 0 ? (
                  <div className="mt-4 border-t pt-6" style={{ borderColor: "rgba(0,0,0,.18)" }}>
                    <Pending>{PAGES.programme.empty.text}</Pending>
                  </div>
                ) : (
                  <ol className="mt-4 border-t" style={{ borderColor: "rgba(0,0,0,.18)" }}>
                    {sessions.map((x) => (
                      <li key={`${x.start}-${x.title}`} className="grid gap-1 border-b py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6" style={{ borderColor: "rgba(0,0,0,.18)" }}>
                        <p className="text-[15px] tabular-nums" style={{ color: "#5E5034" }}>
                          <time dateTime={`${d.isoDate}T${x.start}`}>{x.start}</time>–<time dateTime={`${d.isoDate}T${x.end}`}>{x.end}</time>
                        </p>
                        <div>
                          <p style={{ ...display, fontWeight: 500, fontSize: "22px" }}>{x.title}</p>
                          <p className="mt-1 text-[14px]" style={{ color: C.body }}>{KIND_WORDS[x.kind]}, {x.location}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </Section>
        );
      })}
      <FinalCta to={TARGETS} />
    </Shell>
  );
}

/* ── Education & masterclasses ──────────────────────────────────────── */

/**
 * HEBS Lagos 2026 learning photographs for the Education page, from the review
 * media (House of Snapp collection). Like the homepage's, they render only in
 * development or the protected review preview; elsewhere the page keeps its
 * reserved plate and leaves the photographs out.
 */
/**
 * Education & masterclasses (Lex, 18 Nov 2026): fuller and more structured. Each
 * learning track carries a HEBS Lagos 2026 photograph; the 2027 programme is laid
 * out by summit day in the directive's own words, with sessions announced once
 * confirmed; speakers and registration share one section. No speaker or session
 * is named.
 */
const EDU_TRACK_PHOTO: Record<string, string> = {
  "hair-education": "edu-styling", "technical-training": "edu-technique", demonstrations: "exp-education",
  business: "edu-session", masterclasses: "sp-hall",
};
const EDU_DAY_PHOTO = ["edu-loc", "edu-skincare"];
const EDU_SPEAKER = "welcome-inset";

export function EducationPage(props: PageProps) {
  const opts = optsOf(props);
  const e = PAGES.education;
  const ids = [...Object.values(EDU_TRACK_PHOTO), ...EDU_DAY_PHOTO, EDU_SPEAKER];
  const photographed = ids.every((id) => reviewMedia(id, opts.environment));
  const notes = [
    COPY_DRAFT,
    "No speaker or educator is confirmed, so none is named.",
    photographed
      ? "Photographs from HEBS Lagos 2026 (House of Snapp collection), approved by the event owner for the 2027 website."
      : "Education images reserved for approved HEBS Lagos event photographs.",
  ];
  const register = portalLink("education-registration", opts.environment);
  const summitDays = EDITION_DAYS.filter((d) => d.isoDate !== "2027-07-23");
  const goldD = "#8C6B34";
  return (
    <Shell page="education" opts={opts} notes={props.notes ?? "inline"} groups={[["Education & masterclasses", notes]]}>
      <PageHero accent={1} media={HERO_MEDIA.education} title={sentenceCase(e.title.text)} intro={e.intro.text} opts={opts} notes={notes.slice(0, 1)}>
        <PageContents items={[{ href: "#tracks", label: "Learning tracks" }, { href: "#programme-2027", label: "The 2027 programme" }, { href: "#educators", label: "Educators" }, { href: "#registration", label: "Registration" }]} />
      </PageHero>
      {/* Five learning tracks, each a photographed card. */}
      <Section id="tracks" ground="black" labelledBy="tracks-title" innerClassName="lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <h2 id="tracks-title" style={h2Style}>Five ways to learn.</h2>
          {photographed ? <p className="text-[13.5px]" style={{ color: "rgba(246,239,226,.62)" }}>{e.photosCaption.text}</p> : null}
        </div>
        <ol className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-12">
          {e.tracks.map((t, k) => (
            <li key={t.id} id={t.id} className={`scroll-mt-28 ${k < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}>
              {photographed ? (
                <div className={`relative overflow-hidden ${k < 3 ? "aspect-[4/3]" : "aspect-[16/9]"}`}>
                  <Pic id={EDU_TRACK_PHOTO[t.id]} className="absolute inset-0 h-full w-full object-cover" sizes={k < 3 ? "(min-width: 1024px) 30vw, 100vw" : "(min-width: 1024px) 46vw, 100vw"} />
                </div>
              ) : null}
              <p className="mt-5" aria-hidden="true" style={{ ...display, fontWeight: 500, fontSize: "40px", lineHeight: 1, color: "#D9C192" }}>{String(k + 1).padStart(2, "0")}</p>
              <h3 className="mt-2" style={{ ...display, fontWeight: 500, fontSize: "clamp(24px, 2.2vw, 32px)", lineHeight: 1.1 }}>{t.title}</h3>
              <p className="mt-2 max-w-[44ch] text-[16px] leading-[1.65]" style={{ color: "rgba(245,239,228,.78)" }}>{t.body.text}</p>
            </li>
          ))}
        </ol>
        <SectionNotes notes={notes.slice(2)} opts={opts} ground="black" className="mt-10" />
      </Section>
      {/* The 2027 programme, by summit day: the directive's own day descriptions; sessions to follow. */}
      <Section id="programme-2027" ground="ivory" labelledBy="programme-2027-title" innerClassName="lg:py-24">
        <h2 id="programme-2027-title" style={h2Style}>The 2027 programme.</h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {summitDays.map((d, k) => (
            <article key={d.isoDate} className="grid overflow-hidden sm:grid-cols-[1fr_1.1fr]" style={{ background: "#FFFDF8", boxShadow: "0 1px 0 rgba(140,107,52,.25)" }}>
              {photographed ? (
                <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[300px]">
                  <Pic id={EDU_DAY_PHOTO[k]} className="absolute inset-0 h-full w-full object-cover" sizes="(min-width: 1024px) 300px, 100vw" />
                </div>
              ) : null}
              <div className="flex flex-col p-7 lg:p-8">
                <p className="text-[12px] uppercase tracking-[.28em]" style={{ color: goldD }}>{d.weekday}, {d.shortDate}, 2027</p>
                <h3 className="mt-3" style={{ ...display, fontWeight: 500, fontSize: "clamp(26px, 2.4vw, 34px)", lineHeight: 1.08 }}>{d.title}</h3>
                <p className="mt-3 text-[15.5px] leading-[1.65]" style={{ color: C.body }}>{d.description}</p>
                <p className="mt-auto pt-6"><span className="inline-block rounded-full border px-3 py-1 text-[11px] uppercase tracking-[.18em]" style={{ borderColor: "rgba(140,107,52,.55)", color: goldD }}>Sessions announced once confirmed</span></p>
              </div>
            </article>
          ))}
        </div>
      </Section>
      {/* Speakers, educators and registration, together. */}
      <Section id="educators" ground="white" labelledBy="educators-title" innerClassName="lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-12">
          {photographed ? (
            <figure className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Pic id={EDU_SPEAKER} className="absolute inset-0 h-full w-full object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
              <figcaption className="mt-3 text-[13.5px]" style={{ color: C.body }}>{e.speakerCaption.text}</figcaption>
            </figure>
          ) : null}
          <div className={photographed ? "lg:col-span-6 lg:col-start-7" : "lg:col-span-8"}>
            <h2 id="educators-title" style={h2Style}>Speakers and educators.</h2>
            <p className="mt-6 text-[18px] leading-[1.6]" style={{ color: C.black }}>{e.educators.text}</p>
            <SectionNotes notes={notes.slice(1, 2)} opts={opts} ground="white" className="mt-5" />
            <div id="registration" className="mt-12 scroll-mt-28 border-t pt-10" style={{ borderColor: "rgba(140,107,52,.3)" }}>
              <h2 id="registration-title" style={{ ...display, fontWeight: 500, fontSize: "clamp(30px, 3vw, 42px)", lineHeight: 1.05 }}>Registration.</h2>
              <div className="mt-5">
                {register ? (
                  <Button href={register} variant="outline" tone="light">Register for education sessions</Button>
                ) : (
                  <p className="text-[16px] leading-[1.65]" style={{ color: C.body }}>{e.registration.text}</p>
                )}
              </div>
              <p className="mt-5 text-[15px]" style={{ color: C.body }}>
                To hear first, use the <a href={PRIORITY_HREF} className={quietLink} style={{ color: C.black }}>2027 priority list</a> (not open yet).
              </p>
            </div>
          </div>
        </div>
      </Section>
      <FinalCta to={TARGETS} />
    </Shell>
  );
}

/* ── Competitions ───────────────────────────────────────────────────── */

export function CompetitionsPage(props: PageProps) {
  const opts = optsOf(props);
  const apply = portalLink("competition-application", opts.environment);
  const notes = [
    COPY_DRAFT,
    "Competition names and categories are carried from 2026 as the directive states. 2027 rules, eligibility, fees, schedule and deadlines await approval.",
    "Prize amounts are not shown until the 2027 currency presentation is decided (D8).",
  ];
  const pathways = COPY.competitions.pathways.map((label, i) => ({ href: `#${COMPETITION_ANCHORS[i]}`, label }));
  return (
    <Shell page="competitions" opts={opts} notes={props.notes ?? "inline"} groups={[["Competitions", notes]]}>
      {/* Booking links (staging, or the approved production portal) carry the website's own origin back to the portal. */}
      {bookingLink("booking") ? <PortalReturn allow={portalReturnRule()} /> : null}
      <PageHero accent={2} media={HERO_MEDIA.competitions} title={sentenceCase(COPY.competitions.headline.text)} intro={PAGES.competitions.intro.text} opts={opts} notes={notes.slice(0, 1)}>
        <PageContents items={pathways} />
      </PageHero>
      <Section id="categories" ground="ivory" labelledBy="categories-title">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="categories-title" style={h2Style}>Competition categories.</h2>
          <p className="text-[15px]" style={{ color: C.body }}>{COMPETITION_COUNT_2027} competitions in {CATEGORIES_2027.length} categories</p>
        </div>
        <SectionNotes notes={notes.slice(1, 2)} opts={opts} ground="ivory" className="mt-6" />
        <div className="mt-12 border-t" style={{ borderColor: C.black }}>
          {CATEGORIES_2027.map((cat) => {
            const list = COMPETITIONS_2027.filter((c) => c.category === cat.slug).sort((a, b) => a.order - b.order);
            return (
              <div key={cat.slug} className="grid gap-4 border-b py-8 lg:grid-cols-12 lg:gap-12" style={{ borderColor: "rgba(0,0,0,.18)" }}>
                <h3 className="lg:col-span-4" style={{ ...display, fontWeight: 500, fontSize: "clamp(26px, 2.6vw, 36px)", lineHeight: 1.1 }}>{cat.name}</h3>
                <ul className="grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:col-span-8">
                  {list.map((c) => {
                    // Registration on the portal (staging copy, or the approved production portal), by contract code.
                    const register = bookingLink("compete", c.slug);
                    return (
                      <li key={c.slug} className="text-[17px] leading-snug">
                        {c.name}
                        {register && <> <a href={register} data-portal="" className="ml-1 text-[14px] underline underline-offset-4">Register</a></>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>
      <Section id="eligibility" ground="white" labelledBy="eligibility-title" innerClassName="lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="eligibility-title" className="lg:col-span-5" style={h2Style}>Eligibility and requirements.</h2>
          <div className="lg:col-span-6 lg:col-start-7"><Pending>{PAGES.competitions.eligibility.text}</Pending></div>
        </div>
      </Section>
      <Section id="rules" ground="ivory" labelledBy="rules-title" innerClassName="lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="rules-title" className="lg:col-span-5" style={h2Style}>Competition rules.</h2>
          <div className="lg:col-span-6 lg:col-start-7"><Pending>{PAGES.competitions.rules.text}</Pending></div>
        </div>
      </Section>
      <Section id="apply" ground="white" labelledBy="apply-title" innerClassName="lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="apply-title" className="lg:col-span-5" style={h2Style}>Application and registration.</h2>
          <div className="lg:col-span-6 lg:col-start-7">
            {apply ? (
              <Button href={apply} variant="outline" tone="light">Apply to compete</Button>
            ) : (
              <Pending>{PAGES.competitions.apply.text}</Pending>
            )}
            <p className="mt-6 text-[15px]" style={{ color: C.body }}>
              To hear when applications open, use the <a href={PRIORITY_HREF} className={quietLink} style={{ color: C.black }}>2027 priority list</a> (not open yet).
            </p>
          </div>
        </div>
      </Section>
      <Section id="awards" ground="black" labelledBy="awards-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h2 id="awards-title" style={h2Style}>Awards and prizes.</h2>
            <p className="mt-8 leading-none" style={{ ...display, fontWeight: 500, fontSize: "clamp(72px, 8vw, 120px)", color: C.champL }}>{COMPETITION_COUNT_2027}</p>
            <p className="mt-3 text-[15px]" style={{ color: "rgba(245,239,228,.75)" }}>competitions, each with its own prize</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[17px] leading-[1.7]" style={{ color: "rgba(245,239,228,.85)" }}>{PAGES.competitions.awards.text}</p>
            <SectionNotes notes={notes.slice(2)} opts={opts} ground="black" className="mt-6" />
          </div>
        </div>
      </Section>
      <FinalCta to={TARGETS} />
    </Shell>
  );
}

/* ── Sponsorship & partnerships ─────────────────────────────────────── */

export function SponsorshipPage(props: PageProps) {
  const opts = optsOf(props);
  const notes = [
    COPY_DRAFT,
    "No inquiry is collected. Submission follows INTEGRATION-CONTRACT-v1.1 (signed, server to Base44); the form stays closed until the private integration test and owner approval. Public contacts await D10.",
    "The prospectus download appears with an approved 2027 prospectus.",
  ];
  return (
    <Shell page="sponsorship" opts={opts} notes={props.notes ?? "inline"} groups={[["Sponsorship & partnerships", notes]]}>
      <PageHero accent={2} media={HERO_MEDIA.sponsorship} title={sentenceCase(COPY.partners.headline.text)} intro={PAGES.sponsorship.intro.text} opts={opts} notes={notes.slice(0, 1)}>
        <InterestCtas first="sponsor" />
        <PageContents items={[{ href: "#opportunities", label: "Opportunities" }, { href: "#how-it-works", label: "How it works" }, { href: "#inquiry", label: "Inquiries" }]} />
      </PageHero>
      <ExhibitionFloor opts={opts} />
      <Section id="opportunities" ground="ivory" labelledBy="opportunities-title">
        <h2 id="opportunities-title" style={h2Style}>Four ways to take part.</h2>
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {COPY.partners.pathways.map((p) => (
            <li key={p.title} className="border-t pt-5" style={{ borderColor: C.black }}>
              <h3 style={{ ...display, fontWeight: 600, fontSize: "26px", lineHeight: 1.15 }}>{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed" style={{ color: C.body }}>{p.body.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-[15px]" style={{ color: C.body }}>
          Exhibiting? <PageLink to="exhibitors" className={quietLink} style={{ color: C.black }}>See the exhibitor page</PageLink>
        </p>
      </Section>
      <Section id="how-it-works" ground="black" labelledBy="how-title">
        <h2 id="how-title" style={h2Style}>How a partnership starts.</h2>
        {/* A real sequence (directive section 8), so the steps are numbered. */}
        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {PAGES.sponsorship.steps.map((st, i) => (
            <li key={st.title}>
              <span aria-hidden="true" className="block leading-none" style={{ ...display, fontWeight: 500, fontSize: "56px", color: C.champ }}>{i + 1}</span>
              <h3 className="mt-4" style={{ ...display, fontWeight: 500, fontSize: "24px", lineHeight: 1.15 }}>{st.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "rgba(245,239,228,.75)" }}>{st.body.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-14 max-w-[60ch]"><Pending light={false}>{PAGES.sponsorship.prospectus.text}</Pending></div>
        <SectionNotes notes={notes.slice(2)} opts={opts} ground="black" className="mt-6" />
      </Section>
      <Section id="inquiry" ground="ivory" labelledBy="inquiry-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h2 id="inquiry-title" style={h2Style}>Sponsorship inquiries.</h2>
            <p className="mt-6 max-w-[40ch] text-[17px] leading-[1.7]" style={{ color: C.body }}>Tell the HEBS team about your brand and how you want to take part.</p>
            <div className="mt-8">{publicContact("enquiries") ? <ContactEmails only={["enquiries"]} fallback={PAGES.sponsorship.contact.text} /> : <Pending>{PAGES.sponsorship.contact.text}</Pending>}</div>
            <SectionNotes notes={notes.slice(1, 2)} opts={opts} ground="ivory" className="mt-6" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <FormBlock form="sponsor" title="Sponsorship inquiry" gate="The inquiry form is not open yet. Nothing can be sent." submitLabel="Send inquiry" />
          </div>
        </div>
      </Section>
      <FinalCta to={TARGETS} />
    </Shell>
  );
}

/**
 * The two ways in, at the top of the Sponsorship and Exhibitors pages: "Become a
 * sponsor" leads to the sponsorship inquiry form, "Become an exhibitor" to the
 * exhibitor application, the page's own first. Both forms submit only to the
 * portal's evSubmitPublicForm (an EvSponsor or EvExhibitor record, never a
 * booking or a payment). While the page's form is closed its section says so and
 * collects nothing, and so does the line under the buttons. A link to a page that
 * is not published is left out.
 */
const INTEREST = {
  sponsor: { page: "sponsorship", hash: "inquiry", label: "Become a sponsor", closed: "Sponsorship inquiries are not open yet. Nothing can be sent." },
  exhibitor: { page: "exhibitors", hash: "apply", label: "Become an exhibitor", closed: "Exhibitor applications are not open yet. Nothing can be sent." },
} as const;

function InterestCtas({ first }: { first: keyof typeof INTEREST }) {
  const order = first === "sponsor" ? (["sponsor", "exhibitor"] as const) : (["exhibitor", "sponsor"] as const);
  const open = formEnabled(first, submitConfig());
  return (
    <div className="mt-9">
      <div className="flex flex-wrap gap-3">
        {order.map((k, i) => {
          const href = pageHref(INTEREST[k].page, INTEREST[k].hash);
          return href ? <Button key={k} href={href} variant={i === 0 ? "primary" : "ghost"}>{INTEREST[k].label}</Button> : null;
        })}
      </div>
      {!open && <p className="mt-4 text-[14px]" style={{ color: "rgba(245,239,228,.72)" }}>{INTEREST[first].closed}</p>}
    </div>
  );
}

/* ── Exhibitors ─────────────────────────────────────────────────────── */

export function ExhibitorsPage(props: PageProps) {
  const opts = optsOf(props);
  const notes = [
    COPY_DRAFT,
    "No application is collected. Submission follows INTEGRATION-CONTRACT-v1.1; the form stays closed until the private integration test and owner approval. The company-profile upload is not shown in this release (owner decision 7) until malware scanning or quarantine is approved.",
  ];
  return (
    <Shell page="exhibitors" opts={opts} notes={props.notes ?? "inline"} groups={[["Exhibitors", notes]]}>
      <PageHero accent={2} media={HERO_MEDIA.exhibitors} title={PAGES.exhibitors.title.text} intro={PAGES.exhibitors.intro.text} opts={opts} notes={notes.slice(0, 1)}>
        <InterestCtas first="exhibitor" />
        <PageContents items={[{ href: "#exhibit", label: "Ways to exhibit" }, { href: "#apply", label: "Applications" }, { href: "#brands", label: "Participating brands" }]} />
      </PageHero>
      <Section id="exhibit" ground="white" labelledBy="exhibit-title">
        <h2 id="exhibit-title" style={h2Style}>Ways to exhibit.</h2>
        <ul className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {PAGES.exhibitors.opportunities.map((o) => (
            <li key={o.title} className="border-t pt-5" style={{ borderColor: C.black }}>
              <h3 style={{ ...display, fontWeight: 500, fontSize: "28px", lineHeight: 1.15 }}>{o.title}</h3>
              <p className="mt-3 text-[16px] leading-relaxed" style={{ color: C.body }}>{o.body.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-[15px]" style={{ color: C.body }}>
          Looking for sponsorship? <PageLink to="sponsorship" className={quietLink} style={{ color: C.black }}>See sponsorship and partnerships</PageLink>
        </p>
      </Section>
      <Section id="apply" ground="ivory" labelledBy="apply-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h2 id="apply-title" style={h2Style}>Exhibitor applications.</h2>
            <p className="mt-6 max-w-[40ch] text-[17px] leading-[1.7]" style={{ color: C.body }}>Tell us about your company and what you would show.</p>
            <SectionNotes notes={notes.slice(1)} opts={opts} ground="ivory" className="mt-6" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <FormBlock form="exhibitor" title="Exhibitor application" gate="Exhibitor applications are not open yet. Nothing can be sent." submitLabel="Send application" />
          </div>
        </div>
      </Section>
      <Section id="brands" ground="black" labelledBy="brands-title" innerClassName="lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="brands-title" className="lg:col-span-5" style={h2Style}>Participating brands.</h2>
          <div className="lg:col-span-6 lg:col-start-7"><Pending light={false}>{PAGES.exhibitors.brands.text}</Pending></div>
        </div>
      </Section>
      <FinalCta to={TARGETS} />
    </Shell>
  );
}

/* ── Travel & accommodation ─────────────────────────────────────────── */

/** Official Nigeria Immigration Service sites (both checked 2026-11-03). */
const NIS = { site: "https://immigration.gov.ng/", evisa: "https://evisa.immigration.gov.ng/" } as const;


/**
 * Travel & accommodation (Lex, 18 Nov 2026; Option B, luxury magazine, approved by
 * Gary for staging): the destination first, photograph-led, practical information
 * second. Five reserved photograph positions show only an approved photograph
 * registered under the position's id (lib/assets/home-2027-review.ts); none is
 * approved yet, so the layout falls back to type. Nothing invented: no generated or
 * concept image, no room type, view, price or package. The hero heading and line are
 * new wording awaiting owner approval.
 */
const TRAVEL_SLOTS = {
  "travel-coast": { need: "The Atlantic coast from the resort (terrace edge or beachfront), landscape" },
  "travel-terrace": { need: "The resort terrace and façade, portrait" },
  "travel-architecture": { need: "The resort's architecture or exterior, landscape" },
  "travel-arrival": { need: "The arrival area, colonnade or entrance, portrait" },
  "travel-room": { need: "An actual NJS guest room or suite (a scenic view only if verified)" },
} as const;
type TravelSlot = keyof typeof TRAVEL_SLOTS;
export const TRAVEL_IMAGES_NEEDED = Object.values(TRAVEL_SLOTS).map((v) => v.need);
const registered = (id: string) => REVIEW_ASSETS.some((a) => a.id === id);
/** Whether an approved photograph is registered and available for this position here. */
const hasTravelImage = (slot: TravelSlot, opts: Opts) => registered(slot) && reviewMedia(slot, opts.environment) !== null;

function TravelPhoto({ slot, opts, className, sizes }: { slot: TravelSlot; opts: Opts; className: string; sizes: string }) {
  if (!hasTravelImage(slot, opts)) return null;
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Pic id={slot} className="absolute inset-0 h-full w-full object-cover" sizes={sizes} />
    </div>
  );
}

export function TravelPage(props: PageProps) {
  const opts = optsOf(props);
  const t = PAGES.travel;
  const notes = [
    COPY_DRAFT,
    "Venue name provisional, address and directions withheld until confirmed (D9).",
    `No room, package or availability is offered until approved. Photographs needed from the owner: ${TRAVEL_IMAGES_NEEDED.join("; ")}.`,
    "Visitor support contacts pending (D10).",
    "New wording for approval: the heading \"Your HEBS Lagos Experience\" and the line \"Beauty, creativity and connection on the Atlantic coast of Lagos.\"",
  ];
  const has = (slot: TravelSlot) => hasTravelImage(slot, opts);
  const ivoryText = "rgba(246,239,226,.84)";
  const gold = "#D9C192";
  const heroTitle = "Your HEBS Lagos Experience";
  const heroLine = "Beauty, creativity and connection on the Atlantic coast of Lagos.";
  /* ── Hero ── */
  const hero = (
    <section aria-labelledby="page-title" style={{ background: C.ivory, color: C.black }}>
      <div id="main-content" className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-12 lg:py-20">
        <div className={has("travel-terrace") ? "lg:col-span-6" : "lg:col-span-9"}>
          <Kicker tone="light">{t.title.text}</Kicker>
          <h1 id="page-title" className="mt-5 max-w-[13ch]" style={{ ...display, fontWeight: 500, fontSize: "clamp(46px, 6vw, 100px)", lineHeight: 0.98 }}>{heroTitle}</h1>
          <p className="mt-6 max-w-[38ch] text-[18px] leading-[1.6] lg:text-[20px]" style={{ color: C.body }}>{heroLine}</p>
          <MetaLine className="mt-7" style={{ color: "#5E5034" }} />
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="#venue" variant="primary" tone="light">The venue</Button>
            <Button href="#stay" variant="outline" tone="light">Accommodation</Button>
          </div>
          <SectionNotes notes={[notes[0], notes[4]]} opts={opts} ground="ivory" className="mt-8" />
        </div>
        {has("travel-terrace") ? (
          <div className="relative lg:col-span-6">
            <TravelPhoto slot="travel-terrace" opts={opts} className="aspect-[4/5] w-full lg:w-[86%]" sizes="(min-width: 1024px) 42vw, 100vw" />
            {has("travel-arrival") ? <div className="absolute -bottom-8 right-0 hidden w-[42%] shadow-[0_30px_60px_-24px_rgba(40,26,10,.55)] lg:block" style={{ border: `8px solid ${C.ivory}` }}><TravelPhoto slot="travel-arrival" opts={opts} className="aspect-[4/5] w-full" sizes="260px" /></div> : null}
          </div>
        ) : null}
      </div>
    </section>
  );

  /* ── The venue ── */
  const venueText = (
    <>
      <p className="text-[12px] uppercase tracking-[.3em]" style={{ color: gold }}>The venue · {VENUE.locality}</p>
      <h2 id="venue-title" className="mt-4" style={{ ...display, fontWeight: 500, fontSize: "clamp(40px, 4.6vw, 76px)", lineHeight: 1, color: C.ivory }}><span translate="no">{VENUE.name.value}</span></h2>
      <p id="resort" className="mt-6 max-w-[44ch] scroll-mt-28 text-[17px] leading-[1.65]" style={{ color: ivoryText }}>{t.venue.text}</p>
      <p className="mt-3 max-w-[44ch] text-[14px] leading-[1.6]" style={{ color: "rgba(246,239,226,.6)" }}>{t.directions.text}</p>
      <div className="mt-8"><Button href={VENUE.website} variant="ghost" tone="dark" external>Visit njsbeachresort.com</Button></div>
    </>
  );
  const venue = (
    <Section id="venue" ground="black" labelledBy="venue-title" innerClassName="lg:py-24">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5 lg:pt-6">{venueText}</div>
        {has("travel-coast") ? (
          <div className="grid gap-4 lg:col-span-7">
            <TravelPhoto slot="travel-coast" opts={opts} className="aspect-[16/10] w-full" sizes="(min-width: 1024px) 56vw, 100vw" />
            {has("travel-architecture") ? <TravelPhoto slot="travel-architecture" opts={opts} className="aspect-[16/10] w-[70%] justify-self-end" sizes="(min-width: 1024px) 40vw, 70vw" /> : null}
          </div>
        ) : null}
      </div>
    </Section>
  );

  /* ── Accommodation ── */
  const room = has("travel-room");
  const accommodation = (
    <Section id="stay" ground="ivory" labelledBy="stay-title" innerClassName="lg:py-24">
      <div className={`grid gap-10 lg:items-center lg:gap-14 ${room ? "lg:grid-cols-12" : ""}`}>
        {room ? <div className="lg:col-span-7"><TravelPhoto slot="travel-room" opts={opts} className="aspect-[4/3] w-full" sizes="(min-width: 1024px) 56vw, 100vw" /></div> : null}
        <div className={room ? "lg:col-span-5" : "max-w-[820px]"}>
          <p className="text-[12px] uppercase tracking-[.3em]" style={{ color: "#8C6B34" }}>Accommodation</p>
          <h2 id="stay-title" className="mt-4" style={{ ...display, fontWeight: 500, fontSize: "clamp(36px, 4vw, 64px)", lineHeight: 1.02 }}>Stay at the resort.</h2>
          <p className="mt-6 text-[18px] leading-[1.65]" style={{ color: C.black }}>{t.accommodation.text}</p>
          <p className="mt-6"><span className="inline-block rounded-full border px-4 py-1.5 text-[11.5px] uppercase tracking-[.18em]" style={{ borderColor: "rgba(140,107,52,.55)", color: "#8C6B34" }}>Arrangements to be announced</span></p>
          <SectionNotes notes={notes.slice(2, 3)} opts={opts} ground="ivory" className="mt-6" />
        </div>
      </div>
    </Section>
  );

  /* ── Plan your visit (practical, secondary) ── */
  const plan = (
    <Section id="journey" ground="white" labelledBy="plan-title" innerClassName="lg:py-20">
      <h2 id="plan-title" style={h2Style}>Plan your visit.</h2>
      <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-12">
        <article id="arriving" className="scroll-mt-28">
          <h3 style={{ ...display, fontWeight: 500, fontSize: "26px", lineHeight: 1.15 }}>Arriving in Lagos</h3>
          <p className="mt-3 text-[16px] leading-[1.65]" style={{ color: C.black }}>{t.arrival.text}</p>
          <p className="mt-2 text-[14px] leading-[1.6]" style={{ color: C.body }}>{t.airport.text}</p>
        </article>
        <article id="visas" className="scroll-mt-28">
          <h3 id="visas-title" style={{ ...display, fontWeight: 500, fontSize: "26px", lineHeight: 1.15 }}>Visas</h3>
          <p className="mt-3 text-[16px] leading-[1.65]" style={{ color: C.black }}>{t.visas.text}</p>
          <ul className="mt-5 flex flex-wrap gap-3">
            <li><Button href={NIS.site} variant="outline" tone="light" external>Nigeria Immigration Service</Button></li>
            <li><Button href={NIS.evisa} variant="outline" tone="light" external>Official e-Visa portal</Button></li>
          </ul>
        </article>
        <div id="faq" className="scroll-mt-28">
          <h3 id="faq-title" style={{ ...display, fontWeight: 500, fontSize: "26px", lineHeight: 1.15 }}>Travel questions</h3>
          <div className="mt-2">
            {t.faqs.map((f) => (
              <details key={f.q} className="group border-b" style={{ borderColor: "rgba(0,0,0,.12)" }}>
                <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 py-3 text-[16px] font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="shrink-0 text-[22px] leading-none transition-transform duration-200 group-open:rotate-45" style={{ color: "#8C6B34" }}>+</span>
                </summary>
                <p className="pb-4 text-[15px] leading-[1.65]" style={{ color: C.body }}>{f.a.text}</p>
              </details>
            ))}
            <p className="mt-4 text-[14px]" style={{ color: C.body }}>{t.support.text}</p>
          </div>
        </div>
      </div>
      <SectionNotes notes={[notes[1], notes[3]]} opts={opts} ground="white" className="mt-8" />
    </Section>
  );

  return (
    <Shell page="travel" opts={opts} notes={props.notes ?? "inline"} groups={[["Travel & accommodation", notes]]}>
      {hero}
      {venue}
      {accommodation}
      {plan}
      <FinalCta to={TARGETS} />
    </Shell>
  );
}

/* ── Tickets & registration ─────────────────────────────────────────── */

export function TicketsPage(props: PageProps) {
  const opts = optsOf(props);
  const t = PAGES.tickets;
  // Staging: the test copy's booking pages (lib/integrations/booking-2027.ts). Production: closed until ticket sales are approved.
  const buy = bookingLink("tickets") ?? portalLink("tickets", opts.environment);
  const myBooking = bookingLink("booking");
  const notes = [COPY_DRAFT, "Ticket categories, prices and payment gateway are approved separately (directive section 6). Payment collection is not authorised."];
  return (
    <Shell page="tickets" opts={opts} notes={props.notes ?? "inline"} groups={[["Tickets & registration", notes]]}>
      {/* Booking links (staging, or the approved production portal) carry the website's own origin back to the portal. */}
      {bookingLink("booking") ? <PortalReturn allow={portalReturnRule()} /> : null}
      <PageHero accent={1} composition="dates" title={t.title.text} intro={t.intro.text} opts={opts} notes={notes.slice(0, 1)}>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href={PRIORITY_HREF} className="mt-8">{PRIORITY_CTA}</Button>
        </div>
      </PageHero>
      <Section id="status" ground="ivory" labelledBy="status-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="status-title" className="lg:col-span-5" style={h2Style}>Ticket sales.</h2>
          <div className="space-y-6 lg:col-span-6 lg:col-start-7">
            {buy ? (
              <div className="flex flex-wrap gap-3">
                <Button href={buy} variant="outline" tone="light" portal={buy === bookingLink("tickets")}>Buy tickets</Button>
                {myBooking && <Button href={myBooking} variant="link" tone="light" portal>Find my booking</Button>}
              </div>
            ) : (
              <Pending>{t.status.text}</Pending>
            )}
            <SectionNotes notes={notes.slice(1)} opts={opts} ground="ivory" />
          </div>
        </div>
      </Section>
      <Section id="categories" ground="white" labelledBy="categories-title" innerClassName="lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="categories-title" className="lg:col-span-5" style={h2Style}>Ticket categories.</h2>
          <div className="lg:col-span-6 lg:col-start-7">
            {TICKET_CATALOGUE_2027.status === "approved" ? (
              <>
                <ul className="border-t" style={{ borderColor: C.black }}>
                  {TICKET_CATALOGUE_2027.value.map((c) => (
                    <li key={c.id} className="flex items-baseline justify-between gap-6 border-b py-4" style={{ borderColor: "rgba(22,17,10,.16)" }}>
                      <span style={{ ...display, fontWeight: 500, fontSize: "22px" }}>{c.name}</span>
                      <span className="tabular-nums text-[17px]">{formatNgn(c.priceNgn)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[15px] leading-relaxed" style={{ color: C.body }}>{t.pricesNote.text}</p>
              </>
            ) : (
              <Pending>{t.categories.text}</Pending>
            )}
          </div>
        </div>
      </Section>
      {/* What ticketing will offer is a business commitment: shown on production only once approved, and marked staging until then. */}
      {(ticketingDetailsApproved() || opts.environment !== "production") && (
      <Section id="how" ground="black" labelledBy="how-title" staging={!ticketingDetailsApproved()}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="how-title" className="lg:col-span-5" style={h2Style}>How registration will work.</h2>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[17px] leading-[1.7]" style={{ color: "rgba(245,239,228,.85)" }}>{t.willSupportNote.text}</p>
            <ul className="mt-6 border-t" style={{ borderColor: "rgba(200,169,106,.45)" }}>
              {t.willSupport.map((x) => (
                <li key={x} className="border-b py-4 text-[17px]" style={{ borderColor: "rgba(245,239,228,.14)" }}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      )}
      <PriorityList opts={opts} notes={[]} />
      <FinalCta to={TARGETS} />
    </Shell>
  );
}

/* ── Gallery & past events ──────────────────────────────────────────── */

/**
 * Splits photographs, in order, into rows whose widths-over-heights add up as
 * evenly as possible to about `target`, so every full-width row has a similar
 * height and no row is left with a lone photograph.
 */
export function justifiedRows<T>(items: readonly T[], aspect: (item: T) => number, target: number): T[][] {
  const a = items.map(aspect);
  const n = Math.max(1, Math.round(a.reduce((x, y) => x + y, 0) / target));
  const ideal = a.reduce((x, y) => x + y, 0) / n;
  // cost[i][k]: best squared deviation for the first i items in k rows.
  const cost = Array.from({ length: items.length + 1 }, () => Array(n + 1).fill(Infinity));
  const cut = Array.from({ length: items.length + 1 }, () => Array(n + 1).fill(0));
  cost[0][0] = 0;
  for (let i = 1; i <= items.length; i++) {
    for (let k = 1; k <= Math.min(n, i); k++) {
      let sum = 0;
      for (let j = i; j >= k; j--) {
        sum += a[j - 1];
        const c = cost[j - 1][k - 1] + (sum - ideal) ** 2;
        if (c < cost[i][k]) { cost[i][k] = c; cut[i][k] = j - 1; }
      }
    }
  }
  const rows: T[][] = [];
  for (let i = items.length, k = n; k > 0; k--) { rows.unshift(items.slice(cut[i][k], i)); i = cut[i][k]; }
  return rows;
}

/**
 * The HEBS Lagos 2026 summit photographs, grouped by what each one shows. Like
 * the Education page's, they render only in development or the protected review
 * preview; elsewhere the page keeps its reserved plate.
 */
const aspectOf = (id: string) => findReviewAsset(id).aspect ?? 1.5;
const sumOf = (ids: readonly string[]) => ids.reduce((n, id) => n + aspectOf(id), 0);

/** The full-size files of photographs this deployment may show, for the photograph viewer. */
function viewerItems(ids: readonly string[], opts: Opts): LightboxItem[] {
  return ids.flatMap((id) => {
    const a = reviewMedia(id, opts.environment);
    return a ? [{ src: a.src, alt: a.alt || findReviewAsset(id).alt || "HEBS Lagos 2026" }] : [];
  });
}

/**
 * The 2026 exhibition floor on the Sponsorship page: several stands and products,
 * as historical examples, with the two ways in. Left out when the photographs are
 * unavailable; implies no 2027 sponsorship.
 */
function ExhibitionFloor({ opts }: { opts: Opts }) {
  const ids = EXHIBITION.page.filter((id) => reviewMedia(id, opts.environment));
  if (ids.length < 4) return null;
  const sponsor = pageHref("sponsorship", "inquiry");
  const exhibit = pageHref("exhibitors", "apply");
  return (
    <Section id="exhibition-2026" ground="ivory" labelledBy="exhibition-2026-title">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <h2 id="exhibition-2026-title" style={h2Style}>{EXHIBITION.pageTitle}</h2>
        <div className="flex flex-wrap gap-3">
          {sponsor ? <Button href={sponsor} variant="primary" tone="light">Become a sponsor</Button> : null}
          {exhibit ? <Button href={exhibit} variant="outline" tone="light">Become an exhibitor</Button> : null}
        </div>
      </div>
      <LightboxGroup items={viewerItems(ids, opts)} label={EXHIBITION.pageTitle}>
      <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-6 lg:grid-rows-[260px_260px] lg:gap-4">
        {ids.map((id, j) => (
          <li key={id} className={`relative overflow-hidden ${["lg:col-span-3 lg:row-span-2 aspect-[4/3] lg:aspect-auto col-span-2", "lg:col-span-2 aspect-square lg:aspect-auto", "lg:col-span-1 aspect-square lg:aspect-auto", "lg:col-span-1 aspect-square lg:aspect-auto", "lg:col-span-2 aspect-[2/1] col-span-2 lg:aspect-auto"][j] ?? "aspect-square"}`}>
            <LightboxTrigger index={j} label={findReviewAsset(id).alt}>
              <Pic id={id} className="absolute inset-0 h-full w-full object-cover" sizes={j === 0 ? "(min-width: 1024px) 620px, 100vw" : "(min-width: 1024px) 300px, 50vw"} />
            </LightboxTrigger>
          </li>
        ))}
      </ul>
      </LightboxGroup>
      <p className="mt-4 text-[13.5px]" style={{ color: C.body }}>{EXHIBITION.pageNote}</p>
    </Section>
  );
}

const summitDaysShown = (opts: Opts) => SUMMIT_DAYS.every((d) => d.photos.every((id) => reviewMedia(id, opts.environment)));

/**
 * The two 2026 summit days: a full-width photographic retrospective under the
 * Gallery masthead, each day a large photograph and a second one, a date, one
 * line and its collections. Every photograph opens in the viewer. Absent (and the
 * masthead keeps its panel) when the photographs are unavailable.
 */
function SummitDays({ opts }: { opts: Opts }) {
  if (!summitDaysShown(opts)) return null;
  const ids = SUMMIT_DAYS.flatMap((d) => [...d.photos]);
  return (
    <Section id="summit-days" ground="black" labelledBy="summit-days-title" innerClassName="lg:py-20">
      <h2 id="summit-days-title" className="sr-only">The 2026 summit days</h2>
      <LightboxGroup items={viewerItems(ids, opts)} label="The 2026 summit days">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
          {SUMMIT_DAYS.map((d) => (
            <article key={d.key} className="grid grid-cols-[1.5fr_1fr] gap-3 lg:gap-4">
              <div className="relative aspect-[4/5] overflow-hidden lg:aspect-[4/5]">
                <LightboxTrigger index={ids.indexOf(d.photos[0])} label={findReviewAsset(d.photos[0]).alt || d.title}>
                  <Pic id={d.photos[0]} className="absolute inset-0 h-full w-full object-cover" sizes="(min-width: 1024px) 400px, 60vw" />
                </LightboxTrigger>
              </div>
              <div className="grid content-end gap-3">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <LightboxTrigger index={ids.indexOf(d.photos[1])} label={findReviewAsset(d.photos[1]).alt || d.title}>
                    <Pic id={d.photos[1]} className="absolute inset-0 h-full w-full object-cover" sizes="(min-width: 1024px) 270px, 40vw" />
                  </LightboxTrigger>
                </div>
              </div>
              <div className="col-span-2 mt-2">
                <p className="text-[11.5px] uppercase tracking-[.24em]" style={{ color: "#D9C192" }}>{d.date}</p>
                <h3 className="mt-2" style={{ ...display, fontWeight: 500, fontSize: "clamp(28px, 2.6vw, 38px)", lineHeight: 1.05 }}>{d.title}</h3>
                <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed" style={{ color: "rgba(246,239,226,.82)" }}>{d.line}</p>
                <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
                  {d.links.filter(([id]) => PAGES.gallery.categories.some((c) => c.id === id && c.photos.some((p) => reviewMedia(p, opts.environment)))).map(([id, label]) => (
                    <a key={id} href={`#gallery-${id}`} className="underline decoration-[#B8914C] underline-offset-4 hover:text-[#F5E7C3]" style={{ color: "#F0E2C4" }}>{label} →</a>
                  ))}
                </p>
              </div>
            </article>
          ))}
        </div>
      </LightboxGroup>
    </Section>
  );
}

function Lagos2026Photographs({ opts, notes }: { opts: Opts; notes: string[] }) {
  const g = PAGES.gallery;
  // Only photographs this deployment may show: the review-only collection is absent on production.
  const categories = g.categories
    .map((c) => ({ ...c, photos: c.photos.filter((id) => reviewMedia(id, opts.environment)) }))
    .filter((c) => c.photos.length > 0);
  const count = categories.reduce((n, c) => n + c.photos.length, 0);
  return (
    <Section id="lagos-2026" ground="white" labelledBy="lagos-2026-title">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <h2 id="lagos-2026-title" style={h2Style}>{g.photosTitle.text}</h2>
        <p className="text-[15px]" style={{ color: C.body }}>{g.photosIntro.text} {count} photographs.</p>
      </div>
      <SectionNotes notes={notes} opts={opts} ground="white" className="mt-6" />
      <GalleryNav items={categories.map((c) => ({ id: c.id, title: c.title.text, count: c.photos.length, review: "review" in c }))} />
      {categories.map((c) => (
        <section key={c.id} id={`gallery-${c.id}`} aria-labelledby={`gallery-${c.id}-title`} className="mt-14 scroll-mt-28 border-t pt-8 lg:mt-20" style={{ borderColor: "rgba(160,128,72,.35)" }}>
          <h3 id={`gallery-${c.id}-title`} style={{ ...display, fontWeight: 500, fontSize: "clamp(26px, 2.6vw, 38px)", lineHeight: 1.1 }}>{c.title.text}</h3>
          {"review" in c ? (
            <p className="mt-4 max-w-[78ch] border-l-2 py-1 pl-4 text-[14px] leading-relaxed" style={{ borderColor: "#B8914C", color: C.body }}>{g.winnersNote.text}</p>
          ) : null}
          {/*
            Justified rows: each photograph grows in proportion to its width over height, so a row shares one
            height. A desktop row too wide for a phone splits into balanced phone rows, stacked.
          */}
          <LightboxGroup items={viewerItems(c.photos, opts)} label={c.title.text}>
          <div className="mt-6 flex flex-col gap-3 lg:gap-4">
            {justifiedRows(c.photos, aspectOf, 3.6).map((row) => (
              <div key={row[0]} className="flex flex-col gap-3 lg:flex-row lg:gap-4">
                {(sumOf(row) > 2.4 ? justifiedRows(row, aspectOf, 1.8) : [row]).map((part) => (
                  <ul key={part[0]} className="flex gap-3 lg:basis-0 lg:grow-[var(--g)] lg:gap-4" style={{ "--g": sumOf(part) } as CSSProperties}>
                    {part.map((id) => {
                      const r = aspectOf(id);
                      return (
                        <li key={id} className="basis-0 overflow-hidden" style={{ flexGrow: r, aspectRatio: String(r) }}>
                          <LightboxTrigger index={c.photos.indexOf(id)} label={findReviewAsset(id).alt || c.title.text}>
                            <Pic id={id} className="h-full w-full object-cover" sizes={`(min-width: 1024px) ${Math.round(r * 340)}px, ${Math.round(r * 210)}px`} />
                          </LightboxTrigger>
                        </li>
                      );
                    })}
                  </ul>
                ))}
              </div>
            ))}
          </div>
          </LightboxGroup>
        </section>
      ))}
    </Section>
  );
}

export function GalleryPage(props: PageProps) {
  const opts = optsOf(props);
  const g = PAGES.gallery;
  // The review-only prize presentations never decide whether the gallery is photographed.
  const photographed = g.categories.filter((c) => !("review" in c)).every((c) => c.photos.every((id) => reviewMedia(id, opts.environment)));
  const notes = [
    COPY_DRAFT,
    photographed
      ? "Photographs from the HEBS Lagos 2026 summit days (House of Snapp collection). The prize-presentation photographs are internal review only; results are subject to final verification. No pre-party photographs are included."
      : "Images reserved for approved HEBS Lagos 2026 event photographs only. HEBS US photographs stay in the archive and are never shown here.",
  ];
  return (
    <Shell page="gallery" opts={opts} notes={props.notes ?? "inline"} groups={[["Gallery & past events", notes]]}>
      <PageHero accent={2} composition="archive" title={g.title.text} intro={g.intro.text} opts={opts} notes={notes.slice(0, 1)} noMedia={summitDaysShown(opts)} />
      <SummitDays opts={opts} />
      {photographed ? <Lagos2026Photographs opts={opts} notes={notes.slice(1)} /> : (
        <Section id="lagos-2026" ground="white" labelledBy="lagos-2026-title">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-12">
            <div className="lg:col-span-4">
              <h2 id="lagos-2026-title" style={h2Style}>{sentenceCase(COPY.highlights.headline.text)}</h2>
              <div className="mt-8"><Pending>{g.pending.text}</Pending></div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px]" style={{ color: C.body }}>
                {COPY.highlights.kinds.map((k) => <li key={k}>{k}</li>)}
              </ul>
              <SectionNotes notes={notes.slice(1)} opts={opts} ground="white" className="mt-6" />
            </div>
            <div className="lg:col-span-8">
              <Plate slotId="highlights-2026" opts={opts} noteLight sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-[16/7] w-full" tone={TONE.light}>
              </Plate>
            </div>
          </div>
        </Section>
      )}
      {hasWatchFilms() ? (
        <Section id="watch" ground="black" labelledBy="watch-title">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-5">
              <Kicker tone="dark">{WATCH.label}</Kicker>
              <h2 id="watch-title" className="mt-5" style={{ ...h2Style, color: C.ivory }}>{WATCH.title} {WATCH.accent}</h2>
              <p className="mt-6 max-w-[42ch] text-[17px] leading-[1.7]" style={{ color: "rgba(246,239,226,.82)" }}>{WATCH.body}</p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7"><WatchFilms tone="dark" /></div>
          </div>
        </Section>
      ) : null}
      <Section id="archive" ground="ivory" labelledBy="archive-title" innerClassName="lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="archive-title" className="lg:col-span-5" style={h2Style}>Past events.</h2>
          <div className="space-y-6 lg:col-span-6 lg:col-start-7">
            <p className="text-[17px] leading-[1.7]" style={{ color: C.body }}>{g.archive.text}</p>
            <Button href="/" variant="outline" tone="light">Visit the HEBS Lagos 2026 website</Button>
            <p className="text-[15px] leading-relaxed" style={{ color: C.body }}>{g.earlier.text}</p>
          </div>
        </div>
      </Section>
      <FinalCta to={TARGETS} />
    </Shell>
  );
}

/**
 * The official 2027 email addresses that have passed their mail-flow tests
 * (lib/site/contacts-2027.ts), or the page's "published once approved" line.
 */
function ContactEmails({ fallback, only = ["enquiries", "tickets"] }: { fallback: string; only?: ("enquiries" | "tickets")[] }) {
  const shown = only.flatMap((id) => {
    const address = publicContact(id);
    return address ? [{ id, address, purpose: CONTACTS_2027[id].purpose }] : [];
  });
  if (shown.length === 0) return <Pending>{fallback}</Pending>;
  return (
    <ul className="space-y-2 text-[15px]">
      {shown.map((e) => (
        <li key={e.id}>
          <span style={{ color: C.body }}>{e.purpose}: </span>
          <a href={`mailto:${e.address}`} className={quietLink} style={{ color: C.black }}>{e.address}</a>
        </li>
      ))}
    </ul>
  );
}

/* ── Contact us ─────────────────────────────────────────────────────── */

export function ContactPage(props: PageProps) {
  const opts = optsOf(props);
  const c = PAGES.contact;
  const notes = [COPY_DRAFT, "Email addresses and social accounts withheld until public contacts are approved (D10). No message is collected until storage (D1) and the privacy notice (D13) are approved."];
  return (
    <Shell page="contact" opts={opts} notes={props.notes ?? "inline"} groups={[["Contact us", notes]]}>
      <PageHero composition="lagos" title={c.title.text} intro={c.intro.text} opts={opts} notes={notes.slice(0, 1)} />
      <Section id="message" ground="ivory" labelledBy="message-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-8 lg:col-span-5">
            <h2 id="message-title" style={h2Style}>Contact form.</h2>
            <div>
              <h3 className="text-[14px] font-semibold">Email</h3>
              <div className="mt-3"><ContactEmails fallback={c.emails.text} /></div>
            </div>
            <div>
              <h3 className="text-[14px] font-semibold">Social media</h3>
              <div className="mt-3"><Pending>{c.social.text}</Pending></div>
            </div>
            <div>
              <h3 className="text-[14px] font-semibold">Business inquiries</h3>
              <ul className="mt-2 text-[15px]">
                <li><PageLink to="sponsorship" hash="inquiry" className={quietLink} style={{ color: C.black }}>Sponsorship and partnerships</PageLink></li>
                <li><PageLink to="exhibitors" hash="apply" className={quietLink} style={{ color: C.black }}>Exhibiting at HEBS 2027</PageLink></li>
              </ul>
            </div>
            <SectionNotes notes={notes.slice(1)} opts={opts} ground="ivory" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <FormBlock form="enquiry" title="Contact form" gate="The contact form is not open yet. Nothing can be sent." submitLabel="Send message" />
          </div>
        </div>
      </Section>
      <FinalCta to={TARGETS} />
    </Shell>
  );
}

/* ── About HEBS ─────────────────────────────────────────────────────── */

export function AboutPage(props: PageProps) {
  const opts = optsOf(props);
  const a = PAGES.about;
  const notes = [
    `History and the three statements are carried verbatim from the live ${a.pillarsSource} and stay provisional until Mrs. Shuler approves them for 2027.`,
    "Vision and impact copy awaiting owner approval.",
  ];
  return (
    <Shell page="about" opts={opts} notes={props.notes ?? "inline"} groups={[["About HEBS", notes]]}>
      <PageHero accent={1} media={HERO_MEDIA.about} title={a.title.text} intro={COPY.welcome.body.text} opts={opts} />
      <Section id="history" ground="ivory" labelledBy="history-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="history-title" className="max-w-[14ch] lg:col-span-5" style={h2Style}>{sentenceCase(COPY.welcome.headline.text)}</h2>
          <div className="space-y-6 lg:col-span-6 lg:col-start-7">
            <p className="text-[18px] leading-[1.7]" style={{ color: C.body }}>{a.history.text}</p>
            <p className="text-[18px] leading-[1.7]" style={{ color: C.body }}>{a.next.text}</p>
            <SectionNotes notes={notes.slice(0, 1)} opts={opts} ground="ivory" />
          </div>
        </div>
      </Section>
      <Section id="mission" ground="black" labelledBy="mission-title">
        <h2 id="mission-title" style={h2Style}>What HEBS stands for.</h2>
        <ul className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {a.pillars.map((p) => (
            <li key={p.title} className="border-t pt-6" style={{ borderColor: "rgba(200,169,106,.55)" }}>
              <h3 style={{ ...display, fontWeight: 500, fontSize: "26px", lineHeight: 1.15 }}>{p.title}</h3>
              <p className="mt-4 text-[16px] leading-[1.7]" style={{ color: "rgba(245,239,228,.8)" }}>{p.body.text}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section id="vision" ground="white" labelledBy="vision-title" innerClassName="lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="vision-title" className="lg:col-span-5" style={h2Style}>Vision and impact.</h2>
          <div className="lg:col-span-6 lg:col-start-7">
            <Pending>{a.vision.text}</Pending>
            <SectionNotes notes={notes.slice(1)} opts={opts} ground="white" className="mt-6" />
          </div>
        </div>
      </Section>
      <FinalCta to={TARGETS} />
    </Shell>
  );
}

/* ── Speakers & educators ───────────────────────────────────────────── */

export function SpeakersPage(props: PageProps) {
  const opts = optsOf(props);
  const sp = PAGES.speakers;
  const notes = [COPY_DRAFT, "No speaker or educator is confirmed, so none is named and no portrait is shown."];
  return (
    <Shell page="speakers" opts={opts} notes={props.notes ?? "inline"} groups={[["Speakers & educators", notes]]}>
      <PageHero accent={1} composition="dates" title={sp.title.text} intro={sp.intro.text} opts={opts} notes={notes.slice(0, 1)} />
      <Section id="announced" ground="ivory" labelledBy="announced-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="announced-title" className="lg:col-span-5" style={h2Style}>Announced so far.</h2>
          <div className="space-y-8 lg:col-span-6 lg:col-start-7">
            <Pending>{sp.pending.text}</Pending>
            <div>
              <h3 className="text-[14px] font-semibold">Each profile will include</h3>
              <ul className="mt-3 border-t" style={{ borderColor: "rgba(0,0,0,.18)" }}>
                {sp.profile.map((x) => <li key={x} className="border-b py-3 text-[16px]" style={{ borderColor: "rgba(0,0,0,.18)" }}>{x}</li>)}
              </ul>
            </div>
            <SectionNotes notes={notes.slice(1)} opts={opts} ground="ivory" />
          </div>
        </div>
      </Section>
      <Section id="teach" ground="black" labelledBy="teach-title" innerClassName="lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="teach-title" className="lg:col-span-5" style={h2Style}>Teach at HEBS 2027.</h2>
          <div className="space-y-6 lg:col-span-6 lg:col-start-7">
            <p className="text-[17px] leading-[1.7]" style={{ color: "rgba(245,239,228,.85)" }}>{sp.teach.text}</p>
            <p className="text-[15px]">
              <PageLink to="education" className={`${quietLink} hover:text-white`} style={{ color: C.champL }}>Education & masterclasses</PageLink>
            </p>
          </div>
        </div>
      </Section>
      <FinalCta to={TARGETS} />
    </Shell>
  );
}


/** The review variants every 2027 page accepts: ?brand=champagne and ?notes=panel. */
export function reviewProps(searchParams: { brand?: string; notes?: string }): Pick<PageProps, "brand" | "notes"> {
  return { brand: searchParams.brand === "champagne" ? "champagne" : "mark", notes: searchParams.notes === "inline" ? "inline" : "panel" };
}

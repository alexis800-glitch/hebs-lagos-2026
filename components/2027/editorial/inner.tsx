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
import {
  CATEGORIES_2027, COMPETITIONS_2027, COMPETITION_COUNT_2027, EDITION_DAYS, PROGRAMME_2027, VENUE,
} from "@/lib/editions/2027";
import { portalLink } from "@/lib/integrations/registration-2027";
import { PRIORITY_CTA, PRIORITY_HREF, pageHref, type PageId } from "@/lib/site/2027";
import { resolveSlot } from "@/lib/assets/register";
import { Pic, reviewMedia } from "@/components/2027/home/media";
import { findReviewAsset } from "@/lib/assets/home-2027-review";
import { type PageProps, Shell } from "./pages";
import { Plate, Section, SectionNotes, type Opts } from "./parts";
import { COMPETITION_ANCHORS, Destination, EXPERIENCE_LINKS, FinalCta, PriorityList, ThreeDays, dayAnchor, type Targets } from "./sections";
import { FormBlock, PageContents, PageHero, PageLink, Pending } from "./site";
import { C, HORIZON, PANORAMA, TONE, display, h2Style, sentenceCase } from "./tokens";

const COPY_DRAFT = "Body copy provisional, awaiting owner approval.";

const TARGETS: Targets = {
  priority: PRIORITY_HREF,
  experience: pageHref("experience") ?? PRIORITY_HREF,
  sponsor: pageHref("sponsorship") ?? PRIORITY_HREF,
};

const optsOf = ({ environment, brand = "mark", notes = "inline" }: PageProps): Opts => ({ environment, brand, inline: notes === "inline" });

const quietLink = "inline-flex min-h-[44px] items-center underline decoration-[#C8A96A] underline-offset-[7px] transition-colors duration-200";
const outbound = "inline-flex min-h-[48px] items-center border px-6 text-[13px] font-semibold transition-colors duration-200";

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
    experiences: ["Experience images reserved: five for approved HEBS Lagos event photographs, the destination one for an approved NJS Royale Beach Resort photograph."],
    days: ["No 2027 session times are approved; the horizon is one abstract panorama and implies no time of day."],
  };
  return (
    <Shell page="experience" opts={opts} notes={props.notes ?? "inline"} groups={[["Page", notes.hero], ["Three days", notes.days], ["Six experiences", notes.experiences]]}>
      <PageHero title={PAGES.experience.title.text} intro={PAGES.experience.intro.text} opts={opts} notes={notes.hero}>
        <PageContents items={[{ href: "#three-days", label: "The three days" }, { href: "#six-experiences", label: "The six experiences" }, { href: "#destination", label: "The destination" }]} />
      </PageHero>
      <ThreeDays opts={opts} notes={notes.days} compact />
      <Section id="six-experiences" ground="white" labelledBy="six-title">
        <h2 id="six-title" className="max-w-[20ch]" style={h2Style}>Six experiences, one destination.</h2>
        <SectionNotes notes={notes.experiences} opts={opts} ground="white" className="mt-6" />
        {/* The directive numbers the six experiences, so the numerals carry information. */}
        <ol className="mt-14 grid gap-x-12 gap-y-16 md:grid-cols-2">
          {COPY.experience.items.map((item, i) => {
            const [to, hash] = EXPERIENCE_LINKS[item.slot];
            const self = to === "experience";
            // An approved photograph takes the full 4:3 frame; until then the slot is a slim band,
            // so reserved positions hold the layout without dominating it.
            const filled = resolveSlot(item.slot, opts.environment).kind === "asset";
            return (
              <li key={item.slot} id={item.slot} className="flex flex-col">
                <Plate
                  slotId={item.slot}
                  opts={opts}
                  noteLight={i !== 5}
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className={filled ? "aspect-[4/3] w-full" : "hidden aspect-[16/5] w-full md:block"}
                  tone={i === 5 ? PANORAMA : TONE.light}
                  style={i === 5 ? { backgroundSize: "300% 100%", backgroundPosition: "50% 0" } : undefined}
                >
                  {i === 5 && <span aria-hidden="true" className="absolute inset-x-0 block h-px" style={{ top: HORIZON, background: "rgba(234,215,168,.45)" }} />}
                </Plate>
                <div className={`${filled ? "mt-6" : "md:mt-6"} grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4`}>
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
      <Destination opts={opts} notes={[COPY_DRAFT, "Venue name provisional until confirmed (D9)."]} compact />
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
      <PageHero title={PAGES.programme.title.text} intro={PAGES.programme.intro.text} opts={opts} notes={notes}>
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
                <Plate slotId={`day-${i + 1}`} opts={opts} noteLight={i !== 0} sizes="(min-width: 1024px) 28vw, 100vw" className="mt-8 aspect-[16/10] w-full" tone={i === 0 ? PANORAMA : TONE.light}
                  style={i === 0 ? { backgroundSize: "300% 100%" } : undefined}>
                  {i === 0 && <span aria-hidden="true" className="absolute inset-x-0 block h-px" style={{ top: HORIZON, background: "rgba(234,215,168,.45)" }} />}
                </Plate>
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
const EDU_LEAD = "exp-education";
const EDU_SPEAKER = "welcome-inset";
const EDU_PHOTOS = [
  { id: "edu-session", wide: true }, { id: "edu-styling", wide: false }, { id: "edu-skincare", wide: false },
  { id: "edu-technique", wide: false }, { id: "edu-loc", wide: false }, { id: "sp-hall", wide: true },
] as const;

export function EducationPage(props: PageProps) {
  const opts = optsOf(props);
  const photographed = [EDU_LEAD, EDU_SPEAKER, ...EDU_PHOTOS.map((p) => p.id)].every((id) => reviewMedia(id, opts.environment));
  const notes = [
    COPY_DRAFT,
    "No speaker or educator is confirmed, so none is named.",
    photographed
      ? "Photographs from HEBS Lagos 2026 (House of Snapp collection), for internal review only: the photographer's permission and the consent of the people shown are not recorded."
      : "Education image reserved for an approved HEBS Lagos event photograph.",
  ];
  const register = portalLink("education-registration", opts.environment);
  return (
    <Shell page="education" opts={opts} notes={props.notes ?? "inline"} groups={[["Education & masterclasses", notes]]}>
      <PageHero title={sentenceCase(PAGES.education.title.text)} intro={PAGES.education.intro.text} opts={opts} notes={notes.slice(0, 1)}>
        <PageContents items={[{ href: "#tracks", label: "Learning tracks" }, { href: "#educators", label: "Educators" }, { href: "#registration", label: "Registration" }]} />
      </PageHero>
      <Section id="tracks" ground="black" labelledBy="tracks-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h2 id="tracks-title" style={h2Style}>Five ways to learn.</h2>
            <ul className="mt-10 border-t" style={{ borderColor: "rgba(200,169,106,.45)" }}>
              {PAGES.education.tracks.map((t) => (
                <li key={t.id} id={t.id} className="grid gap-2 border-b py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8 lg:py-7" style={{ borderColor: "rgba(245,239,228,.14)" }}>
                  <h3 style={{ ...display, fontWeight: 500, fontSize: "clamp(26px, 2.6vw, 38px)", lineHeight: 1.1 }}>{t.title}</h3>
                  <p className="text-[16px] leading-[1.7]" style={{ color: "rgba(245,239,228,.78)" }}>{t.body.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              {photographed ? (
                <figure>
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Pic id={EDU_LEAD} className="absolute inset-0 h-full w-full object-cover" sizes="(min-width: 1024px) 32vw, 100vw" />
                    <span aria-hidden="true" className="absolute inset-4 border" style={{ borderColor: "rgba(200,169,106,.28)" }} />
                  </div>
                  <figcaption className="mt-3 text-[14px]" style={{ color: "rgba(245,239,228,.72)" }}>{PAGES.education.leadCaption.text}</figcaption>
                </figure>
              ) : (
                <Plate slotId="education" opts={opts} sizes="(min-width: 1024px) 32vw, 100vw" className="aspect-[4/5] w-full" tone={TONE.dark}>
                  <span aria-hidden="true" className="absolute inset-4 border" style={{ borderColor: "rgba(200,169,106,.28)" }} />
                </Plate>
              )}
              {photographed && <SectionNotes notes={notes.slice(2)} opts={opts} ground="black" className="mt-4" />}
            </div>
          </div>
        </div>
      </Section>
      {photographed && (
        <Section id="photographs" ground="white" labelledBy="photographs-title">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <h2 id="photographs-title" style={h2Style}>{PAGES.education.photos.text}</h2>
            <p className="text-[14px]" style={{ color: C.body }}>{PAGES.education.photosCaption.text}</p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {EDU_PHOTOS.map((p) => (
              <li key={p.id} className={`relative overflow-hidden ${p.wide ? "col-span-2 aspect-[3/2]" : "aspect-[3/4] lg:aspect-auto"}`}>
                <Pic id={p.id} className="absolute inset-0 h-full w-full object-cover" sizes={p.wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"} />
              </li>
            ))}
          </ul>
        </Section>
      )}
      <Section id="educators" ground="ivory" labelledBy="educators-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h2 id="educators-title" style={h2Style}>Speakers and educators.</h2>
            {photographed && (
              <figure className="mt-10 max-w-[360px]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Pic id={EDU_SPEAKER} className="absolute inset-0 h-full w-full object-cover" sizes="(min-width: 1024px) 360px, 100vw" />
                </div>
                <figcaption className="mt-3 text-[14px]" style={{ color: C.body }}>{PAGES.education.speakerCaption.text}</figcaption>
              </figure>
            )}
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Pending>{PAGES.education.educators.text}</Pending>
            <SectionNotes notes={notes.slice(1, 2)} opts={opts} ground="ivory" className="mt-6" />
          </div>
        </div>
      </Section>
      <Section id="registration" ground="white" labelledBy="registration-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="registration-title" className="lg:col-span-5" style={h2Style}>Registration.</h2>
          <div className="lg:col-span-6 lg:col-start-7">
            {register ? (
              <a href={register} className={`${outbound} hover:bg-black hover:text-white`} style={{ borderColor: C.black, color: C.black }}>Register for education sessions</a>
            ) : (
              <Pending>{PAGES.education.registration.text}</Pending>
            )}
            <p className="mt-6 text-[15px]" style={{ color: C.body }}>
              To hear first, use the <a href={PRIORITY_HREF} className={quietLink} style={{ color: C.black }}>2027 priority list</a>, which opens soon.
            </p>
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
      <PageHero title={sentenceCase(COPY.competitions.headline.text)} intro={PAGES.competitions.intro.text} opts={opts} notes={notes.slice(0, 1)}>
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
                  {list.map((c) => <li key={c.slug} className="text-[17px] leading-snug">{c.name}</li>)}
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
              <a href={apply} className={`${outbound} hover:bg-black hover:text-white`} style={{ borderColor: C.black, color: C.black }}>Apply to compete</a>
            ) : (
              <Pending>{PAGES.competitions.apply.text}</Pending>
            )}
            <p className="mt-6 text-[15px]" style={{ color: C.body }}>
              To hear when applications open, use the <a href={PRIORITY_HREF} className={quietLink} style={{ color: C.black }}>2027 priority list</a>, which opens soon.
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
      <PageHero title={sentenceCase(COPY.partners.headline.text)} intro={PAGES.sponsorship.intro.text} opts={opts} notes={notes.slice(0, 1)} ground="champagne">
        <PageContents light items={[{ href: "#opportunities", label: "Opportunities" }, { href: "#how-it-works", label: "How it works" }, { href: "#inquiry", label: "Inquiries" }]} />
      </PageHero>
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
            <div className="mt-8"><Pending>{PAGES.sponsorship.contact.text}</Pending></div>
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

/* ── Exhibitors ─────────────────────────────────────────────────────── */

export function ExhibitorsPage(props: PageProps) {
  const opts = optsOf(props);
  const notes = [
    COPY_DRAFT,
    "No application is collected. Submission follows INTEGRATION-CONTRACT-v1.1; the form stays closed until the private integration test and owner approval. The company-profile upload is not shown in this release (owner decision 7) until malware scanning or quarantine is approved.",
  ];
  return (
    <Shell page="exhibitors" opts={opts} notes={props.notes ?? "inline"} groups={[["Exhibitors", notes]]}>
      <PageHero title={PAGES.exhibitors.title.text} intro={PAGES.exhibitors.intro.text} opts={opts} notes={notes.slice(0, 1)} ground="ivory">
        <PageContents light items={[{ href: "#exhibit", label: "Ways to exhibit" }, { href: "#apply", label: "Applications" }, { href: "#brands", label: "Participating brands" }]} />
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

function TravelBlock({ id, title, ground, children }: { id: string; title: string; ground: "white" | "ivory"; children: React.ReactNode }) {
  return (
    <Section id={id} ground={ground} labelledBy={`${id}-title`} innerClassName="lg:py-20">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <h2 id={`${id}-title`} className="lg:col-span-4" style={h2Style}>{title}</h2>
        <div className="space-y-6 lg:col-span-7 lg:col-start-6">{children}</div>
      </div>
    </Section>
  );
}

export function TravelPage(props: PageProps) {
  const opts = optsOf(props);
  const t = PAGES.travel;
  const notes = [
    COPY_DRAFT,
    "Venue name provisional, address and directions withheld until confirmed (D9).",
    "No room, package or availability is offered until approved.",
    "Visitor support contacts pending (D10).",
  ];
  const body = "text-[17px] leading-[1.7]";
  return (
    <Shell page="travel" opts={opts} notes={props.notes ?? "inline"} groups={[["Travel & accommodation", notes]]}>
      <PageHero title={t.title.text} intro={t.intro.text} opts={opts} notes={notes.slice(0, 1)} ground="atlantic">
        <PageContents items={[
          { href: "#venue", label: "The venue" }, { href: "#arriving", label: "Arriving in Lagos" }, { href: "#stay", label: "Accommodation" },
          { href: "#visas", label: "Visas" }, { href: "#faq", label: "Travel questions" },
        ]} />
      </PageHero>
      <Plate slotId="destination-gallery" opts={opts} sizes="100vw" className="aspect-[4/3] w-full sm:aspect-[21/9]" tone={PANORAMA}>
        <span aria-hidden="true" className="absolute inset-x-0 block h-px" style={{ top: HORIZON, background: "rgba(234,215,168,.45)" }} />
      </Plate>
      <TravelBlock id="venue" title="The venue." ground="white">
        <p className={body} style={{ color: C.body }}>{t.venue.text}</p>
        <Pending>{t.directions.text}</Pending>
        <a href={VENUE.website} rel="noopener" className={`${outbound} hover:bg-black hover:text-white`} style={{ borderColor: C.black, color: C.black }}>Visit njsbeachresort.com</a>
        <SectionNotes notes={notes.slice(1, 2)} opts={opts} ground="white" />
      </TravelBlock>
      <TravelBlock id="arriving" title="Arriving in Lagos." ground="ivory">
        <p className={body} style={{ color: C.body }}>{t.arrival.text}</p>
        <Pending>{t.airport.text}</Pending>
      </TravelBlock>
      <TravelBlock id="stay" title="Accommodation." ground="white">
        <Pending>{t.accommodation.text}</Pending>
        <SectionNotes notes={notes.slice(2, 3)} opts={opts} ground="white" />
      </TravelBlock>
      <TravelBlock id="visas" title="Visas." ground="ivory">
        <p className={body} style={{ color: C.body }}>{t.visas.text}</p>
        <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <li><a href={NIS.site} rel="noopener" className={`${outbound} hover:bg-black hover:text-white`} style={{ borderColor: C.black, color: C.black }}>Nigeria Immigration Service</a></li>
          <li><a href={NIS.evisa} rel="noopener" className={`${outbound} hover:bg-black hover:text-white`} style={{ borderColor: C.black, color: C.black }}>Official e-Visa portal</a></li>
        </ul>
      </TravelBlock>
      <Section id="faq" ground="black" labelledBy="faq-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="faq-title" className="lg:col-span-4" style={h2Style}>Travel questions.</h2>
          <div className="border-t lg:col-span-7 lg:col-start-6" style={{ borderColor: "rgba(200,169,106,.45)" }}>
            {t.faqs.map((f) => (
              <details key={f.q} className="group border-b" style={{ borderColor: "rgba(245,239,228,.14)" }}>
                <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-6 py-4 [&::-webkit-details-marker]:hidden"
                  style={{ ...display, fontWeight: 500, fontSize: "clamp(20px, 2vw, 26px)", lineHeight: 1.2 }}>
                  {f.q}
                  <span aria-hidden="true" className="shrink-0 text-[28px] leading-none transition-transform duration-200 group-open:rotate-45" style={{ color: C.champ }}>+</span>
                </summary>
                <p className="max-w-[56ch] pb-6 text-[16px] leading-[1.7]" style={{ color: "rgba(245,239,228,.8)" }}>{f.a.text}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="mt-12 max-w-[60ch]"><Pending light={false}>{t.support.text}</Pending></div>
        <SectionNotes notes={notes.slice(3)} opts={opts} ground="black" className="mt-6" />
      </Section>
      <FinalCta to={TARGETS} />
    </Shell>
  );
}

/* ── Tickets & registration ─────────────────────────────────────────── */

export function TicketsPage(props: PageProps) {
  const opts = optsOf(props);
  const t = PAGES.tickets;
  const buy = portalLink("tickets", opts.environment);
  const notes = [COPY_DRAFT, "Ticket categories, prices and payment gateway are approved separately (directive section 6). Payment collection is not authorised."];
  return (
    <Shell page="tickets" opts={opts} notes={props.notes ?? "inline"} groups={[["Tickets & registration", notes]]}>
      <PageHero title={t.title.text} intro={t.intro.text} opts={opts} notes={notes.slice(0, 1)}>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={PRIORITY_HREF} className="inline-flex min-h-[56px] items-center justify-center px-9 text-[13px] font-bold uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-[#EAD7A8]" style={{ background: C.champ, color: C.black }}>
            {PRIORITY_CTA}
          </a>
        </div>
      </PageHero>
      <Section id="status" ground="ivory" labelledBy="status-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="status-title" className="lg:col-span-5" style={h2Style}>Ticket sales.</h2>
          <div className="space-y-6 lg:col-span-6 lg:col-start-7">
            {buy ? (
              <a href={buy} className={`${outbound} hover:bg-black hover:text-white`} style={{ borderColor: C.black, color: C.black }}>Buy tickets</a>
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
          <div className="lg:col-span-6 lg:col-start-7"><Pending>{t.categories.text}</Pending></div>
        </div>
      </Section>
      <Section id="how" ground="black" labelledBy="how-title">
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

function Lagos2026Photographs({ opts, notes }: { opts: Opts; notes: string[] }) {
  const g = PAGES.gallery;
  const count = g.categories.reduce((n, c) => n + c.photos.length, 0);
  return (
    <Section id="lagos-2026" ground="white" labelledBy="lagos-2026-title">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <h2 id="lagos-2026-title" style={h2Style}>{g.photosTitle.text}</h2>
        <p className="text-[15px]" style={{ color: C.body }}>{g.photosIntro.text} {count} photographs.</p>
      </div>
      <SectionNotes notes={notes} opts={opts} ground="white" className="mt-6" />
      <nav aria-label="Photograph categories" className="mt-8">
        <ul className="flex flex-wrap gap-2">
          {g.categories.map((c) => (
            <li key={c.id}>
              <a href={`#gallery-${c.id}`} className="inline-flex min-h-[44px] items-center gap-2 border px-4 text-[14px] transition-colors duration-200 hover:bg-black hover:text-white" style={{ borderColor: "rgba(160,128,72,.55)", color: C.black }}>
                {c.title.text}<span aria-hidden="true" style={{ color: C.body }}>{c.photos.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {g.categories.map((c) => (
        <section key={c.id} id={`gallery-${c.id}`} aria-labelledby={`gallery-${c.id}-title`} className="mt-14 scroll-mt-28 border-t pt-8 lg:mt-20" style={{ borderColor: "rgba(160,128,72,.35)" }}>
          <h3 id={`gallery-${c.id}-title`} style={{ ...display, fontWeight: 500, fontSize: "clamp(26px, 2.6vw, 38px)", lineHeight: 1.1 }}>{c.title.text}</h3>
          {/*
            Justified rows: each photograph grows in proportion to its width over height, so a row shares one
            height. A desktop row too wide for a phone splits into balanced phone rows, stacked.
          */}
          <div className="mt-6 flex flex-col gap-3 lg:gap-4">
            {justifiedRows(c.photos, aspectOf, 3.6).map((row) => (
              <div key={row[0]} className="flex flex-col gap-3 lg:flex-row lg:gap-4">
                {(sumOf(row) > 2.4 ? justifiedRows(row, aspectOf, 1.8) : [row]).map((part) => (
                  <ul key={part[0]} className="flex gap-3 lg:basis-0 lg:grow-[var(--g)] lg:gap-4" style={{ "--g": sumOf(part) } as CSSProperties}>
                    {part.map((id) => {
                      const r = aspectOf(id);
                      return (
                        <li key={id} className="basis-0 overflow-hidden" style={{ flexGrow: r, aspectRatio: String(r) }}>
                          <Pic id={id} className="h-full w-full object-cover" sizes={`(min-width: 1024px) ${Math.round(r * 340)}px, ${Math.round(r * 210)}px`} />
                        </li>
                      );
                    })}
                  </ul>
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}
    </Section>
  );
}

export function GalleryPage(props: PageProps) {
  const opts = optsOf(props);
  const g = PAGES.gallery;
  const photographed = g.categories.every((c) => c.photos.every((id) => reviewMedia(id, opts.environment)));
  const notes = [
    COPY_DRAFT,
    photographed
      ? "Photographs from the HEBS Lagos 2026 summit days (House of Snapp collection), for internal review only until the written usage terms are on file. No pre-party, cheque or prize photographs are included."
      : "Images reserved for approved HEBS Lagos 2026 event photographs only. HEBS US photographs stay in the archive and are never shown here.",
  ];
  return (
    <Shell page="gallery" opts={opts} notes={props.notes ?? "inline"} groups={[["Gallery & past events", notes]]}>
      <PageHero title={g.title.text} intro={g.intro.text} opts={opts} notes={notes.slice(0, 1)} />
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
                <span aria-hidden="true" className="absolute inset-4 border" style={{ borderColor: "rgba(160,128,72,.4)" }} />
              </Plate>
            </div>
          </div>
        </Section>
      )}
      <Section id="archive" ground="ivory" labelledBy="archive-title" innerClassName="lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="archive-title" className="lg:col-span-5" style={h2Style}>Past events.</h2>
          <div className="space-y-6 lg:col-span-6 lg:col-start-7">
            <p className="text-[17px] leading-[1.7]" style={{ color: C.body }}>{g.archive.text}</p>
            <a href="/" className={`${outbound} hover:bg-black hover:text-white`} style={{ borderColor: C.black, color: C.black }}>Visit the HEBS Lagos 2026 website</a>
            <p className="text-[15px] leading-relaxed" style={{ color: C.body }}>{g.earlier.text}</p>
          </div>
        </div>
      </Section>
      <FinalCta to={TARGETS} />
    </Shell>
  );
}

/* ── Contact us ─────────────────────────────────────────────────────── */

export function ContactPage(props: PageProps) {
  const opts = optsOf(props);
  const c = PAGES.contact;
  const notes = [COPY_DRAFT, "Email addresses and social accounts withheld until public contacts are approved (D10). No message is collected until storage (D1) and the privacy notice (D13) are approved."];
  return (
    <Shell page="contact" opts={opts} notes={props.notes ?? "inline"} groups={[["Contact us", notes]]}>
      <PageHero title={c.title.text} intro={c.intro.text} opts={opts} notes={notes.slice(0, 1)} />
      <Section id="message" ground="ivory" labelledBy="message-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-8 lg:col-span-5">
            <h2 id="message-title" style={h2Style}>Contact form.</h2>
            <div>
              <h3 className="text-[14px] font-semibold">Email</h3>
              <div className="mt-3"><Pending>{c.emails.text}</Pending></div>
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
      <PageHero title={a.title.text} intro={COPY.welcome.body.text} opts={opts} />
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
      <PageHero title={sp.title.text} intro={sp.intro.text} opts={opts} notes={notes.slice(0, 1)} />
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

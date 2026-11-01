/**
 * HEBS 2027 page sections. Directive references (4A-4J, 11) are in each
 * heading comment; content and approval states come from lib/content/2027.ts,
 * lib/editions/2027.ts and lib/assets/register.ts.
 */
import Image from "next/image";
import Countdown2027 from "./Countdown2027";
import MediaFrame from "./MediaFrame";
import { CtaLink, DisplayHeading, Eyebrow, GoldRule, Pending, Section, StatusTag } from "./ui";
import { COPY } from "@/lib/content/2027";
import {
  CAMPAIGN,
  CATEGORIES_2027,
  COMPETITION_COUNT_2027,
  CATEGORY_COUNT_2027,
  EDITION_DAYS,
  VENUE,
} from "@/lib/editions/2027";
import { findAsset } from "@/lib/assets/register";
import { gatedValue, type DeployEnvironment } from "@/lib/publication";

type Env = { environment: DeployEnvironment };

const venueName = (environment: DeployEnvironment) => gatedValue(VENUE.name, environment);

/* ── Preview banner ─────────────────────────────────────────────────── */

export function PreviewBanner() {
  return (
    <div role="note" className="bg-h27-ocean text-h27-ivory">
      <p className="mx-auto max-w-6xl px-4 sm:px-8 py-2 text-center text-xs leading-relaxed">
        <strong className="font-semibold uppercase tracking-[0.14em]">Staging preview</strong> · Not published.
        <span className="hidden sm:inline">
          {" "}Provisional logo, venue details and copy are marked; dashed panels are pending approved media.
        </span>{" "}
        No registration or inquiry is collected.{" "}
        <a href="/2027/status" className="underline underline-offset-2">
          Approval status
        </a>
      </p>
    </div>
  );
}

/* ── Header ─────────────────────────────────────────────────────────── */

export function Header2027({ home }: { home: string }) {
  const logo = findAsset("hebs-logo-nav");
  return (
    <header className="sticky top-0 z-40 border-b border-h27-line bg-h27-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-8 py-3">
        <a href={home} className="flex items-center gap-3" aria-label="HEBS Lagos 2027 preview home">
          <Image src={logo.src} alt="" width={48} height={40} className="h-10 w-auto" />
          <span className="font-serif text-lg text-h27-ivory">Lagos 2027</span>
        </a>
        <nav aria-label="2027 preview" className="hidden md:block">
          <ul className="flex gap-6 text-xs uppercase tracking-[0.18em] text-h27-muted">
            <li><a className="hover:text-h27-ivory" href="/2027/homepage#experience">Experience</a></li>
            <li><a className="hover:text-h27-ivory" href="/2027/homepage#competitions">Competitions</a></li>
            <li><a className="hover:text-h27-ivory" href="/2027#partners">Partners</a></li>
          </ul>
        </nav>
        <a
          href={`${home}#priority-list`}
          className="hidden sm:inline-flex min-h-[44px] items-center border border-h27-champagne/60 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-h27-ivory hover:bg-h27-champagne/10"
        >
          Priority list
        </a>
      </div>
    </header>
  );
}

/* ── A. Main hero ───────────────────────────────────────────────────── */

export function Hero({ environment, exploreHref }: Env & { exploreHref: string }) {
  const venue = venueName(environment);
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-h27-ink text-h27-ivory">
      <MediaFrame slotId="hero" environment={environment} fill className="-z-10 opacity-70" sizes="100vw" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-h27-ink/30 via-h27-ink/60 to-transparent" />
      {/* Bottom padding keeps the hero content clear of the media panel's caption,
          which sits at the bottom of the section (it overlapped the last CTA on phones). */}
      <div className="mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-4 sm:px-8 pt-24 pb-44 sm:pb-36 text-center">
        <Eyebrow>Hair Education Beauty Summit</Eyebrow>
        <DisplayHeading id="hero-title" level={1} className="mt-6">
          <span className="block">HEBS LAGOS 2027</span>
          <span className="mt-3 block text-[1.35rem] sm:text-3xl lg:text-4xl tracking-[0.12em] text-h27-champagne">
            {CAMPAIGN.theme}
          </span>
        </DisplayHeading>
        <p className="mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-h27-ivory/85">{CAMPAIGN.subheading}</p>
        <GoldRule className="mx-auto mt-10" />
        <p className="mt-6 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-h27-ivory">
          {CAMPAIGN.datesDisplay}
        </p>
        <p className="mt-2 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-h27-muted">
          {venue ?? <Pending>Venue to be announced</Pending>} | {VENUE.locality}{" "}
          <StatusTag status={VENUE.name.status} label="Provisional venue name" />
        </p>
        <div className="mt-10">
          <Countdown2027 />
        </div>
        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <CtaLink href="#priority-list">Join the 2027 Priority List</CtaLink>
          <CtaLink href={exploreHref} variant="secondary">Explore the Experience</CtaLink>
          <CtaLink href="#partners" variant="ghost">Become a Sponsor</CtaLink>
        </div>
      </div>
    </section>
  );
}

/* ── B. Welcome ─────────────────────────────────────────────────────── */

export function Welcome() {
  return (
    <Section id="welcome" tone="ivory" labelledBy="welcome-title">
      <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-end">
        <div>
          <Eyebrow onLight>Welcome to HEBS 2027</Eyebrow>
          <DisplayHeading id="welcome-title" className="mt-5">{COPY.welcome.headline.text}</DisplayHeading>
        </div>
        <div>
          <p className="text-lg leading-relaxed text-h27-ink/85">{COPY.welcome.body.text}</p>
          <div className="mt-4"><StatusTag status={COPY.welcome.body.status} onLight /></div>
        </div>
      </div>
    </Section>
  );
}

/* ── C. Three days ──────────────────────────────────────────────────── */

export function ThreeDays({ environment, programHref }: Env & { programHref: string }) {
  return (
    <Section id="three-days" tone="ink" labelledBy="three-days-title">
      <Eyebrow>July 23–25, 2027</Eyebrow>
      <DisplayHeading id="three-days-title" className="mt-5">Three Days, One Extraordinary Destination</DisplayHeading>
      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {EDITION_DAYS.map((day, i) => (
          <li key={day.isoDate} className="flex flex-col border border-h27-line bg-h27-ink-2">
            <MediaFrame slotId={`day-${i + 1}`} environment={environment} />
            <div className="flex flex-1 flex-col p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-h27-champagne">
                <time dateTime={day.isoDate}>{day.weekday}, {day.shortDate}</time>
              </p>
              <h3 className="mt-3 font-serif text-2xl text-h27-ivory">{day.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-h27-muted">{day.description}</p>
              <p className="mt-4 text-xs text-h27-muted">Times: <Pending /></p>
              <a href={programHref} className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-h27-champagne underline-offset-4 hover:underline">
                Event program <span aria-hidden="true">→</span>
                <span className="sr-only"> for {day.shortDate} (to be published)</span>
              </a>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ── D. Six experiences ─────────────────────────────────────────────── */

export function Experience({ environment }: Env) {
  return (
    <Section id="experience" tone="ink-2" labelledBy="experience-title">
      <Eyebrow>Six experiences</Eyebrow>
      <DisplayHeading id="experience-title" className="mt-5">{COPY.experience.headline.text}</DisplayHeading>
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {COPY.experience.items.map((item) => (
          <li key={item.slot} className="flex flex-col border border-h27-line bg-h27-ink">
            <MediaFrame slotId={item.slot} environment={environment} />
            <div className="p-6">
              <h3 className="font-serif text-2xl text-h27-ivory">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-h27-muted">{item.body.text}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <StatusTag status={item.body.status} />
                <span className="text-xs text-h27-muted">Details page: <Pending>Phase 4</Pending></span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ── E. Destination ─────────────────────────────────────────────────── */

export function Destination({ environment }: Env) {
  const venue = venueName(environment);
  return (
    <Section id="destination" tone="ink" labelledBy="destination-title">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>The destination</Eyebrow>
          <DisplayHeading id="destination-title" className="mt-5">{COPY.destination.headline.text}</DisplayHeading>
          <p className="mt-6 text-lg leading-relaxed text-h27-ivory/85">{COPY.destination.body.text}</p>
          <p className="mt-4 text-sm text-h27-muted">{COPY.destination.restriction}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusTag status={COPY.destination.body.status} />
            <StatusTag status={VENUE.name.status} label="Provisional venue name" />
          </div>
          <div className="mt-8">
            <CtaLink href={VENUE.website} variant="secondary">
              Visit {venue ?? "the resort"}
              <span className="sr-only"> (opens njsbeachresort.com)</span>
            </CtaLink>
          </div>
        </div>
        <div className="grid gap-4">
          <MediaFrame slotId="destination-video" environment={environment} ratio="aspect-video" sizes="(min-width: 1024px) 50vw, 100vw" />
          <MediaFrame slotId="destination-gallery" environment={environment} ratio="aspect-[16/7]" sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </div>
    </Section>
  );
}

/* ── F. Competitions ────────────────────────────────────────────────── */

export function Competitions() {
  const pathways = ["Competition categories", "Eligibility and requirements", "Competition rules", "Application or registration", "Awards and prizes"];
  return (
    <Section id="competitions" tone="ivory" labelledBy="competitions-title">
      <Eyebrow onLight>Competitions</Eyebrow>
      <DisplayHeading id="competitions-title" className="mt-5">{COPY.competitions.headline.text}</DisplayHeading>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-h27-ink/85">{COPY.competitions.body.text}</p>
      <div className="mt-3"><StatusTag status={COPY.competitions.body.status} onLight /></div>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-h27-ocean">
        {COMPETITION_COUNT_2027} competitions · {CATEGORY_COUNT_2027} categories
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES_2027.map((c) => (
          <li key={c.slug} className="border border-h27-ink/20 px-3 py-1.5 text-sm text-h27-ink">{c.name}</li>
        ))}
      </ul>
      <ul className="mt-10 grid gap-px border border-h27-ink/15 bg-h27-ink/15 sm:grid-cols-2 lg:grid-cols-5">
        {pathways.map((p) => (
          <li key={p} className="bg-h27-ivory p-5">
            <p className="font-serif text-xl text-h27-ink">{p}</p>
            <p className="mt-2 text-xs text-h27-muted-dark">2027 details to be published</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-h27-muted-dark">{COPY.competitions.pending}</p>
    </Section>
  );
}

/* ── G. Education ───────────────────────────────────────────────────── */

export function Education({ environment }: Env) {
  return (
    <Section id="education" tone="ink" labelledBy="education-title">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <Eyebrow>Education &amp; masterclasses</Eyebrow>
          <DisplayHeading id="education-title" className="mt-5">{COPY.education.headline.text}</DisplayHeading>
          <p className="mt-6 text-lg leading-relaxed text-h27-ivory/85">{COPY.education.body.text}</p>
          <div className="mt-3"><StatusTag status={COPY.education.body.status} /></div>
          <ul className="mt-8 divide-y divide-h27-line border-y border-h27-line">
            {COPY.education.tracks.map((t) => (
              <li key={t} className="flex items-center justify-between py-4">
                <span className="font-serif text-xl text-h27-ivory">{t}</span>
                <span className="text-xs text-h27-muted">Sessions <Pending /></span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-h27-muted">Speakers and educators: none confirmed yet.</p>
        </div>
        <MediaFrame slotId="education" environment={environment} ratio="aspect-[4/5]" sizes="(min-width: 1024px) 45vw, 100vw" />
      </div>
    </Section>
  );
}

/* ── H. Sponsors & exhibitors ───────────────────────────────────────── */

export function Partners() {
  return (
    <Section id="partners" tone="ink-2" labelledBy="partners-title">
      <Eyebrow>Sponsors &amp; exhibitors</Eyebrow>
      <DisplayHeading id="partners-title" className="mt-5 max-w-4xl">{COPY.partners.headline.text}</DisplayHeading>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-h27-ivory/85">{COPY.partners.body.text}</p>
      <div className="mt-3"><StatusTag status={COPY.partners.body.status} /></div>
      <ul className="mt-10 grid gap-px border border-h27-line bg-h27-line sm:grid-cols-2 lg:grid-cols-4">
        {COPY.partners.pathways.map((p) => (
          <li key={p} className="bg-h27-ink p-6">
            <p className="font-serif text-2xl text-h27-ivory">{p}</p>
          </li>
        ))}
      </ul>
      <div className="mt-8 border border-dashed border-h27-ocean-light/40 p-5 text-sm text-h27-muted">
        <p className="font-semibold text-h27-ivory">Inquiry form and prospectus: not yet active</p>
        <p className="mt-1">
          The inquiry pathway opens once secure storage and administration (D1) and public contacts (D10) are
          approved. The prospectus download appears only when an approved 2027 prospectus is supplied.
        </p>
      </div>
    </Section>
  );
}

/* ── I. HEBS 2026 highlights ────────────────────────────────────────── */

export function Highlights2026({ environment }: Env) {
  return (
    <Section id="highlights-2026" tone="ink" labelledBy="highlights-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <Eyebrow>Our history</Eyebrow>
          <DisplayHeading id="highlights-title" className="mt-5">{COPY.highlights.headline.text}</DisplayHeading>
          <p className="mt-6 text-lg leading-relaxed text-h27-ivory/85">{COPY.highlights.body.text}</p>
          <div className="mt-3"><StatusTag status={COPY.highlights.body.status} /></div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaLink href="/competitions" variant="secondary">2026 programme</CtaLink>
            <CtaLink href="/hebs-legacy/2025" variant="ghost">Past editions</CtaLink>
          </div>
        </div>
        <MediaFrame slotId="highlights-2026" environment={environment} ratio="aspect-video" sizes="(min-width: 1024px) 55vw, 100vw" />
      </div>
    </Section>
  );
}

/* ── Priority list (directive section 6; gated) ─────────────────────── */

const INTERESTS = ["Attendee", "Competitor", "Educator", "Exhibitor", "Sponsor", "Other"];

/**
 * The priority-list journey, shown with every control disabled and no form
 * submission path. It is a design preview, not a form: nothing can be entered
 * or sent until D1 (storage) and D13 (privacy terms) are approved.
 */
export function PriorityListPreview() {
  const field = "mt-2 block w-full border border-h27-line bg-h27-ink px-3 py-3 text-sm text-h27-muted";
  return (
    <Section id="priority-list" tone="ink-2" labelledBy="priority-title">
      <div className="mx-auto max-w-2xl">
        <Eyebrow>Priority registration</Eyebrow>
        <DisplayHeading id="priority-title" className="mt-5">{COPY.priorityList.headline.text}</DisplayHeading>
        <p id="priority-gate" role="note" className="mt-6 border-l-2 border-h27-ocean-light bg-h27-ocean/20 p-4 text-sm leading-relaxed text-h27-ivory">
          {COPY.priorityList.gateNotice}
        </p>
        <div aria-describedby="priority-gate" className="mt-8">
          <fieldset disabled aria-disabled="true" className="grid gap-5 opacity-80">
            <legend className="sr-only">Priority list fields (preview, disabled)</legend>
            <label className="text-sm text-h27-ivory">Full name <span aria-hidden="true">*</span>
              <input className={field} type="text" name="preview-name" autoComplete="off" />
            </label>
            <label className="text-sm text-h27-ivory">Email address <span aria-hidden="true">*</span>
              <input className={field} type="email" name="preview-email" autoComplete="off" />
            </label>
            <label className="text-sm text-h27-ivory">Country of residence <span aria-hidden="true">*</span>
              <input className={field} type="text" name="preview-country" autoComplete="off" />
            </label>
            <label className="text-sm text-h27-ivory">Phone number <span className="text-h27-muted">(optional)</span>
              <input className={field} type="tel" name="preview-phone" autoComplete="off" />
            </label>
            <label className="text-sm text-h27-ivory">Area of interest <span aria-hidden="true">*</span>
              <select className={field} name="preview-interest" defaultValue="">
                <option value="" disabled>Choose one</option>
                {INTERESTS.map((i) => <option key={i}>{i}</option>)}
              </select>
            </label>
            <label className="flex items-start gap-3 text-sm text-h27-ivory">
              <input type="checkbox" name="preview-consent" className="mt-1 h-4 w-4" />
              <span>I agree to receive HEBS 2027 event updates. Privacy notice wording pending approval (D13).</span>
            </label>
            <button type="button" className="min-h-[48px] border border-h27-line bg-h27-ink px-6 text-xs font-semibold uppercase tracking-[0.18em] text-h27-muted">
              Registration not yet open
            </button>
          </fieldset>
          <p className="mt-4 text-xs text-h27-muted">No payment is requested through the priority list.</p>
        </div>
      </div>
    </Section>
  );
}

/* ── QR access (directive section 11; gated) ────────────────────────── */

export function QrAccess() {
  return (
    <Section id="qr" tone="ink" labelledBy="qr-title">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <div aria-hidden="true" className="grid h-32 w-32 shrink-0 place-items-center border border-dashed border-h27-ocean-light/40 font-mono text-[10px] uppercase tracking-[0.18em] text-h27-ocean-light">
          QR pending
        </div>
        <div>
          <h2 id="qr-title" className="font-serif text-2xl text-h27-ivory">QR code for immediate access</h2>
          <p className="mt-2 max-w-xl text-sm text-h27-muted">
            Generated once the final landing-page address and publication date are approved (D7), so no printed
            code ever points at a preview or a page that may move.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ── J. Final call to action ────────────────────────────────────────── */

export function FinalCta({ environment }: Env) {
  const venue = venueName(environment);
  return (
    <section id="final-cta" aria-labelledby="final-title" className="border-t border-h27-line bg-gradient-to-b from-h27-ink to-h27-ink-2 text-h27-ivory">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 py-24 sm:py-32 text-center">
        <DisplayHeading id="final-title">{COPY.finalCta.headline.text}</DisplayHeading>
        <GoldRule className="mx-auto mt-8" />
        <p className="mt-6 font-mono text-xs sm:text-sm uppercase tracking-[0.22em]">{CAMPAIGN.datesDisplay}</p>
        <p className="mt-2 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-h27-muted">
          {venue ?? <Pending>Venue to be announced</Pending>}, {VENUE.locality}
        </p>
        <div className="mt-10 flex justify-center">
          <CtaLink href="#priority-list">{COPY.finalCta.button.text}</CtaLink>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────── */

export function Footer2027() {
  return (
    <footer className="border-t border-h27-line bg-h27-ink text-h27-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-8 py-10 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>HEBS Lagos 2027 · Staging preview. Contact details pending approval (D10).</p>
        <ul className="flex flex-wrap gap-5">
          <li><a className="hover:text-h27-ivory" href="/privacy">Privacy</a></li>
          <li><a className="hover:text-h27-ivory" href="/">HEBS Lagos 2026 site</a></li>
          <li><a className="hover:text-h27-ivory" href="/2027/status">Approval status</a></li>
        </ul>
      </div>
    </footer>
  );
}

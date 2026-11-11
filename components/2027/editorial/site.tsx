/**
 * Parts shared by the HEBS 2027 inner pages (directive section 5): the page
 * masthead, links that exist only once their page is built, and form previews
 * that become a link to the Base44 2027 portal once that page is approved.
 */
import { pageHref, type PageId } from "@/lib/site/2027";
import { FORM_FIELDS, type FormId } from "@/lib/integrations/registration-2027";
import { formEnabled, submitConfig } from "@/lib/forms-2027/config";
import HebsForm from "./HebsForm";
import { SectionNotes, type Opts } from "./parts";
import { AccentTitle, Kicker, MetaLine } from "@/components/2027/site/ui";
import { SlotImage, type Composition } from "./media";
import { C, display } from "./tokens";

/* ── Page masthead ──────────────────────────────────────────────────── */

/**
 * The inner-page opening, on the homepage's pattern: the "HEBS Lagos 2027"
 * label, the page title in Bodoni with the homepage's italic champagne accent
 * on its last `accent` words, the intro, and the dates and venue; beside it, a
 * captioned HEBS Lagos 2026 summit photograph (`media`) or, where none is
 * suitable or allowed, a typographic composition (`composition`). Always on the
 * homepage's black, closed by the champagne horizon the homepage hero ends on.
 */
export function PageHero({
  title,
  intro,
  opts,
  notes = [],
  accent = 0,
  media,
  composition = "dates",
  children,
}: {
  title: string;
  intro: string;
  opts: Opts;
  notes?: string[];
  accent?: number;
  media?: string;
  composition?: Composition;
  children?: React.ReactNode;
}) {
  return (
    <section aria-labelledby="page-title" className="relative" style={{ background: "radial-gradient(70% 90% at 85% 8%, #2A2016 0%, #0D0B08 68%)", color: C.ivory }}>
      <div id="main-content" className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-14 pt-12 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-12 lg:pb-20 lg:pt-20">
        <div className="lg:col-span-7">
          <Kicker>HEBS Lagos 2027</Kicker>
          <h1 id="page-title" className="mt-5 max-w-[17ch]" style={{ ...display, fontWeight: 500, fontSize: "clamp(42px, 5.4vw, 88px)", lineHeight: 1.02 }}>
            <AccentTitle text={title} accent={accent} />
          </h1>
          <p className="mt-7 max-w-[56ch] text-[17px] leading-[1.7] lg:text-[19px]" style={{ color: "rgba(246,239,226,.78)" }}>{intro}</p>
          <MetaLine className="mt-7" style={{ color: "#F0E2C4" }} />
          {children}
          <SectionNotes notes={notes} opts={opts} ground="black" className="mt-8" />
        </div>
        <div className="lg:col-span-5">
          <SlotImage reviewId={media} composition={composition} opts={opts} className="aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[4/5]" sizes="(min-width: 1024px) 38vw, 100vw" />
        </div>
      </div>
      <span aria-hidden="true" className="da-horizon block h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.champL} 30%, #FFF6DE 50%, ${C.champL} 70%, transparent)` }} />
    </section>
  );
}

/** In-page contents for a long page: a row of anchors under the masthead. */
export function PageContents({ items, light = false }: { items: { href: string; label: string }[]; light?: boolean }) {
  return (
    <nav aria-label="On this page" className="mt-10">
      <ul className="flex flex-wrap gap-x-7 gap-y-3 text-[15px]">
        {items.map((i) => (
          <li key={i.href}>
            <a
              href={i.href}
              className="inline-flex min-h-[44px] items-center underline decoration-[#C8A96A] underline-offset-[7px] transition-colors duration-200"
              style={{ color: light ? C.black : C.ivory }}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ── Links that wait for their page ─────────────────────────────────── */

/** A link to another 2027 page if it is built; otherwise the same words as text. */
export function PageLink({ to, hash, children, className = "", style }: {
  to: PageId;
  hash?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const href = pageHref(to, hash);
  if (!href) return <span className={className} style={style}>{children}</span>;
  return <a href={href} className={className} style={style}>{children}</a>;
}

/* ── Forms ──────────────────────────────────────────────────────────── */

/**
 * A website form (HebsForm). Whether it accepts submissions is decided here, on
 * the server, from lib/forms-2027/config.ts; the browser receives only that
 * yes or no, never a setting or a secret.
 */
export function FormBlock({ form, title, gate, submitLabel }: {
  form: FormId;
  title: string;
  /** Sentence shown while the form is closed. */
  gate: string;
  submitLabel: string;
}) {
  const cfg = submitConfig();
  const enabled = formEnabled(form, cfg);
  return <HebsForm form={form} fields={FORM_FIELDS[form]} enabled={enabled} uploads={enabled && cfg.uploads && form === "exhibitor"} gate={gate} submitLabel={submitLabel} title={title} />;
}

/** "To be announced" for a fact that does not exist yet, set quietly in the page's own type. */
export function Pending({ children, light = true }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className="border-l-2 pl-4 text-[16px] leading-relaxed" style={{ borderColor: light ? C.atlantic : C.champ, color: light ? C.atlantic : "rgba(245,239,228,.82)" }}>
      {children}
    </p>
  );
}

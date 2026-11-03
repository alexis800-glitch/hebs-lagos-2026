/**
 * Parts shared by the HEBS 2027 inner pages (directive section 5): the page
 * masthead, links that exist only once their page is built, and form previews
 * that become a link to the Base44 2027 portal once that page is approved.
 */
import { CAMPAIGN, VENUE } from "@/lib/editions/2027";
import { pageHref, type PageId } from "@/lib/site/2027";
import { FORM_FIELDS, type FormId } from "@/lib/integrations/registration-2027";
import { formEnabled, submitConfig } from "@/lib/forms-2027/config";
import HebsForm from "./HebsForm";
import { SectionNotes, type Opts } from "./parts";
import { C, GROUND, display, type Ground } from "./tokens";

/* ── Page masthead ──────────────────────────────────────────────────── */

/**
 * The inner-page opening: the page title in Bodoni over the event's dates and
 * venue, closed by the same champagne horizon the homepage hero ends on.
 */
export function PageHero({
  title,
  intro,
  opts,
  notes = [],
  ground = "black",
  children,
}: {
  title: string;
  intro: string;
  opts: Opts;
  notes?: string[];
  ground?: Ground;
  children?: React.ReactNode;
}) {
  const g = GROUND[ground];
  return (
    <section aria-labelledby="page-title" className={`relative ${g.light ? "da-on-light" : ""}`} style={{ background: g.bg, color: g.fg }}>
      <div id="main-content" className="mx-auto max-w-[1440px] px-5 pb-14 pt-14 lg:px-12 lg:pb-20 lg:pt-20">
        <p className="text-[15px] font-medium" style={{ ...display, fontSize: "20px", color: ground === "champagne" ? C.onChamp : g.light ? "#5E5034" : C.champL }}>
          <time dateTime="2027-07-23/2027-07-25">{CAMPAIGN.datesDisplay}</time>
        </p>
        <p className="mt-1 text-[14px]" style={{ color: g.muted }}>
          <span translate="no">{VENUE.name.value}</span>, {VENUE.locality}
        </p>
        <h1 id="page-title" className="mt-5 max-w-[18ch]" style={{ ...display, fontWeight: 500, fontSize: "clamp(42px, 6vw, 96px)", lineHeight: 1.02 }}>
          {title}
        </h1>
        <p className="mt-7 max-w-[58ch] text-[17px] leading-[1.7] lg:text-[19px]" style={{ color: g.muted }}>{intro}</p>
        {children}
        <SectionNotes notes={notes} opts={opts} ground={ground} className="mt-8" />
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
  const enabled = formEnabled(form, submitConfig());
  return <HebsForm form={form} fields={FORM_FIELDS[form]} enabled={enabled} gate={gate} submitLabel={submitLabel} title={title} />;
}

/** "To be announced" for a fact that does not exist yet, set quietly in the page's own type. */
export function Pending({ children, light = true }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className="border-l-2 pl-4 text-[16px] leading-relaxed" style={{ borderColor: light ? C.atlantic : C.champ, color: light ? C.atlantic : "rgba(245,239,228,.82)" }}>
      {children}
    </p>
  );
}

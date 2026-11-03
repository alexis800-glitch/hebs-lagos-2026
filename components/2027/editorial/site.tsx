/**
 * Parts shared by the HEBS 2027 inner pages (directive section 5): the page
 * masthead, links that exist only once their page is built, and form previews
 * that become a link to the Base44 2027 portal once that page is approved.
 */
import { CAMPAIGN, VENUE } from "@/lib/editions/2027";
import { pageHref, type PageId } from "@/lib/site/2027";
import { portalLink, type FieldSpec, type PortalDestination } from "@/lib/integrations/registration-2027";
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

/* ── Form previews ──────────────────────────────────────────────────── */

const fieldClass = "mt-2 block w-full border bg-white px-3 py-3 text-[15px]";
const fieldStyle = { borderColor: "rgba(0,0,0,.22)", color: "#6B6253" };

function Control({ f }: { f: FieldSpec }) {
  const optional = !f.required && f.kind !== "checkbox" ? <span className="font-normal" style={{ color: "#5E5546" }}> (optional)</span> : null;
  if (f.kind === "checkbox") {
    return (
      <label className="flex items-start gap-3 text-[14px]">
        <input type="checkbox" name={f.name} className="mt-1 h-4 w-4" />
        <span>{f.label}{!f.required && f.consent === "marketing" && <span style={{ color: "#5E5546" }}> (optional)</span>}</span>
      </label>
    );
  }
  const common = { name: f.name, autoComplete: f.autoComplete, className: fieldClass, style: fieldStyle };
  return (
    <label className="text-[14px] font-medium">
      {f.label}{optional}
      {f.kind === "select" ? (
        <select {...common} defaultValue="">
          <option value="" disabled>Choose one</option>
          {f.options?.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : f.kind === "textarea" ? (
        <textarea {...common} rows={4} />
      ) : (
        <input
          {...common}
          type={f.kind}
          inputMode={f.kind === "email" ? "email" : f.kind === "tel" ? "tel" : f.kind === "url" ? "url" : undefined}
          spellCheck={f.kind === "email" || f.kind === "url" ? false : undefined}
          accept={f.kind === "file" ? "application/pdf" : undefined}
        />
      )}
      {f.hint && <span className="mt-1.5 block text-[13px] font-normal" style={{ color: "#5E5546" }}>{f.hint}</span>}
    </label>
  );
}

/**
 * A registration or inquiry form as it will look. Until the destination's
 * Base44 2027 page is approved, every control is disabled and nothing can be
 * sent; once it is, the panel becomes a plain link to the portal instead, so
 * the website itself never receives what visitors enter.
 */
export function FormPreview({
  id,
  destination,
  fields,
  opts,
  gate,
  linkLabel,
}: {
  id: string;
  destination: PortalDestination;
  fields: readonly FieldSpec[];
  opts: Opts;
  /** Sentence shown while the form is closed. */
  gate: string;
  linkLabel: string;
}) {
  const href = portalLink(destination, opts.environment);
  if (href) {
    return (
      <div className="border bg-[#FBF8F2] p-6 sm:p-8" style={{ borderColor: "rgba(0,0,0,.14)", color: C.black }}>
        <a
          href={href}
          className="flex min-h-[56px] items-center justify-center px-8 text-[13px] font-bold uppercase tracking-[0.16em] transition-colors duration-200 hover:bg-[#EAD7A8]"
          style={{ background: C.champ, color: C.black }}
        >
          {linkLabel}
        </a>
        <p className="mt-4 text-[14px]" style={{ color: C.body }}>Opens the official HEBS 2027 registration portal.</p>
      </div>
    );
  }
  const half = (f: FieldSpec) => f.kind === "tel" || f.name === "country";
  return (
    <div className="border bg-[#FBF8F2] p-6 sm:p-8" style={{ borderColor: "rgba(0,0,0,.14)", colorScheme: "light", color: C.black }}>
      <p id={`${id}-gate`} className="text-[14px] font-semibold" style={{ color: C.atlantic }}>{gate}</p>
      <fieldset disabled aria-describedby={`${id}-gate`} className="mt-5 grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">Form fields (preview, disabled)</legend>
        {fields.map((f) => (
          <div key={f.name} className={half(f) ? "" : "sm:col-span-2"}>
            <Control f={f} />
          </div>
        ))}
        <button
          type="button"
          className="min-h-[52px] border px-6 text-[12px] font-bold uppercase tracking-[0.18em] sm:col-span-2"
          style={{ borderColor: "rgba(0,0,0,.25)", color: "#5E5546", background: "transparent" }}
        >
          Opens soon
        </button>
      </fieldset>
    </div>
  );
}

/** "To be announced" for a fact that does not exist yet, set quietly in the page's own type. */
export function Pending({ children, light = true }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className="border-l-2 pl-4 text-[16px] leading-relaxed" style={{ borderColor: light ? C.atlantic : C.champ, color: light ? C.atlantic : "rgba(245,239,228,.82)" }}>
      {children}
    </p>
  );
}

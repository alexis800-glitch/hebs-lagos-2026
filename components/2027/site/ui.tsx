import "./site.css";
import { CAMPAIGN, VENUE } from "@/lib/editions/2027";
import { deployEnvironment } from "@/lib/publication";

/**
 * The 2027 design system's small parts, taken from the approved homepage so every
 * page speaks the same visual language: pill buttons, letter-spaced Jost labels,
 * the dates-and-venue meta line, and Bodoni headlines with an italic champagne
 * accent. Styles: components/2027/site/site.css (SHARED UI).
 */

type Tone = "dark" | "light";
const on = (tone: Tone) => (tone === "light" ? " s27-on-light" : "");

export type ButtonVariant = "primary" | "ghost" | "outline" | "link";
const VARIANT: Record<ButtonVariant, string> = { primary: "s27-btn--pri", ghost: "s27-btn--gh", outline: "s27-btn--ol", link: "s27-btn--ln" };

/**
 * A call to action. With no `href` it renders as a non-link with the same look
 * (for "opens soon" states), so a button never leads anywhere that is not open.
 */
export function Button({ href, variant = "primary", tone = "dark", external = false, children, className = "" }: {
  href?: string | null;
  /** Another website: opened with rel="noopener". */
  external?: boolean;
  variant?: ButtonVariant;
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  const cls = `s27-btn ${VARIANT[variant]}${on(tone)} ${className}`.trim();
  if (!href) return <span className={cls} aria-disabled="true">{children}</span>;
  return <a className={cls} href={href} rel={external ? "noopener" : undefined}>{children}</a>;
}

/** The small letter-spaced label above a headline ("Welcome to HEBS 2027"). */
export function Kicker({ children, tone = "dark", className = "" }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  return <p className={`s27-kick${on(tone)} ${className}`.trim()}>{children}</p>;
}

/** The dates and venue, as the homepage hero states them. */
export function MetaLine({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <p className={`s27-meta ${className}`.trim()} style={style}>
      <time dateTime="2027-07-23/2027-07-25">{CAMPAIGN.datesDisplay}</time>
      <br />
      <span translate="no">{VENUE.name.value}</span>, {VENUE.locality}
    </p>
  );
}

/**
 * A headline whose last `accent` words take the italic champagne accent, as on
 * the homepage ("Where beauty, education & opportunity meet."). The words are
 * the page's own; only their setting changes.
 */
export function AccentTitle({ text, accent = 0, tone = "dark" }: { text: string; accent?: number; tone?: Tone }) {
  const words = text.split(" ");
  if (accent <= 0 || accent >= words.length) return <>{text}</>;
  return (
    <>
      {words.slice(0, -accent).join(" ")}{" "}
      <span className={`s27-accent${on(tone)}`}>{words.slice(-accent).join(" ")}</span>
    </>
  );
}

/**
 * The one staging notice every 2027 page carries in previews. Never on
 * production, so a launched page shows none of it. Elements marked
 * data-staging are left out of the copy inventory (tests/copy-inventory-2027.test.ts).
 */
export function StagingStrip({ children }: { children?: React.ReactNode }) {
  if (deployEnvironment() === "production") return null;
  return (
    <div className="s27-strip" role="note" data-preview-banner="" data-staging="">
      <b>Internal preview, not for publication.</b>{" "}
      {children ?? "Provisional copy and details are marked."} No registration or inquiry is collected.{" "}
      <a href="/2027/status">Approval status</a>
    </div>
  );
}

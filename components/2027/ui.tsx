/**
 * HEBS 2027 UI primitives. Server components; colours from the `h27` tokens
 * in tailwind.config.ts, display type in Cormorant Garamond, body in Geist.
 */
import type { ReactNode } from "react";
import type { PublicationStatus } from "@/lib/publication";

export function Section({
  id,
  tone = "ink",
  labelledBy,
  children,
}: {
  id: string;
  tone?: "ink" | "ink-2" | "ivory";
  labelledBy: string;
  children: ReactNode;
}) {
  const tones = {
    ink: "bg-h27-ink text-h27-ivory",
    "ink-2": "bg-h27-ink-2 text-h27-ivory",
    ivory: "bg-h27-ivory text-h27-ink",
  } as const;
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${tones[tone]} scroll-mt-20`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-20 sm:py-28">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, onLight = false }: { children: ReactNode; onLight?: boolean }) {
  return (
    <p
      className={`font-sans text-[11px] sm:text-xs font-medium uppercase tracking-[0.28em] ${
        onLight ? "text-h27-ocean" : "text-h27-champagne"
      }`}
    >
      {children}
    </p>
  );
}

export function DisplayHeading({
  id,
  level = 2,
  children,
  className = "",
}: {
  id: string;
  level?: 1 | 2 | 3;
  children: ReactNode;
  className?: string;
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3";
  const size = {
    1: "text-[2.6rem] leading-[1.02] sm:text-7xl lg:text-8xl",
    2: "text-[2rem] leading-[1.08] sm:text-5xl lg:text-6xl",
    3: "text-2xl leading-tight sm:text-3xl",
  }[level];
  return (
    <Tag id={id} className={`font-serif font-medium tracking-tight text-balance ${size} ${className}`}>
      {children}
    </Tag>
  );
}

export function GoldRule({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-px w-16 bg-gradient-to-r from-h27-champagne via-h27-champagne-light to-transparent ${className}`}
    />
  );
}

export function CtaLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const styles = {
    primary:
      "bg-h27-champagne text-h27-ink hover:bg-h27-champagne-light border border-h27-champagne",
    secondary:
      "bg-transparent text-h27-ivory border border-h27-champagne/60 hover:border-h27-champagne hover:bg-h27-champagne/10",
    ghost: "bg-transparent text-h27-ivory border border-h27-ivory/25 hover:border-h27-ivory/60",
  } as const;
  return (
    <a
      href={href}
      className={`inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center px-6 py-3 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-h27-champagne ${styles[variant]}`}
    >
      {children}
    </a>
  );
}

const STATUS_LABEL: Record<PublicationStatus, string> = {
  approved: "Approved",
  provisional: "Provisional copy",
  "awaiting-confirmation": "To be announced",
  draft: "Draft",
};

/** Visible marker on preview content that is not yet approved. Approved content shows nothing. */
export function StatusTag({
  status,
  onLight = false,
  label,
}: {
  status: PublicationStatus;
  onLight?: boolean;
  /** What is provisional, e.g. "Provisional venue name". Defaults to the status. */
  label?: string;
}) {
  if (status === "approved") return null;
  return (
    <span
      className={`inline-block border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
        onLight ? "border-h27-ocean/50 text-h27-ocean" : "border-h27-ocean-light/50 text-h27-ocean-light"
      }`}
    >
      {label ?? STATUS_LABEL[status]}
    </span>
  );
}

/** Stand-in for a fact that has not been approved yet. */
export function Pending({ children = "To be announced" }: { children?: ReactNode }) {
  return <span className="italic text-h27-muted">{children}</span>;
}

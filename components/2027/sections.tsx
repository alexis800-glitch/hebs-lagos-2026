/**
 * Chrome shared by every 2027 staging page: the preview banner, the header of
 * the internal status page and the footer. The homepage and announcement page
 * sections live in components/2027/editorial (Direction A).
 */
import Image from "next/image";
import { findAsset } from "@/lib/assets/register";

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
            <li><a className="hover:text-h27-ivory" href="/2027/homepage#partners">Partners</a></li>
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

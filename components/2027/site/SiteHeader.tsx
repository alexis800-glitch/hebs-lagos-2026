import "./site.css";
import { pageHref, PRIORITY_CTA, PRIORITY_HREF, SITE_MENU, sitePage, type PageId } from "@/lib/site/2027";
import { MobileMenu } from "@/components/2027/home/client";
import { HOME_HREF, NAV } from "@/components/2027/home/links";
import { Mark } from "./mark";

/**
 * The header of every 2027 supporting page. It carries the same mark, the same
 * five headline pages, the same "Become a sponsor" link and the same phone menu
 * as the homepage's overlaid hero header, on a solid black bar.
 */
export function SiteHeader({ current }: { current?: PageId }) {
  const here = current ? sitePage(current).path : undefined;
  const cur = (href: string) => (href === here ? ("page" as const) : undefined);
  return (
    <header className="s27h">
      <a className="skip" href="#main-content">Skip to content</a>
      <div className="bar">
        <a href={HOME_HREF} aria-label="HEBS Lagos 2027 home"><Mark sizes="(max-width: 600px) 68px, 84px" /></a>
        <nav aria-label="Main" className="links">
          {NAV.map((n) => <a key={n.href} href={n.href} aria-current={cur(n.href)}>{n.label}</a>)}
        </nav>
        <a className="pill" href={pageHref("sponsorship")!} aria-current={cur(pageHref("sponsorship")!)}>Become a sponsor</a>
        <MobileMenu home={HOME_HREF} links={SITE_MENU} current={here} cta={{ label: PRIORITY_CTA, href: PRIORITY_HREF }} />
      </div>
    </header>
  );
}

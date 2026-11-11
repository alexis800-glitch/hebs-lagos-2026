import "./site.css";
import { HOME } from "@/lib/content/home-2027";
import { deployEnvironment } from "@/lib/publication";
import { PRIORITY_CTA, PRIORITY_HREF, linkable, sitePage, type PageId } from "@/lib/site/2027";
import { CookiePreferencesButton } from "@/components/2027/home/client";
import { HOME_HREF } from "@/components/2027/home/links";
import { Mark } from "./mark";

/**
 * The one footer of every 2027 page, the homepage included. It links only to
 * pages that exist.
 * Legal pages and contact details are shown only once approved: the live
 * Privacy & Cookie Notice is linked, and Cookie preferences opens the working
 * consent dialog. Items still awaiting approval appear only in internal review,
 * as plain text marked pending, never as links, and are absent from production.
 */
const COLUMNS: { title: string; pages: PageId[] }[] = [
  { title: "The summit", pages: ["about", "experience", "programme", "education", "speakers"] },
  { title: "Take part", pages: ["competitions", "tickets", "exhibitors", "sponsorship"] },
  { title: "Plan your visit", pages: ["travel", "gallery", "contact"] },
];

function Pending({ children }: { children: string }) {
  return <span className="pend">{children}</span>;
}

export function SiteFooter() {
  const review = deployEnvironment() !== "production";
  return (
    <footer className="s27f"><div className="pf">
      <div className="pf-top">
        <div className="pf-brand">
          <a href={HOME_HREF} aria-label="HEBS Lagos 2027 home"><Mark className="pf-mark" sizes="96px" lazy /></a>
          <div>
            <p className="pf-tag">Bigger. Bolder. <em>Beyond Beauty.</em></p>
            <p className="pf-meta">{HOME.final.when}</p>
          </div>
        </div>
        <a className="btn pri" href={PRIORITY_HREF}>{PRIORITY_CTA}</a>
      </div>
      <div className="pf-cols">
        {COLUMNS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2>{c.title}</h2>
            <ul>
              {c.pages.map((id) => {
                const p = sitePage(id);
                return linkable(id) ? <li key={id}><a href={p.path}>{p.title}</a></li> : null;
              })}
            </ul>
          </nav>
        ))}
        {review ? (
          <div data-staging="">
            <h2>Contact &amp; social</h2>
            <p className="pf-note">Official 2027 email, phone and social accounts appear here once confirmed.</p>
            <Pending>Pending approval: A7</Pending>
          </div>
        ) : null}
      </div>
      <div className="pf-legal">
        <p>© {new Date().getFullYear()} Hair Education Beauty Summit. All rights reserved.</p>
        <ul>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/privacy">Cookie Policy</a></li>
          <li><CookiePreferencesButton /></li>
          {review ? <li data-staging=""><span className="pf-off">Terms &amp; Conditions</span> <Pending>Pending approval: A8</Pending></li> : null}
        </ul>
      </div>
      {review ? (
        <p className="pf-review" data-staging="">
          Internal review: Privacy Policy and Cookie Policy open the current HEBS Lagos 2026 Privacy &amp; Cookie Notice; 2027 wording awaits approval (A8).{" "}
          <a href="/2027/status">Approval status</a>
        </p>
      ) : null}
    </div></footer>
  );
}

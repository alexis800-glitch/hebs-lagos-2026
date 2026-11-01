/**
 * The two Direction A deliverables (staging only):
 *  - Homepage2027A: the complete homepage, sections A-J of directive section 4
 *    in directive order, with the priority list before the final call to action
 *    so every priority-list button has a target on the page.
 *  - Announcement2027A: the launch page of directive section 11.
 */
import { Nav, type NavLink, type Opts } from "./parts";
import { reviewNotes, type ReviewNotes } from "./notes";
import {
  Competitions,
  Destination,
  Education,
  Experience,
  FinalCta,
  Hero,
  Highlights,
  Partners,
  PriorityList,
  QrAccess,
  ThreeDays,
  Welcome,
  type Targets,
} from "./sections";
import { C, EDITORIAL_CSS, type BrandVariant, type NotesMode } from "./tokens";
import type { DeployEnvironment } from "@/lib/publication";

interface PageProps {
  environment: DeployEnvironment;
  brand?: BrandVariant;
  notes?: NotesMode;
}

const HOME_TARGETS: Targets = { priority: "#priority-list", experience: "#experience", sponsor: "#partners" };

const HOME_NAV: NavLink[] = [
  { label: "Experience", href: "#experience" },
  { label: "Programme", href: "#three-days" },
  { label: "Destination", href: "#destination" },
  { label: "Competitions", href: "#competitions" },
  { label: "Education", href: "#education" },
  { label: "Partners", href: "#partners" },
];

/* The announcement page has no Experience section, so "Explore the Experience"
   leads to the three-day overview, which is the experience it presents. */
const LAUNCH_TARGETS: Targets = { priority: "#priority-list", experience: "#three-days", sponsor: "#partners" };

const LAUNCH_NAV: NavLink[] = [
  { label: "Three days", href: "#three-days" },
  { label: "Destination", href: "#destination" },
  { label: "Partners", href: "#partners" },
];

function Shell({ opts, nav, home, notes, groups, children }: {
  opts: Opts;
  nav: NavLink[];
  home: string;
  notes: NotesMode;
  groups: [string, string[]][];
  children: React.ReactNode;
}) {
  return (
    <div className="da relative">
      <style>{EDITORIAL_CSS}</style>
      <Nav brand={opts.brand} links={nav} priorityHref="#priority-list" homeHref={home} />
      <main>{children}</main>
      {notes === "panel" && <ReviewPanel groups={groups} brand={opts.brand} />}
    </div>
  );
}

export function Homepage2027A({ environment, brand = "mark", notes = "inline" }: PageProps) {
  const opts: Opts = { environment, brand, inline: notes === "inline" };
  const n = reviewNotes(brand);
  return (
    <Shell opts={opts} nav={HOME_NAV} home="#hero" notes={notes} groups={homeGroups(n)}>
      <Hero opts={opts} notes={n.hero} to={HOME_TARGETS} />
      <Welcome opts={opts} notes={n.welcome} />
      <ThreeDays opts={opts} notes={n.threeDays} />
      <Experience opts={opts} notes={n.experience} />
      <Destination opts={opts} notes={n.destination} />
      <Competitions opts={opts} notes={n.competitions} />
      <Education opts={opts} notes={n.education} />
      <Partners opts={opts} notes={n.partners} />
      <Highlights opts={opts} notes={n.highlights} />
      <PriorityList opts={opts} notes={n.priority} />
      <FinalCta to={HOME_TARGETS} />
    </Shell>
  );
}

export function Announcement2027A({ environment, brand = "mark", notes = "inline" }: PageProps) {
  const opts: Opts = { environment, brand, inline: notes === "inline" };
  const n = reviewNotes(brand);
  return (
    <Shell opts={opts} nav={LAUNCH_NAV} home="#hero" notes={notes} groups={launchGroups(n)}>
      <Hero opts={opts} notes={n.hero} to={LAUNCH_TARGETS} />
      <ThreeDays opts={opts} notes={n.threeDays} />
      <Destination opts={opts} notes={n.destination} />
      <PriorityList opts={opts} notes={n.priority} />
      <Partners opts={opts} notes={n.partners} />
      <QrAccess opts={opts} notes={n.qr} />
      <FinalCta to={LAUNCH_TARGETS} />
    </Shell>
  );
}

const homeGroups = (n: ReviewNotes): [string, string[]][] => [
  ["A. Hero", n.hero],
  ["B. Welcome to HEBS 2027", n.welcome],
  ["C. Three days", n.threeDays],
  ["D. The HEBS experience", n.experience],
  ["E. The destination", n.destination],
  ["F. Competitions", n.competitions],
  ["G. Education & masterclasses", n.education],
  ["H. Sponsors & exhibitors", n.partners],
  ["I. HEBS Lagos 2026 highlights", n.highlights],
  ["Priority list", n.priority],
];

const launchGroups = (n: ReviewNotes): [string, string[]][] => [
  ["Hero", n.hero],
  ["Three days", n.threeDays],
  ["The destination", n.destination],
  ["Priority list", n.priority],
  ["Sponsors & exhibitors", n.partners],
  ["QR access", n.qr],
];

/** Panel mode: the same staging notes, separated from the composition. */
function ReviewPanel({ groups, brand }: { groups: [string, string[]][]; brand: BrandVariant }) {
  const view = (b: BrandVariant, m: NotesMode) => `?brand=${b}&notes=${m}`;
  return (
    <aside aria-labelledby="review-notes-title" className="border-t-2 border-dashed" style={{ background: "#0B2226", borderColor: "rgba(200,169,106,.6)", color: C.ivory }}>
      <div className="mx-auto max-w-[1440px] px-5 py-12 lg:px-12">
        <h2 id="review-notes-title" className="text-[18px] font-semibold">Staging review notes</h2>
        <p className="mt-2 max-w-[70ch] text-[14px] leading-relaxed" style={{ color: "rgba(245,239,228,.8)" }}>
          This view keeps the composition clean for design review. Every note below still applies to the sections
          above, and none of them is lifted by this view.
        </p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(([title, list]) => (
            <section key={title} aria-label={title}>
              <h3 className="text-[14px] font-semibold" style={{ color: C.champL }}>{title}</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-relaxed" style={{ color: "rgba(245,239,228,.85)" }}>
                {list.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
          <a className="underline underline-offset-4" href={view(brand, "inline")}>Show notes in place</a>
          <a className="underline underline-offset-4" href={view(brand === "mark" ? "champagne" : "mark", "panel")}>
            {brand === "mark" ? "Compare the champagne-and-ivory logo study" : "Show the official HEBS mark"}
          </a>
        </p>
      </div>
    </aside>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/components/2027/review/review.css";
import { Header2027 } from "@/components/2027/sections";
import { DecisionControl, DecisionTray } from "@/components/2027/review/Decisions";
import { deployEnvironment, type PublicationStatus } from "@/lib/publication";
import type { PageId } from "@/lib/site/2027";
import {
  FIRST_LAUNCH, GROUPS, PAGE_TITLE, firstLaunchDecisions, mediaRecords, signoffCounts, signoffItems,
  type Approver, type SignoffItem, type Tier,
} from "@/lib/content/signoff-2027";

/**
 * Content sign-off: every unapproved piece of 2027 wording and every open fact,
 * grouped by who approves it, with a way to draft decisions and export them for
 * the record (lib/content/signoff-decisions-2027.ts).
 *
 * Internal. Never served on production: the middleware answers /2027/review as a
 * missing page there (it is not one of the 13 site pages, so not even a launch
 * opens it), and this page refuses to render on production as well.
 */
export const metadata: Metadata = {
  title: "Content sign-off (internal) | HEBS Lagos 2027",
  robots: { index: false, follow: false, nocache: true },
};

const STATUS_WORD: Record<PublicationStatus, string> = {
  approved: "Approved",
  provisional: "Provisional",
  "awaiting-confirmation": "Awaiting confirmation",
  draft: "Draft",
};
const TIER_WORD: Record<Tier, string> = { 1: "First launch", 2: "Next pages", 3: "Later" };
const DECISION_WORD = { approved: "Approved", "revision-required": "Revision required", "pending-decision": "Pending decision" } as const;
const APPROVERS: Approver[] = ["Veridion", "Mrs. Shuler", "HEBS organisers"];
const GROUP_ORDER = ["shared", "factual", "organiser", "commercial"] as const;

const pagesWord = (pages: readonly PageId[]) => (pages.length >= 13 ? "Every page" : pages.map((p) => PAGE_TITLE[p]).join(", "));

/** Pages in launch order: the first launch, then the rest as the site map lists them. */
function byPage(items: SignoffItem[]): [string, SignoffItem[]][] {
  const groups = new Map<string, SignoffItem[]>();
  const sorted = [...items].sort((a, b) => a.tier - b.tier);
  for (const i of sorted) {
    const k = pagesWord(i.pages);
    groups.set(k, [...(groups.get(k) ?? []), i]);
  }
  return Array.from(groups.entries());
}

function Item({ item }: { item: SignoffItem }) {
  const r = item.recorded;
  return (
    <article id={`item-${item.id}`} className="rv-item scroll-mt-24" data-status={item.status}>
      <div className="flex flex-wrap gap-2">
        <span className="rv-tag rv-tag--status">{STATUS_WORD[item.status]}</span>
        <span className="rv-tag">{item.kind}</span>
        <span className="rv-tag">Approves: {item.approver}</span>
        <span className="rv-tag">{TIER_WORD[item.tier]}</span>
        {item.dependsOn.length > 0
          ? <span className="rv-tag rv-tag--dep">Waits on a decision</span>
          : <span className="rv-tag rv-tag--now">Can be decided now</span>}
      </div>
      <p className="mt-3 text-xs text-h27-muted">
        {pagesWord(item.pages)}, {item.section}. <span className="font-mono">{item.id}</span>
      </p>
      <blockquote className="rv-quote">{item.text}</blockquote>
      {item.revised && (
        <p className="mt-2 text-xs leading-relaxed text-h27-muted">
          Changed in this round. It said: &ldquo;{item.revised.from}&rdquo; {item.revised.why}
        </p>
      )}
      {item.proposed && (
        <div className="mt-4">
          <p className="text-xs font-medium text-h27-ocean-light">Proposed wording</p>
          <blockquote className="rv-proposed">{item.proposed.text}</blockquote>
          <p className="mt-2 text-xs leading-relaxed text-h27-muted">{item.proposed.why}</p>
        </div>
      )}
      {item.dependsOn.length > 0 && (
        <p className="mt-3 text-sm text-h27-ivory"><span className="text-h27-muted">Depends on: </span>{item.dependsOn.join("; ")}.</p>
      )}
      {item.replacedWhen.length > 0 && (
        <p className="mt-3 text-sm text-h27-ivory">
          <span className="text-h27-muted">True as it stands, so it can be approved now. Replaced with the real details once: </span>{item.replacedWhen.join("; ")}.
        </p>
      )}
      {r && (
        <p className="mt-3 text-sm text-h27-champagne-light">
          Recorded: {DECISION_WORD[r.decision]} by {r.by} on {r.on} ({r.reference}).{r.note ? ` ${r.note}` : ""}
          {r.decision === "approved" && item.status !== "approved" ? " The wording has changed since, so it needs approving again." : ""}
        </p>
      )}
      {item.recordIn !== "decision" && (
        <p className="mt-3 text-xs text-h27-muted">A fact: once decided, Veridion also updates {item.recordIn}.</p>
      )}
      {item.status !== "approved" && <DecisionControl id={item.id} text={item.text} proposed={item.proposed?.text} />}
    </article>
  );
}

export default function ContentSignoff() {
  if (deployEnvironment() === "production") notFound();
  const items = signoffItems();
  const counts = signoffCounts(items);
  const open = items.filter((i) => i.status !== "approved");
  const media = mediaRecords();
  const texts = Object.fromEntries(items.map((i) => [i.id, i.text]));
  const proposals = Object.fromEntries(items.filter((i) => i.proposed).map((i) => [i.id, i.proposed!.text]));
  const per = (a: Approver, f: (i: SignoffItem) => boolean = () => true) => open.filter((i) => i.approver === a && f(i)).length;

  return (
    <>
      <Header2027 home="/2027" />
      <main className="rv-page mx-auto max-w-6xl px-4 py-16 text-sm sm:px-8">
        <p className="s27-kick">Internal review, previews only</p>
        <h1 className="mt-3 font-serif text-4xl text-h27-ivory sm:text-5xl">Content sign-off</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-h27-muted">
          Every piece of HEBS Lagos 2027 wording and every fact the 13 pages show that is not approved yet: {counts.open} items, grouped by who approves them.
          They are not equally urgent. Start with the items marked First launch.
        </p>

        <h2 className="mt-12 font-serif text-2xl text-h27-ivory">How to record a decision</h2>
        <ol className="mt-4 max-w-3xl list-decimal space-y-2 pl-5 text-base leading-relaxed text-h27-ivory">
          <li>For each item, choose Approved, Revision required or Pending decision. Add a note for a revision or a pending decision. Drafts stay in this browser only; nothing is sent.</li>
          <li>Add your name in the bar at the bottom, then copy or download the decision record and send it to Veridion.</li>
          <li>Veridion records it in the project. An approval covers the exact wording approved: if the wording changes later, the item comes back here.</li>
        </ol>

        <h2 className="mt-12 font-serif text-2xl text-h27-ivory">Who approves what</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="rv-table w-full min-w-[560px] border-collapse">
            <thead><tr><th>Approves</th><th className="text-right">Open items</th><th className="text-right">Needed for the first launch</th><th className="text-right">Can be decided now</th></tr></thead>
            <tbody>
              {APPROVERS.map((a) => (
                <tr key={a}><td>{a}</td><td className="num">{per(a)}</td><td className="num">{per(a, (i) => i.tier === 1)}</td><td className="num">{per(a, (i) => i.dependsOn.length === 0)}</td></tr>
              ))}
              <tr><td className="text-h27-ivory">All</td><td className="num">{counts.open}</td><td className="num">{counts.byTier[1]}</td><td className="num">{counts.decidableNow}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-3xl text-h27-muted">
          Each item is counted once, wherever it appears. The page-by-page figures on the approval status page count shared items once per page, so they add up to more.
        </p>

        <h2 className="mt-12 font-serif text-2xl text-h27-ivory">What blocks the first public launch</h2>
        <p className="mt-3 max-w-3xl text-h27-muted">
          Recommended first launch: {FIRST_LAUNCH.map((p) => PAGE_TITLE[p]).join(", ")}. The launch gate requires the homepage and Tickets; Contact and Speakers use no review photographs and hold only status notices and labels.
        </p>
        <ol className="mt-4 max-w-3xl space-y-3">
          {firstLaunchDecisions(items).map((d, n) => (
            <li key={d.decision} className="border-l-2 border-h27-champagne pl-4">
              <span className="text-h27-muted">{n + 1}. </span><b className="font-medium text-h27-ivory">{d.decision}</b>
              <span className="text-h27-muted">, {d.who}. </span><span className="text-h27-ivory">{d.why}</span>
            </li>
          ))}
        </ol>

        <nav aria-label="Groups" className="mt-12 flex flex-wrap gap-2">
          {GROUP_ORDER.map((g) => (
            <a key={g} href={`#${g}`} className="rv-tag hover:text-h27-ivory">{GROUPS[g].title} ({counts.byGroup[g]})</a>
          ))}
          <a href="#media" className="rv-tag hover:text-h27-ivory">{GROUPS.media.title} ({media.length})</a>
        </nav>

        {GROUP_ORDER.map((g) => (
          <section key={g} id={g} aria-labelledby={`${g}-title`} className="mt-16 scroll-mt-24">
            <h2 id={`${g}-title`} className="font-serif text-3xl text-h27-ivory">{GROUPS[g].title}</h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-h27-muted">{GROUPS[g].summary}</p>
            {byPage(items.filter((i) => i.group === g)).map(([page, list]) => (
              <div key={page} className="mt-10">
                <h3 className="font-serif text-xl text-h27-champagne-light">{page} <span className="text-sm text-h27-muted">({list.length})</span></h3>
                <div className="mt-4 grid gap-4">
                  {list.map((i) => <Item key={i.id} item={i} />)}
                </div>
              </div>
            ))}
          </section>
        ))}

        <section id="media" aria-labelledby="media-title" className="mt-16 scroll-mt-24">
          <h2 id="media-title" className="font-serif text-3xl text-h27-ivory">{GROUPS.media.title}</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-h27-muted">{GROUPS.media.summary}</p>
          <div className="mt-6 grid gap-4">
            {media.map((m) => (
              <article key={m.id} className="rv-item">
                <div className="flex flex-wrap gap-2">
                  <span className="rv-tag rv-tag--status">{m.state}</span>
                  <span className="rv-tag">{m.count} files</span>
                  <span className="rv-tag">Follow-up: {m.approver}</span>
                  <span className="rv-tag">{TIER_WORD[m.tier]}</span>
                </div>
                <h3 className="mt-3 font-serif text-xl text-h27-ivory">{m.title}</h3>
                <p className="mt-2 text-xs text-h27-muted">Used on: {pagesWord(m.pages)}</p>
                <p className="mt-3 text-sm text-h27-ivory"><span className="text-h27-muted">Settled: </span>{m.settled}</p>
                <p className="mt-2 text-sm text-h27-ivory"><span className="text-h27-muted">Outstanding: </span>{m.outstanding}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-h27-muted">
            Photographs are not decided on this page. The per-file record is in the asset register on the <a className="underline underline-offset-2" href="/2027/status">approval status page</a>.
          </p>
        </section>

        <section aria-labelledby="scope-title" className="mt-16">
          <h2 id="scope-title" className="font-serif text-2xl text-h27-ivory">Not listed here yet</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-h27-muted">
            Headlines quoted word for word in the directive are approved as written and are not listed. Wording set inside the page layouts (navigation labels,
            some section headings and button labels, the footer) is not yet part of the content register, so it is not listed or counted. It is the next thing to bring in before launch.
          </p>
        </section>
      </main>
      <DecisionTray texts={texts} proposals={proposals} />
    </>
  );
}

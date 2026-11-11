import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/components/2027/review/review.css";
import { Header2027 } from "@/components/2027/sections";
import { DecisionControl, DecisionTray } from "@/components/2027/review/Decisions";
import { deployEnvironment } from "@/lib/publication";
import { SITE_PAGES, type PageId } from "@/lib/site/2027";
import { LAUNCH_2027, launchBlockers, pageStatuses, REVIEW_MEDIA_BY_PAGE } from "@/lib/launch-2027";
import { REVIEW_ASSETS } from "@/lib/assets/home-2027-review";
import {
  CATEGORIES, FIRST_LAUNCH, PAGE_KIND, PAGE_KIND_WORDS, PAGE_TITLE, TIER_WORDS, approvalBlocks, blockFingerprint,
  firstLaunchDecisions, mediaRecords, pendingDecisions, signoffCounts, signoffItems,
  type ApprovalBlock, type SignoffItem,
} from "@/lib/content/signoff-2027";

/**
 * Content sign-off: every unapproved piece of 2027 wording and every open fact,
 * in three categories (routine, substantive, waiting on a decision), approved
 * block by block, with a way to draft decisions and export them for the record
 * (lib/content/signoff-decisions-2027.ts).
 *
 * Internal. Never served on production: the middleware answers /2027/review as a
 * missing page there (it is not one of the 13 site pages, so not even a launch
 * opens it), and this page refuses to render on production as well.
 */
export const metadata: Metadata = {
  title: "Content sign-off (internal) | HEBS Lagos 2027",
  robots: { index: false, follow: false, nocache: true },
};

const DECISION_WORD = { approved: "Approved", "revision-required": "Revision required", "pending-decision": "Pending decision" } as const;
const pagesWord = (pages: readonly PageId[]) => (pages.length >= 13 ? "Every page" : pages.map((p) => PAGE_TITLE[p]).join(", "));

function Line({ item }: { item: SignoffItem }) {
  const r = item.recorded;
  return (
    <li className="border-t border-h27-line py-3 first:border-t-0">
      <blockquote className="rv-quote !mt-0">{item.text}</blockquote>
      <p className="mt-2 text-xs text-h27-muted">
        {item.kind}. {pagesWord(item.pages)}, {item.section}. Source: {item.source}. <span className="font-mono">{item.id}</span>
      </p>
      {item.revised && <p className="mt-1 text-xs text-h27-muted">Changed in this round. It said: &ldquo;{item.revised.from}&rdquo;</p>}
      {item.proposed && (
        <div className="mt-2">
          <p className="text-xs font-medium text-h27-ocean-light">Suggested alternative</p>
          <blockquote className="rv-proposed">{item.proposed.text}</blockquote>
          <p className="mt-1 text-xs text-h27-muted">{item.proposed.why}</p>
        </div>
      )}
      {item.replacedWhen.length > 0 && <p className="mt-1 text-xs text-h27-muted">True as it stands. Replaced with real details once: {item.replacedWhen.join("; ")}.</p>}
      {r && <p className="mt-1 text-xs text-h27-champagne-light">Recorded: {DECISION_WORD[r.decision]} by {r.by} on {r.on}.</p>}
    </li>
  );
}

function Block({ block, open }: { block: ApprovalBlock; open: boolean }) {
  const fp = blockFingerprint(block.texts);
  return (
    <article className="rv-item" id={`block-${block.id}`}>
      <div className="flex flex-wrap gap-2">
        <span className="rv-tag rv-tag--status">{block.items.length} {block.items.length === 1 ? "line" : "lines"}</span>
        <span className="rv-tag">Approves: {block.approver}</span>
        <span className="rv-tag">For {TIER_WORDS[block.tier]}</span>
        <span className="rv-tag font-mono">ref {fp}</span>
      </div>
      <h4 className="mt-3 font-serif text-xl text-h27-ivory">{block.title}</h4>
      <details className="mt-3" open={open}>
        <summary className="cursor-pointer text-sm text-h27-champagne-light">The exact wording</summary>
        <ul className="mt-2">{block.items.map((i) => <Line key={i.id} item={i} />)}</ul>
      </details>
      <DecisionControl id={`block:${block.id}`} text={fp} label={block.title} />
    </article>
  );
}

export default function ContentSignoff() {
  if (deployEnvironment() === "production") notFound();
  const items = signoffItems();
  const counts = signoffCounts(items);
  const blocks = approvalBlocks(items);
  const waiting = pendingDecisions(items);
  const media = mediaRecords();
  const texts = Object.fromEntries(blocks.map((b) => [`block:${b.id}`, blockFingerprint(b.texts)]));
  const blockTexts = Object.fromEntries(blocks.map((b) => [`block:${b.id}`, b.texts]));
  const blockers = launchBlockers({ config: { ...LAUNCH_2027, pages: [...FIRST_LAUNCH] } });

  return (
    <>
      <Header2027 home="/2027" />
      <main className="rv-page mx-auto max-w-6xl px-4 py-16 text-sm sm:px-8">
        <p className="s27-kick">Internal review, previews only</p>
        <h1 className="mt-3 font-serif text-4xl text-h27-ivory sm:text-5xl">Content sign-off</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-h27-muted">
          All {counts.open} pieces of 2027 wording and facts the pages show that are not approved yet, including navigation, headings, buttons, footer,
          notices, image descriptions and search and social text. They are sorted into three categories and approved in blocks, not one line at a time.
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className="rv-table w-full min-w-[560px] border-collapse">
            <thead><tr><th>Category</th><th className="text-right">Items</th><th className="text-right">Blocks or decisions</th><th>Who</th></tr></thead>
            <tbody>
              <tr><td>{CATEGORIES.A.title}</td><td className="num">{counts.byCategory.A}</td><td className="num">{counts.blocks.A} blocks</td><td>Veridion</td></tr>
              <tr><td>{CATEGORIES.B.title}</td><td className="num">{counts.byCategory.B}</td><td className="num">{counts.blocks.B} blocks</td><td>Mrs. Shuler ({counts.blocks.owner}), HEBS organisers ({counts.blocks.organisers})</td></tr>
              <tr><td>{CATEGORIES.C.title}</td><td className="num">{counts.byCategory.C}</td><td className="num">{counts.pendingDecisions} decisions</td><td>Mostly HEBS organisers</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 font-serif text-2xl text-h27-ivory">How to record a decision</h2>
        <ol className="mt-4 max-w-3xl list-decimal space-y-2 pl-5 text-base leading-relaxed text-h27-ivory">
          <li>For each block, choose Approved, Revision required or Pending decision. Drafts stay in this browser only; nothing is sent.</li>
          <li>Add your name in the bar at the bottom, then copy or download the decision record and send it to Veridion.</li>
          <li>Veridion records it in the project with the exact wording of every line. If a line changes later, only that line comes back for approval.</li>
        </ol>
        <p className="mt-3 max-w-3xl text-h27-muted">
          Mrs. Shuler&apos;s blocks are also in the executive content package, docs/launch/2027-executive-content-package.md, which quotes the same wording.
        </p>

        <h2 className="mt-12 font-serif text-2xl text-h27-ivory">Launch readiness by page</h2>
        <p className="mt-3 max-w-3xl text-h27-muted">
          Smallest launch the gate allows: {FIRST_LAUNCH.map((p) => PAGE_TITLE[p]).join(" and ")}. Tickets carries notices only: no buy link appears until ticket prices and the payment gateway are approved.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="rv-table w-full min-w-[720px] border-collapse">
            <thead><tr><th>Page</th><th>Kind</th><th className="text-right">Items not approved</th><th className="text-right">Restricted media</th><th className="text-right">Approved media to move</th></tr></thead>
            <tbody>
              {SITE_PAGES.map((p) => {
                const used = REVIEW_ASSETS.filter((a) => (REVIEW_MEDIA_BY_PAGE[p.id] ?? []).includes(a.id));
                const own = pageStatuses(p.id);
                return (
                  <tr key={p.id}>
                    <td>{p.title}{FIRST_LAUNCH.includes(p.id) ? " (first launch)" : ""}</td>
                    <td>{PAGE_KIND_WORDS[PAGE_KIND[p.id]]}</td>
                    <td className="num">{own.filter((s) => s !== "approved").length} of {own.length}</td>
                    <td className="num">{used.filter((a) => a.restricted).length}</td>
                    <td className="num">{used.filter((a) => !a.restricted && a.ownerApproval).length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h3 className="mt-10 font-serif text-xl text-h27-ivory">Still between today and the first launch</h3>
        <ol className="mt-4 max-w-3xl space-y-3">
          {firstLaunchDecisions(items).map((d, n) => (
            <li key={d.decision} className="border-l-2 border-h27-champagne pl-4">
              <span className="text-h27-muted">{n + 1}. </span><b className="font-medium text-h27-ivory">{d.decision}</b>
              <span className="text-h27-muted">, {d.who}. </span><span className="text-h27-ivory">{d.why}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 max-w-3xl text-xs text-h27-muted">The gate&apos;s own list for that launch: {blockers.map((b) => b.id).join(", ")}.</p>

        <nav aria-label="Categories" className="mt-12 flex flex-wrap gap-2">
          <a href="#cat-b" className="rv-tag hover:text-h27-ivory">B. For Mrs. Shuler and the organisers</a>
          <a href="#cat-c" className="rv-tag hover:text-h27-ivory">C. Waiting on a decision</a>
          <a href="#cat-a" className="rv-tag hover:text-h27-ivory">A. Routine, for Veridion</a>
          <a href="#media" className="rv-tag hover:text-h27-ivory">Media</a>
        </nav>

        <section id="cat-b" aria-labelledby="cat-b-title" className="mt-14 scroll-mt-24">
          <h2 id="cat-b-title" className="font-serif text-3xl text-h27-ivory">{CATEGORIES.B.title}</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-h27-muted">{CATEGORIES.B.summary}</p>
          <div className="mt-6 grid gap-4">{blocks.filter((b) => b.category === "B").map((b) => <Block key={b.id} block={b} open />)}</div>
        </section>

        <section id="cat-c" aria-labelledby="cat-c-title" className="mt-16 scroll-mt-24">
          <h2 id="cat-c-title" className="font-serif text-3xl text-h27-ivory">{CATEGORIES.C.title}</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-h27-muted">{CATEGORIES.C.summary}</p>
          <div className="mt-6 grid gap-4">
            {waiting.map((d) => (
              <article key={d.decision} className="rv-item">
                <div className="flex flex-wrap gap-2">
                  <span className="rv-tag rv-tag--dep">{d.items.length} {d.items.length === 1 ? "item" : "items"}</span>
                  <span className="rv-tag">Decides: {d.approver}</span>
                </div>
                <h3 className="mt-3 font-serif text-xl text-h27-ivory">{d.decision}</h3>
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm text-h27-champagne-light">What it holds back</summary>
                  <ul className="mt-2">{d.items.map((i) => <Line key={i.id} item={i} />)}</ul>
                </details>
              </article>
            ))}
          </div>
        </section>

        <section id="cat-a" aria-labelledby="cat-a-title" className="mt-16 scroll-mt-24">
          <h2 id="cat-a-title" className="font-serif text-3xl text-h27-ivory">{CATEGORIES.A.title}</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-h27-muted">{CATEGORIES.A.summary}</p>
          <div className="mt-6 grid gap-4">{blocks.filter((b) => b.category === "A").map((b) => <Block key={b.id} block={b} open={false} />)}</div>
        </section>

        <section id="media" aria-labelledby="media-title" className="mt-16 scroll-mt-24">
          <h2 id="media-title" className="font-serif text-3xl text-h27-ivory">Media</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-h27-muted">
            Mrs. Shuler&apos;s approval of the website media is recorded and is not asked again. Only media with evidence of a restriction stays off public pages; missing paperwork is listed as a records follow-up.
          </p>
          <div className="mt-6 grid gap-4">
            {media.map((m) => (
              <article key={m.id} className="rv-item">
                <div className="flex flex-wrap gap-2">
                  <span className={`rv-tag ${m.state === "Restricted" ? "rv-tag--dep" : "rv-tag--now"}`}>{m.state}</span>
                  <span className="rv-tag">{m.count} files</span>
                </div>
                <h3 className="mt-3 font-serif text-xl text-h27-ivory">{m.title}</h3>
                <p className="mt-2 text-xs text-h27-muted">Used on: {pagesWord(m.pages)}</p>
                <p className="mt-3 text-sm text-h27-ivory"><span className="text-h27-muted">{m.state === "Restricted" ? "Evidence: " : "Approval: "}</span>{m.basis}</p>
                {m.followUp && <p className="mt-2 text-sm text-h27-ivory"><span className="text-h27-muted">Records follow-up: </span>{m.followUp}</p>}
              </article>
            ))}
          </div>
        </section>
      </main>
      <DecisionTray texts={texts} proposals={{}} blocks={blockTexts} />
    </>
  );
}

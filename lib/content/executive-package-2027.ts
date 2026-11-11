/**
 * The executive content package for Mrs. Shuler: what she alone must decide for
 * the first launch (the homepage and the Tickets page), in the exact wording the
 * pages will show, grouped so related sections are read together. Routine
 * wording is verified by Veridion and left out; later pages are listed only by
 * name.
 *
 * Generated into docs/launch/2027-executive-content-package.md by
 * `npm run copy:inventory`; tests fail if the file is out of date. Nothing in it
 * is approved until her decision is recorded (lib/content/signoff-decisions-2027.ts).
 */
import {
  approvalBlocks, blockFingerprint, mediaRecords, pendingDecisions, signoffItems, type ApprovalBlock, type SignoffItem,
} from "./signoff-2027";
import { ANNOUNCEMENT_ITEMS, announcementStatus } from "./2027";

/** How the homepage blocks are read together. Block ids not listed here fall under "Tickets and search". */
const GROUPS: { title: string; intro: string; blocks: RegExp }[] = [
  { title: "A. The opening of the homepage", intro: "What a visitor reads first.", blocks: /^owner-home-(hero|welcome|three-numbers)$/ },
  { title: "B. The summit days and experiences", intro: "How the three days and six experiences are described.", blocks: /^owner-home-(three-days|six-experiences)$/ },
  { title: "C. Destination, competitions and 2026 highlights", intro: "The venue, the competitions and the look back at 2026.", blocks: /^owner-home-(the-destination|competitions|2026-highlights|page-layout)$/ },
  { title: "D. Tickets", intro: "The one sentence of your own on the Tickets page. Everything else there is a verified notice that tickets are not on sale.", blocks: /^owner-tickets$/ },
];

const quote = (t: string) => `> ${t}`;
const line = (i: SignoffItem) => {
  const out = [quote(i.text)];
  if (i.proposed) out.push("", `*Suggested instead:* "${i.proposed.text}" ${i.proposed.why}`);
  return out.join("\n");
};

export function executivePackage(items: readonly SignoffItem[] = signoffItems()): string {
  const first = approvalBlocks(items).filter((b) => b.category === "B" && b.tier === 1);
  const later = approvalBlocks(items).filter((b) => b.category === "B" && b.tier > 1);
  const deferrable = ANNOUNCEMENT_ITEMS.filter((a) => announcementStatus(a) !== "approved");
  const all = Object.assign({}, ...first.map((b) => b.texts)) as Record<string, string>;
  const out: string[] = [];
  const placed = new Set<string>();

  out.push("# HEBS Lagos 2027: owner sign-off for the first launch", "");
  out.push(`For Mrs. Shuler, prepared by Veridion. Package reference ${blockFingerprint(all)}.`, "");
  out.push("The first launch is the homepage and the Tickets information page at hebslagos.com/2027. " +
    "Veridion has verified the routine wording on both: navigation, headings, buttons, notices, image descriptions and dates, " +
    "each checked against your directive and your decisions on the logo, the address and the venue. Your approved photographs and film are in place.", "");
  out.push(`What remains is yours: ${first.length} short blocks of wording in four groups, and one decision about the launch itself.`, "");
  out.push("**How to reply:** for each block, *Approved*, *Changes* (with the change) or *Hold*. A block is approved only in the exact wording shown; if a line changes later, only that line comes back to you.", "");

  out.push("## 1. Wording to approve", "");
  GROUPS.forEach((g) => {
    const bs = first.filter((b) => g.blocks.test(b.id));
    if (!bs.length) return;
    out.push(`### ${g.title}`, "", g.intro, "");
    for (const b of bs) {
      placed.add(b.id);
      out.push(blockHeading(b), "", ...lines(b).flatMap((l) => [l, ""]));
    }
  });
  const rest = first.filter((b) => !placed.has(b.id));
  if (rest.length) {
    out.push("### Also on the launch pages", "");
    for (const b of rest) out.push(blockHeading(b), "", ...lines(b).flatMap((l) => [l, ""]));
  }

  if (deferrable.length) {
    out.push("## 2. A decision about the launch", "");
    out.push("Your directive (section 11) lists these for the announcement. They are not ready, because each waits on the decision named:", "");
    for (const a of deferrable) out.push(`- **${a.requirement}**. Waiting on: ${a.dependency || "approval"}.`);
    out.push("", "Please choose one: **launch now without them**, adding each as it is ready, or **wait** until they are ready. Either way they appear only once they work.", "");
  }

  out.push("## 3. Not needed for the first launch", "");
  out.push(`Later pages, for when you are ready: ${later.map((b) => b.title).join("; ")}. ` +
    `Outstanding business decisions for those pages: ${pendingDecisions(items).map((d) => d.decision.replace(/;.*$/, "")).join("; ")}.`, "");
  out.push("## 4. Media", "");
  out.push(mediaRecords().map((m) => `- ${m.title}: ${m.state === "Restricted" ? "kept off the site" : "approved and in place"}.`).join("\n"), "");
  return out.join("\n");
}

/** A block's lines as a visitor reads them: a headline set in two styles (title, then accent) is one line. */
function lines(b: ApprovalBlock): string[] {
  const out: string[] = [];
  for (let n = 0; n < b.items.length; n++) {
    const i = b.items[n];
    const next = b.items[n + 1];
    if (/\.title$/.test(i.id) && next && next.id === i.id.replace(/\.title$/, ".accent")) {
      out.push(`${quote(`${i.text} ${next.text}`)}\n\n*One headline, set in two styles.*`);
      n++;
      continue;
    }
    out.push(line(i));
  }
  return out;
}

function blockHeading(b: ApprovalBlock): string {
  return `**${b.title}** (block \`${b.id}\`, reference ${blockFingerprint(b.texts)})`;
}

/**
 * The executive content package for Mrs. Shuler: only the substantive wording
 * (category B, in blocks) and the decisions only the owner and organisers can
 * make (category C), with the exact text of every line and where it comes from.
 * Routine wording (category A) is verified by Veridion and left out.
 *
 * Generated into docs/launch/2027-executive-content-package.md by
 * `npm run copy:inventory`; tests fail if the file is out of date. Nothing in it
 * is approved until her decision is recorded (lib/content/signoff-decisions-2027.ts).
 */
import {
  PAGE_TITLE, TIER_WORDS, approvalBlocks, blockFingerprint, mediaRecords, pendingDecisions, signoffCounts, signoffItems,
  type SignoffItem,
} from "./signoff-2027";
import { LAUNCH_2027 } from "../launch-2027-config";

const where = (i: SignoffItem) => `${i.pages.length >= 13 ? "Every page" : i.pages.map((p) => PAGE_TITLE[p]).join(", ")}, ${i.section}`;
const quote = (t: string) => t.split("\n").map((l) => `> ${l}`).join("\n");

export function executivePackage(items: readonly SignoffItem[] = signoffItems()): string {
  const blocks = approvalBlocks(items).filter((b) => b.category === "B");
  const counts = signoffCounts(items);
  const decisions = pendingDecisions(items).filter((d) => d.approver !== "Veridion");
  const all = Object.assign({}, ...blocks.map((b) => b.texts)) as Record<string, string>;
  const out: string[] = [];

  out.push("# HEBS Lagos 2027 website: wording for approval");
  out.push("");
  out.push(`Prepared by Veridion for Mrs. Shuler. Package reference ${blockFingerprint(all)}.`);
  out.push("");
  out.push(`This package holds only what needs your decision: ${blocks.length} blocks of wording (${blocks.reduce((n, b) => n + b.items.length, 0)} lines) and ${decisions.length + (LAUNCH_2027.origin.status === "approved" ? 0 : 1)} decisions. ` +
    `Routine wording (navigation, headings, buttons, notices, image descriptions and facts checked against your directive, ${counts.byCategory.A} items) is verified by Veridion and is not included.`);
  out.push("");
  out.push("The website photography and media you approved are recorded as approved. Nothing about them is asked here.");
  out.push("");
  out.push("**How to reply:** for each block, say *Approved*, *Changes* (with the change), or *Hold*. One reply covers the whole block. A block is approved only in the exact wording shown here; if any line changes later, that line comes back to you.");
  out.push("");

  out.push("## 1. Decisions");
  out.push("");
  out.push("| Decision | Who | What it unlocks |");
  out.push("|---|---|---|");
  if (LAUNCH_2027.origin.status !== "approved") out.push("| The public web address for the 2027 site (D7) | Mrs. Shuler | Search listings, sharing links and the sitemap |");
  for (const d of decisions) {
    const pages = Array.from(new Set(d.items.flatMap((i) => (i.pages.length >= 13 ? ["Every page"] : i.pages.map((p) => PAGE_TITLE[p])))));
    out.push(`| ${d.decision} | ${d.approver} | ${d.items.length} ${d.items.length === 1 ? "item" : "items"}: ${pages.join(", ")} |`);
  }
  out.push("");

  out.push("## 2. Wording to approve");
  blocks.forEach((b, n) => {
    out.push("");
    out.push(`### ${n + 1}. ${b.title}`);
    out.push("");
    out.push(`For: ${b.approver}. Needed for: ${TIER_WORDS[b.tier]}. Block \`${b.id}\`, reference ${blockFingerprint(b.texts)}.`);
    for (const i of b.items) {
      out.push("");
      out.push(quote(i.text));
      out.push("");
      out.push(`*${where(i)}. Source: ${i.source}.*`);
      if (i.revised) out.push(`*Changed in this round from: "${i.revised.from}" (${i.revised.why})*`);
      if (i.proposed) {
        out.push("");
        out.push(`Suggested alternative: "${i.proposed.text}" ${i.proposed.why}`);
      }
    }
  });
  out.push("");

  out.push("## 3. Media");
  out.push("");
  for (const m of mediaRecords()) {
    out.push(`- **${m.title}** (${m.count} files): ${m.state}. ${m.basis}${m.followUp ? ` Records follow-up: ${m.followUp}` : ""}`);
  }
  out.push("");
  out.push("Restricted media is kept off public pages because of the evidence stated, not for want of your approval.");
  out.push("");
  return out.join("\n");
}

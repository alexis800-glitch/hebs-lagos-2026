/**
 * The owner's launch-approval document for Mrs. Shuler, in plain language: what
 * visitors will see on the first release (the homepage and the Tickets page),
 * the wording only she can approve, in the order a visitor reads it, what is
 * deliberately deferred, the one privacy update, and what she is asked to
 * authorise. Routine wording is verified by Veridion and not repeated here.
 *
 * Generated into docs/launch/2027-executive-content-package.md by
 * `npm run copy:inventory`; tests fail if the file is out of date. Nothing in it
 * is approved until her decision is recorded (lib/content/signoff-decisions-2027.ts).
 */
import { approvalBlocks, blockFingerprint, signoffItems, type ApprovalBlock, type SignoffItem } from "./signoff-2027";
import { ANNOUNCEMENT_ITEMS } from "./2027";
import { HOME } from "./home-2027";
import { LAUNCH_CANDIDATE } from "../launch-2027-candidate";

/** Where each line appears, in a visitor's words. */
function where(i: SignoffItem): string {
  if (i.id === "seo.homeDescription") return "Shown under the site's name in Google and other search results";
  if (i.id === "priorityList.intro") return "Tickets page, beside the notice that the priority list is not open yet";
  const exp = /^home\.experiences\.items\.(\d)\.text$/.exec(i.id);
  if (exp) return `Under "${HOME.experiences.items[Number(exp[1])].title}"`;
  if (/^home\.competitions\.winners/.test(i.id)) return "Heading of the 2026 winners panel, which appears only once the winners' names and photographs are verified";
  return "";
}

/** A block's lines in reading order; a headline set in two styles (title, then accent) is one line. */
function lines(b: ApprovalBlock): string[] {
  const items = [...b.items].sort((x, y) => Number(x.id.startsWith("seo.")) - Number(y.id.startsWith("seo.")));
  const out: string[] = [];
  for (let n = 0; n < items.length; n++) {
    const i = items[n];
    const next = items[n + 1];
    let text = i.text;
    let note = where(i);
    if (/\.title$/.test(i.id) && next && next.id === i.id.replace(/\.title$/, ".accent")) {
      text = `${i.text} ${next.text}`;
      note = [note, "One headline, set in two styles"].filter(Boolean).join(". ");
      n++;
    }
    const entry = [`> ${text}`];
    if (note) entry.push("", `*${note}.*`);
    if (i.proposed) entry.push("", `**Our recommendation:** change this to "${i.proposed.text}" ${i.proposed.why}`);
    out.push(entry.join("\n"));
  }
  return out;
}

const SECTION: Record<string, string> = {
  "owner-home-hero": "1. The opening screen",
  "owner-home-welcome": "2. Welcome",
  "owner-home-three-numbers": "3. The summit in numbers",
  "owner-home-three-days": "4. The three days",
  "owner-home-six-experiences": "5. Six experiences",
  "owner-home-the-destination": "6. The destination",
  "owner-home-competitions": "7. Competitions",
  "owner-home-2026-highlights": "8. HEBS Lagos 2026 highlights",
  "owner-tickets": "9. The Tickets page",
};

/** Exact changes the 2026 Privacy & Cookie Notice needs to cover the 2027 pages (app/(site)/privacy/page.tsx). */
export const PRIVACY_CHANGES: { where: string; from: string; to: string }[] = [
  {
    where: "Opening sentence",
    from: "This notice explains the optional tracking used on the HEBS Lagos 2026 website and the choice you have about it.",
    to: "This notice explains the optional tracking used on the HEBS Lagos website at hebslagos.com, including the HEBS Lagos 2027 pages, and the choice you have about it.",
  },
  {
    where: "Who is responsible",
    from: "Hair Education Beauty Summit (HEBS), organiser of HEBS Lagos 2026",
    to: "Hair Education Beauty Summit (HEBS), organiser of HEBS Lagos 2026 and HEBS Lagos 2027",
  },
  {
    where: "Page title (browser tab and search results)",
    from: "Privacy & Cookie Notice | HEBS Lagos 2026",
    to: "Privacy & Cookie Notice | HEBS Lagos",
  },
  {
    where: "Search description",
    from: "How the HEBS Lagos 2026 website uses the Meta Pixel, why your consent is optional, and how to change or withdraw it at any time.",
    to: "How the HEBS Lagos website, including the 2027 pages, uses the Meta Pixel, why your consent is optional, and how to change or withdraw it at any time.",
  },
];

export function executivePackage(items: readonly SignoffItem[] = signoffItems()): string {
  const blocks = approvalBlocks(items).filter((b) => b.category === "B" && b.tier === 1)
    .sort((a, b) => Object.keys(SECTION).indexOf(a.id) - Object.keys(SECTION).indexOf(b.id));
  const deferred = ANNOUNCEMENT_ITEMS.filter((a) => LAUNCH_CANDIDATE.deferred?.includes(a.id));
  const all = Object.assign({}, ...blocks.map((b) => b.texts)) as Record<string, string>;
  const lineCount = blocks.reduce((n, b) => n + b.items.length, 0);
  const recommended = blocks.flatMap((b) => b.items).filter((i) => i.proposed).length;
  const o: string[] = [];

  o.push("# HEBS Lagos 2027 website: launch approval", "");
  o.push(`For Mrs. Shuler, from Veridion. Reference ${blockFingerprint(all)}.`, "");

  o.push("## 1. What we are asking you to approve", "");
  o.push("1. **Publish two pages** at hebslagos.com/2027: the 2027 homepage and the Tickets information page.");
  o.push(`2. **Approve the wording** in section 3: ${blocks.length} short passages (${lineCount} lines). We recommend ${recommended} changes, clearly marked.`);
  o.push(`3. **Launch without ${deferred.length} features** that are not ready yet (section 4). Each is added when it is ready.`);
  o.push("4. **Approve a small update to the privacy notice** so it names the 2027 pages (section 5).");
  o.push("5. **Give written authorisation** to publish (section 6).", "");
  o.push("Everything else on these two pages (menus, buttons, dates, captions and notices) has been checked by Veridion against your directive and your decisions on the logo, the web address and the venue name. Your approved photographs and film are in place.", "");

  o.push("## 2. What visitors will see", "");
  o.push("**The homepage**, from top to bottom: the 2027 logo and dates; the styling-floor film; a welcome; the summit in numbers; the three days; six ways to take part; the destination, with photographs of HEBS 2026 at NJS; competitions; highlights of HEBS Lagos 2026; and a closing invitation to the priority list.", "");
  o.push("**The Tickets page** says plainly that tickets are not on sale yet. It shows no prices, no payment and no form. Tickets open only after you approve the categories, prices and payment system.", "");
  o.push("**The menus** show only these two pages, so nobody is sent to a page that is not ready. The footer links to the privacy notice and lets visitors change their cookie choice.", "");

  o.push("## 3. Wording for your approval", "");
  o.push("In the order a visitor reads it. Reply to each passage with *Approved*, *Changes* (with the change), or *Hold*. If you accept a recommendation, say so and we will use that wording.", "");
  for (const b of blocks) {
    o.push(`### ${SECTION[b.id] ?? b.title}`, "");
    for (const l of lines(b)) o.push(l, "");
    o.push(`<sub>Passage reference ${b.id} / ${blockFingerprint(b.texts)}</sub>`, "");
  }

  o.push("## 4. Launching without these, for now", "");
  o.push("Your directive lists these for the announcement. None is ready, and showing them half-finished would mislead visitors, so we recommend launching without them and adding each one when it works:", "");
  for (const a of deferred) {
    const why: Record<string, string> = {
      imagery: "Needs photographs of NJS Beach Resort itself. The approved photographs show the 2026 summit.",
      "priority-form": "Needs the sign-up system and its privacy terms agreed (decisions D1 and D13). Until then the site says the list is not open yet.",
      qr: "Needs a publication date. It will point to hebslagos.com/2027.",
      "partner-inquiry": "Needs the enquiry system and public contact details agreed (decisions D1 and D10).",
    };
    o.push(`- **${a.requirement}.** ${why[a.id] ?? a.dependency}`);
  }
  o.push("", "This is recorded in the launch plan itself, so these four will not hold the release back once you authorise it.", "");

  o.push("## 5. Privacy", "");
  o.push("The two pages collect no personal information: there is no form, sign-up or payment. Visitors see the same optional cookie choice as on the 2026 site. The Meta Pixel runs only if they choose *Accept*, and their choice is kept in one cookie. Nothing new is processed.", "");
  o.push("The current Privacy & Cookie Notice describes this correctly, but it names only the 2026 website. We recommend these exact changes, and nothing else:", "");
  for (const c of PRIVACY_CHANGES) o.push(`- **${c.where}:** "${c.from}" becomes "${c.to}"`);
  o.push("", "The second change alters the organiser line you approved in September 2026, so it needs your confirmation.", "");

  o.push("## 6. Your authorisation", "");
  o.push("When you are happy with sections 3 to 5, please send this in writing (email is fine):", "");
  o.push("> I authorise publication of the HEBS Lagos 2027 homepage and Tickets page at hebslagos.com/2027, with the wording approved in the launch approval document, launching without resort photography, the priority list, the QR code and partner enquiries, which will be added when ready.", "");
  o.push("Veridion then records your decisions, adds the approved photographs to the release and prepares the launch for your final go-ahead. Nothing is published before that.", "");
  return o.join("\n");
}

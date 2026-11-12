/**
 * Wording written in the 2027 page components rather than the content modules:
 * navigation, section headings, buttons, footer, notices, plain lists, search
 * and social metadata. Inventoried from what each page actually renders, with
 * staging-only parts (data-staging) left out, by tests/copy-inventory-2027.test.ts
 * (`npm run copy:inventory` regenerates it; the test fails if it is out of date).
 *
 * Each string is approved like any other copy, by a recorded sign-off of its
 * exact wording (lib/content/signoff-decisions-2027.ts), and the launch gate
 * counts it on every page it appears on.
 */
import data from "./layout-copy-2027.json";
import type { PageId } from "../site/2027";
import type { PublicationStatus } from "../publication";
import { SIGNOFF_DECISIONS, wordingApproved, type SignoffDecision } from "./signoff-decisions-2027";

export interface LayoutString {
  /** "layout.<scope>.<hash of the wording>": new wording gets a new key. */
  key: string;
  /** The page it appears on, or "site" for wording on three or more pages, the footer and the social card. */
  scope: PageId | "site";
  /** "page": visible on the page; "alt": image description or accessible label; "seo": title or description; "social": the sharing card. */
  where: "page" | "alt" | "seo" | "social";
  text: string;
}

export const LAYOUT_COPY: readonly LayoutString[] = data.strings as LayoutString[];

export function layoutStatus(s: LayoutString, decisions: readonly SignoffDecision[] = SIGNOFF_DECISIONS): PublicationStatus {
  return wordingApproved(s.key, s.text, decisions) ? "approved" : "provisional";
}

/** Approval states of the layout wording one page shows: its own and the site-wide. */
export function layoutStatuses(id: PageId, decisions: readonly SignoffDecision[] = SIGNOFF_DECISIONS): PublicationStatus[] {
  return LAYOUT_COPY.filter((s) => s.scope === id || s.scope === "site").map((s) => layoutStatus(s, decisions));
}

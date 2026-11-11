/**
 * The recorded sign-off decisions for HEBS Lagos 2027 copy and facts.
 *
 * This file is the record. The review page (/2027/review, previews only) lets a
 * reviewer draft decisions in their own browser and export them; Veridion then
 * adds the exported entries here, so every decision is in Git with who made it,
 * when, and on what authority. Nothing is recorded on anyone's behalf: an entry
 * is added only from a decision the named person actually gave.
 *
 * An approval is bound to the exact wording it approved (`text`). If the copy
 * changes afterwards, the approval no longer applies and the item returns to the
 * review list, so approved status can never carry over to wording nobody saw.
 *
 * Pure data with no imports from the content modules, so the content, the launch
 * gate (lib/launch-2027.ts) and the middleware can all read it.
 */

export type SignoffDecisionKind = "approved" | "revision-required" | "pending-decision";

export interface SignoffDecision {
  /**
   * The sign-off item, e.g. "pages.travel.venue" or "home.welcome.body", or a
   * whole approval block, "block:<id>" (lib/content/signoff-2027.ts, APPROVAL_BLOCKS).
   */
  item: string;
  decision: SignoffDecisionKind;
  /** The exact wording decided on. Required for an approval of one item. */
  text?: string;
  /**
   * For a block: every item in it, with the exact wording decided on, as the
   * approval package showed it. Each item is approved only for that wording.
   */
  texts?: Readonly<Record<string, string>>;
  /** Who decided: "Mrs. Shuler", "HEBS organisers (name)", "Veridion (name)". */
  by: string;
  /** ISO date of the decision. */
  on: string;
  /** Where the decision is evidenced: an email, a meeting note, a signed document. */
  reference: string;
  /** Requested wording or what the decision waits for. */
  note?: string;
}

/** Oldest first; the latest entry for an item is the one that counts. */
export const SIGNOFF_DECISIONS: readonly SignoffDecision[] = [];

/** The decision that currently stands for `item`, made on the item itself or on a block that includes it. */
export function latestDecision(item: string, decisions: readonly SignoffDecision[] = SIGNOFF_DECISIONS): SignoffDecision | undefined {
  for (let i = decisions.length - 1; i >= 0; i--) {
    const d = decisions[i];
    if (d.item === item || (d.texts && item in d.texts)) return d;
  }
  return undefined;
}

/** Whether `text` at `item` carries a standing approval of exactly that wording. */
export function wordingApproved(item: string, text: string, decisions: readonly SignoffDecision[] = SIGNOFF_DECISIONS): boolean {
  const d = latestDecision(item, decisions);
  if (d?.decision !== "approved") return false;
  return d.item === item ? d.text === text : d.texts?.[item] === text;
}

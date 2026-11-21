/**
 * The HEBS Lagos 2027 launch switch, kept apart from lib/launch-2027.ts so the
 * site map can read it without an import cycle. Changing it is a reviewed
 * commit that records the owner's written authorisation; see
 * docs/launch/LAUNCH-2027.md. lib/launch-2027.ts decides whether the site may
 * actually open.
 */
import type { Gated } from "./publication";
import type { PageId } from "./site/2027";
import type { AnnouncementId } from "./content/2027";

export interface LaunchAuthorisation {
  /** Who authorised publication, as written in the approval. */
  by: string;
  /** ISO date of the written approval. */
  on: string;
  /** Where the approval is recorded (message, document or ticket reference). */
  reference: string;
}

export interface LaunchConfig {
  /** null until the owner authorises publication in writing. */
  authorisation: LaunchAuthorisation | null;
  /** The pages published at launch. Every other 2027 page stays withheld. */
  pages: readonly PageId[];
  /** The canonical web address of the 2027 site, without a trailing slash. */
  origin: Gated<string>;
  /**
   * Directive section 11 items the owner's authorisation launches without, to be
   * added when ready (AnnouncementItem ids). In effect only with `authorisation`.
   */
  deferred?: readonly AnnouncementId[];
  /**
   * Facts the owner's authorisation launches as "to be announced": the page states
   * that the detail is not confirmed yet and invents nothing. In effect only with
   * `authorisation`.
   *   - "day-hours": the 2027 opening hours of each day;
   *   - "slot-<id>": a register media slot not yet filled, where the page shows an
   *     approved HEBS Lagos 2026 photograph or a typographic panel instead.
   */
  toBeAnnounced?: readonly ("day-hours" | `slot-${string}`)[];
}

/** The launch switch. Changing it is a reviewed commit, never a setting. */
export const LAUNCH_2027: LaunchConfig = {
  authorisation: {
    by: "HEBS management (written launch approval to Veridion; Mrs. Shuler's separate written authorisation to be documented under the owner approval process)",
    on: "2026-11-21",
    reference: "Launch decision of 21 Nov 2026: \"I approve the launch scope covering all 13 HEBS Lagos 2027 website pages\", with authority to finalise the website wording (docs/launch/2027-launch-record.md)",
  },
  pages: ["home", "about", "experience", "programme", "education", "competitions", "speakers", "exhibitors", "sponsorship", "tickets", "travel", "gallery", "contact"],
  /** Launched without, and added when ready: NJS Beach Resort photography, the priority form, the QR code and partner inquiries. */
  deferred: ["imagery", "priority-form", "qr", "partner-inquiry"],
  toBeAnnounced: ["day-hours", "slot-education", "slot-highlights-2026"],
  origin: {
    status: "approved",
    value: "https://www.hebslagos.com",
    source: "Mrs. Shuler, decision D7, 11 Nov 2026: the public domain stays hebslagos.com, with the 2027 site under /2027",
  },
};

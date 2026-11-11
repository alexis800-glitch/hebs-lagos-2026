/**
 * The HEBS Lagos 2027 launch switch, kept apart from lib/launch-2027.ts so the
 * site map can read it without an import cycle. Changing it is a reviewed
 * commit that records the owner's written authorisation; see
 * docs/launch/LAUNCH-2027.md. lib/launch-2027.ts decides whether the site may
 * actually open.
 */
import type { Gated } from "./publication";
import type { PageId } from "./site/2027";

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
}

/** The launch switch. Changing it is a reviewed commit, never a setting. */
export const LAUNCH_2027: LaunchConfig = {
  authorisation: null,
  pages: [],
  origin: {
    status: "approved",
    value: "https://www.hebslagos.com",
    source: "Mrs. Shuler, decision D7, 11 Nov 2026: the public domain stays hebslagos.com, with the 2027 site under /2027",
  },
};

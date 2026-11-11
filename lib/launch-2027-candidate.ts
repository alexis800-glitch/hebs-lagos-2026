/**
 * The first launch candidate, ready to become LAUNCH_2027 in the launch commit:
 * the homepage and the Tickets information page, at hebslagos.com/2027 (D7).
 *
 * This is not the switch. The site stays closed until lib/launch-2027-config.ts
 * records Mrs. Shuler's written authorisation; that commit copies these pages
 * and releases the prepared media (docs/launch/LAUNCH-2027.md, section 3).
 * tests/launch-candidate-2027.test.ts renders both pages as production would.
 */
import type { LaunchConfig } from "./launch-2027-config";

export const LAUNCH_CANDIDATE: Omit<LaunchConfig, "authorisation"> = {
  pages: ["home", "tickets"],
  origin: {
    status: "approved",
    value: "https://www.hebslagos.com",
    source: "Mrs. Shuler, decision D7, 11 Nov 2026: the public domain stays hebslagos.com, with the 2027 site under /2027",
  },
};

/**
 * The official HEBS Lagos 2027 email addresses (HEBS management, relayed by Gary,
 * 20 Nov 2026). The 2026 thehebs.com mailbox is not used for 2027.
 *
 * An address is shown on a 2027 page only when BOTH:
 *   - it is approved as a public contact, and
 *   - its mail flow has passed testing: an inbound message reaches the mailbox, and
 *     a reply sent from it arrives (MAIL_FLOW below, recorded in a reviewed commit
 *     with the test date).
 *
 * 23 Nov 2026: enquiries@ and sponsors@hebslagos.com are Microsoft 365 shared
 * mailboxes. Both passed real external tests that day: an outside message was
 * received, and a message sent from the mailbox arrived outside, with the HEBS
 * sender name. HEBS approved publishing these two addresses. exhibitors@ and
 * tickets@ are not configured mailboxes and stay unpublished; exhibitor and
 * ticket questions go to the two published addresses.
 */
import type { Gated } from "../publication";

export type ContactId = "enquiries" | "sponsors" | "exhibitors" | "tickets";

export interface Contact2027 {
  address: Gated<string>;
  /** What visitors use it for, as the pages describe it. */
  purpose: string;
}

export const CONTACTS_2027: Readonly<Record<ContactId, Contact2027>> = {
  enquiries: {
    address: { status: "approved", value: "enquiries@hebslagos.com", source: "HEBS management decision relayed by Gary, 20 Nov 2026; publication approved by HEBS, 23 Nov 2026" },
    purpose: "General enquiries, tickets and visitor support",
  },
  sponsors: {
    address: { status: "approved", value: "sponsors@hebslagos.com", source: "HEBS management, 21 Nov 2026; Microsoft 365 shared mailbox; publication approved by HEBS, 23 Nov 2026" },
    purpose: "Sponsorships, exhibitors and corporate partnerships",
  },
  exhibitors: {
    address: { status: "provisional", value: "exhibitors@hebslagos.com", note: "Not a configured mailbox (23 Nov 2026). Not published; exhibitors use sponsors@hebslagos.com." },
    purpose: "Exhibitor applications",
  },
  tickets: {
    address: { status: "provisional", value: "tickets@hebslagos.com", note: "Not a configured mailbox (23 Nov 2026). Not published; ticket questions use enquiries@hebslagos.com." },
    purpose: "Tickets and booking replies",
  },
};

/** Mail-flow tests, per address. Each needs the date it passed; null until then. */
export const MAIL_FLOW: Readonly<Record<ContactId, { inbound: string | null; reply: string | null }>> = {
  enquiries: { inbound: "2026-11-23", reply: "2026-11-23" },
  sponsors: { inbound: "2026-11-23", reply: "2026-11-23" },
  exhibitors: { inbound: null, reply: null },
  tickets: { inbound: null, reply: null },
};

/** The address to show for `id`, or null while it is not approved or not tested. */
export function publicContact(id: ContactId, contacts = CONTACTS_2027, flow = MAIL_FLOW): string | null {
  const c = contacts[id];
  const f = flow[id];
  if (c.address.status !== "approved" || !f.inbound || !f.reply) return null;
  return c.address.value;
}

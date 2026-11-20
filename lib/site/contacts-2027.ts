/**
 * The official HEBS Lagos 2027 email addresses (HEBS management, relayed by Gary,
 * 20 Nov 2026). The 2026 thehebs.com mailbox is not used for 2027.
 *
 * An address is shown on a 2027 page only when BOTH:
 *   - it is approved as a public contact, and
 *   - its mail flow has passed testing: an inbound message reaches the mailbox, and
 *     a reply sent from it arrives (MAIL_FLOW below, recorded in a reviewed commit
 *     with the test date).
 * Until then every page keeps its "published once approved" wording. Today
 * hebslagos.com has no MX record, so neither address can receive email yet
 * (checked 20 Nov 2026); the Microsoft 365 setup is awaiting Lex/HEBS approval.
 */
import type { Gated } from "../publication";

export type ContactId = "enquiries" | "tickets";

export interface Contact2027 {
  address: Gated<string>;
  /** What visitors use it for, as the pages describe it. */
  purpose: string;
}

export const CONTACTS_2027: Readonly<Record<ContactId, Contact2027>> = {
  enquiries: {
    address: { status: "approved", value: "enquiries@hebslagos.com", source: "HEBS management decision relayed by Gary, 20 Nov 2026" },
    purpose: "Public enquiries, support, sponsors and exhibitors",
  },
  tickets: {
    address: { status: "approved", value: "tickets@hebslagos.com", source: "HEBS management decision relayed by Gary, 20 Nov 2026" },
    purpose: "Tickets and booking replies",
  },
};

/** Mail-flow tests, per address. Each needs the date it passed; null until then. */
export const MAIL_FLOW: Readonly<Record<ContactId, { inbound: string | null; reply: string | null }>> = {
  enquiries: { inbound: null, reply: null },
  tickets: { inbound: null, reply: null },
};

/** The address to show for `id`, or null while it is not approved or not tested. */
export function publicContact(id: ContactId, contacts = CONTACTS_2027, flow = MAIL_FLOW): string | null {
  const c = contacts[id];
  const f = flow[id];
  if (c.address.status !== "approved" || !f.inbound || !f.reply) return null;
  return c.address.value;
}

/**
 * HEBS Lagos 2027 ticket categories and prices: the established HEBS Lagos 2026
 * prices, as published at hebslagos.com/tickets on 21 Nov 2026 (HEBS management
 * decision, relayed by Gary, 21 Nov 2026).
 *
 * Prices are in naira only: 2027 payment is by naira bank transfer. The 2026 VIP
 * Experience was shown as $400 (₦560,000), with a "$600 standard" price; only the
 * naira amount is used here (raised for owner confirmation). What each pass
 * includes is not carried over: the 2026 inclusions referred to the 2026 venue and
 * programme and await 2027 approval.
 *
 * Showing prices does not open sales: "Buy tickets" also needs an approved, working
 * payment method (TICKET_SALES.payment) and the production portal.
 */
import type { Gated } from "../publication";

export interface TicketCategory2027 {
  id: string;
  name: string;
  priceNgn: number;
}

export const TICKET_CATALOGUE_2027: Gated<readonly TicketCategory2027[]> = {
  status: "approved",
  value: [
    { id: "one-day", name: "One Day Pass", priceNgn: 15_000 },
    { id: "two-days", name: "Two Days Pass", priceNgn: 25_000 },
    { id: "three-days", name: "Three Days Pass", priceNgn: 75_000 },
    { id: "vip", name: "VIP Experience", priceNgn: 560_000 },
  ],
  source: "HEBS management, 21 Nov 2026: the established HEBS Lagos 2026 ticket prices (hebslagos.com/tickets)",
};

/** "₦15,000". */
export const formatNgn = (n: number): string => `₦${n.toLocaleString("en-NG")}`;

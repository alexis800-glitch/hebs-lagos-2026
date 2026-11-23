/**
 * HEBS Lagos 2027 ticket categories and prices: CONFIRMED MANAGEMENT DECISION,
 * 23 Nov 2026. 2027 uses the same amounts as HEBS Lagos 2026, with the 2026 Base44
 * guest portal's TicketPricing catalogue as the source of truth: the same four
 * categories, names, Early Bird and Standard prices. The website and the portal must
 * never show different prices or names.
 *
 * The earlier ₦560,000 VIP figure (a planning conversion, $400 × ₦1,400, from the
 * 2026 website) is withdrawn: the portal sold VIP at ₦640,000 Early Bird and
 * ₦960,000 Standard.
 *
 * Prices are in naira only: 2027 payment is by naira bank transfer. What each pass
 * includes, and the Early Bird dates, are not shown: they await 2027 confirmation.
 *
 * Showing prices does not open sales: "Buy tickets" also needs an approved, working
 * payment method (TICKET_SALES.payment) and the production portal.
 */
import type { Gated } from "../publication";

export interface TicketCategory2027 {
  id: string;
  /** The portal catalogue's name, exactly. */
  name: string;
  earlyBirdNgn: number;
  standardNgn: number;
}

export const TICKET_CATALOGUE_2027: Gated<readonly TicketCategory2027[]> = {
  status: "approved",
  value: [
    { id: "one-day", name: "1-Day Pass", earlyBirdNgn: 15_000, standardNgn: 15_000 },
    { id: "two-day", name: "2-Day Pass", earlyBirdNgn: 25_000, standardNgn: 25_000 },
    { id: "three-day", name: "3-Day All-Inclusive", earlyBirdNgn: 75_000, standardNgn: 75_000 },
    { id: "vip", name: "VIP Package", earlyBirdNgn: 640_000, standardNgn: 960_000 },
  ],
  source: "HEBS management, confirmed decision of 23 Nov 2026: the 2026 Base44 portal TicketPricing catalogue (names, Early Bird and Standard prices)",
};

/** Every naira amount a category is sold at: one when Early Bird equals Standard. */
export const ticketAmounts = (c: TicketCategory2027): number[] => (c.earlyBirdNgn === c.standardNgn ? [c.standardNgn] : [c.earlyBirdNgn, c.standardNgn]);

/** "₦15,000". */
export const formatNgn = (n: number): string => `₦${n.toLocaleString("en-NG")}`;

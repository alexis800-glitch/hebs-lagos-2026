/**
 * 2027 ticket categories and prices: the 2026 Base44 portal catalogue (confirmed
 * management decision, 23 Nov 2026), in naira only, and no ticket sold until
 * payment is approved.
 */
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TICKET_CATALOGUE_2027, ticketAmounts } from "@/lib/content/tickets-2027";
import { TICKET_SALES } from "@/lib/integrations/registration-2027";
import { TicketsPage } from "@/components/2027/editorial/inner";

describe("2027 ticket catalogue", () => {
  it("is the 2026 portal catalogue: names, Early Bird and Standard prices (23 Nov 2026)", () => {
    expect(TICKET_CATALOGUE_2027.status).toBe("approved");
    if (TICKET_CATALOGUE_2027.status !== "approved") return;
    expect(TICKET_CATALOGUE_2027.value.map((c) => [c.name, c.earlyBirdNgn, c.standardNgn])).toEqual([
      ["1-Day Pass", 15000, 15000], ["2-Day Pass", 25000, 25000], ["3-Day All-Inclusive", 75000, 75000], ["VIP Package", 640000, 960000],
    ]);
    expect(TICKET_CATALOGUE_2027.value.flatMap(ticketAmounts)).not.toContain(560000);
  });

  it("shows naira prices only, never the withdrawn ₦560,000, and no buy link while payment is not approved", () => {
    expect(TICKET_SALES).toMatchObject({ prices: true, payment: false });
    const html = renderToStaticMarkup(createElement(TicketsPage, { environment: "preview" }));
    const text = html.replace(/<[^>]+>/g, "");
    for (const p of ["₦15,000", "₦25,000", "₦75,000", "Early Bird ₦640,000", "Standard ₦960,000"]) expect(text).toContain(p);
    for (const n of ["1-Day Pass", "2-Day Pass", "3-Day All-Inclusive", "VIP Package"]) expect(text).toContain(n);
    expect(text).not.toContain("₦560,000");
    expect(html).not.toMatch(/\$\s?\d/);
    expect(html).not.toContain(">Buy tickets<");
  });
});

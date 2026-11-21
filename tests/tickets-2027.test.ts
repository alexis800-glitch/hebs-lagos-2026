/**
 * 2027 ticket categories and prices: the established 2026 prices (management,
 * 21 Nov 2026), in naira only, and no ticket sold until payment is approved.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TICKET_CATALOGUE_2027, formatNgn } from "@/lib/content/tickets-2027";
import { TICKET_SALES } from "@/lib/integrations/registration-2027";
import { TicketsPage } from "@/components/2027/editorial/inner";

describe("2027 ticket catalogue", () => {
  it("uses the 2026 prices published at hebslagos.com/tickets", () => {
    expect(TICKET_CATALOGUE_2027.status).toBe("approved");
    if (TICKET_CATALOGUE_2027.status !== "approved") return;
    expect(TICKET_CATALOGUE_2027.value.map((c) => [c.name, c.priceNgn])).toEqual([
      ["One Day Pass", 15000], ["Two Days Pass", 25000], ["Three Days Pass", 75000], ["VIP Experience", 560000],
    ]);
    // The same figures as the 2026 tickets page (app/(site)/tickets/page.tsx).
    const p2026 = readFileSync(join(__dirname, "../app/(site)/tickets/page.tsx"), "utf8");
    for (const c of TICKET_CATALOGUE_2027.value) expect(p2026, c.name).toContain(formatNgn(c.priceNgn));
  });

  it("shows naira prices only, and no buy link while payment is not approved", () => {
    expect(TICKET_SALES).toMatchObject({ prices: true, payment: false });
    const html = renderToStaticMarkup(createElement(TicketsPage, { environment: "preview" }));
    for (const p of ["₦15,000", "₦25,000", "₦75,000", "₦560,000"]) expect(html).toContain(p);
    expect(html).not.toMatch(/\$\s?\d/);
    expect(html).not.toContain(">Buy tickets<");
  });
});

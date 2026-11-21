/**
 * 2026 regression lock.
 *
 * Captures every value exported by lib/competitions.ts - the approved 2026
 * programme - as a snapshot. The snapshot was recorded against origin/master
 * 28d1d45 before any 2027 work began, so any change to the 2026 catalogue,
 * fees, schedule, hours, prizes or exchange rate fails this test.
 */
import { describe, expect, it } from "vitest";
import * as competitions from "@/lib/competitions";

describe("HEBS Lagos 2026 programme (frozen)", () => {
  it("exports exactly the approved 2026 values", () => {
    const values = Object.fromEntries(
      Object.entries(competitions)
        .filter(([, v]) => typeof v !== "function")
        .sort(([a], [b]) => a.localeCompare(b)),
    );
    expect(values).toMatchSnapshot();
  });

  it("derived helpers return the approved 2026 results", () => {
    expect({
      grouped: competitions.groupedByCategory().map((g) => [
        g.category.slug,
        g.competitions.map((c) => c.slug),
      ]),
      schedule: competitions.scheduleByDay().map((d) => [
        d.isoDate,
        d.rows.map((r) => `${r.session.startIso} ${r.competition.slug}`),
      ]),
      prizes: competitions.COMPETITIONS.map((c) => [
        c.slug,
        competitions.prizeDisplay(c),
        competitions.prizeDisplayWithNgn(c),
      ]),
      multiDay: competitions.multiDayCompetitions().map((c) => c.slug),
    }).toMatchSnapshot();
  });

  it("keeps the headline programme facts", () => {
    expect(competitions.COMPETITION_COUNT).toBe(13);
    expect(competitions.CATEGORY_COUNT).toBe(7);
    expect(competitions.TOTAL_PRIZE_DISPLAY).toBe("$87,500 USD / ₦122,500,000");
    expect(competitions.ENTRY_FEE_DISPLAY).toBe("₦50,000");
  });
});

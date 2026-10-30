import { describe, expect, it } from "vitest";
import { COMPETITIONS, TOTAL_PRIZE_USD } from "@/lib/competitions";
import {
  CATEGORY_COUNT_2027,
  COMPETITIONS_2027,
  COMPETITION_COUNT_2027,
  COUNTDOWN_TARGET_ISO,
  EDITION_DAYS,
  TOTAL_PRIZE_USD_2027,
  VENUE,
} from "@/lib/editions/2027";

describe("HEBS 2027 edition", () => {
  it("carries forward the 2026 categories and prize values exactly", () => {
    expect(COMPETITION_COUNT_2027).toBe(13);
    expect(CATEGORY_COUNT_2027).toBe(7);
    expect(TOTAL_PRIZE_USD_2027).toBe(TOTAL_PRIZE_USD);
    expect(COMPETITIONS_2027.map((c) => [c.slug, c.category, c.prizeUsd, c.prizeIsUpTo])).toEqual(
      COMPETITIONS.map((c) => [c.slug, c.category, c.prizeUsd, c.prizeIsUpTo]),
    );
  });

  it("does not carry any 2026 operating detail into 2027", () => {
    for (const c of COMPETITIONS_2027) {
      const record = c as unknown as Record<string, unknown>;
      for (const key of ["feeNgn", "feeDisplay", "feeConfirmed", "registrationUrl", "note"]) {
        expect(record).not.toHaveProperty(key);
      }
      for (const gated of [c.sessions, c.entryFee, c.registrationDeadline, c.rulesAndEligibility, c.description, c.applicationUrl]) {
        expect(gated.status).toBe("awaiting-confirmation");
      }
    }
    const serialised = JSON.stringify(COMPETITIONS_2027);
    expect(serialised).not.toMatch(/2026-10-2[45]|50,?000|₦|1,?400/);
  });

  it("uses the directive's dates and weekdays", () => {
    expect(EDITION_DAYS.map((d) => [d.isoDate, d.weekday])).toEqual([
      ["2027-07-23", "Friday"],
      ["2027-07-24", "Saturday"],
      ["2027-07-25", "Sunday"],
    ]);
    expect(EDITION_DAYS.every((d) => d.hours.status === "awaiting-confirmation")).toBe(true);
  });

  it("counts down to midnight in Lagos, not a start time", () => {
    expect(COUNTDOWN_TARGET_ISO).toBe("2027-07-23T00:00:00+01:00");
    expect(new Date(COUNTDOWN_TARGET_ISO).toISOString()).toBe("2027-07-22T23:00:00.000Z");
  });

  it("keeps the venue provisional and the address unstated", () => {
    expect(VENUE.name.status).toBe("provisional");
    expect(VENUE.address.status).toBe("awaiting-confirmation");
  });
});

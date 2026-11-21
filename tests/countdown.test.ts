import { describe, expect, it } from "vitest";
import { parseTargetInstant, timeLeft, timeLeftSeconds } from "@/lib/countdown";

const TARGET = "2027-07-23T00:00:00+01:00";

describe("countdown", () => {
  it("counts to the same instant for every visitor time zone", () => {
    // 2027-07-22 22:00 UTC = 23:00 in Lagos: one hour to go, wherever the visitor is.
    expect(timeLeft(TARGET, Date.parse("2027-07-22T22:00:00Z"))).toEqual({ days: 0, hours: 1, minutes: 0 });
  });

  it("splits a long interval into days, hours and minutes", () => {
    // Lagos 2026-10-30 12:00 (11:00 UTC) to Lagos 2027-07-23 00:00.
    expect(timeLeft(TARGET, Date.parse("2026-10-30T11:00:00Z"))).toEqual({ days: 265, hours: 12, minutes: 0 });
  });

  it("returns null at and after the target", () => {
    expect(timeLeft(TARGET, Date.parse("2027-07-22T23:00:00Z"))).toBeNull();
    expect(timeLeft(TARGET, Date.parse("2027-07-25T12:00:00Z"))).toBeNull();
  });

  it("refuses a target without an explicit offset", () => {
    expect(() => parseTargetInstant("2027-07-23T00:00:00")).toThrow(/explicit UTC offset/);
  });
});

describe("timeLeftSeconds", () => {
  const target = "2027-07-23T00:00:00+01:00";
  it("adds whole seconds to the same days, hours and minutes", () => {
    const now = Date.parse("2027-07-21T21:58:30.400Z"); // 1 day 1 h 1 min 29.6 s before 23:00Z
    expect(timeLeftSeconds(target, now)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 29 });
    const { seconds: _s, ...rest } = timeLeftSeconds(target, now)!;
    expect(rest).toEqual(timeLeft(target, now));
  });
  it("is null once the target has passed", () => {
    expect(timeLeftSeconds(target, Date.parse("2027-07-22T23:00:00Z"))).toBeNull();
  });
});

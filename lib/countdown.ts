/**
 * Countdown arithmetic, independent of the visitor's clock zone.
 *
 * The target is an absolute instant with an explicit offset (e.g.
 * "2027-07-23T00:00:00+01:00", midnight in Lagos), so the remaining time is
 * the same for a visitor in Lagos, London or Los Angeles. The 2026 countdown
 * parsed an offset-less string and so counted to midnight in each visitor's
 * own zone.
 */

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Requires an ISO 8601 string with an explicit offset or Z. */
export function parseTargetInstant(iso: string): number {
  if (!/(Z|[+-]\d{2}:\d{2})$/.test(iso)) {
    throw new Error(`[countdown] target "${iso}" needs an explicit UTC offset`);
  }
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) throw new Error(`[countdown] invalid target "${iso}"`);
  return ms;
}

/** Whole days, hours and minutes left, or null once the target has passed. */
export function timeLeft(targetIso: string, nowMs: number): TimeLeft | null {
  const diff = parseTargetInstant(targetIso) - nowMs;
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
  };
}

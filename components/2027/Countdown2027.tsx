"use client";

import { useEffect, useState } from "react";
import { COUNTDOWN_TARGET_ISO } from "@/lib/editions/2027";
import { timeLeft, type TimeLeft } from "@/lib/countdown";

/**
 * Days, hours and minutes to July 23, 2027, midnight in Lagos. No seconds and
 * no start time: no 2027 start time is approved. The server renders the date
 * only; the numbers appear after hydration so server and client never disagree.
 */
export default function Countdown2027() {
  const [left, setLeft] = useState<TimeLeft | null | undefined>(undefined);

  useEffect(() => {
    const tick = () => setLeft(timeLeft(COUNTDOWN_TARGET_ISO, Date.now()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (left === undefined) {
    return <p className="font-mono text-xs uppercase tracking-[0.2em] text-h27-muted">Counting down to July 23, 2027</p>;
  }
  if (left === null) return null;

  const units = [
    { label: "Days", value: left.days },
    { label: "Hours", value: left.hours },
    { label: "Minutes", value: left.minutes },
  ];

  return (
    <div
      role="timer"
      aria-label={`${left.days} days, ${left.hours} hours and ${left.minutes} minutes until July 23, 2027, Lagos time`}
      className="flex items-stretch justify-center gap-px border border-h27-line bg-h27-line"
    >
      {units.map((u) => (
        <div key={u.label} className="flex min-w-[84px] sm:min-w-[110px] flex-col items-center bg-h27-ink/80 px-3 py-3 sm:py-4">
          <span aria-hidden="true" className="font-serif text-3xl sm:text-5xl tabular-nums text-h27-ivory">
            {String(u.value).padStart(2, "0")}
          </span>
          <span aria-hidden="true" className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-h27-champagne">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}

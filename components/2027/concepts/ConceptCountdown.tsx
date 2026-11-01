"use client";

import { useEffect, useState } from "react";
import { COUNTDOWN_TARGET_ISO } from "@/lib/editions/2027";
import { timeLeft, type TimeLeft } from "@/lib/countdown";

/**
 * Countdown to July 23, 2027, midnight in Lagos, styled per concept. Same
 * arithmetic as lib/countdown: no start time, server renders
 * the date only so hydration never disagrees.
 */
export default function ConceptCountdown({
  numberStyle,
  labelClassName,
  numberClassName,
  dividerClassName,
  fallbackClassName,
  inline = false,
  className = "",
}: {
  numberStyle?: React.CSSProperties;
  labelClassName: string;
  numberClassName: string;
  dividerClassName: string;
  fallbackClassName: string;
  /** Number and unit word side by side on one baseline, read as a sentence. */
  inline?: boolean;
  /** Applied in every state, e.g. a min-height so the fallback and timer share one size. */
  className?: string;
}) {
  const [left, setLeft] = useState<TimeLeft | null | undefined>(undefined);
  useEffect(() => {
    const tick = () => setLeft(timeLeft(COUNTDOWN_TARGET_ISO, Date.now()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (left === undefined) return <p className={`${className} ${fallbackClassName}`}>Counting down to July 23, 2027</p>;
  if (left === null) return null;
  if (inline) {
    const parts = [
      { n: left.days, one: "day", many: "days" },
      { n: left.hours, one: "hour", many: "hours" },
      { n: left.minutes, one: "minute", many: "minutes" },
    ];
    return (
      <p
        role="timer"
        aria-label={`${left.days} days, ${left.hours} hours and ${left.minutes} minutes until July 23, 2027, Lagos time`}
        className={`flex flex-wrap items-baseline gap-x-5 gap-y-1 ${className}`}
      >
        {parts.map((p) => (
          <span key={p.many} aria-hidden="true" className="inline-flex items-baseline gap-2">
            <span className={numberClassName} style={numberStyle}>{p.n}</span>
            <span className={labelClassName}>{p.n === 1 ? p.one : p.many}</span>
          </span>
        ))}
      </p>
    );
  }
  const units = [
    { label: "Days", value: left.days },
    { label: "Hours", value: left.hours },
    { label: "Minutes", value: left.minutes },
  ];
  return (
    <div
      role="timer"
      aria-label={`${left.days} days, ${left.hours} hours and ${left.minutes} minutes until July 23, 2027, Lagos time`}
      className={`flex items-end ${className}`}
    >
      {units.map((u, i) => (
        <div key={u.label} className="flex items-end">
          {i > 0 && <span aria-hidden="true" className={dividerClassName} />}
          <div className="flex flex-col">
            <span aria-hidden="true" className={numberClassName} style={numberStyle}>
              {String(u.value).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className={labelClassName}>{u.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

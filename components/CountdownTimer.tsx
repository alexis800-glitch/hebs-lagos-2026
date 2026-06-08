"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const target = new Date("2026-10-23T00:00:00");
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const update = () => {
      const tl = getTimeLeft();
      if (tl.days === 0 && tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0) {
        setIsLive(true);
      } else {
        setTimeLeft(tl);
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLive) {
    return (
      <div
        className="text-3xl md:text-4xl font-bold text-center font-playfair"
        style={{ color: "#e91e8c" }}
      >
        HEBS 2026 is LIVE!
      </div>
    );
  }

  if (!timeLeft) return null;

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 md:gap-6 justify-center flex-wrap">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className="text-3xl md:text-5xl font-bold rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white tabular-nums min-w-[64px] md:min-w-[80px] text-center"
            style={{
              background: "rgba(155, 89, 182, 0.25)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(155, 89, 182, 0.4)",
            }}
          >
            {String(value).padStart(2, "0")}
          </div>
          <span
            className="text-xs mt-2 uppercase tracking-[0.15em] font-inter"
            style={{ color: "#aaaaaa" }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

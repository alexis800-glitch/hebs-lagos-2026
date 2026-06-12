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
    <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="flex flex-col items-center bg-[#0D0D0D] border border-neutral-800 rounded-sm p-4 md:p-6 min-w-[72px] md:min-w-[96px]">
            <span className="font-sans text-3xl md:text-5xl font-medium text-white tabular-nums">
              {String(value).padStart(2, "0")}
            </span>
            <span className="font-sans text-[10px] uppercase tracking-widest text-zinc-400 mt-2">
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

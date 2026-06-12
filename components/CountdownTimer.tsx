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
    { label: "Days",    value: timeLeft.days },
    { label: "Hours",   value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 max-w-3xl mx-auto py-8">
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="relative min-w-[80px] md:min-w-[110px] p-4 bg-zinc-950/30 border border-white/10 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm transition-all duration-300 hover:border-white/20"
        >
          {/* Radial glow accent */}
          <div className="absolute -z-10 w-40 h-40 bg-zinc-800/10 blur-[60px] rounded-full pointer-events-none" />

          <span className="text-white text-4xl md:text-6xl font-light tracking-tighter font-mono tabular-nums">
            {String(value).padStart(2, "0")}
          </span>
          <span className="text-zinc-400 font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase mt-2 block">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

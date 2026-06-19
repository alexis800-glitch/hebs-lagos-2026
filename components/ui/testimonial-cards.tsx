"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";

// ── Theme system ───────────────────────────────────────────────
// Themes are assigned by POSITION in the cluster, not by testimonial.
// pos 0 (front) → 'front', pos 1 → 'accent', pos 2 → 'gold', pos 3 → 'charcoal'
export type CardTheme = "front" | "accent" | "gold" | "charcoal";

export interface CardData {
  id: string;
  render: (theme: CardTheme) => React.ReactNode;
}

interface Props {
  cards: CardData[];
  autoRotateInterval?: number;
  className?: string;
}

const THEMES: readonly CardTheme[] = ["front", "accent", "gold", "charcoal"];

// Cluster geometry (desktop)
const CW     = 560;
const CH     = 430;
const CARD_W = 340;
const CARD_H = 295;

type Pos = {
  x: number; y: number;
  rotate: number; scale: number;
  opacity: number; zIndex: number;
};

/*
  Desktop cluster — 4 cards at explicit absolute positions.
  pos 0 = front (bottom-left), pos 1 = back-right,
  pos 2 = back-left-top, pos 3 = back-right-top
*/
const DESKTOP: Pos[] = [
  { x: 0,              y: CH - 48 - CARD_H, rotate: -2, scale: 1,    opacity: 1,    zIndex: 40 },
  { x: CW - 48 - CARD_W, y: CH - 16 - CARD_H, rotate:  6, scale: 0.97, opacity: 1,    zIndex: 30 },
  { x: 96,             y: 0,                 rotate: -7, scale: 0.94, opacity: 0.88, zIndex: 20 },
  { x: CW - CARD_W,    y: 32,                rotate:  4, scale: 0.91, opacity: 0.72, zIndex: 10 },
  { x: 0,              y: CH - 48 - CARD_H, rotate: -2, scale: 0.88, opacity: 0,    zIndex: 0  },
];

// Mobile — compact centred stack, 3 visible cards
const MOBILE: Pos[] = [
  { x:  0, y:  0, rotate:  0, scale: 1,    opacity: 1,    zIndex: 40 },
  { x:  7, y:  7, rotate:  3, scale: 0.97, opacity: 0.80, zIndex: 30 },
  { x: -5, y: 11, rotate: -3, scale: 0.94, opacity: 0.55, zIndex: 20 },
  { x:  0, y: 15, rotate:  0, scale: 0.91, opacity: 0,    zIndex: 0  },
];

export function TestimonialCards({
  cards,
  autoRotateInterval = 5000,
  className = "",
}: Props) {
  const [active, setActive] = useState(0);
  const shouldReduceMotion  = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = cards.length;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setActive((p) => (p + 1) % n),
      autoRotateInterval
    );
  }, [n, autoRotateInterval]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (Math.abs(info.offset.x) > 70 || Math.abs(info.velocity.x) > 350) {
        const next =
          info.offset.x < 0 ? (active + 1) % n : (active - 1 + n) % n;
        setActive(next);
        startTimer();
      }
    },
    [active, n, startTimer]
  );

  const goTo = useCallback(
    (i: number) => { setActive(i); startTimer(); },
    [startTimer]
  );

  const spring = shouldReduceMotion
    ? { duration: 0.2, ease: "easeInOut" as const }
    : { type: "spring" as const, stiffness: 260, damping: 28 };

  return (
    <div className={`flex flex-col items-center ${className}`}>

      {/* ── DESKTOP cluster ─────────────────────────────────────── */}
      <div
        className="hidden md:block relative"
        style={{ width: CW, height: CH }}
      >
        {cards.map((card, i) => {
          const pos      = (i - active + n) % n;
          const t        = DESKTOP[Math.min(pos, DESKTOP.length - 1)];
          const theme    = THEMES[Math.min(pos, THEMES.length - 1)];
          const isActive = pos === 0;

          return (
            <motion.div
              key={card.id}
              animate={{
                x: t.x, y: t.y,
                rotate: t.rotate, scale: t.scale, opacity: t.opacity,
              }}
              style={{
                position: "absolute", top: 0, left: 0,
                width: CARD_W, height: CARD_H,
                zIndex: t.zIndex, originX: 0.5, originY: 0.5,
              }}
              transition={spring}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: -160, right: 160 }}
              dragElastic={0.15}
              onDragEnd={isActive ? onDragEnd : undefined}
              whileDrag={!shouldReduceMotion ? { scale: 1.03 } : undefined}
              className={isActive ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"}
            >
              {card.render(theme)}
            </motion.div>
          );
        })}
      </div>

      {/* ── MOBILE centred stack ────────────────────────────────── */}
      <div className="md:hidden relative w-[88vw] max-w-[320px] h-[290px]">
        {cards.map((card, i) => {
          const pos      = (i - active + n) % n;
          const t        = MOBILE[Math.min(pos, MOBILE.length - 1)];
          const theme    = THEMES[Math.min(pos, THEMES.length - 1)];
          const isActive = pos === 0;

          return (
            <motion.div
              key={card.id}
              animate={{
                x: t.x, y: t.y,
                rotate: t.rotate, scale: t.scale, opacity: t.opacity,
              }}
              style={{ position: "absolute", inset: 0, zIndex: t.zIndex }}
              transition={spring}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: -120, right: 120 }}
              dragElastic={0.18}
              onDragEnd={isActive ? onDragEnd : undefined}
              whileDrag={!shouldReduceMotion ? { scale: 1.02 } : undefined}
              className={isActive ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"}
            >
              {card.render(theme)}
            </motion.div>
          );
        })}
      </div>

      {/* ── Navigation dots ─────────────────────────────────────── */}
      <div
        className="flex items-center justify-center gap-[7px] mt-10"
        role="tablist"
        aria-label="Testimonials navigation"
      >
        {cards.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            aria-label={`View testimonial ${i + 1}`}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              i === active
                ? "w-6 h-[5px] bg-amber-400"
                : "w-[5px] h-[5px] bg-white/20 hover:bg-white/45"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

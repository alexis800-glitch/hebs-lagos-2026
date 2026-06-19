"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";

export interface CardData {
  id: string;
  content: React.ReactNode;
}

interface Props {
  cards: CardData[];
  autoRotateInterval?: number;
  className?: string;
}

// Desktop cluster geometry
const CW      = 560;  // cluster container width
const CH      = 430;  // cluster container height
const CARD_W  = 340;  // individual card width
const CARD_H  = 295;  // individual card height

type Pos = {
  x: number; y: number;
  rotate: number; scale: number;
  opacity: number; zIndex: number;
};

/*
  Dribbble-style cluster — 4 cards at explicit absolute positions.
  All cards start at top:0 left:0; x/y translate them to position.
  Rotation is around each card's own centre (originX/Y 0.5).

  Cluster visual map:
    [card-2: top-left, -7°]    [card-3: top-right, +4°]
       [card-0: front, -2°]  [card-1: back-right, +6°]
*/
const DESKTOP: Pos[] = [
  // front  — left:0, bottom:48
  { x: 0,              y: CH - 48 - CARD_H, rotate: -2, scale: 1,    opacity: 1,    zIndex: 40 },
  // back-right — right:48, bottom:16
  { x: CW - 48 - CARD_W, y: CH - 16 - CARD_H, rotate:  6, scale: 0.97, opacity: 1,    zIndex: 30 },
  // back-left-top — left:96, top:0
  { x: 96,             y: 0,                 rotate: -7, scale: 0.94, opacity: 0.85, zIndex: 20 },
  // back-right-top — right:0, top:32
  { x: CW - CARD_W,    y: 32,                rotate:  4, scale: 0.91, opacity: 0.70, zIndex: 10 },
  // hidden (5th slot — fades out behind front)
  { x: 0,              y: CH - 48 - CARD_H, rotate: -2, scale: 0.88, opacity: 0,    zIndex: 0  },
];

// Mobile: subtle centred stack, no card escapes the viewport
const MOBILE: Pos[] = [
  { x:  0, y:  0, rotate:  0, scale: 1,    opacity: 1,    zIndex: 40 },
  { x:  8, y:  8, rotate:  3, scale: 0.97, opacity: 0.75, zIndex: 30 },
  { x: -6, y: 13, rotate: -3, scale: 0.94, opacity: 0.50, zIndex: 20 },
  { x:  0, y: 17, rotate:  0, scale: 0.91, opacity: 0,    zIndex: 0  },
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
          const isActive = pos === 0;

          return (
            <motion.div
              key={card.id}
              animate={{
                x:       t.x,
                y:       t.y,
                rotate:  t.rotate,
                scale:   t.scale,
                opacity: t.opacity,
              }}
              style={{
                position: "absolute",
                top:      0,
                left:     0,
                width:    CARD_W,
                height:   CARD_H,
                zIndex:   t.zIndex,
                originX:  0.5,
                originY:  0.5,
              }}
              transition={spring}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: -160, right: 160 }}
              dragElastic={0.15}
              onDragEnd={isActive ? onDragEnd : undefined}
              whileDrag={!shouldReduceMotion ? { scale: 1.03 } : undefined}
              className={
                isActive
                  ? "cursor-grab active:cursor-grabbing"
                  : "pointer-events-none"
              }
            >
              {card.content}
            </motion.div>
          );
        })}
      </div>

      {/* ── MOBILE centred stack ────────────────────────────────── */}
      <div className="md:hidden relative w-[88vw] max-w-[320px] h-[300px]">
        {cards.map((card, i) => {
          const pos      = (i - active + n) % n;
          const t        = MOBILE[Math.min(pos, MOBILE.length - 1)];
          const isActive = pos === 0;

          return (
            <motion.div
              key={card.id}
              animate={{
                x:       t.x,
                y:       t.y,
                rotate:  t.rotate,
                scale:   t.scale,
                opacity: t.opacity,
              }}
              style={{ position: "absolute", inset: 0, zIndex: t.zIndex }}
              transition={spring}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: -120, right: 120 }}
              dragElastic={0.18}
              onDragEnd={isActive ? onDragEnd : undefined}
              whileDrag={!shouldReduceMotion ? { scale: 1.02 } : undefined}
              className={
                isActive
                  ? "cursor-grab active:cursor-grabbing"
                  : "pointer-events-none"
              }
            >
              {card.content}
            </motion.div>
          );
        })}
      </div>

      {/* ── Navigation dots ─────────────────────────────────────── */}
      <div
        className="flex items-center justify-center gap-[7px] mt-8"
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
                : "w-[5px] h-[5px] bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

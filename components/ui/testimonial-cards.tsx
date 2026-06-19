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

type StackEntry = {
  scale: number;
  rotate: number;
  x: number;
  y: number;
  opacity: number;
  zIndex: number;
};

type HoverDelta = { x: number; y: number };

/*
  Dribbble-inspired symmetric fan stack:
  — Card 0  front, clean upright
  — Card 1  right-lean  (+7°, shifted right/down)
  — Card 2  left-lean   (−8°, shifted left/down)
  — Card 3  deep center (+2°, offset behind both)
  — Card 4  hidden      (opacity 0, waiting in the queue)

  transformOrigin: "center center" → cards spread like a shuffled deck
*/
const STACK_DESKTOP: StackEntry[] = [
  { scale: 1,    rotate:  0,  x:   0, y:  0,  opacity: 1,    zIndex: 50 },
  { scale: 0.96, rotate:  7,  x:  26, y: 18,  opacity: 0.90, zIndex: 40 },
  { scale: 0.93, rotate: -8,  x: -22, y: 22,  opacity: 0.78, zIndex: 30 },
  { scale: 0.90, rotate:  2,  x:   6, y: 34,  opacity: 0.50, zIndex: 20 },
  { scale: 0.87, rotate:  0,  x:   0, y: 44,  opacity: 0,    zIndex:  0 },
];

/* On hover each card fans outward for a satisfying depth reveal */
const HOVER_DESKTOP: HoverDelta[] = [
  { x:   0, y: -10 }, // front lifts
  { x:  14, y:   4 }, // right fans further right
  { x: -14, y:   4 }, // left fans further left
  { x:   0, y:  12 }, // deep center sinks
  { x:   0, y:   0 }, // hidden — no change
];

/*
  Mobile: very subtle so no card escapes the viewport.
  2–3 visible cards; back cards just peek as shadows.
*/
const STACK_MOBILE: StackEntry[] = [
  { scale: 1,    rotate:  0,  x:  0, y:  0,  opacity: 1,    zIndex: 50 },
  { scale: 0.97, rotate:  4,  x:  8, y:  8,  opacity: 0.72, zIndex: 40 },
  { scale: 0.94, rotate: -4,  x: -8, y: 13,  opacity: 0.48, zIndex: 30 },
  { scale: 0.91, rotate:  0,  x:  0, y: 18,  opacity: 0,    zIndex:  0 },
];

export function TestimonialCards({
  cards,
  autoRotateInterval = 5000,
  className = "",
}: Props) {
  const [active, setActive]       = useState(0);
  const [isMobile, setIsMobile]   = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion        = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = cards.length;

  /* Sync breakpoint with Tailwind md = 768px */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const STACK = isMobile ? STACK_MOBILE : STACK_DESKTOP;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setActive((prev) => (prev + 1) % n),
      autoRotateInterval
    );
  }, [n, autoRotateInterval]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const swipedFar  = Math.abs(info.offset.x) > 70;
      const swipedFast = Math.abs(info.velocity.x) > 350;
      if (swipedFar || swipedFast) {
        const next =
          info.offset.x < 0
            ? (active + 1) % n
            : (active - 1 + n) % n;
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
    : { type: "spring" as const, stiffness: 280, damping: 30 };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/*
        Container dimensions:
          Mobile  — 86vw, capped at 320px, 300px tall
          Desktop — 420px wide, 320px tall
        perspective gives 3-D depth to the fanned rotation.
      */}
      <div
        className="relative w-[86vw] max-w-[320px] md:w-[420px] md:max-w-none h-[300px] md:h-[320px]"
        style={{ perspective: "1100px" }}
        onMouseEnter={() => !shouldReduceMotion && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {cards.map((card, i) => {
          const pos      = (i - active + n) % n;
          const t        = STACK[Math.min(pos, STACK.length - 1)];
          const h        = HOVER_DESKTOP[Math.min(pos, HOVER_DESKTOP.length - 1)];
          const isActive = pos === 0;
          const hx       = isHovered && !isMobile ? h.x : 0;
          const hy       = isHovered && !isMobile ? h.y : 0;

          return (
            <motion.div
              key={card.id}
              animate={{
                scale:   t.scale,
                rotate:  t.rotate,
                x:       t.x + hx,
                y:       t.y + hy,
                opacity: t.opacity,
              }}
              transition={spring}
              style={{
                position:        "absolute",
                inset:           0,
                zIndex:          t.zIndex,
                transformOrigin: "center center",
              }}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: -180, right: 180 }}
              dragElastic={0.18}
              onDragEnd={isActive ? onDragEnd : undefined}
              whileDrag={shouldReduceMotion ? undefined : { scale: 1.02 }}
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

      {/* Navigation dots — always centered */}
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

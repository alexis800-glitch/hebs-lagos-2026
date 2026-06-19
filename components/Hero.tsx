"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useMounted } from "@/hooks/useMounted";

const CountdownTimer = dynamic(() => import("./CountdownTimer"), { ssr: false });

const EASE = [0.25, 0.4, 0.25, 1] as const;
const EXPO = [0.16, 1, 0.3, 1] as const;

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: ((i * 7.3 + (i % 5) * 12.7) % 86) + 7,
  y: ((i * 6.1 + (i % 4) * 15.3) % 76) + 12,
  size: 1 + (i % 3) * 0.6,
  duration: 16 + (i % 7) * 3,
  delay: i * 1.1,
  opacity: 0.07 + (i % 5) * 0.03,
  color: ["#f59e0b", "#e91e8c", "#9b59b6", "#ffffff", "#f59e0b"][i % 5],
}));

const CATEGORIES = [
  { label: "Hair",        dot: "#f59e0b" },
  { label: "Beauty",      dot: "#e91e8c" },
  { label: "Barbering",   dot: "#9b59b6" },
  { label: "Nails",       dot: "#f59e0b" },
  { label: "Makeup",      dot: "#e91e8c" },
  { label: "Education",   dot: "#9b59b6" },
  { label: "Competition", dot: "#f59e0b" },
  { label: "Culture",     dot: "#e91e8c" },
] as const;

const VALUE_ITEMS = [
  { value: "$85,000",    label: "Prize Pool"             },
  { value: "5",          label: "Competition Categories" },
  { value: "Global",     label: "Beauty Professionals"   },
  { value: "Lagos 2026", label: "October 23–25"          },
] as const;

const FLOAT_CARDS = [
  {
    id: "competition",
    src: "/images/hebs-2025/competition/competition-barbering.png",
    alt: "Live Competition",
    label: "Competition",
    pos: { top: "12%", right: "2.5%" } as React.CSSProperties,
    floatDelay: 0,
  },
  {
    id: "education",
    src: "/images/hebs-2025/competition/competition-education.png",
    alt: "Education Panel",
    label: "Education",
    pos: { top: "56%", left: "2%" } as React.CSSProperties,
    floatDelay: 1.8,
  },
  {
    id: "crowd",
    src: "/images/hebs-2025/crowd/crowd-audience.png",
    alt: "HEBS Live Audience",
    label: "Live Event",
    pos: { bottom: "16%", right: "2.5%" } as React.CSSProperties,
    floatDelay: 3.2,
  },
] as const;

import type React from "react";

export default function Hero() {
  const mounted = useMounted();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="relative w-full min-h-screen bg-zinc-950 overflow-hidden"
    >

      {/* ── Background layer ───────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">

        {/* Fallback image — mobile always, desktop when reduced-motion */}
        <div className="absolute inset-0 md:hidden hero-fallback">
          <Image
            src="/images/hebs-2025/crowd/crowd-main-stage.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
        </div>

        {/* HEBS promo video — no JS gate; shown md+ via CSS only */}
        <video
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="hero-video hidden md:block absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src="/videos/hebs-promo-compressed.mp4" type="video/mp4" />
        </video>

        {/* Reduced-motion: swap video for fallback image on desktop too */}
        <style>{`
          @media (prefers-reduced-motion: reduce) {
            .hero-video { display: none !important; }
            .hero-fallback { display: block !important; }
          }
        `}</style>

        {/* Magenta centre glow */}
        <motion.div
          className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(233,30,140,0.10) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={!shouldReduceMotion ? { opacity: [0.5, 0.9, 0.5] } : {}}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Purple right glow */}
        <motion.div
          className="absolute bottom-[20%] right-[8%] w-[500px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(155,89,182,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={!shouldReduceMotion ? { opacity: [0.4, 0.8, 0.4] } : {}}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        />
        {/* Gold top-right glow */}
        <motion.div
          className="absolute top-[12%] right-[12%] w-[380px] h-[260px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={!shouldReduceMotion ? { opacity: [0.3, 0.7, 0.3] } : {}}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        {/* Purple top-left glow */}
        <motion.div
          className="absolute top-[20%] left-[5%] w-[300px] h-[200px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(155,89,182,0.07) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={!shouldReduceMotion ? { opacity: [0.3, 0.6, 0.3] } : {}}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Overlay — top/bottom darkened, centre open so video is visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      </div>

      {/* ── Particles ─────────────────────────────────────────────── */}
      {mounted && !shouldReduceMotion && (
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {PARTICLES.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
              }}
              animate={{ opacity: [0, p.opacity, 0] }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* ── Top accent border ──────────────────────────────────────── */}
      <div className="absolute top-[80px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-700/70 to-transparent z-[2]" />

      {/* ── Floating image cards — xl desktop only, no reduced motion ─ */}
      {mounted && !shouldReduceMotion && (
        <div className="hidden xl:block absolute inset-0 z-[3] pointer-events-none">
          {FLOAT_CARDS.map((card) => (
            <motion.div
              key={card.id}
              className="absolute w-[152px] h-[108px] rounded-2xl overflow-hidden"
              style={{
                ...card.pos,
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow:
                  "0 24px 64px rgba(0,0,0,0.80), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0, 0, 0.82, 0.78, 0.82],
                y: [0, 0, -5, 0, -5],
              }}
              transition={{
                duration: 10 + card.floatDelay * 1.5,
                times: [0, 0.12, 0.25, 0.625, 1],
                repeat: Infinity,
                delay: card.floatDelay,
                ease: "easeInOut",
              }}
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                sizes="152px"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <span className="absolute bottom-[7px] left-[9px] font-mono text-[8px] uppercase tracking-widest text-white/60">
                {card.label}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Main content ───────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center text-center min-h-screen justify-center pt-28 pb-16 sm:pt-32 sm:pb-20">

        {/* Prize badge */}
        <motion.div
          initial={mounted ? { opacity: 0, y: -12, scale: 0.94 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: EXPO }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-amber-400 bg-amber-500/[0.07] border border-amber-500/20 px-5 py-2.5 rounded-full">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            <span className="sm:hidden">$85,000 USD Prize Pool</span>
            <span className="hidden sm:inline">$85,000 USD (₦119,000,000) Grand Prize Pool</span>
          </span>
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-zinc-500 mb-6"
        >
          The Hair Education Beauty Summit · Lagos 2026
        </motion.p>

        {/* ── Headline ───────────────────────────────────────────────── */}
        <div className="relative mb-6 max-w-4xl">
          {/* Cycling brand glow behind the headline */}
          <div className="absolute -inset-x-10 -inset-y-6 -z-10 pointer-events-none">
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(245,158,11,0.18) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
              initial={{ opacity: 0 }}
              animate={!shouldReduceMotion ? { opacity: [0, 1, 0] } : {}}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 9, delay: 1.5, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(233,30,140,0.18) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
              initial={{ opacity: 0 }}
              animate={!shouldReduceMotion ? { opacity: [0, 1, 0] } : {}}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 9, delay: 5.5, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(155,89,182,0.18) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
              initial={{ opacity: 0 }}
              animate={!shouldReduceMotion ? { opacity: [0, 1, 0] } : {}}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 9, delay: 9.5, ease: "easeInOut" }}
            />
          </div>

          <motion.h1
            initial={mounted ? { opacity: 0, y: 28 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EXPO, delay: 0.18 }}
            className="font-serif font-medium text-[2.35rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-7xl tracking-tight leading-[1.07] text-white"
          >
            The Stage Where{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-[#e91e8c] to-[#9b59b6]">
              Africa&apos;s Finest
            </span>
            <br className="hidden sm:block" />{" "}
            Create History
          </motion.h1>
        </div>

        {/* ── Category chips ─────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-[7px] mb-7 max-w-[500px]">
          {CATEGORIES.map((cat, i) => (
            <motion.span
              key={cat.label}
              initial={mounted ? { opacity: 0, scale: 0.82 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: EXPO, delay: 0.28 + i * 0.055 }}
              className="inline-flex items-center gap-[6px] font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.14em] rounded-full px-[10px] py-[5px] border border-white/[0.09] bg-white/[0.035] text-zinc-400 select-none"
            >
              <span
                className="w-[5px] h-[5px] rounded-full shrink-0"
                style={{
                  backgroundColor: cat.dot,
                  boxShadow: `0 0 5px ${cat.dot}88`,
                }}
              />
              {cat.label}
            </motion.span>
          ))}
        </div>

        {/* Date */}
        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.44 }}
          className="font-mono text-[10px] sm:text-xs tracking-widest uppercase text-zinc-500 mb-7 inline-flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#e91e8c] shrink-0 opacity-80" />
          Lagos, Nigeria &nbsp;·&nbsp; October 23–25, 2026
          <span className="w-1.5 h-1.5 rounded-full bg-[#e91e8c] shrink-0 opacity-80" />
        </motion.p>

        {/* Thin decorative rule */}
        <motion.div
          initial={mounted ? { scaleX: 0, opacity: 0 } : false}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.48 }}
          className="w-20 h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent mb-7 origin-center"
        />

        {/* Countdown */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 14, scale: 0.97 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EXPO, delay: 0.54 }}
          className="mb-8 w-full max-w-sm sm:max-w-md mx-auto"
        >
          <CountdownTimer />
        </motion.div>

        {/* ── CTAs + urgency ─────────────────────────────────────────── */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EXPO, delay: 0.66 }}
          className="flex flex-col items-center gap-3 w-full"
        >
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center justify-center">
            {/* Primary */}
            <motion.a
              href="https://hebseventportal.com/register"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={!shouldReduceMotion ? { scale: 1.03, transition: { type: "spring", stiffness: 380, damping: 22 } } : undefined}
              whileTap={!shouldReduceMotion ? { scale: 0.97, transition: { type: "spring", stiffness: 420, damping: 26 } } : undefined}
              className="inline-flex items-center justify-center bg-white text-black font-bold text-sm tracking-widest uppercase px-10 py-4 rounded-xl hover:bg-amber-400 transition-colors duration-200 touch-manipulation select-none min-h-[52px] w-full sm:w-auto"
            >
              Register Now ↗
            </motion.a>

            {/* Secondary */}
            <motion.a
              href="#categories"
              whileHover={!shouldReduceMotion ? { scale: 1.03, transition: { type: "spring", stiffness: 380, damping: 22 } } : undefined}
              whileTap={!shouldReduceMotion ? { scale: 0.97, transition: { type: "spring", stiffness: 420, damping: 26 } } : undefined}
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white font-semibold text-sm tracking-wide border border-white/20 px-8 py-4 rounded-xl hover:border-amber-400/50 hover:bg-amber-500/[0.06] transition-all duration-200 touch-manipulation min-h-[52px] w-full sm:w-auto"
            >
              Explore Competitions
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path
                  d="M2.5 7h9M7.5 3.5L11 7l-3.5 3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>
          </div>

          {/* Urgency copy */}
          <p className="font-mono text-[9px] sm:text-[10px] text-zinc-500 tracking-wide leading-loose">
            Limited competition slots available &nbsp;·&nbsp; Lagos, Nigeria &nbsp;·&nbsp; October 23–25, 2026
          </p>
        </motion.div>

        {/* ── Value strip ────────────────────────────────────────────── */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.82 }}
          className="mt-9 w-full max-w-xl"
        >
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            {VALUE_ITEMS.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center px-3 py-[14px]"
                style={{ background: "rgba(13,10,20,0.90)" }}
              >
                <p className="font-serif text-[16px] sm:text-[17px] font-light text-white leading-none mb-1">
                  {item.value}
                </p>
                <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-zinc-500 text-center leading-snug">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent z-[2]" />
    </section>
  );
}

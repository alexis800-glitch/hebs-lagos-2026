"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useMounted } from "@/hooks/useMounted";
import VideoModal from "./VideoModal";

const CountdownTimer = dynamic(() => import("./CountdownTimer"), { ssr: false });

const EASE = [0.25, 0.4, 0.25, 1] as const;
const EXPO = [0.16, 1, 0.3, 1] as const;

// Deterministic positions — no Math.random(), no hydration mismatch
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

export default function Hero() {
  const mounted = useMounted();
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section
      id="home"
      className="relative w-full min-h-screen bg-zinc-950 overflow-hidden"
    >

      {/* ── Background: video + static-position glows (opacity-only animation) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20 brightness-50 contrast-125"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-ink-smoke-blot-on-black-background-20958-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Glows: opacity-only — no scale, no translate, no layout impact */}
        <motion.div
          className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(233,30,140,0.10) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[8%] w-[500px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(155,89,182,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        />
        <motion.div
          className="absolute top-[12%] right-[12%] w-[380px] h-[260px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        <motion.div
          className="absolute top-[20%] left-[5%] w-[300px] h-[200px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(155,89,182,0.07) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>

      {/* ── Particles: opacity-only — no y movement, no scale, no layout impact ── */}
      {mounted && (
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

      {/* Top border */}
      <div className="absolute top-[80px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-700/70 to-transparent z-[2]" />

      {/* ── Main content — no transform wrapper, no parallax ── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center text-center min-h-screen justify-center pt-28 pb-20 sm:pt-32 sm:pb-24">

        {/* Prize badge — fade + lift in (one-shot, settles at y:0) */}
        <motion.div
          initial={mounted ? { opacity: 0, y: -12, scale: 0.94 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: EXPO }}
          className="mb-7"
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
          className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-zinc-500 mb-7"
        >
          The Hair Education Beauty Summit · Lagos 2026
        </motion.p>

        {/* ── Headline: static position, cycling glow behind it ── */}
        <div className="relative mb-7 max-w-4xl">

          {/* Brand-color glow cycles: amber → pink → purple, opacity-only */}
          <div className="absolute -inset-x-10 -inset-y-6 -z-10 pointer-events-none">
            <motion.div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(245,158,11,0.18) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 9, delay: 1.5, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(233,30,140,0.18) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 9, delay: 5.5, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(155,89,182,0.18) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
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

        {/* Subheadline */}
        <motion.p
          initial={mounted ? { opacity: 0, y: 14 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EXPO, delay: 0.3 }}
          className="text-sm sm:text-[15px] text-zinc-400 leading-relaxed mb-6 max-w-lg px-2"
        >
          Hair. Beauty. Barbering. Nails. Makeup. Education. Competition.{" "}
          <span className="text-zinc-300 font-medium">One global stage in Lagos.</span>
        </motion.p>

        {/* Date */}
        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.38 }}
          className="font-mono text-[10px] sm:text-xs tracking-widest uppercase text-zinc-500 mb-10 inline-flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#e91e8c] shrink-0 opacity-80" />
          Lagos, Nigeria &nbsp;·&nbsp; October 23–25, 2026
          <span className="w-1.5 h-1.5 rounded-full bg-[#e91e8c] shrink-0 opacity-80" />
        </motion.p>

        {/* Thin decorative rule — grows from center (one-shot) */}
        <motion.div
          initial={mounted ? { scaleX: 0, opacity: 0 } : false}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.42 }}
          className="w-20 h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent mb-8 origin-center"
        />

        {/* Countdown */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 14, scale: 0.97 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EXPO, delay: 0.5 }}
          className="mb-10 w-full max-w-sm sm:max-w-md mx-auto"
        >
          <CountdownTimer />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EXPO, delay: 0.62 }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center justify-center"
        >
          <motion.a
            href="https://hebseventportal.com/register"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 380, damping: 22 } }}
            whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 420, damping: 26 } }}
            className="inline-flex items-center justify-center bg-white text-black font-bold text-sm tracking-widest uppercase px-10 py-4 rounded-xl hover:bg-amber-400 transition-colors duration-200 touch-manipulation select-none min-h-[52px] w-full sm:w-auto"
          >
            Register Now ↗
          </motion.a>

          {/* Watch Promo Video */}
          <motion.button
            type="button"
            onClick={() => setVideoOpen(true)}
            whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 380, damping: 22 } }}
            whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 420, damping: 26 } }}
            className="inline-flex items-center justify-center gap-2.5 bg-transparent text-white font-semibold text-sm tracking-wide border border-white/20 px-8 py-4 rounded-xl hover:border-amber-400/50 hover:bg-amber-500/[0.06] transition-all duration-200 touch-manipulation min-h-[52px] w-full sm:w-auto"
          >
            {/* Play icon */}
            <span className="flex items-center justify-center w-6 h-6 rounded-full border border-white/30 shrink-0">
              <svg width="8" height="9" viewBox="0 0 8 9" fill="currentColor" aria-hidden="true">
                <path d="M7 4.134a1 1 0 010 1.732L1.75 8.964A1 1 0 010 8.098V.902A1 1 0 011.75.036L7 3.134z" />
              </svg>
            </span>
            Watch Promo Video
          </motion.button>
        </motion.div>

      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent z-[2]" />

      {/* Promo video modal */}
      <VideoModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        src="/videos/hebs-promo-compressed.mp4"
      />
    </section>
  );
}

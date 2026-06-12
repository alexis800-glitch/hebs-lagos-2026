"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useMounted } from "@/hooks/useMounted";
import FadeIn from "./FadeIn";

const CountdownTimer = dynamic(() => import("./CountdownTimer"), { ssr: false });

const EASE = [0.25, 0.4, 0.25, 1] as const;

export default function Hero() {
  const mounted = useMounted();

  return (
    <>
      <section
        id="home"
        className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden bg-black"
      >

      {/* ── Layer 0: Cinematic video background ── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30 brightness-[0.5] contrast-[1.2]"
        >
          {/* Replace with your own video file in /public for production */}
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-ink-smoke-blot-on-black-background-20958-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Cinematic grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
          }}
        />
      </div>

      {/* ── Layer 1: Bottom fade — blends video into sections below ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black z-[1] pointer-events-none" />

      {/* ── Layer 2: Radial depth glows ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-zinc-900/20 blur-[120px] rounded-full pointer-events-none select-none z-[2]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-zinc-800/10 blur-[80px] rounded-full pointer-events-none select-none z-[2]" />

      {/* ── Layer 2: Line work ── */}
      <div className="absolute top-[72px] left-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent pointer-events-none z-[2]" />
      <div className="absolute bottom-0 left-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent pointer-events-none z-[2]" />

      <div className="relative z-10 w-full pointer-events-auto flex flex-col items-center gap-7 max-w-5xl mx-auto pt-24 md:pt-28">

        {/* Prize pool badge */}
        <motion.div
          initial={mounted ? { opacity: 0, y: -8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: mounted ? 0.0 : 0 }}
        >
          <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold text-xs font-mono px-4 py-1.5 rounded-full mb-6 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            $35,000 Grand Prize Pool
          </span>
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: mounted ? 0.1 : 0 }}
          className="text-white font-sans font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-4 block text-center"
        >
          The Hair Education Beauty Summit
        </motion.p>

        {/* Main heading */}
        <motion.h1
          initial={mounted ? { opacity: 0, y: 24 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE, delay: mounted ? 0.2 : 0 }}
          className="text-[25px] sm:text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter sm:tracking-tight text-center leading-[1.3] max-w-5xl mx-auto font-sans text-white flex flex-col items-center justify-center"
        >
          {/* Row 1: Keeps "Where Talent Meets Global" on a single row, scaled to fit perfectly on mobile */}
          <span className="block whitespace-nowrap">
            <span>Where</span>{" "}
            <span>Talent</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#93c5fd] via-[#c084fc] to-[#fca5a5] font-semibold animate-pulse">Meets</span>{" "}
            <span>Global</span>
          </span>

          {/* Row 2: Drops "Stage." down and centers it dead-center underneath Row 1 */}
          <span className="block mt-1 sm:mt-2 text-white font-medium whitespace-nowrap">
            Stage.
          </span>
        </motion.h1>

        {/* Date / location */}
        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: mounted ? 0.32 : 0 }}
          className="text-white font-semibold text-xs sm:text-sm tracking-widest text-center mt-6 block uppercase font-mono"
        >
          Lagos, Nigeria &nbsp;•&nbsp; October 23–25, 2026
        </motion.p>

        {/* Sub-pixel divider */}
        <motion.div
          initial={mounted ? { scaleX: 0, opacity: 0 } : false}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: mounted ? 0.42 : 0 }}
          className="w-full max-w-sm origin-center"
          style={{ height: "1px" }}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </motion.div>

        {/* Countdown */}
        <FadeIn delay={0.1}>
          <motion.div
            initial={mounted ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: mounted ? 0.48 : 0 }}
            className="w-full"
          >
            <CountdownTimer />
          </motion.div>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={0.2}>
          <motion.div
            initial={mounted ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: mounted ? 0.6 : 0 }}
            className="mt-4 mb-16 md:mb-20 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md mx-auto"
          >
            <a
              href="https://hebseventportal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-crisp-primary w-full sm:w-auto text-center font-sans"
            >
              Get Your Tickets
            </a>
            <a href="#competition" className="btn-crisp-secondary w-full sm:w-auto text-center font-sans">
              View Competitions
            </a>
          </motion.div>
        </FadeIn>

      </div>
      </section>
    </>
  );
}

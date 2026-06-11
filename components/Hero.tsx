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
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      style={{ background: "#050505" }}
    >

      {/* Background depth — radial glow behind heading */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-zinc-900/20 blur-[120px] rounded-full pointer-events-none select-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-zinc-800/10 blur-[80px] rounded-full pointer-events-none select-none" />

      {/* Top line work */}
      <div className="absolute top-[72px] left-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent pointer-events-none" />

      {/* Bottom line work */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-7 max-w-5xl mx-auto w-full pt-24 md:pt-28">

        {/* Prize pool badge */}
        <motion.div
          initial={mounted ? { opacity: 0, y: -8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: mounted ? 0.0 : 0 }}
        >
          <span className="inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-800/80 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide text-zinc-300 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0" />
            $35,000 Grand Prize Pool
          </span>
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: mounted ? 0.1 : 0 }}
          className="font-sans text-xs uppercase tracking-widest text-[#D4AF37]"
        >
          The Hair Education Beauty Summit
        </motion.p>

        {/* Main heading */}
        <motion.h1
          initial={mounted ? { opacity: 0, y: 24 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE, delay: mounted ? 0.2 : 0 }}
          className="font-serif font-bold text-white tracking-tight leading-none"
          style={{ fontSize: "clamp(3.6rem, 9vw, 8rem)", lineHeight: 0.93 }}
        >
          Where Talent Meets
          <br />
          <em className="not-italic" style={{ fontStyle: "italic" }}>Global Stage</em>
        </motion.h1>

        {/* Date / location */}
        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: mounted ? 0.32 : 0 }}
          className="font-sans text-xs uppercase tracking-widest text-neutral-400"
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
  );
}

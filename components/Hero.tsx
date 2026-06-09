"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useMounted } from "@/hooks/useMounted";

const CountdownTimer = dynamic(() => import("./CountdownTimer"), { ssr: false });

const EASE = [0.25, 0.4, 0.25, 1] as const;

export default function Hero() {
  const mounted = useMounted();

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "#050505" }}
    >
      <div className="flex flex-col items-center gap-7 max-w-5xl mx-auto w-full">

        {/* Eyebrow */}
        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: mounted ? 0.05 : 0 }}
          className="font-sans text-xs uppercase tracking-widest text-neutral-400"
        >
          The Hair Education Beauty Summit
        </motion.p>

        {/* Main heading */}
        <motion.h1
          initial={mounted ? { opacity: 0, y: 24 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE, delay: mounted ? 0.15 : 0 }}
          className="font-serif font-bold text-white tracking-tight leading-none"
          style={{ fontSize: "clamp(3.6rem, 9vw, 8rem)", lineHeight: 0.93 }}
        >
          Where Talent Meets
          <br />
          <em className="not-italic" style={{ fontStyle: "italic" }}>Global Stage</em>
        </motion.h1>

        {/* Date / location subheader */}
        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: mounted ? 0.3 : 0 }}
          className="font-sans text-xs uppercase tracking-widest text-neutral-400"
        >
          Lagos, Nigeria &nbsp;•&nbsp; October 23–25, 2026
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={mounted ? { scaleX: 0 } : false}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: mounted ? 0.4 : 0 }}
          className="w-16 origin-left"
          style={{ height: "1px", background: "rgba(255,255,255,0.15)" }}
        />

        {/* Countdown */}
        <motion.div
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: mounted ? 0.45 : 0 }}
          className="w-full"
        >
          <CountdownTimer />
        </motion.div>

        {/* Prize label */}
        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: mounted ? 0.55 : 0 }}
          className="font-sans text-xs uppercase tracking-widest"
          style={{ color: "#666" }}
        >
          $35,000 in prizes
        </motion.p>

        {/* CTAs — crisp rectangular, instant invert */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: mounted ? 0.65 : 0 }}
          className="flex flex-col sm:flex-row gap-3 mt-2"
        >
          <a
            href="https://hebseventportal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-crisp-primary"
          >
            Get Your Tickets
          </a>
          <a href="#competition" className="btn-crisp-secondary">
            View Competitions
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={mounted ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: mounted ? 1.1 : 0, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span
          className="font-sans text-[10px] uppercase tracking-[0.22em]"
          style={{ color: "#333" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.12)" }}
        />
      </motion.div>
    </section>
  );
}

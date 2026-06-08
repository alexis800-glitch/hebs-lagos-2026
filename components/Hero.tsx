"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const CountdownTimer = dynamic(() => import("./CountdownTimer"), { ssr: false });

const EASE = [0.25, 0.4, 0.25, 1] as const;

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 text-center"
      style={{ background: "#0d0d0d" }}
    >
      {/* Purple gradient blob top-left */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(155,89,182,0.35) 0%, rgba(155,89,182,0) 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Pink gradient blob bottom-right */}
      <div
        aria-hidden
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(233,30,140,0.3) 0%, rgba(233,30,140,0) 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Purple→pink gradient overlay strip */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(155,89,182,0.12) 0%, rgba(233,30,140,0.08) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-5xl mx-auto">
        {/* Prize badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          <span
            className="inline-block px-5 py-2 rounded-full text-sm font-semibold tracking-wide font-inter"
            style={{
              background: "linear-gradient(135deg, #9b59b6, #e91e8c)",
              color: "#fff",
            }}
          >
            $35,000 in Prizes
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="font-playfair font-bold text-white leading-tight"
          style={{ fontSize: "clamp(2.4rem, 7vw, 5.5rem)" }}
        >
          The Hair Education
          <br />
          <span className="gradient-text italic">Beauty Summit</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
          className="font-inter text-lg md:text-2xl font-medium"
          style={{ color: "#aaaaaa" }}
        >
          Lagos, Nigeria &nbsp;·&nbsp; October 23–25, 2026
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          className="my-4 w-full"
        >
          <CountdownTimer />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 mt-2"
        >
          <a
            href="https://hebseventportal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pink text-base md:text-lg"
          >
            Get Your Tickets
          </a>
          <a
            href="#competition"
            className="btn-outline text-base md:text-lg"
          >
            View Competitions
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest uppercase font-inter" style={{ color: "#555" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8"
          style={{ background: "linear-gradient(to bottom, #9b59b6, transparent)" }}
        />
      </motion.div>
    </section>
  );
}

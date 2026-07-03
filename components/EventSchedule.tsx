"use client";

import { motion } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const DAYS = [
  {
    date: "October 23, 2026",
    title: "Pre Party",
    venue: "NJS Royale Beach Resort",
    time: "2:00 PM – 7:00 PM",
    accent: "#e91e8c",
  },
  {
    date: "October 24, 2026",
    title: "Main Event — Exhibition, Education, Panel Discussion & Competition",
    venue: "NJS Royale Events Center",
    time: "12:00 Noon – 6:00 PM",
    accent: "#f59e0b",
  },
  {
    date: "October 25, 2026",
    title: "Main Event — Exhibition, Education, Panel Discussion & Competition",
    venue: "NJS Royale Events Center",
    time: "11:00 AM – 5:00 PM",
    accent: "#9b59b6",
  },
] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function EventSchedule() {
  const mounted = useMounted();

  return (
    <section id="schedule" className="py-14 md:py-20 px-5 sm:px-8 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-9 md:mb-12">
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-amber-400 font-medium mb-3">
            Schedule at a Glance
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
            Dates <span className="italic font-medium">&amp;</span> Times
          </h2>
        </div>

        {/* Day cards */}
        <motion.div
          variants={container}
          initial={mounted ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
        >
          {DAYS.map((d) => (
            <motion.div
              key={d.date}
              variants={card}
              className="relative rounded-2xl p-6 sm:p-7 bg-zinc-950/80 border border-white/10 overflow-hidden flex flex-col"
              style={{ boxShadow: `0 0 0 1px ${d.accent}22, 0 20px 48px -20px ${d.accent}30` }}
            >
              {/* Accent top bar */}
              <span
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: `linear-gradient(90deg, transparent, ${d.accent}, transparent)` }}
              />

              <p
                className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold mb-3"
                style={{ color: d.accent }}
              >
                {d.date}
              </p>

              <p className="font-serif text-lg sm:text-xl font-semibold text-white tracking-tight leading-snug mb-2">
                {d.title}
              </p>

              <p className="font-sans text-sm font-semibold text-zinc-100 mb-4">{d.venue}</p>

              {/* Bold, high-visibility time */}
              <p className="text-2xl sm:text-[1.7rem] font-bold text-white tracking-tight leading-tight tabular-nums mt-auto">
                {d.time}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

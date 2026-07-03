"use client";

import { motion } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const DAYS = [
  {
    tag: "Oct 23 · Pre-Party",
    date: "Friday, October 23, 2026",
    time: "2:00 PM – 7:00 PM",
    venue: "NJS Royale Beach Resort",
    detail: "Exclusive pre-party celebration, live entertainment & networking.",
    accent: "#e91e8c",
  },
  {
    tag: "Oct 24 · Main Event — Day 1",
    date: "Saturday, October 24, 2026",
    time: "12:00 Noon – 6:00 PM",
    venue: "NJS Royale Events Center",
    detail: "Exhibition · Education · Panel Discussion · Competition",
    accent: "#f59e0b",
  },
  {
    tag: "Oct 25 · Main Event — Day 2",
    date: "Sunday, October 25, 2026",
    time: "11:00 AM – 5:00 PM",
    venue: "NJS Royale Events Center",
    detail: "Exhibition · Education · Panel Discussion · Competition",
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
              key={d.tag}
              variants={card}
              className="relative rounded-2xl p-6 sm:p-7 bg-zinc-950/80 border border-white/10 overflow-hidden"
              style={{ boxShadow: `0 0 0 1px ${d.accent}22, 0 20px 48px -20px ${d.accent}30` }}
            >
              {/* Accent top bar */}
              <span
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: `linear-gradient(90deg, transparent, ${d.accent}, transparent)` }}
              />

              <p
                className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold mb-3"
                style={{ color: d.accent }}
              >
                {d.tag}
              </p>

              <p className="font-serif text-lg sm:text-xl font-semibold text-white tracking-tight mb-1.5">
                {d.date}
              </p>

              {/* Bold, high-visibility time */}
              <p className="text-2xl sm:text-[1.7rem] font-bold text-white tracking-tight leading-tight mb-4 tabular-nums">
                {d.time}
              </p>

              <p className="font-sans text-sm font-semibold text-zinc-100 mb-1.5">{d.venue}</p>
              <p className="font-sans text-xs sm:text-[13px] text-zinc-400 leading-relaxed">{d.detail}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";
import { scheduleByDay } from "@/lib/competitions";

const EASE = [0.25, 0.4, 0.25, 1] as const;

// Competition line-ups are derived from the shared source so the homepage can never
// disagree with the competitions page. Times and durations come with them.
const SCHEDULE = scheduleByDay();
const dayEntries = (isoDate: string) =>
  SCHEDULE.find((d) => d.isoDate === isoDate)?.rows.map(
    (r) => `${r.competition.name.replace(" Competition", "")} · ${r.session.time}`,
  ) ?? [];

const DAYS = [
  {
    date: "October 23, 2026",
    title: "HEBS Welcome Beach Pre-Party",
    venue: "NJS Royale Beach Resort",
    time: "2:00 PM – 7:00 PM",
    accent: "#e91e8c",
    desc: "An exclusive networking experience bringing together international delegates, sponsors, exhibitors, educators, media, influencers, and industry leaders in a luxury beachfront setting.",
    highlights: null as readonly string[] | null,
  },
  {
    date: "October 24, 2026",
    title: "HEBS Main Summit — Day One",
    venue: "NJS Royale Events Center",
    time: "11:00 AM – 6:00 PM",
    accent: "#f59e0b",
    desc: null,
    highlights: dayEntries("2026-10-24"),
  },
  {
    date: "October 25, 2026",
    title: "HEBS Main Summit — Day Two",
    venue: "NJS Royale Events Center",
    time: "10:00 AM – 5:00 PM",
    accent: "#9b59b6",
    desc: null,
    highlights: dayEntries("2026-10-25"),
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

              {d.desc && (
                <p className="font-sans text-[13px] text-zinc-400 font-light leading-relaxed mb-5">
                  {d.desc}
                </p>
              )}

              {d.highlights && (
                <ul className="grid grid-cols-1 gap-1.5 mb-5">
                  {d.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2.5 font-sans text-[13px] text-zinc-300 font-light">
                      <span
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{ background: d.accent }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              )}

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

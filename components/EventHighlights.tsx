"use client";

import { motion } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const highlights = [
  {
    title: "Luxury Pre-Gala Party",
    desc: "Kick off the summit in style with an exclusive pre-gala celebration featuring live entertainment and networking.",
    index: "01",
  },
  {
    title: "Immersive Masterclasses",
    desc: "Learn cutting-edge techniques from world-class educators across hair, beauty, and fashion disciplines.",
    index: "02",
  },
  {
    title: "Panel Discussions",
    desc: "Gain insight from industry leaders on trends, business growth, and the future of the beauty industry.",
    index: "03",
  },
  {
    title: "Creative Competitions",
    desc: "Compete in high-stakes creative challenges with $35,000 in prizes up for grabs.",
    index: "04",
  },
  {
    title: "Networking",
    desc: "Connect with hundreds of professionals, brands, and collaborators from around the world.",
    index: "05",
  },
  {
    title: "Hands-On Learning",
    desc: "Participate in live demonstrations and interactive workshops to sharpen your skills.",
    index: "06",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export default function EventHighlights() {
  const mounted = useMounted();

  return (
    <section id="highlights" className="py-20 md:py-24 px-5 sm:px-8 md:px-12 bg-[#080808]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="pb-8 mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4 relative">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-zinc-400 mb-3">What to Expect</p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-white tracking-tight">
              Event <span className="italic font-normal">Highlights</span>
            </h2>
          </div>
          <p className="font-sans text-sm text-zinc-200 max-w-xs leading-relaxed">
            Three days of immersive education, fierce competition, and global connection.
          </p>
        </div>

        {/* Bento grid */}
        <motion.div
          variants={container}
          initial={mounted ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {highlights.map((h) => (
            <motion.div
              key={h.title}
              variants={card}
              className="group bg-zinc-950/40 border border-white/10 hover:border-white/20 rounded-2xl p-6 flex flex-col gap-3 transition-colors duration-300 min-h-[160px]"
            >
              <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">{h.index}</span>
              <h3 className="text-white font-semibold text-lg tracking-tight leading-snug group-hover:text-zinc-200 transition-colors duration-200">
                {h.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                {h.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

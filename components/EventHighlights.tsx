"use client";

import { motion } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const highlights = [
  {
    title: "Luxury Pre-Gala Party",
    desc: "Kick off the summit in style with an exclusive pre-gala celebration featuring live entertainment and networking.",
  },
  {
    title: "Immersive Masterclasses",
    desc: "Learn cutting-edge techniques from world-class educators across hair, beauty, and fashion disciplines.",
  },
  {
    title: "Panel Discussions",
    desc: "Gain insight from industry leaders on trends, business growth, and the future of the beauty industry.",
  },
  {
    title: "Creative Competitions",
    desc: "Compete in high-stakes creative challenges with $35,000 in prizes up for grabs.",
  },
  {
    title: "Networking",
    desc: "Connect with hundreds of professionals, brands, and collaborators from around the world.",
  },
  {
    title: "Hands-On Learning",
    desc: "Participate in live demonstrations and interactive workshops to sharpen your skills.",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const row = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function EventHighlights() {
  const mounted = useMounted();

  return (
    <section id="highlights" className="py-16 md:py-20 px-4 bg-[#080808]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="pb-8 mb-10 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 relative">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mb-3">What to Expect</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight">
              Event <span className="italic font-normal">Highlights</span>
            </h2>
          </div>
          <p className="font-sans text-sm text-neutral-400 max-w-xs font-light leading-relaxed md:text-left">
            Three days of immersive education, fierce competition, and global connection.
          </p>
        </div>

        {/* Flat linear panel list */}
        <motion.div
          variants={container}
          initial={mounted ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {highlights.map((h, index) => (
            <motion.div
              key={h.title}
              variants={row}
              className="group flex flex-col md:flex-row md:items-start gap-4 md:gap-12 border-b border-white/10 py-8"
            >
              {/* Serial index */}
              <span className="font-sans text-[10px] uppercase tracking-widest text-neutral-700 md:w-20 shrink-0 pt-1">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-serif text-xl font-light text-white group-hover:text-neutral-300 transition-colors duration-200 mb-2 uppercase tracking-wide">
                  {h.title}
                </h3>
                <p className="font-sans text-sm md:text-base font-light text-neutral-400 leading-relaxed">
                  {h.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

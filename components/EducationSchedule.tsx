"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";
import ImageLightbox from "./ImageLightbox";

const EASE = [0.25, 0.4, 0.25, 1] as const;

// The flyer artwork is the source of truth for the education programme, so the
// session details are not re-typed as HTML. Both flyers are 2160 × 2700 (4:5).
const FLYERS = [
  {
    date: "Saturday, October 24, 2026",
    src: "/images/education/hebs-lagos-2026-education-day-1.png",
    alt: "HEBS Lagos 2026 Education Schedule — Saturday October 24, 2026",
    accent: "#f59e0b",
  },
  {
    date: "Sunday, October 25, 2026",
    src: "/images/education/hebs-lagos-2026-education-day-2.png",
    alt: "HEBS Lagos 2026 Education Schedule — Sunday October 25, 2026",
    accent: "#9b59b6",
  },
] as const;

const LIGHTBOX_IMAGES = FLYERS.map(({ src, alt }) => ({ src, alt }));

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function EducationSchedule() {
  const mounted = useMounted();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section id="education" className="py-14 md:py-20 px-5 sm:px-8 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-9 md:mb-12">
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-amber-400 font-medium mb-3">
            Learn from the Best
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
            Education Schedule
          </h2>
          <p className="font-sans text-sm sm:text-base text-zinc-400 font-light leading-relaxed mt-4 max-w-xl mx-auto">
            Explore the HEBS Lagos 2026 education programme across both event days.
          </p>
        </div>

        {/* Day flyers — stacked on mobile, side by side from md */}
        <motion.div
          variants={container}
          initial={mounted ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 max-w-xl md:max-w-none mx-auto"
        >
          {FLYERS.map((f, i) => (
            <motion.div key={f.src} variants={card} className="flex flex-col">
              <h3
                className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold mb-4 text-center"
                style={{ color: f.accent }}
              >
                {f.date}
              </h3>

              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                aria-label={`Enlarge ${f.alt}`}
                className="group relative block w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                style={{ boxShadow: `0 0 0 1px ${f.accent}22, 0 20px 48px -20px ${f.accent}30` }}
              >
                <Image
                  src={f.src}
                  alt={f.alt}
                  width={2160}
                  height={2700}
                  loading="lazy"
                  sizes="(max-width: 767px) min(100vw, 576px), (max-width: 1151px) 50vw, 560px"
                  className="block w-full h-auto"
                />
                {/* Expand icon */}
                <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </span>
              </button>
            </motion.div>
          ))}
        </motion.div>

        <p className="font-sans text-xs text-zinc-500 text-center mt-8">
          Tap a flyer to view it full size.
        </p>
      </div>

      {/* Lightbox — fixed, outside content flow */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <ImageLightbox
            images={LIGHTBOX_IMAGES}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ZoomIn } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const placeholders = [
  { aspect: "portrait",  label: "Opening Night Gala" },
  { aspect: "landscape", label: "Masterclass Stage" },
  { aspect: "landscape", label: "Competition Floor" },
  { aspect: "portrait",  label: "Award Ceremony" },
  { aspect: "landscape", label: "Networking Lounge" },
  { aspect: "portrait",  label: "Beauty Showcase" },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: EASE } },
};

export default function Gallery() {
  const mounted = useMounted();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      <section id="gallery" className="py-24 px-4" style={{ background: "#080808" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={mounted ? { opacity: 0, y: 30 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-center mb-16"
          >
            <p
              className="text-sm font-semibold uppercase tracking-[0.2em] mb-4 font-inter"
              style={{ color: "#e91e8c" }}
            >
              Gallery
            </p>
            <h2 className="section-title text-white mb-4">Relive the Magic</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Photos from HEBS 2024 &amp; 2025 — click any photo to expand
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial={mounted ? "hidden" : false}
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {placeholders.map((p, i) => (
              <motion.button
                key={i}
                variants={item}
                onClick={() => setSelected(i)}
                className="relative rounded-2xl overflow-hidden flex items-center justify-center group cursor-pointer"
                style={{
                  aspectRatio: p.aspect === "portrait" ? "3/4" : "4/3",
                  background:
                    i % 2 === 0
                      ? "linear-gradient(135deg, rgba(155,89,182,0.18), rgba(22,22,22,0.85))"
                      : "linear-gradient(135deg, rgba(233,30,140,0.12), rgba(22,22,22,0.85))",
                  border: "1px solid rgba(155,89,182,0.15)",
                }}
                whileHover={{ scale: 1.02, transition: { duration: 0.22 } }}
              >
                <div className="flex flex-col items-center gap-3 relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
                  <Camera size={26} style={{ color: "rgba(155,89,182,0.55)" }} />
                  <span
                    className="text-xs uppercase tracking-widest font-inter px-3 text-center"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    {p.label}
                  </span>
                </div>
                {/* Hover zoom hint */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: "rgba(0,0,0,0.35)" }}
                >
                  <ZoomIn size={28} style={{ color: "rgba(255,255,255,0.7)" }} />
                </div>
                {/* Bottom gradient */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(13,13,13,0.55) 0%, transparent 50%)",
                  }}
                />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.93)", backdropFilter: "blur(12px)" }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col items-center justify-center"
              style={{
                aspectRatio:
                  placeholders[selected].aspect === "portrait" ? "3/4" : "16/9",
                maxHeight: "85vh",
                background:
                  selected % 2 === 0
                    ? "linear-gradient(135deg, rgba(155,89,182,0.25), rgba(22,22,22,0.95))"
                    : "linear-gradient(135deg, rgba(233,30,140,0.18), rgba(22,22,22,0.95))",
                border: "1px solid rgba(155,89,182,0.25)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center gap-4">
                <Camera size={40} style={{ color: "rgba(155,89,182,0.5)" }} />
                <div className="text-center px-6">
                  <p
                    className="font-playfair font-bold text-xl text-white mb-1"
                  >
                    {placeholders[selected].label}
                  </p>
                  <p
                    className="text-xs uppercase tracking-widest font-inter"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    HEBS 2024 &amp; 2025
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#ffffff",
              }}
              aria-label="Close lightbox"
            >
              <X size={18} />
            </button>

            {/* Caption */}
            <div
              className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-inter uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Click anywhere to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

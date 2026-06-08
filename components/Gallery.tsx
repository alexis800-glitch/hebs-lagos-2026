"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const placeholders = [
  { aspect: "portrait" },
  { aspect: "landscape" },
  { aspect: "landscape" },
  { aspect: "portrait" },
  { aspect: "landscape" },
  { aspect: "portrait" },
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

  return (
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
            Photos from HEBS 2024 &amp; 2025
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
            <motion.div
              key={i}
              variants={item}
              className="relative rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                aspectRatio: p.aspect === "portrait" ? "3/4" : "4/3",
                background:
                  i % 2 === 0
                    ? "linear-gradient(135deg, rgba(155,89,182,0.2), rgba(22,22,22,0.8))"
                    : "linear-gradient(135deg, rgba(233,30,140,0.15), rgba(22,22,22,0.8))",
                border: "1px solid rgba(155,89,182,0.15)",
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
            >
              <div className="flex flex-col items-center gap-3">
                <Camera size={28} style={{ color: "rgba(155,89,182,0.5)" }} />
                <span
                  className="text-xs uppercase tracking-widest font-inter"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  Photo {i + 1}
                </span>
              </div>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, rgba(13,13,13,0.6) 0%, transparent 50%)",
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

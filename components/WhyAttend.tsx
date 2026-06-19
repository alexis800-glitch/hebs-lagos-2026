"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useMounted } from "@/hooks/useMounted";
import ImageLightbox from "./ImageLightbox";

const EXPO = [0.16, 1, 0.3, 1] as const;

function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 2.4,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setCurrent(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {current.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

interface Feature {
  color: string;
  counter: { value: number; prefix: string; suffix: string; duration: number } | null;
  label: string;
  desc: string;
  featured?: boolean;
  bgImage: string;
  bgPosition?: string;
}

const FEATURES: Feature[] = [
  {
    color: "#f59e0b",
    counter: { value: 85000, prefix: "$", suffix: "", duration: 2.4 },
    label: "Prize Pool",
    desc: "Compete for one of the largest beauty and barbering prize pools in Africa.",
    featured: true,
    bgImage: "/images/highlights/winner-cheque-presentation.png",
    bgPosition: "object-top",
  },
  {
    color: "#9b59b6",
    counter: { value: 3, prefix: "", suffix: "", duration: 1.2 },
    label: "Days of Education",
    desc: "Three days of live competitions, expert masterclasses, hands-on training, and immersive beauty education.",
    bgImage: "/images/highlights/industry-experts-panel.png",
    bgPosition: "object-center",
  },
  {
    color: "#e91e8c",
    counter: { value: 6, prefix: "", suffix: "", duration: 1.2 },
    label: "Competition Categories",
    desc: "Hair, Barbering, Nail Art, Makeup, Avant-Garde, and Education — six disciplines on one global stage.",
    bgImage: "/images/hebs-2025/competition/competition-winners-01.png",
    bgPosition: "object-top",
  },
  {
    color: "#f59e0b",
    counter: null,
    label: "Global Industry Exposure",
    desc: "Showcase your talent before international judges, brands, educators, and industry leaders.",
    bgImage: "/images/hero/hero-poster-gala.png",
    bgPosition: "object-center",
  },
];

const LIGHTBOX_IMAGES = FEATURES.map((f) => ({ src: f.bgImage, alt: f.label }));

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EXPO } },
};

export default function WhyAttend() {
  const mounted = useMounted();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section
      id="why-attend"
      className="py-16 md:py-24 px-5 sm:px-8 lg:px-12 bg-[#080808]"
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 22 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EXPO }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-zinc-500 mb-5">
            HEBS Lagos 2026 · Your Opportunity
          </p>
          <h2 className="font-serif font-medium text-4xl sm:text-5xl md:text-[3.25rem] tracking-tight leading-tight text-white mb-6">
            Why Attend{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-[#e91e8c] to-[#9b59b6]">
              HEBS 2026?
            </span>
          </h2>
          <p className="text-zinc-400 text-[15px] leading-relaxed max-w-xl mx-auto">
            More than a competition. A platform for recognition, education,
            networking, and global opportunities.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={container}
          initial={mounted ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              variants={itemAnim}
              whileHover={{
                boxShadow: `0 0 0 1px ${f.color}55, 0 24px 56px -16px ${f.color}35`,
                transition: { duration: 0.18 },
              }}
              onClick={() => setLightboxIndex(i)}
              className={`group relative flex flex-col rounded-2xl border border-white/[0.10] overflow-hidden cursor-pointer ${
                f.featured
                  ? "min-h-[320px] sm:min-h-[380px] p-7 md:p-9"
                  : "min-h-[260px] sm:min-h-[300px] p-6"
              }`}
            >
              {/* Background photo */}
              <Image
                src={f.bgImage}
                alt=""
                fill
                loading="lazy"
                className={`object-cover ${f.bgPosition ?? "object-center"} transition-transform duration-700 group-hover:scale-[1.06]`}
                sizes="(max-width: 640px) 100vw, 50vw"
                aria-hidden="true"
              />

              {/* Gradient overlay — bright at top to show photo, dark at bottom for text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/[0.88] via-black/[0.38] to-black/[0.12]" />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 z-[2]"
                style={{
                  background: `linear-gradient(to right, ${f.color}, ${f.color}00 70%)`,
                }}
              />

              {/* Expand hint — appears on hover */}
              <div className="absolute top-3 right-3 z-[3] w-8 h-8 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </div>

              {/* Card content — pushed to bottom so image shows above */}
              <div className="relative z-[2] flex flex-col flex-1 justify-end">

                {/* Counter stat */}
                {f.counter ? (
                  <div className="mb-4">
                    <p
                      className={`font-serif font-medium leading-none tracking-tight tabular-nums [text-shadow:0_2px_16px_rgba(0,0,0,1)] ${
                        f.featured ? "text-[4.25rem]" : "text-[3.25rem]"
                      }`}
                      style={{ color: f.color }}
                    >
                      <Counter
                        to={f.counter.value}
                        prefix={f.counter.prefix}
                        suffix={f.counter.suffix}
                        duration={f.counter.duration}
                      />
                    </p>
                    <div
                      className="mt-3 mb-2 h-px w-10 rounded-full"
                      style={{ background: `linear-gradient(to right, ${f.color}90, transparent)` }}
                    />
                    <p
                      className="font-mono text-[10px] tracking-[0.22em] uppercase [text-shadow:0_1px_8px_rgba(0,0,0,1)]"
                      style={{ color: `${f.color}cc` }}
                    >
                      {f.label}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <h3 className="font-sans text-white font-semibold text-[17px] leading-snug [text-shadow:0_1px_8px_rgba(0,0,0,1)]">
                      {f.label}
                    </h3>
                    <div
                      className="mt-3 h-px w-10 rounded-full"
                      style={{ background: `linear-gradient(to right, ${f.color}90, transparent)` }}
                    />
                  </div>
                )}

                {/* Description */}
                <p className="text-zinc-200 text-sm leading-relaxed [text-shadow:0_1px_6px_rgba(0,0,0,1)]">
                  {f.desc}
                </p>

              </div>

              {/* Bottom color glow on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-36 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[1]"
                style={{
                  background: `radial-gradient(ellipse at center bottom, ${f.color}20 0%, transparent 70%)`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={mounted ? { opacity: 0 } : false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EXPO, delay: 0.3 }}
          className="mt-16 flex flex-col items-center gap-3"
        >
          <a
            href="https://hebseventportal.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold tracking-wide text-black bg-white px-8 py-3.5 rounded-xl hover:bg-amber-400 transition-colors duration-200 min-h-[48px]"
          >
            Register for HEBS 2026 ↗
          </a>
          <p className="text-zinc-400 text-xs leading-relaxed text-center">
            Limited competition slots available across all categories.
          </p>
          <p className="font-mono text-[10px] tracking-widest uppercase text-zinc-400">
            October 23–25, 2026 · Lagos, Nigeria
          </p>
        </motion.div>

      </div>

      {/* Lightbox */}
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

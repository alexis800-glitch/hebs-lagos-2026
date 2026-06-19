"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";
import ImageLightbox from "./ImageLightbox";

const ALL_IMAGES = [
  { src: "/images/hebs-2025/categories-winners/winner-barbering.png",   span: "col-span-1 row-span-2" },
  { src: "/images/hebs-2025/competition/competition-hair-styling.png",   span: "col-span-1 row-span-1" },
  { src: "/images/hebs-2025/backstage/backstage-01.png",                 span: "col-span-1 row-span-1" },
  { src: "/images/hebs-2025/crowd/crowd-audience.png",                   span: "col-span-1 row-span-1" },
  { src: "/images/hebs-2025/yacht-party/yacht-01.png",                   span: "col-span-2 row-span-1" },
  { src: "/images/hebs-2025/awards/award-01.png",                        span: "col-span-1 row-span-2" },
  { src: "/images/hebs-2025/competition/competition-barbering.png",       span: "col-span-1 row-span-1" },
  { src: "/images/hebs-2025/awards/award-celebration-01.png",            span: "col-span-1 row-span-1" },
  { src: "/images/hebs-2025/categories-winners/winner-hair-styling.png", span: "col-span-1 row-span-1" },
  { src: "/images/hebs-2025/competition/competition-avant-garde.png",     span: "col-span-1 row-span-1" },
  { src: "/images/hebs-2025/backstage/backstage-02.png",                  span: "col-span-1 row-span-1" },
  { src: "/images/gallery/gallery-event-13.png",                           span: "col-span-1 row-span-2" },
];

const LIGHTBOX_IMAGES = ALL_IMAGES.map((img, i) => ({
  src: img.src,
  alt: `HEBS event photo ${i + 1}`,
}));

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const EASE = [0.25, 0.4, 0.25, 1] as const;

const item = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

export default function GallerySection() {
  const mounted = useMounted();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="py-20 md:py-28 px-5 sm:px-8 md:px-12 bg-black">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-white/[0.06]">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-amber-500 mb-3">From the Stage</p>
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Event Gallery
            </h2>
          </div>
          <p className="font-sans text-sm text-zinc-400 max-w-xs leading-relaxed">
            Moments from previous HEBS editions — the energy, artistry, and excellence.
          </p>
        </div>

        {/* Desktop masonry — all images, click to open lightbox */}
        <motion.div
          variants={container}
          initial={mounted ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="hidden md:grid grid-cols-3 gap-3 auto-rows-[220px]"
        >
          {ALL_IMAGES.map(({ src, span }, i) => (
            <motion.div
              key={src}
              variants={item}
              onClick={() => setLightboxIndex(i)}
              className={`relative overflow-hidden rounded-xl ${span} group cursor-pointer`}
            >
              <Image
                src={src}
                alt={`HEBS event gallery ${i + 1}`}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
              />
              {/* Darken slightly on hover to make expand icon pop */}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/25 transition-colors duration-300" />
              {/* Expand icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile 2-column grid — 6 images preview */}
        <motion.div
          variants={container}
          initial={mounted ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="md:hidden grid grid-cols-2 gap-2.5"
        >
          {ALL_IMAGES.slice(0, 6).map(({ src }, i) => (
            <motion.div
              key={src}
              variants={item}
              onClick={() => setLightboxIndex(i)}
              className="relative h-40 sm:h-52 rounded-xl overflow-hidden group cursor-pointer"
            >
              <Image
                src={src}
                alt={`HEBS event gallery ${i + 1}`}
                fill
                loading="lazy"
                sizes="50vw"
                className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/25 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA — links to full gallery archive */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold tracking-wide text-black bg-white px-7 py-3 rounded-xl hover:bg-amber-400 transition-colors duration-200 min-h-[46px]"
          >
            View Full Gallery ↗
          </Link>
          <p className="font-mono text-[10px] tracking-widest uppercase text-zinc-600">
            HEBS 2025 archive
          </p>
        </div>

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

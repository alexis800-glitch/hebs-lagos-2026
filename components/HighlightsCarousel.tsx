"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ImageLightbox from "./ImageLightbox";

const SLIDES = [
  { src: "/images/hebs-2025/competition/competition-hair-styling.png", caption: "Hair Styling Competition" },
  { src: "/images/hebs-2025/crowd/crowd-audience.png",                 caption: "Event Atmosphere" },
  { src: "/images/hebs-2025/backstage/backstage-01.png",               caption: "Behind The Scenes" },
  { src: "/images/hebs-2025/awards/award-01.png",                      caption: "Awards Ceremony" },
  { src: "/images/hebs-2025/yacht-party/yacht-01.png",                 caption: "Yacht Party" },
];

const LIGHTBOX_IMAGES = SLIDES.map(s => ({ src: s.src, alt: s.caption }));

export default function HighlightsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isPausedRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);

  // Keep isPaused ref up to date (avoids restarting interval on every hover)
  const pauseFor = (active: boolean) => { isPausedRef.current = active; };

  // Pause while lightbox is open
  useEffect(() => { isPausedRef.current = lightboxIndex !== null; }, [lightboxIndex]);

  // Auto-slide — single persistent interval
  useEffect(() => {
    const id = setInterval(() => {
      if (!isPausedRef.current) {
        setActiveIndex(i => (i + 1) % SLIDES.length);
      }
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const prev = () => setActiveIndex(i => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setActiveIndex(i => (i + 1) % SLIDES.length);

  return (
    <div className="mb-12">
      {/* Carousel */}
      <div
        className="relative rounded-2xl overflow-hidden h-[240px] sm:h-[340px] md:h-[400px] cursor-pointer group/car"
        onMouseEnter={() => pauseFor(true)}
        onMouseLeave={() => pauseFor(false)}
        onTouchStart={e => {
          touchStartX.current = e.touches[0].clientX;
          didSwipe.current = false;
        }}
        onTouchEnd={e => {
          if (touchStartX.current === null) return;
          const delta = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(delta) > 48) {
            didSwipe.current = true;
            if (delta > 0) next(); else prev();
          }
          touchStartX.current = null;
        }}
        onClick={() => {
          if (didSwipe.current) { didSwipe.current = false; return; }
          setLightboxIndex(activeIndex);
        }}
      >
        {/* Crossfade slides */}
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <Image
              src={SLIDES[activeIndex].src}
              alt={SLIDES[activeIndex].caption}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Caption */}
        <div className="absolute bottom-4 left-5 z-10 pointer-events-none">
          <span className="font-mono text-[9px] tracking-[0.2em] text-white/55 uppercase">
            {SLIDES[activeIndex].caption}
          </span>
        </div>

        {/* Expand hint */}
        <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/car:opacity-100 transition-opacity duration-200 pointer-events-none">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </div>

        {/* Prev arrow */}
        <button
          aria-label="Previous slide"
          onClick={e => { e.stopPropagation(); prev(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover/car:opacity-100 transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Next arrow */}
        <button
          aria-label="Next slide"
          onClick={e => { e.stopPropagation(); next(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover/car:opacity-100 transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-10">
          <motion.div
            className="h-full bg-amber-400/70"
            animate={{ width: `${((activeIndex + 1) / SLIDES.length) * 100}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "bg-amber-400 w-5 h-1.5"
                : "bg-white/20 hover:bg-white/40 w-1.5 h-1.5"
            }`}
          />
        ))}
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
    </div>
  );
}

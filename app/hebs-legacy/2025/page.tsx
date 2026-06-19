"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, animate, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageLightbox from "@/components/ImageLightbox";

const EXPO = [0.16, 1, 0.3, 1] as const;
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EXPO } },
};

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, prefix = "", suffix = "", duration = 1.8 }: {
  to: number; prefix?: string; suffix?: string; duration?: number;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, to, { duration, ease: "easeOut", onUpdate: v => setVal(Math.round(v)) });
    return () => ctrl.stop();
  }, [inView, to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface WinnerData {
  src?: string;
  name: string;
  origin: string;
  flag: string;
  category: string;
  color: string;
  hasPhoto: boolean;
}

// ── Media constants ───────────────────────────────────────────────────────────
const COMPETITION_SLIDES = [
  { src: "/images/hebs-2025/competition/competition-hair-styling.png", caption: "Hair Styling" },
  { src: "/images/hebs-2025/competition/competition-barbering.png",    caption: "Barbering" },
  { src: "/images/hebs-2025/competition/competition-nail-art.png",     caption: "Nail Art" },
  { src: "/images/hebs-2025/competition/competition-makeup.png",       caption: "Makeup Artistry" },
  { src: "/images/hebs-2025/competition/competition-avant-garde.png",  caption: "Avant-Garde" },
];

const AWARD_IMAGES = [
  { src: "/images/hebs-2025/awards/award-01.png",             alt: "Award ceremony" },
  { src: "/images/hebs-2025/awards/award-celebration-01.png", alt: "Champion celebration" },
  { src: "/images/hebs-2025/awards/award-trophy-02.png",      alt: "Trophy presentation" },
  { src: "/images/hebs-2025/awards/award-trophy-03.png",      alt: "Trophy presentation" },
  { src: "/images/hebs-2025/awards/award-trophy-04.png",      alt: "Trophy presentation" },
];

const BACKSTAGE_IMAGES = [
  { src: "/images/hebs-2025/backstage/backstage-01.png", alt: "Model preparation backstage" },
  { src: "/images/hebs-2025/backstage/backstage-02.png", alt: "Backstage preparation" },
  { src: "/images/hebs-2025/backstage/backstage-03.png", alt: "Backstage team" },
];

const CROWD_IMAGES = [
  { src: "/images/hebs-2025/crowd/crowd-audience.png",   alt: "Event audience" },
  { src: "/images/hebs-2025/crowd/crowd-cheering.png",   alt: "Crowd cheering" },
  { src: "/images/hebs-2025/crowd/crowd-main-stage.png", alt: "Crowd at main stage" },
  { src: "/images/hebs-2025/crowd/crowd-01.jpg",         alt: "Event atmosphere" },
];

const WINNERS: WinnerData[] = [
  {
    src: "/images/hebs-2025/categories-winners/winner-barbering.png",
    name: "Barbering Champion",
    origin: "",
    flag: "",
    category: "Barbering",
    color: "#9b59b6",
    hasPhoto: true,
  },
  {
    src: "/images/hebs-2025/categories-winners/winner-hair-styling.png",
    name: "Hair Styling Champion",
    origin: "",
    flag: "",
    category: "Hair Styling",
    color: "#f59e0b",
    hasPhoto: true,
  },
  {
    src: "/images/hebs-2025/categories-winners/winner-nail-art.png",
    name: "Nail Art Champion",
    origin: "",
    flag: "",
    category: "Nail Art",
    color: "#e91e8c",
    hasPhoto: true,
  },
  {
    src: "/images/hebs-2025/categories-winners/winner-makeup.png",
    name: "Makeup Artistry Champion",
    origin: "",
    flag: "",
    category: "Makeup Artistry",
    color: "#f59e0b",
    hasPhoto: true,
  },
  {
    src: "/images/hebs-2025/categories-winners/winner-avant-garde.png",
    name: "Avant-Garde Champion",
    origin: "",
    flag: "",
    category: "Avant-Garde",
    color: "#9b59b6",
    hasPhoto: true,
  },
  {
    src: "/images/hebs-2025/winners/winner-education-optimized.webp",
    name: "Education Award",
    origin: "",
    flag: "",
    category: "Education",
    color: "#e91e8c",
    hasPhoto: true,
  },
];

// ── Inline carousel ───────────────────────────────────────────────────────────
function InlineCarousel({
  slides,
  onImageClick,
}: {
  slides: { src: string; caption: string }[];
  onImageClick: (i: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const isPausedRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);

  const prev = () => setIdx(i => (i - 1 + slides.length) % slides.length);
  const next = useCallback(() => setIdx(i => (i + 1) % slides.length), [slides.length]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!isPausedRef.current) next();
    }, 4000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div>
      <div
        className="relative rounded-2xl overflow-hidden h-[340px] sm:h-[500px] md:h-[640px] cursor-pointer group/car"
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
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
          onImageClick(idx);
        }}
      >
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
            className="absolute inset-0"
          >
            <Image
              src={slides[idx].src}
              alt={slides[idx].caption}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Caption */}
        <div className="absolute bottom-4 left-5 z-10 pointer-events-none">
          <span className="font-mono text-[9px] tracking-[0.22em] text-white/55 uppercase">{slides[idx].caption}</span>
        </div>

        {/* Expand hint */}
        <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/car:opacity-100 transition-opacity duration-200 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </div>

        {/* Arrows */}
        <button
          aria-label="Previous"
          onClick={e => { e.stopPropagation(); prev(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover/car:opacity-100 transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button
          aria-label="Next"
          onClick={e => { e.stopPropagation(); next(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover/car:opacity-100 transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-10">
          <motion.div
            className="h-full bg-amber-400/70"
            animate={{ width: `${((idx + 1) / slides.length) * 100}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === idx ? "bg-amber-400 w-5 h-1.5" : "bg-white/20 hover:bg-white/40 w-1.5 h-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Video card ────────────────────────────────────────────────────────────────
function VideoCard({ src, title, portrait = false }: { src: string; title: string; portrait?: boolean }) {
  const [open, setOpen] = useState(false);
  const ambientRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Intersection observer to autoplay ambient video when visible
  useEffect(() => {
    const el = ambientRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {});
      else el.pause();
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => modalRef.current?.play(), 100);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EXPO }}
        className={`relative rounded-2xl overflow-hidden cursor-pointer group border border-white/[0.07] ${
          portrait ? "aspect-[9/16] max-w-[300px] mx-auto sm:max-w-none" : "aspect-video"
        }`}
        onClick={handleOpen}
      >
        <video
          ref={ambientRef}
          src={src}
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-400" />

        {/* Premium play button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/25 transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8">
          <p className="text-white font-semibold text-[13px] leading-tight">{title}</p>
          <p className="font-mono text-[9px] tracking-widest text-white/40 uppercase mt-0.5">Tap to watch · HEBS 2025</p>
        </div>
      </motion.div>

      {/* Full-screen modal player */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/97 flex items-center justify-center"
            onClick={() => setOpen(false)}
          >
            <div
              className={`relative ${portrait ? "h-[85vh] max-w-xs w-full" : "w-full max-w-5xl px-4"}`}
              onClick={e => e.stopPropagation()}
            >
              <video
                ref={modalRef}
                src={src}
                controls
                playsInline
                className="w-full h-full rounded-xl bg-black"
                style={portrait ? { height: "85vh", objectFit: "contain" } : {}}
              />
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Hebs2025Page() {
  const [lbImages, setLbImages] = useState<{ src: string; alt: string }[]>([]);
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  const openLb = (images: { src: string; alt: string }[], i: number) => {
    setLbImages(images);
    setLbIndex(i);
  };

  const competitionLbImages = COMPETITION_SLIDES.map(s => ({ src: s.src, alt: s.caption }));
  const awardLbImages = AWARD_IMAGES.map(s => ({ src: s.src, alt: s.alt }));
  const backstageLbImages = BACKSTAGE_IMAGES.map(s => ({ src: s.src, alt: s.alt }));
  const crowdLbImages = CROWD_IMAGES.map(s => ({ src: s.src, alt: s.alt }));

  return (
    <>
      <Navbar />
      <main className="bg-zinc-950 text-white">

        {/* ── HERO ────────────────────────────────────────────────────── */}
        <section className="relative min-h-[85vh] flex items-end pb-16 px-5 sm:px-8 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/hebs-2025/crowd/crowd-01.jpg"
              alt="HEBS 2025 event"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/55 to-zinc-950/15" />
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/40 via-transparent to-zinc-950/40" />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto w-full pt-28">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EXPO }}
            >
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-amber-400/80 mb-5">
                HEBS Legacy · October 2025 · Lagos, Nigeria
              </p>
              <h1 className="font-serif font-medium text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[0.92] text-white mb-6">
                HEBS Lagos
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-[#e91e8c] to-[#9b59b6]">
                  2025
                </span>
              </h1>
              <p className="font-serif text-xl sm:text-2xl text-zinc-300 font-light italic mb-8 max-w-lg leading-relaxed">
                &ldquo;Where Africa&rsquo;s Finest Created History&rdquo;
              </p>

              {/* Quick stats strip */}
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {[
                  { v: "500+", l: "Attendees" },
                  { v: "80+", l: "Competitors" },
                  { v: "18", l: "Countries" },
                  { v: "$68K", l: "Prize Money" },
                ].map(s => (
                  <div key={s.l}>
                    <span className="text-white font-bold text-lg">{s.v}</span>
                    <span className="text-zinc-500 text-xs font-mono tracking-widest uppercase ml-1.5">{s.l}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
            <div className="w-px h-8 bg-white/40 animate-pulse" />
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────────────── */}
        <section className="py-16 px-5 sm:px-8 bg-black border-b border-white/[0.05]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[
                { to: 500, suffix: "+", label: "Industry Professionals", color: "#f59e0b", duration: 1.8 },
                { to: 80, suffix: "+", label: "Competitors", color: "#9b59b6", duration: 1.2 },
                { to: 18, label: "Countries", color: "#e91e8c", duration: 1.2 },
                { to: 6, label: "Competition Categories", color: "#f59e0b", duration: 1.0 },
              ].map(s => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  className="rounded-2xl bg-[#0f0f0f] border border-white/[0.07] p-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: `linear-gradient(to right, ${s.color}, transparent 70%)` }} />
                  <p className="font-serif font-medium text-3xl sm:text-4xl leading-none mb-1" style={{ color: s.color }}>
                    <Counter to={s.to} suffix={s.suffix ?? ""} duration={s.duration} />
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 mt-2">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── COMPETITION HIGHLIGHTS ────────────────────────────────────── */}
        <section className="py-20 px-5 sm:px-8 bg-[#080808]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="mb-10"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-3">From The Competition Floor</p>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-white tracking-tight">
                Competition Highlights
              </h2>
            </motion.div>
            <div className="max-w-[620px] mx-auto">
              <InlineCarousel
                slides={COMPETITION_SLIDES}
                onImageClick={i => openLb(competitionLbImages, i)}
              />
            </div>
          </div>
        </section>

        {/* ── CATEGORY WINNERS ─────────────────────────────────────────── */}
        <section className="py-20 px-5 sm:px-8 bg-zinc-950">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="mb-12"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-3">HEBS 2025 · Champions</p>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-white tracking-tight">Category Winners</h2>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {WINNERS.map(w => (
                <motion.div
                  key={w.name}
                  variants={fadeUp}
                  className="rounded-2xl overflow-hidden border border-white/[0.07] group relative"
                >
                  {w.hasPhoto && w.src ? (
                    /* Photo winner card */
                    <div className="relative h-72 cursor-pointer" onClick={() => openLb([{ src: w.src!, alt: w.name }], 0)}>
                      <Image src={w.src} alt={w.name} fill loading="lazy" className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500" sizes="33vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="font-mono text-[10px] tracking-[0.22em] uppercase mb-1" style={{ color: `${w.color}` }}>{w.category}</p>
                        <h3 className="font-serif text-xl text-white font-medium leading-tight">{w.name}</h3>
                        {w.origin && <p className="text-zinc-400 text-xs mt-0.5">{w.flag} {w.origin}</p>}
                      </div>
                      {/* Accent line */}
                      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, ${w.color}, transparent 70%)` }} />
                    </div>
                  ) : (
                    /* Gradient winner card (no photo) */
                    <div className="relative h-72 bg-[#0f0f0f] flex flex-col justify-between p-6 overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{ background: `radial-gradient(circle at 30% 40%, ${w.color}, transparent 65%)` }}
                      />
                      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, ${w.color}, transparent 70%)` }} />

                      {/* Large letter watermark */}
                      <div className="absolute bottom-0 right-0 font-serif text-[9rem] leading-none font-bold opacity-[0.04] text-white select-none pointer-events-none translate-y-4">
                        {w.name.charAt(0)}
                      </div>

                      <div>
                        <p className="font-mono text-[8px] tracking-[0.22em] uppercase mb-3" style={{ color: w.color }}>{w.category}</p>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border" style={{ borderColor: `${w.color}30`, color: `${w.color}90`, backgroundColor: `${w.color}08` }}>
                          Champion
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif text-2xl text-white font-medium leading-tight mb-1">{w.name}</h3>
                        {w.origin && <p className="text-zinc-500 text-xs">{w.flag} {w.origin}</p>}
                        <div className="mt-4 h-px w-10 rounded-full" style={{ background: `linear-gradient(to right, ${w.color}70, transparent)` }} />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── AWARDS & PRIZE MOMENTS ───────────────────────────────────── */}
        <section className="py-20 px-5 sm:px-8 bg-black">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="mb-10"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-3">Trophy Moments</p>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-white tracking-tight">Awards &amp; Prizes</h2>
            </motion.div>

            {/* Featured award + competition images mosaic */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Large featured award image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EXPO }}
                onClick={() => openLb(awardLbImages, 0)}
                className="relative col-span-2 sm:col-span-1 row-span-2 rounded-2xl overflow-hidden group cursor-pointer"
                style={{ minHeight: "320px" }}
              >
                <Image
                  src="/images/hebs-2025/awards/award-01.png"
                  alt="HEBS 2025 award ceremony"
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="font-mono text-[9px] tracking-widest text-amber-400/80 uppercase">Award Ceremony</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                  </div>
                </div>
              </motion.div>

              {/* Award images */}
              {[AWARD_IMAGES[1], AWARD_IMAGES[2]].map((img, i) => (
                <motion.div
                  key={img.src}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EXPO, delay: i * 0.1 }}
                  onClick={() => openLb(awardLbImages, i + 1)}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer"
                  style={{ aspectRatio: "4/3" }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    sizes="33vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-300" />
                  <span className="absolute bottom-3 left-3 font-mono text-[9px] tracking-widest text-amber-400/60 uppercase">{img.alt}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BACKSTAGE ────────────────────────────────────────────────── */}
        <section className="py-20 px-5 sm:px-8 bg-[#080808]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="mb-10"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-3">Behind The Curtain</p>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-white tracking-tight">Backstage Experience</h2>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {BACKSTAGE_IMAGES.map((img, i) => (
                <motion.div
                  key={img.src}
                  variants={fadeUp}
                  onClick={() => openLb(backstageLbImages, i)}
                  className={`relative rounded-xl overflow-hidden group cursor-pointer ${i === 0 ? "sm:row-span-2" : ""}`}
                  style={{ minHeight: i === 0 ? "400px" : "180px" }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-3 font-mono text-[9px] tracking-widest text-white/50 uppercase">{img.alt}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CROWD & ATMOSPHERE ───────────────────────────────────────── */}
        <section className="py-20 px-5 sm:px-8 bg-zinc-950">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="mb-10"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-3">The Energy</p>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-white tracking-tight">Crowd &amp; Atmosphere</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CROWD_IMAGES.map((img, i) => (
                <motion.div
                  key={img.src}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EXPO, delay: i * 0.12 }}
                  onClick={() => openLb(crowdLbImages, i)}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer"
                  style={{ aspectRatio: "16/10" }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/25 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── YACHT PARTY & NETWORKING ─────────────────────────────────── */}
        <section className="py-20 px-5 sm:px-8 bg-black">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="mb-10"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-3">Exclusive Experience</p>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-white tracking-tight">
                Yacht Party &amp; Industry Networking
              </h2>
              <p className="text-zinc-500 text-sm mt-3 max-w-md leading-relaxed">
                An exclusive evening on the water — where industry leaders connected, celebrated, and created lasting partnerships.
              </p>
            </motion.div>

            {/* Featured large image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              onClick={() => openLb([
                { src: "/images/hebs-2025/yacht-party/yacht-01.png", alt: "Yacht party group photo" },
                { src: "/images/hebs-2025/yacht-party/yacht-02.png", alt: "Yacht party guests" },
                { src: "/images/hebs-2025/yacht-party/yacht-03.jpg", alt: "Yacht party networking" },
                { src: "/images/hebs-2025/yacht-party/yacht-04.png", alt: "Yacht party sunset" },
              ], 0)}
              className="relative rounded-2xl overflow-hidden group cursor-pointer mb-3"
              style={{ aspectRatio: "16/7" }}
            >
              <Image
                src="/images/hebs-2025/yacht-party/yacht-01.png"
                alt="HEBS 2025 Yacht Party"
                fill
                loading="lazy"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-6">
                <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-amber-400/80">Exclusive Evening · HEBS 2025</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                </div>
              </div>
            </motion.div>

            {/* 4-image row */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {[
                { src: "/images/hebs-2025/yacht-party/yacht-02.png", alt: "Yacht party guests",     idx: 1 },
                { src: "/images/hebs-2025/yacht-party/yacht-03.jpg", alt: "Yacht party networking", idx: 2 },
                { src: "/images/hebs-2025/yacht-party/yacht-04.png", alt: "Yacht party sunset",     idx: 3 },
              ].map(img => (
                <motion.div
                  key={img.src}
                  variants={fadeUp}
                  onClick={() => openLb([
                    { src: "/images/hebs-2025/yacht-party/yacht-01.png", alt: "Yacht party group photo" },
                    { src: "/images/hebs-2025/yacht-party/yacht-02.png", alt: "Yacht party guests" },
                    { src: "/images/hebs-2025/yacht-party/yacht-03.jpg", alt: "Yacht party networking" },
                    { src: "/images/hebs-2025/yacht-party/yacht-04.png", alt: "Yacht party sunset" },
                  ], img.idx)}
                  className="relative rounded-xl overflow-hidden group cursor-pointer"
                  style={{ aspectRatio: "4/3" }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    sizes="33vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── VIDEO HIGHLIGHTS ─────────────────────────────────────────── */}
        <section className="py-20 px-5 sm:px-8 bg-black">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="mb-12"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-3">Video Archive</p>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-white tracking-tight">Video Highlights</h2>
              <p className="text-zinc-500 text-sm mt-3 max-w-md">Relive the moments that defined HEBS Lagos 2025.</p>
            </motion.div>

            {/* Landscape stage — full width */}
            <div className="mb-6">
              <VideoCard
                src="/videos/hebs-2025/hebs-2025-stage-short-web.mp4"
                title="Stage Experience — Highlight"
              />
            </div>

            {/* Two portrait videos side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="max-w-[280px] w-full mx-auto">
                <VideoCard
                  src="/videos/hebs-2025/hebs-2025-recap-web.mp4"
                  title="HEBS 2025 Official Recap"
                  portrait
                />
              </div>
              <div className="max-w-[280px] w-full mx-auto">
                <VideoCard
                  src="/videos/hebs-2025/hebs-2025-barber-web.mp4"
                  title="Barber Competition Highlights"
                  portrait
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
        <section className="py-20 px-5 sm:px-8 bg-zinc-950">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="mb-12 text-center"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-3">Voices</p>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-white tracking-tight">What They Said</h2>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-5"
            >
              {[
                {
                  quote: "HEBS 2025 completely transformed my career. The international exposure was unlike anything I had experienced on the African continent.",
                  name: "HEBS 2025 Champion",
                  role: "Barbering Category, HEBS 2025",
                },
                {
                  quote: "The level of talent on that stage was world-class. HEBS is elevating the African beauty industry on a truly global scale.",
                  name: "Industry Leader",
                  role: "International Judge, HEBS 2025",
                },
                {
                  quote: "I came to learn and ended up competing. The education sessions alone were worth every moment of the three days.",
                  name: "HEBS 2025 Competitor",
                  role: "Attendee & Competitor",
                },
              ].map((t, i) => (
                <motion.div key={i} variants={fadeUp} className="rounded-2xl bg-[#0f0f0f] border border-white/[0.07] p-6 flex flex-col">
                  <span className="font-serif text-4xl leading-none text-amber-400/30 mb-4 select-none">&ldquo;</span>
                  <p className="text-zinc-300 text-sm leading-relaxed flex-1 italic">{t.quote}</p>
                  <div className="mt-5 pt-4 border-t border-white/[0.06]">
                    <p className="text-white font-semibold text-[13px]">{t.name}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="py-24 px-5 sm:px-8 text-center bg-black border-t border-white/[0.05]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EXPO }}
          >
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-5">The Journey Continues</p>
            <h2 className="font-serif font-medium text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Be Part of{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-[#e91e8c] to-[#9b59b6]">
                HEBS 2026
              </span>
            </h2>
            <p className="text-zinc-400 text-[15px] mb-10 max-w-md mx-auto">
              October 23–25, 2026 · Lagos, Nigeria · $85,000 Prize Pool
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <a
                href="https://hebseventportal.com/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold tracking-wide text-black bg-white px-8 py-3.5 rounded-xl hover:bg-amber-400 transition-colors duration-200 min-h-[48px]"
              >
                Register for HEBS 2026 ↗
              </a>
              <Link
                href="/hebs-legacy/2024"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white border border-white/[0.1] hover:border-white/30 px-7 py-3.5 rounded-xl transition-all duration-200 min-h-[48px]"
              >
                View HEBS 2024 →
              </Link>
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />

      {/* Global lightbox */}
      <AnimatePresence>
        {lbIndex !== null && (
          <ImageLightbox
            images={lbImages}
            initialIndex={lbIndex}
            onClose={() => setLbIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

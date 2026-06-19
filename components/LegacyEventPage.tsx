"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, animate, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HighlightsCarousel from "@/components/HighlightsCarousel";
import ImageLightbox from "@/components/ImageLightbox";

const EXPO = [0.16, 1, 0.3, 1] as const;

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, prefix = "", suffix = "", duration = 2 }: {
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
  return <span ref={ref}>{prefix}{val.toLocaleString("en-US")}{suffix}</span>;
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Winner {
  category: string;
  name: string;
  origin: string;
  color: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface HighlightImage {
  src: string;
  caption: string;
}

export interface EventStat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  color: string;
}

export interface LegacyEventData {
  year: number;
  heroTagline: string;
  heroSubtitle: string;
  dates: string;
  venue: string;
  heroImage: string;
  overviewText: string;
  stats: EventStat[];
  winners: Winner[];
  competitionHighlights: HighlightImage[];
  testimonials: Testimonial[];
  galleryImages: string[];
  prizeTotal: string;
}

// ── Stagger variants ──────────────────────────────────────────────────────────
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };
const itemUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EXPO } },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function LegacyEventPage({ data }: { data: LegacyEventData }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxImages = data.galleryImages.map((src, i) => ({ src, alt: `HEBS ${data.year} photo ${i + 1}` }));

  return (
    <>
      <Navbar />
      <main className="bg-zinc-950 text-white">

        {/* ── 1. Hero ───────────────────────────────────────────────── */}
        <section className="relative min-h-[70vh] flex items-end pt-28 pb-16 px-5 sm:px-8 lg:px-12 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image src={data.heroImage} alt={`HEBS ${data.year}`} fill className="object-cover" sizes="100vw" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EXPO }}
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-amber-400/80 mb-4">
                HEBS Legacy Archive · {data.year}
              </p>
              <h1 className="font-serif font-medium text-5xl sm:text-6xl md:text-7xl tracking-tight leading-tight text-white mb-4">
                HEBS Lagos{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-[#e91e8c] to-[#9b59b6]">
                  {data.year}
                </span>
              </h1>
              <p className="font-serif text-xl sm:text-2xl text-zinc-300 italic font-light mb-6 max-w-xl">
                &ldquo;{data.heroTagline}&rdquo;
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <span className="font-mono text-[11px] tracking-widest uppercase text-zinc-400">
                  {data.dates}
                </span>
                <span className="text-zinc-700">·</span>
                <span className="font-mono text-[11px] tracking-widest uppercase text-zinc-400">
                  {data.venue}
                </span>
                <span className="text-zinc-700">·</span>
                <span className="font-mono text-[11px] tracking-widest uppercase text-amber-500">
                  {data.prizeTotal} Awarded
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 2. Event Overview ─────────────────────────────────────── */}
        <section className="py-16 px-5 sm:px-8 lg:px-12 border-b border-white/[0.05]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {data.stats.map(s => (
                <motion.div
                  key={s.label}
                  variants={itemUp}
                  className="rounded-2xl bg-[#0f0f0f] border border-white/[0.07] p-6 relative overflow-hidden group"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                    style={{ background: `linear-gradient(to right, ${s.color}, transparent 70%)` }}
                  />
                  <p className="font-serif font-medium text-3xl sm:text-4xl leading-none mb-1" style={{ color: s.color }}>
                    <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 mt-2">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO, delay: 0.4 }}
              className="mt-10 text-zinc-400 text-[15px] leading-relaxed max-w-2xl"
            >
              {data.overviewText}
            </motion.p>
          </div>
        </section>

        {/* ── 3. Highlights Carousel ────────────────────────────────── */}
        <section className="py-20 px-5 sm:px-8 lg:px-12 bg-[#080808]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="mb-10"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-3">
                From The Stage
              </p>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-white tracking-tight">
                Event Highlights
              </h2>
            </motion.div>
            <HighlightsCarousel />
          </div>
        </section>

        {/* ── 4. Winners ────────────────────────────────────────────── */}
        <section className="py-20 px-5 sm:px-8 lg:px-12 bg-zinc-950">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="mb-12"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-3">
                HEBS {data.year} · Champions
              </p>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-white tracking-tight">
                Category Winners
              </h2>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {data.winners.map(w => (
                <motion.div
                  key={w.category}
                  variants={itemUp}
                  className="rounded-2xl bg-[#0f0f0f] border border-white/[0.07] p-6 relative overflow-hidden"
                  style={{ borderLeft: `2px solid ${w.color}45` }}
                >
                  <p className="font-mono text-[9px] tracking-[0.22em] uppercase mb-3" style={{ color: `${w.color}99` }}>
                    {w.category} Champion
                  </p>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-white leading-tight mb-1">
                    {w.name}
                  </h3>
                  <p className="font-sans text-zinc-500 text-xs tracking-wide">{w.origin}</p>
                  <div className="mt-4 h-px w-8 rounded-full" style={{ background: `linear-gradient(to right, ${w.color}80, transparent)` }} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── 5. Competition Highlights (images) ────────────────────── */}
        <section className="py-20 px-5 sm:px-8 lg:px-12 bg-black">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="mb-10"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-3">Moments</p>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-white tracking-tight">
                Competition Highlights
              </h2>
            </motion.div>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {data.competitionHighlights.map((img, i) => (
                <motion.div
                  key={i}
                  variants={itemUp}
                  className="relative rounded-xl overflow-hidden group cursor-pointer"
                  style={{ aspectRatio: i === 0 || i === 3 ? "3/4" : "4/3" }}
                  onClick={() => {
                    const idx = data.galleryImages.findIndex(s => s === img.src);
                    setLightboxIndex(idx >= 0 ? idx : 0);
                  }}
                >
                  <Image src={img.src} alt={img.caption} fill loading="lazy" className="object-cover group-hover:scale-[1.04] transition-transform duration-500" sizes="33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-3 left-3 font-mono text-[9px] tracking-widest text-white/60 uppercase">{img.caption}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── 6. Video Highlights ───────────────────────────────────── */}
        <section className="py-20 px-5 sm:px-8 lg:px-12 bg-[#080808]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="mb-10"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-3">Video Archive</p>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-white tracking-tight">Video Highlights</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EXPO, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* Event recap */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0f0f0f] border border-white/[0.07] flex items-center justify-center group">
                <Image src={data.heroImage} alt="" fill loading="lazy" className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300" sizes="50vw" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 text-center px-6">
                  <div className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center mx-auto mb-4 bg-white/10 backdrop-blur-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-[15px] mb-1">HEBS {data.year} Event Recap</p>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-amber-400/70">Uploading Soon</p>
                </div>
              </div>

              {/* Masterclass teaser */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0f0f0f] border border-white/[0.07] flex items-center justify-center group">
                <Image src="/images/highlights/hands-on-hair-styling-01.png" alt="" fill loading="lazy" className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300" sizes="50vw" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 text-center px-6">
                  <div className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center mx-auto mb-4 bg-white/10 backdrop-blur-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-[15px] mb-1">Masterclass Highlights</p>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-amber-400/70">Uploading Soon</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 7. Testimonials ───────────────────────────────────────── */}
        <section className="py-20 px-5 sm:px-8 lg:px-12 bg-zinc-950">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="mb-12 text-center"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-3">Voices</p>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-white tracking-tight">
                What They Said
              </h2>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-5"
            >
              {data.testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  variants={itemUp}
                  className="rounded-2xl bg-[#0f0f0f] border border-white/[0.07] p-6 flex flex-col"
                >
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

        {/* ── 8. Statistics ─────────────────────────────────────────── */}
        <section className="py-20 px-5 sm:px-8 lg:px-12 bg-black border-y border-white/[0.05]">
          <div className="max-w-5xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-16"
            >
              HEBS {data.year} · By The Numbers
            </motion.p>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-8"
            >
              {data.stats.map(s => (
                <motion.div key={s.label} variants={itemUp} className="flex flex-col items-center">
                  <p className="font-serif font-medium text-4xl sm:text-5xl leading-none mb-2" style={{ color: s.color }}>
                    <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
                  </p>
                  <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-zinc-500">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── 9. Gallery ────────────────────────────────────────────── */}
        <section className="py-20 px-5 sm:px-8 lg:px-12 bg-[#080808]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EXPO }}
              className="mb-10"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-3">Archive</p>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-white tracking-tight">
                HEBS {data.year} Gallery
              </h2>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {data.galleryImages.map((src, i) => (
                <motion.div
                  key={src}
                  variants={itemUp}
                  onClick={() => setLightboxIndex(i)}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                >
                  <Image src={src} alt={`HEBS ${data.year} gallery ${i + 1}`} fill loading="lazy" className="object-cover group-hover:scale-[1.04] transition-transform duration-500" sizes="33vw" />
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

            <div className="mt-10 text-center">
              <Link
                href="/hebs-legacy/media-gallery"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white border border-white/[0.1] hover:border-white/30 px-7 py-3 rounded-xl transition-all duration-200"
              >
                View Full Media Gallery ↗
              </Link>
            </div>
          </div>
        </section>

        {/* ── 10. CTA ───────────────────────────────────────────────── */}
        <section className="py-24 px-5 sm:px-8 text-center bg-zinc-950 border-t border-white/[0.05]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EXPO }}
          >
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-5">
              The Journey Continues
            </p>
            <h2 className="font-serif font-medium text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Be Part of{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-[#e91e8c] to-[#9b59b6]">
                HEBS 2026
              </span>
            </h2>
            <p className="text-zinc-400 text-[15px] mb-10 max-w-md mx-auto">
              The stage is set for the biggest HEBS yet. October 23–25, 2026 · Lagos, Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <a
                href="https://hebseventportal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold tracking-wide text-black bg-white px-8 py-3.5 rounded-xl hover:bg-amber-400 transition-colors duration-200 min-h-[48px]"
              >
                Register for HEBS 2026 ↗
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white border border-white/[0.1] hover:border-white/30 px-7 py-3.5 rounded-xl transition-all duration-200 min-h-[48px]"
              >
                ← Back to HEBS 2026
              </Link>
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <ImageLightbox
            images={lightboxImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

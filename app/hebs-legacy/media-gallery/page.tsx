"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageLightbox from "@/components/ImageLightbox";

const EXPO = [0.16, 1, 0.3, 1] as const;

// ── All media assets — HEBS 2025 real event photos only ───────────────────────
// portrait: true  →  object-top in the square grid (shows subject, not feet)
// portrait absent →  object-center (correct for landscape / group shots)
const PHOTOS = [
  // Competition
  { src: "/images/hebs-2025/competition/competition-hair-styling.png", year: 2025, caption: "Hair Styling Competition",    portrait: true },
  { src: "/images/hebs-2025/competition/competition-barbering.png",    year: 2025, caption: "Barbering Competition" },
  { src: "/images/hebs-2025/competition/competition-nail-art.png",     year: 2025, caption: "Nail Art Competition",        portrait: true },
  { src: "/images/hebs-2025/competition/competition-makeup.png",       year: 2025, caption: "Makeup Artistry Competition" },
  { src: "/images/hebs-2025/competition/competition-avant-garde.png",  year: 2025, caption: "Avant-Garde Competition",     portrait: true },
  // Awards
  { src: "/images/hebs-2025/awards/award-01.png",             year: 2025, caption: "Award Ceremony",       portrait: true },
  { src: "/images/hebs-2025/awards/award-celebration-01.png", year: 2025, caption: "Champion Celebration",  portrait: true },
  { src: "/images/hebs-2025/awards/award-trophy-02.png",      year: 2025, caption: "Trophy Presentation",   portrait: true },
  { src: "/images/hebs-2025/awards/award-trophy-03.png",      year: 2025, caption: "Trophy Presentation",   portrait: true },
  { src: "/images/hebs-2025/awards/award-trophy-04.png",      year: 2025, caption: "Trophy Presentation",   portrait: true },
  // Category Winners
  { src: "/images/hebs-2025/categories-winners/winner-barbering.png",    year: 2025, caption: "Barbering Champion",       portrait: true },
  { src: "/images/hebs-2025/categories-winners/winner-hair-styling.png", year: 2025, caption: "Hair Styling Champion",    portrait: true },
  { src: "/images/hebs-2025/categories-winners/winner-nail-art.png",     year: 2025, caption: "Nail Art Champion",        portrait: true },
  { src: "/images/hebs-2025/categories-winners/winner-makeup.png",       year: 2025, caption: "Makeup Artistry Champion", portrait: true },
  { src: "/images/hebs-2025/categories-winners/winner-avant-garde.png",  year: 2025, caption: "Avant-Garde Champion",    portrait: true },
  { src: "/images/hebs-2025/winners/winner-education-optimized.webp",    year: 2025, caption: "Education Award" },
  // Backstage
  { src: "/images/hebs-2025/backstage/backstage-01.png", year: 2025, caption: "Backstage Preparation", portrait: true },
  { src: "/images/hebs-2025/backstage/backstage-02.png", year: 2025, caption: "Backstage Team",        portrait: true },
  { src: "/images/hebs-2025/backstage/backstage-03.png", year: 2025, caption: "Behind The Scenes",     portrait: true },
  // Crowd
  { src: "/images/hebs-2025/crowd/crowd-audience.png",   year: 2025, caption: "Event Audience",    portrait: true },
  { src: "/images/hebs-2025/crowd/crowd-cheering.png",   year: 2025, caption: "Crowd Cheering",    portrait: true },
  { src: "/images/hebs-2025/crowd/crowd-main-stage.png", year: 2025, caption: "Main Stage Crowd",  portrait: true },
  // Yacht Party
  { src: "/images/hebs-2025/yacht-party/yacht-01.png", year: 2025, caption: "Yacht Party" },
  { src: "/images/hebs-2025/yacht-party/yacht-02.png", year: 2025, caption: "Yacht Party Guests",      portrait: true },
  { src: "/images/hebs-2025/yacht-party/yacht-03.jpg", year: 2025, caption: "Yacht Party Networking",  portrait: true },
  { src: "/images/hebs-2025/yacht-party/yacht-04.png", year: 2025, caption: "Yacht Party Sunset",      portrait: true },
];

type VideoItem =
  | { status: "ready"; title: string; year: number; src: string; portrait?: boolean; archiveNote?: string }
  | { status: "soon"; title: string; year: number; thumb: string };

const VIDEOS: VideoItem[] = [
  { status: "ready", title: "HEBS 2025 Official Recap", year: 2025, src: "/videos/hebs-2025/hebs-2025-recap-web.mp4", portrait: true },
  { status: "ready", title: "Stage Highlights — HEBS 2025", year: 2025, src: "/videos/hebs-2025/hebs-2025-stage-highlights-web.mp4", portrait: true },
  { status: "ready", title: "Awards Night — HEBS 2025", year: 2025, src: "/videos/hebs-2025/hebs-2025-awards-night-web.mp4", portrait: true },
  { status: "ready", title: "Barber Competition Highlights", year: 2025, src: "/videos/hebs-2025/hebs-2025-barber-web.mp4", portrait: true },
  { status: "ready", title: "Stage Experience — Highlight", year: 2025, src: "/videos/hebs-2025/hebs-2025-stage-short-web.mp4", portrait: false, archiveNote: "Full 72-min stage archive available on request" },
];

// ── Video card with ambient autoplay + fullscreen modal ───────────────────────
function VideoCard({ src, title, portrait = false, year, archiveNote }: { src: string; title: string; portrait?: boolean; year: number; archiveNote?: string }) {
  const [open, setOpen] = useState(false);
  const ambientRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const el = ambientRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.play().catch(() => {});
      else el.pause();
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <div
        onClick={() => { setOpen(true); setTimeout(() => modalRef.current?.play(), 100); }}
        className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group border border-white/[0.07] bg-black"
      >
        <video
          ref={ambientRef}
          src={src}
          muted
          loop
          playsInline
          className={`w-full h-full ${portrait ? "object-contain" : "object-cover"}`}
        />
        <div className="absolute top-3 left-3 font-mono text-[8px] tracking-widest text-amber-400/80 bg-black/50 backdrop-blur-sm rounded px-1.5 py-0.5 uppercase border border-amber-500/20 z-10">
          {year}
        </div>
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/5 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/25 transition-all duration-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white font-semibold text-sm leading-tight">{title}</p>
          <p className="font-mono text-[9px] tracking-widest text-white/40 uppercase mt-0.5">HEBS {year}</p>
          {archiveNote && (
            <p className="font-mono text-[8px] tracking-wide text-amber-400/60 mt-1 leading-tight">{archiveNote}</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/97 flex items-center justify-center"
            onClick={() => setOpen(false)}
          >
            <div
              className={`relative ${portrait ? "h-[85vh] w-auto max-w-sm" : "w-full max-w-5xl px-4"}`}
              onClick={e => e.stopPropagation()}
            >
              <video
                ref={modalRef}
                src={src}
                controls
                playsInline
                className={`rounded-xl bg-black ${portrait ? "h-full w-auto" : "w-full"}`}
              />
            </div>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white"
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

// ── Hero auto-slide ───────────────────────────────────────────────────────────
const HERO_SLIDES = PHOTOS.slice(0, 6);

function HeroSlider() {
  const [idx, setIdx] = useState(0);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!isPausedRef.current) setIdx(i => (i + 1) % HERO_SLIDES.length);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative h-[55vh] min-h-[340px] overflow-hidden"
      onMouseEnter={() => { isPausedRef.current = true; }}
      onMouseLeave={() => { isPausedRef.current = false; }}
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image src={HERO_SLIDES[idx].src} alt={HERO_SLIDES[idx].caption} fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/20" />
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`rounded-full transition-all duration-300 ${i === idx ? "bg-amber-400 w-5 h-1.5" : "bg-white/20 w-1.5 h-1.5"}`}
          />
        ))}
      </div>

      {/* Overlay text */}
      <div className="absolute bottom-16 left-0 right-0 text-center px-5 z-10">
        <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-amber-400/80 mb-2">HEBS Media Archive</p>
        <h1 className="font-serif font-medium text-4xl sm:text-5xl text-white tracking-tight">Media Gallery</h1>
        <p className="text-zinc-400 text-sm mt-2">The complete visual archive of HEBS Lagos 2025</p>
      </div>
    </section>
  );
}

// ── Filter tabs ───────────────────────────────────────────────────────────────
type YearFilter = "all" | 2025;
type TypeFilter = "photos" | "videos";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const photoItem = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EXPO } },
};

export default function MediaGalleryPage() {
  const [yearFilter, setYearFilter] = useState<YearFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("photos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos = PHOTOS.filter(p => yearFilter === "all" || p.year === yearFilter);
  const filteredVideos = VIDEOS.filter(v => yearFilter === "all" || v.year === yearFilter);

  const lightboxImages = filteredPhotos.map(p => ({ src: p.src, alt: p.caption }));

  const yearBtnClass = (y: YearFilter) =>
    `px-4 py-2 rounded-lg font-mono text-[10px] tracking-widest uppercase transition-all duration-200 ${
      yearFilter === y
        ? "bg-amber-400 text-black font-semibold"
        : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
    }`;

  const typeBtnClass = (t: TypeFilter) =>
    `px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
      typeFilter === t
        ? "bg-white text-black"
        : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
    }`;

  return (
    <>
      <Navbar />
      <main className="bg-zinc-950 text-white">

        <div className="pt-20">
          <HeroSlider />
        </div>

        {/* Filters */}
        <div className="sticky top-20 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-white/[0.05] px-5 sm:px-8 py-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Type tabs */}
            <div className="flex gap-2">
              <button className={typeBtnClass("photos")} onClick={() => setTypeFilter("photos")}>
                Photos ({typeFilter === "photos" ? filteredPhotos.length : PHOTOS.filter(p => yearFilter === "all" || p.year === yearFilter).length})
              </button>
              <button className={typeBtnClass("videos")} onClick={() => setTypeFilter("videos")}>
                Videos ({VIDEOS.filter(v => yearFilter === "all" || v.year === yearFilter).length})
              </button>
            </div>

            {/* Year filter */}
            <div className="flex gap-2">
              <button className={yearBtnClass("all")} onClick={() => setYearFilter("all")}>All</button>
              <button className={yearBtnClass(2025)} onClick={() => setYearFilter(2025)}>2025</button>
            </div>
          </div>
        </div>

        <section className="py-12 px-5 sm:px-8 min-h-[60vh]">
          <div className="max-w-6xl mx-auto">

            {typeFilter === "photos" && (
              <>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-600 mb-8">
                  {filteredPhotos.length} photos · {yearFilter === "all" ? "All editions" : `HEBS ${yearFilter}`}
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${typeFilter}-${yearFilter}`}
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
                  >
                    {filteredPhotos.map((photo, i) => (
                      <motion.div
                        key={photo.src}
                        variants={photoItem}
                        onClick={() => setLightboxIndex(i)}
                        className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                      >
                        <Image
                          src={photo.src}
                          alt={photo.caption}
                          fill
                          className={`object-cover group-hover:scale-[1.04] transition-transform duration-500 ${"portrait" in photo && photo.portrait ? "object-top" : "object-center"}`}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/30 transition-colors duration-300" />

                        {/* Year badge */}
                        <div className="absolute top-2 left-2 font-mono text-[8px] tracking-widest text-white/60 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5 uppercase">
                          {photo.year}
                        </div>

                        {/* Expand icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                            </svg>
                          </div>
                        </div>

                        {/* Caption */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="font-sans text-xs text-white/90">{photo.caption}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </>
            )}

            {typeFilter === "videos" && (
              <>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-600 mb-8">
                  {filteredVideos.length} videos · {yearFilter === "all" ? "All editions" : `HEBS ${yearFilter}`}
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${typeFilter}-${yearFilter}`}
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {filteredVideos.map((video, i) => (
                      <motion.div key={i} variants={photoItem}>
                        {video.status === "ready" ? (
                          <VideoCard src={video.src} title={video.title} portrait={video.portrait} year={video.year} archiveNote={video.archiveNote} />
                        ) : (
                          <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0f0f0f] border border-white/[0.07] group cursor-pointer">
                            <Image
                              src={video.thumb}
                              alt={video.title}
                              fill
                              className="object-cover opacity-40 group-hover:opacity-55 transition-opacity duration-300"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black/30" />
                            <div className="absolute top-3 left-3 font-mono text-[8px] tracking-widest text-amber-400/80 bg-black/50 backdrop-blur-sm rounded px-1.5 py-0.5 uppercase border border-amber-500/20">
                              {video.year}
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 gap-3">
                              <div className="w-12 h-12 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                              <p className="text-white font-semibold text-sm leading-snug">{video.title}</p>
                              <span className="font-mono text-[9px] tracking-widest uppercase text-amber-400/70 border border-amber-500/20 rounded-full px-2.5 py-0.5 bg-amber-500/[0.06]">
                                Uploading Soon
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </>
            )}

          </div>
        </section>

        {/* CTA strip */}
        <section className="py-16 px-5 sm:px-8 border-t border-white/[0.05] bg-black">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-zinc-500 mb-2">Next Edition</p>
              <h2 className="font-serif font-medium text-2xl sm:text-3xl text-white tracking-tight">
                HEBS Lagos 2026 · <span className="text-amber-400">Oct 23–25</span>
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://hebseventportal.com/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-black bg-white px-7 py-3.5 rounded-xl hover:bg-amber-400 transition-colors duration-200"
              >
                Register for HEBS 2026 ↗
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white border border-white/[0.1] hover:border-white/30 px-6 py-3.5 rounded-xl transition-all duration-200"
              >
                ← Back to 2026
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />

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

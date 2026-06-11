'use client'

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const filters = [
  { label: "All Categories",           value: "all" },
  { label: "Barber & Stylist Battles", value: "barber-stylist" },
  { label: "Global Beauty Showdown",   value: "beauty-showdown" },
  { label: "Masterclasses & BTS",      value: "masterclass" },
]

const galleryItems = [
  // ── Barber & Stylist Battles (5) ──────────────────────────────
  {
    id: "bs-01",
    imageUrl: "https://picsum.photos/seed/hebs-bs-01/800/640",
    category: "barber-stylist",
    tagLabel: "Barber & Stylist Battles",
    title: "The Razor's Edge",
  },
  {
    id: "bs-02",
    imageUrl: "https://picsum.photos/seed/hebs-bs-02/800/640",
    category: "barber-stylist",
    tagLabel: "Barber & Stylist Battles",
    title: "Speed Cut Championship",
  },
  {
    id: "bs-03",
    imageUrl: "https://picsum.photos/seed/hebs-bs-03/800/640",
    category: "barber-stylist",
    tagLabel: "Barber & Stylist Battles",
    title: "Master Fade Technique",
  },
  {
    id: "bs-04",
    imageUrl: "https://picsum.photos/seed/hebs-bs-04/800/640",
    category: "barber-stylist",
    tagLabel: "Barber & Stylist Battles",
    title: "Precision Blade Work",
  },
  {
    id: "bs-05",
    imageUrl: "https://picsum.photos/seed/hebs-bs-05/800/640",
    category: "barber-stylist",
    tagLabel: "Barber & Stylist Battles",
    title: "Elite Barber Showcase",
  },

  // ── Global Beauty Showdown (5) ────────────────────────────────
  {
    id: "gbs-01",
    imageUrl: "https://picsum.photos/seed/hebs-gbs-01/800/640",
    category: "beauty-showdown",
    tagLabel: "Global Beauty Showdown",
    title: "Global Runway Showcase",
  },
  {
    id: "gbs-02",
    imageUrl: "https://picsum.photos/seed/hebs-gbs-02/800/640",
    category: "beauty-showdown",
    tagLabel: "Global Beauty Showdown",
    title: "Crowned Icons Finalist",
  },
  {
    id: "gbs-03",
    imageUrl: "https://picsum.photos/seed/hebs-gbs-03/800/640",
    category: "beauty-showdown",
    tagLabel: "Global Beauty Showdown",
    title: "Beauty Breakthrough Moment",
  },
  {
    id: "gbs-04",
    imageUrl: "https://picsum.photos/seed/hebs-gbs-04/800/640",
    category: "beauty-showdown",
    tagLabel: "Global Beauty Showdown",
    title: "High Fashion on Stage",
  },
  {
    id: "gbs-05",
    imageUrl: "https://picsum.photos/seed/hebs-gbs-05/800/640",
    category: "beauty-showdown",
    tagLabel: "Global Beauty Showdown",
    title: "Live Runway Competition",
  },

  // ── Masterclasses & BTS (5) ───────────────────────────────────
  {
    id: "mc-01",
    imageUrl: "https://picsum.photos/seed/hebs-mc-01/800/640",
    category: "masterclass",
    tagLabel: "Masterclasses & BTS",
    title: "Backstage BTS Session",
  },
  {
    id: "mc-02",
    imageUrl: "https://picsum.photos/seed/hebs-mc-02/800/640",
    category: "masterclass",
    tagLabel: "Masterclasses & BTS",
    title: "Education Workshop Live",
  },
  {
    id: "mc-03",
    imageUrl: "https://picsum.photos/seed/hebs-mc-03/800/640",
    category: "masterclass",
    tagLabel: "Masterclasses & BTS",
    title: "Advanced Technique Class",
  },
  {
    id: "mc-04",
    imageUrl: "https://picsum.photos/seed/hebs-mc-04/800/640",
    category: "masterclass",
    tagLabel: "Masterclasses & BTS",
    title: "Expert Demo on Stage",
  },
  {
    id: "mc-05",
    imageUrl: "https://picsum.photos/seed/hebs-mc-05/800/640",
    category: "masterclass",
    tagLabel: "Masterclasses & BTS",
    title: "Behind the Scenes Access",
  },
]

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredItems =
    activeFilter === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter)

  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen bg-black text-white pt-36 pb-24 px-6 max-w-7xl mx-auto">

        {/* Header */}
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2 block text-center">
          Exhibition Archive
        </span>
        <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight text-center mb-4 font-serif">
          Media &amp; Event <span className="italic font-normal">Gallery</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base text-center max-w-2xl mx-auto mb-10 leading-relaxed">
          Explore the visual milestones, competitor showdowns, and high-fashion highlights of HEBS.
        </p>

        {/* Filter Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto mb-16 p-1.5 bg-zinc-950/60 border border-white/10 rounded-full backdrop-blur-md">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={
                activeFilter === f.value
                  ? "bg-white text-black text-xs font-medium tracking-wide px-5 py-2 rounded-full transition-all duration-300"
                  : "text-zinc-400 hover:text-white text-xs font-medium tracking-wide px-5 py-2 rounded-full transition-colors duration-200"
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative h-80 bg-zinc-950 border border-white/15 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ease-in-out"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent text-left">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                  {item.tagLabel}
                </span>
                <h4 className="text-white text-base font-medium tracking-tight">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-24">
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-600">
              No media in this category yet
            </p>
          </div>
        )}

      </main>
      <Footer />
    </>
  )
}

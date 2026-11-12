'use client'

import { useState } from "react"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const filters = [
  { label: "All Categories",           value: "all" },
  { label: "Barber & Stylist Battles", value: "barber-stylist" },
  { label: "Global Beauty Showdown",   value: "beauty-showdown" },
  { label: "Masterclasses & BTS",      value: "masterclass" },
]

const galleryItems = [
  // ── Barber & Stylist Battles ──────────────────────────────────
  {
    id: "bs-01",
    imageUrl: "/images/hebs-2025/competition/competition-barbering.png",
    category: "barber-stylist",
    tagLabel: "Barber & Stylist Battles",
    title: "The Razor's Edge",
  },
  {
    id: "bs-02",
    imageUrl: "/images/hebs-2025/categories-winners/winner-barbering.png",
    category: "barber-stylist",
    tagLabel: "Barber & Stylist Battles",
    title: "Championship Winner — Barbering",
  },
  {
    id: "bs-03",
    imageUrl: "/images/hebs-2025/competition/competition-hair-styling.png",
    category: "barber-stylist",
    tagLabel: "Barber & Stylist Battles",
    title: "Live Hair Styling Showdown",
  },
  {
    id: "bs-04",
    imageUrl: "/images/hebs-2025/categories-winners/winner-hair-styling.png",
    category: "barber-stylist",
    tagLabel: "Barber & Stylist Battles",
    title: "Hair Styling Champion",
  },
  {
    id: "bs-05",
    imageUrl: "/images/hebs-2025/competition/competition-avant-garde.png",
    category: "barber-stylist",
    tagLabel: "Barber & Stylist Battles",
    title: "Avant-Garde Artistry",
  },

  // ── Global Beauty Showdown ────────────────────────────────────
  {
    id: "gbs-01",
    imageUrl: "/images/gallery/gallery-event-01.png",
    category: "beauty-showdown",
    tagLabel: "Global Beauty Showdown",
    title: "HEBS 2025 Opening Night",
  },
  {
    id: "gbs-02",
    imageUrl: "/images/gallery/gallery-event-02.png",
    category: "beauty-showdown",
    tagLabel: "Global Beauty Showdown",
    title: "Global Stage Moments",
  },
  {
    id: "gbs-03",
    imageUrl: "/images/gallery/gallery-event-03.png",
    category: "beauty-showdown",
    tagLabel: "Global Beauty Showdown",
    title: "Beauty Excellence on Display",
  },
  {
    id: "gbs-04",
    imageUrl: "/images/gallery/gallery-event-04.png",
    category: "beauty-showdown",
    tagLabel: "Global Beauty Showdown",
    title: "International Competitors",
  },
  {
    id: "gbs-05",
    imageUrl: "/images/gallery/gallery-event-05.png",
    category: "beauty-showdown",
    tagLabel: "Global Beauty Showdown",
    title: "Awards & Recognition",
  },

  // ── Masterclasses & BTS ───────────────────────────────────────
  {
    id: "mc-01",
    imageUrl: "/images/hebs-2025/backstage/backstage-01.png",
    category: "masterclass",
    tagLabel: "Masterclasses & BTS",
    title: "Behind the Scenes",
  },
  {
    id: "mc-02",
    imageUrl: "/images/hebs-2025/backstage/backstage-02.png",
    category: "masterclass",
    tagLabel: "Masterclasses & BTS",
    title: "Backstage Prep",
  },
  {
    id: "mc-03",
    imageUrl: "/images/hebs-2025/backstage/backstage-03.png",
    category: "masterclass",
    tagLabel: "Masterclasses & BTS",
    title: "Team & Talent Prep",
  },
  {
    id: "mc-04",
    imageUrl: "/images/hebs-2025/competition/competition-education.png",
    category: "masterclass",
    tagLabel: "Masterclasses & BTS",
    title: "Education Masterclass Session",
  },
  {
    id: "mc-05",
    imageUrl: "/images/hebs-2025/crowd/crowd-audience.png",
    category: "masterclass",
    tagLabel: "Masterclasses & BTS",
    title: "Full House — Live Audience",
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
              className="group relative h-80 bg-zinc-950 border border-white/10 hover:border-white/30 transition-all duration-500 ease-out shadow-lg hover:shadow-white/[0.02] rounded-2xl overflow-hidden"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
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

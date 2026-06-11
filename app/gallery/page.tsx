'use client'

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const logos = ["LOGO_01", "LOGO_02", "LOGO_03", "LOGO_04", "LOGO_05"]

const filters = [
  { label: "All Categories",          value: "all" },
  { label: "Barber & Stylist Battles", value: "barber-stylist" },
  { label: "Global Beauty Showdown",  value: "beauty-showdown" },
  { label: "Masterclasses & BTS",     value: "masterclass" },
]

const galleryCards = [
  {
    id: "01",
    label: "HAIR & BREAKTHROUGH CHALLENGE",
    col: "md:col-span-8",
    height: "h-96",
    src: "https://picsum.photos/seed/hebs-g01/900/384",
    category: "barber-stylist",
  },
  {
    id: "02",
    label: "BARBERING BATTLES SHOT",
    col: "md:col-span-4",
    height: "h-96",
    src: "https://picsum.photos/seed/hebs-g02/500/384",
    category: "barber-stylist",
  },
  {
    id: "03",
    label: "RUNWAY SHOWCASE",
    col: "md:col-span-4",
    height: "h-64",
    src: "https://picsum.photos/seed/hebs-g03/500/256",
    category: "beauty-showdown",
  },
  {
    id: "04",
    label: "MASTERCLASS BTS SESSION",
    col: "md:col-span-8",
    height: "h-64",
    src: "https://picsum.photos/seed/hebs-g04/900/256",
    category: "masterclass",
  },
]

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('all')

  const visibleCards = galleryCards.filter(
    (card) => activeFilter === 'all' || card.category === activeFilter
  )

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

        {/* Logo Showcase */}
        <div className="w-full border border-white/10 bg-zinc-950/40 rounded-2xl p-8 mb-16 flex flex-wrap items-center justify-center gap-12 backdrop-blur-sm">
          {logos.map((logo) => (
            <div
              key={logo}
              className="h-10 w-32 bg-zinc-900/60 border border-white/5 rounded-lg flex items-center justify-center text-zinc-600 text-xs font-mono tracking-wider font-semibold"
            >
              {logo}
            </div>
          ))}
        </div>

        {/* Bento Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          {visibleCards.map((card) => (
            <div
              key={card.id}
              className={`group relative ${card.col} ${card.height} bg-zinc-900 border border-white/15 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ease-in-out transform`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.src}
                alt={card.label}
                className="w-full h-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-105 filter grayscale"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/60 to-transparent text-left">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block mb-1">
                  {card.id}
                </span>
                <p className="font-sans text-sm font-medium text-white leading-snug">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {visibleCards.length === 0 && (
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

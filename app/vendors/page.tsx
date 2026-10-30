'use client'

import React from 'react'
import Link from 'next/link'
import { Check, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import PartnershipContact from '@/components/PartnershipContact'
import Footer from '@/components/Footer'
import { VENDOR_ARCHIVE_NOTE } from '@/lib/post-event'

const booths = [
  {
    tag: '01',
    name: 'Standard Booth',
    size: '10 ft × 10 ft',
    description: 'For independent vendors and emerging beauty brands at HEBS Lagos 2026.',
    perks: [
      '1 display table + 2 chairs',
      'Logo listing on official HEBS website',
      '5 General Admission passes',
      'Standard floor directory placement',
      'Access to all general event sessions',
    ],
    featured: false,
  },
  {
    tag: '02',
    name: 'Premium Booth',
    size: '10 ft × 20 ft',
    description: 'For established brands seeking high-traffic placement, expanded footprint, and broader audience reach.',
    perks: [
      'High-traffic premium floor placement',
      '2 display tables + 4 chairs',
      'Dedicated social media feature post',
      '10 General Admission passes',
      'Logo on event program & signage',
      'Access to networking sessions',
    ],
    featured: false,
  },
  {
    tag: '03',
    name: 'Deluxe Booth',
    size: '20 ft × 20 ft',
    description: 'Maximum-impact flagship presence at prime exhibition location. Full brand integration across event media.',
    perks: [
      'Prime entrance-level location',
      '4 display tables + 6 chairs',
      'Featured listing on official website',
      '15 General Admission passes',
      'Logo on all event materials & signage',
      'Dedicated social media campaign',
      'Access to VIP networking event',
    ],
    featured: true,
  },
]

export default function VendorsPage() {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen bg-black text-white pt-32 px-4 pb-24">

        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto mb-12 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-zinc-400">Vendors</span>
        </div>

        {/* Header */}
        <div className="text-center mb-6 max-w-2xl mx-auto px-5 sm:px-0">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2 block text-center">
            HEBS Lagos 2026 · Exhibition Booths
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-tight text-center mb-4 sm:mb-6 font-serif leading-snug sm:leading-tight">
            2026 Vendor <span className="italic font-normal">Booths</span>
          </h1>
          <p role="note" className="font-sans text-sm text-zinc-300 font-light leading-relaxed text-center">
            {VENDOR_ARCHIVE_NOTE}
          </p>
        </div>

        {/* Booth grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-10">
          {booths.map((booth) => {
            return (
              <div
                key={booth.name}
                className={`bg-zinc-950/40 border rounded-2xl p-8 flex flex-col justify-between hover:border-zinc-700 transition-all duration-300 shadow-xl relative overflow-hidden ${
                  booth.featured ? 'border-amber-500/40 hover:border-amber-400/60' : 'border-white/10 hover:border-white/30 transition-all duration-500 ease-out shadow-lg hover:shadow-white/[0.02] hover:border-white/25'
                }`}
              >
                {/* Featured badge */}
                {booth.featured && (
                  <div className="absolute top-0 right-0">
                    <span className="block bg-amber-500 text-black text-[9px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-2xl">
                      Prime
                    </span>
                  </div>
                )}

                <div>
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                        {booth.tag}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-full">
                        {booth.size}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl font-light text-white tracking-tight mb-2">
                      {booth.name}
                    </h2>
                    <p className="font-sans text-xs text-zinc-400 font-light leading-relaxed">
                      {booth.description}
                    </p>
                  </div>

                  {/* Perks */}
                  <ul className="text-sm text-zinc-400 space-y-3">
                    {booth.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check
                          className={`h-3.5 w-3.5 shrink-0 mt-0.5 stroke-[2] ${
                            booth.featured ? 'text-amber-500' : 'text-zinc-600'
                          }`}
                        />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-8 border-t border-zinc-900 pt-4 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  HEBS Lagos 2026 · no longer available
                </p>
              </div>
            )
          })}
        </div>

        {/* Info strip */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Setup Day', value: 'October 22, 2026', note: 'Pre-event booth setup' },
            { label: 'Event Dates', value: 'Oct 23–25, 2026', note: 'NJS Royale Events Center, Richland Garden Estate, Lekki-Epe Expressway, Lagos' },
          ].map((item) => (
            <div key={item.label} className="border border-white/10 hover:border-white/30 transition-all duration-500 ease-out shadow-lg hover:shadow-white/[0.02] bg-zinc-950/40 rounded-xl p-5 backdrop-blur-sm shadow-sm">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block mb-1">{item.label}</span>
              <span className="font-sans text-sm font-medium text-white block">{item.value}</span>
              <span className="font-sans text-xs text-zinc-500 font-light">{item.note}</span>
            </div>
          ))}
        </div>

        <PartnershipContact />

      </main>
      <Footer />
    </>
  )
}

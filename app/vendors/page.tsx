'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Check, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import PartnershipContact from '@/components/PartnershipContact'

type Currency = 'USD' | 'NGN'

const booths = [
  {
    tag: '01',
    name: 'Standard Booth',
    size: '10 ft × 10 ft',
    earlyUSD: '$1,200',
    earlyNGN: '₦1,767,600',
    standardUSD: '$2,000',
    standardNGN: '₦2,946,000',
    description: 'Perfect for independent vendors and emerging beauty brands making their debut at HEBS Lagos 2026.',
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
    earlyUSD: '$2,000',
    earlyNGN: '₦2,946,000',
    standardUSD: '$3,000',
    standardNGN: '₦4,419,000',
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
    earlyUSD: '$2,400',
    earlyNGN: '₦3,535,200',
    standardUSD: '$4,500',
    standardNGN: '₦6,628,500',
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
  const [currency, setCurrency] = useState<Currency>('USD')

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
        <div className="text-center mb-6 max-w-2xl mx-auto">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2 block text-center">
            Exhibition Booths
          </span>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-center mb-6 font-serif">
            Vendor <span className="italic font-normal">Opportunities</span>
          </h1>
          <p className="font-sans text-sm text-zinc-400 font-light leading-relaxed">
            Secure your booth at Africa&apos;s premier beauty summit. Three exhibition sizes with
            early-bird and standard pricing. All booths include full event-day floor access.
          </p>
        </div>

        {/* Currency toggle */}
        <div className="flex justify-center mt-10">
          <div className="inline-flex bg-zinc-900 border border-zinc-800 p-1 rounded-full relative mx-auto mb-12">
            <div
              className={`absolute top-1 bottom-1 bg-white rounded-full transition-all duration-300 ease-out ${
                currency === 'USD'
                  ? 'left-1 right-[calc(50%+1px)]'
                  : 'left-[calc(50%+1px)] right-1'
              }`}
            />
            <button
              onClick={() => setCurrency('USD')}
              className={`relative z-10 w-24 py-1.5 text-xs font-medium rounded-full transition-colors duration-300 ${
                currency === 'USD' ? 'text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('NGN')}
              className={`relative z-10 w-24 py-1.5 text-xs font-medium rounded-full transition-colors duration-300 ${
                currency === 'NGN' ? 'text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              NGN (₦)
            </button>
          </div>
        </div>

        {/* Booth grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {booths.map((booth) => {
            const earlyPrice    = currency === 'USD' ? booth.earlyUSD    : booth.earlyNGN
            const standardPrice = currency === 'USD' ? booth.standardUSD : booth.standardNGN

            return (
              <div
                key={booth.name}
                className={`bg-zinc-950/40 border rounded-2xl p-8 flex flex-col justify-between hover:border-zinc-700 transition-all duration-300 shadow-xl relative overflow-hidden ${
                  booth.featured ? 'border-amber-500/40 hover:border-amber-400/60' : 'border-white/15 hover:border-white/25'
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

                  {/* Pricing */}
                  <div className="border-t border-zinc-900 pt-6 mb-6">
                    <div className="flex items-end gap-6">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 block mb-1">
                          Early Bird
                        </span>
                        <span className="font-sans text-3xl font-light tracking-tight text-white leading-none">
                          {earlyPrice}
                        </span>
                      </div>
                      <div className="border-l border-zinc-800 pl-6">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 block mb-1">
                          Standard
                        </span>
                        <span className="font-sans text-lg font-light text-zinc-500 line-through leading-none">
                          {standardPrice}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mt-2 block">
                      {currency === 'USD' ? 'USD' : 'NGN'} · one-time · per event
                    </span>
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

                {/* CTA */}
                <a
                  href={`mailto:info@thehebs.com?subject=${booth.name} Inquiry — HEBS 2026`}
                  className={`w-full text-center py-3 rounded-xl font-medium transition-all mt-8 font-sans text-xs uppercase tracking-widest block ${
                    booth.featured
                      ? 'bg-white text-black hover:bg-zinc-200'
                      : 'border border-zinc-800 hover:border-zinc-600 text-white bg-zinc-900/30'
                  }`}
                >
                  Reserve {booth.name} ↗
                </a>
              </div>
            )
          })}
        </div>

        {/* Info strip */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Early Bird Deadline', value: 'August 31, 2026', note: 'Lock in the lowest rate before cutoff' },
            { label: 'Setup Window', value: 'October 22, 2026', note: 'Full day pre-event booth setup access' },
            { label: 'Event Dates', value: 'Oct 23–25, 2026', note: 'NJS Royale Convention & Suites, Lagos' },
          ].map((item) => (
            <div key={item.label} className="border border-white/15 bg-zinc-950/40 rounded-xl p-5 backdrop-blur-sm shadow-sm">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block mb-1">{item.label}</span>
              <span className="font-sans text-sm font-medium text-white block">{item.value}</span>
              <span className="font-sans text-xs text-zinc-500 font-light">{item.note}</span>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="max-w-6xl mx-auto mt-10 border border-white/15 bg-zinc-950/40 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-sm shadow-sm">
          <div>
            <p className="font-sans text-sm text-white font-medium mb-1">Ready to Exhibit at HEBS 2026?</p>
            <p className="font-sans text-xs text-zinc-400 font-light">
              Booth confirmations are sent within 48 hours. All rates are per-event and non-transferable.
            </p>
          </div>
          <a
            href="mailto:info@thehebs.com"
            className="bg-white text-black font-medium px-6 py-3 rounded-xl hover:bg-zinc-200 transition-all text-xs tracking-wider inline-flex items-center gap-1 shrink-0 cursor-pointer relative z-50 pointer-events-auto"
          >
            <span>CONTACT US</span>
            <span className="text-sm font-light">↗</span>
          </a>
        </div>

        <PartnershipContact />

      </main>
    </>
  )
}

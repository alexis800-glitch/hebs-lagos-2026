import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import JoinTheMovement from '@/components/JoinTheMovement'
import PartnershipContact from '@/components/PartnershipContact'
import Footer from '@/components/Footer'
import { COMPETITION_COUNT, TOTAL_PRIZE_USD_DISPLAY } from '@/lib/competitions'
import { SPONSORSHIP_ARCHIVE_NOTE } from '@/lib/post-event'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sponsorship — HEBS Lagos 2026',
  description: 'The partnership tiers offered for the Hair Education Beauty Summit Lagos 2026, held October 23–25, 2026. These tiers are no longer available.',
  alternates: { canonical: '/sponsors' },
  openGraph: {
    title: 'Sponsorship — HEBS Lagos 2026',
    description: 'The partnership tiers offered for HEBS Lagos 2026. Held October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
    url: '/sponsors',
    images: [
      {
        url: '/images/og/hebs-lagos-2026-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Sponsorship — HEBS Lagos 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sponsorship — HEBS Lagos 2026',
    description: 'The partnership tiers offered for HEBS Lagos 2026. Held October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
    images: ['/images/og/hebs-lagos-2026-og.jpg'],
  },
}

const boothPackages = [
  {
    tag: '01',
    name: 'Standard Booth',
    inclusions: [
      '1 Table, 2 Chairs',
      '5 General Admission Passes',
    ],
  },
  {
    tag: '02',
    name: 'Premium Booth',
    inclusions: [
      'High-Traffic Area Placement',
      '2 Tables, 4 Chairs',
      'Social Media Feature',
      '10 General Admission Passes',
    ],
  },
  {
    tag: '03',
    name: 'Deluxe Booth',
    inclusions: [
      'Prime Location',
      '4 Tables, 6 Chairs',
      'Featured Listing on Event Website',
      'VIP Networking Access',
      '15 General Admission Passes',
    ],
  },
]

const boothAddOns = [
  { label: 'Electricity & Wi-Fi Access' },
  { label: 'On-Site Branding & Banner Placement' },
]

const diamondPerks = [
  'Prime "Presented By" branding on the HEBS main stage backdrop',
  'Opening ceremony & closing gala speaking slots',
  '20 × 20 ft exclusive flagship booth — premier entrance positioning',
  '10 all-access VIP tickets with backstage Meet & Greet access',
  '"Presented By" credit across all official event backdrops & media walls',
  'Logo on all signage, merchandise, and official press materials',
  'Dedicated social media campaign — 100k+ combined reach',
  'Full-page feature in the official HEBS 2026 press kit',
  'Co-branded content creation & post-event media recap',
  'Unlimited staff vendor badges',
]

const tiers = [
  {
    tag: '02',
    name: 'Platinum Sponsor',
    accent: 'text-zinc-300',
    perks: [
      'VIP Lounge presenting sponsor — full naming rights',
      'Stage branding across all main sessions',
      '15 × 15 ft premium booth — priority floor placement',
      '6 all-access VIP tickets',
      'Social media campaign — 50k+ reach',
      'Full-page official program listing',
      'Brand mention at every stage session',
    ],
  },
  {
    tag: '03',
    name: 'Gold Sponsor',
    accent: 'text-amber-400',
    perks: [
      'Masterclass stage sponsorship — naming rights',
      '12 × 12 ft booth — premium floor zone',
      '4 all-access VIP tickets',
      'Product placement in official event gift bags',
      'Logo on select signage & event materials',
      'Social media brand post — 25k+ reach',
      'Half-page official program listing',
    ],
  },
  {
    tag: '04',
    name: 'Silver Sponsor',
    accent: 'text-zinc-400',
    perks: [
      '10 × 10 ft booth space',
      'Logo on official website & social media channels',
      '2 all-access VIP tickets',
      'Product placement in event gift bags',
      'Quarter-page official program listing',
      'Brand mention during networking segments',
    ],
  },
  {
    tag: '05',
    name: 'Bronze Sponsor',
    accent: 'text-zinc-500',
    perks: [
      '8 × 8 ft booth space',
      'Logo listing on official HEBS website',
      '2 general admission tickets',
      'Product sampling opportunity on vendor floor',
      'Brand mention in event program',
    ],
  },
]

export default function SponsorsPage() {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen bg-black text-white pt-32 px-4 pb-24">

        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto mb-12 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-zinc-400">Sponsors</span>
        </div>

        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto px-5 sm:px-0">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2 block text-center">
            HEBS Lagos 2026 · Partnerships
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-tight text-center mb-4 sm:mb-6 font-serif leading-snug sm:leading-tight">
            2026 Sponsorship <span className="italic font-normal">Tiers</span>
          </h1>
          <p role="note" className="font-sans text-sm text-zinc-300 font-light leading-relaxed text-center">
            {SPONSORSHIP_ARCHIVE_NOTE}
          </p>
        </div>

        {/* ── Audience credibility statement ── */}
        <div className="max-w-5xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { stat: 'Nigeria + Africa', label: 'Geographic Reach', note: 'Built for competitors from Nigeria, West Africa, the US and the UK' },
            { stat: TOTAL_PRIZE_USD_DISPLAY, label: 'Total Prize Pool', note: `Across ${COMPETITION_COUNT} competitions — the largest prize purse in African beauty competition history` },
          ].map((item) => (
            <div key={item.stat} className="border border-white/10 bg-zinc-950/40 rounded-2xl p-6">
              <span className="font-sans text-3xl font-light text-white block mb-1 tracking-tight">{item.stat}</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 block mb-2">{item.label}</span>
              <span className="font-sans text-xs text-zinc-500 font-light leading-relaxed">{item.note}</span>
            </div>
          ))}
        </div>

        {/* ── Audience profile + HEBS 2025 link ── */}
        <div className="max-w-5xl mx-auto mb-10 border border-white/10 bg-zinc-950/40 rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mb-3">The 2026 Audience</p>
            <p className="font-sans text-sm text-zinc-300 font-light leading-relaxed">
              HEBS Lagos 2026 was built for salon owners, master stylists, barbers, makeup artists, nail technicians, beauty educators, brand founders, and consumers from Nigeria, West Africa, and the global HEBS community, over three days in Lagos.
            </p>
          </div>
          <Link
            href="/hebs-legacy/2025"
            className="shrink-0 inline-flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-widest text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-5 py-3 rounded-xl transition-all duration-200 w-full md:w-auto max-w-full md:whitespace-nowrap"
          >
            See HEBS 2025 →
          </Link>
        </div>

        {/* ── Visual proof — event scale images ── */}
        <div className="max-w-5xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden">
            <Image
              src="/images/hebs-2025/crowd/crowd-main-stage.png"
              alt="HEBS 2025 main stage — crowd and event scale"
              fill
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest text-zinc-400">HEBS 2025 · Main Stage</span>
          </div>
          <div className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden">
            <Image
              src="/images/sponsors/sponsor-ment-pro-tools-products-01.png"
              alt="HEBS 2025 — sponsor brand presence on the exhibition floor"
              fill
              className="object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest text-zinc-400">HEBS 2025 · Sponsor Floor</span>
          </div>
        </div>

        {/* ── Diamond Tier — full-width hero card ── */}
        <div id="sponsorship-packages" className="max-w-5xl mx-auto bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-white/10 hover:border-white/30 transition-all duration-500 ease-out shadow-lg hover:shadow-white/[0.02] rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden shadow-2xl">

          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/4 blur-[120px] rounded-full pointer-events-none select-none" />
          <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-zinc-700/10 blur-[80px] rounded-full pointer-events-none select-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">

            {/* Left — identity (2026 record; no price or call to action) */}
            <div className="flex flex-col justify-between gap-8">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block mb-4">
                  01 · Presenting Tier
                </span>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-white tracking-tight">
                    Diamond
                  </h2>
                  <span className="font-mono text-[9px] uppercase tracking-widest bg-white text-black px-3 py-1 rounded-full font-bold shrink-0">
                    Exclusive Partner
                  </span>
                </div>
                <p className="font-sans text-sm text-zinc-400 font-light leading-relaxed">
                  The presenting partnership offered for HEBS Lagos 2026, with event integration across every channel, stage, and media asset.
                </p>
              </div>

              <p className="border-t border-zinc-800 pt-6 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                HEBS Lagos 2026 · no longer available
              </p>
            </div>

            {/* Right — perks */}
            <div className="border-t md:border-t-0 md:border-l border-zinc-800 pt-8 md:pt-0 md:pl-10">
              <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-6">
                Included in 2026
              </p>
              <ul className="text-sm text-zinc-400 space-y-3">
                {diamondPerks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5 stroke-[2]" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Remaining 4 tiers — 2×2 grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="bg-zinc-950/40 border border-white/10 hover:border-white/30 transition-all duration-500 ease-out shadow-lg hover:shadow-white/[0.02] rounded-2xl p-8 flex flex-col justify-between hover:border-white/25 transition-all duration-300 backdrop-blur-sm shadow-sm"
            >
              <div>
                <div className="mb-6">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 block mb-3">
                    {tier.tag}
                  </span>
                  <h3 className="font-serif text-xl font-light text-white tracking-tight mb-2">
                    {tier.name}
                  </h3>
                </div>

                <ul className="text-sm text-zinc-400 space-y-3">
                  {tier.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className={`h-3.5 w-3.5 ${tier.accent} shrink-0 mt-0.5 stroke-[2]`} />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-6 border-t border-zinc-900 pt-4 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                HEBS Lagos 2026 · no longer available
              </p>
            </div>
          ))}
        </div>

        {/* ── Exhibitor & Vendor Booth Packages ── */}
        <div className="max-w-5xl mx-auto mt-20 border-t border-white/[0.08] pt-16">

          {/* Section header */}
          <div className="mb-10">
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block mb-3">
              Exhibitor &amp; Vendor
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-white tracking-tight mb-3">
              2026 Booth <span className="italic font-normal">Packages</span>
            </h2>
            <p className="font-sans text-sm text-zinc-400 font-light leading-relaxed max-w-xl">
              The exhibition booths offered for HEBS Lagos 2026. Exhibit days were October 24–25, 2026
              at NJS Royale Events Center, Lagos, Nigeria. These packages are no longer available.
            </p>
          </div>

          {/* 3-column booth cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {boothPackages.map((pkg) => (
              <div
                key={pkg.name}
                className="bg-zinc-950/40 border border-white/10 hover:border-white/25 transition-all duration-300 rounded-2xl p-7 flex flex-col"
              >
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 block mb-4">
                  {pkg.tag}
                </span>
                <h3 className="font-serif text-xl font-light text-white tracking-tight mb-1">
                  {pkg.name}
                </h3>
                <ul className="text-sm text-zinc-400 space-y-3 flex-1 mt-4 border-t border-zinc-900 pt-5">
                  {pkg.inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5 stroke-[2]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Add-ons row */}
          <div className="border border-white/[0.08] bg-zinc-950/40 rounded-2xl p-6 mb-5">
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-5">
              Optional add-ons offered in 2026
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {boothAddOns.map((addon) => (
                <div key={addon.label} className="flex items-start gap-3">
                  <Check className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5 stroke-[2]" />
                  <div>
                    <p className="text-sm text-white font-medium leading-snug">{addon.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Exhibitor & sponsor resource download ── */}
          <div className="border border-white/[0.08] bg-zinc-950/40 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="max-w-xl">
              <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-2">
                Sponsor &amp; Exhibitor Resources
              </p>
              <p className="font-sans text-sm text-white font-medium mb-1">
                HEBS Lagos 2026 Exhibitor &amp; Sponsor Deck (archive)
              </p>
              <p className="font-sans text-xs text-zinc-400 font-light leading-relaxed">
                The 2026 deck, kept for reference. The packages and prices in it have expired.
              </p>
            </div>
            <a
              href="/downloads/hebs-lagos-2026-floor-plan-and-event-deck.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download the archived HEBS Lagos 2026 Exhibitor and Sponsor Deck (PDF, 2 MB, opens in a new tab)"
              className="shrink-0 w-full md:w-auto text-center inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-widest font-medium border border-zinc-800 hover:border-zinc-600 text-white bg-zinc-900/30 transition-all duration-200 touch-manipulation"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download 2026 Deck (PDF, 2 MB)
            </a>
          </div>

        </div>

        <JoinTheMovement packagesHref="#sponsorship-packages" />

        <PartnershipContact />

      </main>
      <Footer />
    </>
  )
}

import React from 'react'
import Link from 'next/link'
import { Check, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import PartnershipContact from '@/components/PartnershipContact'

export const metadata = {
  title: 'Sponsorship Opportunities — HEBS Lagos 2026',
  description: 'Partner with the premier beauty summit in Africa. Five exclusive sponsorship tiers from $1,500 to $25,000. HEBS Lagos 2026, October 23–25.',
}

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
    price: '$15,000',
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
    price: '$5,500',
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
    price: '$2,500',
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
    price: '$1,500',
    accent: 'text-orange-700',
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
      <main className="w-full min-h-screen bg-black text-white pt-32 px-5 md:px-8 pb-24">

        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto mb-12 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-zinc-400">Sponsors</span>
        </div>

        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-2 block text-center w-full">
            Partnerships
          </span>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-center mb-6 font-serif">
            Sponsorship <span className="italic font-normal">Opportunities</span>
          </h1>
          <p className="font-sans text-sm text-zinc-300 leading-relaxed text-left md:text-center">
            Align your brand with the premier beauty summit in Africa. Five exclusive packages designed
            to deliver measurable visibility, qualified audience access, and lasting industry impact.
          </p>
        </div>

        {/* ── Diamond Tier — full-width hero card ── */}
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-white/10 hover:border-white/30 transition-all duration-500 ease-out shadow-lg hover:shadow-white/[0.02] rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden shadow-2xl">

          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/4 blur-[120px] rounded-full pointer-events-none select-none" />
          <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-zinc-700/10 blur-[80px] rounded-full pointer-events-none select-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">

            {/* Left — identity + price + CTA */}
            <div className="flex flex-col justify-between gap-8">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block mb-4">
                  01 · Exclusive Tier
                </span>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-white tracking-tight">
                    Diamond
                  </h2>
                  <span className="font-mono text-[9px] uppercase tracking-widest bg-white text-black px-3 py-1 rounded-full font-bold shrink-0">
                    Exclusive Partner
                  </span>
                </div>
                <p className="font-sans text-sm text-zinc-300 leading-relaxed">
                  <strong className="text-white font-semibold">Diamond Partner.</strong> The ultimate presenting partnership at HEBS Lagos 2026. One slot available. Total event integration across every channel, stage, and media asset.
                </p>
              </div>

              <div className="border-t border-zinc-800 pt-6">
                <span className="font-sans text-5xl font-light tracking-tight text-white leading-none block">
                  $25,000
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mt-2 block">
                  USD · one exclusive slot · HEBS Lagos 2026
                </span>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <a
                    href="mailto:info@thehebs.com?subject=Diamond Sponsorship Inquiry — HEBS 2026"
                    className="inline-flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-widest bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-xl font-medium transition-all duration-200"
                  >
                    Inquire About Diamond ↗
                  </a>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-1 font-sans text-xs uppercase tracking-widest text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-6 py-3 rounded-xl font-medium transition-all duration-200"
                  >
                    View All Packages
                  </Link>
                </div>
              </div>
            </div>

            {/* Right — perks */}
            <div className="border-t md:border-t-0 md:border-l border-zinc-800 pt-8 md:pt-0 md:pl-10">
              <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-6">
                Exclusive inclusions
              </p>
              <ul className="text-sm text-zinc-300 space-y-3">
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
                  <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block mb-3">
                    {tier.tag}
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-white tracking-tight mb-2">
                    {tier.name}
                  </h3>
                  <div className="border-t border-zinc-900 pt-5 mt-5">
                    <span className="text-4xl font-light tracking-tight text-white block font-sans">
                      {tier.price}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mt-1 block">
                      USD · one-time · per event
                    </span>
                  </div>
                </div>

                <ul className="text-sm text-zinc-300 space-y-3">
                  {tier.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className={`h-3.5 w-3.5 ${tier.accent} shrink-0 mt-0.5 stroke-[2]`} />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={`mailto:info@thehebs.com?subject=${tier.name} Inquiry — HEBS 2026`}
                className="w-full text-center py-3 rounded-xl font-medium transition-all mt-6 border border-zinc-800 hover:border-zinc-600 text-white bg-zinc-900/30 font-sans text-xs uppercase tracking-widest block"
              >
                Inquire About {tier.name} ↗
              </a>
            </div>
          ))}
        </div>

        {/* Footer CTA strip */}
        <div className="max-w-5xl mx-auto mt-16 border border-white/10 hover:border-white/30 transition-all duration-500 ease-out shadow-lg hover:shadow-white/[0.02] bg-zinc-950/40 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-sm shadow-sm">
          <div>
            <p className="font-sans text-sm text-white font-medium mb-1">Ready to Partner with HEBS 2026?</p>
            <p className="font-sans text-xs text-zinc-300">
              All packages are confirmed via email. A proposal and invoice will be sent within 48 hours.
            </p>
          </div>
          <a
            href="mailto:info@thehebs.com"
            className="bg-white text-black font-medium px-6 py-3 rounded-xl hover:bg-zinc-200 transition-all text-xs tracking-wider inline-flex items-center gap-1 shrink-0"
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

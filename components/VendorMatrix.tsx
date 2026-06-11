'use client'

import { useState, useRef } from 'react'
import { Check } from 'lucide-react'

type Currency = 'USD' | 'NGN'

const tiers = [
  {
    tag: '01',
    name: 'Standard Booth',
    usd: '$1,200',
    ngn: '₦1,800,000',
    usdCode: 'USD',
    ngnCode: 'NGN',
    description: 'Ideal for emerging brands and independent vendors building visibility at HEBS Lagos 2026.',
    perks: [
      '10 × 10 ft booth space',
      '3 vendor staff badges',
      'Floor directory & program listing',
      'Access to general event sessions',
      'Standard signage placement',
      'Basic vendor support package',
    ],
    cta: 'Reserve Standard Booth',
    featured: false,
  },
  {
    tag: '02',
    name: 'Premium Pavilion',
    usd: '$2,500',
    ngn: '₦3,750,000',
    usdCode: 'USD',
    ngnCode: 'NGN',
    description: 'For established brands seeking premium placement, expanded reach, and professional visibility.',
    perks: [
      '15 × 15 ft pavilion space',
      '6 vendor staff badges',
      'Priority entrance-floor placement',
      'Logo on website & event program',
      'Stage brand mention at opening',
      'Access to VIP networking event',
      'Dedicated social media post',
    ],
    cta: 'Reserve Premium Pavilion',
    featured: false,
  },
  {
    tag: '03',
    name: 'Elite Space',
    usd: '$4,000',
    ngn: '₦6,000,000',
    usdCode: 'USD',
    ngnCode: 'NGN',
    description: 'Maximum-impact flagship presence for brands that demand total coverage across every HEBS touchpoint.',
    perks: [
      '20 × 20 ft flagship space',
      'Premier entrance positioning',
      'Unlimited staff vendor badges',
      'Logo on all official event materials',
      'Dedicated segment on main stage',
      'Full-page press & program listing',
      'Social media campaign (50k+ reach)',
      'All-access VIP & gala entry',
      'Co-branded marketing assets',
    ],
    cta: 'Become an Elite Partner',
    featured: true,
  },
]

type Tier = typeof tiers[number]

function VendorCard({ tier, currency }: { tier: Tier; currency: Currency }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [spot, setSpot] = useState({ x: 0, y: 0, visible: false })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true })
  }

  function handleMouseLeave() {
    setSpot((s) => ({ ...s, visible: false }))
  }

  const price = currency === 'USD' ? tier.usd : tier.ngn
  const code  = currency === 'USD' ? tier.usdCode : tier.ngnCode

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800/80 rounded-2xl p-8 relative overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
    >
      {/* Cursor spotlight */}
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none blur-md transition-opacity duration-300 mix-blend-screen"
        style={{
          opacity: spot.visible ? 1 : 0,
          background: `radial-gradient(circle 260px at ${spot.x}px ${spot.y}px, rgba(161,161,170,0.12), transparent 70%)`,
        }}
      />

      {/* Elite badge */}
      {tier.featured && (
        <div className="absolute top-0 right-0">
          <span className="block bg-amber-500 text-black text-[9px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-2xl">
            Elite
          </span>
        </div>
      )}

      <div className="relative z-10">
        {/* Card header */}
        <div className="mb-8">
          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block mb-3">
            {tier.tag}
          </span>
          <h3 className="font-serif text-xl font-light text-white tracking-tight mb-3">
            {tier.name}
          </h3>
          <p className="font-sans text-xs text-zinc-400 font-light leading-relaxed">
            {tier.description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-8 pb-8 border-b border-zinc-800/60">
          <span className="font-sans text-5xl font-light tracking-tight text-white leading-none block">
            {price}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-2 block">
            {code} · one-time · per event
          </span>
        </div>

        {/* Perks */}
        <ul className="space-y-3">
          {tier.perks.map((perk, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
              <Check className="h-3.5 w-3.5 text-zinc-600 shrink-0 mt-0.5 stroke-[2]" />
              {perk}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      {tier.featured ? (
        <a
          href="mailto:info@thehebs.com"
          className="relative z-10 w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-zinc-200 transition-all text-center mt-8 block font-sans text-xs uppercase tracking-widest"
        >
          {tier.cta} ↗
        </a>
      ) : (
        <a
          href="mailto:info@thehebs.com"
          className="relative z-10 w-full border border-zinc-800 hover:border-zinc-600 text-white font-medium py-3 rounded-xl transition-all text-center mt-8 block font-sans text-xs uppercase tracking-widest hover:bg-zinc-900/60"
        >
          {tier.cta} ↗
        </a>
      )}
    </div>
  )
}

export default function VendorMatrix() {
  const [currency, setCurrency] = useState<Currency>('USD')

  return (
    <section className="py-24 px-4 bg-[#050505] border-t border-zinc-900" id="vendor-matrix">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-500 font-medium mb-4">
            Vendor &amp; Exhibition Packages
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight mb-4">
            Exhibit at <span className="italic font-normal">HEBS 2026</span>
          </h2>
          <p className="font-sans text-sm text-zinc-400 font-light leading-relaxed max-w-xl mx-auto">
            Claim your space at Africa&apos;s premier beauty summit. All booths include full event-day floor
            access and brand placement across official channels.
          </p>

          {/* Currency toggle */}
          <div className="flex justify-center mt-10">
            <div className="inline-flex bg-zinc-900 border border-zinc-800 p-1 rounded-full relative mb-12">
              {/* Sliding indicator */}
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
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {tiers.map((tier) => (
            <VendorCard key={tier.name} tier={tier} currency={currency} />
          ))}
        </div>

        {/* Footer */}
        <p className="text-center font-sans text-xs text-zinc-500 font-light mt-12 leading-loose">
          All exhibition inquiries are handled via email. Confirmation &amp; invoice sent within 48 hours.
          <br />
          Contact:{' '}
          <a href="mailto:info@thehebs.com" className="text-zinc-300 hover:text-white transition-colors">
            info@thehebs.com
          </a>
        </p>

      </div>
    </section>
  )
}

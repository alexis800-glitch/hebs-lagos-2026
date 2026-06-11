'use client'

import { useState, useRef } from 'react'

type Currency = 'USD' | 'NGN'

const tiers = [
  {
    tag: '01',
    name: 'Standard Booth',
    usd: '$500',
    ngn: '₦800,000',
    description:
      'For independent vendors and emerging brands seeking targeted exposure at HEBS Lagos 2026.',
    features: [
      '8 × 8 ft booth space',
      '2 vendor badges included',
      'Floor directory listing',
      'Access to general event sessions',
      'Standard signage placement',
    ],
    cta: 'Reserve Standard Booth',
    featured: false,
  },
  {
    tag: '02',
    name: 'Premium Booth',
    usd: '$1,200',
    ngn: '₦1,920,000',
    description:
      'For established brands seeking premium visibility, priority placement, and broader professional reach.',
    features: [
      '12 × 12 ft premium booth space',
      '5 vendor badges included',
      'Priority floor placement',
      'Website & program logo listing',
      'Stage mention at opening ceremony',
      'Access to VIP networking event',
    ],
    cta: 'Reserve Premium Booth',
    featured: false,
  },
  {
    tag: '03',
    name: 'Brand Partner',
    usd: '$2,500',
    ngn: '₦4,000,000',
    description:
      'Full flagship partnership for brands that want maximum impact across every touchpoint at HEBS 2026.',
    features: [
      '15 × 15 ft flagship booth space',
      'Premier entrance-level positioning',
      'Unlimited staff vendor badges',
      'Logo on all official event materials',
      'Dedicated segment on main stage',
      'Full-page program & media listing',
      'Social media feature (50k+ reach)',
      'All-access VIP & gala entry',
    ],
    cta: 'Become a Brand Partner',
    featured: true,
  },
]

type Tier = typeof tiers[number]

function PricingCard({ tier, currency }: { tier: Tier; currency: Currency }) {
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

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`bg-gradient-to-b from-zinc-900 to-black border rounded-2xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col ${
        tier.featured
          ? 'border-amber-500/40 hover:border-amber-400/60'
          : 'border-zinc-800/80 hover:border-zinc-700'
      }`}
    >
      {/* Cursor spotlight */}
      <div
        className="absolute inset-0 pointer-events-none select-none blur-md transition-opacity duration-300"
        style={{
          opacity: spot.visible ? 1 : 0,
          background: `radial-gradient(circle 280px at ${spot.x}px ${spot.y}px, rgba(161,161,170,0.13), transparent 70%)`,
        }}
      />

      {/* Flagship badge */}
      {tier.featured && (
        <div className="absolute top-0 right-0">
          <span className="block bg-amber-500 text-black text-[9px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-2xl">
            Flagship
          </span>
        </div>
      )}

      {/* Card header */}
      <div className="mb-8 relative z-10">
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

      {/* Price display */}
      <div className="mb-8 pb-8 border-b border-zinc-800/60 relative z-10">
        <span className="font-sans text-5xl font-light tracking-tight text-white leading-none block">
          {currency === 'USD' ? tier.usd : tier.ngn}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-2 block">
          one-time · per event
        </span>
      </div>

      {/* Feature list */}
      <ul className="flex flex-col gap-3 mb-10 flex-1 relative z-10">
        {tier.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 font-sans text-xs text-zinc-300 font-light">
            <span
              className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${
                tier.featured ? 'bg-amber-400' : 'bg-zinc-500'
              }`}
            />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="mailto:info@thehebs.com"
        className={`relative z-10 block w-full text-center font-sans text-xs uppercase tracking-widest py-4 rounded-xl font-medium transition-all duration-200 ${
          tier.featured
            ? 'bg-white text-black hover:bg-zinc-200'
            : 'border border-zinc-800 hover:border-zinc-600 text-white hover:bg-zinc-900/60'
        }`}
      >
        {tier.cta} ↗
      </a>
    </div>
  )
}

export default function PricingGrid() {
  const [currency, setCurrency] = useState<Currency>('USD')

  return (
    <section className="py-24 px-4 bg-[#050505] border-t border-zinc-900" id="pricing">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-14">
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-500 font-medium mb-4">
            Vendor &amp; Partner Packages
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight mb-4">
            Grow Your Brand at{' '}
            <span className="italic font-normal">HEBS 2026</span>
          </h2>
          <p className="font-sans text-sm text-zinc-400 font-light leading-relaxed max-w-xl mx-auto">
            Secure your booth or brand partnership at the premier beauty summit in Africa.
            All packages include full event-day floor access.
          </p>

          {/* Currency toggle pill */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex bg-zinc-900 border border-zinc-800 p-1 rounded-full relative">
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

        {/* Bento card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {tiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} currency={currency} />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center font-sans text-xs text-zinc-500 font-light mt-12 leading-loose">
          All vendor inquiries are processed via email. A confirmation and invoice will be sent within 48 hours.
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

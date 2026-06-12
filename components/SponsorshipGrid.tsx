import { Check } from 'lucide-react'

const diamondPerks = [
  '"Presented By" branding across all official event channels',
  '20 × 20 ft exclusive flagship booth — premier positioning',
  'Dedicated speaking slot on main stage',
  'Logo on all signage, materials, and media coverage',
  'Unlimited staff vendor & VIP badges',
  'Full-page feature in official event press kit',
  'Social media campaign — 100k+ reach',
  '10 all-access VIP & gala entries',
  'Co-branded content creation package',
  'Post-event media recap inclusion',
]

const tiers = [
  {
    tag: '02',
    name: 'Platinum',
    price: '$15,000',
    description: 'Prominent multi-channel visibility for enterprise-level brand exposure at HEBS Lagos 2026.',
    perks: [
      '15 × 15 ft premium booth — priority placement',
      'Logo on all official event materials',
      '5-minute speaking opportunity on main stage',
      '8 all-access VIP badges',
      'Social media feature — 50k+ reach',
      'Full-page official program listing',
      'Brand mention across all stage sessions',
    ],
  },
  {
    tag: '03',
    name: 'Gold',
    price: '$5,500',
    description: 'Strong brand presence with targeted exposure across the HEBS Lagos audience.',
    perks: [
      '12 × 12 ft booth space — premium floor zone',
      'Logo on select event materials',
      '5 all-access VIP badges',
      'Social media post — 25k+ reach',
      'Half-page official program listing',
      'Brand mention during opening ceremony',
    ],
  },
  {
    tag: '04',
    name: 'Silver',
    price: '$2,500',
    description: 'Solid professional visibility and floor access for growing brands and regional players.',
    perks: [
      '10 × 10 ft booth space',
      'Logo on official event program',
      '3 vendor staff badges',
      'Social media brand mention',
      'Quarter-page program listing',
    ],
  },
  {
    tag: '05',
    name: 'Bronze',
    price: '$1,500',
    description: 'Essential event presence and brand exposure for emerging companies entering the market.',
    perks: [
      '8 × 8 ft booth space',
      'Name listing in official program',
      '2 vendor staff badges',
      'Brand presence on vendor floor',
    ],
  },
]

export default function SponsorshipGrid() {
  return (
    <section className="w-full bg-black py-20 border-t border-zinc-900" id="sponsorship">
      <div className="max-w-5xl mx-auto px-4">

        {/* Section header */}
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2 block text-center">
          Partnerships
        </span>
        <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight text-center mb-16 font-serif">
          Sponsorship <span className="italic font-normal">Opportunities</span>
        </h2>

        {/* ── Diamond Tier — full-width hero card ── */}
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden shadow-2xl">

          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none select-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">

            {/* Left — identity + price */}
            <div className="flex flex-col justify-between gap-8">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block mb-4">
                  01 · Exclusive Tier
                </span>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-serif text-3xl md:text-4xl font-light text-white tracking-tight">
                    Diamond
                  </h3>
                  <span className="font-mono text-[9px] uppercase tracking-widest bg-white text-black px-3 py-1 rounded-full font-bold">
                    Exclusive Partner
                  </span>
                </div>
                <p className="font-sans text-sm text-zinc-400 font-light leading-relaxed max-w-sm">
                  The ultimate brand partnership at HEBS Lagos 2026. Reserved for a single exclusive presenting sponsor with total event integration.
                </p>
              </div>

              <div className="border-t border-zinc-800 pt-6">
                <span className="font-sans text-5xl font-light tracking-tight text-white leading-none block">
                  $25,000
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-2 block">
                  USD · one-time · exclusive slot
                </span>
                <a
                  href="mailto:info@thehebs.com"
                  className="mt-6 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  Inquire About Diamond ↗
                </a>
              </div>
            </div>

            {/* Right — perks list */}
            <div className="border-t md:border-t-0 md:border-l border-zinc-800 pt-8 md:pt-0 md:pl-10">
              <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-5">
                Exclusive inclusions
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
              className="bg-zinc-950/40 border border-zinc-900/80 rounded-2xl p-8 flex flex-col justify-between hover:border-zinc-700 transition-all duration-300"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                    {tier.tag}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-light text-white tracking-tight mb-2">
                  {tier.name}
                </h3>
                <p className="font-sans text-xs text-zinc-400 font-light leading-relaxed mb-6">
                  {tier.description}
                </p>

                {/* Price */}
                <div className="border-t border-zinc-900 pt-6 mb-6">
                  <span className="text-4xl font-light tracking-tight text-white mb-6 block font-sans">
                    {tier.price}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    USD · one-time · per event
                  </span>
                </div>

                {/* Perks */}
                <ul className="text-sm text-zinc-400 space-y-3">
                  {tier.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="h-3.5 w-3.5 text-zinc-600 shrink-0 mt-0.5 stroke-[2]" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <a
                href="mailto:info@thehebs.com"
                className="w-full text-center py-3 rounded-xl font-medium transition-all mt-6 border border-zinc-800 hover:border-zinc-600 text-white bg-zinc-900/30 font-sans text-xs uppercase tracking-widest block"
              >
                Inquire About {tier.name} ↗
              </a>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center font-sans text-xs text-zinc-500 font-light mt-12 leading-loose">
          Sponsorship packages are subject to availability. All inquiries handled directly via email.
          <br />
          Contact:{' '}
          <a href="mailto:info@thehebs.com" className="text-zinc-200 hover:text-white transition-colors">
            info@thehebs.com
          </a>
        </p>

      </div>
    </section>
  )
}

import React from 'react'

const ticketTiers = [
  {
    name: "1-Day Pass",
    earlyPrice: "$45",
    standardPrice: "$65",
    perks: ["Access to one event day", "General sessions", "Floor networking"],
    tag: ""
  },
  {
    name: "2-Day Pass",
    earlyPrice: "$80",
    standardPrice: "$110",
    perks: ["Access to two continuous days", "All general stage sessions", "Networking events inclusion"],
    tag: ""
  },
  {
    name: "3-Day All-Inclusive",
    earlyPrice: "$175",
    standardPrice: "$250",
    perks: ["Full 3-day complete access", "All Masterclasses & Workshops", "Competitions viewing", "Networking & Gala Entry"],
    tag: "Best Value"
  },
  {
    name: "VIP Experience",
    earlyPrice: "$400",
    standardPrice: "$600",
    perks: ["Full 3-day VIP clearance", "Front-row priority seating", "Exclusive VIP lounge access", "Celebrity Meet & Greet", "Official Merchandise Package"],
    tag: "Premium Clearance"
  }
]

export default function Tickets() {
  return (
    <section className="py-32 px-6 max-w-6xl mx-auto bg-[#050505]">
      {/* Header Layout */}
      <div className="border-b border-neutral-900 pb-8 mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mb-3">Registration Portals</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight">
            Choose Your <span className="italic font-normal">Experience</span>
          </h2>
        </div>
        <p className="font-sans text-sm text-neutral-400 max-w-xs font-light leading-relaxed">
          Early bird rates are available for a limited window. Secure placement before tier limits expire.
        </p>
      </div>

      {/* Stripe-Style Structural Rows */}
      <div className="flex flex-col border-t border-neutral-900">
        {ticketTiers.map((tier, index) => (
          <div
            key={index}
            className="group flex flex-col lg:flex-row lg:items-center justify-between py-8 border-b border-neutral-900 hover:bg-neutral-950/40 transition-colors duration-200 px-4 -mx-4 rounded-sm"
          >
            {/* Title & Badge column */}
            <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
              <div className="flex items-center gap-3">
                <h3 className="font-serif text-2xl text-white font-light group-hover:text-amber-400 transition-colors">{tier.name}</h3>
                {tier.tag && (
                  <span className="font-sans text-[10px] tracking-wider uppercase bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-neutral-400 font-medium rounded-sm">
                    {tier.tag}
                  </span>
                )}
              </div>
            </div>

            {/* Inclusions Detail column */}
            <div className="w-full lg:w-2/5 mb-6 lg:mb-0">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {tier.perks.map((perk, pIdx) => (
                  <li key={pIdx} className="font-sans text-xs text-neutral-400 flex items-center font-light">
                    <span className="w-1 h-1 bg-neutral-700 rounded-full mr-2"></span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing Ledger column */}
            <div className="w-full lg:w-1/3 flex items-center justify-between lg:justify-end gap-12">
              <div className="flex gap-8">
                <div>
                  <span className="block font-sans text-[9px] uppercase tracking-wider text-neutral-600">Early Pricing</span>
                  <span className="font-sans text-lg font-medium text-white">{tier.earlyPrice}</span>
                </div>
                <div className="border-l border-neutral-950 pl-8">
                  <span className="block font-sans text-[9px] uppercase tracking-wider text-neutral-600">Standard Rate</span>
                  <span className="font-sans text-sm font-light text-neutral-500 line-through">{tier.standardPrice}</span>
                </div>
              </div>

              {/* Minimalist Flat CTA Trigger */}
              <button className="font-sans text-xs uppercase tracking-wider bg-white text-black hover:bg-neutral-200 px-5 py-3 font-medium transition-all duration-150 rounded-xs shrink-0">
                Purchase
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

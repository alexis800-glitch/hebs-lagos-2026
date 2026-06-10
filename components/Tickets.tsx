import React from 'react'

const ticketTiers = [
  {
    name: "1-Day Pass",
    earlyPrice: "$45",
    standardPrice: "$65",
    perks: ["Access to one event day", "General sessions", "Floor networking"],
    tag: "",
    link: "https://hebseventportal.net"
  },
  {
    name: "2-Day Pass",
    earlyPrice: "$80",
    standardPrice: "$110",
    perks: ["Access to two continuous days", "All general stage sessions", "Networking events inclusion"],
    tag: "",
    link: "https://hebseventportal.net"
  },
  {
    name: "3-Day All-Inclusive",
    earlyPrice: "$175",
    standardPrice: "$250",
    perks: ["Full 3-day complete access", "All Masterclasses & Workshops", "Competitions viewing", "Networking & Gala Entry"],
    tag: "Best Value",
    link: "https://hebseventportal.net"
  },
  {
    name: "VIP Experience",
    earlyPrice: "$400",
    standardPrice: "$600",
    perks: ["Full 3-day VIP clearance", "Front-row priority seating", "Exclusive VIP lounge access", "Celebrity Meet & Greet", "Official Merchandise Package"],
    tag: "Premium Clearance",
    link: "https://hebseventportal.net"
  }
]

export default function Tickets() {
  return (
    <section className="pt-8 pb-32 px-6 max-w-6xl mx-auto bg-[#050505]" id="tickets">
      {/* Header Layout */}
      <div className="border-b border-neutral-900 pb-8 mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-medium mb-3">Registration Portals</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight">
            Choose Your <span className="italic font-normal">Experience</span>
          </h2>
        </div>
        <p className="font-sans text-sm text-neutral-400 max-w-xs font-light leading-relaxed">
          Early bird rates are available for a limited window. Secure placement before tier limits expire.
        </p>
      </div>

      {/* Rows Matrix */}
      <div className="flex flex-col border-t border-neutral-900">
        {ticketTiers.map((tier, index) => (
          <div
            key={index}
            className="group flex flex-col lg:flex-row lg:items-center justify-between py-8 border-b border-neutral-900 hover:bg-neutral-950/40 transition-colors duration-200 px-4 -mx-4 rounded-sm"
          >
            {/* Title */}
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

            {/* Inclusions Stack */}
            <div className="w-full lg:w-2/5 mb-6 lg:mb-0 flex flex-col justify-center min-h-[64px]">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 w-full">
                {tier.perks.map((perk, pIdx) => (
                  <li key={pIdx} className="font-sans text-sm text-neutral-300 flex items-start font-light leading-normal">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 mr-2 shrink-0"></span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing Details */}
            <div className="w-full lg:w-1/3 flex items-center justify-between lg:justify-end gap-12">
              <div className="flex gap-8">
                <div>
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-medium mb-1">Early Pricing</span>
                  <span className="font-sans text-xl font-bold text-white">{tier.earlyPrice}</span>
                </div>
                <div className="border-l border-neutral-800 pl-8">
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-medium mb-1">Standard Rate</span>
                  <span className="font-sans text-sm font-light text-neutral-400 line-through">{tier.standardPrice}</span>
                </div>
              </div>

              {/* Secure Direct Link */}
              <a
                href={tier.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs uppercase tracking-widest bg-white text-black hover:bg-neutral-200 px-6 py-4 font-semibold transition-all duration-150 rounded-xs shrink-0 block text-center min-w-[140px]"
              >
                SECURE PASS ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

import React from 'react'

const deadlines = [
  { date: 'April 25, 2026',      label: 'International Vendor/Exhibitor Registration Deadline' },
  { date: 'May 30, 2026',        label: 'Local Vendor/Exhibitor Registration Deadline' },
  { date: 'June 15, 2026',       label: 'Final Exhibitor & Vendor Payment Deadline' },
  { date: 'October 23–25, 2026', label: 'Event Dates' },
  { date: 'Venue',               label: 'NJS Royale Convention & Suites, Lagos, Nigeria' },
]

export default function PartnershipContact() {
  return (
    <div className="max-w-5xl mx-auto mt-24 border-t border-zinc-900 pt-16 pb-24 grid grid-cols-1 md:grid-cols-2 gap-12 px-4">

      {/* Left — Direct Inquiry & Desk Info */}
      <div>
        <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight mb-4">
          Secure Your Opportunity
        </h2>

        <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium text-xs font-mono px-3 py-1.5 rounded-full mb-6 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>20% deposit required to lock in booth space</span>
        </span>

        <p className="text-zinc-300 font-medium text-sm mb-4">
          HEBS Sponsorship &amp; Vendor Relations Desk
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="mailto:exhibitors@thehebs.com"
            className="flex flex-col p-4 bg-zinc-950/50 border border-zinc-900 rounded-xl hover:border-zinc-800 transition-colors"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
              Email Address
            </span>
            <span className="font-sans text-sm text-white">exhibitors@thehebs.com</span>
          </a>

          <a
            href="tel:4843571812"
            className="flex flex-col p-4 bg-zinc-950/50 border border-zinc-900 rounded-xl hover:border-zinc-800 transition-colors"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
              Call Us
            </span>
            <span className="font-sans text-sm text-white">484-357-1812</span>
          </a>
        </div>
      </div>

      {/* Right — Critical Deadlines Timeline */}
      <div>
        <h2 className="text-lg font-medium text-white mb-6 tracking-tight">
          Important Dates &amp; Deadlines
        </h2>

        <div className="relative border-l border-zinc-800 pl-6 space-y-8 ml-2">
          {deadlines.map((item, i) => (
            <div key={i} className="relative pl-2">
              <span className="absolute top-1.5 -left-[29px] w-2 h-2 rounded-full bg-zinc-500 border border-black z-10" />
              <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-semibold block mb-0.5">
                {item.date}
              </span>
              <span className="font-sans text-sm text-zinc-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

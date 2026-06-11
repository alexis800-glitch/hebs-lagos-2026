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

        <span className="inline-block bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono px-3 py-1 rounded-full mb-6">
          20% deposit required to lock in booth space
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

        <div className="relative border-l border-zinc-800 pl-5 space-y-8">
          {deadlines.map((item, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[6px] mt-1.5 w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 block mb-1">
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

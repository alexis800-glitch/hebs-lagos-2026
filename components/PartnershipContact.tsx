import React from 'react'

const vendorInfo = [
  { title: 'Vendor & Exhibitor Registration', text: 'Limited booth spaces available. Early inquiry is recommended for best placement.' },
  { title: 'Booth Deposit',                   text: '20% deposit required to lock in booth space.' },
  { title: 'Final Payment',                   text: 'Final booth payment is due upon approval and invoice confirmation.' },
  { title: 'Event Dates',                     text: 'October 23–25, 2026' },
  { title: 'Venue',                           text: 'NJS Royale Events Center, Richland Garden Estate, Lekki-Epe Expressway, Lagos' },
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
            href="tel:+16104779635"
            className="flex flex-col p-4 bg-zinc-950/50 border border-zinc-900 rounded-xl hover:border-zinc-800 transition-colors"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
              Call Us (US / WhatsApp)
            </span>
            <span className="font-sans text-sm text-white">+1 610 477 9635</span>
          </a>
        </div>
      </div>

      {/* Right — Vendor & Exhibitor Information */}
      <div>
        <h2 className="text-lg font-medium text-white mb-6 tracking-tight">
          Important Vendor &amp; Exhibitor Information
        </h2>

        <div className="relative border-l border-zinc-800 pl-6 space-y-8 ml-2">
          {vendorInfo.map((item, i) => (
            <div key={i} className="relative pl-2">
              <span className="absolute top-1.5 -left-[29px] w-2 h-2 rounded-full bg-zinc-500 border border-black z-10" />
              <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-semibold block mb-0.5">
                {item.title}
              </span>
              <span className="font-sans text-sm text-zinc-300">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

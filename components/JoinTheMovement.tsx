import Link from 'next/link'
import { Check } from 'lucide-react'

const TOGETHER = [
  'Empower the next generation of Nigerian entrepreneurs',
  'Promote tourism and foreign investment',
  'Strengthen international trade',
  'Create employment through the beauty and creative industries',
  'Build globally competitive Nigerian beauty brands',
  'Position Lagos as the gateway to Africa’s beauty industry',
]

export default function JoinTheMovement({
  packagesHref = '/sponsors',
}: {
  packagesHref?: string
}) {
  return (
    <section id="join-the-movement" className="py-16 md:py-24 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-white/10 hover:border-white/30 transition-all duration-500 ease-out shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden">

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/4 blur-[120px] rounded-full pointer-events-none select-none" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-zinc-700/10 blur-[80px] rounded-full pointer-events-none select-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">

          {/* Left — invitation + CTAs */}
          <div className="flex flex-col justify-between gap-8">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 block mb-4">
                Sponsors &amp; Partners
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-white tracking-tight mb-4">
                Join the <span className="italic font-normal">Movement</span>
              </h2>
              <p className="font-sans text-sm text-zinc-400 font-light leading-relaxed">
                We invite multinational corporations, beauty brands, manufacturers,
                distributors, educational institutions, development organizations,
                investors, media partners, and industry leaders to join us in shaping
                the future of Nigeria&apos;s beauty economy.
              </p>
            </div>

            <div className="border-t border-zinc-800 pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={packagesHref}
                  className="inline-flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-widest bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  Explore Sponsorship Packages
                </Link>
                <a
                  href="mailto:info@thehebs.com?subject=Partnership Inquiry — HEBS Lagos 2026"
                  className="inline-flex items-center justify-center gap-1 font-sans text-xs uppercase tracking-widest text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-6 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  Partner With Us ↗
                </a>
              </div>
            </div>
          </div>

          {/* Right — together we can */}
          <div className="border-t md:border-t-0 md:border-l border-zinc-800 pt-8 md:pt-0 md:pl-10">
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-6">
              Together, we can
            </p>
            <ul className="text-sm text-zinc-400 space-y-3">
              {TOGETHER.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5 stroke-[2]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Closing statement */}
        <div className="relative z-10 border-t border-zinc-800 mt-10 pt-8 text-center">
          <p className="font-serif text-lg md:text-xl text-white font-light tracking-tight mb-2">
            More Than an Event. <span className="italic">A Movement.</span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            One Continent · One Industry · One Global Stage
          </p>
        </div>

      </div>
    </section>
  )
}

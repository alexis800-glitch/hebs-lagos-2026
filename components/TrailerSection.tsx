'use client'

import { motion } from 'framer-motion'
import { useMounted } from '@/hooks/useMounted'

const EASE = [0.25, 0.4, 0.25, 1] as const

interface TrailerSectionProps {
  /** compact=true renders a slim centred frame for the competition page */
  compact?: boolean
}

const frameStyle: React.CSSProperties = {
  border: '1px solid rgba(233,30,140,0.22)',
  boxShadow:
    '0 0 0 1px rgba(255,215,0,0.06), 0 0 60px rgba(233,30,140,0.10), 0 16px 60px rgba(0,0,0,0.70)',
}

export default function TrailerSection({ compact = false }: TrailerSectionProps) {
  const mounted = useMounted()

  /* ── Compact variant — used on the Competition page ─────────────────────── */
  if (compact) {
    return (
      <div
        className="w-full flex flex-col items-center text-center py-8 px-5"
        style={{ overflowX: 'hidden' }}
      >
        <p
          className="text-[10px] font-mono tracking-[0.25em] uppercase mb-5"
          style={{ color: '#aaaaaa' }}
        >
          Official HEBS Championships 2026 Trailer
        </p>

        {/* outer clip keeps the glow within the section */}
        <div className="relative" style={{ width: 'min(280px, 100%)', overflow: 'hidden' }}>
          {/* Soft glow — clipped by parent overflow:hidden */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(233,30,140,0.08) 0%, transparent 65%)',
              transform: 'scale(1.15)',
            }}
          />
          {/* Phone-frame container */}
          <div className="relative rounded-3xl overflow-hidden" style={frameStyle}>
            {/* w-full on the aspect wrapper ensures width inherits from the capped parent */}
            <div className="w-full aspect-[9/16] bg-zinc-900">
              <video
                src="/videos/hebs-2026-official-event-trailer.mp4"
                className="w-full h-full object-cover"
                controls
                muted
                playsInline
                preload="metadata"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── Full variant — used on the Homepage ────────────────────────────────── */
  return (
    <section
      id="trailer"
      className="py-20 md:py-28 px-5 sm:px-8"
      style={{ background: '#0d0d0d', overflowX: 'hidden' }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={mounted ? { opacity: 0, y: 32 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col md:flex-row items-center gap-12 md:gap-16 lg:gap-20"
        >
          {/* ── Text block — below video on mobile, left on desktop ───────── */}
          <div className="flex-1 text-center md:text-left order-2 md:order-1">
            <p
              className="text-xs font-mono tracking-[0.25em] uppercase mb-4"
              style={{ color: '#FFD700' }}
            >
              Official Trailer · HEBS Lagos 2026
            </p>

            <h2 className="section-title text-white mb-4">
              Watch the 2026{' '}
              <span className="gradient-text italic">Championship Preview</span>
            </h2>

            <p className="section-subtitle max-w-md mx-auto md:mx-0 mb-8">
              Experience the energy, artistry, and global stage coming to Lagos this October.
            </p>

            <a
              href="https://hebseventportal.com/register"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pink text-base"
            >
              Register Now
            </a>
          </div>

          {/* ── Video frame — top on mobile, right on desktop ─────────────── */}
          {/* outer clip keeps the glow within the section */}
          <div
            className="shrink-0 mx-auto order-1 md:order-2"
            style={{ width: 'min(320px, 100%)', overflow: 'hidden' }}
          >
            <div className="relative rounded-3xl overflow-hidden" style={frameStyle}>
              {/* Soft glow — inside overflow:hidden, won't escape to page */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(233,30,140,0.12) 0%, transparent 70%)',
                }}
              />
              {/* w-full on the aspect wrapper ensures width inherits from the capped parent */}
              <div className="w-full aspect-[9/16] bg-zinc-900">
                <video
                  src="/videos/hebs-2026-official-event-trailer.mp4"
                  className="w-full h-full object-cover"
                  controls
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CompetitionSchedule from '@/components/CompetitionSchedule'
import EventHours from '@/components/EventHours'
import {
  COMPETITION_COUNT,
  CATEGORIES,
  CATEGORY_COUNT,
  TOTAL_PRIZE_DISPLAY,
  REGISTRATION_URL,
  groupedByCategory,
  prizeDisplay,
  resolveLegacyTrack,
  isRetiredTrack,
  type CategorySlug,
  type Competition,
} from '@/lib/competitions'

type Filter = CategorySlug | 'all'

// ─── Small building blocks ────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-mono tracking-widest text-amber-400 uppercase block mb-2">
      {children}
    </span>
  )
}

function PrimaryCTA({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full sm:w-auto bg-white text-black font-semibold text-sm tracking-wide px-10 py-3 md:py-2.5 rounded-lg inline-flex items-center justify-center shadow-md hover:scale-[1.01] active:scale-[0.98] transition-transform cursor-pointer touch-manipulation select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950${className ? ` ${className}` : ''}`}
    >
      {children}
    </a>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 border-b border-white/[0.06] last:border-b-0">
      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 flex-shrink-0">
        {label}
      </span>
      <span className="text-zinc-100 text-sm text-right leading-snug">{value}</span>
    </div>
  )
}

function CompetitionCard({ competition }: { competition: Competition }) {
  const { name, description, sessions, feeDisplay, feeConfirmed, note } = competition

  return (
    <article className="flex flex-col border border-white/[0.06] bg-zinc-900/50 rounded-2xl p-6 sm:p-7 h-full">
      <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold tracking-tight leading-snug">
        {name}
      </h3>

      <div className="mt-4 flex flex-col">
        {sessions.map((s) => (
          <DetailRow
            key={`${competition.slug}-${s.isoDate}`}
            label={sessions.length > 1 ? s.shortDate : 'When'}
            value={
              sessions.length > 1
                ? `${s.time} · ${s.duration}`
                : `${s.shortDate} · ${s.time} · ${s.duration}`
            }
          />
        ))}
        <DetailRow label="Entry fee" value={feeDisplay} />
        <DetailRow label="Prize" value={prizeDisplay(competition)} />
      </div>

      {!feeConfirmed && (
        <p className="mt-3 text-[11px] leading-relaxed text-amber-300/90">
          Entry fee is confirmed at the point of registration.
        </p>
      )}
      {note && feeConfirmed && (
        <p className="mt-3 text-[11px] leading-relaxed text-zinc-400">{note}</p>
      )}

      <p className="text-zinc-300 text-sm leading-relaxed mt-4">{description}</p>

      <div className="mt-auto pt-6">
        <a
          href={competition.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          Register for {name.replace(' Competition', '')} ↗
        </a>
      </div>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function CompetitionsContent() {
  const [filter, setFilter] = useState<Filter>('all')
  const [showLegacyNotice, setShowLegacyNotice] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const track = searchParams.get('track')
    const resolved = resolveLegacyTrack(track)
    if (resolved) setFilter(resolved)
    if (isRetiredTrack(track)) setShowLegacyNotice(true)
  }, [searchParams])

  const groups = useMemo(() => {
    const all = groupedByCategory()
    return filter === 'all' ? all : all.filter((g) => g.category.slug === filter)
  }, [filter])

  const shownCount = groups.reduce((n, g) => n + g.competitions.length, 0)

  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen bg-zinc-950 text-white">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="pt-32 pb-10 px-5 sm:px-8 text-center">
          <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-3 block">
            HEBS Lagos 2026 — Competition Programme
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif font-semibold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Compete for{' '}
            <span className="italic font-normal text-zinc-300">Glory</span>
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base mt-4 max-w-sm sm:max-w-2xl mx-auto leading-relaxed px-5 sm:px-0">
            {COMPETITION_COUNT} competitions across {CATEGORY_COUNT} categories.{' '}
            {TOTAL_PRIZE_DISPLAY} in prizes. October 23–25, 2026 · Lagos, Nigeria.
          </p>
        </div>

        {/* ── Event hours ──────────────────────────────────────────────────── */}
        {/* Above the filter and the cards, so the full-day hours are read before
            any individual competition slot is. */}
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 pb-10">
          <EventHours />
        </div>

        {/* ── Category filter ──────────────────────────────────────────────── */}
        <div className="sticky top-20 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-white/[0.06]">
          <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-3">

            {/* Mobile: native select keeps seven categories usable on a small screen */}
            <div className="md:hidden">
              <label htmlFor="category-filter" className="sr-only">
                Filter competitions by category
              </label>
              <select
                id="category-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as Filter)}
                className="w-full bg-zinc-900 border border-white/10 text-white text-sm rounded-lg px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <option value="all">All categories ({COMPETITION_COUNT})</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop: filter buttons */}
            <div
              className="hidden md:flex flex-wrap items-center justify-center gap-2"
              role="group"
              aria-label="Filter competitions by category"
            >
              <button
                type="button"
                onClick={() => setFilter('all')}
                aria-pressed={filter === 'all'}
                className={`px-4 py-2 text-sm font-medium tracking-wide rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
                  filter === 'all'
                    ? 'border-white bg-white text-black'
                    : 'border-white/15 text-zinc-300 hover:text-white hover:border-white/40'
                }`}
              >
                All {COMPETITION_COUNT}
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setFilter(c.slug)}
                  aria-pressed={filter === c.slug}
                  className={`px-4 py-2 text-sm font-medium tracking-wide rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
                    filter === c.slug
                      ? 'border-white bg-white text-black'
                      : 'border-white/15 text-zinc-300 hover:text-white hover:border-white/40'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-12">

          {showLegacyNotice && (
            <p className="mb-8 text-sm text-zinc-300 border border-white/10 bg-zinc-900/40 rounded-xl px-5 py-4">
              The competition structure has been updated for 2026. All {COMPETITION_COUNT} competitions
              are listed below.
            </p>
          )}

          <p className="sr-only" aria-live="polite">
            Showing {shownCount} of {COMPETITION_COUNT} competitions.
          </p>

          <div className="flex flex-col gap-14">
            {groups.map(({ category, competitions }) => (
              <section key={category.slug} aria-labelledby={`cat-${category.slug}`}>
                <SectionLabel>
                  {competitions.length} competition{competitions.length === 1 ? '' : 's'}
                </SectionLabel>
                <h2
                  id={`cat-${category.slug}`}
                  className="font-serif text-2xl sm:text-4xl text-white font-semibold tracking-tight mb-6"
                >
                  {category.name}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {competitions.map((c) => (
                    <CompetitionCard key={c.slug} competition={c} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* ── Schedule ───────────────────────────────────────────────────── */}
          <div className="mt-20">
            <CompetitionSchedule />
          </div>

          {/* ── Registration CTA ───────────────────────────────────────────── */}
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <PrimaryCTA href={REGISTRATION_URL} className="max-w-xs mx-auto px-8 py-3.5 sm:py-2.5">
              Register Now
            </PrimaryCTA>
            <p className="text-zinc-300 text-xs font-mono font-medium max-w-xl leading-relaxed">
              Non-refundable · Registration Deadline October 15, 2026 ·{' '}
              <a
                href="mailto:competitions@hebslagos.com"
                className="hover:text-white transition-colors underline underline-offset-2"
              >
                competitions@hebslagos.com
              </a>{' '}
              | 08148414917 / 08023051810
            </p>
            <p className="text-zinc-400 text-xs font-mono max-w-md leading-relaxed">
              Competitors arrange and pay for their own travel and lodging to Lagos. HEBS provides the
              stage production.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function CompetitionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
          Loading competitions...
        </div>
      }
    >
      <CompetitionsContent />
    </Suspense>
  )
}

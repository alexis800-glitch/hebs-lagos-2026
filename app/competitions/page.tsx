'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

type Tab = 'global-crown' | 'barber' | 'braiding'

const TABS: { id: Tab; label: string }[] = [
  { id: 'global-crown', label: 'Global Crown' },
  { id: 'barber', label: 'Barber Championships' },
  { id: 'braiding', label: 'Braiding Championships' },
]

// ─── Global Crown Data ────────────────────────────────────────────────────────

const GLOBAL_STAGES = [
  {
    n: '01',
    title: 'Preselection Video Submission',
    deadline: 'Deadline: Aug 5, 2026',
    desc: <>Submit a 3-minute MP4/MOV video to <span className="font-semibold text-zinc-100">casting@hebslagos.com</span>. Show your name, category, work-in-progress clips, and a before/after transformation. Pay the $50 entry fee at hebslagos.com to complete registration.</>,
  },
  {
    n: '02',
    title: 'Public Instagram Voting',
    deadline: 'Aug 10 – Aug 18, 2026',
    desc: 'All approved submissions are posted on @haireducationbeautysummit. Voting counts likes and comments only. The top 12 artists by total engagement advance to compete live in Lagos.',
  },
  {
    n: '03',
    title: 'Live Championship Finals',
    deadline: 'October 25, 2026',
    desc: 'The 12 finalists each get 10 minutes on the main stage at NJS Royale Events Center, Richland Garden Estate, Lekki Epe Express, Lagos — presenting a full transformation combining hair, makeup, fashion, music, and storytelling before global judges, media, and a live audience.',
  },
]

const JUDGING_CRITERIA = [
  { label: 'Creative Concept & Storytelling', weight: '30%' },
  { label: 'Technical Skill & Precision', weight: '25%' },
  { label: 'Visual Impact & Innovation', weight: '25%' },
  { label: 'Stage Presence & Performance', weight: '20%' },
]

const ELIGIBLE_ARTISTS = [
  'Hairstylists',
  'Makeup Artists',
  'Nail Artists',
  'Fashion Designers',
  'Fashion Stylists',
  'Avant-Garde & Editorial Artists',
]

// ─── Barber Championships Data ────────────────────────────────────────────────

interface Division {
  n: string
  title: string
  subtitle: string
  entry: string
  time: string
  prizePool: string
  prizes: string[]
  note: string
  isTeam?: boolean
}

const BARBER_DIVISIONS: Division[] = [
  {
    n: '01',
    title: 'Fast & Flawless Challenge™',
    subtitle: 'The Ultimate Speed Competition · 15 min',
    entry: '$50 USD\n(₦70,000)',
    time: '15 min',
    prizePool: '$5,000 USD\n(₦7,000,000)',
    prizes: ['1st — $3,000 USD (₦4,200,000)', '2nd — $1,500 USD (₦2,100,000)', '3rd — $500 USD (₦700,000)'],
    note: 'Complete a clean, polished haircut under intense time pressure. Permitted: tapers, fades, burst fades, mohawks, modern cuts.',
  },
  {
    n: '02',
    title: 'Battle of the Fades™',
    subtitle: 'The Ultimate Fade Championship · 30 min',
    entry: '$50 USD\n(₦70,000)',
    time: '30 min',
    prizePool: '$5,000 USD\n(₦7,000,000)',
    prizes: ['1st — $3,000 USD (₦4,200,000)', '2nd — $1,500 USD (₦2,100,000)', '3rd — $500 USD (₦700,000)'],
    note: 'Demonstrate smooth transitions, weight control, symmetry, clean detailing, and a flawless professional finish.',
  },
  {
    n: '03',
    title: 'Freestyle Design Battle™',
    subtitle: 'Art Meets Barbering · 60 min',
    entry: '$75 USD\n(₦105,000)',
    time: '60 min',
    prizePool: '$7,500 USD\n(₦10,500,000)',
    prizes: ['1st — $4,000 USD (₦5,600,000)', '2nd — $2,500 USD (₦3,500,000)', '3rd — $1,000 USD (₦1,400,000)'],
    note: 'Hair tattoos, portrait designs, artistic patterns, cultural concepts, abstract artwork. Creativity is the brief.',
  },
  {
    n: '04',
    title: 'Barber Game™',
    subtitle: 'The Ultimate Team Battle · 2 Hours',
    entry: '$100 USD\n(₦140,000) / team',
    time: '2 hrs',
    prizePool: '$10,000 USD\n(₦14,000,000)',
    prizes: ['Winning Team — $10,000', 'Championship Trophy', 'Team Recognition'],
    note: 'Held Oct 25. Four barbers each own a designated section of one transformational look — teamwork, timing, and cohesion decide the winner.',
    isTeam: true,
  },
]

// ─── Braiding Championships Data ─────────────────────────────────────────────

interface BraidDivision extends Division {
  format: string
  featured: boolean
}

const BRAIDING_DIVISIONS: BraidDivision[] = [
  {
    n: '01',
    title: 'Fast & Flawless Braiding Challenge™',
    subtitle: 'Speed Meets Precision',
    format: 'Solo',
    entry: '$50 USD\n(₦70,000)',
    time: '30 min',
    prizePool: '$5,000 USD\n(₦7,000,000)',
    prizes: ['1st — $3,000 USD (₦4,200,000)', '2nd — $1,500 USD (₦2,100,000)', '3rd — $500 USD (₦700,000)'],
    note: 'Judged on parting precision, neatness, consistency, product control, finish quality, and time management.',
    featured: false,
  },
  {
    n: '02',
    title: 'Braids & Fades Showdown™',
    subtitle: 'Dual Discipline Team Track · $50 per Team of 1 Barber + 1 Braider',
    format: '1 Barber + 1 Braider',
    entry: '$50 USD\n(₦70,000) / team',
    time: '60 min',
    prizePool: '$7,500 USD\n(₦10,500,000)',
    prizes: ['1st — $4,000 USD (₦5,600,000)', '2nd — $2,500 USD (₦3,500,000)', '3rd — $1,000 USD (₦1,400,000)'],
    note: 'A barber and braider must create one complete transformation together — harmony between barbering and braiding artistry. Expected to be the event\'s standout audience favorite.',
    featured: true,
  },
  {
    n: '03',
    title: 'Traditional Braiding Championship™',
    subtitle: 'Honoring Culture & Heritage',
    format: 'Solo',
    entry: '$50 USD\n(₦70,000)',
    time: '60 min',
    prizePool: '$7,500 USD\n(₦10,500,000)',
    prizes: ['1st — $4,000 USD (₦5,600,000)', '2nd — $2,500 USD (₦3,500,000)', '3rd — $1,000 USD (₦1,400,000)'],
    note: 'Eligible styles: Tribal, Fulani, Ghana braids, cornrows, feed-ins, and traditional African cultural styles. Judged on technical skill and cultural authenticity.',
    featured: false,
  },
  {
    n: '04',
    title: 'Freestyle Braid Art Championship™',
    subtitle: 'Creativity Without Limits',
    format: 'Solo',
    entry: '$75 USD\n(₦105,000)',
    time: '75 min',
    prizePool: '$10,000 USD\n(₦14,000,000)',
    prizes: ['1st — $5,000 USD (₦7,000,000)', '2nd — $3,000 USD (₦4,200,000)', '3rd — $2,000 USD (₦2,800,000)'],
    note: 'Editorial braiding, avant-garde designs, fashion braiding, fantasy concepts, cultural fusion. Imagination is the only limit.',
    featured: false,
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function parsePrize(p: string) {
  const sep = ' — '
  const sepIdx = p.indexOf(sep)
  if (sepIdx === -1) return null
  const place = p.slice(0, sepIdx)
  // Only structured parse for short ordinal labels (1st, 2nd, 3rd…)
  if (!/^\d+(st|nd|rd|th)$/i.test(place)) return null
  const rest = p.slice(sepIdx + sep.length)
  const ngnMatch = rest.match(/\((₦[^)]+)\)/)
  const ngn = ngnMatch ? ngnMatch[1] : null
  const usd = ngnMatch ? rest.slice(0, ngnMatch.index).trim() : rest.trim()
  return { place, usd, ngn }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
      {children}
    </p>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-serif text-2xl sm:text-3xl text-white font-semibold tracking-tight mb-6">
      {children}
    </h3>
  )
}

function PartnerBanner({ logo, name, role, note }: { logo: string; name: string; role: string; note: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 border border-white/[0.06] bg-zinc-900/30 rounded-xl px-5 py-4">
      <div className="flex items-center gap-4 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-white/[0.08] flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-white">{logo}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-0.5">{role}</p>
          <p className="text-white font-semibold text-sm leading-snug">{name}</p>
        </div>
      </div>
      <p className="text-zinc-500 text-xs leading-relaxed max-w-sm text-left">
        {note}
      </p>
    </div>
  )
}

function StatCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-center">
      <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-[10px] font-semibold leading-snug whitespace-pre-line ${accent ? 'text-amber-500/90' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function DivisionCard({ div, featured }: { div: Division; featured?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl p-6 border transition-all duration-300 ${
        featured
          ? 'border-amber-500/30 bg-gradient-to-b from-amber-500/[0.06] to-zinc-900/60'
          : div.isTeam
          ? 'border-amber-500/20 bg-zinc-900/50'
          : 'border-white/[0.06] bg-zinc-900/50 hover:border-white/[0.12]'
      }`}
    >
      {/* Featured badge */}
      {featured && (
        <div className="-mt-1 mb-0">
          <span className="inline-block text-[9px] font-mono tracking-widest text-amber-500/90 bg-amber-500/[0.08] border border-amber-500/25 rounded-full px-3 py-1 uppercase">
            Featured Collaborative Track
          </span>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{div.n}</span>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {div.isTeam && (
            <span className="text-[9px] font-mono tracking-widest text-amber-500/80 bg-amber-500/[0.06] border border-amber-500/20 rounded-full px-2 py-0.5 uppercase">
              Team
            </span>
          )}
          {'format' in div && (
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 border border-white/[0.06] rounded-full px-2 py-0.5">
              {(div as BraidDivision).format}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <h4 className="text-white font-semibold text-base tracking-tight leading-snug">{div.title}</h4>
        <p className="text-zinc-500 text-xs mt-0.5">{div.subtitle}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 border-t border-b border-white/[0.05] py-3">
        <StatCell label="Entry" value={div.entry} />
        <StatCell label="Time" value={div.time} />
        <StatCell label="Pool" value={div.prizePool} accent />
      </div>

      {/* Prizes */}
      <div className="flex flex-col gap-2">
        {div.prizes.map((p) => {
          const parsed = parsePrize(p)
          if (!parsed) return (
            <p key={p} className="text-xs text-zinc-300 font-medium leading-snug">{p}</p>
          )
          return (
            <div key={p} className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[10px] text-zinc-500 w-7 shrink-0">{parsed.place}</span>
                <span className="text-xs font-semibold text-zinc-100 tabular-nums">{parsed.usd}</span>
              </div>
              {parsed.ngn && (
                <span className="pl-9 font-mono text-[10px] text-zinc-500 tabular-nums">{parsed.ngn}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Note */}
      <p className="text-zinc-500 text-xs leading-relaxed mt-auto">{div.note}</p>
    </div>
  )
}

function PrimaryCTA({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full sm:w-auto bg-white text-black font-semibold text-sm tracking-wide px-10 py-3 md:py-2.5 rounded-lg inline-flex items-center justify-center shadow-md hover:scale-[1.01] active:scale-[0.98] transition-transform cursor-pointer touch-manipulation select-none${className ? ` ${className}` : ''}`}
    >
      {children}
    </a>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function CompetitionsContent() {
  const [activeTab, setActiveTab] = useState<Tab>('global-crown')
  const searchParams = useSearchParams()

  useEffect(() => {
    const track = searchParams.get('track')
    if (track === 'global-crown' || track === 'barber' || track === 'braiding') {
      setActiveTab(track)
    }
  }, [searchParams])

  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen bg-zinc-950 text-white">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="pt-32 pb-10 px-5 sm:px-8 text-center">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-3 block">
            HEBS Lagos 2026 — Competition Tracks
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif font-semibold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Compete for{' '}
            <span className="italic font-normal text-zinc-300">Glory</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-lg mx-auto leading-relaxed">
            Three championship tracks. $85,000+ in prizes. One stage. Lagos, Nigeria — October 2026.
          </p>
        </div>

        {/* ── Tab Navigation ───────────────────────────────────────────────── */}
        <div className="sticky top-20 z-40 bg-zinc-950/90 backdrop-blur-md">
          <div className="w-full flex items-center justify-start md:justify-center overflow-x-auto scrollbar-none whitespace-nowrap gap-2 md:gap-6 border-b border-white/[0.06] pb-px px-4 md:px-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap flex-shrink-0 px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium tracking-wide border-b-2 transition-all duration-200 touch-manipulation select-none ${
                  activeTab === tab.id
                    ? 'border-white text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ──────────────────────────────────────────────────── */}
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-14">

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* TRACK 1: GLOBAL CROWN CHAMPIONSHIP                              */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'global-crown' && (
            <div className="flex flex-col gap-14">

              {/* Hero card */}
              <div className="border border-white/[0.06] bg-zinc-900/50 backdrop-blur-md rounded-2xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

                  {/* Left: identity */}
                  <div className="flex flex-col gap-3 flex-1">
                    <span className="text-[10px] font-mono tracking-widest text-amber-500/80 uppercase">
                      Global Crown Championship™
                    </span>
                    <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-semibold tracking-tight leading-tight">
                      Roots to Royalty™
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                      The ultimate global stage where artistry, culture, fashion, music, beauty, and performance collide into one iconic night.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 border border-white/[0.08] rounded-full px-3 py-1">
                        Oct 25, 2026
                      </span>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-amber-500/80 bg-amber-500/[0.06] border border-amber-500/20 rounded-full px-3 py-1">
                        Lagos, Nigeria
                      </span>
                      <span className="text-[10px] font-mono tracking-widest text-zinc-500 border border-white/[0.08] rounded-lg px-3 py-1 leading-snug">
                        NJS Royale Events Center, Richland Garden Estate, Lekki Epe Express, Lagos
                      </span>
                    </div>
                  </div>

                  {/* Right: prize pool */}
                  <div className="flex-shrink-0 md:text-right">
                    <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Total Prize Pool</p>
                    <p className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-tight font-mono tabular-nums">
                      $85,000
                    </p>
                    <p className="text-zinc-600 text-xs font-mono mt-1 mb-4">USD</p>
                    <div className="flex flex-col gap-2.5">
                      {[
                        { place: '1st', usd: '$20,000 USD', ngn: '₦28,000,000', color: 'text-amber-400' },
                        { place: '2nd', usd: '$10,000 USD', ngn: '₦14,000,000', color: 'text-zinc-300' },
                        { place: '3rd', usd: '$5,000 USD',  ngn: '₦7,000,000',  color: 'text-zinc-500' },
                      ].map(({ place, usd, ngn, color }) => (
                        <div key={place} className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3">
                          <span className={`font-mono text-xs ${color} tabular-nums`}>{place}</span>
                          <span className="text-white font-semibold text-sm tabular-nums">{usd}</span>
                          <span className={`font-mono text-[10px] ${color} opacity-75 tabular-nums`}>{ngn}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-Stage Timeline */}
              <div>
                <SectionLabel>Competition Process</SectionLabel>
                <SectionHeading>3-Stage Selection Process</SectionHeading>
                <div className="flex flex-col">
                  {GLOBAL_STAGES.map((stage, i) => (
                    <div key={stage.n} className="flex gap-5">
                      {/* Connector */}
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-zinc-900 border border-white/[0.10] flex items-center justify-center flex-shrink-0 z-10">
                          <span className="font-mono text-[10px] text-zinc-400">{stage.n}</span>
                        </div>
                        {i < GLOBAL_STAGES.length - 1 && (
                          <div className="w-px flex-1 bg-gradient-to-b from-white/10 to-transparent my-1 min-h-[2rem]" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pb-10 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="text-white font-medium text-sm sm:text-base leading-snug">
                            {stage.title}
                          </h4>
                          <span className="text-[9px] font-mono text-amber-500/80 bg-amber-500/[0.06] border border-amber-500/20 rounded-full px-2.5 py-0.5 whitespace-nowrap">
                            {stage.deadline}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed">{stage.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who Can Enter + Judging */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="border border-white/[0.06] bg-zinc-900/50 rounded-2xl p-6">
                  <SectionLabel>Who Can Enter</SectionLabel>
                  <ul className="flex flex-col gap-2.5 mt-3">
                    {ELIGIBLE_ARTISTS.map((cat) => (
                      <li key={cat} className="flex items-center gap-2.5 text-sm text-zinc-300">
                        <span className="w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                        {cat}
                      </li>
                    ))}
                  </ul>
                  <p className="text-zinc-600 text-xs font-mono mt-5 leading-relaxed">
                    Open worldwide — every country, every background.
                  </p>
                </div>

                <div className="border border-white/[0.06] bg-zinc-900/50 rounded-2xl p-6">
                  <SectionLabel>Live Round Judging Criteria</SectionLabel>
                  <div className="flex flex-col gap-4 mt-3">
                    {JUDGING_CRITERIA.map((c) => (
                      <div key={c.label} className="flex items-center justify-between gap-4">
                        <span className="text-zinc-300 text-sm leading-snug">{c.label}</span>
                        <span className="text-white font-mono text-sm font-semibold flex-shrink-0 tabular-nums">
                          {c.weight}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-zinc-600 text-xs font-mono mt-5 leading-relaxed">
                    Finalists arrange own travel and lodging. HEBS provides full stage production.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="w-full px-5 flex flex-col items-center justify-center gap-3 pt-2 text-center">
                <PrimaryCTA
                  href="https://hebseventportal.com"
                  className="w-full sm:w-auto max-w-xs mx-auto px-8 py-3.5 sm:py-2.5"
                >
                  <span className="sm:hidden">Register Now</span>
                  <span className="hidden sm:inline">Register Now — $50 USD / ₦70,000</span>
                </PrimaryCTA>
                <p className="text-zinc-600 text-xs font-mono">
                  Non-refundable · Deadline August 5, 2026 · questions: competitions@hebslagos.com
                </p>
                <p className="text-zinc-600 text-[11px] font-mono text-center max-w-md leading-relaxed mt-1">
                  * Finalists are responsible for their own travel and lodging to Lagos. HEBS provides premium stage production.
                </p>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* TRACK 2: BARBER CHAMPIONSHIPS                                   */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'barber' && (
            <div className="flex flex-col gap-12">

              {/* Header */}
              <div>
                <SectionLabel>Track 2 — October 24, 2026</SectionLabel>
                <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl font-semibold text-white tracking-tight leading-tight mb-3 mt-1">
                  Barber Championships™
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                  Africa&apos;s biggest barbering competition — bringing together professional and student barbers from Nigeria, Africa, and beyond for a high-energy battle of speed, precision, creativity, and technical excellence.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 border border-white/[0.08] rounded-full px-3 py-1">
                    October 24, 2026 | 1:00 PM – 7:00 PM
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 border border-white/[0.08] rounded-full px-3 py-1">
                    NJS Royale Beach Resort · Lagos
                  </span>
                </div>
              </div>

              {/* Partner banner */}
              <PartnerBanner
                logo="M"
                name="Men's Pro Tools™"
                role="Official Equipment Partner"
                note="All competitors use HEBS-supplied Men's Pro Tools. Personal clippers and trimmers are not permitted during competition rounds."
              />

              {/* Equipment Regulation */}
              <div className="border border-zinc-600/50 bg-zinc-900 rounded-xl px-6 py-5">
                <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2.5">
                  Equipment Regulation
                </p>
                <p className="text-sm text-zinc-200 leading-relaxed">
                  Powered by{' '}
                  <span className="font-semibold text-zinc-100">Men&apos;s Pro Tools™</span>.
                  All barbers will be supplied official clippers and trimmers on stage.{' '}
                  <span className="text-white font-semibold">Personal cutting machinery is strictly prohibited.</span>
                </p>
              </div>

              {/* General rules */}
              <div className="bg-zinc-900/30 border border-white/[0.06] rounded-xl px-6 py-4">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Must bring your own models.{' '}
                  <span className="text-white font-medium">Arrive 1 hour before start time — no exceptions.</span>{' '}
                  Open to professionals, students, apprentices, and educators.{' '}
                  <span className="text-white font-medium">Minimum age: 16.</span>
                </p>
              </div>

              {/* Divisions grid */}
              <div>
                <SectionLabel>Competition Divisions</SectionLabel>
                <SectionHeading>4 Divisions · $27,500 in Prizes</SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  {BARBER_DIVISIONS.map((div) => (
                    <DivisionCard key={div.n} div={div} />
                  ))}
                </div>
              </div>

              {/* Equipment callout */}
              <div className="border border-white/[0.06] bg-zinc-900/30 rounded-xl p-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-3">
                  Official Competition Equipment
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    "Men's Apex Sovereign™ Clipper",
                    "Men's Ghost™ Trimmer",
                    "Men's Competition Guards",
                    "Men's Charging Stations",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-white/30 mt-1.5 flex-shrink-0" />
                      <p className="text-zinc-400 text-xs leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <PrimaryCTA
                  href="https://hebseventportal.com"
                  className="max-w-xs mx-auto px-5 py-4 leading-snug"
                >
                  <span className="sm:hidden text-sm font-semibold text-center">Register Now</span>
                  <span className="hidden sm:inline">Register for Barber Championships</span>
                </PrimaryCTA>
                <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1 text-center leading-relaxed">
                  Entry fees from $50 USD per division
                </p>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* TRACK 3: BRAIDING CHAMPIONSHIPS                                 */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'braiding' && (
            <div className="flex flex-col gap-12">

              {/* Coming 2027 Banner */}
              <div className="w-full border border-amber-500/25 bg-gradient-to-r from-zinc-900/90 via-amber-500/[0.07] to-zinc-900/90 rounded-2xl px-6 py-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-9 h-9 rounded-full border border-amber-500/30 bg-amber-500/[0.08] flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-500 text-sm font-bold">!</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-400 font-semibold text-sm tracking-wide">
                      Scheduled for May 24, 2027 — Independent Spring Track
                    </p>
                    <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                      The Braiding Championships are a separate event scheduled for May 24, 2027 at NJS Royale Beach Resort, Lagos. Registration details will be announced closer to the date.
                    </p>
                  </div>
                  <span className="hidden sm:inline-block flex-shrink-0 text-[10px] font-mono text-amber-500/70 border border-amber-500/20 rounded-full px-3 py-1.5 whitespace-nowrap">
                    May 24, 2027
                  </span>
                </div>
              </div>

              {/* Header */}
              <div>
                <SectionLabel>Track 3 — May 24, 2027</SectionLabel>
                <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl font-semibold text-white tracking-tight leading-tight mb-3 mt-1">
                  Braiding Championships™
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                  Africa&apos;s premier braiding competition — celebrating the extraordinary skill, creativity, speed, and innovation of professional braiders from across Africa and the world while honouring one of the oldest beauty traditions.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 border border-white/[0.08] rounded-full px-3 py-1">
                    May 24, 2027 · 1:00 PM – 7:00 PM
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 border border-white/[0.08] rounded-full px-3 py-1">
                    NJS Royale Beach Resort · Lagos
                  </span>
                </div>
              </div>

              {/* Partner banner */}
              <PartnerBanner
                logo="P"
                name="PureO Natural Products™"
                role="Official Styling Partner"
                note="All styling and finishing products used during competition must be official PureO products. Own combs, brushes, tools, and extensions are permitted."
              />

              {/* Product Regulation */}
              <div className="border border-zinc-600/50 bg-zinc-900 rounded-xl px-6 py-5">
                <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2.5">
                  Product Regulation
                </p>
                <p className="text-sm text-zinc-200 leading-relaxed">
                  Powered by{' '}
                  <span className="font-semibold text-zinc-100">PureO Natural Products™</span>.
                  Finishing and styling gels will be provided by HEBS.{' '}
                  <span className="text-white font-medium">Competitors bring personal combs and extension hair pieces.</span>
                </p>
              </div>

              {/* Divisions grid */}
              <div>
                <SectionLabel>Competition Divisions</SectionLabel>
                <SectionHeading>4 Divisions · $30,000 in Prizes</SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  {BRAIDING_DIVISIONS.map((div) => (
                    <DivisionCard key={div.n} div={div} featured={div.featured} />
                  ))}
                </div>
              </div>

              {/* Who can enter */}
              <div className="border border-white/[0.06] bg-zinc-900/50 rounded-2xl p-6">
                <SectionLabel>Who Can Enter</SectionLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                  {[
                    'Professional Braiders',
                    'Student Braiders',
                    'Salon Owners',
                    'Natural Hair Stylists',
                    'Locticians',
                    'International Competitors',
                  ].map((who) => (
                    <div key={who} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-500/70 flex-shrink-0" />
                      <span className="text-zinc-300 text-xs leading-relaxed">{who}</span>
                    </div>
                  ))}
                </div>
                <p className="text-zinc-600 text-xs font-mono mt-4">Minimum age: 16 years old.</p>
              </div>

              {/* CTA */}
              <div className="w-full px-5 flex flex-col items-center justify-center gap-3 pt-2 text-center">
                <p className="text-amber-400 text-xs font-mono tracking-widest uppercase">
                  OFFICIAL REGISTRATION IS NOW OPEN
                </p>
                <PrimaryCTA
                  href="https://hebseventportal.com"
                  className="w-[85%] max-w-xs mx-auto py-4"
                >
                  Register Now
                </PrimaryCTA>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed tracking-normal max-w-sm mx-auto">
                  Secure your competitive track placement today. Limited stage entries available for international and local professionals.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}

export default function CompetitionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">Loading tracks...</div>}>
      <CompetitionsContent />
    </Suspense>
  )
}

import React from 'react'
import Navbar from '@/components/Navbar'
import PrizeGrid from '@/components/PrizeGrid'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crowned Icons Showdown — HEBS 2026',
  description: 'Global Crown Championship. Solo creative event competing for $35,000 USD (₦49,000,000) in prizes at HEBS Lagos 2026. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
  alternates: { canonical: '/competition/crowned-icons' },
  openGraph: {
    title: 'Crowned Icons Showdown — HEBS 2026',
    description: 'Global Crown Championship — $35,000 USD (₦49,000,000) in prizes. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
    url: '/competition/crowned-icons',
    images: [
      {
        url: '/images/og/hebs-lagos-2026-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Crowned Icons Showdown — HEBS Lagos 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crowned Icons Showdown — HEBS 2026',
    description: 'Global Crown Championship — $35,000 USD (₦49,000,000) in prizes. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
    images: ['/images/og/hebs-lagos-2026-og.jpg'],
  },
}

export default function CrownedPage() {
  return (
    <main className="bg-[#050505] min-h-screen pt-24">
      <Navbar />
      <PrizeGrid initialTab="crowned" isSubPage={true} />
    </main>
  )
}

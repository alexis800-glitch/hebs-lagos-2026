import React from 'react'
import Navbar from '@/components/Navbar'
import PrizeGrid from '@/components/PrizeGrid'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Barbering & Styling Battles — HEBS 2026',
  description: '6 hyper-focused individual battle categories testing precision speed and creative craftsmanship at HEBS Lagos 2026. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
  alternates: { canonical: '/competition/barber-battles' },
  openGraph: {
    title: 'Barbering & Styling Battles — HEBS 2026',
    description: '6 individual battle categories testing precision, speed, and creative craftsmanship. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
    url: '/competition/barber-battles',
    images: [
      {
        url: '/images/og/hebs-lagos-2026-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Barbering & Styling Battles — HEBS Lagos 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barbering & Styling Battles — HEBS 2026',
    description: '6 individual battle categories testing precision, speed, and creative craftsmanship. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
    images: ['/images/og/hebs-lagos-2026-og.jpg'],
  },
}

export default function BarberPage() {
  return (
    <main className="bg-[#050505] min-h-screen pt-24">
      <Navbar />
      <PrizeGrid initialTab="barber" isSubPage={true} />
    </main>
  )
}

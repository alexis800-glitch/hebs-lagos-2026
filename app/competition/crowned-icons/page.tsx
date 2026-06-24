import React from 'react'
import Navbar from '@/components/Navbar'
import PrizeGrid from '@/components/PrizeGrid'

export const metadata = {
  title: 'Crowned Icons Showdown — HEBS 2026',
  description: 'Global Team Runway Championship. 5-discipline teams compete for $85,000 USD (₦119,000,000) in prizes at HEBS Lagos 2026.',
}

export default function CrownedPage() {
  return (
    <main className="bg-[#050505] min-h-screen pt-24">
      <Navbar />
      <PrizeGrid initialTab="crowned" isSubPage={true} />
    </main>
  )
}

import React from 'react'
import Navbar from '@/components/Navbar'
import PrizeGrid from '@/components/PrizeGrid'

export const metadata = {
  title: 'Barbering & Styling Battles — HEBS 2026',
  description: '6 hyper-focused individual battle categories testing precision speed and creative craftsmanship at HEBS Lagos 2026.',
}

export default function BarberPage() {
  return (
    <main className="bg-[#050505] min-h-screen pt-24">
      <Navbar />
      <PrizeGrid initialTab="barber" isSubPage={true} />
    </main>
  )
}

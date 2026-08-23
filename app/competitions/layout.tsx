import type { Metadata } from 'next'
import {
  COMPETITION_COUNT,
  CATEGORY_COUNT,
  TOTAL_PRIZE_USD_DISPLAY,
  TOTAL_PRIZE_NGN_DISPLAY,
} from '@/lib/competitions'

/** "$87,500 USD (₦122,500,000) in prizes" — derived so metadata can never drift. */
const PRIZE_PHRASE = `${TOTAL_PRIZE_USD_DISPLAY} USD (${TOTAL_PRIZE_NGN_DISPLAY}) in prizes`

export const metadata: Metadata = {
  title: 'Competitions — HEBS Lagos 2026',
  description:
    `Compete at the Hair Education Beauty Summit Lagos 2026 — ${COMPETITION_COUNT} competitions across ${CATEGORY_COUNT} categories: barbering, braiding, hair installation and styling, beauty, fashion, culinary and culture, and loc styling. ${PRIZE_PHRASE}. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.`,
  alternates: { canonical: '/competitions' },
  openGraph: {
    title: 'Competitions — HEBS Lagos 2026',
    description:
      `${COMPETITION_COUNT} competitions across ${CATEGORY_COUNT} categories — barbering, braiding, frontals, beauty, fashion, food and loc styling. ${PRIZE_PHRASE}. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.`,
    url: '/competitions',
    images: [
      {
        url: '/images/og/hebs-lagos-2026-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Competitions — HEBS Lagos 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Competitions — HEBS Lagos 2026',
    description:
      `${COMPETITION_COUNT} competitions across ${CATEGORY_COUNT} categories — barbering, braiding, frontals, beauty, fashion, food and loc styling. ${PRIZE_PHRASE}. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.`,
    images: ['/images/og/hebs-lagos-2026-og.jpg'],
  },
}

export default function CompetitionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

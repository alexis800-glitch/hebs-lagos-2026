import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Competitions — HEBS Lagos 2026',
  description:
    'Compete at the Hair Education Beauty Summit Lagos 2026 — Roots to Royalty, barbering, styling, makeup, and nail art divisions with $92,500 USD (₦129,500,000) in prizes. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
  alternates: { canonical: '/competitions' },
  openGraph: {
    title: 'Competitions — HEBS Lagos 2026',
    description:
      '$92,500 USD (₦129,500,000) in prizes across hair, barbering, makeup, and nail art divisions. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
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
      '$92,500 USD (₦129,500,000) in prizes across hair, barbering, makeup, and nail art divisions. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
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

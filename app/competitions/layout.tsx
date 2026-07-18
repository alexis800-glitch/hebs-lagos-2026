import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Competitions — HEBS Lagos 2026',
  description:
    'Compete at the Hair Education Beauty Summit Lagos 2026 — Fashion Runway, makeup artistry, nail artistry, barbering, and braiding competitions with $80,000 USD (₦112,000,000) in prizes. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
  alternates: { canonical: '/competitions' },
  openGraph: {
    title: 'Competitions — HEBS Lagos 2026',
    description:
      '$80,000 USD (₦112,000,000) in prizes across Fashion Runway, makeup, nail, barbering, and braiding competitions. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
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
      '$80,000 USD (₦112,000,000) in prizes across Fashion Runway, makeup, nail, barbering, and braiding competitions. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
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

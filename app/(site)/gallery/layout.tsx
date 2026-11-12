import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery — HEBS Lagos 2026',
  description:
    'Moments from the Hair Education Beauty Summit — competition stages, winners, and highlights from past editions as HEBS comes home to Lagos for 2026.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Gallery — HEBS Lagos 2026',
    description:
      'Competition stages, winners, and highlights from the Hair Education Beauty Summit.',
    url: '/gallery',
    images: [
      {
        url: '/images/og/hebs-lagos-2026-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Gallery — HEBS Lagos 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gallery — HEBS Lagos 2026',
    description:
      'Competition stages, winners, and highlights from the Hair Education Beauty Summit.',
    images: ['/images/og/hebs-lagos-2026-og.jpg'],
  },
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

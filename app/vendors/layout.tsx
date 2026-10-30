import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vendor Booths — HEBS Lagos 2026',
  description:
    'The exhibition booths offered for the Hair Education Beauty Summit Lagos 2026, held October 23–25, 2026 at NJS Royale Events Center, Lagos, Nigeria. These booths are no longer available.',
  alternates: { canonical: '/vendors' },
  openGraph: {
    title: 'Vendor Booths — HEBS Lagos 2026',
    description:
      'The exhibition booths offered for HEBS Lagos 2026. Held October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
    url: '/vendors',
    images: [
      {
        url: '/images/og/hebs-lagos-2026-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Vendor Booths — HEBS Lagos 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vendor Booths — HEBS Lagos 2026',
    description:
      'The exhibition booths offered for HEBS Lagos 2026. Held October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
    images: ['/images/og/hebs-lagos-2026-og.jpg'],
  },
}

export default function VendorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

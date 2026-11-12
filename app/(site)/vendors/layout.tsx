import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vendor Opportunities — HEBS Lagos 2026',
  description:
    'Exhibit at the Hair Education Beauty Summit Lagos 2026. Booth packages for beauty brands, product lines, and service providers. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
  alternates: { canonical: '/vendors' },
  openGraph: {
    title: 'Vendor Opportunities — HEBS Lagos 2026',
    description:
      'Exhibit your brand at HEBS Lagos 2026. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
    url: '/vendors',
    images: [
      {
        url: '/images/og/hebs-lagos-2026-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Vendor Opportunities — HEBS Lagos 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vendor Opportunities — HEBS Lagos 2026',
    description:
      'Exhibit your brand at HEBS Lagos 2026. October 23–25, 2026 · NJS Royale Events Center, Lagos, Nigeria.',
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

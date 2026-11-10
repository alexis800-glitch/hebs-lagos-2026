import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Gallery — HEBS Legacy | Hair Education Beauty Summit",
  description:
    "Photos and videos from past Hair Education Beauty Summit editions in New Jersey, USA — the legacy behind the Lagos 2026 homecoming.",
  alternates: { canonical: "/hebs-legacy/media-gallery" },
  openGraph: {
    title: "Media Gallery — HEBS Legacy | Hair Education Beauty Summit",
    description:
      "Photos and videos from the 2024 and 2025 editions in New Jersey, USA — the legacy behind the Lagos 2026 homecoming.",
    url: "/hebs-legacy/media-gallery",
    images: [
      {
        url: "/images/og/hebs-lagos-2026-og.jpg",
        width: 1200,
        height: 630,
        alt: "HEBS Legacy Media Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Media Gallery — HEBS Legacy | Hair Education Beauty Summit",
    description:
      "Photos and videos from the 2024 and 2025 editions in New Jersey, USA — the legacy behind the Lagos 2026 homecoming.",
    images: ["/images/og/hebs-lagos-2026-og.jpg"],
  },
};

export default function MediaGalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HEBS 2025 — New Jersey, USA | Hair Education Beauty Summit",
  description:
    "Relive the sold-out HEBS 2025 in New Jersey, USA — winners, awards night, and stage highlights from the edition that set the stage for the Lagos homecoming in 2026.",
  alternates: { canonical: "/hebs-legacy/2025" },
  openGraph: {
    title: "HEBS 2025 — New Jersey, USA | Hair Education Beauty Summit",
    description:
      "The sold-out 2025 edition in New Jersey, USA — winners, awards night, and stage highlights before HEBS comes home to Lagos for 2026.",
    url: "/hebs-legacy/2025",
    images: [
      {
        url: "/images/og/hebs-lagos-2026-og.jpg",
        width: 1200,
        height: 630,
        alt: "HEBS 2025 Legacy — New Jersey, USA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HEBS 2025 — New Jersey, USA | Hair Education Beauty Summit",
    description:
      "The sold-out 2025 edition in New Jersey, USA — winners, awards night, and stage highlights before HEBS comes home to Lagos for 2026.",
    images: ["/images/og/hebs-lagos-2026-og.jpg"],
  },
};

export default function Legacy2025Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

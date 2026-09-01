import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import TrackingConsent from "@/components/TrackingConsent";
import {
  COMPETITION_COUNT,
  CATEGORY_COUNT,
  TOTAL_PRIZE_USD_DISPLAY,
  TOTAL_PRIZE_NGN_DISPLAY,
} from "@/lib/competitions";

/** "$87,500 USD (₦122,500,000) in prizes" — derived so metadata can never drift. */
const PRIZE_PHRASE = `${TOTAL_PRIZE_USD_DISPLAY} USD (${TOTAL_PRIZE_NGN_DISPLAY}) in prizes`;

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hebslagos.com"),
  title: "HEBS 2026 — Hair Education Beauty Summit | Lagos, Nigeria",
  description:
    `After three United States editions, including a sold-out edition from 2–4 May 2026, the Hair Education Beauty Summit comes home to Lagos for its fourth edition. ${COMPETITION_COUNT} competitions across ${CATEGORY_COUNT} categories, October 23–25, 2026 at NJS Royale Events Center, Richland Garden Estate, Lekki-Epe Expressway, Lagos. ${PRIZE_PHRASE}.`,
  keywords: [
    "HEBS",
    "Hair Education Beauty Summit",
    "Lagos",
    "Nigeria",
    "beauty summit",
    "hair competition",
    "2026",
  ],
  openGraph: {
    title: "HEBS 2026 — Hair Education Beauty Summit",
    description: `${COMPETITION_COUNT} competitions. ${PRIZE_PHRASE}. October 23–25, 2026. Lagos, Nigeria.`,
    type: "website",
    url: "https://hebslagos.com",
    siteName: "HEBS Lagos 2026",
    images: [
      {
        url: "/images/og/hebs-lagos-2026-og.jpg",
        width: 1200,
        height: 630,
        alt: "HEBS Lagos 2026 — Hair Education Beauty Summit, October 23–25 at NJS Royale Events Center, Richland Garden Estate, Lekki-Epe Expressway, Lagos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HEBS 2026 — Hair Education Beauty Summit",
    description: `${COMPETITION_COUNT} competitions. ${PRIZE_PHRASE}. October 23–25, 2026. Lagos, Nigeria.`,
    images: ["/images/og/hebs-lagos-2026-og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${GeistSans.variable} ${GeistMono.variable} ${cormorant.variable} font-sans antialiased bg-[#050505] text-white`}>
        {children}
        {/*
          The Meta Pixel used to load here on every page view, alongside a
          <noscript> beacon, with no consent step. Both are gone: the pixel now
          loads only from inside TrackingConsent, and only once the visitor has
          accepted. The noscript beacon was not kept behind the gate but removed
          outright - a visitor without JavaScript cannot have made a choice, so
          firing it would be tracking without consent.
        */}
        <TrackingConsent />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
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

// Cormorant Garamond is served from files in the repo (app/fonts/cormorant,
// SIL Open Font License, latin subset from @fontsource/cormorant-garamond 5.1.0)
// rather than fetched from Google Fonts at build time. The build-time fetch made
// builds fail when Google was unreachable, and on one Vercel preview a cached and
// a fresh response gave the HTML and CSS different font hashes, so every serif
// heading fell back to sans-serif. Local files make the build deterministic.
// Same weights, styles and latin character range as the previous Google setup
// (font loader options must be literals, so the range is written inline).

const cormorant = localFont({
  src: [
    { path: "./fonts/cormorant/cormorant-garamond-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/cormorant/cormorant-garamond-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "./fonts/cormorant/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/cormorant/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/cormorant/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cormorant/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "./fonts/cormorant/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/cormorant/cormorant-garamond-latin-600-italic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
    },
  ],
  adjustFontFallback: "Times New Roman",
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

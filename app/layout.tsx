import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

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
    "The Hair Education Beauty Summit returns for Year 3. October 23–25, 2026 at NJS Royale Events Center, Richland Garden Estate, Lekki-Epe Expressway, Lagos. $92,500 USD (₦129,500,000) in prizes.",
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
    description: "$92,500 USD (₦129,500,000) in prizes. October 23–25, 2026. Lagos, Nigeria.",
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
    description: "$92,500 USD (₦129,500,000) in prizes. October 23–25, 2026. Lagos, Nigeria.",
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
      </body>
    </html>
  );
}

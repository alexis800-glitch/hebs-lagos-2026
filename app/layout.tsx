import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "HEBS 2026 — Hair Education Beauty Summit | Lagos, Nigeria",
  description:
    "The Hair Education Beauty Summit returns for Year 3. October 23–25, 2026 at NJS Royale Convention & Suites, Lagos Nigeria. $35,000 in prizes.",
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
    description: "$35,000 Grand Prize. October 23–25, 2026. Lagos, Nigeria.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

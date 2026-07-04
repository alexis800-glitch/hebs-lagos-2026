import type { Metadata } from "next";
import Script from "next/script";
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
    "After two sold-out editions in New Jersey, USA, the Hair Education Beauty Summit comes home to Lagos for Year 3. October 23–25, 2026 at NJS Royale Events Center, Richland Garden Estate, Lekki-Epe Expressway, Lagos. $92,500 USD (₦129,500,000) in prizes.",
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
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1921219138538371');
          fbq('track', 'PageView');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1921219138538371&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}

import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Footer from "@/components/Footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the Summit — HEBS Lagos 2026",
  description:
    "The Hair Education Beauty Summit launched in New Jersey, USA in 2024, returned in 2025 with a sold-out edition, and comes home to Lagos for 2026. Learn about our mission, legacy, and vision.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About the Summit — HEBS Lagos 2026",
    description:
      "From New Jersey, USA in 2024 to a sold-out 2025 — HEBS comes home to Lagos, October 23–25, 2026.",
    url: "/about",
    images: [
      {
        url: "/images/og/hebs-lagos-2026-og.jpg",
        width: 1200,
        height: 630,
        alt: "About HEBS — Hair Education Beauty Summit Lagos 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About the Summit — HEBS Lagos 2026",
    description:
      "From New Jersey, USA in 2024 to a sold-out 2025 — HEBS comes home to Lagos, October 23–25, 2026.",
    images: ["/images/og/hebs-lagos-2026-og.jpg"],
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen bg-black text-white pt-36 pb-16 px-6 max-w-6xl mx-auto">
        <About />
        <Footer />
      </main>
    </>
  );
}

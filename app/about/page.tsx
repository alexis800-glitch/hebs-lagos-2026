import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Footer from "@/components/Footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the Summit — HEBS Lagos 2026",
  description:
    "After United States editions in 2024 and 2025, and another sold-out edition from 2–4 May 2026, the Hair Education Beauty Summit comes home to Lagos for its fourth edition. Learn about our mission, legacy, and vision.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About the Summit — HEBS Lagos 2026",
    description:
      "After three United States editions, including a sold-out edition from 2–4 May 2026, HEBS comes home to Lagos for its fourth edition. October 23–25, 2026.",
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
      "After three United States editions, including a sold-out edition from 2–4 May 2026, HEBS comes home to Lagos for its fourth edition. October 23–25, 2026.",
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

import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Inquiries — HEBS Lagos 2026",
  description:
    "Get in touch with the HEBS team. General inquiries, sponsorship questions, vendor applications, and media requests.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact & Inquiries — HEBS Lagos 2026",
    description:
      "Get in touch with the HEBS team. General inquiries, sponsorship questions, vendor applications, and media requests.",
    url: "/contact",
    images: [
      {
        url: "/images/og/hebs-lagos-2026-og.jpg",
        width: 1200,
        height: 630,
        alt: "Contact — HEBS Lagos 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Inquiries — HEBS Lagos 2026",
    description:
      "Get in touch with the HEBS team. General inquiries, sponsorship questions, vendor applications, and media requests.",
    images: ["/images/og/hebs-lagos-2026-og.jpg"],
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen bg-black text-white pt-32 px-4">
        <Contact />
        <Footer />
      </main>
    </>
  );
}

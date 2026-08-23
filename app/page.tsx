import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventSchedule from "@/components/EventSchedule";
import EventHighlights from "@/components/EventHighlights";
import CompetitionCategories from "@/components/CompetitionCategories";
import WhyAttend from "@/components/WhyAttend";
import WhyHebsMatters from "@/components/WhyHebsMatters";
import JoinTheMovement from "@/components/JoinTheMovement";
import TestimonialsSection from "@/components/TestimonialsSection";
import GallerySection from "@/components/GallerySection";
import HEBSAssistant from "@/components/HEBSAssistant";
import Footer from "@/components/Footer";
import { COMPETITIONS, COMPETITION_COUNT, CATEGORY_COUNT, eventDay } from "@/lib/competitions";

export const metadata: Metadata = {
  title: "HEBS 2026 — Hair Education Beauty Summit | Lagos, Nigeria",
  description:
    `After United States editions in 2024 and 2025, and another sold-out edition from 2–4 May 2026, HEBS comes home to Lagos for its fourth edition. ${COMPETITION_COUNT} competitions, October 23–25, 2026 at NJS Royale Events Center, Lagos, Nigeria.`,
  alternates: { canonical: "/" },
  openGraph: {
    title: "HEBS 2026 — Hair Education Beauty Summit | Lagos, Nigeria",
    description:
      `After three United States editions, including a sold-out edition from 2–4 May 2026, HEBS comes home to Lagos for its fourth edition. ${COMPETITION_COUNT} competitions · October 23–25, 2026 · Lagos, Nigeria.`,
    url: "/",
    images: [
      {
        url: "/images/og/hebs-lagos-2026-og.jpg",
        width: 1200,
        height: 630,
        alt: "HEBS Lagos 2026 — Hair Education Beauty Summit, October 23–25, 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HEBS 2026 — Hair Education Beauty Summit | Lagos, Nigeria",
    description:
      `After three United States editions, including a sold-out edition from 2–4 May 2026, HEBS comes home to Lagos for its fourth edition. ${COMPETITION_COUNT} competitions · October 23–25, 2026 · Lagos, Nigeria.`,
    images: ["/images/og/hebs-lagos-2026-og.jpg"],
  },
};

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Hair Education Beauty Summit Lagos 2026",
  description:
    `After United States editions in 2024 and 2025, and another sold-out edition from 2–4 May 2026, HEBS comes home to Lagos for its fourth edition. Three days of hair education, ${COMPETITION_COUNT} competitions across ${CATEGORY_COUNT} categories, and industry celebration.`,
  startDate: "2026-10-23T14:00:00+01:00",
  endDate: "2026-10-25T17:00:00+01:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  image: ["https://hebslagos.com/images/og/hebs-lagos-2026-og.jpg"],
  location: {
    "@type": "Place",
    name: "NJS Royale Events Center",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Richland Garden Estate, Lekki-Epe Expressway",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Hair Education Beauty Summit",
    url: "https://hebslagos.com",
  },
  offers: {
    "@type": "Offer",
    url: "https://hebseventportal.com/register",
    availability: "https://schema.org/InStock",
  },
  subEvent: [
    {
      "@type": "Event",
      name: "HEBS Welcome Beach Pre-Party",
      startDate: "2026-10-23T14:00:00+01:00",
      endDate: "2026-10-23T19:00:00+01:00",
      location: {
        "@type": "Place",
        name: "NJS Royale Beach Resort",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lagos",
          addressCountry: "NG",
        },
      },
    },
    {
      "@type": "Event",
      name: eventDay("2026-10-24").title,
      startDate: eventDay("2026-10-24").opensIso,
      endDate: eventDay("2026-10-24").closesIso,
      location: {
        "@type": "Place",
        name: "NJS Royale Events Center",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Richland Garden Estate, Lekki-Epe Expressway",
          addressLocality: "Lagos",
          addressCountry: "NG",
        },
      },
    },
    {
      "@type": "Event",
      name: eventDay("2026-10-25").title,
      startDate: eventDay("2026-10-25").opensIso,
      endDate: eventDay("2026-10-25").closesIso,
      location: {
        "@type": "Place",
        name: "NJS Royale Events Center",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Richland Garden Estate, Lekki-Epe Expressway",
          addressLocality: "Lagos",
          addressCountry: "NG",
        },
      },
    },
    // Per-competition sub-events, derived from the shared source. Entry fees are
    // deliberately not published as schema.org offers: the portal is the single
    // place a fee is quoted and paid, so it must not be mirrored in metadata.
    ...COMPETITIONS.flatMap((c) =>
      c.sessions.map((s) => ({
        "@type": "Event",
        name: c.name,
        description: c.description,
        startDate: s.startIso,
        endDate: s.endIso,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: "NJS Royale Events Center",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Richland Garden Estate, Lekki-Epe Expressway",
            addressLocality: "Lagos",
            addressCountry: "NG",
          },
        },
      })),
    ),
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <link rel="preload" as="image" href="/images/hero/hebs-hero-competition-desktop-v1-poster.jpg" type="image/jpeg" media="(orientation: landscape)" fetchPriority="high" />
      <link rel="preload" as="image" href="/images/hero/hebs-hero-competition-mobile-v3-poster.jpg" type="image/jpeg" media="(orientation: portrait)" fetchPriority="high" />
      <Navbar />
      <main style={{ background: "#0d0d0d", overflowX: "hidden" }}>
        <Hero />
        <EventSchedule />
        <EventHighlights />
        <CompetitionCategories />
        <WhyAttend />
        <WhyHebsMatters />
        <JoinTheMovement />
        <TestimonialsSection />
        <GallerySection />
        <HEBSAssistant />
        <Footer />
      </main>
    </>
  );
}

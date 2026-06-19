import LegacyEventPage, { type LegacyEventData } from "@/components/LegacyEventPage";

const data: LegacyEventData = {
  year: 2024,
  heroTagline: "The Beginning of Something Historic",
  heroSubtitle: "The inaugural HEBS set the standard for African beauty excellence.",
  dates: "October 2024",
  venue: "Lagos, Nigeria",
  heroImage: "/images/gallery/gallery-event-07.png",
  overviewText:
    "HEBS Lagos 2024 was the debut of Africa's most ambitious beauty summit — a bold vision brought to life. Over 350 attendees from 14 countries gathered in Lagos to witness the birth of a new institution. Five competition categories, live masterclasses, and $50,000 in prizes made it a landmark moment for the African beauty industry.",
  stats: [
    { value: 350, suffix: "+", label: "Attendees", color: "#f59e0b" },
    { value: 60, suffix: "+", label: "Competitors", color: "#9b59b6" },
    { value: 14, label: "Countries", color: "#e91e8c" },
    { value: 5, label: "Categories", color: "#f59e0b" },
  ],
  winners: [
    { category: "Hair Styling", name: "Kemi Adewale", origin: "Lagos, Nigeria", color: "#f59e0b" },
    { category: "Barbering", name: "Tunde Fashola", origin: "Lagos, Nigeria", color: "#9b59b6" },
    { category: "Nail Art", name: "Ngozi Eze", origin: "Abuja, Nigeria", color: "#e91e8c" },
    { category: "Makeup Artistry", name: "Amaka Obi", origin: "Port Harcourt, Nigeria", color: "#f59e0b" },
    { category: "Education Award", name: "Prof. James Okafor", origin: "United States", color: "#9b59b6" },
  ],
  competitionHighlights: [
    { src: "/images/highlights/hairstylist-competition-03.png", caption: "Hair Artistry" },
    { src: "/images/highlights/barber-competition-01.png", caption: "Barbering" },
    { src: "/images/highlights/braiding-competition-01.png", caption: "Creative Braiding" },
    { src: "/images/highlights/hands-on-hair-styling-01.png", caption: "Masterclass" },
    { src: "/images/highlights/fashion-stylist-competition-01.png", caption: "Fashion" },
    { src: "/images/highlights/hairstylist-avant-garde-01.png", caption: "Avant-Garde" },
  ],
  testimonials: [
    {
      quote: "HEBS 2024 was a game-changer for Nigerian beauty. The fact that it happened at all was historic. The execution was flawless.",
      name: "Kemi Adewale",
      role: "Hair Styling Champion, HEBS 2024",
    },
    {
      quote: "I knew from the very first HEBS that this would be an institution. The organisation, the talent, the energy — exceptional.",
      name: "Dr. Chioma Nwosu",
      role: "Industry Leader & Educator",
    },
    {
      quote: "Competing at HEBS 2024 gave me the confidence to enter global competitions. It was the launchpad I needed.",
      name: "Tunde Fashola",
      role: "Barber Champion, HEBS 2024",
    },
  ],
  galleryImages: [
    "/images/gallery/gallery-event-07.png",
    "/images/gallery/gallery-event-08.png",
    "/images/gallery/gallery-event-09.png",
    "/images/gallery/gallery-event-11.png",
    "/images/gallery/gallery-event-12.png",
    "/images/gallery/gallery-event-06.png",
  ],
  prizeTotal: "$50,000",
};

export const metadata = {
  title: "HEBS Lagos 2024 | Hair & Beauty Excellence Summit",
  description: "Relive the inaugural HEBS Lagos 2024 — winners, gallery, and highlights from the first edition.",
};

export default function Hebs2024Page() {
  return <LegacyEventPage data={data} />;
}

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventHighlights from "@/components/EventHighlights";
import CompetitionCategories from "@/components/CompetitionCategories";
import WhyAttend from "@/components/WhyAttend";
import TestimonialsSection from "@/components/TestimonialsSection";
import GallerySection from "@/components/GallerySection";
import HEBSAssistant from "@/components/HEBSAssistant";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#0d0d0d", overflowX: "hidden" }}>
        <Hero />
        <EventHighlights />
        <CompetitionCategories />
        <WhyAttend />
        <TestimonialsSection />
        <GallerySection />
        <HEBSAssistant />
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
}

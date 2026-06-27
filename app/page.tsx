import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventHighlights from "@/components/EventHighlights";
import TrailerSection from "@/components/TrailerSection";
import CompetitionCategories from "@/components/CompetitionCategories";
import WhyAttend from "@/components/WhyAttend";
import TestimonialsSection from "@/components/TestimonialsSection";
import GallerySection from "@/components/GallerySection";
import HEBSAssistant from "@/components/HEBSAssistant";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <link rel="preload" as="image" href="/images/hero/hero-poster-gala-optimized.webp" type="image/webp" fetchPriority="high" />
      <Navbar />
      <main style={{ background: "#0d0d0d", overflowX: "hidden" }}>
        <Hero />
        <EventHighlights />
        <TrailerSection />
        <CompetitionCategories />
        <WhyAttend />
        <TestimonialsSection />
        <GallerySection />
        <HEBSAssistant />
        <Footer />
      </main>
    </>
  );
}

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventHighlights from "@/components/EventHighlights";
import TestimonialsSection from "@/components/sections/testimonials-section";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#0d0d0d" }}>
        <Hero />
        <EventHighlights />
        <TestimonialsSection />
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
}

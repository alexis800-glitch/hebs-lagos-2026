import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProofBar from "@/components/SocialProofBar";
import About from "@/components/About";
import EventHighlights from "@/components/EventHighlights";
import Competition from "@/components/Competition";
import Tickets from "@/components/Tickets";
import SponsorsVendors from "@/components/SponsorsVendors";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#0d0d0d" }}>
        <Hero />
        <SocialProofBar />
        <About />
        <EventHighlights />
        <Competition />
        <Tickets />
        <SponsorsVendors />
        <Gallery />
        <Contact />
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
}

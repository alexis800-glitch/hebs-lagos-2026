import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProofBar from "@/components/SocialProofBar";
import About from "@/components/About";
import EventHighlights from "@/components/EventHighlights";
import Competition from "@/components/Competition";
import PrizeGrid from "@/components/PrizeGrid";
import Tickets from "@/components/Tickets";
import SponsorsVendors from "@/components/SponsorsVendors";
import GalleryGridBlock from "@/components/GalleryGridBlock";
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
        <PrizeGrid />
        <Tickets />
        <SponsorsVendors />
        <GalleryGridBlock />
        <Contact />
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
}

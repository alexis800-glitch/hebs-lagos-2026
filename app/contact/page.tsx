import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact & Inquiries — HEBS Lagos 2026",
  description:
    "Get in touch with the HEBS team. General inquiries, sponsorship questions, vendor applications, and media requests.",
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

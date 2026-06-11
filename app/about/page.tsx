import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About the Summit — HEBS Lagos 2026",
  description:
    "Learn about the Hair Education Beauty Summit — our mission, legacy, and vision for the global beauty industry.",
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

import Navbar from "@/components/Navbar";
import Tickets from "@/components/Tickets";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Tickets — HEBS Lagos 2026",
  description:
    "Secure your pass to the Hair Education Beauty Summit. Early bird, standard, and VIP tiers available. Lagos, Nigeria · October 23–25, 2026.",
};

export default function TicketsPage() {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen bg-black text-white pt-32 px-4">
        <Tickets />
        <Footer />
      </main>
    </>
  );
}

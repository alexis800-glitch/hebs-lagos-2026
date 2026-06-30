import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Tickets — HEBS Lagos 2026",
  description:
    "Secure your pass to the Hair Education Beauty Summit. Early bird, standard, and VIP tiers available. Lagos, Nigeria · October 23–25, 2026.",
};

const passes = [
  {
    name: "One Day Pass",
    price: "₦15,000",
    ngn: "",
    standardPrice: "",
    tag: "",
    perks: [
      "General admission",
      "Access to all 3 floors",
      "Main stage",
      "Education sessions",
      "Exhibitors",
    ],
    link: "https://hebseventportal.com/register",
  },
  {
    name: "Two Days Pass",
    price: "₦25,000",
    ngn: "",
    standardPrice: "",
    tag: "",
    perks: [
      "General admission for two event days",
      "Access to all 3 floors",
      "Main stage",
      "Education sessions",
      "Exhibitors",
    ],
    link: "https://hebseventportal.com/register",
  },
  {
    name: "Three Days Pass",
    price: "₦75,000",
    ngn: "",
    standardPrice: "",
    tag: "",
    perks: [
      "Full 3-day access",
      "Includes Pre-Party",
      "Networking access with industry leaders from the USA and Nigeria",
      "Access to all 3 floors",
      "Main stage",
      "Education sessions",
      "Exhibitors",
    ],
    link: "https://hebseventportal.com/register",
  },
  {
    name: "VIP Experience",
    price: "$400",
    ngn: "₦560,000",
    standardPrice: "$600",
    tag: "Premium Clearance",
    perks: [
      "Full 3-day VIP clearance",
      "Front-row priority seating",
      "Exclusive VIP lounge access",
      "Celebrity Meet & Greet",
      "Official Merchandise Package",
    ],
    link: "https://hebseventportal.com/register",
  },
];

export default function TicketsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] pt-14">
        <section className="py-24 px-5 md:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-16 border-b border-zinc-900 pb-10">
              <p className="font-mono text-[10px] uppercase tracking-widest text-amber-500 font-medium mb-4">
                Registration Portals
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">
                Choose Your{" "}
                <span className="italic font-normal">Experience</span>
              </h1>
              <p className="font-sans text-sm text-zinc-200 leading-relaxed max-w-md">
                Early bird rates are available for a limited window. Secure
                placement before tier limits expire.
              </p>
            </div>

            {/* Pass grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 w-full overflow-hidden">
              {passes.map((pass) => (
                <div
                  key={pass.name}
                  className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    {pass.tag && (
                      <span className="inline-block font-mono text-[9px] uppercase tracking-widest text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded mb-4">
                        {pass.tag}
                      </span>
                    )}
                    <h2 className="font-serif text-xl font-semibold text-white tracking-tight mb-4">
                      {pass.name}
                    </h2>

                    {/* Pricing */}
                    <div className="mb-6 pb-6 border-b border-white/10">
                      <span className="text-2xl sm:text-3xl font-light tracking-tight text-white block leading-none">
                        {pass.price}
                      </span>
                      {pass.ngn && (
                        <span className="font-mono text-sm text-zinc-400 mt-1 block tabular-nums">
                          {pass.ngn}
                        </span>
                      )}
                      {pass.standardPrice && (
                        <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mt-1.5 block">
                          Early bird ·{" "}
                          <span className="line-through">
                            {pass.standardPrice} standard
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Perks */}
                    <ul className="flex flex-col gap-2.5 mb-8">
                      {pass.perks.map((perk, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 font-sans text-xs text-zinc-200"
                        >
                          <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <a
                    href={pass.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center font-sans text-xs uppercase tracking-widest py-4 rounded-xl font-medium border border-zinc-800 hover:border-zinc-600 text-white hover:bg-zinc-900/60 transition-all duration-200"
                  >
                    Secure Pass ↗
                  </a>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <p className="text-center font-sans text-xs text-zinc-400 mt-12">
              All passes are issued via{" "}
              <a
                href="https://hebseventportal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-200 hover:text-white transition-colors"
              >
                hebseventportal.com
              </a>
              . Questions?{" "}
              <a
                href="mailto:info@thehebs.com"
                className="text-zinc-200 hover:text-white transition-colors"
              >
                info@thehebs.com
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Gallery — HEBS Lagos 2026",
  description:
    "Explore the visual milestones, competitor showdowns, and high-fashion highlights of HEBS Lagos 2026.",
}

const logos = ["LOGO_01", "LOGO_02", "LOGO_03", "LOGO_04", "LOGO_05"]

const galleryCards = [
  {
    id: "01",
    label: "HAIR & BREAKTHROUGH CHALLENGE",
    col: "md:col-span-8",
    height: "h-96",
    src: "https://picsum.photos/seed/hebs-g01/900/384",
  },
  {
    id: "02",
    label: "BARBERING BATTLES SHOT",
    col: "md:col-span-4",
    height: "h-96",
    src: "https://picsum.photos/seed/hebs-g02/500/384",
  },
  {
    id: "03",
    label: "RUNWAY SHOWCASE",
    col: "md:col-span-4",
    height: "h-64",
    src: "https://picsum.photos/seed/hebs-g03/500/256",
  },
  {
    id: "04",
    label: "MASTERCLASS BTS SESSION",
    col: "md:col-span-8",
    height: "h-64",
    src: "https://picsum.photos/seed/hebs-g04/900/256",
  },
]

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen bg-black text-white pt-36 pb-24 px-6 max-w-7xl mx-auto">

        {/* Header */}
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2 block text-center">
          Exhibition Archive
        </span>
        <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight text-center mb-4 font-serif">
          Media &amp; Event <span className="italic font-normal">Gallery</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base text-center max-w-2xl mx-auto mb-16 leading-relaxed">
          Explore the visual milestones, competitor showdowns, and high-fashion highlights of HEBS.
        </p>

        {/* Logo Showcase */}
        <div className="w-full border border-white/10 bg-zinc-950/40 rounded-2xl p-8 mb-16 flex flex-wrap items-center justify-center gap-12 backdrop-blur-sm">
          {logos.map((logo) => (
            <div
              key={logo}
              className="h-10 w-32 bg-zinc-900/60 border border-white/5 rounded-lg flex items-center justify-center text-zinc-600 text-xs font-mono tracking-wider font-semibold"
            >
              {logo}
            </div>
          ))}
        </div>

        {/* Bento Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          {galleryCards.map((card) => (
            <div
              key={card.id}
              className={`group relative ${card.col} ${card.height} bg-zinc-900 border border-white/15 rounded-2xl overflow-hidden shadow-xl`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.src}
                alt={card.label}
                className="w-full h-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-105 filter grayscale"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/60 to-transparent text-left">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block mb-1">
                  {card.id}
                </span>
                <p className="font-sans text-sm font-medium text-white leading-snug">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

      </main>
      <Footer />
    </>
  )
}

"use client";

import Image from "next/image";
import FadeIn from "./FadeIn";

export default function VenueSection() {
  return (
    <section id="venue" className="py-20 md:py-28 px-5 sm:px-8 md:px-12 bg-zinc-950">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 pb-8 border-b border-white/[0.06]">
          <p className="font-mono text-xs tracking-widest uppercase text-amber-500 mb-3">The Stage</p>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Event Venue
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* Main venue image */}
          <FadeIn>
            <div className="relative w-full lg:w-[58%] h-64 sm:h-80 lg:h-[460px] rounded-2xl overflow-hidden flex-shrink-0">
              <Image
                src="/images/venue/venue-hall-01.jpg.png"
                alt="NJS Royale Events Center"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="font-mono text-[9px] tracking-widest uppercase text-amber-400 mb-2 block">
                  Main Hall
                </span>
                <h3 className="font-sans text-white font-bold text-xl leading-snug">
                  NJS Royale Events Center
                </h3>
              </div>
            </div>
          </FadeIn>

          {/* Right column: second image + info */}
          <div className="flex flex-col gap-5 flex-1">
            <FadeIn delay={0.1}>
              <div className="relative w-full h-48 sm:h-64 lg:h-[240px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/venue/venue-hall-02.jpg.png"
                  alt="NJS Royale Events Center interior"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </FadeIn>

            {/* Venue details */}
            <FadeIn delay={0.15}>
              <div className="bg-zinc-900/60 border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-4">
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-1">Location</p>
                  <p className="text-white font-semibold text-sm leading-snug">
                    Richland Garden Estate, Lekki Epe Express, Lagos, Nigeria
                  </p>
                </div>
                <div className="w-full h-[1px] bg-white/[0.06]" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-1">Dates</p>
                    <p className="text-white text-sm font-medium">October 23–25, 2026</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-1">Venue</p>
                    <p className="text-white text-sm font-medium">NJS Royale</p>
                  </div>
                </div>
                <a
                  href="https://hebseventportal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-white text-black font-bold text-sm tracking-wide px-6 py-3.5 rounded-xl hover:bg-amber-400 transition-colors duration-200 touch-manipulation min-h-[44px] mt-1"
                >
                  Secure Your Spot ↗
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

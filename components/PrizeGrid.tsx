import React from 'react'
import FadeIn from './FadeIn'

export default function PrizeGrid() {
  return (
    <section className="py-32 px-6 max-w-6xl mx-auto bg-[#050505]">
      {/* Header Block */}
      <FadeIn>
        <div className="border-b border-neutral-900 pb-8 mb-16">
          <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mb-3">Live Runway Showdown</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight">
            The Global <span className="italic font-normal">Championship</span>
          </h2>
        </div>
      </FadeIn>

      {/* Vercel-Style Asymmetrical Bento Grid Matrix */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-900 border border-neutral-900 overflow-hidden rounded-sm">

          {/* Card 1: Main Large Prize (Spans 2 columns on desktop) */}
          <div className="bg-[#050505] p-8 md:p-12 md:col-span-2 flex flex-col justify-between min-h-[320px]">
            <div>
              <span className="font-sans text-[10px] tracking-widest uppercase text-amber-500 font-medium">Grand Prize Pool</span>
              <h3 className="font-serif text-5xl md:text-6xl text-white font-light mt-6 tracking-tight">
                $35,000 <span className="font-sans text-xl md:text-2xl font-light text-neutral-500 block md:inline md:ml-2">Total Production Stakes</span>
              </h3>
            </div>
            <div className="border-t border-neutral-950 pt-6 mt-8 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
              <p className="font-sans text-xs text-neutral-400 max-w-sm font-light leading-relaxed">
                The ultimate high-stakes runway battle delivering live creative warfare in front of elite global judges and global media networks.
              </p>
              <div className="flex gap-6 shrink-0">
                <div>
                  <span className="block font-sans text-[10px] uppercase tracking-widest text-neutral-400 mb-1">1st Place</span>
                  <span className="font-sans text-xl font-bold text-white">$20,000</span>
                </div>
                <div className="border-l border-neutral-800 pl-6">
                  <span className="block font-sans text-[10px] uppercase tracking-widest text-neutral-400 mb-1">2nd Place</span>
                  <span className="font-sans text-xl font-medium text-white">$10,000</span>
                </div>
                <div className="border-l border-neutral-800 pl-6">
                  <span className="block font-sans text-[10px] uppercase tracking-widest text-neutral-400 mb-1">3rd Place</span>
                  <span className="font-sans text-xl font-light text-neutral-200">$5,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Industry Fusion Breakdown */}
          <div className="bg-[#050505] p-8 flex flex-col justify-between min-h-[320px]">
            <div>
              <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-500 font-medium">The Squad Architecture</span>
              <h4 className="font-serif text-2xl text-white font-light mt-4 tracking-tight">Four Disciplines. One Collective Vision.</h4>
              <p className="font-sans text-xs text-neutral-400 mt-3 font-light leading-relaxed">
                Teams must assemble matching dynamic force profiles across industries to build a cohesive runway showcase presentation:
              </p>
            </div>

            <ul className="mt-6 flex flex-col gap-2.5 border-t border-neutral-950 pt-4">
              <li className="flex items-center justify-between font-sans text-xs text-neutral-300">
                <span className="flex items-center gap-2"><span className="text-neutral-600">01</span> Hairstylist Specialist</span>
                <span className="text-[10px] uppercase text-neutral-600 tracking-wider">Elite Cut</span>
              </li>
              <li className="flex items-center justify-between font-sans text-xs text-neutral-300">
                <span className="flex items-center gap-2"><span className="text-neutral-600">02</span> Master Barber Technician</span>
                <span className="text-[10px] uppercase text-neutral-600 tracking-wider">Precision Line</span>
              </li>
              <li className="flex items-center justify-between font-sans text-xs text-neutral-300">
                <span className="flex items-center gap-2"><span className="text-neutral-600">03</span> Avant-Garde Makeup Artist</span>
                <span className="text-[10px] uppercase text-neutral-600 tracking-wider">Visual Form</span>
              </li>
              <li className="flex items-center justify-between font-sans text-xs text-neutral-300">
                <span className="flex items-center gap-2"><span className="text-neutral-600">04</span> High-Fashion Designer</span>
                <span className="text-[10px] uppercase text-neutral-600 tracking-wider">Structural Silhouette</span>
              </li>
            </ul>
          </div>

        </div>
      </FadeIn>
    </section>
  )
}

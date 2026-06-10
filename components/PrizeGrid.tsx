import React from 'react'

export default function PrizeGrid() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto bg-[#050505] border-t border-neutral-900" id="championship">
      {/* Editorial Header */}
      <div className="border-b border-neutral-900 pb-8 mb-16">
        <p className="font-sans text-xs uppercase tracking-widest text-amber-500 mb-3 font-medium">Live Runway Showdown</p>
        <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight">
          The Global <span className="italic font-normal">Championship</span>
        </h2>
        <p className="font-sans text-sm text-neutral-400 mt-4 max-w-2xl font-light leading-relaxed">
          The ultimate beauty, fashion, and barbering showdown. One stage, one production, one chance to win it all live in Lagos, Nigeria.
        </p>
      </div>

      {/* Main 2-Column Clean Structural Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Left Column: The Crowned Icons Team Clash */}
        <div className="flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-900 pb-12 lg:pb-0 lg:pr-12">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Avenue 01 / Group Track</span>
            <h3 className="font-serif text-3xl text-white font-light mt-4 tracking-tight">Crowned Icons Team Competition</h3>
            <p className="font-sans text-xs text-neutral-400 mt-3 font-light leading-relaxed">
              A creative fusion where elite professionals combine forces as a unified squad to deliver a cohesive, visionary runway showcase presentation. Each squad must feature:
            </p>

            <ul className="mt-6 flex flex-col gap-3 border-t border-neutral-900 pt-4">
              <li className="flex items-center justify-between font-sans text-xs text-neutral-300">
                <span className="flex items-center gap-2"><span className="text-neutral-600 font-mono">01</span> Hairstylist Specialist</span>
                <span className="font-mono text-[9px] uppercase text-amber-400 tracking-wider bg-neutral-900/60 border border-amber-500/20 px-2 py-0.5 rounded-sm">Avant-Garde & Cut</span>
              </li>
              <li className="flex items-center justify-between font-sans text-xs text-neutral-300">
                <span className="flex items-center gap-2"><span className="text-neutral-600 font-mono">02</span> Master Barber Technician</span>
                <span className="font-mono text-[9px] uppercase text-neutral-400 tracking-wider bg-neutral-900/60 border border-neutral-800 px-2 py-0.5 rounded-sm">Precision Fade</span>
              </li>
              <li className="flex items-center justify-between font-sans text-xs text-neutral-300">
                <span className="flex items-center gap-2"><span className="text-neutral-600 font-mono">03</span> Avant-Garde Makeup Artist</span>
                <span className="font-mono text-[9px] uppercase text-neutral-400 tracking-wider bg-neutral-900/60 border border-neutral-800 px-2 py-0.5 rounded-sm">Editorial & Runway</span>
              </li>
              <li className="flex items-center justify-between font-sans text-xs text-neutral-300">
                <span className="flex items-center gap-2"><span className="text-neutral-600 font-mono">04</span> High-Fashion Designer</span>
                <span className="font-mono text-[9px] uppercase text-neutral-400 tracking-wider bg-neutral-900/60 border border-neutral-800 px-2 py-0.5 rounded-sm">Structural Silhouette</span>
              </li>
              <li className="flex items-center justify-between font-sans text-xs text-neutral-300">
                <span className="flex items-center gap-2"><span className="text-neutral-600 font-mono">05</span> Creative Nail Technician</span>
                <span className="font-mono text-[9px] uppercase text-neutral-400 tracking-wider bg-neutral-900/60 border border-neutral-800 px-2 py-0.5 rounded-sm">Precision Glamour</span>
              </li>
            </ul>
          </div>

          {/* Crowned Icon Cash Ledger */}
          <div className="mt-8 pt-6 border-t border-neutral-900/60 flex gap-8">
            <div>
              <span className="block font-sans text-[9px] uppercase tracking-wider text-neutral-500 mb-1">Squad Grand Prize</span>
              <span className="font-sans text-xl font-bold text-white">$20,000</span>
            </div>
            <div className="border-l border-neutral-900 pl-8">
              <span className="block font-sans text-[9px] uppercase tracking-wider text-neutral-500 mb-1">Second Place</span>
              <span className="font-sans text-sm font-medium text-neutral-300">$10,000</span>
            </div>
            <div className="border-l border-neutral-900 pl-8">
              <span className="block font-sans text-[9px] uppercase tracking-wider text-neutral-500 mb-1">Third Place</span>
              <span className="font-sans text-sm font-medium text-neutral-400">$5,000</span>
            </div>
          </div>
        </div>

        {/* Right Column: Individual Technical Battles */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Avenue 02 / Solo Track</span>
            <h3 className="font-serif text-3xl text-white font-light mt-4 tracking-tight">Individual Live Showdowns</h3>
            <p className="font-sans text-xs text-neutral-400 mt-3 font-light leading-relaxed">
              Intense, head-to-head live stadium battles focused strictly on technical mastery, speed, and raw individual execution under pressure:
            </p>

            <ul className="mt-6 flex flex-col gap-3 border-t border-neutral-900 pt-4">
              <li className="flex flex-col gap-1 py-1">
                <div className="flex items-center justify-between font-sans text-xs text-neutral-200 font-medium">
                  <span>HEBS Live Barber Battles</span>
                  <span className="font-mono text-[9px] uppercase text-amber-500 tracking-widest">Solo Battle</span>
                </div>
                <p className="font-sans text-[11px] text-neutral-500 font-light">Fast-paced arena clash focusing on speed cutting, crisp execution, and freestyle artistry.</p>
              </li>
              <li className="flex flex-col gap-1 py-1 border-t border-neutral-900/40 mt-1">
                <div className="flex items-center justify-between font-sans text-xs text-neutral-200 font-medium">
                  <span>Elite Braiding Showdowns</span>
                  <span className="font-mono text-[9px] uppercase text-amber-500 tracking-widest">Solo Battle</span>
                </div>
                <p className="font-sans text-[11px] text-neutral-500 font-light">Highlighting historical complexity, cultural narrative, and intricate parting mastery.</p>
              </li>
              <li className="flex flex-col gap-1 py-1 border-t border-neutral-900/40 mt-1">
                <div className="flex items-center justify-between font-sans text-xs text-neutral-200 font-medium">
                  <span>Fantasy & Avant-Garde Hair</span>
                  <span className="font-mono text-[9px] uppercase text-amber-500 tracking-widest">Solo Battle</span>
                </div>
                <p className="font-sans text-[11px] text-neutral-500 font-light">Pushing architectural gravity constraints and structural visual art concepts on stage.</p>
              </li>
            </ul>
          </div>

          {/* Global Stakes Pool Metric */}
          <div className="mt-8 pt-6 border-t border-neutral-900/60">
            <span className="block font-sans text-[9px] uppercase tracking-widest text-neutral-500 mb-1">Total Championship Stakes Pool</span>
            <span className="font-sans text-2xl font-extralight text-white tracking-tight">
              $35,000 <span className="font-sans text-xs text-neutral-500 font-light normal-case ml-1">in Cumulative Production Prizes</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}

'use client'
import React, { useState } from 'react'

export default function PrizeGrid() {
  const [activeTab, setActiveTab] = useState<'overview' | 'theme' | 'stages'>('overview')

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto bg-[#050505] border-t border-neutral-900" id="championship">
      {/* Premium Split Section Header */}
      <div className="border-b border-neutral-900 pb-8 mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-amber-500 mb-3 font-medium">Signature Main Stage Event</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight">
            Crowned Icons <span className="italic font-normal">Showdown</span>
          </h2>
        </div>
        <p className="font-sans text-sm text-neutral-400 max-w-md font-light leading-relaxed">
          A high-fashion, high-drama global showdown where runway meets theatre, fusing the creative energy of the Met Gala and Paris Fashion Week.
        </p>
      </div>

      {/* Modern Tab Navigation Bar */}
      <div className="flex border-b border-neutral-900 mb-12 gap-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-4 text-xs uppercase tracking-wider font-sans transition-all border-b-2 ${
            activeTab === 'overview' ? 'border-amber-400 text-white font-medium' : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
        >
          01 / Overview & Payouts
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`pb-4 text-xs uppercase tracking-wider font-sans transition-all border-b-2 ${
            activeTab === 'theme' ? 'border-amber-400 text-white font-medium' : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
        >
          02 / 2026 Theme Specs
        </button>
        <button
          onClick={() => setActiveTab('stages')}
          className={`pb-4 text-xs uppercase tracking-wider font-sans transition-all border-b-2 ${
            activeTab === 'stages' ? 'border-amber-400 text-white font-medium' : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
        >
          03 / Entry & Stages
        </button>
      </div>

      {/* Tab Content Display Matrix */}
      <div className="min-h-[400px]">

        {/* TAB 1: OVERVIEW & PAYOUTS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Core Info */}
            <div className="lg:col-span-2 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-widest">The Movement</span>
                <p className="font-sans text-sm text-neutral-300 font-light leading-relaxed mt-4">
                  Stylists become directors. Models become performers. Beauty becomes performance art. Each team delivers a full-scale 7–10 minute immersive visual masterpiece showcasing collaborative technical mastery across five creative tracks:
                </p>

                <ul className="mt-6 flex flex-col gap-2.5 border-t border-neutral-900 pt-4">
                  <li className="flex justify-between text-xs font-sans text-neutral-400">
                    <span className="text-neutral-200">01 / Hairstyling</span>
                    <span className="font-mono text-[10px]">Avant-Garde Focus</span>
                  </li>
                  <li className="flex justify-between text-xs font-sans text-neutral-400">
                    <span className="text-neutral-200">02 / Makeup Artistry</span>
                    <span className="font-mono text-[10px]">Editorial Mastery</span>
                  </li>
                  <li className="flex justify-between text-xs font-sans text-neutral-400">
                    <span className="text-neutral-200">03 / Fashion & Couture</span>
                    <span className="font-mono text-[10px]">Original Designer Collaboration</span>
                  </li>
                  <li className="flex justify-between text-xs font-sans text-neutral-400">
                    <span className="text-neutral-200">04 / Nail Art</span>
                    <span className="font-mono text-[10px]">Precision Details</span>
                  </li>
                  <li className="flex justify-between text-xs font-sans text-neutral-400">
                    <span className="text-neutral-200">05 / Stage Production</span>
                    <span className="font-mono text-[10px]">Choreography, Set Design & Audio</span>
                  </li>
                </ul>
              </div>

              {/* High Contrast Payout Ledger */}
              <div className="border-t border-neutral-900 pt-8 mt-8 grid grid-cols-3 gap-4">
                <div>
                  <span className="block font-sans text-[9px] uppercase tracking-wider text-neutral-500 mb-1">1st Place Icon</span>
                  <span className="font-sans text-lg font-bold text-white block">$20,000</span>
                  <span className="font-mono text-[9px] text-neutral-500">or ₦29.4M + Trophy</span>
                </div>
                <div className="border-l border-neutral-900 pl-4">
                  <span className="block font-sans text-[9px] uppercase tracking-wider text-neutral-500 mb-1">2nd Place Vanguard</span>
                  <span className="font-sans text-base font-medium text-neutral-200 block">$10,000</span>
                  <span className="font-mono text-[9px] text-neutral-500">or ₦14.7M + Trophy</span>
                </div>
                <div className="border-l border-neutral-900 pl-4">
                  <span className="block font-sans text-[9px] uppercase tracking-wider text-neutral-500 mb-1">3rd Place Revolutionist</span>
                  <span className="font-sans text-base font-medium text-neutral-300 block">$5,000</span>
                  <span className="font-mono text-[9px] text-neutral-500">or ₦7.3M + Trophy</span>
                </div>
              </div>
            </div>

            {/* Judging Panel Block */}
            <div className="bg-neutral-950/40 border border-neutral-900 p-8 rounded-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-widest">Evaluation Metrics</span>
                <h4 className="font-serif text-xl text-white font-light mt-2 mb-6">Rigorous Judging Criteria</h4>
                <ul className="flex flex-col gap-3 font-sans text-xs text-neutral-400 font-light">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-amber-400 rounded-full shrink-0"></span> Innovation & Theme Execution</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full shrink-0"></span> Technical Excellence across disciplines</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full shrink-0"></span> Visual Storytelling & Stage Impact</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full shrink-0"></span> Cohesion, Originality & Presentation</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full shrink-0"></span> Audience Engagement & Stage Presence</li>
                </ul>
              </div>
              <div className="border-t border-neutral-900 pt-4 mt-6 text-[10px] font-mono text-neutral-500 leading-normal">
                Featuring Celebrity Judges, Live Instagram Voting, and Global Editorial Press Coverage.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 2026 THEME SPECS */}
        {activeTab === 'theme' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <span className="font-mono text-[10px] uppercase text-amber-500 tracking-widest font-medium">Official 2026 Theme</span>
              <h3 className="font-serif text-4xl text-white font-light mt-4 tracking-tight">THE FUTURE REIMAGINED</h3>
              <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed mt-4">
                Step into tomorrow. Entries should feel like living art installations—deeply rooted in imagination, cultural preservation, and bold avant-garde aesthetics. Contestants must interpret the timeline through four key perspectives:
              </p>
              <div className="mt-8 border-t border-neutral-900 pt-6">
                <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-widest">Creative Mandate</span>
                <p className="font-sans text-xs text-neutral-400 font-light leading-relaxed mt-3">
                  Each team's visual narrative must be fully cohesive — from the first model's look to the final stage moment. Judges will evaluate the depth of concept interpretation across all five disciplines as a single unified vision.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-neutral-900 p-5 rounded-sm">
                <span className="font-mono text-xs text-neutral-600 block mb-1">01</span>
                <span className="font-serif text-lg text-white font-light">Cultural Heritage</span>
                <p className="font-sans text-[11px] text-neutral-500 font-light mt-2 leading-relaxed">Rooted in ancestral legacy and African identity expressed through modern technique.</p>
              </div>
              <div className="border border-neutral-900 p-5 rounded-sm">
                <span className="font-mono text-xs text-neutral-600 block mb-1">02</span>
                <span className="font-serif text-lg text-white font-light">Nature & Sustainability</span>
                <p className="font-sans text-[11px] text-neutral-500 font-light mt-2 leading-relaxed">Organic forms, earth materials, and ecological storytelling on the runway.</p>
              </div>
              <div className="border border-neutral-900 p-5 rounded-sm">
                <span className="font-mono text-xs text-neutral-600 block mb-1">03</span>
                <span className="font-serif text-lg text-white font-light">Sci-Fi & Futurism</span>
                <p className="font-sans text-[11px] text-neutral-500 font-light mt-2 leading-relaxed">Bold, architectural, and otherworldly concepts that push the limits of construction.</p>
              </div>
              <div className="border border-neutral-900 p-5 rounded-sm">
                <span className="font-mono text-xs text-neutral-600 block mb-1">04</span>
                <span className="font-serif text-lg text-white font-light">Fantasy & Mythology</span>
                <p className="font-sans text-[11px] text-neutral-500 font-light mt-2 leading-relaxed">Surreal, narrative-driven looks drawn from legend, folklore, and the imagination.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ENTRY & STAGES */}
        {activeTab === 'stages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Stage Timeline */}
            <div className="lg:col-span-2">
              <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-widest">Competition Roadmap</span>
              <div className="mt-6 flex flex-col gap-0">

                <div className="flex gap-6 pb-8 border-b border-neutral-900">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="font-mono text-[10px] text-amber-400">01</span>
                    <div className="w-px flex-1 bg-neutral-900 mt-1"></div>
                  </div>
                  <div className="pb-2">
                    <span className="font-sans text-xs uppercase tracking-wider text-white font-medium">Open Registration</span>
                    <p className="font-sans text-[11px] text-neutral-500 font-light leading-relaxed mt-1">Teams of 5 register via the official HEBS portal. All disciplines must be confirmed at time of entry. Entry fee applies per team.</p>
                    <span className="font-mono text-[10px] text-amber-500 mt-2 block">Opens: Summer 2026</span>
                  </div>
                </div>

                <div className="flex gap-6 py-8 border-b border-neutral-900">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="font-mono text-[10px] text-neutral-500">02</span>
                    <div className="w-px flex-1 bg-neutral-900 mt-1"></div>
                  </div>
                  <div className="pb-2">
                    <span className="font-sans text-xs uppercase tracking-wider text-white font-medium">Concept Submission</span>
                    <p className="font-sans text-[11px] text-neutral-500 font-light leading-relaxed mt-1">Teams submit a detailed mood board, theme interpretation brief, and discipline breakdown for judge pre-screening and stage slot allocation.</p>
                    <span className="font-mono text-[10px] text-neutral-500 mt-2 block">Deadline: September 2026</span>
                  </div>
                </div>

                <div className="flex gap-6 py-8 border-b border-neutral-900">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="font-mono text-[10px] text-neutral-500">03</span>
                    <div className="w-px flex-1 bg-neutral-900 mt-1"></div>
                  </div>
                  <div className="pb-2">
                    <span className="font-sans text-xs uppercase tracking-wider text-white font-medium">Live Rehearsal Day</span>
                    <p className="font-sans text-[11px] text-neutral-500 font-light leading-relaxed mt-1">Confirmed teams attend the NJS Royale venue for a timed stage walk-through, lighting cue checks, and audio synchronisation with production crew.</p>
                    <span className="font-mono text-[10px] text-neutral-500 mt-2 block">October 23, 2026</span>
                  </div>
                </div>

                <div className="flex gap-6 pt-8">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="font-mono text-[10px] text-amber-400">04</span>
                  </div>
                  <div>
                    <span className="font-sans text-xs uppercase tracking-wider text-white font-medium">Grand Championship Night</span>
                    <p className="font-sans text-[11px] text-neutral-500 font-light leading-relaxed mt-1">All teams perform live before a panel of celebrity judges and a packed audience. Winners announced on stage at the closing ceremony.</p>
                    <span className="font-mono text-[10px] text-amber-500 mt-2 block">October 24–25, 2026 · NJS Royale Convention & Suites</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Entry Requirements Panel */}
            <div className="bg-neutral-950/40 border border-neutral-900 p-8 rounded-sm flex flex-col gap-6">
              <div>
                <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-widest">Entry Requirements</span>
                <h4 className="font-serif text-xl text-white font-light mt-2">Who Can Enter</h4>
              </div>
              <ul className="flex flex-col gap-3 font-sans text-xs text-neutral-400 font-light">
                <li className="flex items-start gap-2"><span className="w-1 h-1 bg-amber-400 rounded-full mt-1.5 shrink-0"></span> Open to professional and emerging artists internationally</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full mt-1.5 shrink-0"></span> Teams must have exactly 5 members across the 5 disciplines</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full mt-1.5 shrink-0"></span> All materials, garments, and props must be original to the team</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full mt-1.5 shrink-0"></span> Stage presentation: 7–10 minutes with live music clearance</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full mt-1.5 shrink-0"></span> Valid identification and travel documentation required</li>
              </ul>
              <div className="border-t border-neutral-900 pt-4 mt-auto">
                <a
                  href="https://hebseventportal.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center font-sans text-xs uppercase tracking-widest text-black bg-white hover:bg-amber-400 transition-colors py-3 rounded-sm font-medium"
                >
                  Register Your Team
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

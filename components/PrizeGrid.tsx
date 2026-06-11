'use client'
import React, { useState } from 'react'

interface PrizeGridProps {
  initialTab?: 'crowned' | 'barber'
  isSubPage?: boolean
}

export default function PrizeGrid({ initialTab = 'crowned', isSubPage = false }: PrizeGridProps) {
  const [activeTab, setActiveTab] = useState<'crowned' | 'barber'>(initialTab)

  React.useEffect(() => {
    const handleTabEvent = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail === 'crowned' || customEvent.detail === 'barber') {
        setActiveTab(customEvent.detail)
      }
    }
    window.addEventListener('switchTab', handleTabEvent)
    return () => window.removeEventListener('switchTab', handleTabEvent)
  }, [])

  const battleCategories = [
    {
      id: 1,
      title: "Fast & Flawless",
      price: "$50.00",
      number: "Category 01",
      image: "https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg",
      desc: "An intense, high-speed showdown focusing on raw execution velocity, flawless blending transitions, and clean line work under an aggressive clock."
    },
    {
      id: 2,
      title: "Freestyle Fusion",
      price: "$50.00",
      number: "Category 02",
      image: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg",
      desc: "Unrestricted creative warfare. Competitors blend geometric hair portraits, abstract lines, and custom dye expressions live on stage."
    },
    {
      id: 3,
      title: "Vintage Vibe Tag Team",
      price: "$50.00",
      number: "Category 03",
      image: "https://images.pexels.com/photos/1805600/pexels-photo-1805600.jpeg",
      desc: "A coordinated dual-stylist clash resurrecting classic, old-school silhouettes and timeless historical cuts updated with sharp modern flair."
    },
    {
      id: 4,
      title: "Braids & Fades",
      price: "$50.00",
      number: "Category 04",
      image: "https://images.pexels.com/photos/3738338/pexels-photo-3738338.jpeg",
      desc: "The ultimate technical crossover battle requiring flawless razor skin-fading paired with tight, symmetrical, and complex braid parting maps."
    },
    {
      id: 5,
      title: "Loc Retwist & Style Challenge",
      price: "$50.00",
      number: "Category 05",
      image: "https://images.pexels.com/photos/7697227/pexels-photo-7697227.jpeg",
      desc: "Celebrating structural locked texture. Stylists execute immaculate, crisp row maintenance alongside a visionary avant-garde locked formal shape style."
    },
    {
      id: 6,
      title: "Neatbraid Precision Maze Challenge",
      price: "$50.00",
      number: "Category 06",
      image: "https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg",
      desc: "A meticulous test of absolute parting perfection. Contenders construct complex, multi-directional labyrinth braid patterns with immaculate tension."
    }
  ]

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto bg-[#050505] border-t border-neutral-900" id="championship">

      {/* Section Header */}
      <div className="border-b border-neutral-900 pb-8 mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-amber-500 mb-3 font-medium">Live Competition Events</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight">
            The <span className="italic font-normal">Championship</span>
          </h2>
        </div>
        <p className="font-sans text-sm md:text-base text-neutral-300 max-w-md font-light leading-relaxed">
          Two distinct competitive tracks. One global stage. Choose a category to explore the full event structure, prizes, and entry requirements.
        </p>
      </div>

      {/* Primary 2-Tab Navigation */}
      {!isSubPage && (
        <div className="flex border-b border-neutral-900 mb-12 gap-8">
          <button
            onClick={() => setActiveTab('crowned')}
            className={`pb-4 text-xs uppercase tracking-wider font-sans transition-all border-b-2 ${
              activeTab === 'crowned' ? 'border-amber-400 text-white font-medium' : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            01 / Crowned Icons Showdown
          </button>
          <button
            onClick={() => setActiveTab('barber')}
            className={`pb-4 text-xs uppercase tracking-wider font-sans transition-all border-b-2 ${
              activeTab === 'barber' ? 'border-amber-400 text-white font-medium' : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            02 / Barbering & Styling Battles
          </button>
        </div>
      )}

      {/* TAB 1: CROWNED ICONS SHOWDOWN */}
      {activeTab === 'crowned' && (
        <div className="flex flex-col gap-16">

          {/* The Movement + Payout Ledger + Judging */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-widest">The Movement</span>
                <p className="font-sans text-sm text-neutral-300 font-light leading-relaxed mt-4">
                  Stylists become directors. Models become performers. Beauty becomes performance art. Each team delivers a full-scale 7–10 minute immersive visual masterpiece showcasing collaborative technical mastery across five creative tracks:
                </p>
                <ul className="mt-6 border-t border-neutral-900 pt-4">
                  <li className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] items-start md:items-center py-4 border-b border-zinc-900 last:border-0 gap-x-4 gap-y-1">
                    <span className="text-zinc-600 font-mono text-sm leading-none pt-0.5 md:pt-0">01</span>
                    <div className="text-white text-base font-medium tracking-tight pr-4">Hairstyling</div>
                    <div className="col-start-2 md:col-start-3 text-zinc-400 text-xs md:text-sm font-mono tracking-wide md:text-right mt-0.5 md:mt-0">Avant-Garde Focus</div>
                  </li>
                  <li className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] items-start md:items-center py-4 border-b border-zinc-900 last:border-0 gap-x-4 gap-y-1">
                    <span className="text-zinc-600 font-mono text-sm leading-none pt-0.5 md:pt-0">02</span>
                    <div className="text-white text-base font-medium tracking-tight pr-4">Makeup Artistry</div>
                    <div className="col-start-2 md:col-start-3 text-zinc-400 text-xs md:text-sm font-mono tracking-wide md:text-right mt-0.5 md:mt-0">Editorial Mastery</div>
                  </li>
                  <li className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] items-start md:items-center py-4 border-b border-zinc-900 last:border-0 gap-x-4 gap-y-1">
                    <span className="text-zinc-600 font-mono text-sm leading-none pt-0.5 md:pt-0">03</span>
                    <div className="text-white text-base font-medium tracking-tight pr-4">Fashion &amp; Couture</div>
                    <div className="col-start-2 md:col-start-3 text-zinc-400 text-xs md:text-sm font-mono tracking-wide md:text-right mt-0.5 md:mt-0">Original Designer Collaboration</div>
                  </li>
                  <li className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] items-start md:items-center py-4 border-b border-zinc-900 last:border-0 gap-x-4 gap-y-1">
                    <span className="text-zinc-600 font-mono text-sm leading-none pt-0.5 md:pt-0">04</span>
                    <div className="text-white text-base font-medium tracking-tight pr-4">Nail Art</div>
                    <div className="col-start-2 md:col-start-3 text-zinc-400 text-xs md:text-sm font-mono tracking-wide md:text-right mt-0.5 md:mt-0">Precision Details</div>
                  </li>
                  <li className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] items-start md:items-center py-4 border-b border-zinc-900 last:border-0 gap-x-4 gap-y-1">
                    <span className="text-zinc-600 font-mono text-sm leading-none pt-0.5 md:pt-0">05</span>
                    <div className="text-white text-base font-medium tracking-tight pr-4">Stage Production</div>
                    <div className="col-start-2 md:col-start-3 text-zinc-400 text-xs md:text-sm font-mono tracking-wide md:text-right mt-0.5 md:mt-0">Choreography, Set Design &amp; Audio</div>
                  </li>
                </ul>
              </div>
              {/* Payout Ledger */}
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

            {/* Judging Panel */}
            <div className="bg-neutral-950/40 border border-neutral-900 p-8 rounded-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-widest">Evaluation Metrics</span>
                <h4 className="font-serif text-xl text-white font-light mt-2 mb-6">Rigorous Judging Criteria</h4>
                <ul className="flex flex-col gap-3 font-sans text-sm text-neutral-300 font-light">
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

          {/* 2026 Theme Specs */}
          <div className="border-t border-neutral-900 pt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <span className="font-mono text-[10px] uppercase text-amber-500 tracking-widest font-medium">Official 2026 Theme</span>
              <h3 className="font-serif text-4xl text-white font-light mt-4 tracking-tight">THE FUTURE REIMAGINED</h3>
              <p className="font-sans text-sm md:text-base text-neutral-300 font-light leading-relaxed mt-4">
                Step into tomorrow. Entries should feel like living art installations—deeply rooted in imagination, cultural preservation, and bold avant-garde aesthetics. Contestants must interpret the timeline through four key perspectives:
              </p>
              <div className="mt-8 border-t border-neutral-900 pt-6">
                <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-widest">Creative Mandate</span>
                <p className="font-sans text-sm text-neutral-300 font-light leading-relaxed mt-3">
                  Each team&apos;s visual narrative must be fully cohesive — from the first model&apos;s look to the final stage moment. Judges will evaluate the depth of concept interpretation across all five disciplines as a single unified vision.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-neutral-900 p-5 rounded-sm">
                <span className="font-mono text-xs text-neutral-600 block mb-1">01</span>
                <span className="font-serif text-lg text-white font-light">Cultural Heritage</span>
                <p className="font-sans text-sm text-neutral-400 font-light mt-2 leading-relaxed">Rooted in ancestral legacy and African identity expressed through modern technique.</p>
              </div>
              <div className="border border-neutral-900 p-5 rounded-sm">
                <span className="font-mono text-xs text-neutral-600 block mb-1">02</span>
                <span className="font-serif text-lg text-white font-light">Nature & Sustainability</span>
                <p className="font-sans text-sm text-neutral-400 font-light mt-2 leading-relaxed">Organic forms, earth materials, and ecological storytelling on the runway.</p>
              </div>
              <div className="border border-neutral-900 p-5 rounded-sm">
                <span className="font-mono text-xs text-neutral-600 block mb-1">03</span>
                <span className="font-serif text-lg text-white font-light">Sci-Fi & Futurism</span>
                <p className="font-sans text-sm text-neutral-400 font-light mt-2 leading-relaxed">Bold, architectural, and otherworldly concepts that push the limits of construction.</p>
              </div>
              <div className="border border-neutral-900 p-5 rounded-sm">
                <span className="font-mono text-xs text-neutral-600 block mb-1">04</span>
                <span className="font-serif text-lg text-white font-light">Fantasy & Mythology</span>
                <p className="font-sans text-sm text-neutral-400 font-light mt-2 leading-relaxed">Surreal, narrative-driven looks drawn from legend, folklore, and the imagination.</p>
              </div>
            </div>
          </div>

          {/* Entry & Stages */}
          <div className="border-t border-neutral-900 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
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
                    <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed mt-1">Teams of 5 register via the official HEBS portal. All disciplines must be confirmed at time of entry. Entry fee applies per team.</p>
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
                    <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed mt-1">Teams submit a detailed mood board, theme interpretation brief, and discipline breakdown for judge pre-screening and stage slot allocation.</p>
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
                    <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed mt-1">Confirmed teams attend the NJS Royale venue for a timed stage walk-through, lighting cue checks, and audio synchronisation with production crew.</p>
                    <span className="font-mono text-[10px] text-neutral-500 mt-2 block">October 23, 2026</span>
                  </div>
                </div>
                <div className="flex gap-6 pt-8">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="font-mono text-[10px] text-amber-400">04</span>
                  </div>
                  <div>
                    <span className="font-sans text-xs uppercase tracking-wider text-white font-medium">Grand Championship Night</span>
                    <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed mt-1">All teams perform live before a panel of celebrity judges and a packed audience. Winners announced on stage at the closing ceremony.</p>
                    <span className="font-mono text-[10px] text-amber-500 mt-2 block">October 24–25, 2026 · NJS Royale Convention & Suites</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Entry Requirements */}
            <div className="bg-neutral-950/40 border border-neutral-900 p-8 rounded-sm flex flex-col gap-6">
              <div>
                <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-widest">Entry Requirements</span>
                <h4 className="font-serif text-xl text-white font-light mt-2">Who Can Enter</h4>
              </div>
              <ul className="flex flex-col gap-3 font-sans text-sm text-neutral-300 font-light">
                <li className="flex items-start gap-2"><span className="w-1 h-1 bg-amber-400 rounded-full mt-1.5 shrink-0"></span> Open to professional and emerging artists internationally</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full mt-1.5 shrink-0"></span> Teams must have exactly 5 members across the 5 disciplines</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full mt-1.5 shrink-0"></span> All materials, garments, and props must be original to the team</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full mt-1.5 shrink-0"></span> Stage presentation: 7–10 minutes with live music clearance</li>
                <li className="flex items-start gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full mt-1.5 shrink-0"></span> Valid identification and travel documentation required</li>
              </ul>
              <div className="border-t border-neutral-900 pt-4 mt-auto">
                <a
                  href="https://hebseventportal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center font-sans text-xs uppercase tracking-widest text-black bg-white hover:bg-amber-400 transition-colors py-3 rounded-sm font-medium"
                >
                  Register Your Team
                </a>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: BARBERING & STYLING BATTLES */}
      {activeTab === 'barber' && (
        <div>
          <div className="mb-12">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Solo Showdowns</p>
            <h3 className="font-serif text-3xl text-white font-light">Barbering & Styling Battles</h3>
            <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed mt-2 max-w-xl">
              Six hyper-focused individual battle fields structured to test precision speed, complex partitioning, and elite creative craftsmanship.
            </p>
          </div>

          {/* 3-Column Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-900 border border-neutral-900 overflow-hidden rounded-sm">
            {battleCategories.map((battle) => (
              <div key={battle.id} className="bg-[#050505] p-6 flex flex-col justify-between group min-h-[460px]">
                <div className="relative aspect-[4/3] w-full overflow-hidden border border-neutral-900 bg-neutral-950 rounded-xs mb-6">
                  <img
                    src={battle.image}
                    alt={battle.title}
                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                  <div className="absolute top-3 left-3 font-mono text-[9px] tracking-wider uppercase bg-black/80 border border-neutral-800 px-2 py-0.5 text-neutral-400 rounded-xs">
                    {battle.number}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-xl text-white font-light group-hover:text-amber-400 transition-colors tracking-tight">
                      {battle.title}
                    </h4>
                    <p className="font-sans text-xs text-neutral-400 mt-2 font-light leading-relaxed min-h-[60px]">
                      {battle.desc}
                    </p>
                  </div>
                  <div className="border-t border-neutral-900/60 pt-4 mt-6 flex items-center justify-between">
                    <div>
                      <span className="block font-mono text-[8px] uppercase tracking-wider text-neutral-600">Entry Stake</span>
                      <span className="font-sans text-sm font-medium text-white">{battle.price}</span>
                    </div>
                    <a
                      href="https://hebseventportal.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[10px] uppercase tracking-widest border border-neutral-800 text-neutral-300 hover:bg-white hover:text-black hover:border-white px-4 py-2 transition-all rounded-xs"
                    >
                      Enter Battle ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  )
}

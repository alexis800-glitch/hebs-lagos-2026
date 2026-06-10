import React from 'react'

export default function About() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto bg-[#050505] border-t border-neutral-900" id="about">

      {/* Part 1: High-Contrast Core Mission Statement */}
      <div className="text-center max-w-4xl mx-auto mb-28">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-amber-500 font-medium mb-4">
          A Premier International Beauty Event
        </p>
        <h2 className="font-serif text-3xl md:text-5xl font-light text-white tracking-tight leading-tight">
          Where Hair, Beauty, Fashion & Innovation Converge. The Global Hub for <span className="italic font-normal">Education, Creativity, and Industry Networking.</span>
        </h2>
        <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed mt-8 max-w-3xl mx-auto">
          The Hair Education Beauty Summit (HEBS) is not just another beauty event—it&apos;s an international movement dedicated to empowering, educating, and connecting professionals across the hair, beauty, and fashion industries. With a dynamic blend of cutting-edge education, high-stakes competitions, hands-on workshops, and unparalleled networking opportunities, HEBS stands as the premier summit for beauty professionals seeking to elevate their craft, build industry connections, and gain global recognition.
        </p>
      </div>

      {/* Part 2: What Sets HEBS Apart Grid Matrix */}
      <div className="border-t border-neutral-900 pt-16">
        <div className="mb-12">
          <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mb-2">Our Architecture</p>
          <h3 className="font-serif text-3xl text-white font-light">What Sets HEBS Apart?</h3>
        </div>

        {/* 4-Column Balanced Line Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-900 border border-neutral-900 overflow-hidden rounded-sm">

          {/* Card 01 */}
          <div className="bg-[#050505] p-6 flex flex-col justify-between min-h-[260px]">
            <div>
              <span className="font-mono text-xs text-neutral-600 block mb-4">01</span>
              <h4 className="font-serif text-lg text-white font-light mb-2">First-of-Its-Kind Industry Fusion</h4>
              <p className="font-sans text-[11px] text-neutral-400 font-light leading-relaxed">
                A Unified Beauty, Fashion & Education Platform where hairstylists, barbers, makeup artists, nail techs, fashion designers, and educators collaborate under one roof alongside top-tier global influencers.
              </p>
            </div>
          </div>

          {/* Card 02 */}
          <div className="bg-[#050505] p-6 flex flex-col justify-between min-h-[260px]">
            <div>
              <span className="font-mono text-xs text-neutral-600 block mb-4">02</span>
              <h4 className="font-serif text-lg text-white font-light mb-2">High-Value, Hands-On Learning</h4>
              <p className="font-sans text-[11px] text-neutral-400 font-light leading-relaxed">
                Focused entirely on technical education and real-world skills, ensuring every session is interactive, impactful, and delivers practical knowledge attendees can immediately apply to scale their business.
              </p>
            </div>
          </div>

          {/* Card 03 */}
          <div className="bg-[#050505] p-6 flex flex-col justify-between min-h-[260px]">
            <div>
              <span className="font-mono text-xs text-neutral-600 block mb-4">03</span>
              <h4 className="font-serif text-lg text-white font-light mb-2">Elite Competitive Championship</h4>
              <p className="font-sans text-[11px] text-neutral-400 font-light leading-relaxed">
                Featuring a $35,000 global cumulative prize stakes pool—the highest stakes beauty competition globally. The event transforms raw competition into a full-scale runway production with music, lights, and energy.
              </p>
            </div>
          </div>

          {/* Card 04 */}
          <div className="bg-[#050505] p-6 flex flex-col justify-between min-h-[260px]">
            <div>
              <span className="font-mono text-xs text-neutral-600 block mb-4">04</span>
              <h4 className="font-serif text-lg text-white font-light mb-2">A Truly Global Experience</h4>
              <p className="font-sans text-[11px] text-neutral-400 font-light leading-relaxed">
                Bringing diverse international beauty trends to Lagos, Nigeria to blend with local African influences, creating an unparalleled creative exchange and global networking opportunity.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Why Attend Footer Banner text layout */}
      <div className="mt-16 border border-neutral-900 bg-neutral-950/20 p-8 rounded-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <p className="font-sans text-xs text-neutral-400 max-w-2xl font-light leading-relaxed">
          <span className="text-white font-medium block mb-1">Why HEBS is a Must-Attend Event</span>
          Whether you are a hairstylist, barber, makeup artist, salon owner, brand executive, or fashion designer, HEBS provides the exact technical knowledge, core connections, and premium global platform you need to thrive in the modern industry.
        </p>
        <a href="https://hebseventportal.net" target="_blank" rel="noopener noreferrer" className="font-sans text-xs uppercase tracking-wider bg-white text-black hover:bg-neutral-200 px-5 py-3 font-medium transition-colors rounded-xs shrink-0 whitespace-nowrap">
          Secure Your Placement ↗
        </a>
      </div>

    </section>
  )
}

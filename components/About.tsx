import React from 'react'
import { BookOpen, Globe, Sparkles } from 'lucide-react'

export default function About() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto bg-[#050505] border-t border-neutral-900" id="about">

      {/* Part 0: Our Legacy Global Timeline Block */}
      <div className="border-y border-neutral-900/80 bg-neutral-950/20 py-24 my-16 px-4 -mx-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-start">

          {/* Left Column: Heading & Dense Visual Counter */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase text-amber-500 tracking-[0.25em] font-medium block">
              Timeline Matrix / 03
            </span>
            <h3 className="font-serif text-4xl text-white font-light tracking-tight mt-1">
              Our <span className="italic font-normal">Legacy</span>
            </h3>
          </div>

          {/* Right Column: Expansive, Highly Legible Text Block */}
          <div className="md:col-span-2">
            <p className="font-sans text-sm md:text-base text-neutral-300 font-light leading-relaxed tracking-wide">
              HEBS 2026 in Lagos, Nigeria marks our third year as a world-class beauty and fashion summit. After hosting two exceptionally successful events in <span className="text-white font-medium underline decoration-neutral-800 underline-offset-4">NY/NJ, USA</span>, we are now expanding dynamically to Africa—offering an even bigger, high-production platform for global education, high-stakes competition, and sustainable industry growth.
            </p>
          </div>

        </div>
      </div>

      {/* Part 1: High-Contrast Core Mission Statement */}
      <div className="text-center max-w-4xl mx-auto mb-28">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-amber-500 font-medium mb-4">
          A Premier International Beauty Event
        </p>
        <h2 className="font-serif text-3xl md:text-5xl font-light text-white tracking-tight leading-tight">
          Where Hair, Beauty, Fashion & Innovation Converge. The Global Hub for <span className="italic font-normal">Education, Creativity, and Industry Networking.</span>
        </h2>
        <p className="font-sans text-sm md:text-base text-neutral-300 font-light leading-relaxed mt-8 max-w-3xl mx-auto">
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
              <h4 className="font-serif text-xl font-light text-white mb-3 tracking-tight">First-of-Its-Kind Industry Fusion</h4>
              <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed">
                A Unified Beauty, Fashion & Education Platform where hairstylists, barbers, makeup artists, nail techs, fashion designers, and educators collaborate under one roof alongside top-tier global influencers.
              </p>
            </div>
          </div>

          {/* Card 02 */}
          <div className="bg-[#050505] p-6 flex flex-col justify-between min-h-[260px]">
            <div>
              <span className="font-mono text-xs text-neutral-600 block mb-4">02</span>
              <h4 className="font-serif text-xl font-light text-white mb-3 tracking-tight">High-Value, Hands-On Learning</h4>
              <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed">
                Focused entirely on technical education and real-world skills, ensuring every session is interactive, impactful, and delivers practical knowledge attendees can immediately apply to scale their business.
              </p>
            </div>
          </div>

          {/* Card 03 */}
          <div className="bg-[#050505] p-6 flex flex-col justify-between min-h-[260px]">
            <div>
              <span className="font-mono text-xs text-neutral-600 block mb-4">03</span>
              <h4 className="font-serif text-xl font-light text-white mb-3 tracking-tight">Elite Competitive Championship</h4>
              <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed">
                Featuring a $35,000 global cumulative prize stakes pool—the highest stakes beauty competition globally. The event transforms raw competition into a full-scale runway production with music, lights, and energy.
              </p>
            </div>
          </div>

          {/* Card 04 */}
          <div className="bg-[#050505] p-6 flex flex-col justify-between min-h-[260px]">
            <div>
              <span className="font-mono text-xs text-neutral-600 block mb-4">04</span>
              <h4 className="font-serif text-xl font-light text-white mb-3 tracking-tight">A Truly Global Experience</h4>
              <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed">
                Bringing diverse international beauty trends to Lagos, Nigeria to blend with local African influences, creating an unparalleled creative exchange and global networking opportunity.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Part 3: Our Mission Linear Matrix Stack */}
      <div className="border-t border-neutral-900 pt-16 mt-24">
        <div className="mb-12">
          <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mb-2">Our Core Purpose</p>
          <h3 className="font-serif text-3xl text-white font-light">Our Mission</h3>
        </div>

        <div className="flex flex-col border-t border-neutral-900">

          {/* Row 1 / Bridging Education */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 border-b border-neutral-900 gap-4 md:gap-12">
            <div className="flex items-center gap-4 w-full md:w-1/3 shrink-0">
              <BookOpen className="h-5 w-5 text-amber-400 shrink-0 stroke-[1.25]" />
              <h4 className="font-serif text-xl font-light text-white tracking-tight">Bridging Education with Opportunity</h4>
            </div>
            <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed max-w-2xl w-full">
              Providing beauty and industry professionals with world-class technical training, mentorship programs, and immediate access to the latest global trends and product innovations.
            </p>
          </div>

          {/* Row 2 / Connecting Professionals */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 border-b border-neutral-900 gap-4 md:gap-12">
            <div className="flex items-center gap-4 w-full md:w-1/3 shrink-0">
              <Globe className="h-5 w-5 text-neutral-400 shrink-0 stroke-[1.25]" />
              <h4 className="font-serif text-xl font-light text-white tracking-tight">Connecting Professionals Worldwide</h4>
            </div>
            <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed max-w-2xl w-full">
              Creating a dynamic global network and physical hub where hairstylists, masters barbers, creative makeup artists, fashion stylists, educators, and global brand leaders can seamlessly collaborate, share narratives, and grow collectively.
            </p>
          </div>

          {/* Row 3 / Empowering Next Gen */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 border-b border-neutral-900 gap-4 md:gap-12">
            <div className="flex items-center gap-4 w-full md:w-1/3 shrink-0">
              <Sparkles className="h-5 w-5 text-neutral-400 shrink-0 stroke-[1.25]" />
              <h4 className="font-serif text-xl font-light text-white tracking-tight">Empowering the Next Generation</h4>
            </div>
            <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed max-w-2xl w-full">
              Ensuring that the collective future of beauty, grooming, and high-fashion remains completely inclusive, boundary-pushing, hyper-innovative, and continuously driven by technical excellence.
            </p>
          </div>

        </div>
      </div>

      {/* Why Attend Footer Banner text layout */}
      <div className="mt-16 border border-neutral-900 bg-neutral-950/20 p-8 rounded-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <p className="font-sans text-sm text-neutral-300 max-w-2xl font-light leading-relaxed">
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

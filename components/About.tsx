import React from 'react'
import { BookOpen, Globe, Sparkles } from 'lucide-react'

const GradientDivider = () => (
  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-16" />
)

export default function About() {
  return (
    <section className="pb-24 px-5 sm:px-8 max-w-6xl mx-auto" id="about">

      {/* Part 0: Our Legacy */}
      <div className="border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 bg-zinc-900/50 backdrop-blur-md rounded-2xl p-8 md:p-12 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-start">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase text-amber-500 tracking-[0.25em] font-medium block">
              Timeline Matrix / 03
            </span>
            <h3 className="font-serif text-4xl text-white font-semibold tracking-tight mt-1">
              Our <span className="italic font-normal">Legacy</span>
            </h3>
          </div>
          <div className="md:col-span-2">
            <p className="text-zinc-200 text-sm md:text-base leading-relaxed font-sans">
              HEBS 2026 in Lagos, Nigeria marks our third year as a world-class beauty and fashion summit. After hosting two exceptionally successful events in{' '}
              <span className="text-white font-semibold">NY/NJ, USA</span>,
              we are now expanding dynamically to Africa—offering an even bigger, high-production platform for global education, high-stakes competition, and sustainable industry growth.
            </p>
          </div>
        </div>
      </div>

      <GradientDivider />

      {/* Part 1: Core Mission Statement */}
      <div className="w-full max-w-5xl mx-auto mt-12 mb-16 px-6 md:px-12 py-10 md:py-14 bg-zinc-900/50 border border-white/[0.06] rounded-2xl flex flex-col items-center backdrop-blur-md text-center">
        <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-amber-500/90 bg-amber-500/[0.06] border border-amber-500/20 px-3 py-1 rounded-full inline-block mb-4">
          A Premier International Beauty Event
        </span>
        <h2 className="text-zinc-100 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-tight lg:leading-[1.1] font-serif w-full">
          Where Hair, Beauty, Fashion &amp; Innovation Converge. The Global Hub for{' '}
          <span className="italic font-normal">Education, Creativity, and Industry Networking.</span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-zinc-400 w-full max-w-none md:max-w-3xl mx-auto px-2 md:px-0 mt-6 leading-relaxed text-left md:text-center">
          The Hair Education Beauty Summit (HEBS) is not just another beauty event—it&apos;s an international movement dedicated to empowering, educating, and connecting professionals across the hair, beauty, and fashion industries. With a dynamic blend of cutting-edge education, high-stakes competitions, hands-on workshops, and unparalleled networking opportunities, HEBS stands as the premier summit for beauty professionals seeking to elevate their craft, build industry connections, and gain global recognition.
        </p>
        <a
          href="https://hebseventportal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 mx-auto w-full sm:w-auto px-8 py-3 sm:py-2.5 bg-white text-black text-sm font-medium tracking-tight rounded-md border border-white/10 inline-flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-[1.01] active:scale-[0.99] touch-manipulation select-none"
        >
          Get Your Tickets
        </a>
      </div>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-16" />

      {/* Part 2: What Sets HEBS Apart */}
      <div>
        <div className="mb-12">
          <p className="font-sans text-xs uppercase tracking-widest text-zinc-400 mb-2">Our Architecture</p>
          <h3 className="font-serif text-3xl text-white font-semibold">What Sets HEBS Apart?</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 overflow-hidden rounded-2xl">
          {[
            { n: '01', title: 'First-of-Its-Kind Industry Fusion', body: 'A Unified Beauty, Fashion & Education Platform where hairstylists, barbers, makeup artists, nail techs, fashion designers, and educators collaborate under one roof alongside top-tier global influencers.' },
            { n: '02', title: 'High-Value, Hands-On Learning', body: 'Focused entirely on technical education and real-world skills, ensuring every session is interactive, impactful, and delivers practical knowledge attendees can immediately apply to scale their business.' },
            { n: '03', title: 'Elite Competitive Championship', body: 'Featuring a $35,000 global cumulative prize stakes pool—the highest stakes beauty competition globally. The event transforms raw competition into a full-scale runway production with music, lights, and energy.' },
            { n: '04', title: 'A Truly Global Experience', body: 'Bringing diverse international beauty trends to Lagos, Nigeria to blend with local African influences, creating an unparalleled creative exchange and global networking opportunity.' },
          ].map((card) => (
            <div key={card.n} className="bg-zinc-900/50 p-6 flex flex-col justify-between min-h-[260px]">
              <div>
                <span className="font-mono text-xs text-zinc-400 block mb-4">{card.n}</span>
                <h4 className="font-serif text-xl font-semibold text-white mb-3 tracking-tight">{card.title}</h4>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <GradientDivider />

      {/* Part 3: Our Mission */}
      <div>
        <div className="mb-12">
          <p className="font-sans text-xs uppercase tracking-widest text-zinc-400 mb-2">Our Core Purpose</p>
          <h3 className="font-serif text-3xl text-white font-semibold">Our Mission</h3>
        </div>

        <div className="flex flex-col">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {[
            { Icon: BookOpen, title: 'Bridging Education with Opportunity', body: 'Providing beauty and industry professionals with world-class technical training, mentorship programs, and immediate access to the latest global trends and product innovations.' },
            { Icon: Globe, title: 'Connecting Professionals Worldwide', body: 'Creating a dynamic global network and physical hub where hairstylists, masters barbers, creative makeup artists, fashion stylists, educators, and global brand leaders can seamlessly collaborate, share narratives, and grow collectively.' },
            { Icon: Sparkles, title: 'Empowering the Next Generation', body: 'Ensuring that the collective future of beauty, grooming, and high-fashion remains completely inclusive, boundary-pushing, hyper-innovative, and continuously driven by technical excellence.' },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 border-b border-white/10 gap-4 md:gap-12">
              <div className="flex items-center gap-4 w-full md:w-1/3 shrink-0">
                <Icon className="text-amber-500 h-5 w-5 shrink-0" />
                <h4 className="text-white text-base md:text-lg font-medium tracking-tight">{title}</h4>
              </div>
              <p className="font-sans text-sm text-zinc-200 leading-relaxed max-w-2xl w-full">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Attend Footer Banner */}
      <div className="mt-16 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 bg-zinc-900/50 backdrop-blur-md rounded-2xl p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <p className="font-sans text-sm text-zinc-400 max-w-2xl leading-relaxed">
          <span className="text-white font-semibold block mb-1">Why HEBS is a Must-Attend Event</span>
          Whether you are a hairstylist, barber, makeup artist, salon owner, brand executive, or fashion designer, HEBS provides the exact technical knowledge, core connections, and premium global platform you need to thrive in the modern industry.
        </p>
        <a
          href="https://hebseventportal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto bg-gradient-to-r from-[#d91b5c] via-[#c41263] to-[#a30b54] text-white font-semibold text-sm tracking-wide px-8 py-4 rounded-xl whitespace-nowrap inline-flex items-center justify-center gap-2 shadow-lg transition-transform duration-200 active:scale-[0.98] cursor-pointer font-sans touch-manipulation select-none"
        >
          Secure Your Placement ↗
        </a>
      </div>

    </section>
  )
}

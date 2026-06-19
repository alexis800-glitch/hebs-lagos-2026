import React from 'react'
import { BookOpen, Globe, Sparkles } from 'lucide-react'

const GradientDivider = () => (
  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-16" />
)

export default function About() {
  return (
    <section className="pb-24 px-6 max-w-6xl mx-auto" id="about">

      {/* Part 0: Our Legacy */}
      <div className="border border-white/10 hover:border-white/30 transition-all duration-500 ease-out shadow-lg hover:shadow-white/[0.02] bg-zinc-950/40 rounded-xl backdrop-blur-sm shadow-sm p-8 md:p-12 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-start">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase text-amber-500 tracking-[0.25em] font-medium block">
              Timeline Matrix / 03
            </span>
            <h3 className="font-serif text-4xl text-white font-light tracking-tight mt-1">
              Our <span className="italic font-normal">Legacy</span>
            </h3>
          </div>
          <div className="md:col-span-2">
            <p className="font-sans text-sm md:text-base text-neutral-300 font-light leading-relaxed tracking-wide">
              HEBS 2026 in Lagos, Nigeria marks our third year as a world-class beauty and fashion summit. After hosting two exceptionally successful events in{' '}
              <span className="text-white font-medium underline decoration-neutral-800 underline-offset-4">NY/NJ, USA</span>,
              we are now expanding dynamically to Africa—offering an even bigger, high-production platform for global education, high-stakes competition, and sustainable industry growth.
            </p>
          </div>
        </div>
      </div>

      <GradientDivider />

      {/* Part 1: Core Mission Statement */}
      <div className="max-w-5xl mx-auto mt-12 mb-16 p-8 md:p-12 bg-zinc-950/50 border border-white/10 hover:border-white/30 transition-all duration-500 ease-out shadow-lg hover:shadow-white/[0.02] rounded-2xl flex flex-col items-center justify-center text-center backdrop-blur-md shadow-2xl">
        <p className="text-amber-500 font-mono text-[10px] tracking-widest uppercase text-center mb-6">
          A Premier International Beauty Event
        </p>
        <h2 className="text-white text-3xl md:text-5xl font-light tracking-tight text-center leading-tight max-w-4xl mx-auto font-serif">
          Where Hair, Beauty, Fashion &amp; Innovation Converge. The Global Hub for{' '}
          <span className="italic font-normal">Education, Creativity, and Industry Networking.</span>
        </h2>
        <p className="text-zinc-300 text-sm md:text-base text-center leading-relaxed max-w-3xl mx-auto mt-8 font-sans font-light">
          The Hair Education Beauty Summit (HEBS) is not just another beauty event—it&apos;s an international movement dedicated to empowering, educating, and connecting professionals across the hair, beauty, and fashion industries. With a dynamic blend of cutting-edge education, high-stakes competitions, hands-on workshops, and unparalleled networking opportunities, HEBS stands as the premier summit for beauty professionals seeking to elevate their craft, build industry connections, and gain global recognition.
        </p>
      </div>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-16" />

      {/* Part 2: What Sets HEBS Apart */}
      <div>
        <div className="mb-12">
          <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mb-2">Our Architecture</p>
          <h3 className="font-serif text-3xl text-white font-light">What Sets HEBS Apart?</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-500 ease-out shadow-lg hover:shadow-white/[0.02] overflow-hidden rounded-xl">
          {[
            { n: '01', title: 'First-of-Its-Kind Industry Fusion', body: 'A Unified Beauty, Fashion & Education Platform where hairstylists, barbers, makeup artists, nail techs, fashion designers, and educators collaborate under one roof alongside top-tier global influencers.' },
            { n: '02', title: 'High-Value, Hands-On Learning', body: 'Focused entirely on technical education and real-world skills, ensuring every session is interactive, impactful, and delivers practical knowledge attendees can immediately apply to scale their business.' },
            { n: '03', title: 'Elite Competitive Championship', body: 'Featuring a $35,000 global cumulative prize stakes pool—the highest stakes beauty competition globally. The event transforms raw competition into a full-scale runway production with music, lights, and energy.' },
            { n: '04', title: 'A Truly Global Experience', body: 'Bringing diverse international beauty trends to Lagos, Nigeria to blend with local African influences, creating an unparalleled creative exchange and global networking opportunity.' },
          ].map((card) => (
            <div key={card.n} className="bg-zinc-950/60 p-6 flex flex-col justify-between min-h-[260px]">
              <div>
                <span className="font-mono text-xs text-neutral-600 block mb-4">{card.n}</span>
                <h4 className="font-serif text-xl font-light text-white mb-3 tracking-tight">{card.title}</h4>
                <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <GradientDivider />

      {/* Part 3: Our Mission */}
      <div>
        <div className="mb-12">
          <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mb-2">Our Core Purpose</p>
          <h3 className="font-serif text-3xl text-white font-light">Our Mission</h3>
        </div>

        <div className="flex flex-col">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {[
            { Icon: BookOpen, iconClass: 'text-amber-400', title: 'Bridging Education with Opportunity', body: 'Providing beauty and industry professionals with world-class technical training, mentorship programs, and immediate access to the latest global trends and product innovations.' },
            { Icon: Globe, iconClass: 'text-neutral-400', title: 'Connecting Professionals Worldwide', body: 'Creating a dynamic global network and physical hub where hairstylists, masters barbers, creative makeup artists, fashion stylists, educators, and global brand leaders can seamlessly collaborate, share narratives, and grow collectively.' },
            { Icon: Sparkles, iconClass: 'text-neutral-400', title: 'Empowering the Next Generation', body: 'Ensuring that the collective future of beauty, grooming, and high-fashion remains completely inclusive, boundary-pushing, hyper-innovative, and continuously driven by technical excellence.' },
          ].map(({ Icon, iconClass, title, body }) => (
            <div key={title} className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 border-b border-white/10 gap-4 md:gap-12">
              <div className="flex items-center gap-4 w-full md:w-1/3 shrink-0">
                <Icon className={`h-5 w-5 ${iconClass} shrink-0 stroke-[1.25]`} />
                <h4 className="font-serif text-xl font-light text-white tracking-tight">{title}</h4>
              </div>
              <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed max-w-2xl w-full">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Attend Footer Banner */}
      <div className="mt-16 border border-white/10 hover:border-white/30 transition-all duration-500 ease-out shadow-lg hover:shadow-white/[0.02] bg-zinc-950/40 backdrop-blur-sm shadow-sm rounded-xl p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <p className="font-sans text-sm text-neutral-300 max-w-2xl font-light leading-relaxed">
          <span className="text-white font-medium block mb-1">Why HEBS is a Must-Attend Event</span>
          Whether you are a hairstylist, barber, makeup artist, salon owner, brand executive, or fashion designer, HEBS provides the exact technical knowledge, core connections, and premium global platform you need to thrive in the modern industry.
        </p>
        <a
          href="https://hebseventportal.com/register"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs uppercase tracking-wider bg-white text-black hover:bg-neutral-200 px-5 py-3 font-medium transition-colors rounded-lg shrink-0 whitespace-nowrap"
        >
          Secure Your Placement ↗
        </a>
      </div>

    </section>
  )
}

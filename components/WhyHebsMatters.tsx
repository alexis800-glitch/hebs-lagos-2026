"use client";

import { motion } from "framer-motion";
import { TrendingUp, Plane, Handshake, GraduationCap } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const PILLARS = [
  {
    Icon: TrendingUp,
    accent: "#f59e0b",
    title: "Economic Empowerment",
    body: "An economic development platform that empowers entrepreneurs, creates jobs, and drives business growth across Nigeria's beauty and creative industries.",
  },
  {
    Icon: Plane,
    accent: "#e91e8c",
    title: "Tourism & Investment",
    body: "Attracting international visitors, delegates, and foreign investment — positioning Lagos as one of the world's emerging beauty destinations.",
  },
  {
    Icon: Handshake,
    accent: "#9b59b6",
    title: "Trade & Partnerships",
    body: "Strengthening international trade and connecting Nigerian manufacturing, distribution, and innovation to global markets and partners.",
  },
  {
    Icon: GraduationCap,
    accent: "#f59e0b",
    title: "Industry Development",
    body: "Transforming Nigerian and African talent into globally recognized brands through world-class education, investment, and international opportunity.",
  },
] as const;

const AUDIENCE = [
  "Global Brands",
  "Investors",
  "Educators",
  "Manufacturers",
  "Distributors",
  "Salon Owners",
  "Barbers",
  "Hairstylists",
  "Braiders",
  "Makeup Artists",
  "Nail Technicians",
  "Students",
  "Creative Entrepreneurs",
] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function WhyHebsMatters() {
  const mounted = useMounted();

  return (
    <section id="why-hebs-matters" className="py-16 md:py-24 px-5 sm:px-8 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 22 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-amber-400 font-medium mb-3">
            Beyond the Stage · Economic Impact
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight mb-6">
            Why HEBS Lagos <span className="italic font-medium">Matters</span>
          </h2>
          <p className="text-zinc-300 text-[15px] leading-relaxed max-w-2xl mx-auto">
            HEBS is not simply a competition — it is an economic development
            platform built to transform Nigerian and African talent into globally
            recognized brands through education, investment, innovation, tourism,
            manufacturing, and international partnerships.
          </p>
        </motion.div>

        {/* Impact pillars */}
        <motion.div
          variants={container}
          initial={mounted ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-12 md:mb-16"
        >
          {PILLARS.map(({ Icon, accent, title, body }) => (
            <motion.div
              key={title}
              variants={item}
              className="relative rounded-2xl p-6 sm:p-7 bg-zinc-950/80 border border-white/10 overflow-hidden flex flex-col"
              style={{ boxShadow: `0 0 0 1px ${accent}22, 0 20px 48px -20px ${accent}30` }}
            >
              <span
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
              />
              <Icon className="h-6 w-6 mb-5 stroke-[1.5]" style={{ color: accent }} />
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-white tracking-tight leading-snug mb-3">
                {title}
              </h3>
              <p className="font-sans text-[13px] text-zinc-400 font-light leading-relaxed">
                {body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Who will be in the room */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 22 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-zinc-950/60 p-7 sm:p-10 text-center"
        >
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-400 mb-3">
            Who Will Be in the Room
          </p>
          <p className="font-sans text-sm text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto mb-7">
            HEBS Lagos unites the full value chain of the beauty economy — industry
            leaders from across Nigeria, Africa, and the diaspora:
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
            {AUDIENCE.map((a) => (
              <span
                key={a}
                className="font-sans text-xs sm:text-[13px] text-zinc-200 font-light border border-white/15 bg-white/[0.03] rounded-full px-4 py-2"
              >
                {a}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const opportunities = [
  {
    tag: "01 / Sponsor",
    title: "Sponsor Opportunities",
    desc: "Align your brand with the premier beauty summit in Africa. Reach thousands of professionals, influencers, and industry leaders.",
    cta: "Become a Sponsor →",
  },
  {
    tag: "02 / Vendor",
    title: "Vendor Opportunities",
    desc: "Showcase your products and services to an engaged audience of beauty professionals, students, and enthusiasts from around the globe.",
    cta: "Reserve Your Booth →",
  },
];

export default function SponsorsVendors() {
  const mounted = useMounted();

  return (
    <section id="sponsors" className="py-24 px-4 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 30 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="border-b border-neutral-900 pb-10 mb-0 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mb-3">
              Partnerships
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight">
              Grow Your Brand at{" "}
              <em className="font-normal italic">HEBS 2026</em>
            </h2>
          </div>
          <p className="font-sans text-sm font-light text-neutral-400 max-w-xs leading-relaxed">
            Join the brands and vendors that power the most exciting beauty summit in the world.
          </p>
        </motion.div>

        {/* Asymmetric split-screen row */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-900 border-b border-neutral-900"
        >
          {opportunities.map((opp) => (
            <div key={opp.title} className="p-10 md:p-12 flex flex-col gap-6">
              <p className="font-sans text-[10px] uppercase tracking-widest text-neutral-600">
                {opp.tag}
              </p>
              <h3 className="font-serif text-2xl font-light text-white tracking-tight">
                {opp.title}
              </h3>
              <p className="font-sans text-sm font-light text-neutral-400 leading-relaxed">
                {opp.desc}
              </p>
              <a
                href="mailto:info@thehebs.com"
                className="font-sans text-xs uppercase tracking-wider text-white border-b border-neutral-700 hover:border-white pb-1 w-fit transition-colors duration-200 mt-auto"
              >
                {opp.cta}
              </a>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

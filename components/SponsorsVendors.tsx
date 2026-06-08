"use client";

import { motion } from "framer-motion";
import { Handshake, ShoppingBag, ArrowRight } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const opportunities = [
  {
    icon: Handshake,
    title: "Sponsor Opportunities",
    desc: "Align your brand with the premier beauty summit in Africa. Reach thousands of professionals, influencers, and industry leaders.",
    cta: "Become a Sponsor",
    gradient: "linear-gradient(135deg, rgba(155,89,182,0.25), rgba(155,89,182,0.08))",
    border: "rgba(155,89,182,0.4)",
    iconColor: "#9b59b6",
  },
  {
    icon: ShoppingBag,
    title: "Vendor Opportunities",
    desc: "Showcase your products and services to an engaged audience of beauty professionals, students, and enthusiasts from around the globe.",
    cta: "Reserve Your Booth",
    gradient: "linear-gradient(135deg, rgba(233,30,140,0.2), rgba(233,30,140,0.06))",
    border: "rgba(233,30,140,0.4)",
    iconColor: "#e91e8c",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function SponsorsVendors() {
  const mounted = useMounted();

  return (
    <section id="sponsors" className="py-24 px-4" style={{ background: "#0d0d0d" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={mounted ? { opacity: 0, y: 30 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center mb-16"
        >
          <p
            className="text-sm font-semibold uppercase tracking-[0.2em] mb-4 font-inter"
            style={{ color: "#9b59b6" }}
          >
            Partnerships
          </p>
          <h2 className="section-title text-white mb-6">
            Grow Your Brand at{" "}
            <span className="gradient-text italic">HEBS 2026</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Join the brands and vendors that power the most exciting beauty summit in the world.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial={mounted ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {opportunities.map((opp) => {
            const Icon = opp.icon;
            return (
              <motion.div
                key={opp.title}
                variants={card}
                className="rounded-2xl p-8 flex flex-col gap-5"
                style={{
                  background: opp.gradient,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: `1px solid ${opp.border}`,
                }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(22,22,22,0.5)", border: `1px solid ${opp.border}` }}
                >
                  <Icon size={24} style={{ color: opp.iconColor }} />
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-2xl text-white mb-3">{opp.title}</h3>
                  <p className="font-inter text-sm leading-relaxed" style={{ color: "#aaaaaa" }}>
                    {opp.desc}
                  </p>
                </div>
                <a
                  href="mailto:info@thehebs.com"
                  className="inline-flex items-center gap-2 font-semibold text-sm font-inter mt-auto"
                  style={{ color: opp.iconColor }}
                >
                  {opp.cta}
                  <ArrowRight size={16} />
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

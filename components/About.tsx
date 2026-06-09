"use client";

import { motion } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const stats = [
  {
    value: "3",
    suffix: " Years",
    label: "Running",
    desc: "From New York to New Jersey to Lagos — HEBS keeps growing.",
  },
  {
    value: "$35,000",
    suffix: "",
    label: "Grand Prize",
    desc: "The biggest prize pool in beauty summit history.",
  },
  {
    value: "Int'l",
    suffix: "",
    label: "Attendees",
    desc: "Professionals flying in from across the globe.",
  },
];

export default function About() {
  const mounted = useMounted();

  return (
    <section id="about" className="py-24 px-4 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 30 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-16"
        >
          <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mb-4">
            About HEBS
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight mb-4">
            Where Talent Meets <em className="font-normal italic">Global Stage</em>
          </h2>
          <p className="font-sans text-sm font-light text-neutral-400 leading-relaxed max-w-2xl">
            The Hair Education Beauty Summit is the premier platform for hair, beauty, and fashion
            professionals to compete, connect, and elevate their craft on an international scale.
          </p>
        </motion.div>

        {/* Stats — flat border matrix */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="grid grid-cols-1 md:grid-cols-3 border-y border-neutral-900 divide-y md:divide-y-0 md:divide-x divide-neutral-900"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="px-8 py-12">
              <p className="font-sans text-5xl font-extralight tracking-tight text-white mb-1">
                {stat.value}
                {stat.suffix && (
                  <span className="text-2xl font-extralight text-neutral-400">{stat.suffix}</span>
                )}
              </p>
              <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mt-3 mb-3">
                {stat.label}
              </p>
              <p className="font-sans text-sm font-light text-neutral-500 leading-relaxed">
                {stat.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

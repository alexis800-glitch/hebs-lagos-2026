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

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function About() {
  const mounted = useMounted();

  return (
    <section id="about" className="py-24 px-4" style={{ background: "#0d0d0d" }}>
      <div className="max-w-6xl mx-auto">
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
            About HEBS
          </p>
          <h2 className="section-title text-white mb-6">
            Where Talent Meets
            <br />
            <span className="gradient-text italic">Global Stage</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            The Hair Education Beauty Summit is the premier platform for hair, beauty, and fashion
            professionals to compete, connect, and elevate their craft on an international scale.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial={mounted ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={card}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <div
                className="font-playfair font-bold mb-1"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 4rem)",
                  background: "linear-gradient(135deg, #9b59b6, #e91e8c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
                <span style={{ fontSize: "60%" }}>{stat.suffix}</span>
              </div>
              <div className="text-white font-semibold text-xl font-playfair mb-3">
                {stat.label}
              </div>
              <p className="text-sm font-inter" style={{ color: "#aaaaaa" }}>
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

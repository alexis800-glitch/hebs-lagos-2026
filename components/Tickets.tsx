"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const tickets = [
  {
    name: "1-Day Pass",
    earlyBird: "$45",
    standard: "$65",
    features: ["Access to one day", "General sessions", "Networking"],
    featured: false,
  },
  {
    name: "2-Day Pass",
    earlyBird: "$80",
    standard: "$110",
    features: ["Access to two days", "All general sessions", "Networking events"],
    featured: false,
  },
  {
    name: "3-Day All-Inclusive",
    earlyBird: "$175",
    standard: "$250",
    features: ["Full 3-day access", "Masterclasses", "Competitions", "Networking & gala"],
    featured: true,
  },
  {
    name: "VIP Experience",
    earlyBird: "$400",
    standard: "$600",
    features: [
      "Full 3-day VIP access",
      "Priority seating",
      "Exclusive VIP lounge",
      "Meet & greet access",
      "Merchandise package",
    ],
    featured: false,
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export default function Tickets() {
  return (
    <section
      id="tickets"
      className="py-24 px-4"
      style={{ background: "#080808" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center mb-16"
        >
          <p
            className="text-sm font-semibold uppercase tracking-[0.2em] mb-4 font-inter"
            style={{ color: "#9b59b6" }}
          >
            Tickets
          </p>
          <h2 className="section-title text-white mb-6">
            Choose Your{" "}
            <span className="gradient-text italic">Experience</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Early bird pricing available for a limited time. Secure your spot before prices increase.
          </p>
        </motion.div>

        {/* Pricing toggle label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center justify-center gap-6 mb-10"
        >
          <span
            className="px-4 py-1.5 rounded-full text-sm font-semibold font-inter"
            style={{ background: "linear-gradient(135deg,#9b59b6,#e91e8c)", color: "#fff" }}
          >
            Early Bird
          </span>
          <span className="text-sm font-inter" style={{ color: "#aaaaaa" }}>
            vs
          </span>
          <span
            className="px-4 py-1.5 rounded-full text-sm font-semibold font-inter"
            style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#aaaaaa" }}
          >
            Standard
          </span>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {tickets.map((ticket) => (
            <motion.div
              key={ticket.name}
              variants={card}
              className="relative rounded-2xl p-7 flex flex-col"
              style={{
                background: ticket.featured
                  ? "linear-gradient(145deg, rgba(155,89,182,0.25), rgba(233,30,140,0.15))"
                  : "rgba(22,22,22,0.7)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: ticket.featured
                  ? "1px solid rgba(233,30,140,0.5)"
                  : "1px solid rgba(155,89,182,0.18)",
              }}
            >
              {ticket.featured && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold font-inter"
                  style={{ background: "linear-gradient(135deg, #9b59b6, #e91e8c)", color: "#fff" }}
                >
                  <Star size={11} fill="currentColor" />
                  Best Value
                </div>
              )}

              <h3 className="font-playfair font-bold text-lg text-white mb-5">{ticket.name}</h3>

              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="text-3xl font-bold font-playfair"
                  style={{
                    background: "linear-gradient(135deg, #9b59b6, #e91e8c)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {ticket.earlyBird}
                </span>
                <span className="text-xs font-inter" style={{ color: "#aaaaaa" }}>
                  early bird
                </span>
              </div>
              <p className="text-sm mb-6 font-inter" style={{ color: "#555" }}>
                {ticket.standard} standard
              </p>

              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {ticket.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-inter" style={{ color: "#aaaaaa" }}>
                    <Check size={15} className="mt-0.5 shrink-0" style={{ color: "#9b59b6" }} />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="https://hebseventportal.com"
                target="_blank"
                rel="noopener noreferrer"
                className={ticket.featured ? "btn-pink text-sm" : "btn-outline text-sm"}
              >
                Buy Tickets Now
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

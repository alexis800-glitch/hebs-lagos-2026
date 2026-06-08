"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  GraduationCap,
  MessageSquare,
  Trophy,
  Users,
  HandMetal,
} from "lucide-react";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const highlights = [
  {
    icon: Sparkles,
    title: "Luxury Pre-Gala Party",
    desc: "Kick off the summit in style with an exclusive pre-gala celebration featuring live entertainment and networking.",
  },
  {
    icon: GraduationCap,
    title: "Immersive Masterclasses",
    desc: "Learn cutting-edge techniques from world-class educators across hair, beauty, and fashion disciplines.",
  },
  {
    icon: MessageSquare,
    title: "Panel Discussions",
    desc: "Gain insight from industry leaders on trends, business growth, and the future of the beauty industry.",
  },
  {
    icon: Trophy,
    title: "Creative Competitions",
    desc: "Compete in high-stakes creative challenges with $35,000 in prizes up for grabs.",
  },
  {
    icon: Users,
    title: "Networking",
    desc: "Connect with hundreds of professionals, brands, and collaborators from around the world.",
  },
  {
    icon: HandMetal,
    title: "Hands-On Learning",
    desc: "Participate in live demonstrations and interactive workshops to sharpen your skills.",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export default function EventHighlights() {
  return (
    <section
      id="highlights"
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
            style={{ color: "#e91e8c" }}
          >
            What to Expect
          </p>
          <h2 className="section-title text-white mb-6">
            Event Highlights
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Three days of immersive beauty education, fierce competition, and global connection.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <motion.div
                key={h.title}
                variants={item}
                className="rounded-2xl p-7 group transition-all duration-300"
                style={{
                  background: "rgba(22,22,22,0.6)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(155,89,182,0.18)",
                }}
                whileHover={{
                  borderColor: "rgba(233,30,140,0.45)",
                  y: -4,
                  transition: { duration: 0.25 },
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: "linear-gradient(135deg, rgba(155,89,182,0.3), rgba(233,30,140,0.2))",
                    border: "1px solid rgba(155,89,182,0.3)",
                  }}
                >
                  <Icon size={22} style={{ color: "#e91e8c" }} />
                </div>
                <h3 className="font-playfair font-bold text-lg text-white mb-3">{h.title}</h3>
                <p className="text-sm font-inter leading-relaxed" style={{ color: "#aaaaaa" }}>
                  {h.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

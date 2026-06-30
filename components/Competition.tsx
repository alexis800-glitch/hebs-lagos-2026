"use client";

import { motion } from "framer-motion";
import { Trophy, Calendar, Users } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const prizes = [
  { place: "1st Place", amount: "$20,000 USD", ngn: "₦28,000,000", gradient: "linear-gradient(135deg, #FFD700, #FFA500)" },
  { place: "2nd Place", amount: "$10,000 USD", ngn: "₦14,000,000", gradient: "linear-gradient(135deg, #C0C0C0, #A0A0A0)" },
  { place: "3rd Place", amount: "$5,000 USD",  ngn: "₦7,000,000",  gradient: "linear-gradient(135deg, #CD7F32, #A0522D)" },
];

const team = [
  { role: "Hairstylist",      icon: "✂️" },
  { role: "Barber",           icon: "💈" },
  { role: "Makeup Artist",    icon: "💄" },
  { role: "Fashion Designer", icon: "👗" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Competition() {
  const mounted = useMounted();

  return (
    <section id="competition" className="pt-24 pb-8 px-4" style={{ background: "#0d0d0d" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={mounted ? { opacity: 0, y: 30 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy size={28} style={{ color: "#FFD700" }} />
            <p
              className="text-sm font-semibold uppercase tracking-[0.2em] font-inter"
              style={{ color: "#FFD700" }}
            >
              Grand Prize Competition
            </p>
          </div>
          <h2 className="section-title text-white mb-2">
            $35,000 USD Grand Prize{" "}
            <span className="gradient-text italic">Showdown</span>
          </h2>
          <p className="text-zinc-500 text-sm font-mono tabular-nums mb-4">(₦49,000,000)</p>
          <p className="section-subtitle max-w-xl mx-auto">
            Assemble your dream team and compete for the biggest prize in beauty summit history.
          </p>
        </motion.div>

        {/* Prize table */}
        <motion.div
          variants={container}
          initial={mounted ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14"
        >
          {prizes.map((prize) => (
            <motion.div
              key={prize.place}
              variants={fadeInUp}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <div
                className="text-3xl md:text-4xl font-bold font-playfair mb-2"
                style={{
                  background: prize.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {prize.amount}
              </div>
              <div className="text-zinc-400 text-xs font-mono mt-0.5 mb-1 tabular-nums">{prize.ngn}</div>
              <div className="text-white font-semibold font-inter">{prize.place}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Team composition */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 30 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-2xl p-8 mb-10"
          style={{
            background: "rgba(155,89,182,0.08)",
            border: "1px solid rgba(155,89,182,0.25)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Users size={22} style={{ color: "#9b59b6" }} />
            <h3 className="font-playfair font-bold text-xl text-white">Team Composition</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {team.map((member) => (
              <div
                key={member.role}
                className="flex flex-col items-center gap-2 p-4 rounded-xl"
                style={{
                  background: "rgba(22,22,22,0.6)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span className="text-3xl">{member.icon}</span>
                <span className="text-sm font-semibold text-white text-center font-inter">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Registration deadline + CTA */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 25 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Calendar size={18} style={{ color: "#e91e8c" }} />
            <p className="font-inter text-sm" style={{ color: "#aaaaaa" }}>
              Registration Deadline:&nbsp;
              <span className="font-semibold" style={{ color: "#fff" }}>
                August 26, 2026
              </span>
            </p>
          </div>
          <a
            href="https://hebseventportal.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pink text-base md:text-lg"
          >
            Register to Compete
          </a>
        </motion.div>
      </div>
    </section>
  );
}

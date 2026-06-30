"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";

const EXPO = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EXPO } },
};

function IconScissors() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

function IconRazor() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="4" rx="1" />
      <rect x="6" y="7" width="12" height="14" rx="2" />
      <line x1="12" y1="10" x2="12" y2="18" />
      <line x1="9" y1="13" x2="15" y2="13" />
    </svg>
  );
}

function IconDiamond() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 5-10 13L2 8z" />
      <path d="M2 8h20" />
      <path d="M6 3l4 5M18 3l-4 5" />
    </svg>
  );
}

function IconBrush() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.37 2.63 14 7l-1.59-1.59 4.37-4.37 1.59 1.59z" />
      <path d="M14 7 8.5 12.5" />
      <path d="M8.5 12.5c-2 2-3 4.5-3 6.5 2 0 4.5-1 6.5-3L8.5 12.5z" />
    </svg>
  );
}

function IconLightning() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

const CATEGORIES = [
  {
    title: "Hair Styling",
    desc: "Showcase creativity, precision, and trend-setting hair artistry.",
    color: "#f59e0b",
    image: "/images/categories/hairstylist-competition-04.png",
    Icon: IconScissors,
  },
  {
    title: "Barbering",
    desc: "Compete with clean fades, sharp cuts, grooming skills, and barber artistry.",
    color: "#e91e8c",
    image: "/images/categories/barber-competition-02.png",
    Icon: IconRazor,
  },
  {
    title: "Nail Art",
    desc: "Display detailed nail design, beauty creativity, and technical excellence.",
    color: "#9b59b6",
    image: "/images/categories/nail-artist-competition-01.png",
    Icon: IconDiamond,
  },
  {
    title: "Makeup Artistry",
    desc: "Bring beauty, colour, and transformation to life through professional makeup.",
    color: "#f59e0b",
    image: "/images/categories/makeup-artist-competition-02.png",
    Icon: IconBrush,
  },
  {
    title: "Avant-Garde",
    desc: "Push creative boundaries with bold, artistic, and stage-ready looks.",
    color: "#e91e8c",
    image: "/images/categories/fashion-stylist-competition-01.png",
    Icon: IconLightning,
  },
  {
    title: "Education & Masterclasses",
    desc: "Learn from industry leaders through hands-on sessions and expert training.",
    color: "#9b59b6",
    image: "/images/highlights/industry-experts-panel.png",
    Icon: IconBook,
  },
];

export default function CompetitionCategories() {
  const mounted = useMounted();

  return (
    <section
      id="categories"
      className="py-16 md:py-24 px-5 sm:px-8 lg:px-12 bg-zinc-950"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 22 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EXPO }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-zinc-300 mb-5">
            HEBS Lagos 2026 · Six Disciplines
          </p>
          <h2 className="font-serif font-semibold text-4xl sm:text-5xl md:text-[3.25rem] tracking-tight leading-tight text-white mb-6">
            Choose Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-[#e91e8c] to-[#9b59b6]">
              Stage
            </span>
          </h2>
          <p className="text-zinc-300 text-[15px] leading-relaxed max-w-2xl mx-auto">
            From hair and barbering to nails, makeup, education, and avant-garde
            artistry, HEBS brings Africa&apos;s finest talents together on one
            global platform.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={container}
          initial={mounted ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {CATEGORIES.map((cat) => (
            <motion.a
              key={cat.title}
              variants={itemAnim}
              href="https://hebseventportal.com/register"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                boxShadow: `0 0 0 1px ${cat.color}55, 0 20px 50px -15px ${cat.color}30`,
                transition: { duration: 0.18 },
              }}
              className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] min-h-[260px] sm:min-h-[300px] cursor-pointer"
            >
              {/* Background image */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.06]">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>

                {/* Gradient only where text lives — top stays bright */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

                {/* Accent colour wash on hover */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at bottom left, ${cat.color}18 0%, transparent 65%)`,
                  }}
                />
              </div>

              {/* Card content */}
              <div className="relative z-10 flex flex-col flex-1 p-6">

                {/* Icon badge — top */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `${cat.color}1a`,
                    border: `1px solid ${cat.color}45`,
                    color: cat.color,
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  <cat.Icon />
                </div>

                {/* Push title + desc + CTA to bottom */}
                <div className="mt-auto pt-8">
                  <h3 className="font-sans text-white font-bold text-base leading-snug mb-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    {cat.title}
                  </h3>
                  <p className="text-zinc-100 text-sm leading-relaxed mb-5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {cat.desc}
                  </p>

                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={mounted ? { opacity: 0 } : false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EXPO, delay: 0.25 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <a
            href="https://hebseventportal.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold tracking-wide text-black bg-white px-8 py-3.5 rounded-xl hover:bg-amber-400 transition-colors duration-200 min-h-[48px]"
          >
            Register for Your Category ↗
          </a>
          <p className="font-mono text-xs tracking-widest uppercase text-zinc-300">
            Entry from $50 USD (₦70,000) · All categories open
          </p>
        </motion.div>

      </div>
    </section>
  );
}

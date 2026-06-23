"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { TestimonialCards, type CardData, type CardTheme } from "@/components/ui/testimonial-cards";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  image: string;
  initials: string;
  accent: string;
  objectPosition: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "aleetha-clanton",
    name: "Aleetha Clanton",
    title: "Professional Hairstylist & MUA",
    quote:
      "The energy in the room, the knowledge shared, and the connections made throughout the event were unforgettable.",
    image: "/images/testimonials/testimonial-aleetha-clanton.png",
    initials: "AC",
    accent: "from-amber-700 to-amber-900",
    objectPosition: "center top",
  },
  {
    id: "shantavia-taylor",
    name: "Shantavia Taylor",
    title: "Hairstylist & Mane Runway Show Producer",
    quote:
      "My experience at HEBS was truly inspiring and sparked a new level of creativity within me.",
    image: "/images/testimonials/testimonial-shantavia-taylor.png",
    initials: "ST",
    accent: "from-fuchsia-700 to-fuchsia-900",
    objectPosition: "center top",
  },
  {
    id: "juanda-roberts",
    name: "Juanda Roberts",
    title: "CEO, Princess Hair Pizzazz",
    quote:
      "I love the diversity in the beauty art forms celebrated, as well as the cultural diversity. HEBS is charting new territory.",
    image: "/images/testimonials/testimonial-juanda-roberts.png",
    initials: "JR",
    accent: "from-violet-700 to-violet-900",
    objectPosition: "center top",
  },
  {
    id: "akua-robinson",
    name: "Akua Robinson",
    title: "Podcaster, Friends in Beauty",
    quote:
      "I had the best time moderating the Wisdom Well panel and I can't wait to return to HEBS.",
    image: "/images/testimonials/testimonial-akua-robinson.png",
    initials: "AR",
    accent: "from-rose-700 to-rose-900",
    objectPosition: "center center",
  },
  {
    id: "krista-b",
    name: "Krista B.",
    title: "EIC, Unapologetically Eclectic",
    quote:
      "Being part of this event allowed me to step out on faith and keep broadening my horizons.",
    image: "/images/testimonials/testimonial-krista-b.png",
    initials: "KB",
    accent: "from-teal-700 to-teal-900",
    objectPosition: "center top",
  },
];

// ── 4 card themes — keyed by cluster position ─────────────────
const THEME_STYLES: Record<
  CardTheme,
  {
    bg: string;
    border: string;
    shadow: string;
    starColor: string;
    quoteColor: string;
    nameColor: string;
    titleColor: string;
    divider: string;
    ring: string;
  }
> = {
  // pos 0 — FRONT: deep black glass with subtle magenta glow
  front: {
    bg: "linear-gradient(150deg, rgba(10,4,22,0.97) 0%, rgba(4,2,9,0.99) 100%)",
    border: "1px solid rgba(255,255,255,0.09)",
    shadow:
      "0 28px 72px rgba(0,0,0,0.94), 0 0 0 1px rgba(200,50,240,0.07), inset 0 1px 0 rgba(255,255,255,0.05)",
    starColor: "#f59e0b",
    quoteColor: "#e4e4e7",
    nameColor: "#ffffff",
    titleColor: "#c084fc",
    divider: "rgba(255,255,255,0.07)",
    ring: "rgba(245,158,11,0.38)",
  },
  // pos 1 — ACCENT: magenta-to-purple gradient — distinctly brighter
  accent: {
    bg: "linear-gradient(145deg, rgba(120,20,115,0.84) 0%, rgba(80,28,160,0.88) 55%, rgba(6,2,16,0.94) 100%)",
    border: "1px solid rgba(232,40,140,0.30)",
    shadow:
      "0 24px 68px rgba(210,0,140,0.42), 0 0 0 1px rgba(232,40,140,0.14), inset 0 1px 0 rgba(255,120,220,0.10)",
    starColor: "#fbbf24",
    quoteColor: "#f3f4f6",
    nameColor: "#ffffff",
    titleColor: "#f9a8d4",
    divider: "rgba(232,40,140,0.20)",
    ring: "rgba(245,158,11,0.44)",
  },
  // pos 2 — GOLD: dark bronze/gold luxury
  gold: {
    bg: "linear-gradient(145deg, rgba(62,38,3,0.90) 0%, rgba(30,18,2,0.94) 55%, rgba(4,3,1,0.98) 100%)",
    border: "1px solid rgba(245,158,11,0.24)",
    shadow:
      "0 24px 62px rgba(160,98,0,0.34), 0 0 0 1px rgba(245,158,11,0.11), inset 0 1px 0 rgba(255,200,50,0.07)",
    starColor: "#f59e0b",
    quoteColor: "#fef3c7",
    nameColor: "#fefce8",
    titleColor: "#fbbf24",
    divider: "rgba(245,158,11,0.16)",
    ring: "rgba(245,158,11,0.50)",
  },
  // pos 3 — CHARCOAL: dark charcoal with subtle purple edge
  charcoal: {
    bg: "linear-gradient(145deg, rgba(26,26,33,0.95) 0%, rgba(12,12,17,0.98) 60%, rgba(38,16,56,0.40) 100%)",
    border: "1px solid rgba(147,51,234,0.16)",
    shadow:
      "0 24px 58px rgba(0,0,0,0.90), 0 0 0 1px rgba(147,51,234,0.08), inset 0 1px 0 rgba(255,255,255,0.03)",
    starColor: "#f59e0b",
    quoteColor: "#d4d4d8",
    nameColor: "#f4f4f5",
    titleColor: "#a78bfa",
    divider: "rgba(147,51,234,0.13)",
    ring: "rgba(245,158,11,0.30)",
  },
};

// ── Card component — theme-aware ───────────────────────────────
function TestimonialCard({ t, theme }: { t: Testimonial; theme: CardTheme }) {
  const [imgFailed, setImgFailed] = useState(false);
  const s = THEME_STYLES[theme];

  return (
    <div
      className="w-full h-full rounded-2xl flex flex-col select-none p-5"
      style={{
        background: s.bg,
        border: s.border,
        boxShadow: s.shadow,
      }}
    >
      {/* Stars */}
      <div className="flex gap-[3px] mb-3" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            style={{ fill: s.starColor, color: s.starColor }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="flex-1">
        <p
          className="font-sans leading-relaxed text-[13px]"
          style={{ color: s.quoteColor }}
        >
          &ldquo;{t.quote}&rdquo;
        </p>
      </blockquote>

      {/* Divider */}
      <div className="my-4" style={{ height: 1, background: s.divider }} />

      {/* Author row */}
      <div className="flex items-center gap-3">
        <div
          className="relative rounded-full overflow-hidden flex-shrink-0 w-10 h-10"
          style={{ boxShadow: `0 0 0 1.5px ${s.ring}` }}
        >
          {!imgFailed ? (
            <Image
              src={t.image}
              alt={t.name}
              fill
              sizes="40px"
              className="object-cover"
              style={{ objectPosition: t.objectPosition }}
              onError={() => setImgFailed(true)}
              draggable={false}
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${t.accent}`}
            >
              <span className="font-sans text-xs font-bold text-white">
                {t.initials}
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p
            className="font-sans font-semibold leading-tight text-[13px] truncate"
            style={{ color: s.nameColor }}
          >
            {t.name}
          </p>
          <p
            className="font-mono uppercase tracking-wider mt-[3px] text-[9px] truncate"
            style={{ color: s.titleColor }}
          >
            {t.title}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────
export default function TestimonialsSection() {
  const mounted = useMounted();

  const cards: CardData[] = TESTIMONIALS.map((t) => ({
    id: t.id,
    render: (theme: CardTheme) => <TestimonialCard t={t} theme={theme} />,
  }));

  const Glows = (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #e040fb 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }}
      />
    </div>
  );

  return (
    <section
      id="testimonials"
      className="relative bg-[#0d0d0d] overflow-x-hidden scroll-mt-20"
    >
      {Glows}

      {/*
        ════════════════════════════════════════════════
        MOBILE  —  below md (768 px)
        ════════════════════════════════════════════════
      */}
      <div className="md:hidden relative z-10 px-5 pt-20 pb-12 overflow-x-hidden">

        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400 mb-3"
        >
          Community Voices
        </motion.p>

        <motion.h2
          initial={mounted ? { opacity: 0, y: 14 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-serif text-[1.75rem] font-medium text-white leading-[1.2] tracking-tight mb-4"
        >
          What Beauty{" "}
          <em
            className="font-normal italic text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(90deg, #fcd34d 0%, #f472b6 50%, #c084fc 100%)",
              filter: "drop-shadow(0 0 8px rgba(252,211,77,0.45)) drop-shadow(0 0 18px rgba(240,171,252,0.30))",
            }}
          >
            Professionals
          </em>{" "}
          Are Saying
        </motion.h2>

        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="font-sans text-sm text-zinc-300 leading-relaxed mb-7"
        >
          Hairstylists, salon owners, and beauty professionals who experienced
          HEBS firsthand.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 10 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="flex items-center justify-between border-t border-b border-white/10 py-4 mb-8"
        >
          <div className="text-center flex-1">
            <p className="font-serif text-xl font-medium text-white">
              500<span className="text-amber-400">+</span>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
              Attendees
            </p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center flex-1">
            <p className="font-serif text-xl font-medium text-white">
              4.9<span className="text-amber-400">★</span>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
              Rating
            </p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center flex-1">
            <p className="font-serif text-xl font-medium text-white">
              100<span className="text-amber-400">%</span>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
              Return
            </p>
          </div>
        </motion.div>

        {/* Card stack */}
        <TestimonialCards cards={cards} autoRotateInterval={5000} />
      </div>

      {/*
        ════════════════════════════════════════════════
        DESKTOP  —  md+ (768 px)
        ════════════════════════════════════════════════
      */}
      <div className="hidden md:block relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_560px] gap-12 xl:gap-16 items-center">

          {/* Left — section header */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 30 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400 mb-4">
              Community Voices
            </p>

            <h2 className="font-serif text-4xl sm:text-5xl font-medium text-white leading-[1.15] tracking-tight mb-6">
              What Beauty{" "}
              <em
                className="font-normal italic text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(90deg, #fcd34d 0%, #f472b6 50%, #c084fc 100%)",
                  filter: "drop-shadow(0 0 8px rgba(252,211,77,0.45)) drop-shadow(0 0 18px rgba(240,171,252,0.30))",
                }}
              >
                Professionals
              </em>{" "}
              Are Saying About HEBS
            </h2>

            <p className="font-sans text-sm text-zinc-300 leading-relaxed max-w-sm">
              Hear directly from hairstylists, salon owners, beauty entrepreneurs,
              educators, and industry professionals who have experienced HEBS firsthand.
            </p>

            {/* Stat strip */}
            <div className="mt-10 flex gap-8">
              <div>
                <p className="font-serif text-3xl font-medium text-white">
                  500<span className="text-amber-400">+</span>
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
                  Attendees
                </p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="font-serif text-3xl font-medium text-white">
                  4.9<span className="text-amber-400">★</span>
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
                  Avg Rating
                </p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="font-serif text-3xl font-medium text-white">
                  100<span className="text-amber-400">%</span>
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
                  Would Return
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — card cluster */}
          <motion.div
            initial={mounted ? { opacity: 0, x: 40 } : false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="flex justify-center xl:justify-start"
          >
            <TestimonialCards cards={cards} autoRotateInterval={5000} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

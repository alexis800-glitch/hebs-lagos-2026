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

/*
  Dribbble-inspired card layout:
    ★ ★ ★ ★ ★
    "Quote text…"
    ─────────────────────────
    [avatar]  Name · Title
*/
function TestimonialCard({ t }: { t: Testimonial }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className="w-full h-full rounded-2xl flex flex-col select-none border border-white/[0.08] p-5 md:p-6"
      style={{
        background:
          "linear-gradient(150deg, rgba(14,8,26,0.96) 0%, rgba(6,4,14,0.98) 100%)",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.90), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px rgba(180,60,240,0.06)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Gold stars */}
      <div className="flex gap-[3px] mb-4" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className="fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="flex-1 mb-1">
        <p className="font-sans text-zinc-200 leading-relaxed text-sm md:text-[14.5px]">
          &ldquo;{t.quote}&rdquo;
        </p>
      </blockquote>

      {/* Thin divider */}
      <div
        className="my-4 md:my-5"
        style={{ height: "1px", background: "rgba(255,255,255,0.07)" }}
      />

      {/* Profile row */}
      <div className="flex items-center gap-3">
        {/* Circular headshot */}
        <div
          className="relative rounded-full overflow-hidden flex-shrink-0 w-10 h-10 md:w-11 md:h-11"
          style={{
            boxShadow: "0 0 0 1.5px rgba(245,158,11,0.35)",
          }}
        >
          {!imgFailed ? (
            <Image
              src={t.image}
              alt={t.name}
              fill
              sizes="44px"
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

        {/* Name + title */}
        <div className="min-w-0">
          <p className="font-sans font-semibold text-white leading-tight text-[13px] md:text-sm truncate">
            {t.name}
          </p>
          <p
            className="font-mono uppercase tracking-wider mt-[3px] text-[9px] md:text-[10px] truncate"
            style={{ color: "#c084fc" }}
          >
            {t.title}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const mounted = useMounted();

  const cards: CardData[] = TESTIMONIALS.map((t) => ({
    id: t.id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render: (_theme: CardTheme) => <TestimonialCard t={t} />,
  }));

  const Glows = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #e040fb 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full opacity-[0.03]"
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
        ══════════════════════════════════════════════════════
        MOBILE — below md (768px)
        Order: eyebrow → title → paragraph → stats → cards → dots
        TestimonialCards manages auto-rotate, drag, and dots.
        ══════════════════════════════════════════════════════
      */}
      <div className="md:hidden relative z-10 px-5 pt-28 pb-16 overflow-x-hidden">

        {/* Eyebrow */}
        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400 mb-3"
        >
          Community Voices
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={mounted ? { opacity: 0, y: 14 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-serif text-[1.85rem] font-light text-white leading-[1.2] tracking-tight mb-4"
        >
          What Beauty{" "}
          <em
            className="font-normal italic text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(90deg, #f59e0b, #e040fb)" }}
          >
            Professionals
          </em>{" "}
          Are Saying About HEBS
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="font-sans text-sm text-zinc-400 leading-relaxed mb-8"
        >
          Hear directly from hairstylists, salon owners, beauty entrepreneurs,
          educators, and industry professionals who have experienced HEBS firsthand.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 10 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="grid grid-cols-3 gap-4 text-center border-t border-b border-white/10 py-5 mb-10"
        >
          {[
            { value: "500+", label: "Attendees" },
            { value: "4.9★", label: "Avg Rating" },
            { value: "100%", label: "Would Return" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-serif text-2xl font-light text-white">
                {value.replace(/[+★%]/, "")}<span className="text-amber-400">{value.match(/[+★%]/)?.[0]}</span>
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mt-1">
                {label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Stacked card cluster — auto-rotates, swipeable, dots included */}
        <TestimonialCards cards={cards} autoRotateInterval={5000} />
      </div>

      {/*
        ══════════════════════════════════════════════════════
        DESKTOP — md+ (768px)
        Left: eyebrow, heading, paragraph, stats
        Right: Dribbble-inspired stacked card cluster
        ══════════════════════════════════════════════════════
      */}
      <div className="hidden md:block relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left column */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 30 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400 mb-4">
              Community Voices
            </p>

            <h2 className="font-serif text-4xl sm:text-5xl font-light text-white leading-[1.15] tracking-tight mb-6">
              What Beauty{" "}
              <em
                className="font-normal italic text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg, #f59e0b, #e040fb)" }}
              >
                Professionals
              </em>{" "}
              Are Saying About HEBS
            </h2>

            <p className="font-sans text-sm text-zinc-400 leading-relaxed max-w-sm">
              Hear directly from hairstylists, salon owners, beauty entrepreneurs,
              educators, and industry professionals who have experienced HEBS firsthand.
            </p>

            {/* Stat strip */}
            <div className="mt-10 flex gap-8">
              {[
                { n: "500+", label: "Attendees" },
                { n: "4.9★", label: "Avg Rating" },
                { n: "100%", label: "Would Return" },
              ].map(({ n: val, label }, idx, arr) => (
                <div key={label} className="flex gap-8 items-start">
                  <div>
                    <p className="font-serif text-3xl font-light text-white">
                      {val.replace(/[+★%]/, "")}
                      <span className="text-amber-400">{val.match(/[+★%]/)?.[0]}</span>
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
                      {label}
                    </p>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="w-px h-10 bg-white/10 mt-1" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column — stacked card cluster */}
          <motion.div
            initial={mounted ? { opacity: 0, x: 40 } : false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="flex justify-center lg:justify-end"
          >
            <TestimonialCards cards={cards} autoRotateInterval={5000} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

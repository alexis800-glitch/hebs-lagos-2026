"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { TestimonialCards, type CardData } from "@/components/ui/testimonial-cards";
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
    ★★★★★
    "Quote text…"
    ──────────────
    [avatar]  Name
              Title
*/
function TestimonialCard({ t }: { t: Testimonial }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className="w-full h-full rounded-2xl flex flex-col select-none border border-white/[0.07] p-5 md:p-7"
      style={{
        background:
          "linear-gradient(150deg, rgba(14,8,26,0.97) 0%, rgba(6,4,14,0.99) 100%)",
        boxShadow:
          "0 20px 64px rgba(0,0,0,0.88), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px rgba(180,60,240,0.05)",
      }}
    >
      {/* Stars */}
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
        <p className="font-sans text-zinc-200 leading-relaxed text-sm md:text-[15px]">
          &ldquo;{t.quote}&rdquo;
        </p>
      </blockquote>

      {/* Divider */}
      <div className="h-px bg-white/[0.07] my-4 md:my-5" />

      {/* Author row */}
      <div className="flex items-center gap-3">
        <div className="relative rounded-full overflow-hidden flex-shrink-0 ring-[1.5px] ring-amber-400/35 w-10 h-10 md:w-11 md:h-11">
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

  // Build card data once — shared between mobile and desktop stacks
  const cards: CardData[] = TESTIMONIALS.map((t) => ({
    id: t.id,
    content: <TestimonialCard t={t} />,
  }));

  const Glows = (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #e040fb 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.03]"
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
        MOBILE  —  below md (768px)
        eyebrow → title → paragraph → stats → card stack → dots
        TestimonialCards handles its own auto-rotate + drag + dots.
        ══════════════════════════════════════════════════════
      */}
      <div className="md:hidden relative z-10 px-5 pt-28 pb-16 overflow-x-hidden">

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
          <div>
            <p className="font-serif text-2xl font-light text-white">
              500<span className="text-amber-400">+</span>
            </p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mt-1">
              Attendees
            </p>
          </div>
          <div>
            <p className="font-serif text-2xl font-light text-white">
              4.9<span className="text-amber-400">★</span>
            </p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mt-1">
              Avg Rating
            </p>
          </div>
          <div>
            <p className="font-serif text-2xl font-light text-white">
              100<span className="text-amber-400">%</span>
            </p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mt-1">
              Would Return
            </p>
          </div>
        </motion.div>

        {/* Stacked card cluster — subtle on mobile, auto-rotates, swipeable, dots included */}
        <TestimonialCards cards={cards} autoRotateInterval={5000} />
      </div>

      {/*
        ══════════════════════════════════════════════════════
        DESKTOP  —  md+ (768px)
        Left: section header + stats
        Right: Dribbble-inspired stacked card cluster with hover spread
        ══════════════════════════════════════════════════════
      */}
      <div className="hidden md:block relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10 py-28 lg:py-36">
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
              <div>
                <p className="font-serif text-3xl font-light text-white">
                  500<span className="text-amber-400">+</span>
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
                  Attendees
                </p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="font-serif text-3xl font-light text-white">
                  4.9<span className="text-amber-400">★</span>
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
                  Avg Rating
                </p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="font-serif text-3xl font-light text-white">
                  100<span className="text-amber-400">%</span>
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
                  Would Return
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — stacked card cluster */}
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

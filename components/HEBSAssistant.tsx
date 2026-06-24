"use client";

import { useState, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";

// ─── Knowledge base ────────────────────────────────────────────────────────────

type KBEntry = { triggers: string[]; answer: string };

const KNOWLEDGE_BASE: KBEntry[] = [
  {
    triggers: ["what is hebs", "about hebs", "what hebs", "tell me about", "hair education", "beauty summit", "what is the event", "summit"],
    answer:
      "HEBS (Hair Education Beauty Summit) is a premier international beauty and fashion summit. HEBS Lagos 2026 is the third edition — previously hosted in New York/New Jersey — now expanding to Africa. It brings together hairstylists, barbers, makeup artists, nail technicians, fashion designers, and educators for world-class education, high-stakes competition, and global networking. The event features a $85,000+ cumulative prize pool.",
  },
  {
    triggers: ["date", "when", "october", "schedule", "how long", "days", "weekend", "timeline"],
    answer:
      "HEBS Lagos 2026 runs for 3 days: October 23, 24, and 25, 2026. The Global Crown Championship Finals take place on October 25. The Barber Game™ team battle is also scheduled for October 25.",
  },
  {
    triggers: ["venue", "where", "location", "address", "njs", "royale", "lekki", "richland", "lagos island", "place", "held", "center", "centre", "convention"],
    answer:
      "HEBS Lagos 2026 is held at NJS Royale Events Center, Richland Garden Estate, Lekki-Epe Expressway, Lagos, Nigeria.",
  },
  {
    triggers: ["how to register", "how do i register", "sign up", "registration", "register", "how register", "joining", "participate", "sign me up"],
    answer:
      "Visit hebseventportal.com/register to get started. You will be able to choose between buying an attendee ticket or registering as a competitor. Entry fees for competitors start at $50 USD per division.",
  },
  {
    triggers: ["ticket", "attendee", "pass", "buy ticket", "purchase ticket", "attend", "coming as audience", "watch", "spectate", "general admission"],
    answer:
      "Attendee ticket options (early bird pricing):\n\n• 1-Day Pass — $45 / ₦63,000\n• 2-Day Pass — $80 / ₦112,000\n• 3-Day All-Inclusive — $175 / ₦245,000 (Best Value)\n• VIP Experience — $400 / ₦560,000\n\nAll passes are issued via hebseventportal.com/register. Early bird rates are available for a limited time.",
  },
  {
    triggers: ["vip", "vip ticket", "vip pass", "vip experience", "premium", "front row", "lounge", "meet greet", "celebrity", "merchandise"],
    answer:
      "The VIP Experience pass is $400 early bird / $600 standard (₦560,000). It includes: full 3-day VIP clearance, front-row priority seating, exclusive VIP lounge access, Celebrity Meet & Greet, and an Official Merchandise Package. Purchase at hebseventportal.com/register.",
  },
  {
    triggers: ["price", "cost", "fee", "how much", "pricing", "rates", "entry fee", "ticket price", "money", "dollar", "naira", "usd", "ngn"],
    answer:
      "Ticket prices (early bird):\n• 1-Day Pass: $45 / ₦63,000\n• 2-Day Pass: $80 / ₦112,000\n• 3-Day All-Inclusive: $175 / ₦245,000\n• VIP Experience: $400 / ₦560,000\n\nCompetitor entry fees start at $50 USD per division (up to $100 for team categories). All payments via hebseventportal.com/register.",
  },
  {
    triggers: ["contestant", "compete", "competitor", "competition registration", "register as contestant", "enter competition", "enter contest", "compete in"],
    answer:
      "To register as a competitor, visit hebseventportal.com/register and select the contestant option. Choose your division, pay the entry fee ($50–$100 USD depending on category), and submit any required materials. Entry fees start at $50 per division.",
  },
  {
    triggers: ["global crown", "crowned icon", "beauty competition", "hairstylist competition", "makeup competition", "fashion competition", "nail competition", "editorial", "avant garde"],
    answer:
      "The Global Crown Championship has 3 stages:\n1. Pre-selection Video Submission — Submit a 3-min video to casting@hebslagos.com by August 20, 2026. Pay $50 entry fee at hebslagos.com.\n2. Public Instagram Voting (August 25–30, 2026) — Top 12 by likes/comments on @haireducationbeautysummit advance.\n3. Live Champion — October 25, 2026 on the main stage in Lagos, in person.\n\nOpen to: Hairstylists, Makeup Artists, Nail Artists, Fashion Designers, Fashion Stylists, Avant-Garde & Editorial Artists.",
  },
  {
    triggers: ["barber", "barbering", "barber championship", "barber competition", "fade", "clipper", "haircut competition", "fast flawless", "freestyle design", "barber game"],
    answer:
      "Barber Championship divisions:\n\n• Fast & Flawless Challenge™ — 15 min · $50 entry · $5,000 prize pool\n• Battle of the Fades™ — 30 min · $50 entry · $5,000 prize pool\n• Freestyle Design Battle™ — 60 min · $75 entry · $7,500 prize pool\n• Barber Game™ (Team of 4) — 2 hrs · $100/team · $10,000 prize pool (Oct 25)\n\nRegister at hebseventportal.com/register.",
  },
  {
    triggers: ["braiding", "braid", "braid championship", "traditional braiding", "cornrow", "fulani", "ghana braid", "loc", "retwist", "braid competition"],
    answer:
      "The Braiding Championships are scheduled for October 24, 2026 at NJS Royale Events Center, Richland Garden Estate, Lekki-Epe Expressway, Lagos. Categories include Fast & Flawless Braiding, Braids & Fades Showdown (team), Traditional Braiding Championship, and Freestyle Braid Art Championship.",
  },
  {
    triggers: ["prize", "prize pool", "winnings", "cash prize", "how much can i win", "reward", "total prize", "money prize", "85000", "$85", "prize money"],
    answer:
      "HEBS Lagos 2026 features a $85,000+ cumulative prize pool across all competition tracks. Individual division prizes range from $5,000 to $10,000. In the Barber Championships, 1st place winners earn $3,000–$5,000 USD per division. The Barber Game™ team winner takes $10,000 USD.",
  },
  {
    triggers: ["categories", "competition category", "divisions", "what competitions", "which competitions", "tracks", "events", "what can i compete in", "competition types"],
    answer:
      "HEBS Lagos 2026 competition tracks:\n\n🏆 Global Crown Championship — Oct 25 · Beauty, hair, makeup, fashion, nail artistry\n✂️ Barber Championships — Oct 24 · Fast & Flawless, Battle of the Fades, Freestyle Design, Barber Game (team)\n💇 Braiding Championships — Oct 24 · Fast & Flawless Braiding, Braids & Fades Showdown, Traditional Braiding, Freestyle Braid Art\n\nVisit /competitions for full details on each division, entry fees, and prize breakdowns.",
  },
  {
    triggers: ["payment", "pay", "how to pay", "payment method", "bank transfer", "card", "confirmation", "receipt", "qr code", "qr", "digital ticket", "email confirmation", "after payment"],
    answer:
      "All payments are processed through the official portal at hebseventportal.com/register. After completing payment, you will receive a confirmation email with your digital ticket or QR code. If you do not receive confirmation within 24 hours, contact info@thehebs.com or call +1 (484) 357-1812.",
  },
  {
    triggers: ["contact", "support", "help", "email", "phone", "reach", "whatsapp", "info", "question", "inquiry", "get in touch"],
    answer:
      "You can reach the HEBS team through:\n\n📧 Email: info@thehebs.com\n📞 Phone (US): +1 (484) 357-1812\n💬 WhatsApp: wa.me/14843571812\n\nOr use the contact form at /contact on this website.",
  },
  {
    triggers: ["masterclass", "workshop", "education", "learn", "class", "training", "session", "seminar"],
    answer:
      "HEBS Lagos 2026 features masterclasses and workshops for beauty, hair, and fashion professionals across all 3 days. The 3-Day All-Inclusive pass ($175 early bird) includes access to all masterclasses, workshops, competitions viewing, and the networking gala. Full session details will be announced closer to the event.",
  },
  {
    triggers: ["networking", "gala", "meet", "professionals", "industry", "connections", "exhibitor", "sponsor", "vendor"],
    answer:
      "HEBS Lagos 2026 includes dedicated networking events and a gala accessible with the 3-Day All-Inclusive or VIP passes. It's a hub for beauty industry professionals, educators, brands, sponsors, and vendors from across the globe.",
  },
];

const FALLBACK = "I don't have that specific information on hand. Please contact the HEBS team for confirmation — email info@thehebs.com or call +1 (484) 357-1812.";

function findBestAnswer(query: string): string {
  const q = query.toLowerCase().trim();
  if (!q) return FALLBACK;

  let best = { score: 0, answer: FALLBACK };

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const trigger of entry.triggers) {
      if (q.includes(trigger)) {
        // Full phrase match scores highest
        score += trigger.split(" ").length * 2;
      } else {
        // Partial word match
        const triggerWords = trigger.split(" ");
        for (const word of triggerWords) {
          if (word.length > 2 && q.includes(word)) score += 1;
        }
      }
    }
    if (score > best.score) {
      best = { score, answer: entry.answer };
    }
  }

  return best.score >= 2 ? best.answer : FALLBACK;
}

// ─── Quick options ─────────────────────────────────────────────────────────────

type LinkOption = { label: string; href: string; external: boolean; answer?: never };
type AnswerOption = { label: string; href?: never; external?: never; answer: string };
type QuickOption = LinkOption | AnswerOption;

const QUICK_OPTIONS: QuickOption[] = [
  { label: "How do I register?", href: "https://hebseventportal.com/register", external: true },
  { label: "Buy attendee ticket", href: "https://hebseventportal.com/register", external: true },
  { label: "Register as contestant", href: "https://hebseventportal.com/register", external: true },
  { label: "Competition categories", href: "/competitions", external: false },
  {
    label: "Event date and venue",
    answer: "HEBS Lagos 2026 runs October 23–25, 2026 at NJS Royale Events Center, Richland Garden Estate, Lekki-Epe Expressway, Lagos, Nigeria.",
  },
  { label: "Contact support", href: "/contact", external: false },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function HEBSAssistant() {
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const [activeAnswer, setActiveAnswer] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOption = (opt: QuickOption) => {
    if (opt.href) {
      if (opt.external) {
        window.open(opt.href, "_blank", "noopener noreferrer");
      } else {
        window.location.href = opt.href;
      }
    } else {
      setActiveAnswer(opt.answer ?? null);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const answer = findBestAnswer(query);
    setActiveAnswer(answer);
    setQuery("");
  };

  const handleBack = () => {
    setActiveAnswer(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const closePanel = () => {
    setOpen(false);
    setActiveAnswer(null);
    setQuery("");
  };

  return (
    <>
      {/* ── Assistant Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed bottom-[3.75rem] sm:bottom-[5.5rem] right-4 sm:right-6 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: "#0a0a0a",
              border: "1px solid rgba(212,175,55,0.18)",
              boxShadow: "0 8px 48px rgba(0,0,0,0.85), 0 0 0 1px rgba(212,175,55,0.05), 0 0 28px rgba(212,175,55,0.05)",
              maxHeight: "min(560px, calc(100vh - 8rem))",
            }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center gap-3 flex-shrink-0"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: "linear-gradient(135deg, rgba(212,175,55,0.07) 0%, rgba(160,80,220,0.05) 100%)",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #d4af37 0%, #b46cdc 100%)" }}
              >
                <SparkleIcon size={14} color="#fff" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold tracking-wide">HEBS Assistant</p>
                <p className="text-zinc-500 text-[11px]">Ready to help you</p>
              </div>
              <button
                onClick={closePanel}
                className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.06] flex-shrink-0"
                aria-label="Close assistant"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="px-5 py-4 overflow-y-auto flex-1">
              <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                Hi, I&apos;m the HEBS Assistant. Ask me anything about the event.
              </p>

              <AnimatePresence mode="wait">
                {activeAnswer ? (
                  /* ── Answer view ── */
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div
                      className="rounded-xl px-4 py-3 text-sm text-zinc-200 leading-relaxed mb-3 whitespace-pre-line"
                      style={{
                        background: "rgba(212,175,55,0.07)",
                        border: "1px solid rgba(212,175,55,0.15)",
                      }}
                    >
                      {activeAnswer}
                    </div>
                    <button
                      onClick={handleBack}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      ← Back to options
                    </button>
                  </motion.div>
                ) : (
                  /* ── Options + input view ── */
                  <motion.div
                    key="options"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    <div className="flex flex-col gap-2">
                      {QUICK_OPTIONS.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => handleOption(opt)}
                          className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-zinc-300 hover:text-white bg-white/[0.03] border border-white/[0.06] hover:bg-amber-500/10 hover:border-amber-500/20 transition-all duration-150 flex items-center justify-between group"
                        >
                          <span>{opt.label}</span>
                          <ChevronIcon />
                        </button>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                      <span className="text-zinc-600 text-[10px] uppercase tracking-widest">or ask</span>
                      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    </div>

                    {/* Text input */}
                    <form onSubmit={handleSearch} className="flex gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type your question…"
                        className="flex-1 min-w-0 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                        }}
                      />
                      <button
                        type="submit"
                        aria-label="Send question"
                        className="flex-shrink-0 px-3 rounded-xl transition-all duration-150 flex items-center justify-center"
                        style={{
                          background: "rgba(212,175,55,0.1)",
                          border: "1px solid rgba(212,175,55,0.2)",
                          color: "#d4af37",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(212,175,55,0.18)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(212,175,55,0.1)";
                        }}
                      >
                        <SendIcon />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="text-zinc-600 text-[10px] text-center tracking-widest uppercase">
                HEBS Lagos · Oct 23–25, 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Pill Button ── */}
      <motion.button
        onClick={() => {
          setOpen((o) => !o);
          setActiveAnswer(null);
          setQuery("");
        }}
        aria-label="Open HEBS Assistant"
        initial={mounted ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: mounted ? 1.5 : 0, duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center rounded-full select-none p-2.5 sm:gap-2.5 sm:pl-3.5 sm:pr-4 sm:py-3"
        style={{
          background: "#0d0d0d",
          border: "1px solid rgba(212,175,55,0.28)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.6), 0 0 16px rgba(212,175,55,0.08)",
        }}
      >
        <span className="flex-shrink-0" style={{ color: "#d4af37" }}>
          <SparkleIcon size={18} color="#d4af37" />
        </span>
        <span className="hidden sm:inline text-white text-sm font-semibold tracking-wide leading-none">
          Ask HEBS
        </span>
      </motion.button>
    </>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────────

function SparkleIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1.5L9.5 6.5L14.5 8L9.5 9.5L8 14.5L6.5 9.5L1.5 8L6.5 6.5L8 1.5Z" fill={color} />
      <circle cx="3" cy="3" r="0.8" fill={color} opacity="0.5" />
      <circle cx="13" cy="3.5" r="0.6" fill={color} opacity="0.4" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="text-zinc-600 group-hover:text-amber-400 transition-colors flex-shrink-0">
      <path d="M4 2.5L9 6.5L4 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2L11 11M11 2L2 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 7.5L2 2L4.5 7.5L2 13L13.5 7.5Z" fill="currentColor" />
    </svg>
  );
}

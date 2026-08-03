"use client";

import { useState, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";
import {
  COMPETITIONS,
  COMPETITION_COUNT,
  CATEGORY_COUNT,
  TOTAL_PRIZE_DISPLAY,
  ENTRY_FEE_DISPLAY,
  groupedByCategory,
  scheduleByDay,
  prizeDisplay,
  categoryName,
} from "@/lib/competitions";

// ─── Knowledge base ────────────────────────────────────────────────────────────

type KBEntry = { triggers: string[]; answer: string };

// Summaries are derived from lib/competitions.ts so the assistant can never quote a
// competition, fee, prize or time that disagrees with the rest of the site.
const CATEGORY_SUMMARY = groupedByCategory()
  .map((g) => `• ${g.category.name}: ${g.competitions.map((c) => c.name.replace(" Competition", "")).join(", ")}`)
  .join("\n");

const SCHEDULE_SUMMARY = scheduleByDay()
  .map(
    (d) =>
      `${d.date}\n` +
      d.rows
        .map((r) => `  • ${r.competition.name.replace(" Competition", "")} — ${r.session.time} (${r.session.duration})`)
        .join("\n"),
  )
  .join("\n\n");

const PRIZE_SUMMARY = COMPETITIONS.map(
  (c) => `• ${c.name.replace(" Competition", "")} — ${prizeDisplay(c)}`,
).join("\n");

/** One entry per competition, so a question about any single one is answered directly. */
const COMPETITION_ENTRIES: KBEntry[] = COMPETITIONS.map((c) => {
  const s = c.sessions.map((x) => `${x.shortDate}, ${x.time} (${x.duration})`).join(" and ");
  const base = c.name.toLowerCase().replace(" competition", "");
  return {
    triggers: [c.slug.replace(/-/g, " "), base, c.name.toLowerCase()],
    answer:
      `${c.name} — ${categoryName(c.category)}\n\n` +
      `When: ${s}\nEntry fee: ${c.feeDisplay}\nPrize: ${prizeDisplay(c)}\n\n` +
      `${c.description}\n\nRegister at hebseventportal.com/register.`,
  };
});

const KNOWLEDGE_BASE: KBEntry[] = [
  {
    triggers: ["what is hebs", "about hebs", "what hebs", "tell me about", "hair education", "beauty summit", "what is the event", "summit"],
    answer:
      `HEBS (Hair Education Beauty Summit) is a premier international beauty and fashion summit. HEBS launched in New Jersey, USA in 2024, returned with a sold-out 2025 edition that built its international reputation, and also hosted a sold-out United States edition from 2–4 May 2026. The summit is now coming home to Lagos for October 2026 — the fourth and biggest edition yet. It brings together hairstylists, barbers, braiders, frontal and lash artists, makeup artists, nail technicians, fashion designers, chefs, and vocalists for world-class education, high-stakes competition, and global networking. The event features ${COMPETITION_COUNT} competitions across ${CATEGORY_COUNT} categories and a ${TOTAL_PRIZE_DISPLAY} cumulative prize pool.`,
  },
  {
    triggers: ["fourth edition", "fourth", "edition", "editions", "previous editions", "how many editions", "lagos debut", "debut", "event history", "history", "sold out", "sold-out", "may 2026", "2024", "2025"],
    answer:
      "HEBS Lagos 2026 is the fourth edition of the Hair Education Beauty Summit and its Lagos debut.\n\n• 2024 — United States edition\n• 2025 — United States edition, sold out\n• 2–4 May 2026 — a separate sold-out United States edition\n• 23–25 October 2026 — HEBS Lagos, the fourth edition and first held in Nigeria",
  },
  {
    triggers: ["date", "when", "october", "schedule", "how long", "days", "weekend", "timeline"],
    answer:
      "HEBS Lagos 2026 is a 3-day event:\n\n• Oct 23 — Pre-Party · NJS Royale Beach Resort · 2:00 PM – 7:00 PM\n• Oct 24 — Exhibition, Education, Panel Discussions & Competitions · NJS Royale Events Center · 12:00 PM – 6:00 PM\n• Oct 25 — Exhibition, Education, Panel Discussions & Competitions · NJS Royale Events Center · 11:00 AM – 5:00 PM\n\nAsk me for the competition schedule to see the times for each competition.",
  },
  {
    triggers: ["venue", "where", "location", "address", "njs", "royale", "lekki", "richland", "lagos", "lagos island", "place", "held", "center", "centre", "convention", "beach resort"],
    answer:
      "HEBS Lagos 2026 uses two venues:\n\n• Pre-Party (Oct 23): NJS Royale Beach Resort, Lagos, Nigeria · 2:00 PM – 7:00 PM\n• Main Event (Oct 24–25): NJS Royale Events Center, Richland Garden Estate, Lekki-Epe Expressway, Lagos, Nigeria",
  },
  {
    triggers: ["how to register", "how do i register", "sign up", "registration", "register", "how register", "joining", "participate", "sign me up"],
    answer:
      `Visit hebseventportal.com/register to get started. You will be able to choose between buying an attendee ticket or registering as a competitor. The competitor entry fee is ${ENTRY_FEE_DISPLAY} per competition.`,
  },
  {
    triggers: ["ticket", "attendee", "pass", "buy ticket", "purchase ticket", "attend", "coming as audience", "watch", "spectate", "general admission"],
    answer:
      "General admission ticket options:\n\n• One Day Pass — ₦15,000\n• Two Days Pass — ₦25,000\n• Three Days Pass — ₦75,000 (includes Pre-Party & networking with industry leaders)\n• VIP Experience — $400 / ₦560,000\n\nAll passes are issued via hebseventportal.com/register.",
  },
  {
    triggers: ["vip", "vip ticket", "vip pass", "vip experience", "premium", "front row", "lounge", "meet greet", "celebrity", "merchandise"],
    answer:
      "The VIP Experience pass is $400 early bird / $600 standard (₦560,000). It includes: full 3-day VIP clearance, front-row priority seating, exclusive VIP lounge access, Celebrity Meet & Greet, and an Official Merchandise Package. Purchase at hebseventportal.com/register.",
  },
  {
    triggers: ["price", "cost", "fee", "how much", "pricing", "rates", "entry fee", "ticket price", "money", "dollar", "naira", "usd", "ngn"],
    answer:
      `General admission ticket prices:\n• One Day Pass: ₦15,000\n• Two Days Pass: ₦25,000\n• Three Days Pass: ₦75,000\n• VIP Experience: $400 / ₦560,000\n\nThe competitor entry fee is ${ENTRY_FEE_DISPLAY} per competition — the same for all ${COMPETITION_COUNT} competitions. All payments via hebseventportal.com/register.`,
  },
  {
    triggers: ["contestant", "compete", "competitor", "competition registration", "register as contestant", "enter competition", "enter contest", "compete in"],
    answer:
      `To register as a competitor, visit hebseventportal.com/register and select the contestant option. Choose your competition, pay the ${ENTRY_FEE_DISPLAY} entry fee, and submit any required materials. The fee is the same for every competition.`,
  },
  {
    triggers: ["categories", "competition category", "what competitions", "which competitions", "events", "what can i compete in", "competition types", "all competitions", "list competitions", "programme", "program"],
    answer:
      `HEBS Lagos 2026 has ${COMPETITION_COUNT} competitions across ${CATEGORY_COUNT} categories:

${CATEGORY_SUMMARY}

Ask me about any single competition for its date, entry fee and prize, or visit /competitions.`,
  },
  {
    triggers: ["competition schedule", "competition times", "what time", "times", "running order", "line up", "lineup", "day one", "day two", "saturday", "sunday"],
    answer: `Competition schedule:

${SCHEDULE_SUMMARY}

Taste of Culture runs on both days.`,
  },
  {
    triggers: ["prize", "prize pool", "winnings", "cash prize", "how much can i win", "reward", "total prize", "prize money", "prize breakdown"],
    answer:
      `HEBS Lagos 2026 features a ${TOTAL_PRIZE_DISPLAY} cumulative prize pool across ${COMPETITION_COUNT} competitions:

${PRIZE_SUMMARY}

Prize amounts are the maximum available in each competition.`,
  },
  {
    triggers: ["entry fee", "entry fees", "competition fee", "how much to enter", "cost to compete", "fee per competition"],
    answer:
      `Every HEBS Lagos 2026 competition has the same contestant entry fee: ${ENTRY_FEE_DISPLAY} per competition, across all ${COMPETITION_COUNT} competitions.

Entry fees are non-refundable and paid at hebseventportal.com/register.`,
  },
  {
    triggers: ["barber championship", "braiding championship", "signature competitions", "signature track", "barber games", "braids and fades", "braids & fades", "fast and flawless challenge", "old competitions", "what happened to"],
    answer:
      `The competition programme was reorganized for HEBS Lagos 2026. It now has ${COMPETITION_COUNT} competitions across ${CATEGORY_COUNT} categories rather than the previous Signature, Barber and Braiding tracks. See the current line-up at /competitions.`,
  },
  {
    triggers: ["payment", "pay", "how to pay", "payment method", "bank transfer", "card", "confirmation", "receipt", "qr code", "qr", "digital ticket", "email confirmation", "after payment"],
    answer:
      "All payments are processed through the official portal at hebseventportal.com/register. After completing payment, you will receive a confirmation email with your digital ticket or QR code. If you do not receive confirmation within 24 hours, contact info@thehebs.com or call +1 (610) 477-9635.",
  },
  {
    triggers: ["contact", "support", "help", "email", "phone", "reach", "whatsapp", "info", "question", "inquiry", "get in touch"],
    answer:
      "You can reach the HEBS team through:\n\n📧 Email: info@thehebs.com\n📞 US / WhatsApp: +1 (610) 477-9635\n📱 Nigeria / WhatsApp: 08148414917 / 08023051810\n⏰ Support: 2:00 PM – 11:00 PM WAT\n\nOr use the contact form at /contact on this website.",
  },
  {
    triggers: ["masterclass", "workshop", "education", "learn", "class", "training", "session", "seminar"],
    answer:
      "HEBS Lagos 2026 features masterclasses and workshops for beauty, hair, and fashion professionals across all 3 days. The Three Days Pass (₦75,000) includes full 3-day access, Pre-Party, education sessions, and networking with industry leaders. Full session details will be announced closer to the event.",
  },
  {
    triggers: ["networking", "gala", "meet", "professionals", "industry", "connections", "exhibitor", "sponsor", "vendor"],
    answer:
      "HEBS Lagos 2026 includes dedicated networking events and a gala accessible with the Three Days Pass or VIP Experience. It's a hub for beauty industry professionals, educators, brands, sponsors, and vendors from across the globe.",
  },
  ...COMPETITION_ENTRIES,
];

const FALLBACK = "I don't have that specific information on hand. Please contact the HEBS team for confirmation — email info@thehebs.com or call +1 (610) 477-9635.";

/**
 * Words that carry no topical signal on their own. They are excluded from
 * partial-token scoring only: a trigger that *is* one of these (for example the
 * standalone "when" date trigger) still matches as a full phrase.
 *
 * Without this, multi-word triggers such as "battle of the fades" earned a point
 * for "the" against any question containing "the", which let unrelated
 * competitions outrank genuine date, venue and history answers.
 */
const STOP_WORDS = new Set([
  "the", "and", "for", "are", "you", "all", "can", "how", "what", "does",
  "with", "from", "this", "that", "when", "where", "who", "why", "event",
  "was", "its", "has", "our", "out", "any", "get", "got", "will", "have",
]);

function normalize(value: string): string {
  // Punctuation is folded to spaces on both sides of the comparison, so "fades?"
  // and "fades" match. Kept ASCII-only so no downlevel regex flags are needed.
  return value
    .toLowerCase()
    .replace(/[^a-z0-9&\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findBestAnswer(query: string): string {
  const q = normalize(query);
  if (!q) return FALLBACK;

  let best = { score: 0, answer: FALLBACK };

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const raw of entry.triggers) {
      const trigger = normalize(raw);
      if (!trigger) continue;

      if (q === trigger) {
        // 1. Exact normalized match - strongest possible signal
        score += trigger.split(" ").length * 4 + 4;
      } else if (q.includes(trigger)) {
        // 2. Full trigger phrase contained in the query
        score += trigger.split(" ").length * 2;
      } else {
        // 3. Meaningful token overlap only - stop words never score
        for (const word of trigger.split(" ")) {
          if (word.length > 2 && !STOP_WORDS.has(word) && q.includes(word)) score += 1;
        }
      }
    }
    if (score > best.score) {
      best = { score, answer: entry.answer };
    }
  }

  // 4. Default response when nothing matched confidently
  return best.score >= 2 ? best.answer : FALLBACK;
}

// ─── Quick options ─────────────────────────────────────────────────────────────

type LinkOption = { label: string; href: string; external: boolean; answer?: never };
type AnswerOption = { label: string; href?: never; external?: never; answer: string };
type QuickOption = LinkOption | AnswerOption;

const QUICK_OPTIONS: QuickOption[] = [
  { label: "How do I register?", href: "https://hebseventportal.com/register", external: true },
  { label: "Buy attendee ticket", href: "https://hebseventportal.com", external: true },
  { label: "Register as contestant", href: "https://hebseventportal.com/register", external: true },
  { label: "Competition categories", href: "/competitions", external: false },
  {
    label: "Event date and venue",
    answer: "HEBS Lagos 2026 runs October 23–25, 2026 at NJS Royale Events Center, Richland Garden Estate, Lekki Epe Express, Lagos, Nigeria.",
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

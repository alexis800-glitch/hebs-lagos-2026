"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

const navLinks = [
  { label: "Home",        href: "#home" },
  { label: "About",       href: "#about" },
  { label: "Competition", href: "#competition" },
  { label: "Tickets",     href: "#tickets" },
  { label: "Gallery",     href: "#gallery" },
  { label: "Contact",     href: "#contact" },
];

const EASE = [0.25, 0.4, 0.25, 1] as const;

const linkClass =
  "flex items-center gap-1 text-[13px] font-medium text-zinc-400 hover:text-white transition-colors duration-200 h-full cursor-pointer py-4";

export default function Navbar() {
  const mounted = useMounted();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCompetitionOpen, setIsCompetitionOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Full-width fixed bar */}
      <div className="w-full fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-neutral-900/50">
        <motion.nav
          initial={mounted ? { y: -64, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14"
        >
          {/* Logo */}
          <a
            href="#home"
            className="font-sans font-semibold text-sm text-white tracking-wide shrink-0"
          >
            HEBS{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #9b59b6, #e91e8c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              2026
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center justify-center gap-8 h-full">
            {navLinks.map((link) =>
              link.label === "Competition" ? (
                <li key={link.label} className="relative flex items-center h-full">
                  <div
                    className="relative flex items-center h-full cursor-pointer"
                    onMouseEnter={() => setIsCompetitionOpen(true)}
                    onMouseLeave={() => setIsCompetitionOpen(false)}
                  >
                    {/* Trigger label — same class as all other links */}
                    <a href={link.href} className={linkClass}>
                      Competition
                      <ChevronDown
                        className={`h-3 w-3 text-zinc-400 shrink-0 transition-transform duration-300 ${
                          isCompetitionOpen
                            ? "rotate-180 -translate-y-[1px] text-white"
                            : "rotate-0 translate-y-0"
                        }`}
                      />
                    </a>

                    {/* Stripe-style mega menu */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[520px] z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top ${
                        isCompetitionOpen
                          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 scale-[0.98] -translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
                        {/* 2-column card grid */}
                        <div className="grid grid-cols-2 gap-px bg-zinc-800">
                          {/* Col 1 — Crowned Icons */}
                          <a
                            href="/competition/crowned-icons"
                            onClick={() => setIsCompetitionOpen(false)}
                            className="bg-zinc-900 hover:bg-zinc-800/80 p-5 flex flex-col gap-2 transition-colors group/item"
                          >
                            <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 font-medium">
                              Track 01
                            </span>
                            <span className="font-serif text-[15px] font-light text-white group-hover/item:text-amber-400 transition-colors leading-snug">
                              Crowned Icons Showdown
                            </span>
                            <span className="font-sans text-xs text-zinc-400 font-light leading-relaxed">
                              Global Team Runway Championship. 5-discipline teams compete live on stage for $35,000 in prizes.
                            </span>
                          </a>

                          {/* Col 2 — Barber Battles */}
                          <a
                            href="/competition/barber-battles"
                            onClick={() => setIsCompetitionOpen(false)}
                            className="bg-zinc-900 hover:bg-zinc-800/80 p-5 flex flex-col gap-2 transition-colors group/item"
                          >
                            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-medium">
                              Track 02
                            </span>
                            <span className="font-serif text-[15px] font-light text-white group-hover/item:text-amber-400 transition-colors leading-snug">
                              Barber &amp; Stylist Battles
                            </span>
                            <span className="font-sans text-xs text-zinc-400 font-light leading-relaxed">
                              6 hyper-focused individual showdowns testing precision speed, complex partitioning, and elite craftsmanship.
                            </span>
                          </a>
                        </div>

                        {/* Footer strip */}
                        <div className="px-5 py-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                            HEBS Lagos · Oct 23–25, 2026
                          </span>
                          <a
                            href="https://hebseventportal.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-sans text-[10px] uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
                          >
                            Register to Compete ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={link.label} className="flex items-center h-full">
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              )
            )}
          </ul>

          {/* Desktop CTA */}
          <a
            href="https://hebseventportal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-block font-sans text-xs px-4 py-2 bg-white text-black hover:bg-neutral-200 font-medium tracking-wide rounded-full transition-all duration-200 shrink-0"
          >
            Get Tickets
          </a>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 text-white"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </motion.nav>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="fixed top-14 inset-x-4 z-40 md:hidden max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/5"
            style={{
              background: "rgba(5,5,5,0.96)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            <ul className="flex flex-col py-3 px-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="block px-4 py-3 font-sans text-xs tracking-wide text-neutral-400 hover:text-white transition-colors rounded-xl"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-2 px-2 pb-2">
                <a
                  href="https://hebseventportal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="block w-full text-center font-sans text-xs px-4 py-2.5 bg-white text-black hover:bg-neutral-200 font-medium tracking-wide rounded-full transition-all duration-200"
                >
                  Get Tickets
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

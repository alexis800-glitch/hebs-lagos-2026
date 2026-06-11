"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
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
  const [isMobileCompOpen, setIsMobileCompOpen] = useState(false);

  const closeMenu = () => { setMenuOpen(false); setIsMobileCompOpen(false); };

  return (
    <>
      {/* Fixed nav bar — sits above the mobile overlay */}
      <div className="w-full fixed top-0 left-0 right-0 z-[60] bg-[#050505]/80 backdrop-blur-md border-b border-neutral-900/50">
        <motion.nav
          initial={mounted ? { y: -64, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-50 max-w-6xl mx-auto px-6 flex items-center justify-between h-14 w-full"
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={closeMenu}
            className="font-sans font-semibold text-sm text-white tracking-wide shrink-0 relative z-10"
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
          <ul className="hidden md:flex items-center justify-center gap-8 h-full relative z-50">
            {navLinks.map((link) =>
              link.label === "Competition" ? (
                <li key={link.label} className="relative flex items-center h-full">
                  <div
                    className="relative flex items-center h-full cursor-pointer"
                    onMouseEnter={() => setIsCompetitionOpen(true)}
                    onMouseLeave={() => setIsCompetitionOpen(false)}
                  >
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
                        <div className="grid grid-cols-2 gap-px bg-zinc-800">
                          <a
                            href="/competition/crowned-icons"
                            onClick={() => setIsCompetitionOpen(false)}
                            className="bg-zinc-900 hover:bg-zinc-800/80 p-5 flex flex-col gap-2 transition-colors group/item"
                          >
                            <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 font-medium">Track 01</span>
                            <span className="font-serif text-[15px] font-light text-white group-hover/item:text-amber-400 transition-colors leading-snug">Crowned Icons Showdown</span>
                            <span className="font-sans text-xs text-zinc-400 font-light leading-relaxed">Global Team Runway Championship. 5-discipline teams compete live on stage for $35,000 in prizes.</span>
                          </a>
                          <a
                            href="/competition/barber-battles"
                            onClick={() => setIsCompetitionOpen(false)}
                            className="bg-zinc-900 hover:bg-zinc-800/80 p-5 flex flex-col gap-2 transition-colors group/item"
                          >
                            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-medium">Track 02</span>
                            <span className="font-serif text-[15px] font-light text-white group-hover/item:text-amber-400 transition-colors leading-snug">Barber &amp; Stylist Battles</span>
                            <span className="font-sans text-xs text-zinc-400 font-light leading-relaxed">6 hyper-focused individual showdowns testing precision speed, complex partitioning, and elite craftsmanship.</span>
                          </a>
                        </div>
                        <div className="px-5 py-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">HEBS Lagos · Oct 23–25, 2026</span>
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

          {/* Hamburger — morphs into X on open */}
          <button
            className="md:hidden relative z-10 flex items-center justify-center w-8 h-8"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-[14px]">
              <span
                className={`absolute left-0 block w-full bg-white origin-center transition-all duration-300 ease-out ${
                  menuOpen
                    ? "top-[6px] rotate-45 h-[1.5px]"
                    : "top-0 rotate-0 h-[1.5px]"
                }`}
              />
              <span
                className={`absolute left-0 top-[6px] block w-full h-[1.5px] bg-white origin-center transition-all duration-200 ${
                  menuOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                }`}
              />
              <span
                className={`absolute left-0 block w-full bg-white origin-center transition-all duration-300 ease-out ${
                  menuOpen
                    ? "top-[6px] -rotate-45 h-[1.5px]"
                    : "top-[13px] rotate-0 h-[1.5px]"
                }`}
              />
            </div>
          </button>
        </motion.nav>
      </div>

      {/* Full-screen mobile overlay — slides in from right */}
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between p-8 transition-transform duration-500 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top spacer for nav bar height */}
        <div className="h-14 shrink-0" />

        {/* Cascading nav links */}
        <nav className="flex flex-col gap-2 flex-1 justify-center">
          {navLinks.map((link, i) =>
            link.label === "Competition" ? (
              <div
                key={link.label}
                style={{ transitionDelay: menuOpen ? `${i * 55 + 80}ms` : "0ms" }}
                className={`border-b border-zinc-900 transition-all duration-500 ${
                  menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                {/* Accordion trigger */}
                <button
                  onClick={() => setIsMobileCompOpen((o) => !o)}
                  className="w-full flex items-center justify-between text-4xl font-semibold tracking-tight text-white py-2 hover:text-zinc-400 transition-colors"
                >
                  Competition
                  <ChevronDown
                    className={`h-5 w-5 text-zinc-500 shrink-0 transition-transform duration-300 ${
                      isMobileCompOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {/* Accordion body */}
                <AnimatePresence initial={false}>
                  {isMobileCompOpen && (
                    <motion.div
                      key="mobile-comp"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 flex flex-col gap-1">
                        <a
                          href="/competition/crowned-icons"
                          onClick={closeMenu}
                          className="block text-zinc-400 hover:text-white text-lg pl-4 py-2 transition-colors"
                        >
                          Crowned Icons Showdown
                        </a>
                        <a
                          href="/competition/barber-battles"
                          onClick={closeMenu}
                          className="block text-zinc-400 hover:text-white text-lg pl-4 py-2 transition-colors"
                        >
                          Barbering Battles
                        </a>
                        <a
                          href="/competition/barber-battles"
                          onClick={closeMenu}
                          className="block text-zinc-400 hover:text-white text-lg pl-4 py-2 transition-colors"
                        >
                          Styling Battles
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                style={{
                  transitionDelay: menuOpen ? `${i * 55 + 80}ms` : "0ms",
                }}
                className={`block text-4xl font-semibold tracking-tight text-white py-2 hover:text-zinc-400 transition-all duration-500 border-b border-zinc-900 ${
                  menuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* Bottom — CTA + event info */}
        <div
          style={{ transitionDelay: menuOpen ? "500ms" : "0ms" }}
          className={`flex flex-col gap-4 transition-all duration-500 ${
            menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <a
            href="https://hebseventportal.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="block w-full text-center font-sans text-sm font-medium py-4 bg-white text-black hover:bg-zinc-200 rounded-full transition-all duration-200 tracking-wide"
          >
            Get Tickets ↗
          </a>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 text-center">
            Lagos, Nigeria · October 23–25, 2026
          </p>
        </div>
      </div>
    </>
  );
}

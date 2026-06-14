"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useMounted } from "@/hooks/useMounted";

const navLinks = [
  { label: "Home",         href: "/" },
  { label: "About",        href: "/about" },
  { label: "Competition",  href: "/competitions" },
  { label: "Partnerships", href: "#sponsors" },
  { label: "Tickets",      href: "/tickets" },
  { label: "Gallery",      href: "/gallery" },
  { label: "Contact",      href: "/contact" },
];

const EASE = [0.25, 0.4, 0.25, 1] as const;

const linkClass =
  "flex items-center text-[15px] font-medium text-zinc-400 hover:text-white transition-colors duration-200 py-4 h-full pointer-events-auto";

export default function Navbar() {
  const mounted = useMounted();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCompetitionOpen, setIsCompetitionOpen] = useState(false);
  const [isPartnershipsOpen, setIsPartnershipsOpen] = useState(false);
  const [isMobileCompOpen, setIsMobileCompOpen] = useState(false);
  const [isMobilePartnershipsOpen, setIsMobilePartnershipsOpen] = useState(false);

  const closeMenu = () => { setMenuOpen(false); setIsMobileCompOpen(false); setIsMobilePartnershipsOpen(false); };

  return (
    <>
      {/* Fixed nav bar — sits above the mobile overlay */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full bg-black/60 backdrop-blur-md border-b border-white/[0.06]">
        <motion.nav
          initial={mounted ? { y: -80, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-[100] w-full max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between"
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="relative z-10 flex items-center"
          >
            <Image
              src="/assets/logos/hebs_logo_nav.png"
              alt="HEBS Lagos 2026 Logo"
              width={634}
              height={529}
              className="h-10 md:h-12 w-auto object-contain flex-shrink-0 block"
              priority
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center justify-center gap-8 h-full relative z-[101] pointer-events-auto">
            {navLinks.map((link) =>
              link.label === "Competition" ? (
                <li key={link.label} className="relative flex items-center h-full">
                  <div
                    className="relative flex items-center h-full cursor-pointer"
                    onMouseEnter={() => setIsCompetitionOpen(true)}
                    onMouseLeave={() => setIsCompetitionOpen(false)}
                  >
                    <Link href="/competitions" className={linkClass}>
                      Competition
                      <ChevronDown
                        className={`h-3 w-3 text-zinc-400 shrink-0 transition-transform duration-300 ${
                          isCompetitionOpen
                            ? "rotate-180 -translate-y-[1px] text-white"
                            : "rotate-0 translate-y-0"
                        }`}
                      />
                    </Link>

                    {/* Stripe-style mega menu */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[520px] z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top ${
                        isCompetitionOpen
                          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 scale-[0.98] -translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden w-[480px]">
                        <div className="flex flex-col divide-y divide-zinc-800/60">
                          <Link
                            href="/competitions?tab=global-crown"
                            onClick={() => setIsCompetitionOpen(false)}
                            className="bg-zinc-900 hover:bg-zinc-800/60 px-5 py-4 flex flex-col gap-1.5 transition-colors group/item"
                          >
                            <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 font-medium">Track 01 · Oct 25, 2026</span>
                            <span className="font-serif text-[15px] font-light text-white group-hover/item:text-amber-400 transition-colors leading-snug">Global Crown Championship 2026</span>
                            <span className="font-sans text-xs text-zinc-400 font-light leading-relaxed">Flagship solo creative global event with a $35,000 prize pool.</span>
                          </Link>
                          <Link
                            href="/competitions?tab=barber"
                            onClick={() => setIsCompetitionOpen(false)}
                            className="bg-zinc-900 hover:bg-zinc-800/60 px-5 py-4 flex flex-col gap-1.5 transition-colors group/item"
                          >
                            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-medium">Track 02 · Oct 24, 2026</span>
                            <span className="font-serif text-[15px] font-light text-white group-hover/item:text-amber-400 transition-colors leading-snug">Barber Championships 2026</span>
                            <span className="font-sans text-xs text-zinc-400 font-light leading-relaxed">4 high-stakes speed, fade, and design divisions powered by Men&apos;t Pro Tools™.</span>
                          </Link>
                          <Link
                            href="/competitions?tab=braiding"
                            onClick={() => setIsCompetitionOpen(false)}
                            className="bg-zinc-900 hover:bg-zinc-800/60 px-5 py-4 flex flex-col gap-1.5 transition-colors group/item"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-medium">Track 03</span>
                              <span className="text-[9px] font-mono text-amber-500/80 bg-amber-500/[0.06] border border-amber-500/20 rounded-full px-2 py-0.5 leading-none">May 2027</span>
                            </div>
                            <span className="font-serif text-[15px] font-light text-white group-hover/item:text-amber-400 transition-colors leading-snug">Braiding Championships 2027</span>
                            <span className="font-sans text-xs text-zinc-400 font-light leading-relaxed">Solo and collaborative braiding tracks powered by PureO Natural Products™.</span>
                          </Link>
                        </div>
                        <div className="px-5 py-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-center gap-6">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">HEBS Lagos · Oct 23–25, 2026</span>
                          <a
                            href="https://hebseventportal.com/register/contestant"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-sans text-[10px] uppercase tracking-wider text-zinc-200 hover:text-white transition-colors"
                          >
                            Register to Compete ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ) : link.label === "Partnerships" ? (
                <li key={link.label} className="relative flex items-center h-full">
                  <div
                    className="relative flex items-center h-full cursor-pointer"
                    onMouseEnter={() => setIsPartnershipsOpen(true)}
                    onMouseLeave={() => setIsPartnershipsOpen(false)}
                  >
                    <div className="flex items-center gap-1 hover:text-white transition-colors duration-200 py-4 text-[15px] font-medium text-zinc-400 pointer-events-auto">
                      <span className="leading-none">Partnerships</span>
                      <ChevronDown
                        className={`h-3 w-3 text-zinc-400 shrink-0 transition-transform duration-300 ease-out ${
                          isPartnershipsOpen
                            ? "rotate-180 -translate-y-[1px] text-white"
                            : "rotate-0 translate-y-0"
                        }`}
                      />
                    </div>

                    {/* Partnerships dropdown */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[460px] z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top ${
                        isPartnershipsOpen
                          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 scale-[0.98] -translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 grid grid-cols-2 gap-6">
                        {/* Col 1 — Sponsor */}
                        <Link
                          href="/sponsors"
                          onClick={() => setIsPartnershipsOpen(false)}
                          className="group block p-2 rounded-lg hover:bg-zinc-800/50 transition-all"
                        >
                          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">01 / Sponsor</span>
                          <h4 className="text-white text-sm font-medium group-hover:text-amber-400 transition-colors">Sponsor Opportunities</h4>
                          <p className="text-zinc-400 text-xs mt-1 leading-relaxed">Align your brand with the premier beauty summit in Africa.</p>
                        </Link>

                        {/* Col 2 — Vendor */}
                        <Link
                          href="/vendors"
                          onClick={() => setIsPartnershipsOpen(false)}
                          className="group block p-2 rounded-lg hover:bg-zinc-800/50 transition-all"
                        >
                          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">02 / Vendor</span>
                          <h4 className="text-white text-sm font-medium group-hover:text-amber-400 transition-colors">Vendor Opportunities</h4>
                          <p className="text-zinc-400 text-xs mt-1 leading-relaxed">Showcase your products &amp; booths to thousands of global buyers.</p>
                        </Link>
                      </div>

                      {/* Footer strip */}
                      <div className="px-5 py-3 bg-zinc-950 border border-t-0 border-zinc-800 rounded-b-xl flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">HEBS Lagos · Oct 23–25, 2026</span>
                        <a
                          href="mailto:info@thehebs.com"
                          className="font-sans text-[10px] uppercase tracking-wider text-zinc-200 hover:text-white transition-colors"
                        >
                          Inquire Now ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={link.label} className="flex items-center h-full">
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Desktop CTA */}
          <a
            href="https://hebseventportal.com/register/contestant"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-block font-sans text-xs px-4 py-2 bg-white text-black hover:bg-neutral-200 font-medium tracking-wide rounded-full transition-all duration-200 shrink-0"
          >
            Register Now
          </a>

          {/* Mobile inline CTA — visible only on mobile, hidden on md+ */}
          <a
            href="https://hebseventportal.com/register/contestant"
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden font-sans text-xs px-3.5 py-2 bg-white text-black font-medium tracking-wide rounded-full shrink-0 touch-manipulation select-none"
          >
            Register
          </a>

          {/* Hamburger — morphs into X on open */}
          <button
            className="md:hidden relative z-10 flex items-center justify-center w-11 h-11 touch-manipulation select-none"
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
        className={`fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between py-8 px-6 overflow-y-auto transition-transform duration-500 ease-out md:hidden ${
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
                <div className="w-full flex items-center justify-between py-1.5">
                  <Link
                    href="/competitions"
                    onClick={closeMenu}
                    className="text-xl font-medium tracking-tight text-white hover:text-zinc-400 transition-colors duration-200"
                  >
                    Competition
                  </Link>
                  <button
                    onClick={() => setIsMobileCompOpen((o) => !o)}
                    className="p-1 touch-manipulation select-none"
                    aria-label="Toggle competition sub-menu"
                  >
                    <ChevronDown
                      className={`h-5 w-5 text-zinc-500 shrink-0 transition-transform duration-300 ${
                        isMobileCompOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                </div>

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
                      <div className="pb-4 flex flex-col gap-0.5">
                        <Link
                          href="/competitions?tab=global-crown"
                          onClick={closeMenu}
                          className="flex items-center gap-2 text-zinc-300 hover:text-white text-base pl-4 py-2 transition-colors font-sans"
                        >
                          Global Crown Championship 2026
                        </Link>
                        <Link
                          href="/competitions?tab=barber"
                          onClick={closeMenu}
                          className="flex items-center gap-2 text-zinc-300 hover:text-white text-base pl-4 py-2 transition-colors font-sans"
                        >
                          Barber Championships 2026
                        </Link>
                        <Link
                          href="/competitions?tab=braiding"
                          onClick={closeMenu}
                          className="flex items-center gap-2 text-zinc-300 hover:text-white text-base pl-4 py-2 transition-colors font-sans"
                        >
                          Braiding Championships
                          <span className="text-[9px] font-mono text-amber-500/80 bg-amber-500/[0.06] border border-amber-500/20 rounded-full px-2 py-0.5 leading-none">May 2027</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : link.label === "Partnerships" ? (
              <div
                key={link.label}
                style={{ transitionDelay: menuOpen ? `${i * 55 + 80}ms` : "0ms" }}
                className={`border-b border-zinc-900 transition-all duration-500 ${
                  menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                <div className="w-full flex flex-col">
                  <button
                    onClick={() => setIsMobilePartnershipsOpen(!isMobilePartnershipsOpen)}
                    className="w-full flex items-center justify-between text-xl font-medium text-white py-1.5 hover:text-zinc-400 transition-colors duration-200"
                  >
                    <span>Partnerships</span>
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${
                        isMobilePartnershipsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isMobilePartnershipsOpen && (
                    <div className="pl-4 flex flex-col gap-1 mt-2 mb-3 border-l border-zinc-800">
                      <Link
                        href="/sponsors"
                        onClick={closeMenu}
                        className="block text-zinc-300 hover:text-white text-base pl-4 py-2 transition-colors font-sans"
                      >
                        Sponsor Opportunities
                      </Link>
                      <Link
                        href="/vendors"
                        onClick={closeMenu}
                        className="block text-zinc-300 hover:text-white text-base pl-4 py-2 transition-colors font-sans"
                      >
                        Vendor Opportunities
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                style={{
                  transitionDelay: menuOpen ? `${i * 55 + 80}ms` : "0ms",
                }}
                className={`block text-xl font-medium tracking-tight text-white py-1.5 hover:text-zinc-400 transition-all duration-500 border-b border-zinc-900 ${
                  menuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                {link.label}
              </Link>
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
            href="https://hebseventportal.com/register/contestant"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="block w-full text-center font-sans text-sm font-medium py-4 bg-white text-black hover:bg-zinc-200 rounded-full transition-all duration-200 tracking-wide touch-manipulation select-none"
          >
            Register Now ↗
          </a>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 text-center">
            Lagos, Nigeria · October 23–25, 2026
          </p>
        </div>
      </div>
    </>
  );
}

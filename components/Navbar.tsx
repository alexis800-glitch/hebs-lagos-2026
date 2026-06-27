"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useMounted } from "@/hooks/useMounted";
import NeonButton from "@/components/ui/neon-button";

const navLinks = [
  { label: "Home",         href: "/" },
  { label: "About",        href: "/about" },
  { label: "Competition",  href: "/competitions" },
  { label: "Partnerships", href: "/sponsors" },
  { label: "Tickets",      href: "/tickets" },
  { label: "Gallery",      href: "/gallery" },
  { label: "HEBS Legacy",  href: "/hebs-legacy/2025" },
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
  const [isLegacyOpen, setIsLegacyOpen] = useState(false);
  const [isMobileCompOpen, setIsMobileCompOpen] = useState(false);
  const [isMobilePartnershipsOpen, setIsMobilePartnershipsOpen] = useState(false);
  const [isMobileLegacyOpen, setIsMobileLegacyOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
    setIsMobileCompOpen(false);
    setIsMobilePartnershipsOpen(false);
    setIsMobileLegacyOpen(false);
  };

  return (
    <>
      {/* Fixed nav bar */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full bg-black/60 backdrop-blur-md border-b border-white/[0.06]">
        <motion.nav
          initial={mounted ? { y: -80, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-[100] w-full max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between"
        >
          {/* Logo */}
          <Link href="/" onClick={closeMenu} className="relative z-10 flex items-center">
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
          <ul className="hidden lg:flex items-center justify-center gap-6 h-full relative z-[101] pointer-events-auto">
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
                          isCompetitionOpen ? "rotate-180 -translate-y-[1px] text-white" : "rotate-0 translate-y-0"
                        }`}
                      />
                    </Link>

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
                            href="/competitions?track=global-crown"
                            onClick={() => setIsCompetitionOpen(false)}
                            className="bg-zinc-900 hover:bg-zinc-800/60 px-5 py-4 flex flex-col gap-1.5 transition-colors group/item"
                          >
                            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500 font-medium">Track 01 · Oct 25, 2026</span>
                            <span className="font-serif text-[15px] font-light text-white group-hover/item:text-amber-400 transition-colors leading-snug">Global Crown Championship 2026</span>
                            <span className="font-sans text-xs text-zinc-300 font-light leading-relaxed">Flagship solo creative global event with a $85,000 USD (₦119M) prize pool.</span>
                          </Link>
                          <Link
                            href="/competitions?track=barber"
                            onClick={() => setIsCompetitionOpen(false)}
                            className="bg-zinc-900 hover:bg-zinc-800/60 px-5 py-4 flex flex-col gap-1.5 transition-colors group/item"
                          >
                            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 font-medium">Track 02 · Oct 24, 2026</span>
                            <span className="font-serif text-[15px] font-light text-white group-hover/item:text-amber-400 transition-colors leading-snug">Barber Championships 2026</span>
                            <span className="font-sans text-xs text-zinc-300 font-light leading-relaxed">4 high-stakes speed, fade, and design divisions powered by Men&rsquo;t Pro Tools™.</span>
                          </Link>
                          <Link
                            href="/competitions?track=braiding"
                            onClick={() => setIsCompetitionOpen(false)}
                            className="bg-zinc-900 hover:bg-zinc-800/60 px-5 py-4 flex flex-col gap-1.5 transition-colors group/item"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 font-medium">Track 03 · Oct 24, 2026</span>
                            </div>
                            <span className="font-serif text-[15px] font-light text-white group-hover/item:text-amber-400 transition-colors leading-snug">Braiding Championships 2026</span>
                            <span className="font-sans text-xs text-zinc-300 font-light leading-relaxed">Solo and collaborative braiding tracks powered by PureO Natural Products™.</span>
                          </Link>
                        </div>
                        <div className="px-5 py-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-center gap-6">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">HEBS Lagos · Oct 23–25, 2026</span>
                          <a
                            href="https://hebseventportal.com/register"
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
                          isPartnershipsOpen ? "rotate-180 -translate-y-[1px] text-white" : "rotate-0 translate-y-0"
                        }`}
                      />
                    </div>

                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[460px] z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top ${
                        isPartnershipsOpen
                          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 scale-[0.98] -translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 grid grid-cols-2 gap-6">
                        <Link
                          href="/sponsors"
                          onClick={() => setIsPartnershipsOpen(false)}
                          className="group block p-2 rounded-lg hover:bg-zinc-800/50 transition-all"
                        >
                          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">01 / Sponsor</span>
                          <h4 className="text-white text-sm font-medium group-hover:text-amber-400 transition-colors">Sponsor Opportunities</h4>
                          <p className="text-zinc-400 text-xs mt-1 leading-relaxed">Align your brand with the premier beauty summit in Africa.</p>
                        </Link>
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

              ) : link.label === "HEBS Legacy" ? (
                <li key={link.label} className="relative flex items-center h-full">
                  <div
                    className="relative flex items-center h-full cursor-pointer"
                    onMouseEnter={() => setIsLegacyOpen(true)}
                    onMouseLeave={() => setIsLegacyOpen(false)}
                  >
                    <div className="flex items-center gap-1 hover:text-white transition-colors duration-200 py-4 text-[15px] font-medium text-zinc-400 pointer-events-auto">
                      <span className="leading-none">HEBS Legacy</span>
                      <ChevronDown
                        className={`h-3 w-3 text-zinc-400 shrink-0 transition-transform duration-300 ease-out ${
                          isLegacyOpen ? "rotate-180 -translate-y-[1px] text-white" : "rotate-0 translate-y-0"
                        }`}
                      />
                    </div>

                    <div
                      className={`absolute top-full right-0 pt-3 w-[320px] z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top ${
                        isLegacyOpen
                          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 scale-[0.98] -translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
                        <div className="px-5 py-2.5 border-b border-zinc-800/60">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500/70">Archive · Past Editions</span>
                        </div>
                        <div className="flex flex-col divide-y divide-zinc-800/60">
                          <Link
                            href="/hebs-legacy/2025"
                            onClick={() => setIsLegacyOpen(false)}
                            className="bg-zinc-900 hover:bg-zinc-800/60 px-5 py-3.5 flex flex-col gap-1 transition-colors group/item"
                          >
                            <span className="font-serif text-[14px] font-light text-white group-hover/item:text-amber-400 transition-colors">HEBS Lagos 2025</span>
                            <span className="font-sans text-xs text-zinc-500">Champions, highlights &amp; gallery</span>
                          </Link>
                          <Link
                            href="/hebs-legacy/media-gallery"
                            onClick={() => setIsLegacyOpen(false)}
                            className="bg-zinc-900 hover:bg-zinc-800/60 px-5 py-3.5 flex flex-col gap-1 transition-colors group/item"
                          >
                            <span className="font-serif text-[14px] font-light text-white group-hover/item:text-amber-400 transition-colors">Media Gallery</span>
                            <span className="font-sans text-xs text-zinc-500">All photos &amp; videos by year</span>
                          </Link>
                        </div>
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
          <NeonButton
            href="https://hebseventportal.com/register"
            className="hidden lg:inline-flex shrink-0 text-xs px-4 py-2"
          >
            Register Now
          </NeonButton>

          {/* Mobile inline CTA */}
          <NeonButton
            href="https://hebseventportal.com/register"
            className="lg:hidden shrink-0 text-xs px-3.5 py-2"
          >
            Register
          </NeonButton>

          {/* Hamburger */}
          <button
            className="lg:hidden relative z-10 flex items-center justify-center w-11 h-11 touch-manipulation select-none"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-[14px]">
              <span className={`absolute left-0 block w-full bg-white origin-center transition-all duration-300 ease-out ${menuOpen ? "top-[6px] rotate-45 h-[1.5px]" : "top-0 rotate-0 h-[1.5px]"}`} />
              <span className={`absolute left-0 top-[6px] block w-full h-[1.5px] bg-white origin-center transition-all duration-200 ${menuOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}`} />
              <span className={`absolute left-0 block w-full bg-white origin-center transition-all duration-300 ease-out ${menuOpen ? "top-[6px] -rotate-45 h-[1.5px]" : "top-[13px] rotate-0 h-[1.5px]"}`} />
            </div>
          </button>
        </motion.nav>
      </div>

      {/* Full-screen mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between py-8 px-6 overflow-y-auto transition-transform duration-500 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-14 shrink-0" />

        <nav className="flex flex-col gap-2 flex-1 justify-center">
          {navLinks.map((link, i) =>
            link.label === "Competition" ? (
              <div
                key={link.label}
                style={{ transitionDelay: menuOpen ? `${i * 35 + 40}ms` : "0ms" }}
                className={`border-b border-zinc-900 transition-all duration-300 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              >
                <button
                  onClick={() => setIsMobileCompOpen((o) => !o)}
                  className="w-full flex items-center justify-between py-1.5 touch-manipulation select-none"
                  aria-label="Toggle competition sub-menu"
                >
                  <span className="text-xl font-medium tracking-tight text-white">Competition</span>
                  <ChevronDown className={`h-5 w-5 text-zinc-500 shrink-0 transition-transform duration-300 ${isMobileCompOpen ? "rotate-180" : "rotate-0"}`} />
                </button>

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
                        <Link href="/competitions?track=global-crown" onClick={closeMenu} className="flex items-center gap-2 text-zinc-300 hover:text-white text-base pl-4 py-2 transition-colors font-sans">
                          Global Crown Championship 2026
                        </Link>
                        <Link href="/competitions?track=barber" onClick={closeMenu} className="flex items-center gap-2 text-zinc-300 hover:text-white text-base pl-4 py-2 transition-colors font-sans">
                          Barber Championships 2026
                        </Link>
                        <Link href="/competitions?track=braiding" onClick={closeMenu} className="flex items-center gap-2 text-zinc-300 hover:text-white text-base pl-4 py-2 transition-colors font-sans">
                          Braiding Championships 2026
                          <span className="text-[10px] font-mono text-amber-500/80 bg-amber-500/[0.06] border border-amber-500/20 rounded-full px-2 py-0.5 leading-none">Oct 24</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            ) : link.label === "Partnerships" ? (
              <div
                key={link.label}
                style={{ transitionDelay: menuOpen ? `${i * 35 + 40}ms` : "0ms" }}
                className={`border-b border-zinc-900 transition-all duration-300 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              >
                <div className="w-full flex flex-col">
                  <button
                    onClick={() => setIsMobilePartnershipsOpen(!isMobilePartnershipsOpen)}
                    className="w-full flex items-center justify-between text-xl font-medium text-white py-1.5 hover:text-zinc-400 transition-colors duration-200"
                  >
                    <span>Partnerships</span>
                    <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${isMobilePartnershipsOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isMobilePartnershipsOpen && (
                    <div className="pl-4 flex flex-col gap-1 mt-2 mb-3 border-l border-zinc-800">
                      <Link href="/sponsors" onClick={closeMenu} className="block text-zinc-300 hover:text-white text-base pl-4 py-2 transition-colors font-sans">
                        Sponsor Opportunities
                      </Link>
                      <Link href="/vendors" onClick={closeMenu} className="block text-zinc-300 hover:text-white text-base pl-4 py-2 transition-colors font-sans">
                        Vendor Opportunities
                      </Link>
                    </div>
                  )}
                </div>
              </div>

            ) : link.label === "HEBS Legacy" ? (
              <div
                key={link.label}
                style={{ transitionDelay: menuOpen ? `${i * 35 + 40}ms` : "0ms" }}
                className={`border-b border-zinc-900 transition-all duration-300 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              >
                <button
                  onClick={() => setIsMobileLegacyOpen((o) => !o)}
                  className="w-full flex items-center justify-between py-1.5 touch-manipulation select-none"
                  aria-label="Toggle HEBS Legacy sub-menu"
                >
                  <span className="text-xl font-medium tracking-tight text-white">HEBS Legacy</span>
                  <ChevronDown className={`h-5 w-5 text-zinc-500 shrink-0 transition-transform duration-300 ${isMobileLegacyOpen ? "rotate-180" : "rotate-0"}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isMobileLegacyOpen && (
                    <motion.div
                      key="mobile-legacy"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 flex flex-col gap-0.5">
                        <Link href="/hebs-legacy/2025" onClick={closeMenu} className="flex items-center gap-2 text-zinc-300 hover:text-white text-base pl-4 py-2 transition-colors font-sans">
                          HEBS Lagos 2025
                        </Link>
                        <Link href="/hebs-legacy/media-gallery" onClick={closeMenu} className="flex items-center gap-2 text-zinc-300 hover:text-white text-base pl-4 py-2 transition-colors font-sans">
                          Media Gallery
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            ) : (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                style={{ transitionDelay: menuOpen ? `${i * 35 + 40}ms` : "0ms" }}
                className={`block text-xl font-medium tracking-tight text-white py-1.5 hover:text-zinc-400 transition-all duration-300 border-b border-zinc-900 ${
                  menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div
          style={{ transitionDelay: menuOpen ? "320ms" : "0ms" }}
          className={`flex flex-col gap-4 transition-all duration-300 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <NeonButton href="https://hebseventportal.com/register" onClick={closeMenu} className="w-full text-sm py-4">
            Register Now ↗
          </NeonButton>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 text-center">
            Lagos, Nigeria · October 23–25, 2026
          </p>
        </div>
      </div>
    </>
  );
}

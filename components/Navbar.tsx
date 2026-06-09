"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
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

export default function Navbar() {
  const mounted = useMounted();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Full-width fixed bar — edge-to-edge, isolates nav from hero content */}
      <div className="w-full fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-neutral-900/50">
        <motion.nav
          initial={mounted ? { y: -64, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between"
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
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="px-3 py-1.5 font-sans text-xs tracking-wide font-normal text-neutral-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <a
            href="https://hebseventportal.net"
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

      {/* Mobile dropdown — anchored just below the floating dock */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="fixed top-20 inset-x-4 z-40 md:hidden max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/5"
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
                  href="https://hebseventportal.net"
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

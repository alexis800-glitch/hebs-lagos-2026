"use client";

import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <motion.header
        initial={mounted ? { y: -80, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(13,13,13,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            className="font-playfair font-bold text-xl text-white tracking-wide"
            style={{ letterSpacing: "0.02em" }}
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
                  className="px-3 py-2 rounded-lg text-sm font-medium font-inter transition-colors duration-200"
                  style={{ color: "#aaaaaa" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "#ffffff")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "#aaaaaa")
                  }
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <a
              href="https://hebseventportal.net"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter font-semibold text-sm px-5 py-2.5 rounded-lg text-white transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #e91e8c, #c2185b)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.88")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")
              }
            >
              Get Tickets
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
            style={{ color: "#ffffff" }}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="fixed top-16 inset-x-0 z-40 md:hidden"
            style={{
              background: "rgba(13,13,13,0.98)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <ul className="flex flex-col py-4 px-4 gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="block px-4 py-3 rounded-lg text-sm font-medium font-inter transition-colors"
                    style={{ color: "#aaaaaa" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "#aaaaaa")
                    }
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-3 px-4 pb-2">
                <a
                  href="https://hebseventportal.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="btn-pink text-sm w-full text-center block"
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

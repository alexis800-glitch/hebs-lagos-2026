"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0a0a0a" />
    </svg>
  );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.16 8.16 0 004.77 1.52V7.02a4.85 4.85 0 01-1-.33z" />
    </svg>
  );
}

const socials = [
  { name: "Facebook",  Icon: FacebookIcon,  href: "https://facebook.com/thehebs",  color: "#1877F2" },
  { name: "YouTube",   Icon: YoutubeIcon,   href: "https://youtube.com/@thehebs",  color: "#FF0000" },
  { name: "Instagram", Icon: InstagramIcon, href: "https://instagram.com/thehebs", color: "#E1306C" },
  { name: "TikTok",    Icon: TikTokIcon,    href: "https://tiktok.com/@thehebs",   color: "#ffffff" },
];

export default function Footer() {
  const mounted = useMounted();

  return (
    <footer
      className="relative py-20 px-5 sm:px-8"
      style={{ background: "#0a0a0a", borderTop: "1px solid rgba(155,89,182,0.2)" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={mounted ? { opacity: 0, y: 30 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
        >
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-playfair font-bold text-2xl text-white mb-1">HEBS 2026</h3>
              <p className="text-sm font-inter" style={{ color: "#9b59b6" }}>
                Hair Education Beauty Summit
              </p>
            </div>
            <p className="text-zinc-200 text-sm md:text-base font-medium leading-relaxed mt-4 max-w-sm text-left tracking-wide">
              The premier international platform for beauty, hair, and fashion professionals.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {socials.map(({ name, Icon, href, color }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#aaaaaa",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = color;
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = color;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#aaaaaa";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "rgba(255,255,255,0.08)";
                  }}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Venue */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-lg tracking-tight mb-2">Venue</h4>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0" style={{ color: "#e91e8c" }} />
              <div>
                <p className="text-zinc-200 text-sm font-medium">
                  NJS Royale Convention &amp; Suites
                </p>
                <p className="text-sm font-inter mt-1" style={{ color: "#aaaaaa" }}>
                  Lagos, Nigeria
                </p>
                <p className="text-sm font-inter mt-1" style={{ color: "#9b59b6" }}>
                  October 23–25, 2026
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="font-playfair font-bold text-white text-lg">Contact (US)</h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:info@thehebs.com"
                className="flex items-center gap-3 text-sm font-inter transition-colors"
                style={{ color: "#aaaaaa" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#aaaaaa")
                }
              >
                <Mail size={16} style={{ color: "#9b59b6" }} />
                info@thehebs.com
              </a>
              <a
                href="tel:+14843571812"
                className="flex items-center gap-3 text-sm font-inter transition-colors"
                style={{ color: "#aaaaaa" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#aaaaaa")
                }
              >
                <Phone size={16} style={{ color: "#9b59b6" }} />
                484-357-1812
              </a>
            </div>
            <a
              href="https://hebseventportal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pink text-sm mt-2 inline-block"
              style={{ width: "fit-content" }}
            >
              Get Your Tickets
            </a>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={mounted ? { opacity: 0 } : false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs font-inter" style={{ color: "#555" }}>
            © {new Date().getFullYear()} Hair Education Beauty Summit. All rights reserved.
          </p>
          <p className="text-xs font-inter" style={{ color: "#555" }}>
            Lagos, Nigeria · October 23–25, 2026
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

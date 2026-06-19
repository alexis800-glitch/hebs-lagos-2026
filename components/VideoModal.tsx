"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
}

const BACKDROP = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const PANEL = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 8 },
};

export default function VideoModal({ isOpen, onClose, src }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause and reset video when modal closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="video-modal-backdrop"
          variants={BACKDROP}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-10"
          style={{ backgroundColor: "rgba(0,0,0,0.88)" }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
          aria-label="Promo video"
        >
          {/* Modal panel — stop propagation so clicking inside doesn't close */}
          <motion.div
            key="video-modal-panel"
            variants={PANEL}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-black border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close video"
              className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 border border-white/15 text-white/70 hover:text-white hover:bg-black/80 transition-colors duration-150 backdrop-blur-sm"
            >
              {/* X icon */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>

            {/* 16:9 aspect-ratio wrapper */}
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <video
                ref={videoRef}
                src={src}
                controls
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-contain bg-black"
              />
            </div>

            {/* Bottom label strip */}
            <div className="px-5 py-3 bg-zinc-950 border-t border-white/[0.06] flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                HEBS Lagos 2026 · Official Promo
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                October 23–25, 2026
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

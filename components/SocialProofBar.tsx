"use client";

import { motion } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

export default function SocialProofBar() {
  const mounted = useMounted();

  return (
    <section
      className="relative py-8 px-4 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(155,89,182,0.15), rgba(233,30,140,0.1))",
        borderTop: "1px solid rgba(155,89,182,0.25)",
        borderBottom: "1px solid rgba(233,30,140,0.2)",
      }}
    >
      <motion.div
        initial={mounted ? { opacity: 0, y: 10 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span
            className="text-sm font-semibold uppercase tracking-[0.2em] font-inter px-3 py-1 rounded-full"
            style={{ background: "linear-gradient(135deg, #9b59b6, #e91e8c)", color: "#fff" }}
          >
            Year 3
          </span>
          <p className="text-base md:text-xl font-medium font-inter" style={{ color: "#ffffff" }}>
            Returning for Year 3 —&nbsp;
            <span style={{ color: "#aaaaaa" }}>
              After Two Sold-Out Events in New York &amp; New Jersey
            </span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}

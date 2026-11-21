/**
 * Concept B pairing, kept for reference: Italiana + Jost. In its own module so
 * the approved direction does not preload these files (OFL, ./_fonts).
 * Font loader options must be literals.
 */
import localFont from "next/font/local";

/** Concept B display: light, high-waisted Didone-inspired capitals. */
export const italiana = localFont({
  src: [{ path: "./_fonts/italiana-latin-400-normal.woff2", weight: "400", style: "normal" }],
  variable: "--c-italiana",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

/** Concept B text: Futura-lineage geometric sans, wide-tracked for hospitality. */
export const jost = localFont({
  src: [
    { path: "./_fonts/jost-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "./_fonts/jost-latin-wght-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--c-jost",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const DESTINATION_FONTS = `${italiana.variable} ${jost.variable}`;

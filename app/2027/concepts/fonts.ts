/**
 * Type candidates for the two 2027 creative concepts. Loaded only by the
 * /2027/concepts routes, from files in ./_fonts (OFL), so the 2026 site and
 * its fonts are untouched. Font loader options must be literals.
 */
import localFont from "next/font/local";

/** Concept A display: high-contrast Didone with an optical-size axis. */
export const bodoni = localFont({
  src: [
    { path: "./_fonts/bodoni-moda-latin-opsz-normal.woff2", weight: "400 900", style: "normal" },
    { path: "./_fonts/bodoni-moda-latin-opsz-italic.woff2", weight: "400 900", style: "italic" },
  ],
  variable: "--c-bodoni",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

/** Concept A text: geometric-humanist sans with tabular figures. */
export const manrope = localFont({
  src: [{ path: "./_fonts/manrope-latin-wght-normal.woff2", weight: "200 800", style: "normal" }],
  variable: "--c-manrope",
  display: "swap",
  adjustFontFallback: "Arial",
});

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

export const CONCEPT_FONT_VARIABLES = [bodoni.variable, manrope.variable, italiana.variable, jost.variable].join(" ");

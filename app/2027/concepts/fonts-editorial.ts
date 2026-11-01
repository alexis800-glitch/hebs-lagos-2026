/**
 * Editorial pairing for the approved direction: Bodoni Moda + Manrope. In its
 * own module so routes that use it preload only these files (OFL, ./_fonts).
 * Font loader options must be literals.
 */
import localFont from "next/font/local";

/** Display: high-contrast Didone with an optical-size axis. */
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

export const EDITORIAL_FONTS = `${bodoni.variable} ${manrope.variable}`;

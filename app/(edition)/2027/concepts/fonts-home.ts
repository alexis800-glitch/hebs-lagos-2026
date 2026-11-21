/**
 * Preferred homepage pairing: Bodoni Moda (display) + Jost (text). In its own
 * module so the route preloads only these files (OFL, ./_fonts).
 * Font loader options must be literals.
 */
import localFont from "next/font/local";

export const homeBodoni = localFont({
  src: [
    { path: "./_fonts/bodoni-moda-latin-opsz-normal.woff2", weight: "400 900", style: "normal" },
    { path: "./_fonts/bodoni-moda-latin-opsz-italic.woff2", weight: "400 900", style: "italic" },
  ],
  variable: "--c-bodoni",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const homeJost = localFont({
  src: [{ path: "./_fonts/jost-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--c-jost",
  display: "swap",
  adjustFontFallback: "Arial",
});

/**
 * Jost italic, the same file, as its own face so it is not preloaded: no first
 * screen uses it, and a preload competes with the hero for bandwidth on a slow
 * phone. Next.js preloads every file of one declaration, so the face is split
 * out, and the few rules that set Jost in italic name it through `--text-italic`
 * (components/2027/home/home.css). It is a real italic, never a synthesised one.
 */
export const homeJostItalic = localFont({
  src: [{ path: "./_fonts/jost-latin-wght-italic.woff2", weight: "100 900", style: "italic" }],
  variable: "--c-jost-italic",
  display: "swap",
  preload: false,
  adjustFontFallback: "Arial",
});

export const HOME_FONTS = `${homeBodoni.variable} ${homeJost.variable} ${homeJostItalic.variable}`;

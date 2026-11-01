/**
 * Direction A design tokens (approved 2026-11-01, round 2). Bodoni Moda is set
 * at optical size 28 for display: left to font-optical-sizing auto, the browser
 * picks the 96 master at display sizes, whose hairlines all but vanish on screen.
 */
import type { CSSProperties } from "react";

export const C = {
  black: "#000000",
  champ: "#C8A96A",
  champL: "#EAD7A8",
  ivory: "#F5EFE4",
  white: "#FFFFFF",
  atlantic: "#0E3A3F",
  body: "#3B362F",
  /** Text on the champagne ground (Sponsors & exhibitors). */
  onChamp: "#1C170E",
} as const;

export const display: CSSProperties = {
  fontFamily: "var(--c-bodoni), serif",
  fontVariationSettings: '"opsz" 28',
  letterSpacing: "0.005em",
};

/** Section headings: deliberately below the hero theme, which stays the one big typographic moment. */
export const h2Style: CSSProperties = {
  ...display,
  fontWeight: 500,
  fontSize: "clamp(34px, 3.8vw, 56px)",
  lineHeight: 1.06,
};

export type BrandVariant = "mark" | "champagne";
export type NotesMode = "inline" | "panel";

/** Grounds a section can sit on; text and focus colours follow from it. */
export type Ground = "black" | "ivory" | "white" | "atlantic" | "champagne";

export const GROUND: Record<Ground, { bg: string; fg: string; muted: string; light: boolean }> = {
  black: { bg: C.black, fg: C.ivory, muted: "rgba(245,239,228,.75)", light: false },
  atlantic: { bg: C.atlantic, fg: C.ivory, muted: "rgba(245,239,228,.8)", light: false },
  ivory: { bg: C.ivory, fg: C.black, muted: C.body, light: true },
  white: { bg: C.white, fg: C.black, muted: C.body, light: true },
  champagne: { bg: C.champ, fg: C.onChamp, muted: C.onChamp, light: true },
};

/* One orchestrated moment on load (the horizon draws, the metallic line catches
   the light once); nothing else moves. Reduced motion: the final state, still. */
export const EDITORIAL_CSS = `
.da { font-family: var(--c-manrope), sans-serif; }
.da a:focus-visible, .da summary:focus-visible { outline: 2px solid ${C.champL}; outline-offset: 3px; }
.da .da-on-light a:focus-visible, .da .da-on-light summary:focus-visible { outline-color: ${C.black}; }
.da a, .da summary { touch-action: manipulation; -webkit-tap-highlight-color: rgba(200,169,106,.25); }
.da h2, .da h3 { text-wrap: balance; }
.da [id] { scroll-margin-top: 88px; }
/* Keep keyboard focus clear of the sticky header. */
html:has(.da) { scroll-padding-top: 88px; }
/* Each theme line is sized to fit its measured width (BIGGER. BOLDER. is 9.1em
   wide, BEYOND BEAUTY. 8.4em) so neither wraps or overflows on a phone. */
.da-theme-1 { font-size: min(calc((100vw - 40px) / 9.5), 80px); line-height: 1; white-space: nowrap; }
.da-theme-2 { font-size: min(calc((100vw - 40px) / 8.8), 88px); line-height: 1; white-space: nowrap; }
@media (min-width: 1024px) {
  .da-theme-1 { font-size: clamp(64px, 5.2vw, 84px); }
  .da-theme-2 { font-size: clamp(76px, 6.3vw, 100px); }
}
.da-metal {
  display: inline-block;
  padding: 0 .1em .12em 0; margin-bottom: -.12em;
  background-image: linear-gradient(100deg, #A4844C 0%, ${C.champ} 26%, #EBD7A6 44%, #F6E8C6 50%, #EBD7A6 56%, ${C.champ} 74%, #AC8C54 100%);
  background-size: 240% 100%;
  background-position: 0% 0;
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}
@media (forced-colors: active) { .da-metal { background: none; color: CanvasText; } }
@media (prefers-reduced-motion: no-preference) {
  .da-metal { animation: da-sheen 2.6s cubic-bezier(.2,.7,.2,1) .6s 1 both; }
  .da-horizon { transform-origin: left center; animation: da-draw 1.8s cubic-bezier(.2,.7,.2,1) .2s 1 both; }
}
@keyframes da-sheen { from { background-position: 100% 0; } to { background-position: 0% 0; } }
@keyframes da-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
`;

/** Names that keep their own capitals when a directive headline is set in sentence case. */
const PROPER: Record<string, string> = { hebs: "HEBS", njs: "NJS", lagos: "Lagos", nigeria: "Nigeria", atlantic: "Atlantic" };

export function sentenceCase(s: string) {
  const out = s
    .toLowerCase()
    .replace(/\s+([,.])/g, "$1")
    .replace(/\b[a-z]+\b/g, (w) => PROPER[w] ?? w);
  return out.charAt(0).toUpperCase() + out.slice(1);
}

/** The sea, as an abstract colour field: one horizon, no time of day. */
export const HORIZON = "62%";
export const PANORAMA = [
  `radial-gradient(60% 7% at 50% ${HORIZON}, rgba(234,215,168,.20), transparent 85%)`,
  `linear-gradient(180deg, #000 0%, #071A1D 42%, #1E3B3C ${HORIZON}, #123F44 ${HORIZON}, #051719 100%)`,
].join(", ");

/** Placeholder tones for reserved image positions, by ground. */
export const TONE = {
  light: "radial-gradient(120% 80% at 70% 18%, #FFFFFF 0%, #EFE5D2 45%, #E2D3B6 100%)",
  dark: "radial-gradient(120% 90% at 30% 20%, #1B2B2C 0%, #0B1414 55%, #050808 100%)",
  sea: PANORAMA,
} as const;

/**
 * The Phase 2 visual corrections to the 2027 homepage (A3, A3b, A4, A5, A6, A6b), and P1.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PreferredHomepage } from "@/components/2027/home/HomePage";
import { HOME } from "@/lib/content/home-2027";
import { findReviewAsset, REVIEW_ASSETS } from "@/lib/assets/home-2027-review";

const ROOT = join(__dirname, "..");
const css = readFileSync(join(ROOT, "components/2027/home/home.css"), "utf8");
const html = renderToStaticMarkup(createElement(PreferredHomepage));

describe("visual corrections", () => {
  it("A3: the hero carries the film without photograph cards", () => {
    expect(html).not.toMatch(/class="cards"|class="card( |")/);
    expect(css).toContain(".hp .hero>.ph{position:absolute;top:0;right:0;bottom:0;width:72%;");
  });

  it("A3b: the homepage has one review strip, and hides the shared staging banner", () => {
    expect(Array.from(html.matchAll(/class="strip"/g))).toHaveLength(1);
    expect(html).toContain("No registration or inquiry is collected.");
    expect(css).toContain("body:has(.hp-wrap) [data-preview-banner]{display:none}");
  });

  it("A4: the destination has three scenes and no surf scene", () => {
    expect(HOME.destination.scenes.map((s) => s.title)).toEqual(["Sunset by the pool", "The pool terrace", "HEBS at NJS, 2026"]);
    expect(REVIEW_ASSETS.some((a) => a.id.startsWith("dest-cinema"))).toBe(false);
  });

  it("A5: 25 July shows the House of Snapp frame, never described as a prize presentation", () => {
    const a = findReviewAsset("day-3");
    expect(a.alt).toBe("A model in a feathered headdress and gown at HEBS Lagos 2026");
    expect(a.source).toMatch(/summit day 2, 25 Oct 2026/);
    expect(a.source).not.toMatch(/prize presentation/);
    expect(HOME.highlights.rows.flat().some(([id]) => id === "hl-runway")).toBe(false);
    expect(css).not.toContain("zoomgold");
  });

  it("A6 and A6b: no frame line, a black column behind the headline, and a dip through black", () => {
    expect(html).not.toContain("frameline");
    expect(css).not.toContain("frameline");
    expect(css).toContain("linear-gradient(90deg,transparent 0,transparent 18%,#000 36%)");
    expect(css).toContain(".hp .dz .scene.on{opacity:1;transition:opacity .9s ease-out .6s}");
  });

  it("P1: Jost italic is not preloaded, and every italic Jost rule names its real italic face", () => {
    const fonts = readFileSync(join(ROOT, "app/(edition)/2027/concepts/fonts-home.ts"), "utf8");
    expect(fonts).toMatch(/homeJostItalic = localFont\(\{\s*src: \[\{ path: "\.\/_fonts\/jost-latin-wght-italic\.woff2"[^}]*\}\],[\s\S]*?preload: false,/);
    expect(fonts).toContain("${homeJostItalic.variable}");
    // An italic rule that does not set the display face is set in Jost: it must use the italic family.
    for (const rule of css.match(/[^{}]+\{[^}]*font-style:italic[^}]*\}/g) ?? []) {
      if (/font-family:var\(--display\)/.test(rule) || /^\s*\.hp \.it\{/.test(rule)) continue;
      expect(rule, rule).toContain("font-family:var(--text-italic)");
    }
  });
});


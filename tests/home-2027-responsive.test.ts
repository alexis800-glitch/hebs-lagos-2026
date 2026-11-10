/**
 * Responsive layout, media loading, the shared 2027 footer and cookie controls.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PreferredHomepage } from "@/components/2027/home/HomePage";
import { SiteFooter } from "@/components/2027/site/SiteFooter";
import { REVIEW_ASSETS, findReviewAsset } from "@/lib/assets/home-2027-review";

const ROOT = join(__dirname, "..");
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");
const css = read("components/2027/home/home.css");

describe("responsive homepage", () => {
  it("scales the desktop composition only from 1280 px, and lays out phones and tablets fluidly", () => {
    expect(css).toMatch(/@media \(min-width:1280px\)\{\.hp\{width:1440px;zoom:var\(--hpz,1\)\}\}/);
    expect(css).not.toMatch(/@media \(min-width:601px\)\{\.hp\{width:1440px/);
    expect(css).toContain("@container (max-width:1279px)");
    expect(css).toContain("@container (min-width:601px) and (max-width:1279px)");
  });
});

describe("media loading", () => {
  const html = renderToStaticMarkup(createElement(PreferredHomepage));

  it("gives every film a first-frame still and never autoplays from markup", () => {
    for (const a of REVIEW_ASSETS.filter((x) => x.kind === "video")) expect(a.poster, a.id).toMatch(/-poster\.webp$/);
    expect(html).not.toMatch(/<video[^>]*\sautoplay/i);
    expect(html).not.toMatch(/<source media=[^>]*video\/mp4/);
  });

  it("loads only the first screen eagerly", () => {
    const eager = Array.from(html.matchAll(/<img[^>]*loading="eager"[^>]*>/g)).length;
    const lazy = Array.from(html.matchAll(/<img[^>]*loading="lazy"[^>]*>/g)).length;
    expect(eager).toBe(2); // the hero still and the header mark
    expect(html).not.toMatch(/<img(?![^>]*loading=)[^>]*src="\/_review/);
    expect(lazy).toBeGreaterThan(40);
    expect(html).toMatch(/<video[^>]*preload="metadata"[^>]*id="hero-film"|<video[^>]*id="hero-film"[^>]*preload="metadata"/);
  });

  it("offers a pause control for each looping film", () => {
    expect(html).toMatch(/class="vctl-hero"/);
    expect(html).toMatch(/class="vctl-fn"/);
  });

  it("cuts large review images into smaller widths, and the mark into WebP", () => {
    expect(findReviewAsset("welcome-arch").widths).toEqual([480, 800, 900]);
    expect(findReviewAsset("mark-2027-a").widths).toEqual([240, 480]);
    expect(html).toMatch(/mark-2027-a-480\.webp/);
  });
});

describe("2027 footer and cookie controls", () => {
  const footer = renderToStaticMarkup(createElement(SiteFooter));

  it("is one footer, rendered by the 2027 layout, linking built pages and the live Privacy & Cookie Notice only", () => {
    expect(renderToStaticMarkup(createElement(PreferredHomepage))).not.toMatch(/<footer/);
    expect(read("app/(edition)/2027/layout.tsx")).toContain("<SiteFooter />");
    const hrefs = Array.from(footer.matchAll(/href="([^"]+)"/g)).map((m) => m[1]);
    for (const h of hrefs) expect(h === "/privacy" || h === "/2027" || h.startsWith("/2027/"), h).toBe(true);
    expect(footer).toContain("Cookie preferences</button>");
  });

  it("invents no contact details, social accounts or legal wording", () => {
    expect(footer).not.toMatch(/@|mailto:|tel:|wa\.me|instagram|facebook|youtube|tiktok/i);
    expect(footer).toMatch(/Terms &amp; Conditions<\/span> <span class="pend">Pending approval: A8/);
    expect(footer).not.toMatch(/<a[^>]*>Terms/);
  });

  it("never loads the Meta Pixel outside production", () => {
    // Both root layouts: the live 2026 site and the 2027 site.
    for (const f of ["app/(site)/layout.tsx", "app/(edition)/layout.tsx"]) {
      expect(read(f), f).toContain('<TrackingConsent trackingAllowed={deployEnvironment() === "production"} />');
    }
    expect(read("components/TrackingConsent.tsx")).toContain("decision === CONSENT_ACCEPTED && trackingAllowed && <MetaPixel />");
  });
});

describe("contrast (N5)", () => {
  const lum = (h: string) => {
    const c = [0, 2, 4].map((i) => parseInt(h.slice(1 + i, 3 + i), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (a: string, b: string) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

  it("uses AA colours for small text and focus on ivory", () => {
    expect(css).not.toContain("#9A7432");
    expect(ratio("#7A5A22", "#F6EFE2")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("#6E685D", "#F6EFE2")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("#4A3510", "#CDB27E")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("#8C6B34", "#F6EFE2")).toBeGreaterThanOrEqual(3); // large italic headlines and the arrow border only
    expect(css).toContain(".hp .wl :focus-visible,.hp .dy :focus-visible,.hp .cp :focus-visible,.hp .sp :focus-visible{outline-color:#7A5A22}");
    expect(css).not.toMatch(/\.card2 \.who\{[^}]*rgba\(22,17,10,\.42\)/);
  });
});

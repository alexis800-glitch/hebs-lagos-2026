/**
 * House of Snapp summit photographs in the homepage slots: each one is rebuilt
 * from a verified original, cut to its frame, recorded with its source and
 * clearance, and never repeated elsewhere on the page.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PreferredHomepage } from "@/components/2027/home/HomePage";
import { REVIEW_ASSETS, findReviewAsset } from "@/lib/assets/home-2027-review";

const ROOT = join(__dirname, "..");
const manifest = JSON.parse(readFileSync(join(ROOT, "docs/design/2027-home/tools/hos-crops.json"), "utf8")) as {
  images: { slot: string; file: string; folder: string; day: number; sha256: string; size: [number, number]; crop: [number, number, number, number]; aspect: number; widths: number[] }[];
};
const FRAME = /(DSC\d{5}|DSC_\d{4}|IMG_\d{4}|0Q1A\d{4})/;

describe("House of Snapp homepage photographs", () => {
  it("rebuilds every slot from a fingerprinted original, cropped to the frame's shape", () => {
    expect(manifest.images).toHaveLength(20);
    for (const m of manifest.images) {
      expect(m.sha256, m.slot).toMatch(/^[0-9a-f]{64}$/);
      expect(m.folder, m.slot).toBe(m.day === 1 ? "HEBS DAY 1/PHOTOS" : "HEBS DAY 2/PHOTOS");
      const [x0, y0, x1, y1] = m.crop;
      expect(x0 >= 0 && y0 >= 0 && x1 <= m.size[0] && y1 <= m.size[1], m.slot).toBe(true);
      expect(Math.abs((x1 - x0) / (y1 - y0) - m.aspect) / m.aspect, m.slot).toBeLessThan(0.01);
      const a = findReviewAsset(m.slot);
      expect(a.widths, m.slot).toEqual(m.widths);
      expect(a.fullWidth, m.slot).toBe(m.widths[m.widths.length - 1]);
      expect(a.source, m.slot).toContain(m.file.replace(/\.jpg$/, ""));
    }
  });

  it("records the collection, the summit day and what clearance each photograph needs", () => {
    for (const m of manifest.images) {
      const a = findReviewAsset(m.slot);
      expect(a.source, m.slot).toMatch(m.day === 1 ? /summit day 1, 24 Oct 2026/ : /summit day 2, 25 Oct 2026/);
      expect(a.source, m.slot).not.toMatch(/prize presentation/);
      expect(a.rights.permission, m.slot).toBe("not-recorded");
      expect(a.restriction, m.slot).toMatch(/photographer's written permission and each recognisable person's consent/);
      expect(a.permittedUsage, m.slot).toEqual(["internal-review"]);
    }
  });

  it("shows no prize wording in the trophy photograph (D8)", () => {
    expect(findReviewAsset("comp-trophy").source).toMatch(/IMG_7937.*no prize wording in frame/);
  });

  it("never shows the same photograph twice on the homepage", () => {
    const html = renderToStaticMarkup(createElement(PreferredHomepage));
    const seen = new Map<string, string>();
    // One file under two names, and one photograph cut for desktop and phone, are not repeats.
    const samePicture = new Set(["dest-terrace", "exp-networking-phone"]);
    for (const a of REVIEW_ASSETS) {
      if (a.kind !== "image" || !html.includes(a.src) || samePicture.has(a.id)) continue;
      const frame = (a.source.match(FRAME) ?? [a.src])[0];
      expect(seen.get(frame), `${a.id} repeats ${seen.get(frame)} (${frame})`).toBeUndefined();
      seen.set(frame, a.id);
    }
    expect(seen.size).toBeGreaterThan(35);
  });
});

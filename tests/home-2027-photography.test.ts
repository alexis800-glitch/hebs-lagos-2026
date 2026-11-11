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
import { EducationPage } from "@/components/2027/editorial/inner";
import { REVIEW_ASSETS, findReviewAsset } from "@/lib/assets/home-2027-review";

const ROOT = join(__dirname, "..");
const manifest = JSON.parse(readFileSync(join(ROOT, "docs/design/2027-home/tools/hos-crops.json"), "utf8")) as {
  images: { slot: string; file: string; folder: string; day: number; sha256: string; size: [number, number]; crop: [number, number, number, number]; aspect: number; widths: number[] }[];
};
const FRAME = /(DSC\d{5}|DSC_\d{4}|IMG_\d{4}|0Q1A\d{4})/;

describe("House of Snapp homepage photographs", () => {
  it("rebuilds every slot from a fingerprinted original, cropped to the frame's shape", () => {
    expect(manifest.images).toHaveLength(25);
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
      // Approved and paid for, but payment is not a written licence: it stays review media.
      expect(a.restriction, m.slot).toMatch(/Approved by Mrs\. Shuler.*payment alone is not a publishing licence/);
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

describe("Education & Masterclasses photographs", () => {
  const EIGHT = ["exp-education", "welcome-inset", "edu-session", "edu-styling", "edu-skincare", "edu-technique", "edu-loc", "sp-hall"];

  it("shows the eight approved photographs, each once, only where review media may render", () => {
    const html = renderToStaticMarkup(createElement(EducationPage, { environment: "development" }));
    for (const id of EIGHT) expect(html.split(`src="${findReviewAsset(id).src}"`).length - 1, id).toBe(1);
    const frames = EIGHT.map((id) => findReviewAsset(id).source.match(FRAME)?.[0]);
    expect(new Set(frames).size).toBe(8);
    expect(html).toContain("for internal review only");
    expect(html).toContain(">HEBS Lagos 2026</figcaption>");
    expect(html).toContain("2027 speakers will be announced once confirmed.");
    expect(html).toContain("The 2027 programme is planned around five areas of learning.");
    expect(html).not.toMatch(/built around five areas|being demonstrated/);
  });

  it("keeps the treatment banner and the children out of frame", () => {
    expect(findReviewAsset("edu-skincare").alt).toBe("A skincare treatment on a client at HEBS Lagos 2026");
    expect(findReviewAsset("edu-skincare").source).toMatch(/treatment claim is out of frame/);
    expect(findReviewAsset("sp-hall").source).toMatch(/no child is in frame/);
  });

  it("keeps the reserved plate and no photographs anywhere else", () => {
    for (const environment of ["production", "preview"] as const) {
      const html = renderToStaticMarkup(createElement(EducationPage, { environment }));
      for (const id of EIGHT) expect(html, `${environment} ${id}`).not.toContain(findReviewAsset(id).src.replace(/\.webp$/, ""));
      expect(html, environment).not.toContain('id="photographs"');
      expect(html, environment).toContain('data-media-slot="education"');
    }
  });

  it("names no session, instructor or programme detail", () => {
    for (const id of EIGHT) expect(findReviewAsset(id).alt, id).not.toMatch(/masterclass|session by|instructor|educator|led by/i);
  });
});

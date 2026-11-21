import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Mark, MARK_2027_DIR } from "@/components/2027/site/mark";
import { PUBLISHED_MEDIA } from "@/lib/assets/published-media-2027";

const ROOT = join(__dirname, "..");
const BRAND = join(ROOT, "public", MARK_2027_DIR);

describe("2027 mark", () => {
  it("commits only the approved mark cuts, byte-identical to the approved files", () => {
    const files = readdirSync(BRAND).sort();
    expect(files).toEqual(["mark-2027-a-240.webp", "mark-2027-a-480.webp"]);
    for (const f of files) {
      expect(createHash("sha256").update(readFileSync(join(BRAND, f))).digest("hex"), f).toBe(PUBLISHED_MEDIA[f]);
    }
  });

  it("always renders the approved mark, never the old HEBS logo", () => {
    const html = renderToStaticMarkup(createElement(Mark));
    expect(html).toContain(`${MARK_2027_DIR}mark-2027-a-480.webp`);
    expect(html).not.toMatch(/hebs_logo_nav/);
    expect(readFileSync(join(ROOT, "components/2027/site/mark.tsx"), "utf8")).not.toMatch(/hebs_logo_nav|\/assets\/logos\//);
  });
});

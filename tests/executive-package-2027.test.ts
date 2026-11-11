/**
 * The executive content package (docs/launch/2027-executive-content-package.md):
 * generated from the sign-off register, so its wording is exactly what the pages
 * show. `npm run copy:inventory` rewrites it; this test fails when it is stale.
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { executivePackage } from "../lib/content/executive-package-2027";
import { approvalBlocks, signoffItems } from "../lib/content/signoff-2027";

const FILE = join(__dirname, "../docs/launch/2027-executive-content-package.md");

describe("executive content package", () => {
  const body = executivePackage();

  it("is up to date", () => {
    if (process.env.UPDATE_COPY_INVENTORY === "1") writeFileSync(FILE, body);
    expect(existsSync(FILE) ? readFileSync(FILE, "utf8") : "", "Run npm run copy:inventory").toBe(body);
  });

  it("quotes every substantive line exactly, and no routine wording", () => {
    const items = signoffItems();
    for (const b of approvalBlocks(items).filter((x) => x.category === "B")) {
      for (const i of b.items) expect(body, i.id).toContain(`> ${i.text}`);
    }
    for (const i of items.filter((x) => x.category === "A" && x.text.length > 30)) expect(body, i.id).not.toContain(`> ${i.text}\n`);
  });

  it("asks nothing about the approved media, and records no approval", () => {
    expect(body).toMatch(/photography and media you approved are recorded as approved/);
    expect(body).not.toMatch(/written usage terms (are|is) (required|needed) before/i);
    expect(body).not.toMatch(/Approved by Mrs\. Shuler on/);
  });
});

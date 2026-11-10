/**
 * The preferred homepage's navigation and calls to action: real links and
 * controls, pointing only at built 2027 pages or at the closed priority list.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PreferredHomepage } from "@/components/2027/home/HomePage";
import { HOME_HREF, NAV } from "@/components/2027/home/links";
import { PRIORITY_CTA, PRIORITY_HREF, SITE_MENU, SITE_PAGES } from "@/lib/site/2027";
import { FORMS_OPEN } from "@/lib/integrations/registration-2027";

const ROOT = join(__dirname, "..");
const html = renderToStaticMarkup(createElement(PreferredHomepage));
const hrefs = Array.from(html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g), (m) => m[1]);

/** Every element id the 2027 pages can render, read from their source. */
function knownAnchors(): Set<string> {
  const dir = join(ROOT, "components/2027/editorial");
  const ids = new Set(["july-23", "july-24", "july-25"]);
  for (const f of readdirSync(dir)) {
    for (const m of Array.from(readFileSync(join(dir, f), "utf8").matchAll(/\bid="([a-z0-9-]+)"/g))) ids.add(m[1]);
  }
  return ids;
}

describe("preferred homepage links", () => {
  it("has no text styled to look like a button or link", () => {
    expect(html).not.toMatch(/<span[^>]*class="[^"]*\b(btn|pill|menu)\b/);
    expect(html).not.toMatch(/<span class="links"/);
    for (const m of Array.from(html.matchAll(/<(\w+)[^>]*class="btn [^"]*"/g))) expect(m[1]).toBe("a");
  });

  it("links the header to the five pages of the approved design, the sponsor page and home", () => {
    expect(NAV.map((n) => n.label)).toEqual(["Experience", "Programme", "Competitions", "Education", "Travel"]);
    for (const n of NAV) expect(hrefs).toContain(n.href);
    expect(hrefs).toContain(HOME_HREF);
    expect(hrefs).toContain("/2027/sponsorship");
  });

  it("offers every built 2027 page in the phone menu, behind a real button", () => {
    expect(html).toMatch(/<button type="button" class="menu" aria-expanded="false" aria-controls="hp-menu">Menu<\/button>/);
    expect(html).toMatch(/<div id="hp-menu" class="mpanel" role="dialog" aria-modal="true" aria-label="Menu" hidden="">/);
    for (const l of SITE_MENU) expect(hrefs, l.href).toContain(l.href);
    expect(SITE_MENU).toHaveLength(12);
  });

  it("points every link at a built 2027 page, a real section of it, or the priority list", () => {
    const paths = new Set(SITE_PAGES.filter((p) => p.built).map((p) => p.path));
    const anchors = knownAnchors();
    expect(hrefs.length).toBeGreaterThanOrEqual(30);
    for (const h of hrefs) {
      // The footer links the live Privacy & Cookie Notice; nothing else outside /2027.
      if (h === HOME_HREF || h === PRIORITY_HREF || h === "/privacy") continue;
      const [path, hash] = h.split("#");
      expect(paths.has(path), h).toBe(true);
      if (hash) expect(anchors.has(hash), h).toBe(true);
    }
  });

  it("keeps the priority list closed: honest label, no form or submission on the homepage", () => {
    expect(FORMS_OPEN.priority).toBe(false);
    expect(PRIORITY_CTA).toBe("Priority list opens soon");
    expect(html).toContain(`href="${PRIORITY_HREF}">${PRIORITY_CTA}</a>`);
    expect(html).not.toMatch(/<form|\/api\/hebs2027/);
  });
});

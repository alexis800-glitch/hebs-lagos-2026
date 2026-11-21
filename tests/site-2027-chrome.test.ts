/**
 * A2: one canonical 2027 homepage, one shared header and footer on every 2027
 * page, and the closed priority list on the tickets page.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SiteHeader } from "@/components/2027/site/SiteHeader";
import { TicketsPage, AboutPage } from "@/components/2027/editorial/inner";
import { HOME_HREF, NAV } from "@/components/2027/home/links";
import { BASE, PRIORITY_HREF, SITE_MENU, sitePage } from "@/lib/site/2027";
import { FORMS_OPEN } from "@/lib/integrations/registration-2027";

const ROOT = join(__dirname, "..");
const APP = join(ROOT, "app/(edition)/2027");
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");
const SUPPORTING = ["about", "competitions", "contact", "education", "exhibitors", "experience", "gallery", "programme", "speakers", "sponsorship", "tickets", "travel"];

describe("canonical homepage", () => {
  it("serves the cinematic homepage at /2027 and sends the old addresses there", () => {
    expect(HOME_HREF).toBe(BASE);
    expect(sitePage("home").path).toBe(BASE);
    expect(read("app/(edition)/2027/page.tsx")).toContain("<PreferredHomepage />");
    for (const f of ["concepts/home/page.tsx", "homepage/page.tsx"]) expect(read(`app/(edition)/2027/${f}`), f).toContain('redirect("/2027")');
  });

  it("points every call to join the priority list at the closed section on the tickets page", () => {
    expect(PRIORITY_HREF).toBe("/2027/tickets#priority-list");
  });
});

describe("shared header", () => {
  const html = renderToStaticMarkup(createElement(SiteHeader, { current: "about" }));
  const hrefs = Array.from(html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g), (m) => m[1]);

  it("carries the homepage's items: mark, five headline pages, sponsor link and full phone menu", () => {
    expect(html).toContain('<a class="skip" href="#main-content">');
    expect(hrefs).toContain(HOME_HREF);
    for (const n of NAV) expect(hrefs).toContain(n.href);
    expect(hrefs).toContain("/2027/sponsorship");
    for (const l of SITE_MENU) expect(hrefs).toContain(l.href);
  });

  it("marks the current page", () => {
    expect(html).toMatch(/<a href="\/2027\/about" aria-current="page"/);
    expect(Array.from(html.matchAll(/aria-current="page"/g))).toHaveLength(1);
  });

  it("is used by every supporting page, which no longer loads its own fonts", () => {
    const inner = read("components/2027/editorial/inner.tsx");
    for (const id of SUPPORTING) {
      expect(inner, id).toContain(`<Shell page="${id}"`);
      expect(read(`app/(edition)/2027/${id}/page.tsx`), id).not.toContain("EDITORIAL_FONTS");
    }
    expect(readdirSync(APP).filter((d) => SUPPORTING.includes(d))).toHaveLength(12);
    const about = renderToStaticMarkup(createElement(AboutPage, { environment: "preview" }));
    expect(about).toContain('class="s27h"');
    expect(about).toContain('<main id="main-content">');
  });
});

describe("priority list, closed", () => {
  const html = renderToStaticMarkup(createElement(TicketsPage, { environment: "preview" }));
  const section = html.slice(html.indexOf('id="priority-list"'), html.indexOf('id="final-cta"'));

  it("is a real section of the tickets page that says the list is not open", () => {
    expect(FORMS_OPEN.priority).toBe(false);
    expect(section.length).toBeGreaterThan(0);
    expect(section).toContain("The priority list is not open yet.");
    expect(section).toContain("No payment is requested through the priority list.");
  });

  it("has no form and asks for nothing", () => {
    expect(section).not.toMatch(/<form|<input|<textarea|<select|type="submit"/);
  });
});

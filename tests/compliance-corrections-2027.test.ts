/**
 * Directive compliance corrections of 22 Nov 2026 (HEBS management, after the
 * 111-requirement audit against Mrs. Shuler's original directive).
 */
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PreferredHomepage } from "@/components/2027/home/HomePage";
import { SiteFooter } from "@/components/2027/site/SiteFooter";
import { ContactPage } from "@/components/2027/editorial/inner";
import { HOME } from "@/lib/content/home-2027";
import { PAGES } from "@/lib/content/2027-pages";
import { SOCIAL_2027 } from "@/lib/site/social-2027";

const home = renderToStaticMarkup(createElement(PreferredHomepage));
const section = (cls: string) => { const at = home.search(new RegExp(`<section class="${cls}"`)); return home.slice(at, home.indexOf("</section>", at)); };

describe("venue imagery (directive 4A, 4D, 4E; correction 1)", () => {
  it("shows no 2026 summit photograph in the NJS Beach Resort destination section", () => {
    const ds = section("dsb");
    expect(ds).not.toMatch(/<img\b/);
    expect(ds).not.toMatch(/Events Center|PHOTOGRAPHED/);
    expect(ds).toContain("NJS Beach Resort");
    expect(ds).toContain('href="https://www.njsbeachresort.com"');
  });

  it("makes the destination experience card text-led and drops 'at the resort' from the entertainment card", () => {
    const items = HOME.experiences.items;
    expect(items.find((i) => i.title === "Luxury Destination Experiences")?.media).toBe("");
    expect(items.find((i) => i.title === "Entertainment and Celebrations")?.text).not.toMatch(/resort/i);
    const ex = section("ex");
    expect(ex).toContain('class="tlp"');
    expect(ex).not.toMatch(/exp-destination/);
  });
});

describe("official social links (directive 5 Contact Us, 9 Social media; correction 2)", () => {
  it("are the two accounts published on the live HEBS site, on Contact and in the footer, opening safely", () => {
    expect(SOCIAL_2027.map((s) => s.url)).toEqual([
      "https://www.instagram.com/haireducationbeautysummit/",
      "https://www.facebook.com/p/Hair-Education-Beauty-Summit-61571760180801/",
    ]);
    const contact = renderToStaticMarkup(createElement(ContactPage, { environment: "production" }));
    const footer = renderToStaticMarkup(createElement(SiteFooter));
    for (const html of [contact, footer]) {
      for (const s of SOCIAL_2027) {
        expect(html).toMatch(new RegExp(`<a[^>]*href="${s.url.replace(/[.?]/g, "\\$&")}"[^>]*target="_blank"[^>]*rel="noopener noreferrer"`));
      }
    }
    expect(contact).not.toContain("listed here once confirmed");
  });
});

describe("homepage education block and hero sponsor button (directive 4G, 4A; corrections 3 and 4)", () => {
  it("lists the five learning tracks from the Education page and links to it", () => {
    const ed = section("edh");
    for (const t of PAGES.education.tracks) expect(ed).toContain(t.title);
    expect(ed).toContain('href="/2027/education"');
  });

  it("offers Become a sponsor in the hero button group", () => {
    const hero = home.slice(0, home.indexOf("</header>") > 0 ? home.indexOf("</section>") : 4000);
    expect(hero).toMatch(/<a[^>]*href="\/2027\/sponsorship"[^>]*>Become a sponsor<\/a>/);
  });
});

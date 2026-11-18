/**
 * Travel & accommodation (18 Nov 2026, Option B): the five photograph positions show
 * only approved, registered photographs; no conference photograph stands in for the
 * resort; nothing about rooms or facilities is invented.
 */
import { afterEach, describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { REVIEW_ASSETS } from "@/lib/assets/home-2027-review";
import { TravelPage, TRAVEL_IMAGES_NEEDED } from "@/components/2027/editorial/inner";

const SLOTS = ["travel-coast", "travel-terrace", "travel-architecture", "travel-arrival", "travel-room"];
const render = (environment: "development" | "preview") => renderToStaticMarkup(createElement(TravelPage, { environment }));

describe("Travel & accommodation", () => {
  const saved = process.env.HEBS_TRAVEL_CANDIDATES;
  afterEach(() => { if (saved === undefined) delete process.env.HEBS_TRAVEL_CANDIDATES; else process.env.HEBS_TRAVEL_CANDIDATES = saved; });

  it("shows no resort, room or event photograph until approved ones are registered", () => {
    delete process.env.HEBS_TRAVEL_CANDIDATES;
    for (const id of SLOTS) expect(REVIEW_ASSETS.some((a) => a.id === id), id).toBe(false);
    for (const env of ["development", "preview"] as const) {
      const html = render(env);
      expect(html, env).not.toMatch(/<img[^>]*(travel-candidates|_review\/|\/2027\/media\/gal-)/);
      expect(html, env).not.toContain("Candidate, not approved");
    }
    expect(TRAVEL_IMAGES_NEEDED).toHaveLength(SLOTS.length);
  });

  it("has no path for unapproved photographs at all (approved, registered photographs only)", () => {
    const src = readFileSync(join(__dirname, "../components/2027/editorial/inner.tsx"), "utf8");
    expect(src).not.toMatch(/travel-candidates|HEBS_TRAVEL_CANDIDATES|HEBS_TRAVEL_VARIANT/);
    expect(existsSync(join(__dirname, "../public/_review/travel-candidates"))).toBe(false);
  });

  it("keeps the facts and every earlier anchor", () => {
    delete process.env.HEBS_TRAVEL_CANDIDATES;
    const html = render("development");
    for (const id of ["arriving", "resort", "stay", "journey", "venue", "visas", "faq"]) expect(html, id).toContain(`id="${id}"`);
    expect(html).toContain("Murtala Muhammed International Airport");
    expect(html).toContain("www.njsbeachresort.com");
    expect(html).toContain("Arrangements to be announced");
    expect(html).not.toMatch(/ocean[- ]view|sea[- ]view|per night|suite types?|room types?/i);
  });
});

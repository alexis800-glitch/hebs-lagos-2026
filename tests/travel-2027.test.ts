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

const SLOTS = ["travel-coast", "travel-terrace", "travel-architecture", "travel-arrival", "travel-room", "travel-progress"];
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

describe("Travel: venue location and facilities (owner decisions, 21 Nov 2026)", () => {
  it("withholds the unconfirmed address, map point and facility name", async () => {
    const { VENUE_LOCATION, CONFERENCE_CENTRE_NAME, mapLinks } = await import("@/lib/content/venue-2027");
    expect(VENUE_LOCATION.address.status).toBe("awaiting-confirmation");
    expect(VENUE_LOCATION.map.status).toBe("awaiting-confirmation");
    expect(CONFERENCE_CENTRE_NAME.status).toBe("awaiting-confirmation");
    expect(mapLinks("development")).toBeNull();
    for (const env of ["development", "preview"] as const) {
      const html = render(env);
      expect(html).not.toMatch(/Mosere|Akete|Kogo|google\.com\/maps|maps\.apple\.com/);
      expect(html).not.toMatch(/NJS Royale|conference cent(er|re)|Richland/i);
    }
  });

  it("builds map links only from an approved, finite point", async () => {
    const { mapLinks } = await import("@/lib/content/venue-2027");
    const ok = { status: "approved" as const, value: { lat: 6.4, lng: 4.0 }, source: "test" };
    expect(mapLinks("production", ok)?.google).toBe("https://www.google.com/maps/search/?api=1&query=6.400000,4.000000");
    expect(mapLinks("production", { status: "provisional", value: { lat: 6.4, lng: 4 }, note: "t" })).toBeNull();
    expect(mapLinks("production", { status: "approved", value: { lat: Number.NaN, lng: 4 }, source: "t" })).toBeNull();
  });

  it("keeps facilities in use apart from facilities in development, with no invented dates", async () => {
    const { VENUE_FACILITIES, DEVELOPMENT_UPDATE } = await import("@/lib/content/venue-2027");
    const html = render("development");
    expect(html).toContain('id="facilities"');
    expect(html).toContain("In use today");
    expect(html).toContain("In development");
    const rooms = VENUE_FACILITIES.find((f) => f.id === "guest-rooms");
    expect(rooms?.state).toBe("in-development");
    expect(rooms?.opening?.status).toBe("awaiting-confirmation");
    expect(html).toContain("Opening date to be confirmed");
    expect(html).not.toMatch(/book (a|your) room|rooms? (are )?available|now open/i);
    // No development-update photograph until NJS approves one with its date.
    expect(DEVELOPMENT_UPDATE.status).toBe("awaiting-confirmation");
    expect(html).not.toContain("Development update.");
  });
});

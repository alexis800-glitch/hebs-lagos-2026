/** Travel & accommodation (18 Nov 2026): no event photograph as the hero, and no resort or room image until verified ones exist. */
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { REVIEW_ASSETS } from "@/lib/assets/home-2027-review";
import { TravelPage, TRAVEL_IMAGES_NEEDED } from "@/components/2027/editorial/inner";

describe("Travel & accommodation", () => {
  const html = renderToStaticMarkup(createElement(TravelPage, { environment: "development" }));
  const hero = html.slice(html.indexOf('aria-labelledby="page-title"'), html.indexOf("</section>", html.indexOf('aria-labelledby="page-title"')));

  it("uses no photograph in the hero (the travel pass, from confirmed facts only)", () => {
    expect(hero).not.toMatch(/<img/);
    expect(hero).toContain("LOS");
    expect(hero).toContain("Murtala Muhammed International Airport");
  });

  it("shows no resort or room photograph until verified ones are registered, and says which two are needed", () => {
    for (const id of ["travel-venue", "travel-room"]) {
      expect(REVIEW_ASSETS.some((a) => a.id === id), id).toBe(false);
      expect(html, id).not.toContain(`/${id}`);
    }
    expect(TRAVEL_IMAGES_NEEDED).toHaveLength(2);
    expect(html).toContain("not the resort&#x27;s rooms or facilities");
  });

  it("keeps every earlier anchor", () => {
    for (const id of ["arriving", "stay", "journey", "venue", "visas", "faq"]) expect(html, id).toContain(`id="${id}"`);
  });
});

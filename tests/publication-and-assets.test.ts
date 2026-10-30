import { describe, expect, it } from "vitest";
import { deployEnvironment, gatedValue, isPagePublishable, isRenderable } from "@/lib/publication";
import { ASSETS, MEDIA_SLOTS, findAsset, mayDepict, resolveSlot } from "@/lib/assets/register";
import { ANNOUNCEMENT_ITEMS, COPY, HOMEPAGE_SECTIONS, previewStatuses } from "@/lib/content/2027";

describe("publication guard", () => {
  it("maps Vercel environments", () => {
    expect(deployEnvironment({ VERCEL_ENV: "production" })).toBe("production");
    expect(deployEnvironment({ VERCEL_ENV: "preview" })).toBe("preview");
    expect(deployEnvironment({})).toBe("development");
  });

  it("lets production render approved material only", () => {
    expect(isRenderable("approved", "production")).toBe(true);
    for (const s of ["provisional", "awaiting-confirmation", "draft"] as const) {
      expect(isRenderable(s, "production")).toBe(false);
    }
    expect(isRenderable("provisional", "preview")).toBe(true);
    expect(isRenderable("draft", "preview")).toBe(false);
  });

  it("withholds the 2027 preview pages on a production deployment", () => {
    expect(isPagePublishable(previewStatuses(), "production")).toBe(false);
    expect(isPagePublishable(previewStatuses(), "preview")).toBe(true);
  });

  it("never returns an awaiting-confirmation value", () => {
    expect(gatedValue({ status: "awaiting-confirmation", note: "x" }, "development")).toBeNull();
    expect(gatedValue({ status: "provisional", value: "v", note: "x" }, "production")).toBeNull();
    expect(gatedValue({ status: "provisional", value: "v", note: "x" }, "preview")).toBe("v");
  });
});

describe("asset register", () => {
  it("never lets AI-generated media depict a real venue or event", () => {
    const ai = findAsset("hero-video-higgsfield");
    for (const env of ["production", "preview", "development"] as const) {
      expect(mayDepict(ai, "real-venue", env)).toBe(false);
      expect(mayDepict(ai, "real-event", env)).toBe(false);
    }
  });

  it("fills no real-venue or real-event slot yet, so every one is a labelled placeholder", () => {
    for (const slot of MEDIA_SLOTS) {
      const r = resolveSlot(slot.id, "preview");
      expect(r.kind).toBe("placeholder");
      if (r.kind === "placeholder") expect(r.reason.length).toBeGreaterThan(10);
    }
  });

  it("records an approval for every approved asset", () => {
    for (const a of ASSETS.filter((x) => x.status === "approved")) expect(a.approval).toBeDefined();
  });
});

describe("traceability", () => {
  it("covers all ten homepage sections A-J with structure built", () => {
    expect(HOMEPAGE_SECTIONS.map((s) => s.id)).toEqual(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]);
    expect(HOMEPAGE_SECTIONS.every((s) => s.structureBuilt)).toBe(true);
  });

  it("lists the section 11 launch items", () => {
    expect(ANNOUNCEMENT_ITEMS).toHaveLength(8);
  });

  it("has six experiences in directive order", () => {
    expect(COPY.experience.items.map((i) => i.title)).toEqual([
      "Professional Beauty Education",
      "Hair and Beauty Competitions",
      "Exhibitions and Brand Showcases",
      "International Networking",
      "Entertainment and Celebrations",
      "Luxury Destination Experiences",
    ]);
  });
});

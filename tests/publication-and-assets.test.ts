import { describe, expect, it } from "vitest";
import { deployEnvironment, gatedValue, isPagePublishable, isRenderable } from "@/lib/publication";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { ASSETS, MEDIA_SLOTS, findAsset, findSlot, mayDepict, resolveSlot, slotRefusal, type AssetRecord } from "@/lib/assets/register";
import { ANNOUNCEMENT_ITEMS, COPY, HOMEPAGE_SECTIONS, previewStatuses } from "@/lib/content/2027";

const ROOT = join(__dirname, "..");
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

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

  it("keeps HEBS US-edition photographs in the archive and out of every 2027 slot", () => {
    const us = ASSETS.filter((a) => a.origin === "hebs-us-edition");
    expect(us.map((a) => a.id)).toEqual(["archive-2025-us-winner-05", "archive-2025-us-crowd-01"]);
    for (const a of us) {
      expect(a.permittedUsage).toEqual(["historical-archive"]);
      expect(a.eventYear).toBe(2025);
      expect(a.location).toBe("New Jersey, USA");
      // Even if it were approved with rights recorded, it could not fill a 2027 slot.
      const approved: AssetRecord = {
        ...a, status: "approved", approval: { by: "test", date: "2026-11-01" },
        permittedDepictions: ["real-event", "real-venue"],
        rights: { holder: "HEBS", permission: "recorded", peopleConsent: "obtained" },
      };
      for (const slot of MEDIA_SLOTS) expect(slotRefusal(approved, slot, "production")).not.toBeNull();
    }
    expect(MEDIA_SLOTS.every((s) => s.assetId === null || findAsset(s.assetId).origin !== "hebs-us-edition")).toBe(true);
  });

  it("fills beauty-event slots only with HEBS Lagos media and resort slots only with NJS media", () => {
    const base = {
      src: "/x.jpg", alt: "x", eventYear: 2026, edition: "HEBS Lagos 2026", location: "Lagos, Nigeria",
      status: "approved" as const, approval: { by: "test", date: "2026-11-01" },
      rights: { holder: "HEBS", permission: "recorded" as const, peopleConsent: "obtained" as const },
      permittedUsage: ["2027-site" as const], restriction: "",
    };
    const lagos: AssetRecord = { ...base, id: "lagos", origin: "hebs-lagos-event", provenance: "hebs-event-photo", permittedDepictions: ["real-event"] };
    const njs: AssetRecord = { ...base, id: "njs", origin: "njs-resort", provenance: "venue-supplied", permittedDepictions: ["real-venue"] };
    expect(slotRefusal(lagos, findSlot("day-2"), "production")).toBeNull();
    expect(slotRefusal(njs, findSlot("day-1"), "production")).toBeNull();
    expect(slotRefusal(lagos, findSlot("day-1"), "production")).toMatch(/njs-resort/);
    expect(slotRefusal(njs, findSlot("welcome"), "production")).toMatch(/hebs-lagos-event/);
    for (const s of MEDIA_SLOTS) expect(s.source).toBe(s.depiction === "real-venue" ? "njs-resort" : "hebs-lagos-event");
    // The Welcome photograph must come from HEBS Lagos 2026 itself.
    expect(findSlot("welcome").eventYear).toBe(2026);
    expect(slotRefusal(lagos, findSlot("welcome"), "production")).toBeNull();
    expect(slotRefusal({ ...lagos, eventYear: 2027 }, findSlot("welcome"), "production")).toMatch(/2026/);
  });

  it("requires recorded permission, and recorded consent before production", () => {
    const a: AssetRecord = {
      id: "t", src: "/x.jpg", alt: "x", eventYear: 2026, edition: "HEBS Lagos 2026", location: "Lagos, Nigeria",
      origin: "hebs-lagos-event", provenance: "hebs-event-photo", status: "approved",
      approval: { by: "test", date: "2026-11-01" },
      rights: { holder: "HEBS", permission: "not-recorded", peopleConsent: "unknown" },
      permittedDepictions: ["real-event"], permittedUsage: ["2027-site"], restriction: "",
    };
    const slot = findSlot("welcome");
    expect(slotRefusal(a, slot, "preview")).toMatch(/permission/);
    const permitted = { ...a, rights: { ...a.rights, permission: "recorded" as const } };
    expect(slotRefusal(permitted, slot, "preview")).toBeNull();
    expect(slotRefusal(permitted, slot, "production")).toMatch(/consent/);
    expect(slotRefusal({ ...permitted, rights: { ...permitted.rights, peopleConsent: "not-obtained" } }, slot, "preview")).toMatch(/consent/);
    expect(slotRefusal({ ...permitted, rights: { ...permitted.rights, peopleConsent: "obtained" } }, slot, "production")).toBeNull();
  });

  it("never lets generated media stand for a real event or venue, even if mislabelled", () => {
    const gen: AssetRecord = { ...findAsset("hero-video-higgsfield"), status: "approved", approval: { by: "t", date: "2026-11-01" },
      origin: "hebs-lagos-event", eventYear: 2026, location: "Lagos, Nigeria", permittedUsage: ["2027-site"],
      rights: { holder: "x", permission: "recorded", peopleConsent: "obtained" } };
    expect(slotRefusal(gen, findSlot("welcome"), "development")).not.toBeNull();
  });

  it("references no HEBS archive image from any 2027 page or component", () => {
    const files = [...walk(join(ROOT, "app/2027")), ...walk(join(ROOT, "components/2027"))].filter((f) => /\.(tsx?|css)$/.test(f));
    expect(files.length).toBeGreaterThan(5);
    for (const f of files) expect(readFileSync(f, "utf8"), f).not.toMatch(/\/images\/hebs-20(24|25)\//);
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

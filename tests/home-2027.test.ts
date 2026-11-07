import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { REVIEW_ASSETS, REVIEW_DIR, findReviewAsset } from "@/lib/assets/home-2027-review";
import { HOME } from "@/lib/content/home-2027";
import { winnersView, type Winner } from "@/lib/content/winners-2026";
import { COMPETITIONS, COMPETITION_COUNT, CATEGORY_COUNT } from "@/lib/competitions";
import { reviewMedia } from "@/components/2027/home/review-media";

const ROOT = join(__dirname, "..");

describe("preferred homepage: review media safeguards", () => {
  it("keeps every review file in the gitignored review folder, for internal review only", () => {
    for (const a of REVIEW_ASSETS) {
      expect(a.src.startsWith(REVIEW_DIR), a.id).toBe(true);
      expect(a.permittedUsage, a.id).toEqual(["internal-review"]);
      expect(a.status, a.id).not.toBe("approved");
      expect(a.rights.permission, a.id).toBe("not-recorded");
    }
    expect(readFileSync(join(ROOT, ".gitignore"), "utf8")).toMatch(/^\/public\/_review\/$/m);
  });

  it("commits none of the review files", () => {
    const tracked = execSync("git ls-files public/_review", { cwd: ROOT, encoding: "utf8" }).trim();
    expect(tracked).toBe("");
  });

  it("never serves review media outside local development", () => {
    for (const a of REVIEW_ASSETS) {
      expect(reviewMedia(a.id, "production"), a.id).toBeNull();
      expect(reviewMedia(a.id, "preview"), a.id).toBeNull();
    }
  });

  it("labels generated and undocumented media as concepts", () => {
    for (const a of REVIEW_ASSETS) {
      if (a.origin === "generated" || a.provenance === "undocumented") expect(a.badge, a.id).toBe("concept");
    }
    expect(findReviewAsset("dest-pool-wide").provenance).toBe("ai-generated");
  });

  it("records no Drive links or file IDs in the public repository", () => {
    const files = [
      join(ROOT, "lib/assets/home-2027-review.ts"),
      ...readdirSync(join(ROOT, "docs/design/2027-home")).filter((f) => f.endsWith(".md")).map((f) => join(ROOT, "docs/design/2027-home", f)),
    ];
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      expect(src, f).not.toMatch(/drive\.google|docs\.google|usercontent\.google/);
      expect(src, f).not.toMatch(/\b1[A-Za-z0-9_-]{25,}\b/);
    }
  });

  it("keeps the networking photographs neutral until the organisers identify the guests", () => {
    for (const id of ["exp-networking-desktop", "exp-networking-phone"]) {
      const a = findReviewAsset(id);
      expect(a.alt).toBe("HEBS Lagos 2026 guests");
      expect(`${a.alt} ${a.location}`).not.toMatch(/American|NJS Royale/);
    }
  });

  it("keeps the 2027 mark provisional", () => {
    const mark = findReviewAsset("mark-2027-a");
    expect(mark.badge).toBe("brand");
    expect(mark.status).toBe("provisional");
  });
});

describe("preferred homepage: copy", () => {
  const text = JSON.stringify(HOME);

  it("uses resort, poolside and terrace language rather than beach wording", () => {
    expect(text).not.toMatch(/beachfront|by the sea|Evenings on the Atlantic/i);
    expect(text).toContain("NJS Royale Beach Resort");
  });

  it("takes its counts from the competition programme", () => {
    expect(HOME.numbers.items.map((i) => i.value)).toEqual(["3", String(COMPETITION_COUNT), String(CATEGORY_COUNT)]);
    expect(COMPETITION_COUNT).toBe(13);
    expect(CATEGORY_COUNT).toBe(7);
  });

  it("shows the NJS terrace, not open sea, in the hero", () => {
    expect(HOME.hero.cards.map((c) => c.media)).toEqual(["hero-card-guest", "hero-card-terrace"]);
  });
});

describe("winners", () => {
  const winner = (over: Partial<Winner> = {}): Winner => ({
    competition: COMPETITIONS[0].name,
    place: "As confirmed",
    name: "Approved name",
    prize: "Approved prize wording",
    photo: "/approved.jpg",
    approved: true,
    approval: { by: "HEBS", date: "2026-12-01" },
    ...over,
  });

  it("shows every competition with placeholders and a count in internal review", () => {
    const v = winnersView("development", []);
    expect(v.visible).toBe(true);
    expect(v.cards.map((c) => c.competition)).toEqual(COMPETITIONS.map((c) => c.name));
    expect(v.cards.every((c) => c.winner === null)).toBe(true);
    expect(v.count).toMatch(/^0 of 13 confirmed/);
  });

  it("hides the block on the public site until an approved winner exists", () => {
    const v = winnersView("production", []);
    expect(v.visible).toBe(false);
    expect(v.count).toBeNull();
    expect(v.cards).toEqual([]);
  });

  it("shows only approved winners on the public site, with no placeholders or count", () => {
    const v = winnersView("production", [winner(), winner({ competition: COMPETITIONS[1].name, approved: false })]);
    expect(v.visible).toBe(true);
    expect(v.cards).toHaveLength(1);
    expect(v.cards[0].winner?.name).toBe("Approved name");
    expect(v.count).toBeNull();
    expect(v.heading).toBe("The 2026 champions");
  });

  it("never shows a winner without a recorded approval", () => {
    const v = winnersView("production", [winner({ approval: undefined })]);
    expect(v.visible).toBe(false);
  });
});

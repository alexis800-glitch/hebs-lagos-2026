/**
 * HEBS Lagos 2026 has taken place. Rendered 2026 pages must not carry active
 * sales language, expired offers or prices for partnerships, or the
 * AI-generated hero media. This scans the source of every rendered 2026 page
 * and component, so a regression fails `npm test`.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..");

// Components that no page renders. They still hold pre-event copy and are left
// untouched; the first test fails if one is ever imported again.
const UNRENDERED = new Set([
  "components/CountdownTimer.tsx",
  "components/TrailerSection.tsx",
  "components/VenueSection.tsx",
  "components/Tickets.tsx",
  "components/WhatsAppButton.tsx",
  "components/PricingGrid.tsx",
  "components/SocialProofBar.tsx",
  "components/SponsorshipGrid.tsx",
  "components/SponsorsVendors.tsx",
  "components/VendorMatrix.tsx",
]);

function sources(dir: string): string[] {
  return readdirSync(join(ROOT, dir)).flatMap((name) => {
    const rel = `${dir}/${name}`;
    if (statSync(join(ROOT, rel)).isDirectory()) {
      return rel === "app/api" || rel === "app/2027" || rel === "components/2027" ? [] : sources(rel);
    }
    return /\.(tsx|ts)$/.test(name) && !UNRENDERED.has(rel) ? [rel] : [];
  });
}

const FILES = [...sources("app"), ...sources("components")];
const read = (f: string) => readFileSync(join(ROOT, f), "utf8");

describe("post-event 2026 copy", () => {
  it("scans the rendered sources, and the unrendered components really are unrendered", () => {
    expect(FILES).toContain("components/Hero.tsx");
    expect(FILES).toContain("app/sponsors/page.tsx");
    for (const f of Array.from(UNRENDERED)) {
      const name = f.split("/").pop()!.replace(".tsx", "");
      const importers = FILES.filter((g) => new RegExp(`from ['"](@/components/|\\./)${name}['"]`).test(read(g)));
      expect(importers, `${f} is imported by ${importers.join(", ")}`).toEqual([]);
    }
  });

  const BANNED = [
    "Register Now", "Register for", "Register to Compete", "hebseventportal.com/register",
    "is LIVE", "Secure Pass", "Secure Your", "Secure your", "Early Bird", "Early bird rates",
    "Limited competition slots", "Limited booth", "deposit required", "Reserve ", "Inquire About",
    "Ready to Partner", "Ready to Exhibit", "Explore Sponsorship Packages", "One slot available",
    "comes home", "InStock",
  ];

  it.each(BANNED)("no rendered 2026 source contains %j", (phrase) => {
    expect(FILES.filter((f) => read(f).includes(phrase))).toEqual([]);
  });

  it("shows no partnership or booth prices", () => {
    for (const f of ["app/sponsors/page.tsx", "app/vendors/page.tsx", "components/PartnershipContact.tsx"]) {
      expect(read(f), f).not.toMatch(/\$\d|₦\d/);
    }
  });

  it("does not use the AI-generated hero video or its posters", () => {
    for (const f of ["components/Hero.tsx", "app/page.tsx"]) {
      expect(read(f), f).not.toMatch(/higgsfield|hebs-hero-competition|<video/);
    }
  });
});

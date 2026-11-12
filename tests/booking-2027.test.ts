/**
 * Staging booking links (lib/integrations/booking-2027.ts): the website links to
 * the private test copy's booking pages and never takes a booking, payment or
 * lookup itself. Staging only; production and the 2026 site are unaffected.
 */
import { afterEach, describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import {
  BOOKING_PATHS, COMPETITION_CODES, COMPETITION_CODE_PARAM, STAGING_DATA_ENV, bookingLink, competitionCodeProblems, stagingOriginRefusal, stagingPortalOrigin,
} from "../lib/integrations/booking-2027";
import { PRIVATE_TEST } from "../lib/forms-2027/private-test.mjs";
import { COMPETITIONS, REGISTRATION_URL } from "../lib/competitions";
import { portalLink } from "../lib/integrations/registration-2027";

const ROOT = join(__dirname, "..");
// A synthetic test-copy origin. Not a real host.
const ORIGIN = "https://hebs-test-copy.example.test";
const STAGING = { VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: PRIVATE_TEST.branch, HEBS_STAGING_PORTAL_ORIGIN: ORIGIN };
// Synthetic codes for the test only (no real code starts with X); the real 13 come from booking contract v1.0.
const FIXTURE = { codes: Object.fromEntries(COMPETITIONS.map((c, i) => [c.slug, `XA${String.fromCharCode(65 + i)}`])), param: "test_code" };
const DEV = `${STAGING_DATA_ENV.param}=${STAGING_DATA_ENV.value}`;
// Public extract of booking contract v1.0 (codes and exact names only), committed.
const FIXTURE_FILE = join(ROOT, "tests/fixtures/booking-contract-v1.0-competitions.json");
// The authoritative contract: private, git-ignored, present only on the project's own machines.
const PRIVATE_CONTRACT = join(ROOT, "docs/integration/hebs-2027-booking-contract-v1.0");
type Extract = { competition_codes_sha256: string; param: string; competitions: { code: string; category_name: string }[] };
const EXTRACT = JSON.parse(readFileSync(FIXTURE_FILE, "utf8")) as Extract;

describe("booking destinations", () => {
  it("point at the test copy's tickets, compete and booking pages", () => {
    expect(BOOKING_PATHS).toEqual({ tickets: "/2027/tickets", compete: "/2027/compete", booking: "/2027/booking" });
    expect(bookingLink("tickets", undefined, STAGING)).toBe(`${ORIGIN}/2027/tickets?${DEV}`);
    expect(bookingLink("booking", undefined, STAGING)).toBe(`${ORIGIN}/2027/booking?${DEV}`);
  });

  it("select the copy's test dataset on every link", () => {
    expect(DEV).toBe("base44_data_env=dev");
    for (const c of COMPETITIONS) expect(new URL(bookingLink("compete", c.slug, STAGING)!).searchParams.get("base44_data_env")).toBe("dev");
  });

  it("never link to the sandbox checkout or carry a preview token", () => {
    const links = [bookingLink("tickets", undefined, STAGING), bookingLink("booking", undefined, STAGING), ...COMPETITIONS.map((c) => bookingLink("compete", c.slug, STAGING))];
    for (const l of links) expect(l).not.toMatch(/\/2027\/pay|_preview_token|token=/);
    expect(stagingOriginRefusal({ ...STAGING, HEBS_STAGING_PORTAL_ORIGIN: `${ORIGIN}/?_preview_token=x` })).toMatch(/origin only/);
  });

  it("send each competition's code to /2027/compete, and nothing without one", () => {
    for (const c of COMPETITIONS) {
      expect(bookingLink("compete", c.slug, STAGING, FIXTURE)).toBe(`${ORIGIN}/2027/compete?test_code=${FIXTURE.codes[c.slug]}&${DEV}`);
    }
    expect(bookingLink("compete", undefined, STAGING, FIXTURE)).toBeNull();
    expect(bookingLink("compete", "not-a-competition", STAGING, FIXTURE)).toBeNull();
    expect(bookingLink("compete", COMPETITIONS[0].slug, STAGING, { codes: FIXTURE.codes, param: null })).toBeNull();
  });
});

describe("competition codes", () => {
  it("must be exactly one unique code for each of the 13 competitions", () => {
    expect(COMPETITIONS).toHaveLength(13);
    expect(competitionCodeProblems(FIXTURE.codes)).toEqual([]);
    expect(competitionCodeProblems({ ...FIXTURE.codes, [COMPETITIONS[0].slug]: "" })).toHaveLength(1);
    expect(competitionCodeProblems({ ...FIXTURE.codes, [COMPETITIONS[1].slug]: FIXTURE.codes[COMPETITIONS[0].slug] })).toContain("codes are not unique");
    expect(competitionCodeProblems({ ...FIXTURE.codes, extra: "X" })).toContain("extra is not a competition");
  });

  it("must be three capital letters", () => {
    expect(competitionCodeProblems({ ...FIXTURE.codes, [COMPETITIONS[0].slug]: "bof" })).toHaveLength(1);
    expect(competitionCodeProblems({ ...FIXTURE.codes, [COMPETITIONS[0].slug]: "BOFX" })).toHaveLength(1);
  });

  it("are exactly the 13 in booking contract v1.0, matched by exact competition name", () => {
    expect(EXTRACT.competitions).toHaveLength(13);
    expect(competitionCodeProblems(COMPETITION_CODES)).toEqual([]);
    expect(COMPETITION_CODE_PARAM).toBe(EXTRACT.param);
    const byName = new Map(EXTRACT.competitions.map((c) => [c.category_name, c.code]));
    for (const c of COMPETITIONS) expect(COMPETITION_CODES[c.slug], c.name).toBe(byName.get(c.name));
    for (const c of COMPETITIONS) expect(bookingLink("compete", c.slug, STAGING)).toBe(`${ORIGIN}/2027/compete?category=${COMPETITION_CODES[c.slug]}&${DEV}`);
  });

  it("the public extract holds codes and names only", () => {
    for (const c of EXTRACT.competitions) expect(Object.keys(c).sort()).toEqual(["category_name", "code"]);
  });
});

// Development only: where the private contract is present, it is unchanged since
// the handoff and the public extract is an exact copy of its codes.
describe.skipIf(!existsSync(PRIVATE_CONTRACT))("the private authoritative contract", () => {
  it("is unchanged since the handoff (SHA256SUMS)", () => {
    expect(execFileSync("shasum", ["-a", "256", "-c", "SHA256SUMS"], { cwd: PRIVATE_CONTRACT, encoding: "utf8" })).not.toMatch(/FAILED/);
  });

  it("matches the public extract exactly", () => {
    const raw = readFileSync(join(PRIVATE_CONTRACT, "competition-codes.json"));
    expect(createHash("sha256").update(raw).digest("hex")).toBe(EXTRACT.competition_codes_sha256);
    const file = JSON.parse(raw.toString("utf8")) as { competitions: { code: string; category_name: string; sort_order: number }[] };
    expect([...file.competitions].sort((a, b) => a.sort_order - b.sort_order).map(({ code, category_name }) => ({ code, category_name }))).toEqual(EXTRACT.competitions);
  });

  it("holds no origin, token or secret; only the placeholder template", () => {
    for (const f of readdirSync(PRIVATE_CONTRACT)) {
      const src = readFileSync(join(PRIVATE_CONTRACT, f), "utf8");
      expect(src, f).not.toMatch(/_preview_token=[A-Za-z0-9]|sk_(test|live)_[A-Za-z0-9]|HEBS_STAGING_PORTAL_ORIGIN=https:\/\/(?!<)/);
    }
  });
});

describe("staging-only origin", () => {
  it("is used only on a Preview of the private test branch", () => {
    expect(stagingPortalOrigin(STAGING)).toBe(ORIGIN);
    expect(stagingOriginRefusal({ ...STAGING, VERCEL_ENV: "production" })).toMatch(/staging-only/);
    expect(stagingOriginRefusal({ ...STAGING, VERCEL_ENV: undefined })).toMatch(/staging-only/);
    expect(stagingOriginRefusal({ ...STAGING, HEBS_CLIENT_PREVIEW: "on" })).toMatch(/staging-only/);
    expect(stagingOriginRefusal({ ...STAGING, VERCEL_GIT_COMMIT_REF: "feat/2027-hos-photography" })).toMatch(/test branch/);
    expect(stagingOriginRefusal({ ...STAGING, HEBS_STAGING_PORTAL_ORIGIN: undefined })).toMatch(/not set/);
  });

  it("must be an https origin only, and never the live portal", () => {
    expect(stagingOriginRefusal({ ...STAGING, HEBS_STAGING_PORTAL_ORIGIN: "http://hebs-test-copy.example.test" })).toMatch(/https/);
    expect(stagingOriginRefusal({ ...STAGING, HEBS_STAGING_PORTAL_ORIGIN: `${ORIGIN}/2027/tickets` })).toMatch(/origin only/);
    expect(stagingOriginRefusal({ ...STAGING, HEBS_STAGING_PORTAL_ORIGIN: `https://user:pw@hebs-test-copy.example.test` })).toMatch(/origin only/);
    expect(stagingOriginRefusal({ ...STAGING, HEBS_STAGING_PORTAL_ORIGIN: "https://hebseventportal.com" })).toMatch(/live portal/);
    expect(stagingOriginRefusal({ ...STAGING, HEBS_STAGING_PORTAL_ORIGIN: `https://${PRIVATE_TEST.liveAppId}.example.test` })).toMatch(/live portal/);
  });
});

describe("closed state", () => {
  const saved = { ...process.env };
  afterEach(() => { for (const k of ["VERCEL_ENV", "VERCEL_GIT_COMMIT_REF", "HEBS_STAGING_PORTAL_ORIGIN"]) { if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; } });

  it("without staging every booking link is closed and the pages say so", async () => {
    delete process.env.HEBS_STAGING_PORTAL_ORIGIN;
    for (const j of ["tickets", "booking"] as const) expect(bookingLink(j)).toBeNull();
    const { TicketsPage } = await import("../components/2027/editorial/inner");
    const html = renderToStaticMarkup(createElement(TicketsPage, { environment: "preview", notes: "inline" }));
    expect(html).not.toMatch(/Buy tickets|Find my booking/);
    expect(html).toMatch(/not open/);
  });

  it("on the test branch Preview, Tickets links to the copy's tickets and booking pages only", async () => {
    Object.assign(process.env, STAGING);
    const { TicketsPage } = await import("../components/2027/editorial/inner");
    const html = renderToStaticMarkup(createElement(TicketsPage, { environment: "preview", notes: "inline" }));
    expect(html).toContain(`href="${ORIGIN}/2027/tickets?${DEV}"`);
    expect(html).toContain(`href="${ORIGIN}/2027/booking?${DEV}"`);
    expect(html).not.toMatch(/<form[^>]*(tickets|booking)|name="card|payment_method/i);
  });

  it("on the test branch Preview, Competitions has one Register link per competition, by contract code", async () => {
    Object.assign(process.env, STAGING);
    const { CompetitionsPage } = await import("../components/2027/editorial/inner");
    const html = renderToStaticMarkup(createElement(CompetitionsPage, { environment: "preview", notes: "inline" }));
    const hrefs = Array.from(html.matchAll(/href="([^"]*\/2027\/compete[^"]*)"/g), (m) => m[1].replace(/&amp;/g, "&"));
    expect(hrefs.sort()).toEqual(Object.values(COMPETITION_CODES).map((code) => `${ORIGIN}/2027/compete?category=${code}&${DEV}`).sort());
  });

  it("without staging, Competitions shows no Register links", async () => {
    delete process.env.HEBS_STAGING_PORTAL_ORIGIN;
    const { CompetitionsPage } = await import("../components/2027/editorial/inner");
    expect(renderToStaticMarkup(createElement(CompetitionsPage, { environment: "preview", notes: "inline" }))).not.toMatch(/\/2027\/compete|>Register</);
  });

  it("Education registration stays closed", () => {
    expect(portalLink("education-registration", "preview")).toBeNull();
    expect(portalLink("education-registration", "production")).toBeNull();
  });
});

describe("the website never writes a booking", () => {
  const walk = (d: string): string[] => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));

  it("has no route that takes bookings or payments; only the two existing form routes", () => {
    const routes = walk(join(ROOT, "app/api")).map((f) => relative(ROOT, f)).sort();
    expect(routes).toEqual(["app/api/contact/route.ts", "app/api/hebs2027/submit/route.ts"]);
  });

  it("never calls the booking pages from code; they are plain links", () => {
    const files = [...walk(join(ROOT, "lib")), ...walk(join(ROOT, "components/2027")), ...walk(join(ROOT, "app"))].filter((f) => /\.(ts|tsx|mjs)$/.test(f));
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      if (!/BOOKING_PATHS|bookingLink|\/2027\/(compete|booking)/.test(src)) continue;
      expect(src, f).not.toMatch(/fetch\(|XMLHttpRequest|sendBeacon/);
    }
  });
});

describe("the local staging origin file", () => {
  it("is git-ignored and never tracked, like the private contract", () => {
    expect(execFileSync("git", ["check-ignore", ".env.hebs2027-booking-staging.local"], { cwd: ROOT, encoding: "utf8" }).trim()).toBe(".env.hebs2027-booking-staging.local");
    expect(execFileSync("git", ["check-ignore", "docs/integration/hebs-2027-booking-contract-v1.0/BOOKING-CONTRACT-v1.0.md"], { cwd: ROOT, encoding: "utf8" }).trim()).not.toBe("");
    expect(execFileSync("git", ["ls-files", "--cached", "docs/integration/hebs-2027-booking-contract-v1.0"], { cwd: ROOT, encoding: "utf8" }).trim()).toBe("");
    expect(execFileSync("git", ["ls-files", "--cached", ".env*"], { cwd: ROOT, encoding: "utf8" }).trim()).toBe("");
  });
});

describe("the 2026 website", () => {
  it("keeps its own registration link and does not use the 2027 booking links", () => {
    expect(REGISTRATION_URL).toBe("https://hebseventportal.com/register");
    const files = [...readdirSync(join(ROOT, "components")).filter((f) => f.endsWith(".tsx")).map((f) => join(ROOT, "components", f)),
      ...readdirSync(join(ROOT, "app/(site)"), { recursive: true }).map((f) => join(ROOT, "app/(site)", String(f))).filter((f) => f.endsWith(".tsx"))];
    for (const f of files) expect(readFileSync(f, "utf8"), f).not.toMatch(/booking-2027|HEBS_STAGING_PORTAL_ORIGIN/);
  });
});

/**
 * Production withholding of the unpublished HEBS 2027 pages and the review media.
 *
 * The middleware must stop every /2027 and /_review request on production before
 * a route renders, so no 2027 copy can reach a 404's HTML, RSC payload or prefetch
 * response. These tests cover the decision and the wiring; a request-level check
 * against a real production build is scripts/check-2027-withheld.mjs.
 */
import { afterEach, describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { NextRequest } from "next/server";
import { config, isWithheld, middleware, middlewareEnvironment, WITHHELD_PATH } from "../middleware";
import { previewStatuses } from "../lib/content/2027";
import { isPagePublishable } from "../lib/publication";

const ROOT = join(__dirname, "..");
const APPROVED = ["approved"] as const;
const PENDING = ["approved", "provisional"] as const;
/** A page load, an RSC request and a router prefetch. */
const REQUEST_TYPES: Record<string, string>[] = [{}, { RSC: "1" }, { RSC: "1", "Next-Router-Prefetch": "1" }];

/** Every URL path the app router serves under /2027, dynamic segments filled in. */
function routes2027(dir = join(ROOT, "app/2027")): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...routes2027(p));
    else if (/^(page|route)\.tsx?$/.test(name)) {
      out.push("/" + relative(join(ROOT, "app"), dir).split("/").map((s) => (s.startsWith("[") ? "sample" : s)).join("/"));
    }
  }
  return out;
}

function run(path: string, init?: { headers?: Record<string, string> }) {
  return middleware(new NextRequest(new URL(path, "https://www.hebslagos.com"), init));
}

const ENV = { ...process.env };
afterEach(() => {
  process.env = { ...ENV };
});

describe("withholding decision", () => {
  it("withholds every 2027 path on production while anything is unapproved", () => {
    for (const p of ["/2027", "/2027/", "/2027/tickets", "/2027/concepts/home", "/2027/brand-study/x"]) {
      expect(isWithheld(p, "production", PENDING), p).toBe(true);
      expect(isWithheld(p, "preview", PENDING), p).toBe(false);
      expect(isWithheld(p, "development", PENDING), p).toBe(false);
    }
  });

  it("opens the 2027 pages on production only together with the layout's gate", () => {
    expect(isWithheld("/2027/tickets", "production", APPROVED)).toBe(false);
    expect(isWithheld("/2027/tickets", "production", PENDING)).toBe(!isPagePublishable(PENDING, "production"));
  });

  it("never serves review media on production, whatever the approvals", () => {
    for (const s of [APPROVED, PENDING]) {
      expect(isWithheld("/_review/home-2027/hair-wide.mp4", "production", s)).toBe(true);
      expect(isWithheld("/_review/home-2027/hair-wide.mp4", "preview", s)).toBe(false);
    }
  });

  it("leaves every other path alone", () => {
    for (const p of ["/", "/competitions", "/tickets", "/privacy", "/20270", "/x/2027", "/_reviewer", "/api/contact"]) {
      expect(isWithheld(p, "production", PENDING), p).toBe(false);
    }
  });

  it("withholds the 2027 site today: the programme is not yet approved", () => {
    expect(isPagePublishable(previewStatuses(), "production")).toBe(false);
  });
});

describe("middleware on a production deployment", () => {
  it("rewrites every 2027 route and review file to a path with no route, for page loads, RSC and prefetch alike", () => {
    process.env.VERCEL_ENV = "production";
    const paths = [...routes2027(), "/2027/not-a-page", "/_review/home-2027/mark-2027-a.png"];
    expect(paths.length).toBeGreaterThan(18);
    for (const p of paths) {
      for (const headers of REQUEST_TYPES) {
        const res = run(`${p}?_rsc=abc&brand=mark`, { headers });
        const target = res.headers.get("x-middleware-rewrite");
        expect(target, `${p} ${JSON.stringify(headers)}`).not.toBeNull();
        const url = new URL(target!);
        expect(url.pathname).toBe(WITHHELD_PATH);
        expect(url.search).toBe("");
      }
    }
  });

  it("passes the 2026 site straight through", () => {
    process.env.VERCEL_ENV = "production";
    for (const p of ["/", "/competitions", "/privacy"]) expect(run(p).headers.get("x-middleware-rewrite"), p).toBeNull();
  });

  it("lets previews through so the protected review keeps working", () => {
    process.env.VERCEL_ENV = "preview";
    for (const p of routes2027()) expect(run(p).headers.get("x-middleware-rewrite"), p).toBeNull();
    expect(run("/_review/home-2027/mark-2027-a.png").headers.get("x-middleware-rewrite")).toBeNull();
  });
});

describe("middleware environment", () => {
  it("follows VERCEL_ENV, and fails closed on Vercel when it is missing", () => {
    expect(middlewareEnvironment({ VERCEL: "1", VERCEL_ENV: "production" })).toBe("production");
    expect(middlewareEnvironment({ VERCEL: "1", VERCEL_ENV: "preview" })).toBe("preview");
    expect(middlewareEnvironment({ VERCEL: "1" })).toBe("production");
    expect(middlewareEnvironment({})).toBe("development");
  });

  it("names both variables literally, so the Edge runtime provides them", () => {
    const src = readFileSync(join(ROOT, "middleware.ts"), "utf8");
    expect(src).toContain("process.env.VERCEL_ENV");
    expect(src).toContain("process.env.VERCEL,");
    expect(src).not.toContain("NODE_ENV");
  });

  it("never treats NODE_ENV as a deployment environment", () => {
    // `next build` and `next start` set NODE_ENV=production for every Vercel
    // deployment, previews included; only VERCEL_ENV tells production apart.
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    delete process.env.VERCEL;
    delete process.env.VERCEL_ENV;
    expect(run("/2027/concepts/home").headers.get("x-middleware-rewrite")).toBeNull();
    process.env.VERCEL = "1";
    process.env.VERCEL_ENV = "preview";
    expect(run("/2027/concepts/home").headers.get("x-middleware-rewrite")).toBeNull();
    expect(run("/_review/home-2027/hair-wide.mp4").headers.get("x-middleware-rewrite")).toBeNull();
    process.env.VERCEL_ENV = "production";
    expect(run("/2027/concepts/home").headers.get("x-middleware-rewrite")).not.toBeNull();
  });
});

describe("middleware wiring", () => {
  it("is matched for the whole 2027 tree and the review folder", () => {
    expect(config.matcher).toEqual(["/2027", "/2027/:path*", "/_review/:path*"]);
    for (const p of routes2027()) expect(p === "/2027" || p.startsWith("/2027/"), p).toBe(true);
  });

  it("rewrites to a path that really has no route", () => {
    const seg = WITHHELD_PATH.slice(1);
    expect(existsSync(join(ROOT, "app", seg))).toBe(false);
    expect(existsSync(join(ROOT, "public", seg))).toBe(false);
  });
});

/**
 * The client design-review preview (HEBS_CLIENT_PREVIEW=on on a preview
 * deployment): the 2027 site as production would show it, every built page
 * open, internal pages, concept studies and review media withheld, nothing
 * tracked or indexed. It can never apply to a production deployment.
 */
import { afterEach, describe, expect, it } from "vitest";
import { clientPreview, deployEnvironment } from "../lib/publication";
import { isWithheld, middlewareEnvironment } from "../middleware";
import { LAUNCH_2027, pageStatuses } from "../lib/launch-2027";
import { SITE_PAGES, linkable } from "../lib/site/2027";
import { pageMetadata } from "../lib/site/seo-2027";

const saved = { env: process.env.VERCEL_ENV, flag: process.env.HEBS_CLIENT_PREVIEW };
function as(env: string | undefined, flag: string | undefined) {
  if (env === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = env;
  if (flag === undefined) delete process.env.HEBS_CLIENT_PREVIEW; else process.env.HEBS_CLIENT_PREVIEW = flag;
}
afterEach(() => as(saved.env, saved.flag));

describe("client design-review preview", () => {
  it("applies only to a preview deployment with the flag on, never to production", () => {
    expect(clientPreview({ VERCEL_ENV: "preview", HEBS_CLIENT_PREVIEW: "on" })).toBe(true);
    expect(clientPreview({ VERCEL_ENV: "production", HEBS_CLIENT_PREVIEW: "on" })).toBe(false);
    expect(clientPreview({ VERCEL_ENV: "preview", HEBS_CLIENT_PREVIEW: "yes" })).toBe(false);
    expect(clientPreview({ VERCEL_ENV: "development", HEBS_CLIENT_PREVIEW: "on" })).toBe(false);
    expect(deployEnvironment({ VERCEL_ENV: "preview", HEBS_CLIENT_PREVIEW: "on" })).toBe("production");
    expect(middlewareEnvironment({ VERCEL: "1", VERCEL_ENV: "preview", HEBS_CLIENT_PREVIEW: "on" })).toBe("production");
  });

  it("opens every built 2027 page and the approved media, and nothing internal", () => {
    as("preview", "on");
    const env = middlewareEnvironment();
    for (const p of SITE_PAGES) {
      expect(isWithheld(p.path, env), p.path).toBe(!p.built);
      expect(linkable(p.id, env), p.id).toBe(p.built);
    }
    expect(isWithheld("/2027/media/hero-card-guest.webp", env)).toBe(false);
    for (const p of ["/2027/review", "/2027/status", "/2027/concepts", "/2027/concepts/logo", "/2027/brand-study", "/2027/homepage",
      "/_review/home-2027/x-hero-card-guest.webp", "/_review/home-2027/guests-wide.mp4"]) {
      expect(isWithheld(p, env), p).toBe(true);
    }
  });

  it("is not indexed and leaves the launch switch and approvals untouched", () => {
    as("preview", "on");
    expect(pageMetadata("home", "production").robots).toMatchObject({ index: false });
    // The flag changes nothing in the launch switch or the approvals it reads.
    expect(LAUNCH_2027.pages).toHaveLength(13);
    expect(pageStatuses("home").every((s) => s === "approved")).toBe(true);
  });

  it("does not open anything on production, whatever the flag", () => {
    as("production", "on");
    const env = middlewareEnvironment({ VERCEL: "1", VERCEL_ENV: "production", HEBS_CLIENT_PREVIEW: "on" });
    const plain = middlewareEnvironment({ VERCEL: "1", VERCEL_ENV: "production" });
    // On production the flag is ignored: every address is answered exactly as without it.
    for (const p of [...SITE_PAGES.map((x) => x.path), "/2027/review", "/2027/brand-study/a", "/_review/home-2027/guests-wide.mp4"]) {
      expect(isWithheld(p, env), p).toBe(isWithheld(p, plain));
    }
    expect(isWithheld("/2027/review", env)).toBe(true);
    expect(isWithheld("/_review/home-2027/guests-wide.mp4", env)).toBe(true);
  });
});

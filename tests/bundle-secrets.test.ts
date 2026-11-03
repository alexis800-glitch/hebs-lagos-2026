/**
 * No secret, setting name or mock credential in the browser bundles. Runs
 * after a build made with a canary secret:
 *   BUNDLE_CANARY=<random> HEBS_PORTAL_FORM_SECRET=$BUNDLE_CANARY HEBS_RATE_LIMIT_REST_TOKEN=$BUNDLE_CANARY npm run build
 *   BUNDLE_CANARY=<same> npx vitest run tests/bundle-secrets.test.ts
 * Skipped when no canary was given.
 */
import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { MOCK_SECRET } from "../lib/forms-2027/config";

const STATIC = join(__dirname, "..", ".next", "static");
const walk = (d: string): string[] => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
const canary = process.env.BUNDLE_CANARY;

describe.skipIf(!canary || !existsSync(STATIC))("browser bundles", () => {
  it("contain no secret, no server setting name and no mock credential", () => {
    const files = walk(STATIC).filter((f) => /\.(js|css|json|html|txt|map)$/.test(f));
    expect(files.length).toBeGreaterThan(10);
    const needles = [canary!, MOCK_SECRET, "HEBS_PORTAL_FORM_SECRET", "HEBS_PORTAL_FORM_URL", "HEBS_PORTAL_APP_ID", "HEBS_RATE_LIMIT", "X-HEBS-Signature", "createHmac", "evSubmitPublicForm"];
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      for (const n of needles) expect(src.includes(n), `${n} in ${f}`).toBe(false);
    }
  });
});

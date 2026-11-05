/**
 * The private end-to-end test switch (Gate C run sheet rev 2, P4 and P5).
 *
 * HEBS_FORMS_MODE=private-test connects the four 2027 forms to the private
 * Base44 test copy, and to nothing else. It works only on a Vercel Preview
 * deployment of PRIVATE_TEST.branch, and only with the copy's exact function
 * URL and app id below. Anywhere else the build fails (privateTestBuildErrors,
 * called from next.config.mjs) and, should a build get through, the route
 * stays off (lib/forms-2027/config.ts).
 *
 * Plain JavaScript so next.config.mjs can import it. No secret lives here: the
 * app id and URL identify the private copy and are in the run sheet (P3).
 */

export const PRIVATE_TEST = Object.freeze({
  /** The only branch whose Preview deployments may run the test. */
  branch: "website/2027-private-e2e-test",
  /** The private Base44 copy (run sheet P3). Never the live app. */
  appId: "6aea5ced633d7df1f4788d9a",
  url: "https://base44.app/api/apps/6aea5ced633d7df1f4788d9a/functions/evSubmitPublicForm",
  /** The live portal app: refused by the test switch in every case. */
  liveAppId: "6a1c6c1750ca9819996e86fb",
  /** Synthetic-only privacy notice (P5). Never a real registration's notice; never in production. */
  noticeVersion: "TEST-ONLY-NOT-D13",
  banner: "TEST ONLY – not the approved HEBS privacy notice",
  bannerDetail:
    "This form sends made-up test details to a private test copy of the HEBS portal. It is not the HEBS privacy notice and is not a registration. Use only made-up details: names and companies starting with TEST, an email address ending in @hebs-e2e.test, and a phone number from +234 800 000 0000 to 0099, if any.",
});

/** Shared secrets published in the contract and the repository: refused for the test (run sheet P2). */
export const PUBLISHED_SECRETS = Object.freeze([
  "synthetic-secret-synthetic-secret-0123456789",
  "mock-secret-synthetic-not-for-use-0123456789abcdef",
]);

/**
 * Reasons this build must not go ahead, or an empty list. A production build
 * with the test switch, the probe or any of the copy's settings fails, as does
 * the test switch on a local build or on any other branch's Preview.
 * @param {Record<string, string | undefined>} env
 * @returns {string[]}
 */
export function privateTestBuildErrors(env) {
  const errors = [];
  const testMode = env.HEBS_FORMS_MODE === "private-test";
  if (testMode && env.VERCEL_ENV !== "preview") {
    errors.push(`HEBS_FORMS_MODE=private-test is allowed only on Vercel Preview, not on ${env.VERCEL_ENV || "a local build"}`);
  }
  if (testMode && env.VERCEL_ENV === "preview" && env.VERCEL_GIT_COMMIT_REF !== PRIVATE_TEST.branch) {
    errors.push(`HEBS_FORMS_MODE=private-test is allowed only on branch ${PRIVATE_TEST.branch}`);
  }
  if (env.HEBS_PRIVATE_TEST_PROBE_TOKEN && !testMode) {
    errors.push("HEBS_PRIVATE_TEST_PROBE_TOKEN is set without HEBS_FORMS_MODE=private-test");
  }
  if (env.VERCEL_ENV === "production") {
    if (env.HEBS_PORTAL_APP_ID === PRIVATE_TEST.appId || (env.HEBS_PORTAL_FORM_URL ?? "").includes(PRIVATE_TEST.appId)) {
      errors.push("a production build points at the private test copy");
    }
    const leaked = Object.entries(env).filter(([, v]) => v === PRIVATE_TEST.noticeVersion).map(([k]) => k);
    if (leaked.length) errors.push(`a production setting carries the test-only notice version: ${leaked.join(", ")}`);
  }
  return errors;
}

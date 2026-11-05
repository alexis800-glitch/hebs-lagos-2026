# HEBS 2027 private end-to-end test: configuration checklist

Prepared 5 Nov 2026 for the Gate C run sheet, revision 2, section 9 (P1 to P8). **Nothing in this list is set yet.** No setting below may be created until its approval is given in writing. Every value is either an exact public identifier (copied from run sheet P3) or a secret that Lex types directly into the provider; Claude Code never sees a secret.

## Where the test runs

| Item | Value |
|---|---|
| Website branch | `website/2027-private-e2e-test` (from `5055340`, the protected staging baseline) |
| Vercel environment | Preview only, **scoped to that branch**. Never "All Preview branches", never Production |
| Portal | the private Base44 copy `6aea5ced633d7df1f4788d9a` only. The live app `6a1c6c1750ca9819996e86fb` is refused in code |
| Access | Vercel Authentication on Preview for the whole test (P6). No share link and no protection-bypass token |

Normal staging (`website/2027-pages-batch-1`) and Production get none of these settings.

## Vercel Preview settings (branch `website/2027-private-e2e-test` only)

| # | Setting | Value | Set by | Approval | Removed at |
|---|---|---|---|---|---|
| 1 | `HEBS_FORMS_MODE` | `private-test` | Lex | P4 / Gary | close-down |
| 2 | `HEBS_PORTAL_FORM_URL` | `https://base44.app/api/apps/6aea5ced633d7df1f4788d9a/functions/evSubmitPublicForm` (exact; any other value keeps the forms off) | Lex | P3 | close-down |
| 3 | `HEBS_PORTAL_APP_ID` | `6aea5ced633d7df1f4788d9a` (exact) | Lex | P3 | close-down |
| 4 | `HEBS_PORTAL_FORM_SECRET` | new staging secret, 32+ random characters, never a published value; marked Sensitive | Lex only, typed in | P2 | close-down |
| 5 | `HEBS_RATE_LIMIT_REST_URL` | REST URL of a new, dedicated test-only Redis-compatible store (Upstash); never the production store. Keys are prefixed `hebs27-e2e:` | Lex | separate approval | close-down; delete the store |
| 6 | `HEBS_RATE_LIMIT_REST_TOKEN` | that store's REST token; Sensitive | Lex only, typed in | same | close-down |
| 7 | `HEBS_RATE_LIMIT_SALT` | 16+ random characters; Sensitive | Lex | same | close-down |
| 8 | `HEBS_PRIVATE_TEST_PROBE_TOKEN` | E0 operator token: 32+ random characters, different from row 4; Sensitive. **For E0 only.** The operator sends it in the `X-HEBS-Probe-Token` header | Lex only, typed in | P8 | straight after E0 |

The secret in row 4 is the one Lex also types into the copy's `EV_FORM_HMAC_SECRET` (P2). The copy's self-test secret is restored at close-down.

Not set, and refused if set, on this branch: `HEBS_FORMS_PRODUCTION_APPROVED`, `HEBS_FORMS_MOCK_UPLOADS`. Uploads, payments and emails have no setting: they are off in code.

Vercel system variables: `VERCEL_ENV` and `VERCEL_GIT_COMMIT_REF` must reach the functions at run time ("Automatically expose System Environment Variables", on by default). If either is missing, the forms stay off. That is safe, but the test cannot run.

## What the code enforces

| Rule | Build (`next.config.mjs`) | Run time (`lib/forms-2027/config.ts`, `handler.ts`) |
|---|---|---|
| `private-test` on Production | build fails | off |
| `private-test` on a local build or any other branch, including normal staging | build fails | off |
| Production setting pointing at the copy, or carrying `TEST-ONLY-NOT-D13` | build fails | — |
| `HEBS_PRIVATE_TEST_PROBE_TOKEN` without `private-test`, or on Production | build fails | probe 404 |
| Probe without the right `X-HEBS-Probe-Token`, or with a token that is short, equal to the secret, or published | — | 404; nothing called, nothing written |
| URL or app id other than the copy's, or the live app id | — | off |
| Secret missing, under 32 characters, or a published synthetic one | — | off |
| No REST store, or salt under 16 characters | — | off |
| Anything outside the synthetic identity convention: names and companies not starting `TEST `, email not `@hebs-e2e.test`, phone outside `+234 800 000 0000–0099`, website not on `hebs-e2e.test`, social handle not starting `TEST` | — | refused field by field, nothing sent |
| `TEST-ONLY-NOT-D13` in any other mode | module-load check | refused, nothing sent |
| Company profile upload | — | no control rendered, `uploads: false` |
| `CONTRACT.final`, `FORMS_OPEN` | unchanged: `false`, all closed | — |

## Pre-test checks (read-only, recorded as evidence)

1. **Production env.** It contains none of rows 1–8, and `HEBS_PORTAL_*` is unset (setting names only, no values).
2. **Normal staging.** Branch `website/2027-pages-batch-1` contains none of rows 1–8. Its `/2027/exhibitors` page shows "Opens soon", and its submit route answers 404.
3. **Test branch access.** An anonymous request to the test branch's Preview gets the sign-in redirect (302).
4. **Store isolation.** The rate-limit store is new and test-only, and is not connected to Production. If it is added through a Marketplace integration, it may inject `KV_REST_API_*` into every environment. Untick Production, or use rows 5–6 instead.
5. **P1 and P7.** The copy has the test-only 2027 Edition (P1). Its forms stay closed until P7.

## Decisions recorded (Gary, 5 Nov 2026)

- **Secret name.** It stays `HEBS_PORTAL_FORM_SECRET`, scoped only to this branch's Preview, with a new staging-only secret. The production secret (A3) is separate and untouched.
- **E9 wording.** Approved as "This form is not open yet. Nothing was saved."
- **E0 probe.** It uses the existing submit route and needs the operator token in row 8, checked on the server. Same-origin and Vercel Authentication alone are not enough.
  - Without the right token, or outside this configuration, it answers 404.
  - It writes nothing: no portal record, and not even a rate-limit count.
  - The token is never in a browser bundle (bundle-secrets test).
- **Rate-limit store.** A dedicated test-only store, not provisioned yet. Production never shares its credentials, and test-mode keys use their own prefix, `hebs27-e2e:`.

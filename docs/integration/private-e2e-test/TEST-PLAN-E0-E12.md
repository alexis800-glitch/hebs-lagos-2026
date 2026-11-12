# HEBS 2027 private end-to-end test plan: E0 to E12

Follows the Gate C run sheet, revision 2, section 9. The test runs between the website's test branch Preview (`website/2027-private-e2e-test`) and the private Base44 copy `6aea5ced633d7df1f4788d9a`. It never touches the live portal, production or real people. Settings are in `CONFIGURATION-CHECKLIST.md`.

**Not started.** Each step below waits for its approval.

## Rules for the whole test

- **Synthetic identities only.**
  - Names and companies start with `TEST ` (capitals, then a space).
  - Emails use `@hebs-e2e.test`.
  - Phone numbers, if any, are from `+234 800 000 0000` to `0099`.
  - Websites, if any, are on `hebs-e2e.test`; social handles, if any, start with `TEST`.
  - No real name, address, company or social handle.
  - The website's server refuses anything outside this convention in test mode, field by field, before anything is sent.
- **No uploads, payments or emails.** The website renders no upload control and has no payment or email code on this path.
- **Every record carries the test notice.** The privacy notice version is `TEST-ONLY-NOT-D13`, and the banner "TEST ONLY – not the approved HEBS privacy notice" is visible on every form.
- **Evidence.** Each case gets:
  - a screenshot of the website answer;
  - the website log lines for the case;
  - the copy's admin view, recorded by Claude Desktop;
  - all kept in one dated folder for Gary.
- **Which dataset (open question, hold before E2).** The forms go server to server to `evSubmitPublicForm`, which has no `base44_data_env` link parameter. Booking contract v1.0 does not say whether these calls write to the copy's main data or its test (`dev`) data.
  - Before E2, Claude Desktop states which dataset they write to.
  - Every admin check for E2 to E12 then reads that same dataset.
  - A record found in the other dataset stops the test.
- **Never submit the 2026 contact form on the Preview.** It sends real email while `RESEND_API_KEY` reaches Preview (configuration checklist, pre-test check 6).
- **Any unexpected answer stops the test.** The forms are closed and the result is reported.

## Order and hold points

| Step | Needs | Done by |
|---|---|---|
| Pre-flight: checklist pre-test checks 1–5 | P1, P2, P3, P6 met | Claude Code (website), Claude Desktop (copy) |
| E1 | nothing live | Claude Code |
| E0 | P8: operator token set (checklist row 8), forms still closed | Claude Code; Lex removes the token after |
| **Hold: Gary reviews E0** | | |
| Open the forms | P7: `EV_ALLOW_PUBLIC_OPEN=yes` on the copy; an admin opens the four forms with a reason | Lex approves; Claude Desktop |
| E2 to E9 | forms open | Claude Code drives the website; Claude Desktop reads the copy |
| E10, E11 | — | Claude Code |
| E12 | forms closed again | Claude Desktop |
| Close-down | | see the end |

## Cases

| # | Case | Steps (synthetic data) | Pass | Evidence |
|---|---|---|---|---|
| E0 | Reachability from the Preview server (P8) | While signed in to the Preview, send `POST /api/hebs2027/submit` with `{"probe":"reachability"}` from the page's own origin, with the operator token in the `X-HEBS-Probe-Token` header. Without it, the route answers 404. The server sends one unsigned request, and one signed request with no form fields, which can never be stored. | `unsigned` 401 `unauthorized`. `signed` 403 `not_open` (test Edition present, forms closed), or 400 `unknown_edition` before P1. Matches the run sheet table. | JSON answer, log lines, copy's function log |
| E1 | 21 contract vectors, no network | `npx vitest run tests/forms-2027.test.ts` on the test branch | 21/21 vectors and the worked-example signature | test output |
| E2 | Priority, with country and interest | TEST Priority One, `p1@hebs-e2e.test`, Nigeria, Attendee | Reference `H27-PRI-…` shown; the copy's admin page shows the record with `TEST-ONLY-NOT-D13` | screenshot, admin row |
| E3 | Priority without country or interest | Clear country, then interest | Field errors on the page; nothing sent (no log line with a portal status); no record in the copy | screenshot, log, admin count |
| E4 | Sponsor, each partnership type | Four sends: TEST Sponsor A–D, `sa@`…`sd@hebs-e2e.test`, one each of Sponsorship, Exhibition, Brand activation, Strategic partnership; tier left empty on two | Four `H27-SPN-…` references; the copy stores each `partnership_interest` exactly, with `tier_interest` separate | screenshots, admin rows |
| E5 | Exhibitor | TEST Exhibitor One, `e1@hebs-e2e.test`, products "TEST combs" | No upload control on the page; reference `H27-EXH-…` | screenshot (whole form), admin row |
| E6 | Enquiry | TEST Enquiry One, `q1@hebs-e2e.test`, topic and a short message | Reference `H27-ENQ-…` | screenshot, admin row |
| E7 | Double click, then refresh and resend | Enquiry, TEST Enquiry Two: double-click Send. Then submit the same details again after a refresh. | One record and the same reference both times. A second click while sending is ignored. After the refresh, the same details from the same tab reuse the saved attempt id, so the copy gets the same `client_request_id` and answers with the first reference. This holds for an hour, the life of the server-side id. | log lines with the same `client_request_id`, one admin row |
| E8 | Same email twice on priority | Repeat E2's email with a new name | "You are already on the HEBS 2027 priority list." No reference shown; still one record | screenshot, admin count |
| E9 | A form closed by the admin | Admin closes the sponsor form, then send TEST Sponsor E | "This form is not open yet. Nothing was saved."; no record. See the E9 wording note in the checklist. | screenshot, admin count |
| E10 | Retry on 503 busy and audit_failed | CI stub, no network: `npx vitest run tests/forms-2027.test.ts -t "busy\|audit_failed\|same client_request_id"` | One retry at most, the same `client_request_id`, waiting `retry_after_s` (1–60, inline up to 5 s) | test output |
| E11 | Website logs | Vercel runtime logs for the test window, filtered on `[hebs2027-forms]` | Each line holds only form, outcome, portal status and `client_request_id`: no name, email, phone, message, IP or secret | exported log lines |
| E12 | Copy reconcile, dry run | Claude Desktop runs the copy's reconcile in dry-run mode after the forms are closed | Nothing from this test is flagged; every test record is accounted for by its reference | reconcile report |

## Close-down (same day)

1. The admin closes all four forms in the copy, and `EV_ALLOW_PUBLIC_OPEN` is deleted (Lex / Claude Desktop).
2. Lex removes checklist rows 1–8 from Vercel Preview, deletes the test-only store, and restores the copy's self-test secret.
3. Claude Code confirms that the test branch's Preview shows "Opens soon" again (forms off), and that production and normal staging are unchanged.
4. Test records stay in the private copy, marked by `TEST-ONLY-NOT-D13` and the `TEST` names. Removing them is the copy owner's decision.
5. The evidence folder goes to Gary for sign-off. The test branch is not merged into `master`.

# HEBS 2027 booking acceptance checklist (private test copy)

Prepared 12 Nov 2026 from booking contract v1.0 and handoff annex A. The contract is kept privately, outside Git, and is checked with its `SHA256SUMS`. Only its codes and exact names are public (`tests/fixtures/booking-contract-v1.0-competitions.json`). **Not started.** Each step waits for its approval, like the E0–E12 forms plan (`TEST-PLAN-E0-E12.md`), which runs first.

## Scope

- **The website:** the test branch Preview `website/2027-private-e2e-test`, signed in through Vercel Authentication. There is no share link and no bypass token.
- **The booking system:** the private Base44 copy, **test dataset (`dev`) only**.
- **Never involved:** the live portal, production, the copy's main data, real people, real payments or real messages.

The website only links to the portal. It takes no booking, payment or lookup itself, and never links to the sandbox checkout. Every link carries `base44_data_env=dev`:

| Journey | Website link | Destination |
|---|---|---|
| Buy tickets | Tickets page, "Buy tickets" | `<origin>/2027/tickets?base44_data_env=dev` |
| Competition registration | Competitions page, "Register" beside each competition | `<origin>/2027/compete?category=<CODE>&base44_data_env=dev` |
| My booking | Tickets page, "Find my booking" | `<origin>/2027/booking?base44_data_env=dev` |
| Education registration | Education page | stays "Opens soon" |

`<origin>` is `HEBS_STAGING_PORTAL_ORIGIN`.

The 13 codes are BOF, FDB, FFR, FFB, FBA, TBC, FLF, MKP, LSH, NAL, FRW, TOC and LRS. The website matches each to its competition by exact name, checked against the public extract by `tests/booking-2027.test.ts`.

## Two datasets: keep them apart

| | Test data (`base44_data_env=dev`) | Main data (no parameter) |
|---|---|---|
| Booking | open | off: pages say "not open" |
| Payments | `sandbox` | off |
| Used by this checklist | yes, for every case | only in B0, to confirm it stays closed |

- Every admin check reads the **test** dataset.
- A test booking found in the main data stops the test.

## Rules

- **Synthetic identities only:**
  - names starting `TEST `;
  - emails `@hebs-e2e.test`;
  - phones `+234 800 000 0000`–`0099`.
- **Payments:**
  - Use only the portal's sandbox checkout, reached from inside the booking journey. Its success and failure buttons send a signed backend event.
  - No card is involved, and Stripe test keys are not needed for this pass (blocker T1).
  - Live payments are refused in code. Any live key or live charge stops the test.
- **Preview token:**
  - Lex opens the copy from the Base44 editor, which issues a short-lived `_preview_token`, in the same browser before following the website's links.
  - The token is never typed into the website, Vercel, Git, the evidence folder or any report.
  - If the portal pages refuse a visitor who arrives from the website link without the token, **stop and report**. Do not add a token to any link.
- **No real messages:**
  - Notifications go to the copy's outbox only.
  - Never submit the 2026 contact form on the Preview: it sends real email while `RESEND_API_KEY` reaches Preview (configuration checklist, pre-test check 6).
- **No 2026 data:** 2027 entities only (`EvAttendee`, `EvContestant`, `EvPayment`, `EvCheckIn`). Claude Desktop confirms 2026 record counts and `CheckInEvent` are unchanged at the end.
- **Evidence for every step:**
  - screenshots of the website and the portal page, with the address bar visible;
  - the reference;
  - the admin view (test dataset), recorded by Claude Desktop.
  - All of it goes in one dated folder.
  - Screenshots must not show a preview token: crop it, or use the page after the redirect.
- **Any unexpected answer stops the test.**

## Contract values the cases check

- **Booking reference:** `^H27-(TKT|CMP)-[2-9A-HJKMNP-Z]{6}$`. Payment records are `H27-PAY-…`. The 6 characters never include 0, 1, I, L or O.
- **Ticket status:** `Reserved`, then `Confirmed` (on verified payment) or `Cancelled`.
- **Competition status:** `Applied`, then `Approved` (on verified payment). It can also be `Waitlisted`, `Rejected` or `Withdrawn`.
- **Booking `payment_status`:** `Pending`, `Paid`, `Failed`, `Cancelled` or `Refunded`.
- **Payment record (`EvPayment.status`):** `Pending`, `Verified`, `Failed`, `Cancelled` or `Refunded`. The method is `sandbox_test`.
- **QR token:** `^H27-(TKT|CMP)-[2-9A-HJKMNP-Z]{6}\.[0-9a-f]{24}$`. It is issued only when Paid and Confirmed (ticket) or Approved (competition).
- **Check-in results:**
  - `Admitted`
  - `Duplicate Same Day`
  - `Refused — Unpaid`
  - `Refused — Not Approved`
  - `Refused — Cancelled`
  - `Refused — No Days Left`
  - `Refused — Not An Event Day`
  - `Refused — Invalid Pass`
- **Catalogue:** the prices, places and tiers expected in the test data are in the private contract, section 6. Early Bird is not bookable while its end date is pending. Competitions are ₦50,000 each, NGN only, Individual entry only.

## Preconditions (hold until all are met)

| # | Precondition | Who | State |
|---|---|---|---|
| P-B1 | Booking contract v1.0 handed over and checked | Claude Desktop, Claude Code | **done:** `SHA256SUMS` OK, codes recorded |
| P-B2 | Codes and the `category` parameter recorded in `lib/integrations/booking-2027.ts` | Claude Code | **done** (dry run, uncommitted) |
| P-B3 | `HEBS_STAGING_PORTAL_ORIGIN` set in Vercel, Preview scope of the test branch only (configuration checklist row 9) | Lex, typed in | open |
| P-B4 | The copy's test dataset has booking open and payments `sandbox`. The main data stays off. Rehearsal mode is available for check-in | Claude Desktop | open (reported in annex A) |
| P-B5 | `RESEND_API_KEY` and `RESEND_FROM` limited to Production, or the no-contact-form rule acknowledged | Lex approves | open |
| P-B6 | The dry run committed to the test branch and pushed, and its Preview built | Lex approves | open |

## Cases

| # | Case | Steps | Pass | Evidence |
|---|---|---|---|---|
| B0 | Links only on the test Preview; main data closed | (a) Open Tickets and Competitions on the test Preview, on normal staging and on the client preview. (b) Open `<origin>/2027/tickets` without `base44_data_env` | (a) Links appear only on the test Preview. Elsewhere: "Ticket sales are not open" and no Register links. Production `/2027` is 404. (b) The portal says "not open" | screenshots |
| B1a | Access without a token | In a new private window that has never opened the copy, follow "Buy tickets" from the test Preview | Record exactly what the copy shows: its page, or a Base44 sign-in or preview-access wall. Either way the website link carries no token. A wall here is **expected** for an unpublished copy: record it as the access limitation and do not work around it | screenshot, address bar |
| B1 | Destinations | In Lex's browser, after opening the copy from the Base44 editor (Rules, "Preview token"), follow "Buy tickets", "Find my booking", and "Register" for each of the 13 competitions | Each lands on the copy's page with `base44_data_env=dev` in the address. Each Register link preselects its competition by exact name. No link goes to `/2027/pay`. Nothing carries a token. If the pages refuse access even here, **stop**: the links cannot reach the copy without a token, and the result goes to Lex (options: publish the copy, or another access method; neither is assumed) | screenshots, URL list |
| B2 | Ticket reservation | TEST Buyer One, `b1@hebs-e2e.test`: 1-Day Pass, Standard, quantity 2. Check that Early Bird is not offered | Reference matches `H27-TKT-…`. Status `Reserved`, `payment_status` `Pending`. No QR pass. The website shows nothing of it | portal screenshot, admin row |
| B3 | Sandbox payment, success | From B2's portal page, continue to the sandbox checkout and press its **success** action | `EvPayment` `H27-PAY-…`, method `sandbox_test`, `Verified`. Booking `Paid` and `Confirmed`. The page waits for the backend event instead of trusting the redirect | portal screenshot, admin rows |
| B4 | Sandbox payment, failure | TEST Buyer Two, `b2@hebs-e2e.test`, 2-Day Pass. Press the sandbox **failure** action | `payment_status` `Failed`, still `Reserved`. No QR pass; the booking can be paid again | screenshots, admin row |
| B5 | Payment abandoned | TEST Buyer Three, `b3@hebs-e2e.test`, 3-Day All-Inclusive. Close the tab at the checkout | Stays `Reserved` / `Pending`; no QR pass | admin row |
| B6 | Duplicate protection | Resend B2's attempt (refresh and resubmit). Then a new reservation with B2's email for the 1-Day Pass | Resend: the same reference. New one: refused, because one reservation per email and ticket type is already open | screenshots, admin count |
| B7 | QR pass | Open B3's pass on the portal's `/2027/booking` | Token matches the QR regex, and its reference is B3's. No pass for B4 or B5. The website never shows a pass | screenshot, decoded token (hex part may be redacted) |
| B8 | My booking lookup | "Find my booking", then B3's reference and email. Repeat with the wrong email, then the wrong reference | The correct pair shows B3 as Paid with its pass. A wrong pair reveals nothing | screenshots |
| B9 | Competition registration | TEST Competitor One, `c1@hebs-e2e.test`: BOF, then NAL, through each Register link. Pay BOF with sandbox success; leave NAL unpaid | ₦50,000 each, NGN only, Individual only, no USD accepted. `H27-CMP-…` references. BOF `Paid` and `Approved` with a pass; NAL `Applied` and `Pending`. A second BOF application with the same email is refused | screenshots, admin rows |
| B10 | Check-in | In the copy's 2027 check-in page (contract section 2), as a scanner, with Rehearsal mode on (2027 event days are pending): `verify` and then `admit` B3's pass; admit B3 again; admit B9's BOF pass; then admit B3's token with one hex character changed | B3 admits 2 (quantity 2), then `Duplicate Same Day`. BOF gives `Admitted`. The altered token gives `Refused — Invalid Pass`. Unpaid bookings (B4, B5, NAL) have no pass to scan. Rows go to `EvCheckIn` only | check-in screenshots, admin rows |
| B11 | Admin verification | Claude Desktop reviews the copy's 2027 admin (test dataset) | Every B-case record is present with the statuses above and an audit trail. The outbox holds the notifications, with nothing sent. Nothing appears in the main data | admin export (references only) |
| B12 | Isolation | After the run | 2026 counts and `CheckInEvent` unchanged. No email, SMS or WhatsApp sent. Payment methods are `sandbox_test` only. Website logs hold no personal data, token or origin beyond the links | counts, outbox and log extracts |

## Close-down

1. `HEBS_STAGING_PORTAL_ORIGIN` is removed from the test branch's Preview, unless the next run follows straight away.
2. Lex closes the Base44 editor session, which ends the preview token. Rehearsal mode is turned off.
3. Test bookings stay in the copy's test dataset, marked by their `TEST` names. Removing them is the copy owner's decision.
4. The evidence folder goes to Gary. The test branch is not merged into `master`.

# HEBS 2027 public forms: website ↔ portal interface contract v1.0

Status: **v1.0 for website implementation** (revision 1, 3 Nov 2026: adds the `edition_misconfigured` 503 below; no change to requests or signing). Implemented on the portal side by `evSubmitPublicForm` (tested locally; being tested in the private Base44 test copy; not on the live portal). Nothing is live until the owner approves deployment AND opens each form.

Companion files (same folder): `hebs-2027-form-request.schema.json`, `hebs-2027-form-response.schema.json` (JSON Schema 2020-12) and `hebs-2027-form-test-vectors.json` (11 signed vectors with expected results, produced by running the portal's own code).

## Parties
- **Website**: hebslagos.com, Next.js on Vercel (built with Claude Code). Owns the public pages and form UI.
- **Portal**: hebseventportal.com, Base44 (Claude Desktop sole developer). Owns storage, references, admin.

## Transport
- Browser → Next.js route handler on the website's own server (`POST /api/hebs2027/submit`). The browser never calls Base44.
- Next.js → Base44 function `evSubmitPublicForm`, server-to-server only, HTTPS POST, JSON body, UTF-8, max 20 KB.
- Endpoint URL: `https://<portal host>/api/apps/<app id>/functions/evSubmitPublicForm`, given to the website as server env `HEBS_PORTAL_FORM_URL` at deployment (staging points at the private test copy; production only after approval).
- Also send header `X-App-Id: <app id>` (env `HEBS_PORTAL_APP_ID`). Send no `Authorization` header: the website is not a portal user.

## Authentication (HMAC)
- Shared secret `EV_FORM_HMAC_SECRET`, at least 32 random bytes, set in the Base44 function secrets AND the Vercel server env (`HEBS_PORTAL_FORM_SECRET`). Never in client code, never in `NEXT_PUBLIC_*`.
- Headers on every call:
  - `X-HEBS-Timestamp`: Unix seconds, now.
  - `X-HEBS-Signature`: lowercase hex of `HMAC-SHA256(secret, "<timestamp>.<raw body string>")`, computed over the exact bytes sent.
- Portal refuses (401) a bad signature, a changed body, or a timestamp more than 300 s from portal time. No secret configured on the portal → 503.

## Request body
```json
{ "form": "priority" | "sponsor" | "exhibitor" | "enquiry",
  "edition": "2027",
  "client_request_id": "<UUID v4, generated once per submission attempt on the website server>",
  "website": "",
  "data": { ... } }
```
`website` is a honeypot: the form renders a hidden input with this name; any non-empty value gets 202 and nothing is stored.

| form | required | optional (max length) | enums |
|---|---|---|---|
| priority | full_name (200), email (200) | phone 40, country 100, city 100, company 200, interest, category_interest 200, utm_source/medium/campaign 100, consent_marketing (boolean true only if the box was ticked), consent_version 40 | interest: Attendee, Contestant, Sponsor, Exhibitor, Media, Other |
| sponsor | company_name, email | contact_person, phone, tier_interest 60, budget_range 60, message 2000 | |
| exhibitor | business_name, email | contact_person, phone, business_category 100, product_service 1000, booth_requirement 60 | |
| enquiry | name, email, message | phone, subject 200 | |

The portal ignores every other field (status, reference, edition overrides, payment fields, is_test).

## Responses
| HTTP | body | website should |
|---|---|---|
| 201 | `{ "reference": "H27-PRI-7K3QX9" }` | show the reference as confirmation |
| 200 | `{ "reference": "...", "duplicate": true }` | same `client_request_id` was already accepted: show that reference |
| 200 | `{ "already_registered": true }` | priority form only: this email is already registered for 2027; show a neutral "you're already on the list" message (no reference is revealed) |
| 202 | `{ "accepted": true }` | honeypot tripped: show the normal thank-you |
| 400 | `{ "error": "missing_field" | "invalid_email" | "client_request_id_required" | "unknown_form" | "unknown_edition" | "invalid_json" }` | show a field error; do not retry unchanged |
| 401 | `{ "error": "unauthorized" }` | log server-side; show a generic error |
| 403 | `{ "error": "not_open" }` | form is closed: show "opens soon" |
| 413 / 500 / 503 | `{ "error": ... }` (503 includes `not_configured` and `edition_misconfigured`) | retry once after 2 s with the SAME `client_request_id`, then show a generic error |

## Behaviour guarantees (portal)
- Records go only to 2027 entities, with a server-made reference (`H27-PRI-`, `-SPN-`, `-EXH-`, `-ENQ-` + 6 characters, no 0/O/1/I/L). 2026 records are never read or written, and `edition: "2026"` is always refused with 400 `unknown_edition`.
- Idempotent on `client_request_id`; one priority registration per email per edition.
- No email is sent and no payment starts in v1.0. Confirmation emails are a later, separately approved change.
- Each form is closed unless its Edition flag is on AND the portal deployment switch `EV_ALLOW_PUBLIC_OPEN=yes` is set.

## Website obligations
- Rate-limit by IP on the Next.js route (suggest 5 per 10 minutes) and validate fields before calling.
- Generate `client_request_id` on the server when the submission first arrives; reuse it on retry.
- Never log the secret, signature or full request body; log the HTTP status and `client_request_id` only.
- Show the privacy notice and an unticked marketing-consent box; send `consent_marketing: true` only when ticked, with the notice version.

## Test vectors
Full set with expected status codes: `hebs-2027-form-test-vectors.json`. The first one:

Secret `synthetic-secret-synthetic-secret-0123456789`, timestamp `1793750400`, body
`{"form":"priority","edition":"2027","client_request_id":"6f1c2a9e-4b7d-4c3e-9a1f-2d8e5b7c0a14","website":"","data":{"full_name":"Synthetic Person","email":"person@synthetic.test"}}`
→ signature `bd3f37d33d4fa04120ae35e8cd4a7bf53e551371d96d7827fcd7a044c138a890`.

## Implementation notes for the website
- Sign the exact string you send. Serialise once (`const raw = JSON.stringify(body)`), sign `${ts}.${raw}`, and send `raw` as the body. Do not let the HTTP client re-serialise.
- Compare nothing on the website side; the portal does all verification. Use a 10 s request timeout.
- `edition` is always the string `"2027"` for this site.
- Field names are snake_case exactly as in the request schema; unknown fields are ignored by the portal but rejected by the schema, so validate with the schema before sending.
- Staging and production use different secrets. Neither is ever committed to the repo.

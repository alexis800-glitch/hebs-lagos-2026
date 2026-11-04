# HEBS 2027 public forms: website ↔ portal interface contract v1.1

Status: **v1.1, for review (Gate A)**. Supersedes v1.0. Implemented on the portal side by `evSubmitPublicForm` v1.1 and `evAdmin` (companyProfileLink). It is tested locally and in the private Base44 test copy, and is not on the live portal. Every form stays closed until the owner approves deployment AND opens each form (section 9).

Companion files (same folder):
- `hebs-2027-form-request.v1.1.schema.json` and `hebs-2027-form-response.v1.1.schema.json` (JSON Schema 2020-12).
- `hebs-2027-form-test-vectors.v1.1.json`: 15 signed vectors, each produced by running the portal's own code.

## Changes from v1.0

| # | Owner decision | v1.0 behaviour | v1.1 behaviour |
|---|---|---|---|
| 1 | Priority interests follow the directive | Attendee, Contestant, Sponsor, Exhibitor, Media, Other; an unknown value was silently changed to Other | Attendee, **Competitor**, **Educator**, Sponsor, Exhibitor, Media, Other. Any other value → 400 `invalid_value`. "Contestant" is no longer accepted |
| 2 | Sponsor prospectus request | not supported | optional `prospectus_requested` (boolean), recorded on the record. No email is sent in v1.1 |
| 3 | Exhibitor company-profile upload | not supported | optional `company_profile` PDF, max 3 MB, held in Base44 private storage, opened by staff only through a 5-minute signed link that is audited (section 6) |
| 4 | Privacy acknowledgement distinct from marketing consent | priority form only, consent only | every form: `privacy_acknowledged: true` + `privacy_notice_version` **required**; `consent_marketing` + `consent_version` optional and separate |
| 5 | Approved country, website and social fields not silently discarded | country on priority only; unknown fields silently dropped; over-long values silently cut | `country` on all four forms; `website_url` and `social_media` on priority, sponsor and exhibitor. Unknown field, over-long value or wrong type → 400 naming the field. Nothing is dropped silently |

Also in v1.1:
- `edition: "2026"` is always refused (from v1.0 revision 1).
- The two published synthetic secrets are refused on any deployment except the private test copy.
- The v1.0 response schema could not tell 201 apart from the 200 duplicate. That is fixed.

## 1. Parties
- **Website**: hebslagos.com, Next.js on Vercel (built with Claude Code). It owns the public pages and the form UI.
- **Portal**: hebseventportal.com, Base44 (Claude Desktop is the sole developer). It owns storage, references and admin.

## 2. Transport
- The browser posts to a Next.js route handler on the website's own server (`POST /api/hebs2027/submit`). The browser never calls Base44.
- Next.js calls the Base44 function `evSubmitPublicForm` server-to-server only, by HTTPS POST with a UTF-8 JSON body.
- Endpoint: `https://<portal host>/api/apps/<app id>/functions/evSubmitPublicForm`. It reaches the website as the server env `HEBS_PORTAL_FORM_URL` at deployment, and is left unset until then.
- Header `X-App-Id: <app id>` (env `HEBS_PORTAL_APP_ID`). No `Authorization` header: the website is not a portal user.
- Size limits:
  - 20,000 bytes for any request without a file.
  - 4,200,000 bytes for an exhibitor request carrying a company profile.
  - A larger request → 413 `too_large`.
  - Vercel limits a function's incoming request to 4.5 MB, so the browser-to-website upload of a 3 MB PDF fits.

## 3. Authentication (HMAC)
- Shared secret: at least 32 random bytes. Base44 holds it as `EV_FORM_HMAC_SECRET`; Vercel holds it as server env `HEBS_PORTAL_FORM_SECRET`, Production scope only. Never in client code, a `NEXT_PUBLIC_*` variable, the repository, a ticket or chat.
- Headers on every call:
  - `X-HEBS-Timestamp`: Unix seconds, now.
  - `X-HEBS-Signature`: lowercase hex of `HMAC-SHA256(secret, "<timestamp>.<raw body string>")`, computed over the exact bytes sent.
- The portal refuses with 401 `unauthorized`:
  - a bad signature;
  - a body changed after signing;
  - a timestamp more than 300 s from portal time.
- The portal refuses with 503 `not_configured`:
  - no secret, or one shorter than 32 characters;
  - either published synthetic secret, outside the private test copy.

## 4. Request body
```json
{ "form": "priority" | "sponsor" | "exhibitor" | "enquiry",
  "edition": "2027",
  "client_request_id": "<UUID v4, generated once per submission attempt on the website server>",
  "website": "",
  "data": { ... } }
```
- `website` is a honeypot. The form renders a hidden input with this name; any non-empty value gets 202 and nothing is stored.
- No other top-level keys are allowed.
- `data` may contain only the fields below for its form. Empty strings and `null` count as "not given".

Fields on every form:

| field | type | rule |
|---|---|---|
| `privacy_acknowledged` | boolean | **required, must be `true`**. Missing or false → 400 `privacy_ack_required` |
| `privacy_notice_version` | string ≤ 40 | **required**, e.g. `"2027-01"` |
| `consent_marketing` | boolean | optional; `true` only if the marketing box was ticked |
| `consent_version` | string ≤ 40 | required when `consent_marketing` is `true` |
| `country` | string ≤ 100 | optional |

Per form (* = required):

| form | fields (max length) |
|---|---|
| priority | full_name* 200, email* 200, phone 40, city 100, company 200, interest (Attendee \| Competitor \| Educator \| Sponsor \| Exhibitor \| Media \| Other), category_interest 200, website_url 300, social_media 300, utm_source / utm_medium / utm_campaign 100 |
| sponsor | company_name* 200, email* 200, contact_person 200, phone 40, tier_interest 60, budget_range 60, message 2000, prospectus_requested (boolean), website_url 300, social_media 300 |
| exhibitor | business_name* 200, email* 200, contact_person 200, phone 40, business_category 100, product_service 1000, booth_requirement 60, company_profile (object, section 6), website_url 300, social_media 300 |
| enquiry | name* 200, email* 200, message* 2000, phone 40, subject 200 |

- `website_url` must start with `http://` or `https://`. `social_media` is free text: handles or links.
- The portal sets status, reference, edition, timestamps and test flags itself. A client sending any of them gets 400 `unknown_field`.

## 5. Privacy acknowledgement and marketing consent
- These are two separate controls on every form:
  1. A required, unticked checkbox: "I have read the privacy notice". Send `privacy_acknowledged: true` with the notice version.
  2. An optional, unticked checkbox for marketing. Send `consent_marketing: true` with `consent_version` only when it is ticked.
- Never combine them in one checkbox, and never pre-tick either.
- The portal stores `privacy_acknowledged_at` and `consent_at` in server time. With no consent it stores `consent_marketing: false` and nulls.

## 6. Exhibitor company profile (optional)
```json
"company_profile": { "file_name": "Acme Profile.pdf", "content_type": "application/pdf",
                     "size_bytes": 482113, "sha256": "<lowercase hex of the file>", "data_base64": "<standard base64>" }
```
- **PDF only**, 1 to 3,000,000 bytes. The file name must end in `.pdf` and be at most 120 characters. No other keys are allowed in the object.
- The portal refuses with 400 when:
  - the type is not PDF, or the bytes do not begin with `%PDF-` (`unsupported_file_type`);
  - the file is over 3 MB (`file_too_large`);
  - the size or SHA-256 does not match the decoded bytes (`file_mismatch`);
  - the base64 is malformed (`invalid_value`).
- On a refusal nothing is uploaded or stored.
- The file goes to **Base44 private storage** under a server-made name (`<reference>-company-profile.pdf`).
  - No public URL is ever created.
  - The response never carries a storage path.
  - The record keeps the private path, original file name, size and SHA-256.
- Staff open it from the 2027 admin page with "Company profile". That calls `evAdmin` `companyProfileLink`:
  - admin, super_admin and finance only;
  - a reason is required;
  - it returns a signed link valid for 5 minutes;
  - each link writes an EvAudit row.
- The storage path is never returned by any admin list.
- Website side:
  - validate type and size before upload;
  - compute SHA-256 and base64 on the server;
  - never store the file on Vercel beyond the request.
- Malware scanning is not performed by the portal in v1.1. Staff should open profiles only on patched machines (open item O-3).

## 7. Responses
| HTTP | body | website should |
|---|---|---|
| 201 | `{ "reference": "H27-PRI-7K3QX9" }` | show the reference as confirmation |
| 200 | `{ "reference": "...", "duplicate": true }` | same `client_request_id` already accepted: show that reference |
| 200 | `{ "already_registered": true }` | priority only, email already registered for 2027: neutral "you're already on the list" (no reference revealed) |
| 202 | `{ "accepted": true }` | honeypot tripped: show the normal thank-you |
| 400 | `{ "error": <code>, "field"?: <name> }` | show a field error; do not retry unchanged |
| 401 | `{ "error": "unauthorized" }` | log server-side; show a generic error |
| 403 | `{ "error": "not_open", "form": <form> }` | form is closed: show "opens soon" |
| 413 / 500 / 503 | `{ "error": "too_large" \| "server_error" \| "not_configured" \| "edition_misconfigured" }` | retry once after 2 s with the SAME `client_request_id` (not for 413), then show a generic error |

400 codes:
- `missing_field`, `invalid_email`, `invalid_url`, `invalid_value`, `too_long`, `unknown_field`;
- `privacy_ack_required`, `unsupported_file_type`, `file_too_large`, `file_mismatch`;
- `client_request_id_required`, `unknown_form`, `unknown_edition`, `invalid_json`.

## 8. Behaviour guarantees (portal)
- Records go only to 2027 entities, each with a server-made reference: `H27-PRI-`, `-SPN-`, `-EXH-` or `-ENQ-`, plus 6 characters with no 0/O/1/I/L.
- 2026 records are never read or written. `edition: "2026"` is always refused.
- Idempotent on `client_request_id`. One priority registration per email per edition.
- Nothing the website sends is silently discarded: a request is either stored in full or refused with a reason.
- No email is sent and no payment starts in v1.1. That includes prospectus requests: staff send the prospectus.
- Every stored submission writes one EvAudit row with actor `public:website`. An uploaded profile's hash is in that row.

## 9. Configuration versus activation (three independent controls)
| Control | Where | Who sets it | Effect alone |
|---|---|---|---|
| 1. Form secret | Base44 secret `EV_FORM_HMAC_SECRET` + Vercel server env `HEBS_PORTAL_FORM_SECRET` (+ `HEBS_PORTAL_FORM_URL`, `HEBS_PORTAL_APP_ID`) | Owner, typed directly into each provider's settings screen; never seen by Claude, never in chat or Git | Authenticates calls only. With forms closed, every signed call gets 403 `not_open`; **nothing opens** |
| 2. Deployment switch | Base44 secret `EV_ALLOW_PUBLIC_OPEN=yes` | Owner, separate approval | Allows forms to be opened; opens none by itself |
| 3. Per-form flag | Edition record, via the 2027 admin page | admin / super_admin, with a reason, audited; refused (`opening_locked`) unless control 2 is on | Opens one form |

A form accepts submissions only when all three are in place. Closing any one closes it again. Ticketing, payments and Stripe stay locked in code whatever these controls say.

## 10. Website obligations
- Rate-limit by IP on the Next.js route (suggest 5 per 10 minutes). Validate against the request schema before calling.
- Generate `client_request_id` on the server when the submission first arrives, and reuse it on retry.
- Never log the secret, the signature, the full request body or the file. Log only the HTTP status and `client_request_id`.
- Show the privacy notice with the two separate checkboxes from section 5.
- Prospectus: confirm with "our team will send the prospectus". Do not promise an automatic email.

## 11. Test vectors
The full set, with expected status codes and body shapes, is in `hebs-2027-form-test-vectors.v1.1.json`. The first one uses:
- secret `synthetic-secret-synthetic-secret-0123456789`
- timestamp `1793750400`
- body `{"form":"priority","edition":"2027","client_request_id":"6f1c2a9e-4b7d-4c3e-9a1f-2d8e5b7c0a14","website":"","data":{"full_name":"Synthetic Person","email":"person@synthetic.test","privacy_acknowledged":true,"privacy_notice_version":"2027-01"}}`
- → signature `5dff8a0ae6a805f979f3bc5b52deb8e6887c9e159a411ebb9a8c2d4e516f3e5e`

That secret is published on purpose. The portal refuses it on any real deployment.

## 12. Implementation notes for the website
- Sign the exact string you send. Serialise once (`const raw = JSON.stringify(body)`), sign `${ts}.${raw}`, and send `raw`. Use a 10 s timeout, or 30 s for an exhibitor request with a file.
- `edition` is always the string `"2027"`.
- Field names are snake_case exactly as in the request schema.
- Staging and production use different secrets. Neither is ever committed.

## 13. Open items
- **O-1**: the directive's full list of priority interests was not available here. v1.1 uses the seven values above, including Competitor and Educator. If the directive lists others, they are a one-line change on both sides.
- **O-2**: the prospectus is recorded but not sent. Automatic sending is a later, separately approved email change.
- **O-3**: no malware scanning of uploaded PDFs in v1.1. A scanning step can be added before staff access if required.

# HEBS 2027 public forms: website ↔ portal interface contract v1.1

Status: **v1.1, Gate A corrections revision of 4 Nov 2026** (after the owner-review revision: Media removed from priority interests; exhibitor uploads disabled). The corrections revision makes Country and Area of Interest required on priority, adds `partnership_interest` to sponsor, adds `audit_failed`, and states the duplicate guarantee for simultaneous requests ("Gate A corrections" below). Supersedes v1.0. Implemented on the portal side by `evSubmitPublicForm` v1.1 and `evAdmin` (companyProfileLink). It is tested locally and in the private Base44 test copy, and is not on the live portal. Every form stays closed until the owner approves deployment AND opens each form (section 9).

Companion files (same folder):
- `hebs-2027-form-request.v1.1.schema.json` and `hebs-2027-form-response.v1.1.schema.json` (JSON Schema 2020-12).
- `hebs-2027-form-test-vectors.v1.1.json`: 21 signed vectors, each produced by running the portal's own code.

## Changes from v1.0

| # | Owner decision | v1.0 behaviour | v1.1 behaviour |
|---|---|---|---|
| 1 | Priority interests follow Mrs. Shuler's directive exactly | Attendee, Contestant, Sponsor, Exhibitor, Media, Other; an unknown value was silently changed to Other | Attendee, **Competitor**, **Educator**, Exhibitor, Sponsor, Other. Any other value, including Media and Contestant, → 400 `invalid_value`. Media enquiries use the enquiry form |
| 2 | Sponsor prospectus request | not supported | optional `prospectus_requested` (boolean), recorded on the record. No email is sent in v1.1 |
| 3 | Exhibitor company-profile upload | not supported | **Disabled in this release** (owner decision 7). A `company_profile` field → 400 `upload_disabled`, nothing stored. The checked, private-storage design is built and tested but switched off until malware scanning or an approved quarantine-and-review procedure exists (section 6) |
| 4 | Privacy acknowledgement distinct from marketing consent | priority form only, consent only | every form: `privacy_acknowledged: true` + `privacy_notice_version` **required**; `consent_marketing` + `consent_version` optional and separate |
| 5 | Approved country, website and social fields not silently discarded | country on priority only; unknown fields silently dropped; over-long values silently cut | `country` on all four forms; `website_url` and `social_media` on priority, sponsor and exhibitor. Unknown field, over-long value or wrong type → 400 naming the field. Nothing is dropped silently |

Gate A corrections (Gary's review, 4 Nov 2026):

| # | Finding | Before | Now |
|---|---|---|---|
| G1 | Mrs. Shuler's directive requires Country and Area of Interest | optional on priority | **required** on priority: missing, empty or blank → 400 `missing_field` naming `country` or `interest` |
| G2 | Partnership type is not sponsorship tier | `tier_interest` only | new **required** sponsor field `partnership_interest`: exactly `Sponsorship` \| `Exhibition` \| `Brand activation` \| `Strategic partnership` (the website's four categories). Any other value → 400 `invalid_value`. `tier_interest` stays a separate, optional free-text field. No other categories without Mrs. Shuler's approval |
| G4 | Simultaneous requests with the same `client_request_id` | could store two records | one record; every answer carries its reference (section 8) |
| G5 | Record stored but audit row failed | record kept without audit | record removed, 503 `audit_failed`; retry with the same `client_request_id` |
| — | Platform read limit reached (found while testing G4 in the private copy) | opaque 500 `server_error` | 503 `busy` with `retry_after_s` and `Retry-After` |

(G3, the payments lock, is a portal-side admin change with no effect on this interface.)

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
  - 20,000 bytes for every request in this release. A larger request → 413 `too_large`.
  - 4,200,000 bytes is reserved for exhibitor requests with a company profile, once uploads are enabled (section 6). Vercel's 4.5 MB request limit fits a 3 MB PDF.

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
| `country` | string ≤ 100 | **required on priority**; optional on the other forms |

Per form (* = required):

| form | fields (max length) |
|---|---|
| priority | full_name* 200, email* 200, country* 100, interest* (Attendee \| Competitor \| Educator \| Exhibitor \| Sponsor \| Other), phone 40, city 100, company 200, category_interest 200, website_url 300, social_media 300, utm_source / utm_medium / utm_campaign 100 |
| sponsor | company_name* 200, email* 200, partnership_interest* (Sponsorship \| Exhibition \| Brand activation \| Strategic partnership), contact_person 200, phone 40, tier_interest 60 (sponsorship tier, free text, separate from partnership_interest), budget_range 60, message 2000, prospectus_requested (boolean), website_url 300, social_media 300 |
| exhibitor | business_name* 200, email* 200, contact_person 200, phone 40, business_category 100, product_service 1000, booth_requirement 60, website_url 300, social_media 300. (`company_profile` is not accepted in this release, section 6) |
| enquiry | name* 200, email* 200, message* 2000, phone 40, subject 200 |

- `website_url` must start with `http://` or `https://`. `social_media` is free text: handles or links.
- The portal sets status, reference, edition, timestamps and test flags itself. A client sending any of them gets 400 `unknown_field`.

## 5. Privacy acknowledgement and marketing consent
- These are two separate controls on every form:
  1. A required, unticked checkbox: "I have read the privacy notice". Send `privacy_acknowledged: true` with the notice version.
  2. An optional, unticked checkbox for marketing. Send `consent_marketing: true` with `consent_version` only when it is ticked.
- Never combine them in one checkbox, and never pre-tick either.
- The portal stores `privacy_acknowledged_at` and `consent_at` in server time. With no consent it stores `consent_marketing: false` and nulls.

## 6. Exhibitor company profile: disabled in this release
- **The website must not show an upload control.** A request carrying `company_profile` gets 400 `upload_disabled` (field `company_profile`), or 413 `too_large` if it is over 20 KB. Nothing is uploaded or stored. The request schema rejects the field.
- The portal already contains the controlled design, and it is tested (private copy: a 2.9 MB PDF stored privately and read back byte-identical). It stays off behind a separate Base44 switch, `EV_ALLOW_PROFILE_UPLOAD=yes`.
- That switch may be set only after the owner approves malware scanning or a quarantine-and-review procedure. When enabled, the design is:
  - PDF only, max 3 MB;
  - type, size, SHA-256 and `%PDF-` signature checked;
  - stored in Base44 private storage under a server-made name;
  - staff open it through a reasoned, audited, 5-minute signed link;
  - no storage path ever returned.
- The field shape for that later release is kept in the request schema under `$defs.company_profile_when_enabled`.

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
| 413 / 500 / 503 | `{ "error": "too_large" \| "server_error" \| "not_configured" \| "edition_misconfigured" \| "audit_failed" }` | retry once after 2 s with the SAME `client_request_id` (not for 413), then show a generic error |
| 503 | `{ "error": "busy", "retry_after_s": <1-60> }` + `Retry-After` header | the portal hit its platform read limit. Retry once with the SAME `client_request_id` after `retry_after_s` (queue it server-side if the visitor has left); never with a new id |

400 codes:
- `missing_field`, `invalid_email`, `invalid_url`, `invalid_value`, `too_long`, `unknown_field`;
- `privacy_ack_required`, `upload_disabled`, and (only once uploads are enabled) `unsupported_file_type`, `file_too_large`, `file_mismatch`;
- `client_request_id_required`, `unknown_form`, `unknown_edition`, `invalid_json`.

## 8. Behaviour guarantees (portal)
- Records go only to 2027 entities, each with a server-made reference: `H27-PRI-`, `-SPN-`, `-EXH-` or `-ENQ-`, plus 6 characters with no 0/O/1/I/L.
- 2026 records are never read or written. `edition: "2026"` is always refused.
- Idempotent on `client_request_id`, including simultaneous requests: however many identical requests arrive at once, one record is stored and every answer carries that record's reference (one 201, the rest 200 `duplicate`). One priority registration per email per edition, also under simultaneous requests. A response can take up to about half a second longer while the portal checks for twins.
- All or nothing: a stored submission always has its audit row. If the audit cannot be written, the record is removed and the answer is 503 `audit_failed` (no reference); a retry with the same `client_request_id` is safe.
- Nothing the website sends is silently discarded: a request is either stored in full or refused with a reason.
- No email is sent and no payment starts in v1.1. That includes prospectus requests: staff send the prospectus.
- Every stored submission writes an EvAudit `create` row with actor `public:website`. An uploaded profile's hash is in that row. A simultaneous twin that removes itself is recorded as `duplicateRemoved`.

## 9. Configuration versus activation (independent controls)
| Control | Where | Who sets it | Effect alone |
|---|---|---|---|
| 1. Form secret | Base44 secret `EV_FORM_HMAC_SECRET` + Vercel server env `HEBS_PORTAL_FORM_SECRET` (+ `HEBS_PORTAL_FORM_URL`, `HEBS_PORTAL_APP_ID`) | Owner, typed directly into each provider's settings screen; never seen by Claude, never in chat or Git | Authenticates calls only. With forms closed, every signed call gets 403 `not_open`; **nothing opens** |
| 2. Deployment switch | Base44 secret `EV_ALLOW_PUBLIC_OPEN=yes` | Owner, separate approval | Allows forms to be opened; opens none by itself |
| 3. Per-form flag | Edition record, via the 2027 admin page | admin / super_admin, with a reason, audited; refused (`opening_locked`) unless control 2 is on | Opens one form |
| 4. Upload switch (later) | Base44 secret `EV_ALLOW_PROFILE_UPLOAD=yes` | Owner, only after malware scanning or quarantine-and-review is approved | Allows exhibitor PDF uploads; not set in this release |

A form accepts submissions only when controls 1–3 are in place. Closing any one closes it again. Ticketing, payments and Stripe stay locked in code whatever these controls say.

## 10. Website obligations
- Rate-limit by IP on the Next.js route (suggest 5 per 10 minutes). Validate against the request schema before calling.
- Generate `client_request_id` on the server when the submission first arrives, and reuse it on retry.
- Never log the secret, the signature, the full request body or the file. Log only the HTTP status and `client_request_id`.
- Show the privacy notice with the two separate checkboxes from section 5.
- Prospectus: confirm with "our team will send the prospectus". Do not promise an automatic email.
- Exhibitor form: no file-upload control in this release.
- Priority form: Country and Area of Interest are required fields in the form, not optional.
- Sponsor form: a required "Partnership type" choice with exactly the four values above, sent as `partnership_interest`. A sponsorship tier, if asked, goes in `tier_interest`; never put a tier in `partnership_interest`.

## 11. Test vectors
The full set, with expected status codes and body shapes, is in `hebs-2027-form-test-vectors.v1.1.json`. The first one uses:
- secret `synthetic-secret-synthetic-secret-0123456789`
- timestamp `1793750400`
- body `{"form":"priority","edition":"2027","client_request_id":"6f1c2a9e-4b7d-4c3e-9a1f-2d8e5b7c0a14","website":"","data":{"full_name":"Synthetic Person","email":"person@synthetic.test","country":"Nigeria","interest":"Attendee","privacy_acknowledged":true,"privacy_notice_version":"2027-01"}}`
- → signature `efb7d843c436d6897806664e84119826a0c727a3d2b499e6935f25c5ef5eaeb8`

That secret is published on purpose. The portal refuses it on any real deployment.

## 12. Implementation notes for the website
- Sign the exact string you send. Serialise once (`const raw = JSON.stringify(body)`), sign `${ts}.${raw}`, and send `raw`. Use a 10 s timeout.
- `edition` is always the string `"2027"`.
- Field names are snake_case exactly as in the request schema.
- Staging and production use different secrets. Neither is ever committed.

## 13. Open items
- **O-1 (closed)**: interests follow Mrs. Shuler's directive: Attendee, Competitor, Educator, Exhibitor, Sponsor, Other.
- **O-2**: the prospectus is recorded but not sent. Automatic sending is a later, separately approved email change.
- **O-3**: exhibitor uploads stay disabled until malware scanning or an approved quarantine-and-review procedure exists.
- **O-4 (closed)**: partnership categories are the website's four (Mrs. Shuler's directive). Adding one needs her approval and a contract revision.

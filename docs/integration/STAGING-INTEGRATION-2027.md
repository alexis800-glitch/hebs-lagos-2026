# HEBS Lagos 2027: website ↔ Base44 staging integration

Status: **11 Nov 2026**.
- The website side is ready for staging against contract v1.1.
- Two things are still needed from Claude Desktop and the owner: the details of the Base44 test copy, and the contract for ticketing and competition booking.

The production launch switch (`LAUNCH_2027`) and real-portal mode (`CONTRACT.final`) are untouched.

## What the website does today

- **Four journeys under contract v1.1:**
  - priority list (registration of interest);
  - sponsorship inquiry;
  - exhibitor application;
  - general enquiry.
- **The path a submission takes:** the browser posts to `/api/hebs2027/submit` on the website's own server. The server then:
  - validates the fields with the same rules as the browser;
  - applies the rate limit, honeypot and minimum fill time;
  - holds one `client_request_id` per attempt;
  - signs the request (HMAC, section 3);
  - calls `evSubmitPublicForm`, retrying at most once with the same id (section 7).
- **What a visitor sees:**
  - "Sending…", and a second click does nothing;
  - field errors, from the browser and from the portal;
  - a confirmation showing the portal's reference, and only the portal's reference;
  - for a priority email already registered: "already on the list";
  - the form closed (403 `not_open`);
  - too many attempts;
  - portal busy, with when to resend (the resend reuses the same id);
  - a generic error, "nothing is confirmed".
- **What is never shown:** no reference is invented or shown before the portal confirms it. There is no payment status or QR code, because contract v1.1 has none.
- **Modes** (`lib/forms-2027/config.ts`):
  - `off`: the default and production today. The route is a missing page and forms are disabled.
  - `mock`: local only, with a contract-faithful mock portal.
  - `staging` (new): the private Base44 test copy. It runs only on protected previews and locally, and is refused:
    - on production and on the client design-review preview;
    - against the live portal (its host, and its app id, checked by hash);
    - for any endpoint not of the contract form `https://<host>/api/apps/<app id>/functions/evSubmitPublicForm`.

    Forms show "Test system" while it is on. It sends test notice versions (`staging-2027-00`) and no uploads.
  - `portal`: the real portal. Still locked behind `CONTRACT.final`.

## 2026 is not touched

- The website always sends `edition: "2027"`, and the portal refuses 2026 (contract section 8). Tests confirm this.
- The 2026 contact route (`/api/contact`) and the 2026 registration link are unchanged.
- Staging cannot reach the live portal: it is refused by host and by app id.

## Evidence so far

- **Unit and contract tests** (`npm test`):
  - the 21 official signed v1.1 vectors;
  - mapping, retries, idempotency, busy and audit-failure handling;
  - the staging guards (`tests/forms-staging-2027.test.ts`).
- **End to end over HTTP against the local mock** (`scripts/e2e-2027-forms.mjs`): 24 of 24 checks pass. For each form:
  - confirmed with a reference of the right prefix;
  - a resend returns the same reference;
  - an invalid email and a missing privacy acknowledgement are refused;
  - the honeypot gets a plain thank-you.
  - Also: priority with the same email again is already registered, and the route refuses GET, a foreign origin and an oversized body.

## Running staging end to end (once the test copy details exist)

1. **The owner sets these in Vercel, Preview scope only** (typed directly, never in chat or Git):
   - `HEBS_STAGING_PORTAL_FORM_URL`, `HEBS_STAGING_PORTAL_APP_ID`, `HEBS_STAGING_PORTAL_FORM_SECRET`;
   - a shared store, or `HEBS_STAGING_ALLOW_MEMORY_STORE=yes` for a short run;
   - `HEBS_STAGING_RATE_LIMIT_MAX=50`.
2. **Claude Desktop opens the four forms on the test copy only:** controls 2 and 3 of section 9.
3. **Deploy:** `scripts/deploy-integration-preview.sh`. This is a protected preview: the full review site, with forms in staging.
4. **Run the check:** `VERCEL_AUTOMATION_BYPASS_SECRET=… node scripts/e2e-2027-forms.mjs https://<preview> evidence.json`.
5. **Claude Desktop confirms in the test copy's 2027 admin** that each reference in `evidence.json` exists:
   - with its fields;
   - with its EvAudit `create` row (actor `public:website`);
   - with no 2026 record touched.

## Needed from Claude Desktop (not assumed here)

1. **The test copy's endpoint:** its exact `evSubmitPublicForm` URL and app id. Confirm the secret it holds (or that it accepts the published synthetic secret, as contract section 3 says only the test copy may).
2. **Form switches on the test copy:** confirm `EV_ALLOW_PUBLIC_OPEN` and the per-form flags.
3. **Checking admin visibility:** how records are confirmed after a run, either Claude Desktop checking `evAdmin` by reference, or a read-only check it specifies.
4. **Ticketing, competition registration and education registration.** These are not in v1.1, which says they "stay locked in code". The website will not invent endpoints, fields or responses. It needs a contract revision (or confirmation that these stay on the portal as hand-off pages) covering:
   - the journeys and their fields;
   - the booking reference format;
   - payment status values and when payment is confirmed;
   - the QR payload and when it is issued;
   - confirmation and failure responses;
   - the test-mode payment provider.
   Until then, ticketing and competition entry show "not open yet", and the website shows no reference, payment status or QR code.
5. **Test records:** how test records are marked and cleared on the test copy.
6. **For production later:** the conditions for `CONTRACT.final`, and the production secret, URL and app id (owner-typed, Production scope).

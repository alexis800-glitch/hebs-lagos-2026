# HEBS 2027 private test: owner setup sequence

For Lex, who sets up the private end-to-end test (run sheet rev 2, section 9). Follow the steps in order. **Do not start until the approval named in a step is given in writing.**

Rules for every step:

- Secrets are generated and typed by Lex only, straight into Upstash, Vercel or the Base44 copy. They are never pasted into chat, email, a ticket or a document. Claude Code and Claude Desktop never see them.
- Nothing here touches production.

The settings referred to below are rows 1–8 of `CONFIGURATION-CHECKLIST.md`.

## Step 0: approvals and prerequisites

| Needed | From |
|---|---|
| Approval of this configuration and of E0–E12 | Gary, Lex |
| P1: test-only 2027 Edition in the copy's data, all forms closed | Lex, Gary; Claude Desktop creates it |
| A dedicated test-only rate-limit store | approved in design; created in step 1 |
| The website test branch at its latest reviewed commit, Preview READY | Claude Code reports the commit |

## Step 1: create the dedicated rate-limit store

Create the store **directly in the Upstash console**, not through the Vercel Marketplace integration. The integration can add `KV_REST_API_*` settings to every environment, Production included, and they can't be scoped to one branch.

1. In console.upstash.com, choose **Redis → Create database**.
2. Fill in:
   - **Name:** `hebs-2027-e2e-test`.
   - **Type:** Regional.
   - **Region:** US East (N. Virginia), next to the Preview functions in iad1.
   - **TLS:** on.
   - **Eviction:** off.
3. Open the database's **REST API** panel. Keep the tab open for step 3: you'll copy **UPSTASH_REDIS_REST_URL** and the standard (read-write) **UPSTASH_REDIS_REST_TOKEN** from there. Don't use the read-only token.
4. This store is for the test only. It is never connected to production, and it is deleted at close-down. On top of that, the website gives test keys their own `hebs27-e2e:` prefix.

## Step 2: generate the three website secrets (on Lex's own computer)

Run in Terminal. Each command prints one value: copy it straight into its field in step 3, then clear the terminal.

```
openssl rand -base64 48 | tr -d '\n'; echo     # row 4  HEBS_PORTAL_FORM_SECRET   (64 characters)
openssl rand -hex 16; echo                      # row 7  HEBS_RATE_LIMIT_SALT      (32 characters)
openssl rand -hex 32; echo                      # row 8  HEBS_PRIVATE_TEST_PROBE_TOKEN (64 characters)
```

The three values must all differ. Each must be new, never used anywhere else, and never a value published in the contract or the repository. The website refuses a short or published value.

Row 4 is the signing secret. Lex types the same value into the copy's `EV_FORM_HMAC_SECRET` in Base44 (run sheet P2). Before that, Claude Desktop records the copy's current self-test setting, so it can be restored at close-down.

## Step 3: add the eight Preview settings, scoped to the test branch

In vercel.com, open **veridion-systems-projects → hebs-lagos-2026 → Settings → Environment Variables → Add New**. For **each** row:

- **Environments:** tick **Preview** only. Untick Production and Development.
- **Branch:** next to Preview, choose a custom branch and enter `website/2027-private-e2e-test`. Never "All Preview branches".
- **Sensitive:** on for rows 4, 6, 7 and 8.

| Row | Key | Value |
|---|---|---|
| 1 | `HEBS_FORMS_MODE` | `private-test` |
| 2 | `HEBS_PORTAL_FORM_URL` | `https://base44.app/api/apps/6aea5ced633d7df1f4788d9a/functions/evSubmitPublicForm` |
| 3 | `HEBS_PORTAL_APP_ID` | `6aea5ced633d7df1f4788d9a` |
| 4 | `HEBS_PORTAL_FORM_SECRET` | from step 2 |
| 5 | `HEBS_RATE_LIMIT_REST_URL` | UPSTASH_REDIS_REST_URL from step 1 |
| 6 | `HEBS_RATE_LIMIT_REST_TOKEN` | UPSTASH_REDIS_REST_TOKEN from step 1 |
| 7 | `HEBS_RATE_LIMIT_SALT` | from step 2 |
| 8 | `HEBS_PRIVATE_TEST_PROBE_TOKEN` | from step 2 |

Rows 2 and 3 must match the table exactly. Any other value keeps the forms off.

## Step 4: check the settings by name (read-only)

Claude Code lists setting names, never values, and confirms:

- the test branch has exactly rows 1–8;
- Production has none of them;
- `website/2027-pages-batch-1` has none of them.

Anything else means stop and correct it.

## Step 5: redeploy the test branch

New settings reach only a new deployment, and the 2027 pages read them at build time. So:

1. Open **Deployments**, filter on branch `website/2027-private-e2e-test`, and open the newest deployment.
2. Choose **⋯ → Redeploy → Redeploy**.
3. Wait for **Ready**. If the build fails with "HEBS 2027 private-test guard", a setting is on the wrong branch or environment. Go back to step 3.

## Step 6: confirm the redeployed Preview (Claude Code, read-only)

- Anonymous visitors get the Vercel sign-in redirect (P6).
- Signed in, each 2027 form shows the "TEST ONLY – not the approved HEBS privacy notice" banner, and none has an upload control.
- A probe request without the token answers 404.
- No form is submitted yet: the copy's forms are still closed.

## Step 7: E0 reachability check (Lex runs it; the token stays with Lex)

1. Signed in to Vercel, open `/2027/contact` on the test branch's Preview address.
2. Open the browser's developer console and run the line below. It asks for the token with a prompt, so the token is never printed, logged or stored:
   - the command text contains no token, so console history doesn't hold one;
   - the result holds only status codes;
   - the website's server never logs the token (tested).

   The token does travel in the request header, so don't save a HAR file, copy the request as cURL, or screenshot the Network panel for this request.

   ```
   await (await fetch("/api/hebs2027/submit", { method: "POST", headers: { "content-type": "application/json", "x-hebs-probe-token": prompt("E0 probe token") }, body: JSON.stringify({ probe: "reachability" }) })).json()
   ```

3. Paste the result, which holds no secret, into the evidence folder. Expected:

   `{"status":"probe","results":[{"request":"unsigned","status":401,"error":"unauthorized"},{"request":"signed","status":403,"error":"not_open"}]}`

   If the result is 404, the token doesn't match row 8. Any other result: stop and send it to Gary.

**Hold:** Gary reviews E0.

## Step 8: switch the probe off

1. Delete row 8 (`HEBS_PRIVATE_TEST_PROBE_TOKEN`).
2. Redeploy as in step 5.
3. Claude Code confirms the probe now answers 404, even with the old token.

## Step 9: open the copy's forms (P7) and run E2–E9

1. Under P7, `EV_ALLOW_PUBLIC_OPEN=yes` is set on the copy, and an admin opens the four forms with a reason.
2. Run E2–E9 with the synthetic convention in `TEST-PLAN-E0-E12.md`.

The website allows 5 submissions per connection every 10 minutes, the same as it will in production, and the test needs about 12. Run the cases in three batches, at least 10 minutes apart:

| Batch | Cases |
|---|---|
| 1 | E2, E4 |
| 2 | E5, E6, E7, E8 |
| 3 | E9 |

A "Too many attempts" message means the batch went over the limit. It isn't a failure: wait 10 minutes and resend.

## Close-down (same day)

1. The copy's admin closes all four forms. `EV_ALLOW_PUBLIC_OPEN` is deleted, and Lex restores the copy's self-test secret.
2. Lex deletes rows 1–7 (and row 8 if it's still there) from Vercel, then redeploys the test branch.
3. Claude Code confirms that the test branch shows "Opens soon" again, the submit route answers 404, and production and normal staging are unchanged.
4. Lex deletes the Upstash database `hebs-2027-e2e-test`.
5. The evidence goes to Gary. The test branch is not merged.

# HEBS Lagos 2027: launch and rollback procedure

The 2027 website is published by one reviewed change, `LAUNCH_2027` in
`lib/launch-2027-config.ts`, and only when `launchBlockers()` in
`lib/launch-2027.ts` returns an empty list. Until then every 2027 address on
production answers exactly like a missing page (middleware, layout and pages
all use the same gate), and the live 2026 site is untouched.

Nothing in this document authorises publication. Each step that changes
production needs the owner's explicit written approval.

## 1. Mandatory requirements

`launchBlockers()` lists every one that is not met; publication is impossible
while any remains. They cannot be bypassed: the gate reads the content, the
media register and the switch itself, not a setting.

| Key | Requirement | Cleared by |
|---|---|---|
| `authorisation` | The owner's written launch authorisation, recorded in `LAUNCH_2027.authorisation` (who, date, where it is recorded) | Owner approval, then a reviewed commit |
| `pages`, `pages-tickets` | The launched pages listed, including the homepage and the Tickets page (every priority-list button leads there) | Reviewed commit |
| `page-<id>` | Every launched page built | Development |
| `approvals` | Every 2027 copy block, fact, media slot and launch item approved (`previewStatuses()`) | Owner approvals, recorded in `lib/content`, `lib/editions`, `lib/assets` |
| `review-media-<page>` | No launched page relies on review media. `public/_review` is never served on production; each photograph must have its written usage terms filed and be moved into the rights-gated register (`lib/assets/register.ts`), which refuses an asset without recorded permission | Usage terms filed; Veridion moves the files |
| `form-<form>` | No form switched on (`FORMS_OPEN`) without the final integration contract (D1) and the approved privacy notice (D13) | Base44 portal and owner approvals |
| `origin` | The canonical web address approved (D7) | Owner decision |
| `withhold` | The emergency switch `HEBS_2027_WITHHOLD` not set to `on` | Vercel environment setting |

The current list is shown on the protected preview's `/2027/status` page and
checked by `tests/launch-2027.test.ts`.

## 2. Before launch day

1. Record the current production deployment ID (Vercel → Deployments →
   Production). This is the rollback target.
2. Confirm `launchBlockers()` returns only `authorisation` (everything else
   cleared), on the launch branch from the latest `origin/master`.
3. Decide whether 2027 stays under `/2027` or moves to the site root (D7). A move
   changes `BASE` in `lib/site/2027.ts` and needs its own reviewed plan for the
   2026 pages; it is not part of this procedure.
4. Root `robots.txt`: the live site has none. If the owner wants one (for
   example to list `/2027/sitemap.xml`), it is a separate approved change,
   because it affects the 2026 site.

## 3. Launch

1. With the owner's written approval, set `LAUNCH_2027.authorisation`,
   `pages` and an approved `origin` in one commit. Open a PR to `master`.
2. Protected preview of the PR: check every launched page, `/2027/sitemap.xml`,
   `/2027/social-card`, the metadata and the Event data.
3. Locally: `VERCEL_ENV=production npx next build && VERCEL_ENV=production npx next start -p 3000`,
   then confirm the launched pages answer 200 and every other 2027 address,
   concept study and review file still answers as a missing page.
4. With approval, merge. Vercel deploys production from `master`.
5. On production: open each launched page, the sitemap and the social card;
   confirm the 2026 pages are unchanged.

## 4. Rollback

Use the fastest step that fixes the problem; all three restore the
pre-launch state, in which production serves no 2027 address.

1. **Instant (seconds).** Vercel → Deployments → the production deployment
   recorded in step 2.1 → Instant Rollback (or `vercel rollback <deployment>`).
   Production serves the previous build again; nothing is rebuilt.
2. **Emergency switch (one redeploy).** Set `HEBS_2027_WITHHOLD=on` for the
   Production environment in Vercel and redeploy the current production
   deployment. Every 2027 address is withheld again; the 2026 site is
   unaffected. Remove the variable and redeploy to undo.
3. **Revert (permanent).** Revert the launch commit on `master` (it only
   changes `LAUNCH_2027`). With `authorisation` empty again, the gate closes.

After any rollback, run `npm run test:withheld -- <production URL>` against a
production build of the reverted code and confirm 2026 pages answer as before.

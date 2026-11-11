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
| `approvals-<page>` | Every item a launched page shows approved: its own copy, facts and image positions, plus what all pages share (venue name, logo, closing call to action). Each page is judged on its own (`pageStatuses()`), so unapproved material on one page never blocks another | Owner approvals, recorded in `lib/content`, `lib/editions`, `lib/assets` (homepage copy: `HOME_COPY_STATUS`) |
| `review-media-<page>` | No launched page relies on review media. `public/_review` is never served on production; each photograph must have its written usage terms filed and be moved into the rights-gated register (`lib/assets/register.ts`), which refuses an asset without recorded permission | Usage terms filed; Veridion moves the files |
| `form-<form>` | No form switched on (`FORMS_OPEN`) without the final integration contract (D1) and the approved privacy notice (D13) | Base44 portal and owner approvals |
| `origin` | The canonical web address approved (D7) | Owner decision |
| `withhold` | The emergency switch `HEBS_2027_WITHHOLD` not set to `on` | Vercel environment setting |

The current list is shown on the protected preview's `/2027/status` page and
checked by `tests/launch-2027.test.ts`.

## 1a. Content sign-off

Copy approvals are recorded, not hand-edited into the content files:

1. Reviewers open `/2027/review` on the protected preview (never served on production, even after launch). Items are grouped by who approves them: shared facts, wording Veridion can verify, organiser wording for Mrs. Shuler, commercial and registration wording, and media records. Each item is marked First launch, Next pages or Later.
2. A reviewer chooses Approved, Revision required or Pending decision for each item. Drafts stay in their browser. They then export the decision record and send it to Veridion.
3. Veridion adds the entries to `lib/content/signoff-decisions-2027.ts`, with who decided, the date and where the decision is evidenced. An approval covers the exact wording approved. If the wording changes, the approval lapses and the launch gate counts the item as unapproved again.
4. Facts (the venue name D9, the mark D3, the day hours) are approved in their own records as well: `lib/editions/2027.ts` and `lib/assets/register.ts`.

Photography is not decided there. Mrs. Shuler's approval of the House of Snapp photographs is recorded. The written usage terms are what remain outstanding.

## 2. Before launch day

1. Record the current production deployment ID (Vercel → Deployments →
   Production). This is the rollback target.
2. Choose the pages to launch from the status page's "Page by page" table (any
   page marked "could launch alone"), and confirm `launchBlockers()` for that
   list returns only `authorisation`, on a branch from the latest `origin/master`.
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

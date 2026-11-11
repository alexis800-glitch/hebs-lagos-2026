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

All visible wording counts towards launch. That includes copy in the content modules and wording written in the page layouts: navigation, headings, buttons, footer, notices, image descriptions, search titles and the social card. The layout wording is inventoried from what each page renders (`lib/content/layout-copy-2027.json`). Run `npm run copy:inventory` after changing page wording; the tests fail until you do.

There are three categories (`lib/content/signoff-2027.ts`):

- **A. Routine:** labels, headings, buttons, notices, captions, descriptions and checkable facts. Veridion verifies these, one block per page.
- **B. Substantive:** editorial, brand and commercial wording. Mrs. Shuler or the HEBS organisers approve whole blocks, using the executive content package (`docs/launch/2027-executive-content-package.md`, generated, with exact wording).
- **C. Waiting:** items that wait on an outstanding decision (D9, D3, D1, D13, ticket prices and payment, and so on). Each decision clears its items.

Decisions are drafted on `/2027/review` (previews only, never on production) and exported to Veridion. Veridion records them in `lib/content/signoff-decisions-2027.ts` with the exact wording of every line. A block decision lists each line. If a line changes, only that line lapses.

Media: Mrs. Shuler's approval of the selected website media is recorded (`OWNER_MEDIA_APPROVAL`, and `MARK_APPROVAL` for the 2027 logo, D3). Approved media is prepared in `public/2027/media/` (`npm run media:prepare`, hashes in `lib/assets/published-media-2027.json`). It is served from `/2027/media/`, which the middleware withholds on production until the site opens. The gate blocks only:

- media with an evidence-based restriction: the disputed pre-party photographs, the NJS concept films and the 22 Oct gathering;
- prepared media not yet released: the files join the public repository only in the launch commit (`MEDIA_RELEASED`).

Missing third-party paperwork is a records follow-up, not a blocker. Ticket links stay off until `TICKET_SALES` records approved prices and payment.

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

## 2a. The first launch candidate

- **Pages.** The homepage and the Tickets information page (`lib/launch-2027-candidate.ts`), at hebslagos.com/2027 (D7).
- **How it is checked.** `tests/launch-candidate-2027.test.ts` renders both pages as production would, with only those two published. It confirms that:
  - links go only to the two pages, the privacy notice and in-page anchors, and no button is left without a destination;
  - nothing review-only or restricted appears, and every image comes from `/2027/media/`;
  - Tickets shows no sales, prices, payment or form. The "How registration will work" section stays off production until its wording is approved.
- **What still opens it.** Mrs. Shuler's approval of her wording blocks (`docs/launch/2027-executive-content-package.md`), and her choice to launch with or without the directive section 11 items. A recorded deferral is an `AnnouncementItem.deferred` entry. Then her written authorisation.

## 2b. Media and the public repository

The GitHub repository is public, so prepared media must not be committed before publication is authorised.

- **Before launch.** The approved files live in `public/2027/media/`, which git ignores. Their SHA-256 is recorded in `lib/assets/published-media-2027.json`. They reach only the protected review preview: a CLI deploy from a local copy, behind Vercel Authentication, which covers every vercel.app address.
- **Previews built from Git** carry no media, because the files are not in Git.
- **On production** (www.hebslagos.com) the middleware answers `/2027/media/*` as a missing page until the site opens. That still holds if the files were somehow deployed early.
- **At launch.** Production deploys from `master` through the Vercel Git integration, so the files must be in Git. The launch commit adds them (section 3). They become public on GitHub when that commit is pushed, so push it only once the launch is authorised, and merge it promptly.
- **The alternative.** A one-off production deploy from a local build would keep the files out of Git, but the next deploy from Git would drop them. It is not recommended.

## 3. Launch

1. With the owner's written approval, set `LAUNCH_2027.authorisation`, and
   `pages` from `LAUNCH_CANDIDATE`, in one commit (the origin, hebslagos.com with the site under /2027,
   is approved: D7). In the same commit release the media:
   - run `npm run media:prepare` and check that the tests pass, so the files
     match the recorded hashes;
   - remove the `public/2027/media/` line from `.gitignore` and `git add public/2027/media`;
   - set `MEDIA_RELEASED = true` in `lib/assets/published-media-2027.ts`.
   The repository is public, so the files must not be committed before this
   commit. Open a PR to `master`.
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

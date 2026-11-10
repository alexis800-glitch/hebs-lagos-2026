# HEBS Lagos 2027: preferred homepage design

Route: `/2027/concepts/home` (staging only; the `/2027` layout returns 404 on
production and marks every page noindex).

On production, `middleware.ts` answers every `/2027` and `/_review` request as an
ordinary missing page before any 2027 route renders, so no 2027 copy reaches a
404's HTML, RSC payload or prefetch response. `tests/withhold-2027.test.ts` covers
the decision; `npm run test:withheld -- <url>` checks a running production build
request by request.

The header, menu and buttons are real links to the built 2027 pages
(`components/2027/home/links.ts`, `lib/site/2027.ts`). Priority-list buttons lead
to the closed priority list and say it opens soon until forms are authorised.
(Owner decision N1, 2026-11-09: "Priority list opens soon" while registration is
closed; the approved registration wording returns when the list is activated.)

## Known issue: two 2027 homepages

The thirteen 2027 pages still link to the older homepage: their logo and "Home"
lead to `/2027`, and the priority-list buttons to the closed form at
`/2027/homepage#priority-list`. Nothing on those pages links back to this
preferred homepage. The owner wants this homepage to become the one 2027 landing
page; that move (decision A2, with where the priority list lives, N2) is to be
done in its own approved phase, not as part of these fixes.

This is the owner's **preferred creative design** (approved 2026-11-07), ported
from the reviewed mockup. It is preserved here for content verification and
final approval. It is not published, and no further redesign is authorised
unless the owner asks for one.

## What is in it

| Section | Notes |
|---|---|
| Hero | Hair-styling loop from the 2026 styling floor, live countdown with seconds, two framed cards (a pre-party guest, the NJS terrace). |
| Welcome | Arched portrait, inset, slowly turning HEBS seal. |
| In three numbers | 3 days, 13 competitions, 7 categories as gold-edged photographic numerals. Counts come from `lib/competitions.ts`. |
| Three days | Gold timeline, three staggered frames. |
| Six experiences | Cycling index with one framed image per line. International Networking uses DSC00242 (desktop, cropped to keep all six guests) and DSC00257 (phone, shown in full). |
| Destination | "Beauty meets paradise": four scenes (three NJS concept clips, then real HEBS 2026 guests at NJS), each labelled CONCEPT or PHOTOGRAPHED. No beach in any frame. |
| Competitions | Framed images, the 2026 winners block (all 13 competitions), the ribbon of seven categories. |
| Highlights, sponsors, final call | Drifting rows of 2026 photographs; the packed hall; the styling floor in shadow with the countdown. |

The header uses the provisional 2027 mark, version A (2027 on one line inside
the continent), on desktop and phone. It is **not approved**: it awaits
Mrs. Shuler's brand approval, and the official mark stays in use until then.

Wording follows the owner's rule of 2026-11-07: no beach imagery, and resort,
poolside and terrace language instead of beach wording. Accurate references
to NJS Royale Beach Resort and its Atlantic location are kept.

## Media safeguards

- No real media is committed. All HEBS Lagos 2026 (VMM) and NJS media is
  internal-review material listed in `lib/assets/home-2027-review.ts`, with
  its source, rights holder and the clearances it still needs. The files live
  only in `public/_review/home-2027/`, which is gitignored.
- A file is shown only when it is present on disk, and only in local
  development or in a preview built with `HEBS_REVIEW_MEDIA=on`
  (`components/2027/home/review-media.ts`). Never on production. A clean
  checkout or a Git-built preview renders a labelled placeholder instead, and
  the official HEBS mark replaces the provisional 2027 mark.
- The owner authorised the selected media for the private preview
  (2026-11-07). That preview is deployed from a local checkout with the CLI
  (`scripts/deploy-review-preview.sh`): the media travels only inside that one
  deployment, behind Vercel Authentication, and never through GitHub. Public
  use still needs the permissions and clearances in `MEDIA-REGISTER.md`.
- Generated or undocumented media (the NJS pool and terrace clips) is always
  labelled as a concept and may never depict a real venue or event.
- The winners block renders only approved winners with a recorded approval.
  The placeholders and the "0 of 13 confirmed" count appear in internal review
  only; on a production build the block is hidden until the first approved
  winner is added to `lib/content/winners-2026.ts`.
- `tests/home-2027.test.ts` checks these rules, including that no review file
  is tracked by git and that no Drive link or file ID appears in the register
  or these documents.

## Loading the review media locally

The owner keeps the review files privately. To see the design with its real
media in local development, place the files named in
`lib/assets/home-2027-review.ts` (the `src` of each record) in
`public/_review/home-2027/`, then run `npm run dev` and open
`/2027/concepts/home`. Never commit them and never copy them into any other
folder under `public/`.

## Screen sizes

The desktop composition is a 1440 px canvas, scaled to the window only from
1280 px (never by more than about 11%). Below 1280 px the page is fluid: the
phone composition up to 600 px, opened into columns for tablets and small
laptops from 601 px. Every label is at least 11 px. See the end of `home.css`.

## Films and pictures

- **Films.** Each film shows its first-frame still (`<clip>-poster.webp`) at once.
  - The hero's still is the page's first image and loads with high priority.
  - Films load only when near the screen and pause when scrolled away.
  - The phone or desktop crop is chosen in script, because Safari ignores
    `media` on video sources.
  - With reduced motion, nothing plays by itself and the destination waits for
    its chapter buttons.
  - Each looping film has a pause control.
  - If a browser refuses to play (for example iPhone Low Power Mode), the still
    remains.
- **Pictures.** They load lazily, apart from the first screen, and come in 480
  and 800 px cuts beside the review file. The provisional mark loads as 240 and
  480 px WebP.
- **Rebuilding the cuts.** `tools/review-variants.py` and `tools/video-poster.swift`
  rebuild the cuts and stills from the review files.

## Footer and cookie preferences

The homepage has one footer:
- the pages of the 2027 site map;
- the live Privacy & Cookie Notice, which serves as both Privacy Policy and Cookie Policy;
- a working Cookie preferences control, which opens the site's consent dialog.

Terms & Conditions and the 2027 contact and social details appear only in
internal review, marked pending (A7, A8), never as links. The consent banner
keeps its wording and takes the 2027 colours on 2027 pages. The Meta Pixel can
load only on production; previews store the choice but never track.

## Contrast

Small text on ivory uses `#7A5A22` (5.5:1). Other contrast choices:
- The deeper `#8C6B34` (4.3:1) appears only on large italic headline text
  (at least 24 px), where 3:1 is enough.
- Inactive lines on black are ivory at 60% (6.5:1) or more.
- Focus rings on ivory sections are `#7A5A22`.
- The rail arrows' border is `#8C6B34` (4.3:1 against the 3:1 non-text minimum).
- The gold "Photograph awaited" panels use `#4A3510` (at least 5.7:1).

Lighthouse accessibility scores 100 at 1440, 1280, 834 and 412 px.

## Open follow-ups (recorded 2026-11-10)

- **Phone load time (A2).** On a simulated slow 4G phone the largest element
  appears at about 5.0 s, mostly render delay. The main cause is
  `app/layout.tsx` (the live 2026 site's root layout): it preloads the 2026
  fonts on every page, 2027 included. It is not changed here, so the live site
  stays as it is. The fix belongs with A2: give the 2027 site its own root
  layout, through route groups, that loads only its own fonts.
- **A2.** One 2027 homepage (this one) and a shared header and footer across all
  13 pages. The direction is approved; the work is not started.
- **A7.** Approved 2027 contact details and social accounts.
- **A8.** Approved 2027 privacy and cookie notices, and Terms & Conditions. The
  footer links the existing HEBS Lagos 2026 Privacy & Cookie Notice only as the
  current live notice; that is not approval of any 2027 legal wording.
- **Visual corrections still to authorise:**
  - the two hero photographs;
  - the NJS pool frame line;
  - the surf-on-rocks scene;
  - the 25 July image.
- **Media rights and owner approvals** in `MEDIA-REGISTER.md`.

## 2026 Champions (internal review)

The winners block shows the prize-presentation photographs the owner approved
on 2026-11-10 (`REVIEW_CHAMPIONS` in `lib/content/winners-2026.ts`):
- two featured photographs and two highlights;
- one photograph per competition in the rail. Lash Couture has none, and Fast &
  Flawless Barber shows its 3rd-place presentation, labelled as such.

Placings are as printed on the cheques. No winner is named and no prize is
stated; both await the organisers' verification (and D8). The selection is
review media, so a production build never shows it: production renders approved,
verified winners only (`WINNERS`), and hides the block while there are none.

The photographs are working copies of the photographers' originals (House of
Snapp collection). Neither the originals nor the copies are committed. To
rebuild the copies from the authorised originals:

    python3 docs/design/2027-home/tools/champions-images.py <originals> public/_review/home-2027/champions

`tools/champions-crops.json` holds, for each image:
- the original's filename and SHA-256 (the script refuses any other file);
- the crop, its role and its widths;
- whether it is sharpened.

Corrections are global only: crop, a 0.1% levels stretch, light sharpening after
resizing (none for ISO 1600+ frames) and WebP quality 90. Each width is resampled
once from the original, and the browser picks the closest size (`srcset`).
Nothing is retouched, reconstructed or generated. With Pillow 10.4.0 the output
is byte-identical.

## Provisional mark

`tools/provisional-mark-2027.py` reproduces the provisional mark from the
official 2026 master (which it only reads): it removes the 2026 digits,
restores the gold continent and sets 2027 inside it, checking that no part of
the year crosses the coastline. Version A:
`python3 provisional-mark-2027.py <2026-master.png> out.png indigo 1662 1700 250 0.06`.

See `MEDIA-REGISTER.md` for the open media and rights dependencies.

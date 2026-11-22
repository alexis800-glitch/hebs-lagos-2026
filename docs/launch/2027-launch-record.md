# HEBS Lagos 2027: launch record

## Authorisation (21 Nov 2026)

HEBS management's written launch decision to Veridion, 21 Nov 2026:

1. **Website launch approved**: the launch scope covers all 13 HEBS Lagos 2027 pages. Mrs. Shuler's separate written authorisation is to be documented if the owner approval process requires it.
2. **Website wording approved**: Veridion has authority to finalise the professional wording (Tickets introduction, Travel & Accommodation, Watch introduction, all standard descriptions), using approved facts and keeping the 2026 and 2027 venues distinct, with no invented facilities, room availability, opening dates or locations.
3. **Email**: enquiries@, sponsors@ and exhibitors@hebslagos.com are intended. They are not shown until a send-and-receive test passes. The information-only site may be prepared without a published address.
4. **Portal**: Base44 security v4.1 is active with payments frozen. No security control is disabled, the freeze is not lifted, and no sales open before the legal, technical and operational checks pass.

## What the launch commit records

- `lib/launch-2027-config.ts`:
  - `authorisation` (HEBS management, 21 Nov 2026);
  - `pages`: all 13;
  - `deferred`: NJS resort photography, the priority form, the QR code, partner inquiries;
  - `toBeAnnounced`: day opening hours, and the education and 2026-highlights register slots, which show approved 2026 photographs or a typographic panel.
- `lib/content/signoff-launch-2027.json`: the exact final text of every line approved under item 2, recorded as decision `launch:wording-2026-11-21`.
  - Before recording, Veridion corrected four lines that implied unverified facilities or stays: the pool terrace on the homepage, "a place to stay" twice, and the internal-review sentence in the Watch introduction.
  - Excluded on purpose: `pages.tickets.willSupportNote` (what registration will include). Those are commitments that stay withheld while sales and payments are closed.
- Forms stay closed (`FORMS_OPEN` all false). Production booking links stay closed (`PRODUCTION_PORTAL` awaiting Desktop's acceptance). Ticket prices are shown with sales closed.

## Release instruction (21 Nov 2026, late)

HEBS management's explicit instruction: "PROCEED WITH THE HEBS LAGOS 2027 INFORMATION-ONLY WEBSITE LAUNCH." It covers all 13 pages, the final wording, the 2026 recap film, Travel & Accommodation and the design, and authorises pushing the release branch, merging into master and deploying to hebslagos.com once all production safety gates pass.

It is given within HEBS management's authorised project responsibilities and is **not** recorded as Mrs. Shuler's written approval. No binding legal restriction on publication was identified. Mrs. Shuler's own written authorisation remains a records item under the owner approval process.

Kept disabled: public registration, ticket sales, payments (portal EV_PAYMENTS_FROZEN), email-dependent forms, unverified email addresses, unapproved legal documents and unverified NJS information.

## Rollback

Set `HEBS_2027_WITHHOLD=on` in production and redeploy: every 2027 address returns to a missing page and the 2026 site is unaffected. See docs/launch/LAUNCH-2027.md.

## Corrections, 22 Nov 2026 (private branch website/2027-corrections)

HEBS management's instruction after the directive compliance audit:
- **Venue imagery:** the 2026 photographs from NJS Royale Events Center (Lekki) no longer appear beside NJS Beach Resort.
  - The "Beauty meets paradise" section is text-led: verified facts, a link to njsbeachresort.com, and a note that photographs follow.
  - The "Luxury Destination Experiences" card is text-led.
  - "Entertainment and Celebrations" no longer says "at the resort".
- **Social links:** the official Instagram and Facebook accounts published on the live HEBS site appear on Contact and in the footer (`lib/site/social-2027.ts`).
- **Directive section G:** the homepage has its own Education & Masterclasses block.
- **Hero buttons:** the hero carries "Become a sponsor".
- **Wording:** recorded as decision `correction:wording-2026-11-22`.

Not deployed. Production changes need separate authorisation.

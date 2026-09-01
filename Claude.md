# HEBS Lagos 2026 — Project Rules

## Project Identity

This repository is **HEBS Lagos 2026**.

* Repository: `alexis800-glitch/hebs-lagos-2026`
* Production domain: `www.hebslagos.com`

This is a **live production event website**, not a concept site.

This repo is **not** the NJS Royal Beach Resort project. Do not apply NJS rules here:

* no NJS workspace paths (`NJS_ROYALE_WEBSITE_ASSETS`, `website-build`)
* no rooftop-pool rules
* no rooms/suites or "Signature Spaces" naming rules
* no resort reference folders (`floor-plans`, `mep-drawings`, `pool-and-sections`)
* no concept-stage reservation wording ("Enquire Now", "Reservations opening soon")

Because this site is live and sells real competition entries, it uses direct
registration language pointing at the live portal. Concept-stage hedging is wrong here.

## Source of Truth

`lib/competitions.ts` is the canonical source for competition programme data.

Do **not** hard-code competition counts, categories, entry fees, prize totals,
schedules or main event hours anywhere else when a derived value exists. Import
from `lib/competitions.ts` so values cannot drift apart.

Invariants at the bottom of that file run at module load, so `npm run build`
fails loudly if the data stops matching the approved programme. Treat a failing
invariant as a real conflict to raise, never as an obstacle to edit around.

### Current approved programme

* **13 competitions**
* **7 categories** — Barbering, Braiding, Hair Installation & Styling, Beauty,
  Fashion, Culinary & Culture, Loc/Styling
* **All contestant entry fees ₦50,000** — one flat naira fee, published in naira
  only. There is deliberately no `feeUsd` field; never render a USD entry fee.
* **Total prize pool $87,500 USD / ₦122,500,000** (at the approved ₦1,400/USD
  rate, prizes only)
* **Registration deadline: October 15, 2026**

## Event Hours

`EVENT_DAYS` in `lib/competitions.ts` is the one place summit opening hours are
written down. The schedule cards, footer, tickets page, assistant answer, JSON-LD
and the competitions page all render from it.

* **Saturday, October 24, 2026 — 11:00 AM–6:00 PM**
* **Sunday, October 25, 2026 — 10:00 AM–5:00 PM**

These are **full summit operating hours, not individual competition times**.
Individual competitions run at their own times inside them, and the site copy
must keep that distinction clear.

The **October 23 Welcome Beach Pre-Party** is a separate evening at a different
venue. It is deliberately absent from `EVENT_DAYS` and must not be folded in.
It keeps its own wording on its own card.

An invariant asserts every competition slot falls inside its day's hours. If a
slot and the hours ever disagree, one of them is wrong — stop and raise it.

## Loc/Styling

**Loc Retwist & Style Competition** is the approved Lagos competition.

* Saturday, October 24, 2026, 4:00–5:00 PM, 60 minutes
* Natural locs, full-head retwist, no added hair
* Up to $5,000 in cash prizes

Never reintroduce **Mic Drop** as an active competition — it was withdrawn and
Loc Retwist & Style took its slot and category place.

Never use **DOMINION**, **Winner-Take-All** or **$10,000** language. That wording
comes from `Loc_Retwist_and_Style_Competition_Updated (1).pdf`, confirmed to be
the wrong document for Nigeria. None of it applies and it must not reappear.

## Known Special Competition Rules

**Gilded Heritage Nail Art Competition**

* October 24, 2:00–3:30 PM, 90 minutes
* The nail length must be a minimum of **one inch**
* The overlap with Freestyle Design is intentional — do not "fix" it

**Fast & Flawless Barber Competition**

* October 25, 4:00–4:15 PM, 15 minutes
* Prize is a **flat $5,000**, not "up to" (`prizeIsUpTo: false`)
* Roots to Royalty also states a flat figure and must never render an "Up to" prefix

**Taste of Culture Food Tasting Competition**

* Runs on **both** summit days (Oct 24 and Oct 25) — it is the one competition
  with two sessions, so anything that assumes one session per competition is wrong

## Base44 Boundary

The **Base44 HEBS Event Portal** is a separate system.

* Do not modify Base44 from this website repo
* Website registration links may point at the live portal
  (`https://hebseventportal.com/register`, exported as `REGISTRATION_URL`)
* Portal logic, schemas and data are **not** maintained here

## Concept Note

* `HEBS_Lagos_2026_Concept_Note.docx` and `.pdf` (tracked) are the current
  generated concept note artifacts
* The generation pipeline lives in `documents/concept-note/source/`
* `HEBS_Lagos_2026_Concept_Note_UPDATED_REVIEW.docx` / `.pdf` (untracked, dated
  August 2, 2026) are **stale leftovers**

Never stage, commit or overwrite those stale review files unless explicitly
instructed.

## Git Safety

* `origin/master` is authoritative
* Local `master` is known **stale and diverged** — do not merge through it, and
  do not branch from it
* New work must branch cleanly from the latest `origin/master`
* Surgical changes only — touch only files the task requires
* Do not include unrelated files in a commit
* Do not commit, push, merge or deploy to production without explicit approval
* Use a preview deployment / PR for review first unless expressly told otherwise

## Context7

Use Context7 when working with:

* Next.js
* React
* Tailwind CSS
* TypeScript
* Next.js Image
* Vercel

## Verification

For website code changes, run:

```
npm run build
npm run lint
npx tsc --noEmit
```

Then report:

1. exact files changed
2. scope of the change
3. build / lint / typecheck results
4. preview URL
5. PR URL
6. confirmation that no unrelated programme data changed

## Content Integrity

Do not invent organiser information — no fabricated names, titles, contacts,
sponsors, judges, testimonials, awards or figures.

When source documents conflict, **stop and identify the conflict** rather than
silently choosing one. Known live conflicts should be surfaced, not resolved by
guesswork.

## If Unsure

Stop and ask before editing.

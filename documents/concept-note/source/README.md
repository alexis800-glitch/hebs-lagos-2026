# HEBS Lagos 2026 Concept Note — source pipeline

This directory holds everything needed to regenerate the HEBS Lagos 2026 concept note.
The published DOCX and PDF at the repository root are **build outputs**. Do not hand-edit
them: any manual change is lost the next time the note is regenerated. Edit the scripts
here instead.

## Files

| File | Role |
|---|---|
| `HEBS_Lagos_2026_Concept_Note_baseline.docx` | **Pristine baseline.** The original concept note as of 29 July 2026, carrying the HEBS logo, Georgia/Calibri type, gold rules and all table styling. Read-only input. Never edit or regenerate this file. |
| `apply_revisions.py` | Applies every approved revision to the baseline and writes the DOCX. |
| `export_pdf.py` | Exports the DOCX to PDF via Microsoft Word. |
| `concept_note_working_draft.md` | Plain-text working draft of the revised copy. Reference and review aid; it is **not** the build input. |
| `README.md` | This file. |

## How to regenerate

From this directory:

```bash
python apply_revisions.py    # baseline -> HEBS_Lagos_2026_Concept_Note.docx
python export_pdf.py         # docx     -> HEBS_Lagos_2026_Concept_Note.pdf
```

Both scripts resolve paths from their own location, so they can be run from any working
directory. Run them in the order above; the export reads what the first script wrote.

Expected output, both written to the repository root:

- `HEBS_Lagos_2026_Concept_Note.docx`
- `HEBS_Lagos_2026_Concept_Note.pdf` (15 pages)

## Requirements

- Python with `python-docx` and `pywin32`
- **Microsoft Word is currently required for PDF export.** `export_pdf.py` drives Word
  through COM. There is no LibreOffice or pure-Python fallback in this pipeline, so the
  PDF step only runs on a Windows machine with Word installed. The DOCX step has no such
  dependency. Note that the .NET Word interop assembly is broken on the current machine
  (`TYPE_E_CANTLOADLIBRARY`), which is why the script uses late-bound COM. Do not
  "simplify" it back to early binding or to PowerShell's `New-Object -ComObject`.

## Why the script edits a baseline instead of building a document

`apply_revisions.py` opens the baseline and rewrites only the specific paragraphs, table
cells and list items that changed, cloning existing elements whenever new content is
added. That is what keeps the logo, fonts, borders, shading and spacing identical to the
approved original. It also means the script indexes into the baseline's body by position,
so **replacing the baseline invalidates those indices** and the script would need
reworking. The asserts throughout exist to fail loudly if that ever happens.

## Approved figures — do not change without explicit sign-off

The competition programme was restructured on 2026-08-02 from the organiser-supplied
`Hebs Lagos Competitions.docx`, replacing the former Signature / Barber / Braiding track
model. The **price revision of 2026-08-03**, taken from `Hebs Lagos Competitions.
reviewed.docx` and the accompanying management decisions, supersedes it:

- **thirteen competitions across seven categories** — the Fast & Flawless Barber
  Competition is reinstated as the third Barbering event (Sunday 25 October, 4:00 to
  4:15 PM, 15 minutes, $5,000 prize)
- **one flat contestant entry fee of ₦50,000** for every competition, published in naira
  only. The earlier flyer-derived USD tiers ($50 / $75 / $100 and their ₦70,000 /
  ₦105,000 / ₦140,000 equivalents) are withdrawn and must not reappear
- approved total prize pool **$87,500 USD / ₦122,500,000** at **₦1,400 per USD**. This
  supersedes $82,500 / ₦115,500,000, $80,000 / ₦112,000,000, $87,000 and $92,500

₦1,400 per USD now applies to **prizes only**. Contestant entry fees are no longer
converted from USD at any rate.

Per-competition prizes come from the competition flyers linked inside the supplied
document. The script asserts that the thirteen prize rows total exactly $87,500 and
₦122,500,000, and that every entry fee equals ₦50,000, so an edit that breaks either
fails the build rather than shipping.

Sanity checks for a correct build:

- exactly **13** competitions, and 13 rows plus a total row in the prize table
- exactly **3** Barbering competitions
- headline **$87,500 USD / ₦122,500,000**, and **zero** occurrences of $82,500, $80,000,
  $87,000, $92,500, ₦115,500,000, ₦112,000,000 or ₦121,800,000
- every entry fee reads **₦50,000**, with zero occurrences of ₦70,000, ₦105,000, ₦140,000,
  or any USD entry-fee figure

Also approved as published and **not** to be changed without sign-off: sponsorship tiers,
exhibitor and vendor booth packages, and attendee ticket prices. Those remain quoted in
USD — the naira-only rule applies to contestant entry fees, not to booths or tickets.

### Resolved

- **Entry-fee rate conflict resolved.** The flyers quoted ₦1,400 per USD while the portal
  screenshots quoted ₦1,000 per USD ($50 = ₦50,000). The 2026-08-03 management decision
  settles it: a flat ₦50,000 with no USD equivalent, matching the portal. The website and
  the concept note now agree.
- **Freestyle Braid Art entry fee** is no longer unverified — it takes the same flat
  ₦50,000 as every other competition. Its $10,000 prize is unchanged.
- `concept_note_working_draft.md` is regenerated from the built DOCX and matches it.

## Still open

Items awaiting confirmation are tracked outside this directory: the split of the 200
sponsored Epe contestants across categories, the 24 October running order, and on-site
cooking logistics for Taste of Culture.

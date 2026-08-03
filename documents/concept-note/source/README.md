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
- `HEBS_Lagos_2026_Concept_Note.pdf` (13 pages)

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
`Hebs Lagos Competitions.docx`: **twelve competitions across seven categories**, replacing
the former Signature / Barber / Braiding track model. The obsolete Fast & Flawless Barber
Challenge, Barber Games and Braids & Fades Showdown no longer appear.

The approved total prize pool is **$82,500 USD / ₦115,500,000** at the approved rate of
**₦1,400 per USD**. This supersedes $80,000 / ₦112,000,000, $87,000 and $92,500.

Per-competition prizes and entry fees come from the competition flyers linked inside the
supplied document. The script asserts that the twelve prize rows total exactly $82,500 and
₦115,500,000, so an edit that breaks the total fails the build rather than shipping.

Sanity checks for a correct build:

- exactly **12** competitions, and 12 rows plus a total row in the prize table
- headline **$82,500 USD / ₦115,500,000**, and **zero** occurrences of $80,000, $87,000,
  $92,500, ₦112,000,000 or ₦121,800,000
- entry fees at 1,400 per USD: **₦70,000** for $50, **₦105,000** for $75, **₦140,000** for $100

Also approved as published and **not** to be changed without sign-off: sponsorship tiers,
exhibitor and vendor booth packages, and attendee ticket prices.

### Open items

- **Freestyle Braid Art entry fee** is unverified — its flyer link in the supplied document
  is dead, so the fee is shown as confirmed on the registration portal. Its $10,000 prize is
  derived: the eleven verified flyers total $72,500 against the approved $82,500.
- **Entry-fee rate conflict.** Every flyer quotes 1,400 per USD, while the portal
  screenshots used for the website in PR #1 quoted 1,000 per USD ($50 = ₦50,000). The
  concept note follows the flyers; the website has not been changed to match.
- `concept_note_working_draft.md` still reflects the pre-restructure programme.

## Still open

Items awaiting confirmation are tracked outside this directory: the split of the 200
sponsored Epe contestants across categories, the 24 October running order, and on-site
cooking logistics for Taste of Culture.

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

The three Signature Competition entry fees are approved at **$50 USD / ₦50,000**:

- Fashion Runway Competition (Roots to Royalty)
- Makeup Artistry Competition (Bridal Beauty)
- Nail Artistry Competition (Gilded Heritage)

These match the registration portal and the public website. The script deliberately does
**not** rewrite these cells; it asserts the baseline value and leaves them untouched.

Every other fee and prize figure in the document is approved as published and **must not be
changed without explicit approval**, including:

- Barber Championship entry fees (₦70,000, ₦105,000, ₦140,000)
- Braiding Championship entry fees (₦70,000, ₦105,000)
- Taste of Culture Food Tasting Competition ($100 USD / ₦140,000)
- Mic Drop Vocalist Competition ($50 USD / ₦70,000)
- The $80,000 USD / ₦112,000,000 championship prize pool and every track and division
  prize within it
- Cultural competition awards (up to $10,000 and up to $5,000)
- Sponsorship tiers, exhibitor and vendor booth packages, and attendee ticket prices

As a quick sanity check, a correct build contains exactly **three** instances of ₦50,000
(the Signature rows, all in the entry-fee table) and **seven** of ₦70,000 (two Barber,
three Braiding, and Mic Drop twice: its competition block and the cultural fee table).

## Still open

Items awaiting confirmation are tracked outside this directory: the split of the 200
sponsored Epe contestants across categories, the 24 October running order, and on-site
cooking logistics for Taste of Culture.

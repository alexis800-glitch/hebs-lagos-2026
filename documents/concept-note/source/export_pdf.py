# -*- coding: utf-8 -*-
"""Export the HEBS Lagos 2026 concept note DOCX to PDF using Microsoft Word.

Reads : HEBS_Lagos_2026_Concept_Note.docx (repository root)
Writes: HEBS_Lagos_2026_Concept_Note.pdf (repository root)

Word automation is required. The .NET Word interop assembly is broken on this
machine, so this uses late-bound COM (win32com.client.dynamic) which works around it.
Run apply_revisions.py first to produce the DOCX.
"""
import io, sys, os
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import win32com.client.dynamic as dyn
import pythoncom

REPO = Path(__file__).resolve().parents[3]
docx = str(REPO / 'HEBS_Lagos_2026_Concept_Note.docx')
pdf = str(REPO / 'HEBS_Lagos_2026_Concept_Note.pdf')

pythoncom.CoInitialize()
word = dyn.Dispatch("Word.Application")
word.Visible = False
word.DisplayAlerts = 0
doc = word.Documents.Open(docx, ReadOnly=False, AddToRecentFiles=False)
try:
    doc.Repaginate()
    print("pages:", doc.ComputeStatistics(2))  # wdStatisticPages
    doc.ExportAsFixedFormat(OutputFileName=pdf, ExportFormat=17, OpenAfterExport=False,
                            OptimizeFor=0, CreateBookmarks=0, DocStructureTags=True,
                            BitmapMissingFonts=True, UseISO19005_1=False)
    print("exported")
finally:
    doc.Close(False)
    word.Quit()
print("size:", os.path.getsize(pdf))

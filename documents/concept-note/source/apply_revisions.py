# -*- coding: utf-8 -*-
"""Apply the approved HEBS Lagos 2026 concept note revisions to the pristine baseline
DOCX, preserving the logo, styles, tables and every untouched section.

Reads : HEBS_Lagos_2026_Concept_Note_baseline.docx (this directory, never edited)
Writes: HEBS_Lagos_2026_Concept_Note.docx (repository root)

See README.md in this directory. Run export_pdf.py afterwards to produce the PDF.
"""
import io, sys, copy
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph
from docx.oxml.ns import qn

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
SRC = HERE / 'HEBS_Lagos_2026_Concept_Note_baseline.docx'
OUT = REPO / 'HEBS_Lagos_2026_Concept_Note.docx'

d = Document(str(SRC))
kids = list(d.element.body.iterchildren())          # stable snapshot; insertions don't shift it

def P(i):   return Paragraph(kids[i], d)
def T(i):   return Table(kids[i], d)

# ---------- run-property templates harvested from the document itself ----------
BODY_N = copy.deepcopy(P(8).runs[0]._r.find(qn('w:rPr')))        # Calibri 10.5pt 2B2B2B
BODY_B = copy.deepcopy(P(27).runs[1]._r.find(qn('w:rPr')))       # bold 1A1A1A
_t159  = T(159)
CELL_N = copy.deepcopy(_t159.rows[1].cells[1].paragraphs[0].runs[0]._r.find(qn('w:rPr')))
CELL_H = copy.deepcopy(_t159.rows[0].cells[0].paragraphs[0].runs[0]._r.find(qn('w:rPr')))

def _mkrun(rpr, text):
    from docx.oxml import OxmlElement
    r = OxmlElement('w:r')
    if rpr is not None:
        r.append(copy.deepcopy(rpr))
    t = OxmlElement('w:t')
    t.set(qn('xml:space'), 'preserve')
    t.text = text
    r.append(t)
    return r

def segs(p_el, segments, rn=None, rb=None):
    """Rebuild a paragraph's runs from (text, bold) segments, keeping its pPr."""
    rn = BODY_N if rn is None else rn
    rb = BODY_B if rb is None else rb
    for r in p_el.findall(qn('w:r')):
        p_el.remove(r)
    for text, bold in segments:
        p_el.append(_mkrun(rb if bold else rn, text))

def single(p_el, text):
    """Keep run 0 (and its formatting), set its text, drop the rest. Headings/labels."""
    runs = p_el.findall(qn('w:r'))
    assert runs, 'no runs to retext'
    for r in runs[1:]:
        p_el.remove(r)
    ts = runs[0].findall(qn('w:t'))
    for extra in ts[1:]:
        runs[0].remove(extra)
    ts[0].set(qn('xml:space'), 'preserve')
    ts[0].text = text

def cell_set(cell, segments, header=False):
    p_el = cell.paragraphs[0]._p
    for p in cell.paragraphs[1:]:
        p._p.getparent().remove(p._p)
    rb = copy.deepcopy(CELL_N)
    if rb.find(qn('w:b')) is not None:
        rb.remove(rb.find(qn('w:b')))
    from docx.oxml import OxmlElement
    b = OxmlElement('w:b'); rb.insert(1, b)
    segs(p_el, segments, rn=CELL_H if header else CELL_N, rb=CELL_H if header else rb)

def clone_after(template_el, anchor_el):
    new = copy.deepcopy(template_el)
    anchor_el.addnext(new)
    return new

def clone_before(template_el, anchor_el):
    new = copy.deepcopy(template_el)
    anchor_el.addprevious(new)
    return new

BODY_TPL = kids[8]      # plain body paragraph
LIST_TPL = kids[35]     # ListNumber item
SEC_TPL  = kids[55]     # section heading with gold rule
SUB_TPL  = kids[57]     # track-level subheading (Georgia 12pt)
GOLD_TPL = kids[49]     # gold bold label
META_TPL = kids[69]     # short meta line under a track heading
BLANK_TPL = kids[87]    # empty spacer paragraph

# ============================ EVENT OVERVIEW ============================
segs(kids[6], [
    ("The Hair Education Beauty Summit (HEBS) is an international platform for beauty, culture, and creative enterprise. HEBS launched in ", 0),
    ("New Jersey, USA in 2024", 1),
    (" and returned in ", 0),
    ("2025 with a sold-out edition", 1),
    (" that established its reputation internationally.", 0)])

segs(kids[7], [
    ("In 2026 the summit comes home. ", 0),
    ("HEBS Lagos 2026", 1),
    (" is the inaugural Nigerian edition: three days of education, competition, exhibition, and cultural programming, hosted at two venues on the Lekki-Epe corridor of Lagos.", 0)])

_p = clone_after(BODY_TPL, kids[7])
segs(_p, [
    ("The Lagos edition is broader than the editions before it. Alongside hair, barbering, braiding, makeup, nails, and fashion, the 2026 programme adds ", 0),
    ("cultural food and live music competition", 1),
    (", and is built in partnership with the tourism and hospitality identity of the Epe region that hosts it.", 0)])

segs(kids[8], [("The summit brings together the full value chain of the beauty and creative economy under one roof, including hairstylists, barbers, braiders, makeup artists, nail technicians, fashion designers, chefs, caterers, seafood and cultural food vendors, vocalists and music creatives, educators, salon owners, manufacturers, distributors, investors, tourism and hospitality stakeholders, and brand leaders from Nigeria, across Africa, and the diaspora.", 0)])

segs(kids[9], [
    ("It is where ", 0),
    ("education meets opportunity, creativity meets commerce, culture meets industry, and Nigerian talent connects with the global marketplace.", 1)])

# ============================ AT A GLANCE ============================
g = T(11)
assert g.rows[3].cells[0].text.strip() == 'Total prize pool', g.rows[3].cells[0].text
assert g.rows[4].cells[0].text.strip() == 'Competition tracks', g.rows[4].cells[0].text
cell_set(g.rows[3].cells[0], [("Championship prize pool", 0)])
cell_set(g.rows[4].cells[0], [("Competition programme", 0)])
cell_set(g.rows[4].cells[1], [("Five competition tracks covering beauty, barbering, braiding, cultural food, and live vocal performance", 0)])
cell_set(g.rows[5].cells[1], [("Education, exhibition, competition, panels, networking, cultural food, live music, and hospitality experiences", 0)])

# ============================ DATE AND VENUE ============================
segs(kids[22], [("Exhibition floor, education sessions, panel discussions, championship competition, cultural food tasting, and live vocal competition.", 0)])
segs(kids[26], [("Exhibition continues, alongside masterclasses, panels, cultural food tasting, and the Live Championship Finals.", 0)])
segs(kids[27], [
    ("Exhibition days are ", 0),
    ("October 24 and 25, 2026", 1),
    (". The Main Summit venue offers three activated floors, a main stage, masterclass spaces, a cultural food and tasting area, and a dedicated exhibition and vendor floor.", 0)])

# ============================ THEME AND POSITIONING ============================
segs(kids[32], [("HEBS Lagos is built as a platform for Nigeria’s beauty and creative industries, positioning the country as a serious destination for beauty, culture, entrepreneurship, and international collaboration.", 0)])
segs(kids[33], [("The 2026 edition widens that platform. Beauty, fashion, hair, food, music, tourism, and hospitality are not separate economies in Nigeria. They are the same creative economy, powered by the same entrepreneurs, serving the same audience, and carrying the same cultural story. HEBS Lagos 2026 programmes them together: the salon floor, the kitchen, the runway, and the stage in one venue, across one weekend.", 0)])
_p = clone_after(BODY_TPL, kids[33])
segs(_p, [("The 2026 edition is also a homecoming. An industry built and proven in the diaspora returns to the culture that shaped it, bringing international standards, international buyers, and international attention with it, and doing so in a region of Lagos whose own identity is built on tourism, hospitality, fishing, and food.", 0)])

# ============================ WHAT SETS HEBS APART ============================
segs(kids[35], [
    ("Industry fusion.", 1),
    (" A single platform where hairstylists, barbers, braiders, makeup artists, nail technicians, fashion designers, chefs, cultural food vendors, vocalists, and educators work alongside each other and alongside global influencers, rather than in separate events.", 0)])
segs(kids[37], [
    ("A serious competition purse.", 1),
    (" An ", 0),
    ("$80,000 USD (₦112,000,000)", 1),
    (" cumulative championship prize pool, the largest in African beauty competition, staged as a full production with music, lighting, and a live audience.", 0)])
_p = clone_after(LIST_TPL, kids[37])
segs(_p, [
    ("Culture on the programme, not on the poster.", 1),
    (" Local food, seafood heritage, and live music are competition categories in their own right, with their own judges, their own stage time, and their own prizes.", 0)])

# ============================ OBJECTIVES ============================
segs(kids[40], [("HEBS Lagos 2026 is built to deliver against seven objectives.", 0)])
segs(kids[42], [
    ("Connect professionals worldwide.", 1),
    (" Create a hub where stylists, barbers, braiders, makeup artists, nail technicians, chefs, music creatives, educators, and brand leaders can meet and build lasting commercial relationships.", 0)])
segs(kids[44], [
    ("Drive commercial growth.", 1),
    (" Connect exhibitors, manufacturers, distributors, and food and hospitality vendors directly to a concentrated, qualified audience and to new distribution channels.", 0)])
obj_new = _p = clone_after(LIST_TPL, kids[44])
segs(_p, [
    ("Celebrate and commercialise local culture.", 1),
    (" Give the food, seafood, music, and hospitality traditions of the host region a professional competitive platform, and turn cultural pride into visibility, bookings, and business for local vendors and creatives.", 0)])
segs(kids[45], [
    ("Position Lagos internationally.", 1),
    (" Establish the city, and the Lekki-Epe tourism corridor within it, as an emerging beauty, culture, and destination-event location that attracts delegates, media, and investment.", 0)])
segs(kids[46], [
    ("Support the next generation.", 1),
    (" Help keep the future of beauty, grooming, fashion, food, and creative enterprise in Nigeria inclusive, innovative, and grounded in technical skill.", 0)])

# ============================ TARGET AUDIENCE ============================
segs(kids[48], [
    ("Expected attendance is 3,000+", 1),
    (" beauty, culture, and creative professionals, educators, creators, and consumers from Nigeria, West Africa, and the wider HEBS community, including international competitors and delegates from the United States, the United Kingdom, and across West Africa.", 0)])

anchor = kids[50]
for label, body in [
    ("Food and Hospitality Attendees",
     "Food vendors, chefs, caterers, seafood vendors, cultural food entrepreneurs, restaurateurs, catering businesses, and hospitality operators."),
    ("Music and Performance Attendees",
     "Vocalists, music creatives, performers, producers, artist managers, and entertainment professionals."),
]:
    lab = clone_after(GOLD_TPL, anchor); single(lab, label)
    bod = clone_after(BODY_TPL, lab);    segs(bod, [(body, 0)])
    anchor = bod

segs(kids[52], [("Global beauty brands, investors, manufacturers, distributors, brand founders, creative entrepreneurs, tourism and hospitality stakeholders, and industry media.", 0)])
single(kids[53], "Community and Cultural Audience")
segs(kids[54], [("The Epe community and its cultural representatives, beauty and food consumers, cultural attendees, and the wider Lagos creative community, drawn by the competition production, runway presentations, cultural food programming, and pre-party programming.", 0)])

# ==================== NEW SECTION: EPE CULTURAL AND TOURISM ACTIVATION ====================
head = clone_before(SEC_TPL, kids[55]); single(head, "Epe Cultural and Tourism Activation")
epe = [
    [("HEBS Lagos 2026 is hosted on the Lekki-Epe corridor, in a part of Lagos State known for its tourism and hospitality economy, its fishing communities, and one of the strongest seafood and cultural food traditions in the country. The 2026 edition is built to reflect that identity rather than sit apart from it.", 0)],
    [("Two new competition categories carry the activation. The ", 0),
     ("Taste of Culture Food Tasting Competition", 1),
     (" puts Epe’s seafood and cultural cooking on a judged stage in front of thousands of attendees, and the ", 0),
     ("Mic Drop Vocalist Competition", 1),
     (" gives local and visiting vocal talent a professional main-stage platform. Both categories are held on the exhibition days, in the same venue, in front of the same audience, judges, sponsors, and media as the beauty championships.", 0)],
    [("The intent is straightforward. Cooks, caterers, seafood vendors, cultural food entrepreneurs, vocalists, and music creatives receive the same standard of platform, judging, production, and commercial exposure that HEBS already gives to stylists, barbers, and braiders.", 0)],
    [("A proposed Epe community sponsorship will support ", 0),
     ("up to 200 contestants", 1),
     (" by covering their entry participation, creating access for local talent and strengthening community participation. Contestant allocation across categories will be confirmed with the sponsor ahead of registration.", 0)],
    [("Beyond competition, the activation is designed to deliver measurable local value: visibility for Epe as a destination for food, hospitality, and cultural tourism; trade for local food vendors, caterers, transport operators, and hospitality businesses across the event weekend; a route to market for cultural food entrepreneurs seeking catering contracts, retail listings, and media coverage; and a recurring annual platform that returns to the region each year rather than a single visit.", 0)],
]
anchor = head
for s in epe:
    anchor = clone_after(BODY_TPL, anchor); segs(anchor, s)

# ============================ COMPETITION CATEGORIES ============================
segs(kids[56], [
    ("HEBS Lagos 2026 stages ", 0),
    ("five competition tracks", 1),
    (": three Signature Competitions, the Barber Championship, the Braiding Championship, the Taste of Culture Food Tasting Competition, and the Mic Drop Vocalist Competition. The three championship tracks carry a combined prize pool of ", 0),
    ("$80,000 USD (₦112,000,000)", 1),
    (".", 0)])
single(kids[57], "Signature Competitions")
single(kids[68], "Barber Championship")
single(kids[75], "Braiding Championship")

# new cultural competition blocks, appended after the braiding closing paragraph
def block(anchor, heading, meta, bodies):
    h = clone_after(SUB_TPL, anchor); single(h, heading)
    a = h
    for m in meta:
        a = clone_after(META_TPL, a)
        # a plain string keeps the template's own italic meta styling (matches the
        # date line under Barber and Braiding); a segment list gets body styling
        single(a, m) if isinstance(m, str) else segs(a, m)
    for b in bodies:
        a = clone_after(BODY_TPL, a); segs(a, b)
    return a

anchor = block(kids[81], "Taste of Culture Food Tasting Competition",
    ["October 24 and 25, 2026, at NJS Royale Events Center.",
     [("Entry fee: ", 0), ("$100 USD / ₦140,000", 1), (".", 0)],
     [("Awards: ", 0), ("up to $10,000 USD (₦14,000,000)", 1), (" in cash prizes.", 0)]],
    [[("Present your best cultural signature dish.", 1),
      (" Taste of Culture is a cultural food competition built around the seafood and fish traditions that Epe and its fishing communities are known for, and around the wider cultural cooking of Lagos and Nigeria. Competitors prepare and present a signature dish for tasting on the exhibition floor across both event days.", 0)],
     [("Two awards are contested. ", 0), ("Judges’ Choice", 1),
      (" is decided by a professional panel assessing flavour, technique, presentation, and the cultural story behind the dish. ", 0),
      ("People’s Choice", 1), (" is decided by the summit audience, giving attendees a direct vote in the outcome.", 0)],
     [("Open to chefs, caterers, restaurateurs, seafood and cultural food vendors, catering businesses, and home cooks. Competition format, tasting logistics, and full judging criteria are confirmed on the official registration portal.", 0)]])

block(anchor, "Mic Drop Vocalist Competition",
    ["October 24, 2026, at NJS Royale Events Center.",
     [("Entry fee: ", 0), ("$50 USD / ₦70,000", 1), (".", 0)],
     [("Awards: ", 0), ("up to $5,000 USD (₦7,000,000)", 1), (" in cash prizes.", 0)]],
    [[("Mic Drop is a live vocal competition staged on the HEBS main stage, in front of the judges, sponsors, media, and the full summit audience. Competitors perform live and are judged on vocal ability and performance, competing for up to $5,000 in cash prizes.", 0)],
     [("Open to vocalists and music creatives from Lagos, across Nigeria, and beyond, at professional and emerging level. Performance format, round structure, judging criteria, and time allowance are confirmed on the official registration portal.", 0)]])

# ============================ PRIZE POOL ============================
pt = T(86)
assert pt.rows[4].cells[0].text.strip() == 'Total', pt.rows[4].cells[0].text
cell_set(pt.rows[4].cells[0], [("Total championship prize pool", 0)], header=True)

# note + cultural awards table, inserted after the prize table's spacer paragraph
note = clone_after(BODY_TPL, kids[87])
segs(note, [("Cultural competition awards are additional to the championship prize pool and are staged as part of the Epe Cultural and Tourism Activation.", 0)])

def clone_table_3row(template_tbl_el, anchor_el, rows):
    """Clone a 2-column table template down to a header + 2 body rows."""
    new = copy.deepcopy(template_tbl_el)
    anchor_el.addnext(new)
    tbl = Table(new, d)
    while len(tbl.rows) > len(rows):
        new.remove(tbl.rows[-1]._tr)
        tbl = Table(new, d)
    for ri, (c0, c1) in enumerate(rows):
        cell_set(tbl.rows[ri].cells[0], [(c0, 0)], header=(ri == 0))
        cell_set(tbl.rows[ri].cells[1], [(c1, 0)], header=(ri == 0))
    return new

awards = clone_table_3row(kids[159], note, [
    ("Cultural Competition", "Awards"),
    ("Taste of Culture Food Tasting Competition", "Up to $10,000 USD (₦14,000,000)"),
    ("Mic Drop Vocalist Competition", "Up to $5,000 USD (₦7,000,000)"),
])
clone_after(BLANK_TPL, awards)

# ============================ EXPECTED IMPACT ============================
segs(kids[140], [
    ("HEBS Lagos is not only a competition. It is an ", 0),
    ("economic development platform", 1),
    (" intended to help Nigerian and African talent build recognised brands through education, investment, innovation, tourism, food, manufacturing, and international partnership.", 0)])
segs(kids[142], [("A platform that supports entrepreneurs, creates jobs, and drives business growth across Nigeria’s beauty, food, and creative industries by connecting practitioners to training, capital relationships, and the market access they need to scale.", 0)])
segs(kids[144], [("Attracting international visitors, delegates, competitors, and foreign investment to Lagos, positioning the city and the Lekki-Epe corridor as an emerging beauty, culture, and destination-event location, with direct spillover into hospitality, food service, transport, and local commerce in the host community.", 0)])
segs(kids[146], [("Strengthening international trade by connecting Nigerian manufacturing, distribution, product innovation, and cultural food enterprise to global markets, buyers, and distribution partners.", 0)])
segs(kids[148], [("Raising the technical standard of the sector through strong education and international benchmarking, and building a repeatable annual platform that grows in value for participants, brands, and the host region each year.", 0)])
segs(kids[149], [
    ("HEBS Lagos 2026 is designed to become ", 0),
    ("Nigeria’s premier annual beauty, fashion, culture, and creative industries summit", 1),
    (", and an anchor event on the African and international industry calendar.", 0)])

# ============================ REGISTRATION ============================
rt = T(153)
assert 'Registration Opens' in rt.rows[1].cells[0].text, rt.rows[1].cells[0].text
cell_set(rt.rows[1].cells[2], [
    ("Register at hebseventportal.com/register and pay the entry fee for your chosen category. Open worldwide to fashion designers, fashion stylists, makeup artists, nail artists, creative directors, barbers, braiders, chefs and cultural food entrepreneurs, vocalists, and beauty, culture, and fashion visionaries.", 0)])

# Signature entry fees stay at the portal rate of $50 USD / NGN 50,000 (confirmed
# 2026-08-02). Left exactly as authored in the source document: assert only, no rewrite.
ft = T(159)
for r in range(1, 4):
    txt = ft.rows[r].cells[1].text.strip()
    assert txt == '$50 USD / ₦50,000', f'unexpected Signature fee: {txt!r}'


def cell_sub(cell, old, new):
    """Replace text inside a cell run, leaving every run property untouched."""
    for p in cell.paragraphs:
        for r in p.runs:
            if old in r.text:
                r.text = r.text.replace(old, new, 1)
                return
    raise AssertionError(f'{old!r} not found in cell {cell.text!r}')


# Barber and Braiding naira fees corrected to the live portal values (confirmed from
# portal screenshots 2026-08-02). USD amounts are unchanged. The trailing bold runs
# ("for the whole team, not per barber" / "for the two-person team, not per person")
# are left in place, so the team-fee meaning is preserved.
barber_ft = T(163)
for row, old, new in [(1, '₦70,000', '₦50,000'),
                      (2, '₦70,000', '₦50,000'),
                      (3, '₦105,000', '₦75,000'),
                      (4, '₦140,000', '₦100,000')]:
    cell_sub(barber_ft.rows[row].cells[1], old, new)

braid_ft = T(166)
for row, old, new in [(1, '₦70,000', '₦50,000'),
                      (2, '₦70,000', '₦50,000'),
                      (3, '₦70,000', '₦50,000')]:
    cell_sub(braid_ft.rows[row].cells[1], old, new)
# Freestyle Braid Art Championship stays at $75 USD / NGN 105,000
assert '₦105,000' in braid_ft.rows[4].cells[1].text, braid_ft.rows[4].cells[1].text

# cultural competitions fee block after the braiding fee table's spacer
lab = clone_after(kids[165], kids[167]); single(lab, "Cultural Competitions")
cft = clone_table_3row(kids[159], lab, [
    ("Category", "Entry Fee"),
    ("Taste of Culture Food Tasting Competition", "$100 USD / ₦140,000 per entry"),
    ("Mic Drop Vocalist Competition", "$50 USD / ₦70,000 per competitor"),
])
clone_after(BLANK_TPL, cft)

# ============================ OBJECTIVES LIST RESTART ============================
# The List Number style shares one numId, so Objectives continued the previous list
# (originally 5-10 under "six objectives"). Give Objectives its own restarting numId.
from docx.oxml import OxmlElement

numbering = d.part.numbering_part.element
NEW_NUMID = '10'
_n = OxmlElement('w:num')
_n.set(qn('w:numId'), NEW_NUMID)
_a = OxmlElement('w:abstractNumId'); _a.set(qn('w:val'), '7'); _n.append(_a)   # same look as List Number
_ov = OxmlElement('w:lvlOverride'); _ov.set(qn('w:ilvl'), '0')
_so = OxmlElement('w:startOverride'); _so.set(qn('w:val'), '1'); _ov.append(_so)
_n.append(_ov)
numbering.append(_n)

def set_numid(p_el, numid):
    pPr = p_el.find(qn('w:pPr'))
    numPr = pPr.find(qn('w:numPr'))
    if numPr is None:
        numPr = OxmlElement('w:numPr')
        pStyle = pPr.find(qn('w:pStyle'))
        (pStyle.addnext(numPr) if pStyle is not None else pPr.insert(0, numPr))
    for tag in ('w:ilvl', 'w:numId'):
        e = numPr.find(qn(tag))
        if e is not None:
            numPr.remove(e)
    ilvl = OxmlElement('w:ilvl'); ilvl.set(qn('w:val'), '0')
    nid = OxmlElement('w:numId'); nid.set(qn('w:val'), numid)
    numPr.append(ilvl); numPr.append(nid)

for _el in [kids[41], kids[42], kids[43], kids[44], obj_new, kids[45], kids[46]]:
    set_numid(_el, NEW_NUMID)

d.save(str(OUT))
print('saved', OUT)

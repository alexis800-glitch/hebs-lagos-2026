"""Provisional HEBS Lagos 2027 mark, year set INSIDE the continent.

Removes the four year digits from the 2026 master, restores the gold continent
(and its edge, where the first digit overhangs it), then sets "2027" as one word
inside the gold silhouette, below LAGOS and the HEBS badge, and checks it fits. Two treatments:
  indigo - the original indigo outline-and-centre, with a fine ivory keyline
  lagos  - white with an orange outline, the treatment of the LAGOS letters
The master is only read.

usage: logo2027c.py <master.png> <out.png> <indigo|lagos> <centreX> <baselineY> <height_px> [tracking] [text]
  text may hold two lines, "20/27", stacked: centreX and baselineY are the first line's,
  and an optional "cx2,base2" ninth argument places the second line.
"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

src, out, style = sys.argv[1], sys.argv[2], sys.argv[3]
CX, BASE, HN = int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])
TRACK = float(sys.argv[7]) if len(sys.argv) > 7 else 0.12
TEXT = sys.argv[8] if len(sys.argv) > 8 else "2027"
SECOND = [int(v) for v in sys.argv[9].split(",")] if len(sys.argv) > 9 else None
im = Image.open(src).convert("RGBA")
W, H = im.size
px = im.load()

def is_ink(p):
    r, g, b, a = p
    return a > 200 and r < 110 and g < 60 and 50 < b < 180

Y0, Y1 = 552, 664
slots = [(345, 420), (620, 700), (895, 975), (1170, 1245)]

# 1. Mask of the old digits, dilated to take their anti-aliased fringe.
ink = Image.new("L", im.size, 0)
ip = ink.load()
for y in range(Y0, Y1):
    for x in range(330, 1260):
        if is_ink(px[x, y]):
            ip[x, y] = 255
ink = ink.filter(ImageFilter.MaxFilter(9))

def bbox(x0, x1):
    xs = [x for y in range(Y0, Y1) for x in range(x0, x1) if is_ink(px[x, y])]
    ys = [y for y in range(Y0, Y1) for x in range(x0, x1) if is_ink(px[x, y])]
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1

boxes = [bbox(a, b) for a, b in slots]
centres = [(b[0] + b[2]) / 2 for b in boxes]
baseline = max(b[3] for b in boxes)

# Continent's left edge through the band, from the rows just above and below it.
def edge_at(y):
    for x in range(250, 700):
        if px[x, y][3] > 60 and not is_ink(px[x, y]):
            return x
    return None

top_y, bot_y = Y0 - 6, Y1 + 6
ex_top, ex_bot = edge_at(top_y), edge_at(bot_y)

# 2. Fill: gold texture copied from the clear band between digits, same rows;
#    outside the continent's edge, transparent.
fill = im.copy()
fp = fill.load()
mp = ink.load()
for y in range(Y0 - 4, Y1 + 4):
    t = (y - top_y) / (bot_y - top_y)
    edge = ex_top + (ex_bot - ex_top) * t
    for x in range(330, 1260):
        if mp[x, y] == 0:
            continue
        if x < edge:
            fp[x, y] = (0, 0, 0, 0)
            continue
        # source: same row, shifted into the gap to the right of the nearest digit
        sx = x + 130 if x < 1150 else x - 130
        while is_ink(px[sx, y]) or mp[sx, y]:
            sx += 7
        fp[x, y] = px[sx, y]
soft = ink.filter(ImageFilter.GaussianBlur(1.2))
im = Image.composite(fill, im, soft)

# 3. The new year, one word inside the continent.
font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Trebuchet MS Bold.ttf", 600)
continent = im.split()[3].point(lambda a: 255 if a > 200 else 0)   # gold silhouette (after repair)

def glyph(ch, h):
    g = Image.new("L", (900, 900), 0)
    ImageDraw.Draw(g).text((150, 100), ch, font=font, fill=255)
    g = g.crop(g.getbbox())
    return g.resize((round(g.width * h / g.height), h), Image.LANCZOS)

M = 16 + HN // 12
odd = lambda v: int(v) | 1
gap = round(HN * TRACK)
layer = Image.new("RGBA", im.size, (0, 0, 0, 0))
ext = Image.new("L", im.size, 0)
lines = TEXT.split("/")
spots = [(CX, BASE)] + ([tuple(SECOND)] if SECOND else [(CX, BASE + round(HN * 1.22))])
widths = []
for text, (cx, base) in zip(lines, spots):
    gl = [glyph(c, HN) for c in text]
    word_w = sum(g.width for g in gl) + gap * (len(gl) - 1)
    widths.append(word_w)
    word = Image.new("L", (word_w + 2 * M, HN + 2 * M), 0)
    x = M
    for g in gl:
        word.paste(g, (x, M)); x += g.width + gap
    x0, y0 = round(cx - word.width / 2), base - HN - M
    if style == "indigo":
        key = word.filter(ImageFilter.MaxFilter(odd(9 * HN / 156))).filter(ImageFilter.GaussianBlur(.8))   # ivory keyline
        core = word.filter(ImageFilter.MinFilter(odd(11 * HN / 156))).filter(ImageFilter.GaussianBlur(.6))  # lighter centre, as 2026
        parts = [((250, 244, 230, 255), key), ((31, 0, 66, 255), word), ((70, 6, 146, 255), core)]
        extent = key
    else:
        out_line = word.filter(ImageFilter.MaxFilter(odd(13 * HN / 156))).filter(ImageFilter.GaussianBlur(.8))  # orange, as LAGOS
        parts = [((250, 106, 26, 255), out_line), ((255, 255, 255, 255), word)]
        extent = out_line
    ext.paste(extent, (x0, y0), extent)
    for colour, mask in parts:
        layer.paste(Image.new("RGBA", word.size, colour), (x0, y0), mask)
# fit check: every inked pixel of the year (outline included) must sit on the gold
outside = sum(1 for e, c in zip(ext.getdata(), continent.getdata()) if e > 40 and c == 0)
im.alpha_composite(layer)
im.save(out, optimize=True)
print(style, TEXT, "spots", spots[:len(lines)], "height", HN, "widths", widths, "pixels outside continent", outside)

#!/usr/bin/env python3
"""Smaller sizes and film posters for the 2027 review media (public/_review/home-2027/, gitignored).

usage: python3 review-variants.py <review_dir> [<poster_png_dir>]

- Images: for each review image wider than 800 px, writes <name>-480.webp and
  <name>-800.webp, each resized once (Lanczos) from the review file. The review
  file stays as the largest size. Nothing is sharpened or retouched.
- Provisional mark: mark-2027-a-240.webp and -480.webp from the PNG master.
- Posters: for each film <clip>.mp4, <clip>-poster.webp from the PNG of its
  first frame. Extract the frame with video-poster.swift:
      swiftc -O video-poster.swift -o video-poster
      ./video-poster <clip>.mp4 <png_dir>/<clip>.png 0.05
  The hero's wide poster is the existing hero-poster.webp.
WebP quality 86. Requires Pillow 10.4.0.
"""
import os, re, sys
from PIL import Image

SKIP_PREFIX = ("champ-", "num-", "mark-", "hero-poster")


def main(d, posters=None):
    for f in sorted(os.listdir(d)):
        p = os.path.join(d, f)
        if not f.endswith(".webp") or f.startswith(SKIP_PREFIX) or f.endswith("-poster.webp") or re.search(r"-\d{3,4}\.webp$", f):
            continue
        im = Image.open(p).convert("RGB")
        if im.width <= 800:
            continue
        for w in (480, 800):
            im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(p[:-5] + f"-{w}.webp", "WEBP", quality=86, method=6)
        print(f, im.size)
    mark = os.path.join(d, "mark-2027-a.png")
    if os.path.exists(mark):
        im = Image.open(mark).convert("RGBA")
        for w in (240, 480):
            im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(os.path.join(d, f"mark-2027-a-{w}.webp"), "WEBP", quality=90, method=6)
    if posters:
        for f in sorted(os.listdir(posters)):
            if f.endswith(".png"):
                Image.open(os.path.join(posters, f)).convert("RGB").save(os.path.join(d, f[:-4] + "-poster.webp"), "WEBP", quality=86, method=6)
                print("poster", f)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)

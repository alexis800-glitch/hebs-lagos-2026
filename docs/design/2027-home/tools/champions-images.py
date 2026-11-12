#!/usr/bin/env python3
"""Rebuild the 2026 Champions review photographs from the photographers' originals.

usage: python3 champions-images.py <originals_dir> <out_dir>

The originals (House of Snapp collection, summit days 24-25 Oct 2026) are never
committed. Each one is checked against the SHA-256 in champions-crops.json, so
only the authorised file can be used. Every width is resampled once from the
original, never from another copy. Corrections are global only: the crop, a
0.1% levels stretch, light sharpening after resizing (skipped for high-ISO
frames, where it would only amplify grain) and WebP quality 90. Nothing is
retouched, reconstructed or generated.

Output goes to public/_review/home-2027/champions/ (gitignored): for each image
<output>-<width>.webp for every width, and <output>.webp, a copy of the largest.
Requires Pillow 10.4.0 for byte-identical output.
"""
import hashlib, json, os, shutil, sys
from PIL import Image, ImageFilter, ImageOps

Image.MAX_IMAGE_PIXELS = None
ASPECT = {"featured": 1.0, "highlight": 1.75, "card": 0.97}


def find(root, name, day):
    wanted = {name.lower(), f"d{day}_{name}".lower(), f"d{day}_{os.path.splitext(name)[0]}.jpg".lower()}
    for d, _, files in os.walk(root):
        for f in files:
            if f.lower() in wanted:
                return os.path.join(d, f)
    raise SystemExit(f"missing original {name} (day {day})")


def main(src_root, out):
    spec = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "champions-crops.json")))
    os.makedirs(out, exist_ok=True)
    for img in spec["images"]:
        path = find(src_root, img["file"], img["day"])
        digest = hashlib.sha256(open(path, "rb").read()).hexdigest()
        if digest != img["sha256"]:
            raise SystemExit(f"{img['file']}: not the authorised original (SHA-256 mismatch)")
        im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        crop = ImageOps.autocontrast(im.crop(tuple(img["crop"])), cutoff=(0.1, 0.1))
        aspect = ASPECT[img["role"]]
        files = []
        for w in img["widths"]:
            sized = crop.resize((w, round(w / aspect)), Image.LANCZOS)
            if img["sharpen"]:
                sized = sized.filter(ImageFilter.UnsharpMask(radius=0.6, percent=30, threshold=2))
            name = f"{img['output']}-{w}.webp"
            sized.save(os.path.join(out, name), "WEBP", quality=90, method=6)
            files.append(name)
        shutil.copyfile(os.path.join(out, files[-1]), os.path.join(out, f"{img['output']}.webp"))
        print(img["file"], img["role"], img["widths"])


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2])

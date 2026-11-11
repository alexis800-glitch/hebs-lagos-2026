#!/usr/bin/env python3
"""Rebuild the House of Snapp homepage review photographs from the originals.

usage: python3 hos-images.py <originals_dir> <out_dir>

The originals (House of Snapp collection, summit days 24-25 Oct 2026) are never
committed. Each one is checked against the SHA-256 in hos-crops.json, so only
the authorised file can be used. Each crop matches the measured shape of its
homepage frame, and every width is resampled once from the original, never
from another copy. Corrections are global only: the crop, a 0.1% levels
stretch, light sharpening after resizing (skipped at ISO 1600 and above, where
it would only amplify grain) and WebP quality 75, which keeps the page close to
the weight of the video stills these replace. Nothing is retouched,
reconstructed or generated.

Output goes to public/_review/home-2027/ (gitignored): for each slot
<slot>-<width>.webp for every width but the largest, and <slot>.webp at the
largest. Requires Pillow 10.4.0 for byte-identical output.
"""
import hashlib, json, os, sys
from PIL import Image, ImageFilter, ImageOps

Image.MAX_IMAGE_PIXELS = None


def find(root, name, day):
    wanted = {name.lower(), f"d{day}_{name}".lower()}
    for d, _, files in os.walk(root):
        for f in files:
            if f.lower() in wanted:
                return os.path.join(d, f)
    raise SystemExit(f"missing original {name} (day {day})")


def main(src_root, out):
    spec = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "hos-crops.json")))
    os.makedirs(out, exist_ok=True)
    for img in spec["images"]:
        path = find(src_root, img["file"], img["day"])
        if hashlib.sha256(open(path, "rb").read()).hexdigest() != img["sha256"]:
            raise SystemExit(f"{img['file']}: not the authorised original (SHA-256 mismatch)")
        im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        crop = ImageOps.autocontrast(im.crop(tuple(img["crop"])), cutoff=(0.1, 0.1))
        widths = img["widths"]
        for w in widths:
            sized = crop.resize((w, round(w / img["aspect"])), Image.LANCZOS)
            if img["sharpen"]:
                sized = sized.filter(ImageFilter.UnsharpMask(radius=0.6, percent=30, threshold=2))
            name = f"{img['slot']}.webp" if w == widths[-1] else f"{img['slot']}-{w}.webp"
            sized.save(os.path.join(out, name), "WEBP", quality=75, method=6)
        print(img["slot"], img["file"], widths)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2])

"""
One-off SEO image generation:
  1. Re-compress oversized Contact.webp (11 MB @ 5600x3733 -> ~1600px wide, q=82)
  2. Generate responsive hero variants (srcset widths 600/900/1200/1600/2000)
  3. Build favicon set (16/32/180/192/512 PNG + favicon.ico multi-size)

Run from project root: python scripts/one_off_seo_images.py
"""
from __future__ import annotations

import sys
from pathlib import Path
from PIL import Image

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "src" / "assets" / "images"
PUBLIC = ROOT / "public"


def fmt_kb(n: int) -> str:
    return f"{n / 1024:.1f} KB" if n < 1024 * 1024 else f"{n / (1024 * 1024):.2f} MB"


def recompress_contact() -> None:
    src = ASSETS / "Contact.webp"
    if not src.exists():
        print(f"  SKIP Contact.webp: not found")
        return
    before = src.stat().st_size
    img = Image.open(src)
    # Cap long edge at 1920 (2x the 520px CSS max-width at 3x retina-ish)
    img.thumbnail((1920, 1920), Image.LANCZOS)
    img.save(src, "WEBP", quality=82, method=6)
    after = src.stat().st_size
    print(f"  Contact.webp   {fmt_kb(before)} -> {fmt_kb(after)}  ({img.size[0]}x{img.size[1]}, q=82)")


def generate_hero_srcset() -> None:
    src = ASSETS / "hero-asset2.webp"
    if not src.exists():
        print(f"  SKIP hero: not found")
        return
    img = Image.open(src)
    orig_w, orig_h = img.size
    widths = [600, 900, 1200, 1600, 2000]
    for w in widths:
        if w >= orig_w:
            continue
        scaled_h = round(orig_h * (w / orig_w))
        out = ASSETS / f"hero-asset2-{w}w.webp"
        resized = img.resize((w, scaled_h), Image.LANCZOS)
        resized.save(out, "WEBP", quality=85, method=6)
        print(f"  hero {w}w       {out.name}  ({fmt_kb(out.stat().st_size)})")


def generate_favicons() -> None:
    src = PUBLIC / "cybernest.png"
    if not src.exists():
        print(f"  SKIP favicons: cybernest.png not found")
        return
    img = Image.open(src).convert("RGBA")
    targets = [
        (16, "favicon-16x16.png"),
        (32, "favicon-32x32.png"),
        (180, "cybernest-apple-touch.png"),
        (192, "cybernest-192.png"),
        (512, "cybernest-512.png"),
    ]
    for size, name in targets:
        out = PUBLIC / name
        resized = img.resize((size, size), Image.LANCZOS)
        resized.save(out, "PNG", optimize=True)
        print(f"  {name:<30}  {size}x{size}  ({fmt_kb(out.stat().st_size)})")

    # Multi-size ICO
    ico = PUBLIC / "favicon.ico"
    img.save(ico, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"  {'favicon.ico':<30}  16/32/48  ({fmt_kb(ico.stat().st_size)})")


if __name__ == "__main__":
    print("== Contact.webp recompress ==")
    recompress_contact()
    print("\n== Hero responsive srcset ==")
    generate_hero_srcset()
    print("\n== Favicon set ==")
    generate_favicons()
    print("\nDone.")

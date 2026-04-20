"""
Generate 1200x630 OG banner for social share previews.

Composition:
  - White background
  - Red brand accent triangles (subtle, corners)
  - Left 60%: Cybernest logo + "Ready to GROW?" (red) + "We've got the FLOW." (navy) + tagline
  - Right 40%: person cropped from hero-asset2.webp (head/shoulders, no product screenshots)

Output: public/og-cybernest-banner.png
Run from project root: python scripts/generate_og_banner.py
"""
from __future__ import annotations

import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "src" / "assets" / "images"
PUBLIC = ROOT / "public"

W, H = 1200, 630
BG = (255, 255, 255, 255)
RED = (220, 61, 80, 255)          # #DC3D50 (cyberred)
NAVY = (93, 82, 114, 255)         # #5d5272 (cyberviolet)
GREY = (110, 110, 125, 255)
FONTS_DIR = Path(r"C:\Windows\Fonts")


def load_font(file: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS_DIR / file), size)


def draw_triangle(draw: ImageDraw.ImageDraw, cx: int, cy: int, r: int, rotation_deg: float = 0) -> None:
    """Draw a brand-red rounded-corner triangle centered at (cx,cy) with 'radius' r."""
    import math
    pts = []
    for i in range(3):
        a = math.radians(rotation_deg + i * 120 - 90)
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    draw.polygon(pts, fill=RED)


def crop_person_strip(hero_path: Path) -> Image.Image:
    """
    Crop face+shoulders of the person from hero-asset2.webp, skipping the
    product screenshots (top corners) and the raised-fist arms (upper sides).

    Empirical bounds (image is 3000x2004):
      - Product screenshots sit roughly y < 1200 in the side regions x<1200 and x>1900
      - Person face: centered around x=1500, y=500-900
      - Torso: x=1250-1870, y=1000-1700
      - We want: tight box around face + torso, x=1180-1850, y=380-1700
    """
    img = Image.open(hero_path).convert("RGBA")
    # Tightened crop: trim side pills ("Tailored for You!", "Better User Experience!")
    # and screenshot fragments. Empirically 1300-1760 keeps full body, no pill edges.
    # Narrower x, but also reduce height so resized aspect fits the canvas.
    left, top, right, bottom = 1300, 420, 1760, 1620
    cropped = img.crop((left, top, right, bottom))
    slot_w = 240
    slot_h = int(slot_w * cropped.size[1] / cropped.size[0])
    cropped = cropped.resize((slot_w, slot_h), Image.LANCZOS)
    return cropped


def generate() -> None:
    canvas = Image.new("RGBA", (W, H), BG)
    draw = ImageDraw.Draw(canvas)

    # ---- Red triangle accents (safe-zone corners only — person occupies right side)
    draw_triangle(draw, 70,   540, 26, rotation_deg=18)
    draw_triangle(draw, 140,  500, 14, rotation_deg=-12)
    draw_triangle(draw, 850,  60,  22, rotation_deg=-25)
    draw_triangle(draw, 900,  100, 12, rotation_deg=20)

    # ---- Logo (top-left)
    logo = Image.open(PUBLIC / "cybernest.png").convert("RGBA")
    logo_h = 68
    logo_w = int(logo.size[0] * logo_h / logo.size[1])
    logo = logo.resize((logo_w, logo_h), Image.LANCZOS)
    canvas.paste(logo, (60, 56), logo)

    # ---- Person image (right side)
    person = crop_person_strip(ASSETS / "hero-asset2.webp")
    # Position: right-aligned with 20px margin, bottom-anchored so shoulders meet baseline
    px = W - person.size[0] - 20
    py = H - person.size[1] + 40   # let bottom extend slightly past canvas
    canvas.paste(person, (px, py), person)

    # ---- Headline block (left)
    # Arial Black is the closest thick sans available on Windows; Montserrat Black
    # would be ideal but isn't installed locally. Arial Black reads well at OG scale.
    try:
        f_h1 = load_font("ariblk.ttf", 66)      # Arial Black
        f_h2 = load_font("ariblk.ttf", 66)
    except OSError:
        f_h1 = load_font("arialbd.ttf", 66)
        f_h2 = load_font("arialbd.ttf", 66)
    f_tag = load_font("arial.ttf", 24)
    f_sub = load_font("arialbd.ttf", 22)

    text_x = 60
    y = 170

    # Line 1 (red): "Ready to GROW?"
    draw.text((text_x, y), "Ready to GROW?", font=f_h1, fill=RED)
    # measure
    bbox = draw.textbbox((text_x, y), "Ready to GROW?", font=f_h1)
    y = bbox[3] + 6

    # Line 2 (navy): "We've got the FLOW."
    draw.text((text_x, y), "We've got the", font=f_h2, fill=NAVY)
    bbox2 = draw.textbbox((text_x, y), "We've got the", font=f_h2)
    # "FLOW." in red right after, same baseline
    flow_x = bbox2[2] + 16
    draw.text((flow_x, y), "FLOW.", font=f_h2, fill=RED)
    y = bbox2[3] + 34

    # Tagline
    draw.text(
        (text_x, y),
        "Workflow automation & digital transformation",
        font=f_tag,
        fill=GREY,
    )
    y += 34
    draw.text((text_x, y), "for the Philippines", font=f_tag, fill=GREY)

    # ---- URL stamp bottom-left
    f_url = load_font("arialbd.ttf", 20)
    draw.text((60, H - 54), "cybernestsolution.com", font=f_url, fill=RED)

    # ---- Save
    out = PUBLIC / "og-cybernest-banner.png"
    # Flatten to RGB for max social-crawler compatibility
    flat = Image.new("RGB", (W, H), (255, 255, 255))
    flat.paste(canvas, (0, 0), canvas)
    flat.save(out, "PNG", optimize=True)
    size_kb = out.stat().st_size / 1024
    print(f"  wrote {out.relative_to(ROOT)}  {W}x{H}  {size_kb:.1f} KB")


if __name__ == "__main__":
    generate()

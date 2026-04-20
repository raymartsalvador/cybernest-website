"""
Batch-optimize src/assets/images/ into WebP at src/assets/images-optimized/.

- Logos and graphics with sharp edges → lossless WebP (pixel-perfect).
- Photos → lossy WebP at quality 90 (visually indistinguishable at ~10-30% of original size).
- Preserves directory structure and alpha channels.
- Writes originals alongside as .png/.jpg untouched; this script never overwrites the source tree.

Usage:
    python scripts/optimize_images.py                 # dry-run: reports savings, writes to images-optimized/
    python scripts/optimize_images.py --replace       # after visual QA: replaces originals in-place with .webp

Run from project root.
"""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path
from PIL import Image

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "assets" / "images"
DST = ROOT / "src" / "assets" / "images-optimized"

LOSSLESS_DIR_NAMES = {"partners"}
LOSSLESS_FILE_STEMS = {
    "certify-logo", "cybernest-icon", "flow-logo", "flow-grid", "flow-plus",
    "flow", "logo", "tbido-logo", "pup-logo", "dost-logo", "cybernest",
    "grid-box", "grid-bg",
}
SKIP_SUFFIXES = {".svg", ".gif", ".webp"}
PHOTO_SUFFIXES = {".jpg", ".jpeg", ".png"}


def is_lossless_target(path: Path) -> bool:
    if path.parent.name in LOSSLESS_DIR_NAMES:
        return True
    if path.stem.lower() in LOSSLESS_FILE_STEMS:
        return True
    return False


def fmt_bytes(n: int) -> str:
    for unit in ("B", "KB", "MB"):
        if n < 1024:
            return f"{n:.1f} {unit}" if unit != "B" else f"{n} {unit}"
        n /= 1024
    return f"{n:.1f} GB"


def optimize(src_path: Path, dst_dir: Path) -> tuple[int, int, str, Path]:
    """Convert to WebP if smaller; otherwise copy the original untouched.

    Returns (before_bytes, after_bytes, mode_label, written_path).
    """
    before = src_path.stat().st_size
    dst_dir.mkdir(parents=True, exist_ok=True)

    img = Image.open(src_path)
    if img.mode == "P":
        img = img.convert("RGBA")
    elif img.mode not in ("RGB", "RGBA", "L", "LA"):
        img = img.convert("RGBA" if "A" in img.mode else "RGB")

    lossless = is_lossless_target(src_path)
    save_kwargs = {"method": 6}
    if lossless:
        save_kwargs.update(lossless=True, quality=100)
    else:
        save_kwargs.update(quality=90)

    webp_path = dst_dir / (src_path.stem + ".webp")
    img.save(webp_path, "WEBP", **save_kwargs)
    webp_size = webp_path.stat().st_size

    if webp_size < before:
        return before, webp_size, ("lossless" if lossless else "q=90"), webp_path

    webp_path.unlink()
    keep_path = dst_dir / src_path.name
    shutil.copy2(src_path, keep_path)
    return before, before, "keep-orig", keep_path


def replace_originals() -> None:
    if not DST.exists():
        sys.exit("No optimized output found - run without --replace first.")
    replaced = 0
    changed_ext = 0
    for optimized in DST.rglob("*"):
        if not optimized.is_file():
            continue
        rel = optimized.relative_to(DST)
        # Remove any original sharing the same stem at this relative path.
        src_dir = SRC / rel.parent
        if src_dir.exists():
            for existing in src_dir.iterdir():
                if (
                    existing.is_file()
                    and existing.stem == optimized.stem
                    and existing.suffix.lower() in PHOTO_SUFFIXES
                ):
                    existing.unlink()
        target = SRC / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.suffix.lower() != optimized.suffix.lower():
            changed_ext += 1
        optimized.replace(target)
        replaced += 1
    for d in sorted(DST.rglob("*"), key=lambda p: -len(p.parts)):
        if d.is_dir() and not any(d.iterdir()):
            d.rmdir()
    if DST.exists() and not any(DST.iterdir()):
        DST.rmdir()
    print(f"Replaced {replaced} files ({changed_ext} changed extension to .webp).")
    print("Update import paths in code for any file whose extension changed.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--replace", action="store_true",
                        help="Replace originals in src/assets/images/ with optimized .webp versions.")
    args = parser.parse_args()

    if args.replace:
        replace_originals()
        return

    if not SRC.exists():
        sys.exit(f"Source directory not found: {SRC}")

    total_before = total_after = 0
    files = sorted(
        p for p in SRC.rglob("*")
        if p.is_file() and p.suffix.lower() in PHOTO_SUFFIXES
    )
    if not files:
        sys.exit("No images found.")

    print(f"Optimizing {len(files)} file(s) -> {DST.relative_to(ROOT)}\n")
    rows = []
    for src in files:
        rel = src.relative_to(SRC)
        dst_dir = DST / rel.parent
        try:
            before, after, mode_label, _ = optimize(src, dst_dir)
        except Exception as e:  # noqa: BLE001
            print(f"  SKIP {rel}: {e}")
            continue
        total_before += before
        total_after += after
        saved_pct = (1 - after / before) * 100 if before else 0
        rows.append((str(rel), before, after, saved_pct, mode_label))

    rows.sort(key=lambda r: r[1], reverse=True)
    for rel, before, after, saved_pct, mode_label in rows:
        print(f"  {fmt_bytes(before):>9} → {fmt_bytes(after):>9} "
              f"({saved_pct:5.1f}% saved, {mode_label:<8}) {rel}")

    total_saved = (1 - total_after / total_before) * 100 if total_before else 0
    print(f"\nTotal: {fmt_bytes(total_before)} → {fmt_bytes(total_after)} "
          f"({total_saved:.1f}% saved)")
    print(f"\nOutput in: {DST.relative_to(ROOT)}")
    print("Review visually, then run:  python scripts/optimize_images.py --replace")


if __name__ == "__main__":
    main()

"""Rewrite PNG/JPG image imports to .webp for files that were converted.

Walks src/**/*.{jsx,tsx,js,ts}, finds image imports, and rewrites the
extension if the exact file no longer exists but a .webp sibling does.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "src"
IMG_ROOT = SRC_DIR / "assets" / "images"

# Matches:  from "../assets/images/foo.png"   or   from '../../assets/images/bar.jpg'
IMPORT_RE = re.compile(
    r"""(from\s+['"])([^'"]*assets/images/[^'"]+)\.(png|jpg|jpeg)(['"])""",
    re.IGNORECASE,
)

SOURCE_EXTS = {".jsx", ".tsx", ".js", ".ts"}


def resolve(import_path: str, file_dir: Path) -> Path:
    return (file_dir / import_path).resolve()


def main() -> None:
    total_changed_files = 0
    total_changed_imports = 0
    for path in SRC_DIR.rglob("*"):
        if not path.is_file() or path.suffix not in SOURCE_EXTS:
            continue
        text = path.read_text(encoding="utf-8")
        new_lines = []
        changed_in_file = 0
        for line in text.splitlines(keepends=True):
            match = IMPORT_RE.search(line)
            if match:
                prefix, base, old_ext, suffix = match.groups()
                absolute = resolve(f"{base}.{old_ext}", path.parent)
                webp = absolute.with_suffix(".webp")
                if not absolute.exists() and webp.exists():
                    line = IMPORT_RE.sub(rf"\1\2.webp\4", line, count=1)
                    changed_in_file += 1
            new_lines.append(line)
        if changed_in_file:
            path.write_text("".join(new_lines), encoding="utf-8")
            total_changed_files += 1
            total_changed_imports += changed_in_file
            print(f"  {changed_in_file:2d} import(s) -> {path.relative_to(ROOT)}")
    print(f"\nRewrote {total_changed_imports} import(s) across {total_changed_files} file(s).")


if __name__ == "__main__":
    main()

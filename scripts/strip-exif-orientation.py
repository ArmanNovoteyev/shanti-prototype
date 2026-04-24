#!/usr/bin/env python3
"""
Idempotent EXIF Orientation normalizer для public/assets/photos/*.jpg.

Зачем:
  Некоторые JPG (съёмка iPhone) имеют EXIF tag Orientation != 1, при том что
  raw-пиксели уже повёрнуты корректно или требуют поворота. Chrome/Safari
  применяют EXIF-поворот поверх raw-пикселей — результат отличается от того
  что видит Claude через Read (raw-пиксели, EXIF игнорируется).

  Этот скрипт:
   1) Для файлов с Orientation ∈ {None, 1} — SKIP (не трогает файл).
   2) Для файлов с Orientation ∈ {2..8} — применяет ImageOps.exif_transpose()
      чтобы повернуть пиксели canonically-up и сохраняет без EXIF.

  После прогона все фото имеют consistent rendering в любом браузере, вне
  зависимости от EXIF-поддержки.

Идемпотентность:
  Повторный запуск на уже обработанных файлах — no-op (0 rewritten).
  Никаких потерь качества от повторного JPEG-энкодинга.

Usage:
  python3 scripts/strip-exif-orientation.py             # real run
  python3 scripts/strip-exif-orientation.py --dry-run   # preview only
"""

import sys
from pathlib import Path

from PIL import Image, ImageOps

EXIF_ORIENTATION_TAG = 274
CANONICAL = {None, 1}
ROTATE_NEEDED = {2, 3, 4, 5, 6, 7, 8}


def process_one(jpg_path: Path, dry_run: bool) -> str:
    """Return action taken: SKIP | ROTATE-N | WOULD-ROTATE | ERROR | UNKNOWN."""
    try:
        im = Image.open(jpg_path)
        orient = im.getexif().get(EXIF_ORIENTATION_TAG)
    except Exception as exc:
        return f"ERROR({exc})"

    if orient in CANONICAL:
        return f"SKIP(orient={orient})"

    if orient in ROTATE_NEEDED:
        if dry_run:
            return f"WOULD-ROTATE(orient={orient})"
        rotated = ImageOps.exif_transpose(im)
        rotated.save(jpg_path, "JPEG", quality=92, optimize=True, exif=b"")
        return f"ROTATE-{orient}"

    return f"UNKNOWN(orient={orient})"


def main() -> int:
    dry_run = "--dry-run" in sys.argv
    root = Path(__file__).resolve().parents[1]
    photos_dir = root / "public" / "assets" / "photos"

    if not photos_dir.is_dir():
        print(f"ERROR: {photos_dir} not found", file=sys.stderr)
        return 1

    files = sorted(photos_dir.glob("*.jpg"))
    if not files:
        print(f"WARN: no *.jpg in {photos_dir}", file=sys.stderr)
        return 0

    skipped = 0
    rewritten = 0
    errors = 0

    prefix = "[DRY] " if dry_run else ""
    print(f"{prefix}Scanning {len(files)} files in {photos_dir}")

    for f in files:
        action = process_one(f, dry_run)
        print(f"  {f.name}: {action}")
        if action.startswith("SKIP"):
            skipped += 1
        elif action.startswith(("ROTATE-", "WOULD-ROTATE")):
            rewritten += 1
        elif action.startswith("ERROR") or action.startswith("UNKNOWN"):
            errors += 1

    print()
    print(f"Scanned: {len(files)} | Skipped: {skipped} | Rewritten: {rewritten} | Errors: {errors}")
    return 0 if errors == 0 else 2


if __name__ == "__main__":
    sys.exit(main())

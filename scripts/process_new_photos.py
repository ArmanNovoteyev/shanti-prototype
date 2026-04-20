"""
V3.0.8a — обработка 37 новых фото салона Shanti.

Пайплайн:
  исходник (HEIC / PNG / JPEG / JPG)
    → (HEIC декодируется pillow-heif)
    → PIL.ImageOps.fit(1600x1200, LANCZOS)  # crop по центру
    → image.convert('RGB')                  # на случай RGBA/P
    → image.save(quality=85, optimize=True) # без exif
    → public/assets/photos/{target}.jpg

Карта IMG_XXXX → {service.id}.jpg составлена Клодом на основе таблицы ТЗ
(ETAP_V3.0_FEEDBACK_ALINA.md, WhatsApp-переписка Алины) + grep service.id
из src/data/services.js. Обновлять при добавлении новых услуг.

Именование совпадает с service.id (V3.0.8a решение Армана — вариант A,
без BY_ID-прослойки в servicePhotos.js). Расхождения с транслит-именами
ТЗ (awakening ≠ probuzhdenie, volcano ≠ volcano-of-life, renewal ≠
obnovlenie и т.д.) приняты в пользу data-first именования.

Запуск:
    cd scripts
    source .venv/bin/activate
    pip install -r requirements.txt
    python process_new_photos.py
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageOps
from pillow_heif import register_heif_opener

register_heif_opener()

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "Shanti_new_photo"
DST_DIR = ROOT / "public" / "assets" / "photos"

TARGET_SIZE = (1600, 1200)
JPEG_QUALITY = 85

# IMG_XXXX → целевое имя файла (без .jpg).
# 32 service-фото: имя = service.id из services.js.
# 5 атмосферных: atmosphere-01 … atmosphere-05 (двузначные).
PHOTO_MAP: dict[str, str] = {
    # --- 32 service-фото (имя = service.id) ---
    "IMG_8829.PNG":  "garmoniya-dushi",
    "IMG_9656.HEIC": "sila-buddy",
    "IMG_7494.HEIC": "royal-oil",
    "IMG_0338.HEIC": "royal-thai",
    "IMG_7541.HEIC": "thai-heritage",
    "IMG_5559.PNG":  "awakening",          # ТЗ: probuzhdenie → awakening
    "IMG_8833.PNG":  "volcano",            # ТЗ: volcano-of-life → volcano
    "IMG_8832.PNG":  "gracia",
    "IMG_4389.HEIC": "little-buddha",
    "IMG_2832.PNG":  "clear-mind",
    "IMG_4184.PNG":  "foot-relax",
    "IMG_8834.PNG":  "tandem",
    "IMG_8205.JPEG": "queen-smile",
    "IMG_0203.HEIC": "stone-therapy",
    "IMG_9699.HEIC": "royal-stone",        # ТЗ: royal-stones → royal-stone (единственное)
    "IMG_4794.HEIC": "herbal-pouches",     # ТЗ: herbal-compress → herbal-pouches
    "IMG_9535.PNG":  "anti-cellulite",
    "IMG_0737.HEIC": "face-massage",
    "IMG_0742.HEIC": "head-massage",
    "IMG_4182.PNG":  "megapolis-escape",   # ТЗ: pobeg-iz-megapolisa → megapolis-escape
    "IMG_4008.PNG":  "second-life",        # ТЗ: vtoraya-zhizn → second-life
    "IMG_1362.JPG":  "sagda",
    "IMG_1359.JPG":  "after-party",
    "IMG_4884.PNG":  "oriental-bliss",     # ТЗ: eastern-bliss → oriental-bliss
    "IMG_7472.HEIC": "renewal",            # ТЗ: obnovlenie → renewal
    "IMG_7109.PNG":  "sabai-sabai",
    "IMG_5538.PNG":  "siam-inspiration",
    "IMG_5883.PNG":  "samsara",
    "IMG_0721.HEIC": "mai-tai",
    "IMG_4586.HEIC": "renewal-duo",        # ТЗ: obnovlenie-duo → renewal-duo
    "IMG_6805.PNG":  "lotos-mama",         # ТЗ: lotus-mama → lotos-mama (через «о», как в данных)
    "IMG_6926.PNG":  "back-balance",

    # --- 5 атмосферных (новые файлы) ---
    "IMG_7486.HEIC": "atmosphere-01",
    "IMG_8043.HEIC": "atmosphere-02",
    "IMG_6126.JPG":  "atmosphere-03",
    "IMG_4138.PNG":  "atmosphere-04",
    "IMG_6127.HEIC": "atmosphere-05",
}


def process_one(src: Path, dst: Path) -> tuple[bool, int]:
    """Возвращает (was_overwrite, size_bytes)."""
    was_overwrite = dst.exists()
    with Image.open(src) as im:
        fitted = ImageOps.fit(im, TARGET_SIZE, method=Image.Resampling.LANCZOS)
        rgb = fitted.convert("RGB")
        rgb.save(dst, format="JPEG", quality=JPEG_QUALITY, optimize=True)
    return was_overwrite, dst.stat().st_size


def main() -> int:
    if not SRC_DIR.is_dir():
        print(f"ERROR: источник не найден: {SRC_DIR}", file=sys.stderr)
        return 1
    DST_DIR.mkdir(parents=True, exist_ok=True)

    missing = [name for name in PHOTO_MAP if not (SRC_DIR / name).exists()]
    if missing:
        print(f"ERROR: нет исходников: {missing}", file=sys.stderr)
        return 2

    overwritten = 0
    created = 0
    total_bytes = 0
    overwritten_names: list[str] = []
    created_names: list[str] = []

    for idx, (src_name, target_stem) in enumerate(PHOTO_MAP.items(), 1):
        src = SRC_DIR / src_name
        dst = DST_DIR / f"{target_stem}.jpg"
        was_ow, size = process_one(src, dst)
        total_bytes += size
        if was_ow:
            overwritten += 1
            overwritten_names.append(dst.name)
        else:
            created += 1
            created_names.append(dst.name)
        print(f"[{idx:02d}/{len(PHOTO_MAP)}] {src_name:>16} -> {dst.name:<28} "
              f"({'OVERWRITE' if was_ow else 'NEW':>9}) {size/1024:>7.1f} KB")

    print()
    print("=" * 60)
    print(f"ИТОГО: перезаписано {overwritten}, создано {created}, "
          f"суммарно {total_bytes / (1024*1024):.2f} MB")
    print("=" * 60)
    print()
    print(f"Перезаписано ({overwritten}):")
    for n in sorted(overwritten_names):
        print(f"  - {n}")
    print()
    print(f"Создано ({created}):")
    for n in sorted(created_names):
        print(f"  + {n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

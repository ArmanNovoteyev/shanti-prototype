# Phase 3 — EXIF orientation batch-strip (idempotent)

**Milestone:** v3.3-pre-deploy
**REQ-IDs:** DEPLOY-03
**ETA:** 30 минут
**Status:** planned (awaiting execute)

---

## Goal

Все 44 JPG-фото в `public/assets/photos/` имеют EXIF Orientation = 1 (или EXIF отсутствует), raw-пиксели отображаются canonically-up во всех браузерах (Chrome / Safari iOS). Скрипт `scripts/strip-exif-orientation.py` — **идемпотентный**, переиспользуемый для будущих загрузок.

---

## Pre-conditions

- Phase 1, Phase 2 желательно выполнены (но не обязательно — фаза независима).
- Python 3 + venv готов: `scripts/requirements.txt` уже содержит `Pillow==10.4.0` и `pillow-heif==0.18.0`.
- `imagemagick` установлен для verification (`brew install imagemagick` если нет — или использовать Python для проверки).

**Bootstrap venv если ещё нет:**
```bash
cd scripts
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..
```

---

## Task breakdown

### Task 3.1 — Audit current state

Прогнать диагностический проход, записать baseline:

```bash
cd public/assets/photos
for f in *.jpg; do
  orient=$(python3 -c "from PIL import Image; im = Image.open('$f'); print(im.getexif().get(274, 'None'))")
  echo "$f: $orient"
done | tee /tmp/shanti-exif-before.txt
cd -
```

**Ожидание:** 44 строки. У большинства файлов — `None` или `1` (чистые). У некоторых — `6` / `8` / другие (требуют обработки). Точное распределение неизвестно до прогона.

Этот baseline-файл мы потом сравним после запуска скрипта.

---

### Task 3.2 — Написать `scripts/strip-exif-orientation.py`

**Файл:** `scripts/strip-exif-orientation.py` (новый)

**Требования:**
1. **Идемпотентность** — если Orientation ∈ {None, 1} → `SKIP`, **не перезаписывать** файл. Байты не трогаем, mtime не меняется, качество не теряется от повторного JPEG-энкода.
2. Если Orientation ∈ {2, 3, 4, 5, 6, 7, 8} → применить `ImageOps.exif_transpose()` (поворачивает пиксели к canonical up based on tag), сохранить с `exif=b""`, quality=92, optimize=True.
3. Логирование: одна строка на файл `<filename>: Orientation=<N> → <SKIP|ROTATE-N|STRIP>`.
4. Финальная сводка: `Scanned: N | Skipped: M | Rewritten: K`.
5. CLI flag `--dry-run` — показать что будет сделано, **не трогать** файлы.
6. Docstring в начале файла с usage.

**Шаблон скрипта:**

```python
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
    """Return action taken: SKIP | ROTATE-N | STRIP | ERROR."""
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
```

---

### Task 3.3 — Dry-run на всех 44 фото

```bash
cd /Users/armannovoteyev/MyProject/shanti-prototype
source scripts/.venv/bin/activate  # если есть venv
python3 scripts/strip-exif-orientation.py --dry-run | tee /tmp/shanti-exif-dryrun.txt
```

**Ожидание:**
- 44 строки сканирования
- Сводка вида `Scanned: 44 | Skipped: N | Rewritten: M | Errors: 0`
- N + M = 44

**Если errors > 0** — СТОП, разобрать причину. Не продолжать.

**Показать Арману dry-run output для ревью перед реальным прогоном** — это важно, т.к. rewrite повлияет на git diff многих файлов.

---

### Task 3.4 — Real run

**Pre-condition для Task 3.4:** `git status public/assets/photos/` должен быть чист. Если есть un-committed изменения — сначала закоммить их, только потом real run. Это обеспечивает надёжный rollback.

```bash
# Проверить чистоту дерева перед прогоном
git status public/assets/photos/
# Ожидается пусто / nothing to commit. Если грязно — СТОП, разобраться.

python3 scripts/strip-exif-orientation.py | tee /tmp/shanti-exif-run.txt
```

**Ожидание:** совпадает с dry-run (такие же цифры), но теперь файлы реально перезаписаны.

---

### Task 3.5 — Idempotency verification

Запустить скрипт **повторно** сразу после Task 3.4:

```bash
python3 scripts/strip-exif-orientation.py | tee /tmp/shanti-exif-rerun.txt
```

**Ожидание (КРИТИЧНО):** `Scanned: 44 | Skipped: 44 | Rewritten: 0 | Errors: 0`.

Если `Rewritten > 0` на повторном прогоне — идемпотентность сломана, СТОП, разбираться.

---

### Task 3.6 — Verify EXIF actually stripped

```bash
cd public/assets/photos
for f in *.jpg; do
  orient=$(python3 -c "from PIL import Image; im = Image.open('$f'); print(im.getexif().get(274, 'None'))")
  if [ "$orient" != "None" ] && [ "$orient" != "1" ]; then
    echo "FAIL: $f still has Orientation=$orient"
  fi
done && echo "All 44 OK"
cd -
```

**Ожидание:** `All 44 OK`, без `FAIL:` строк.

---

### Task 3.7 — Visual spot-check

Открыть 5-7 ключевых файлов в браузере напрямую + в приложении:

**Файлы для проверки:**
- `public/assets/photos/atmosphere-01.jpg` ... `atmosphere-05.jpg` (5 — они в hero на главной)
- `public/assets/photos/26-tea-ceremony.jpg` (фон Slide6 онбординга)
- `public/assets/photos/24-interior-room.jpg` (ранее точечно починен в V2.1 — проверить что не сломали)

**Способы:**
1. `open public/assets/photos/atmosphere-01.jpg` — Preview.app показывает правильную ориентацию.
2. `npm run dev` → главная → hero карусель → все 5 atmosphere фото ориентированы правильно (не на боку, не вверх ногами).
3. Онбординг Slide 6 → tea-ceremony фон ориентирован правильно.

---

### Task 3.8 — Обновить TECHNICAL_DEBT.md

Удалить блок «## EXIF Orientation на фото в `public/assets/photos/`» (строки ~7-45) целиком. В git history блок останется.

---

### Task 3.9 — Atomic commits (две части)

**НЕ запускать без отмашки Армана.**

**Commit A — сам скрипт:**
```bash
git add scripts/strip-exif-orientation.py
git status
git commit -m "$(cat <<'EOF'
v3.3.3a: add scripts/strip-exif-orientation.py — idempotent batch normalizer для EXIF Orientation

Phase 3 milestone v3.3-pre-deploy (REQ: DEPLOY-03, часть 1/2).
Скрипт нормализует EXIF Orientation для JPG в public/assets/photos/:
 - Orientation ∈ {None, 1} → SKIP (не перезаписывает, идемпотентно)
 - Orientation ∈ {2..8} → ImageOps.exif_transpose() + save без EXIF, quality=92

Зависимости уже в scripts/requirements.txt (Pillow 10.4.0).
CLI флаг --dry-run для preview без изменений.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

**Commit B — результат прогона:**
```bash
git add public/assets/photos/*.jpg TECHNICAL_DEBT.md
git status
git commit -m "$(cat <<'EOF'
v3.3.3b: normalize EXIF Orientation на всех 44 photos/*.jpg + TECHNICAL_DEBT cleanup

Phase 3 milestone v3.3-pre-deploy (REQ: DEPLOY-03, часть 2/2).
Применён scripts/strip-exif-orientation.py. Результат: N перезаписано, M пропущено (уже canonical).
Idempotency проверена: повторный запуск = 44 skipped, 0 rewritten.
Визуальная проверка: atmosphere-01..05, 26-tea-ceremony, 24-interior-room — все корректно ориентированы в Chrome.
TECHNICAL_DEBT.md: удалён resolved-блок EXIF Orientation.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

**Почему два коммита:** скрипт — переиспользуемая инфраструктура, результат прогона — одноразовое действие. Раздельно удобнее для ревью и потенциального rollback.

---

## Success criteria (повтор из ROADMAP, с уточнениями)

1. Все 44 файла: Orientation ∈ {None, 1}.
2. Визуально: atmosphere-01..05, 26-tea-ceremony, 24-interior-room — правильно ориентированы в Chrome.
3. **Идемпотентность:** 2-й прогон → `Scanned: 44 | Skipped: 44 | Rewritten: 0`.
4. Скрипт документирован (docstring + inline комментарии).
5. TECHNICAL_DEBT.md не содержит блок EXIF Orientation.

## Verification

```bash
# 1. Скрипт существует и запускается
python3 scripts/strip-exif-orientation.py --dry-run | tail -2
# Последние 2 строки — пустая и сводка

# 2. Idempotency
python3 scripts/strip-exif-orientation.py | grep "^Scanned"
# Scanned: 44 | Skipped: 44 | Rewritten: 0 | Errors: 0

# 3. Все файлы canonical
python3 -c "
from PIL import Image
from pathlib import Path
bad = []
for f in sorted(Path('public/assets/photos').glob('*.jpg')):
    o = Image.open(f).getexif().get(274)
    if o not in (None, 1): bad.append((f.name, o))
print(f'Bad: {bad}' if bad else 'All 44 canonical ✓')
"

# 4. TECHNICAL_DEBT чист
grep -c "EXIF Orientation" TECHNICAL_DEBT.md
# 0
```

---

## Rollback

**Если что-то сломалось после реального прогона:**
```bash
git checkout public/assets/photos/
# Возвращает все jpg к состоянию до прогона
```

**Если скрипт плохо написан (до коммита):**
```bash
git checkout scripts/strip-exif-orientation.py  # если был коммит
# или просто rm scripts/strip-exif-orientation.py
```

**Если оба коммита уже сделаны и нужно откатить:**
```bash
git revert HEAD~1 HEAD  # оба коммита (A и B)
# Или более безопасно — отдельно:
git revert <commit-B-sha>  # сначала откатить прогон
git revert <commit-A-sha>  # потом удалить скрипт (опционально)
```

---

## Notes

- **44 файла**, не 35 — TECHNICAL_DEBT.md содержал устаревшую цифру.
- `24-interior-room.jpg` уже был точечно починен в V2.1. Скрипт должен его **SKIP** (Orientation=None/1). Если ROTATE — что-то не так с архивом, разбираться.
- Pillow 10.4.0 уже в `scripts/requirements.txt` — никакие новые зависимости не добавляются.
- `ImageOps.exif_transpose()` — стандартный Pillow helper, делает правильный поворот для всех 8 EXIF-ориентаций.
- Commit B даст большой diff (много бинарных файлов) — это ожидаемо, т.к. JPEG перекодируется. Git LFS не используем (проект маленький, 44 фото на ~5-10MB).

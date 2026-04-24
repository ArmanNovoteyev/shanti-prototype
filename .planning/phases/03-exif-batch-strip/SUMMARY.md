---
phase: 03-exif-batch-strip
plan: PLAN.md
status: complete
commit: 5e19b87
completed: 2026-04-24
req_ids: [DEPLOY-03]
---

# Phase 3 — EXIF orientation batch-strip (idempotent) — SUMMARY

## Outcome

Все 44 JPG-фото в `public/assets/photos/` имеют Orientation ∈ {None, 1} (canonical). Добавлен reusable idempotent normalizer `scripts/strip-exif-orientation.py` для будущих загрузок фото. TECHNICAL_DEBT.md очищен.

## Baseline discovery (Task 3.1)

| Orientation value | Count | Notes |
|---|---|---|
| `None` (no EXIF) | 37 | Cleanly stripped upstream |
| `1` (canonical) | 7 | Tagged canonical |
| `2..8` (problematic) | **0** | Ни одного проблемного файла |

TECHNICAL_DEBT.md был написан по наблюдению единичного случая (`24-interior-room.jpg`, исправленного в V2.1). Вся остальная пачка 44 фото уже пришла в репо чистой — batch-rewrite фактически не потребовался.

## Changes

| File | Change |
|------|--------|
| `scripts/strip-exif-orientation.py` | Новый. Idempotent EXIF normalizer, CLI `--dry-run`, 3408 B |
| `TECHNICAL_DEBT.md` | Удалена секция EXIF Orientation (-39 строк) |

Файлы `public/assets/photos/*.jpg` — **не перезаписаны** (все SKIP).

## Key-files

created:
  - scripts/strip-exif-orientation.py
modified:
  - TECHNICAL_DEBT.md

## Verification

- [x] Task 3.1 — Baseline audit (44 файла просканированы, `/tmp/shanti-exif-before.txt`)
- [x] Task 3.2 — Script написан по шаблону PLAN.md
- [x] Task 3.3 — Dry-run: `Scanned: 44 | Skipped: 44 | Rewritten: 0 | Errors: 0`
- [x] Task 3.4 — Real run: same (no file changes on disk)
- [x] Task 3.5 — Idempotency re-run: same; `git status public/assets/photos/` = clean
- [x] Task 3.6 — Canonical verification: "All 44 canonical ✓"
- [x] Task 3.7 — SKIPPED by decision Армана (baseline уже подтвердил корректность)
- [x] Task 3.8 — TECHNICAL_DEBT.md: `grep -c "EXIF Orientation"` = 0
- [x] Task 3.9 — Atomic commit `5e19b87` (single, не 3.3.3a/3.3.3b — нет rewritten файлов)

## Deviations from PLAN.md

1. **Один коммит вместо двух (3.3.3 вместо 3.3.3a + 3.3.3b).** Причина: нулевой rewrite, значит разделять "инфраструктуру" и "результат прогона" нечего — оба артефакта компактные.
2. **Task 3.7 (visual spot-check) пропущен.** Причина: baseline показал что все файлы уже canonical, визуальные проверки были сделаны в V2.x/V3.x при реальной съёмке. Риск регрессии = 0 (скрипт не писал ни одного байта).

Оба отклонения согласованы Арманом перед коммитом.

## Reusability

Скрипт — кандидат в будущее `packages/media-kit` (согласно `.planning/ARCHITECTURE_SKELETON.md` для v1.2 / multi-tenant реарх). Переиспользуется:
- Новые сертификаты/атмосферные фото Shanti (Алина → repo)
- Второй клиент Жулдыз
- Любой проект с JPG-ассетами от iPhone-съёмки

## Notes

- Pillow 10.4.0 уже в `scripts/requirements.txt` — новые зависимости не добавлены.
- `ImageOps.exif_transpose()` стандартно обрабатывает все 8 EXIF-ориентаций.
- Push на remote — ждёт отмашки Армана.

# Milestone v3.3-pre-deploy — Roadmap

**Goal:** Prod-ready деплой V3.2 для повторного демо Алине — убрать hack, починить visual-баги, нормализовать фото.

**Total:** 3 phases · 3 requirements · ~50 минут суммарной работы.

---

## Overview

| # | Phase                          | Goal                                                    | REQ-IDs   | ETA   | Deps |
|---|--------------------------------|---------------------------------------------------------|-----------|-------|------|
| 1 | Happy Hours hack откат         | Вернуть `isHappyHoursNow()` к расписанию Пн-Пт 11-13:59 | DEPLOY-01 | 5 мин | —    |
| 2 | Onboarding Slide 6 CTA fix     | «Начать» гарантированно видна на iPhone 13/14/15         | DEPLOY-02 | 15мин | —    |
| 3 | EXIF orientation batch-strip   | 44 фото нормализованы + повторно применимый скрипт       | DEPLOY-03 | 30мин | —    |

**Порядок приоритета:** Phase 1 — КРИТИЧНО (без этого деплой ломает бизнес-логику промо 24/7). Phase 2, 3 — cosmetic polish, могут делаться параллельно, но рекомендуется последовательно для чистых атомарных коммитов.

**Dependencies:** фазы независимы, но исполнять по порядку 1 → 2 → 3 (приоритет важности).

---

## Phase 1 — Happy Hours hack откат

**Goal:** Удалить TEMP-REVERT-V3.2.2-DEMO из `src/utils/happyHours.js`, чтобы `isHappyHoursNow()` вернулся к боевой проверке расписания.

**Requirements:** DEPLOY-01

**Scope:**
- `src/utils/happyHours.js`: убрать `return true;` (строка 8), `// eslint-disable-next-line no-unreachable` (строка 9), TEMP-REVERT-V3.2.2-DEMO комментарии (строки 4-6). Оставить только чистую логику с `getDay()`/`getHours()` проверкой (строки 10-16).
- Проверка: `grep -r "TEMP-REVERT-V3.2.2-DEMO" src/` → пусто.
- Smoke test в браузере: в текущий момент (будний день/выходной, час) hero-слайд показывает ожидаемый вариант (happyHours слайд только в Пн-Пт 11-14).

**Success criteria:**
1. `isHappyHoursNow()` корректно различает будни/выходные и час дня (unit-test mentally: Сб 12:00 → false, Пн 12:00 → true, Пн 14:00 → false, Пн 10:00 → false).
2. `grep TEMP-REVERT-V3.2.2-DEMO` по всему репо не находит ни одной строки.
3. Hero на главной: в будний день 11-14 → «Счастливые часы», иначе → gift-слайд.
4. Memory-file `project_shanti_v322_demo_hack.md` помечен «RESOLVED 2026-04-23».

**Ожидаемый коммит:**
```
v3.3.1: revert TEMP-REVERT-V3.2.2-DEMO — isHappyHoursNow() возвращён к расписанию Пн-Пт 11:00-13:59
```

**Notes:** Реальная логика уже в файле на строках 10-16 — откат = удаление трёх строк hack + 3 строк комментов. Минимальный риск.

---

## Phase 2 — Onboarding Slide 6 CTA fix

**Goal:** Гарантировать что CTA «Начать» на Slide6 OnboardingScreen полностью видна и доступна на iPhone 13/14/15 (844px height) без скролла.

**Requirements:** DEPLOY-02

**Scope:**
- `src/screens/OnboardingScreen.jsx` функция `Slide6` (строки 554-641).
- **Решение B (утверждено)**: уменьшить `padding` контент-блока с `'64px 32px 136px'` → `'64px 32px 88px'` (Δ = −48px). CTA остаётся в flex-flow, `position: absolute` НЕ используется.
- **Обоснование:** V3.1.2/V3.1.3 — боль от `position: absolute` внутри flex-контейнеров (две системы координат, overlap с dots/bottom-nav). Подход B симметричен V3.1.4 boxSizing golden rule — одно изменение, не ломает flow. 48px экономии достаточно для 844px viewport (контент-блок ~270px, padding было 64+136=200px, станет 64+88=152px → запас 30+px на iPhone SE 667px).
- `marginTop` у CTA оставить 32 (не трогать).
- Golden rule: `boxSizing: 'border-box'` в контейнере уже есть (строка 583), сохранить.
- Тест: Chrome DevTools iPhone 13 preset (390×844), iPhone 11 Pro Max (414×896), iPhone SE (375×667) — CTA и H1 видны, «Начнём?» eyebrow не обрезан сверху.

**Success criteria:**
1. На viewport 390×844 (iPhone 13/14/15): eyebrow «Начнём?» + H1 «Готовы к первому визиту?» + sub + CTA «Начать» — все видны без скролла.
2. На viewport 375×667 (iPhone SE, худший кейс): CTA всё ещё полностью видна (eyebrow может быть обрезан — допустимо).
3. Нет изменений в Slide1-Slide5 (изолировано).
4. Проверены все три брейкпойнта: 390×844, 414×896 (iPhone 11 Pro Max), 375×667.

**Ожидаемый коммит:**
```
v3.3.2: onboarding Slide 6 — padding-bottom 136→88 для CTA "Начать" на iPhone 13/14/15 (flex-flow, без position: absolute)
```

**Notes:** В файле уже применён V3.1 boxSizing golden rule (строка 583) и H1=36 (не 44 как в TECHNICAL_DEBT.md). Подход B утверждён явно — избегаем повторения V3.1.2/V3.1.3 проблем с position: absolute.

---

## Phase 3 — EXIF orientation batch-strip

**Goal:** Написать переиспользуемый скрипт `scripts/strip-exif-orientation.py`, прогнать на всех 44 JPG и закоммитить нормализованные файлы.

**Requirements:** DEPLOY-03

**Scope:**
- Создать `scripts/strip-exif-orientation.py` (Pillow 10.4.0 уже в `scripts/requirements.txt`).
- Скрипт читает все `public/assets/photos/*.jpg`, для каждого:
  - Открывает через PIL.Image, читает `getexif().get(274)` (tag Orientation)
  - **Идемпотентность (обязательно):** если Orientation ∈ {None, 1} → `SKIP` (не перезаписываем, не трогаем байты файла). Это гарантирует: повторный запуск на уже почищенных фото = no-op, никаких quality-потерь от повторного JPEG-энкода.
  - Если Orientation ∈ {2,3,4,5,6,7,8}: применяет `ImageOps.exif_transpose()` чтобы повернуть пиксели к canonically-up, сохраняет с `exif=b""` quality=92 optimize=True
  - Логирует одну строку на файл: `<filename>: Orientation=<N> → <SKIP|ROTATE-N|STRIP>`
  - Финальная сводка: `N files scanned, M skipped, K rewritten`
- Прогнать скрипт на всех 44 фото, визуально проверить выборочно (5-7 ключевых: atmosphere-01..05, 26-tea-ceremony, 24-interior-room).
- **Важно:** `24-interior-room.jpg` уже починен точечно (V2.1) — скрипт должен пропустить его (Orientation уже 1 / нет EXIF).
- Обновить `TECHNICAL_DEBT.md` → пометить EXIF-блок resolved.

**Success criteria:**
1. Все 44 файла: `identify -format "%[EXIF:Orientation]\n" <file>` → пусто или `1`.
2. Визуальная проверка в Chrome и Safari (iPhone simulator/реальный iPhone Армана): все 44 фото ориентированы корректно.
3. **Идемпотентность подтверждена:** второй запуск скрипта подряд → сводка `44 scanned, 44 skipped, 0 rewritten`. Никаких mtime-изменений в `public/assets/photos/*.jpg`.
4. Скрипт документирован (docstring + usage в начале файла).
5. Удалён из TECHNICAL_DEBT.md блок «EXIF Orientation на 35 фото».

**Ожидаемые коммиты (два атомарных):**
```
v3.3.3a: add scripts/strip-exif-orientation.py — idempotent batch normalizer для EXIF Orientation
v3.3.3b: normalize EXIF Orientation на всех 44 photos/*.jpg (скрипт применён, визуально проверено)
```

**Notes:** Фото-count обновлён (44, не 35 из старого TECHNICAL_DEBT.md). Скрипт — переиспользуемая инфраструктура для будущих загрузок.

---

## Milestone Completion Criteria

- [ ] Все 3 фазы закоммичены
- [ ] `grep -r "TEMP-REVERT" src/` — пусто
- [ ] iPhone 13/14/15 тест онбординга — CTA видна
- [ ] Визуальный проход 44 фото — все правильно ориентированы
- [ ] Build: `npm run build` проходит без warnings
- [ ] Ручной smoke-test в Chrome DevTools на iPhone 13 preset — главная, онбординг, каталог, hero карусель работают
- [ ] `git push` — только с явного разрешения Армана
- [ ] Vercel auto-deploy зелёный
- [ ] Демо-ссылка отправлена Алине

---

*Last updated: 2026-04-23*

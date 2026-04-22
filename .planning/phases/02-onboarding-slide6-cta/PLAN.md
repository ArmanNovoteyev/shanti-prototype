# Phase 2 — Onboarding Slide 6 CTA fix (подход B)

**Milestone:** v3.3-pre-deploy
**REQ-IDs:** DEPLOY-02
**ETA:** 15 минут
**Status:** planned (awaiting execute)

---

## Goal

Кнопка «Начать» на Slide6 OnboardingScreen полностью видна и доступна на iPhone 13/14/15 (viewport 844px) **без скролла**, без обрезания eyebrow «Начнём?» и H1 «Готовы к первому визиту?» сверху.

**Решение:** подход B (утверждён Арманом) — уменьшить `padding-bottom` контент-блока `136 → 88`, CTA остаётся в flex-flow. **НЕ** используем `position: absolute` (V3.1.2/V3.1.3 боль: две системы координат, overlap с dots/bottom-nav).

---

## Pre-conditions

- Phase 1 выполнена (не обязательно, но логичный порядок).
- Dev-сервер запущен: `npm run dev`.
- Chrome DevTools доступен с device emulation.

---

## Task breakdown

### Task 2.1 — Измерить текущую геометрию

**Цель:** убедиться что диагноз из TECHNICAL_DEBT.md всё ещё актуален.

**Как:**
1. `npm run dev`
2. Открыть `http://localhost:5173`
3. Если онбординг уже пройден — в DevTools Application → Local Storage → удалить ключ `shanti.onboarding.done` (или что там хранит completeOnboarding flag). Reload.
4. Пролистать до Slide 6 (tea-ceremony фон).
5. DevTools → Toggle Device Toolbar → iPhone 13 / 390×844.

**Ожидаемый баг:** либо eyebrow «Начнём?» обрезан сверху slide, либо CTA «Начать» уходит ниже viewport. Снять скриншот (mentally/visually) — запомнить точное поведение.

**Если бага нет** на 844px — проверить 375×667 (iPhone SE). Если и там нет — **СТОП**, доложить Арману: диагноз устарел, фикс не нужен.

---

### Task 2.2 — Применить fix в `OnboardingScreen.jsx`

**Файл:** `src/screens/OnboardingScreen.jsx`
**Функция:** `Slide6` (строки 554-641)

**Изменение (строка 582):**

```javascript
// БЫЛО
padding: '64px 32px 136px',

// СТАЛО
padding: '64px 32px 88px',
```

**Это единственное изменение в Phase 2.** Больше ничего не трогаем:
- `marginTop: 32` у CTA — НЕ меняем
- `fontSize: 36` у H1 — НЕ меняем (уже уменьшено в V3.1)
- `boxSizing: 'border-box'` — уже есть, НЕ трогаем
- `justifyContent: 'flex-end'` — НЕ меняем
- Gradient overlay — НЕ трогаем

**Почему именно 88px bottom:**
- Было 136 = запас под дот-индикаторы карусели онбординга (они внизу) + safe-area
- Реальная высота дотов ~40-48px + safe-area ~24-34px = ~70-80px
- 88 — надёжно покрывает доты + safe-area, но даёт +48px контенту
- На 844px viewport: контент-блок содержит eyebrow (~20) + margin (12) + H1 (~80) + margin (18) + sub (~48) + margin (32) + CTA (56) = ~266px. Плюс padding-top 64 = 330px. Плюс padding-bottom 88 = 418px. Запас от 844: **426px** — дот-индикаторы и safe-area помещаются без проблем.
- На 667px (iPhone SE, худший кейс): 667 − 418 = 249px запас — тоже ОК.

**Рекомендуемый Edit-вызов:** один `Edit` с `old_string: "padding: '64px 32px 136px',"` → `new_string: "padding: '64px 32px 88px',"`. Уникально в файле (это единственный Slide6 padding).

---

### Task 2.3 — Visual verification на трёх брейкпойнтах

Hot-reload подхватит изменение. В DevTools Device Toolbar прогнать:

| Viewport        | Device preset        | Ожидаемое поведение |
|-----------------|----------------------|---------------------|
| 390×844         | iPhone 13/14/15      | eyebrow + H1 + sub + CTA — **все видны**, дот-индикаторы карусели онбординга — видны |
| 414×896         | iPhone 11 Pro Max    | всё видно, чуть больше запаса снизу |
| 375×667         | iPhone SE            | CTA видна, eyebrow может быть tight — допустимо |

**Проверить также:**
- CTA не перекрывается дот-индикаторами онбординга
- Нет horizontal scroll (boxSizing golden rule работает)
- Gradient overlay на фоне остался
- Tap/hover на CTA работает

---

### Task 2.4 — Smoke test остальных слайдов (регрессия)

Проверить что **Slide1-Slide5 не сломались** (не трогали код, но проверяем):
- Пролистать онбординг с начала на 390×844
- Каждый слайд отрисовывается как раньше
- Кнопка «Skip» / тапы влево-вправо работают

---

### Task 2.5 — Build check

```bash
npm run build
```

Ожидание: билд чистый.

---

### Task 2.6 — Обновить TECHNICAL_DEBT.md

**Файл:** `TECHNICAL_DEBT.md`
**Секция:** «## Onboarding Слайд 6 — CTA «Начать» уезжает под viewport» (строки ~47-61)

Удалить весь блок целиком **или** пометить как resolved:

```markdown
## ~~Onboarding Слайд 6 — CTA «Начать» уезжает под viewport~~ RESOLVED

**Resolved:** v3.3.2 (2026-04-25), Phase 2 milestone v3.3-pre-deploy.
Применён подход B: padding-bottom 136→88. См. `.planning/phases/02-onboarding-slide6-cta/PLAN.md`.
```

(Рекомендую удалить целиком — в git history останется).

---

### Task 2.7 — Atomic commit

**НЕ запускать без отмашки Армана.** Когда отмашка дана:

```bash
git add src/screens/OnboardingScreen.jsx TECHNICAL_DEBT.md
git status
git commit -m "$(cat <<'EOF'
v3.3.2: onboarding Slide 6 — padding-bottom 136→88 для CTA "Начать" на iPhone 13/14/15 (flex-flow, без position: absolute)

Phase 2 milestone v3.3-pre-deploy (REQ: DEPLOY-02).
Подход B: уменьшили padding-bottom контент-блока Slide6 с 136 на 88 (Δ −48px).
CTA остаётся в flex-flow, избегаем position: absolute (V3.1.2/V3.1.3 боль с двумя системами координат).
Протестировано на 390×844, 414×896, 375×667.

Также удалён resolved блок из TECHNICAL_DEBT.md.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Success criteria (повтор из ROADMAP)

1. На 390×844 (iPhone 13/14/15): eyebrow + H1 + sub + CTA — видны без скролла.
2. На 375×667 (iPhone SE): CTA полностью видна.
3. Slide1-Slide5 не сломаны.
4. Все три брейкпойнта проверены.

## Verification

```bash
# Код изменён как ожидается?
grep -n "padding: '64px 32px" src/screens/OnboardingScreen.jsx
# Должно быть одно совпадение с "88px" в Slide6

# Build clean?
npm run build && echo "BUILD OK"

# TECHNICAL_DEBT чище?
grep -c "Onboarding Слайд 6" TECHNICAL_DEBT.md
# Должно быть 0 (блок удалён), либо строка с RESOLVED
```

---

## Rollback

```bash
git checkout src/screens/OnboardingScreen.jsx TECHNICAL_DEBT.md
```

---

## Notes

- Подход B выбран по требованию Армана на основе V3.1 опыта. Не переключаться на подход А («position: absolute») без новой отмашки.
- Если 88px оказывается мало на каком-то viewport — можно донастроить до 80 или 72 (не ниже, иначе дот-индикаторы карусели онбординга начнут перекрывать CTA). Это полная свобода в рамках подхода B.
- Если вообще 88 не хватает (неожиданно) — СТОП, доложить. Не переходить на подход А молча.

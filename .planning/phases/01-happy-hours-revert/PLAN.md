# Phase 1 — Happy Hours hack откат

**Milestone:** v3.3-pre-deploy
**REQ-IDs:** DEPLOY-01
**ETA:** 5 минут
**Status:** planned (awaiting execute)

---

## Goal

Удалить `TEMP-REVERT-V3.2.2-DEMO` из `src/utils/happyHours.js`, чтобы `isHappyHoursNow()` вернулся к боевой проверке расписания **Пн-Пт 11:00-13:59**.

---

## Pre-conditions

- Git working tree чистый (ветка `master`, последний коммит `02aa710`).
- `grep -r "TEMP-REVERT-V3.2.2-DEMO" src/` → находит **3 совпадения** (все в `src/utils/happyHours.js`).
- `isHappyHoursNow()` сейчас всегда возвращает `true` → Hero главной всегда показывает «Счастливые часы» слайд.

---

## Task breakdown

### Task 1.1 — Почистить `src/utils/happyHours.js`

**Файл:** `src/utils/happyHours.js`

**Текущее состояние** (строки 1-17):
```javascript
export const HAPPY_HOURS_SCHEDULE = { days: [1, 2, 3, 4, 5], startHour: 11, endHour: 14 };
export const HAPPY_HOURS_DISCOUNT = 0.2;

// TEMP-REVERT-V3.2.2-DEMO: принудительно включён Happy Hours hero-слайд на 24/7 для демо Арману.
// Вернуть оригинальную проверку (Пн-Пт 11:00-13:59) перед деплоем Алине.
// См. memory/project_shanti_v322_demo_hack.md
export const isHappyHoursNow = (date = new Date()) => {
  return true; // TEMP-REVERT-V3.2.2-DEMO
  // eslint-disable-next-line no-unreachable
  const day = date.getDay();
  const hour = date.getHours();
  return (
    HAPPY_HOURS_SCHEDULE.days.includes(day) &&
    hour >= HAPPY_HOURS_SCHEDULE.startHour &&
    hour < HAPPY_HOURS_SCHEDULE.endHour
  );
};
```

**Целевое состояние:**
```javascript
export const HAPPY_HOURS_SCHEDULE = { days: [1, 2, 3, 4, 5], startHour: 11, endHour: 14 };
export const HAPPY_HOURS_DISCOUNT = 0.2;

export const isHappyHoursNow = (date = new Date()) => {
  const day = date.getDay();
  const hour = date.getHours();
  return (
    HAPPY_HOURS_SCHEDULE.days.includes(day) &&
    hour >= HAPPY_HOURS_SCHEDULE.startHour &&
    hour < HAPPY_HOURS_SCHEDULE.endHour
  );
};
```

**Изменения:**
- Удалить 3 строки комментария TEMP-REVERT (строки 4-6)
- Удалить `return true; // TEMP-REVERT-V3.2.2-DEMO` (строка 8)
- Удалить `// eslint-disable-next-line no-unreachable` (строка 9)
- Функции `isHappyHoursAt`, `applyHappyHoursDiscount`, `isServiceEligible` (строки 19-30) **не трогать**.

**Рекомендуемый Edit-вызов:** один Edit с полным блоком до/после (строки 4-17 → новое тело функции без hack).

---

### Task 1.2 — Проверка через grep

```bash
grep -rn "TEMP-REVERT-V3.2.2-DEMO" .
```

**Ожидание:** 0 совпадений в `src/`. Допустимые совпадения: memory-файл (`~/.claude/projects/.../memory/project_shanti_v322_demo_hack.md`) + historical commits/markdown (`SHANTI.md`, `MEMORY.md`) — это нормально, их не трогаем.

Если grep нашёл TEMP-REVERT в `src/` — откат не завершён, вернуться к Task 1.1.

---

### Task 1.3 — Dev-server smoke test

```bash
npm run dev
```

Открыть `http://localhost:5173` в браузере. На главной экран:

- **Если сейчас будний день и 11:00-13:59:** hero-карусель включает «Счастливые часы» слайд с ценой 14 400 ₸ / час.
- **Иначе:** hero-карусель показывает gift-слайд (или атмосферные слайды atmosphere-01..05), но **НЕ** «Счастливые часы».

**Быстрая проверка в DevTools Console** (без ожидания смены часа):
```javascript
// Проверить текущее значение
window.__TEST_HAPPY = () => {
  // Имитируем разные даты
  const wedNoon = new Date(2026, 3, 22, 12, 0);    // Ср 12:00 → true
  const satNoon = new Date(2026, 3, 25, 12, 0);    // Сб 12:00 → false
  const monMorning = new Date(2026, 3, 20, 10, 0); // Пн 10:00 → false
  const monPast = new Date(2026, 3, 20, 14, 0);    // Пн 14:00 → false
  // Не получится без импорта — просто руками проверить в коде
};
```

Практически проще — прочитать код и убедиться что hack удалён.

---

### Task 1.4 — Build check

```bash
npm run build
```

**Ожидание:** билд проходит без errors/warnings. Если eslint ругается на что-то новое — остановиться, разобрать причину (не должно, т.к. удаляем мёртвый код).

---

### Task 1.5 — Обновить memory-файл

**Файл:** `~/.claude/projects/-Users-armannovoteyev-MyProject-shanti-prototype/memory/project_shanti_v322_demo_hack.md`

Добавить в начало файла отметку:
```markdown
**STATUS: RESOLVED 2026-04-25** (откачено в v3.3.1, Phase 1 milestone v3.3-pre-deploy)

---

[оригинальное содержимое]
```

Также обновить `MEMORY.md` index-строку — сменить ⚠ на ✓ или пометить `(resolved)`.

---

### Task 1.6 — Atomic commit

**НЕ запускать без отмашки Армана.** Когда отмашка дана:

```bash
git add src/utils/happyHours.js
git status  # убедиться только этот файл в staged
git commit -m "$(cat <<'EOF'
v3.3.1: revert TEMP-REVERT-V3.2.2-DEMO — isHappyHoursNow() возвращён к расписанию Пн-Пт 11:00-13:59

Phase 1 milestone v3.3-pre-deploy (REQ: DEPLOY-01).
Убран hack v3.2.2 демо-версии (isHappyHoursNow всегда возвращал true для показа Happy Hours слайда на iPhone 24/7).
Бэкап логика уже была в файле (строки 10-16) — удаляем только 5 строк hack + 3 строки комментариев.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Memory-файл коммитится отдельно (он в `~/.claude/`, не в репо).

---

## Success criteria (повтор из ROADMAP)

1. `isHappyHoursNow()` корректно различает будни/выходные и час дня.
2. `grep TEMP-REVERT-V3.2.2-DEMO src/` → пусто.
3. Hero на главной: в будний день 11-14 → «Счастливые часы», иначе → другой слайд.
4. Memory-file помечен RESOLVED 2026-04-25.
5. Build чистый.

## Verification (как проверить что выполнено)

```bash
# 1. Grep clean?
grep -rn "TEMP-REVERT-V3.2.2-DEMO" src/ && echo "FAIL" || echo "OK"

# 2. Build clean?
npm run build && echo "BUILD OK"

# 3. Код выглядит как ожидаем?
sed -n '1,15p' src/utils/happyHours.js
# должно быть ~10 строк, без слова TEMP-REVERT
```

---

## Rollback (если что-то пошло не так)

```bash
git checkout src/utils/happyHours.js
```

Hack вернётся в исходное состояние (24/7). Risk минимален — изменение в одном файле, 8 удалённых строк.

---

## Notes

- Это самый критичный фикс milestone — без него prod покажет Happy Hours круглосуточно, что ломает бизнес-логику и вводит клиентов в заблуждение.
- Фаза независима от Phase 2 и Phase 3 — можно делать в любом порядке, но логично **первой** (сначала критичное, потом cosmetic).

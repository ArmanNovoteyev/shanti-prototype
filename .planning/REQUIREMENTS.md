# Milestone v3.3-pre-deploy — Requirements

**Goal:** Prod-ready деплой V3.2 для повторного демо Алине.

---

## Active Requirements

### Pre-deploy hygiene

- [x] **DEPLOY-01** — `isHappyHoursNow()` возвращает расписание Пн-Пт 11:00-13:59 в production (без TEMP-REVERT hack). Hero-слайд «Счастливые часы» появляется только в рабочее время, в остальное — gift-слайд. ✅ 2026-04-23 commit `3888727`.
- [ ] **DEPLOY-02** — Onboarding Slide 6 CTA «Начать» полностью виден и доступен на iPhone 13/14/15 (viewport height 844px), без скролла и без обрезания eyebrow/H1 сверху.
- [ ] **DEPLOY-03** — Все 44 JPG-фото в `public/assets/photos/` имеют EXIF Orientation=1 (или EXIF отсутствует), raw-пиксели ориентированы корректно. Скрипт `scripts/strip-exif-orientation.py` повторно применим для будущих фото.

---

## Traceability

| REQ-ID      | Phase | Status  |
|-------------|-------|---------|
| DEPLOY-01   | 1     | ✅ done (3888727) |
| DEPLOY-02   | 2     | planned |
| DEPLOY-03   | 3     | planned |

---

## Future Requirements (v1.0 MVP track)

- Встреча с владелицей по MVP v1.0 → собрать scope
- Фидбек Алины по цветовой палитре (зелёное → бежевое) — требует разговора
- Dark mode (упоминалось в V3.x как «возможно потом»)

## Out of Scope (v3.3-pre-deploy)

- Любые новые features — только техдолг и фиксы
- Реогранизация компонентов
- Миграция на Tailwind / styled-components — принято решение остаться на inline styles
- Косметология

---

*Last updated: 2026-04-23*

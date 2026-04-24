# Shanti Thai SPA — Mobile Prototype

**Source of truth для исторического контекста:** `../SHANTI.md` (580 строк — полная история V1→V3.2, tone, персонажи, тех-стек).

---

## What This Is

Vite 5 + React 18 мобильный прототип приложения для салона **Shanti Thai SPA** (Усть-Каменогорск, Казахстан). Цель — показать владелице салона что в 2026 спа может иметь приложение уровня Apple. Деплоится на `shanti-prototype.vercel.app`.

**Стек:** Vite + React 18 + lucide-react + inline styles. Собственный i18n-хук (RU/KK/EN). `qrcode.react` для сертификатов. **Не используем:** Tailwind, styled-components, react-router.

**Стейкхолдеры:**
- **Арман Новотеев** — разработчик (муж SMM-щицы)
- **Алина** — SMM салона, жена Армана, первичный ревьюер
- **Владелица салона** — **одобрила переход на полноценное приложение v1.2 2026-04-23**. Следующий шаг — интервью с zapis.kz + финализация scope v1.2.

---

## Core Value

Production-ready прототип, который Алина может показать владелице и клиентам с уверенностью. Каждая версия → prod на `shanti-prototype.vercel.app`.

**Следующий этап (v1.2):** Переход от прототипа к production-ready multi-tenant приложению — свой бэкенд (Hetzner + Fastify + Drizzle), монорепо TS, возможность переиспользования для следующих клиентов (Жулдыз).

---

## Current State

**Shipped:** v3.3-pre-deploy (2026-04-24) — 3 фазы, 3 коммита в prod (5613611, 5e19b87, 3888727). Prototype готов к повторному демо Алине после полного closing техдолга V3.2 цикла.

**Next milestone:** v1.2 Full App — в планировании. Требует `/gsd-new-milestone` после интервью с zapis.kz.

---

## Requirements

### Validated (shipped)

- ✓ **V1.x** — онбординг, главная, каталог, booking flow, сертификаты, история визитов (ServiceDetailScreen) — shipped April 2026
- ✓ **V2.x** — визуальная итерация по фидбеку Алины, atmosphere gallery — shipped
- ✓ **V3.0-3.1** — hero-карусель, `boxSizing: border-box` golden rule применён глобально — shipped V3.1
- ✓ **V3.2** — 4 дизайна сертификата (V3.2.1a-b), hero «Счастливые часы» с ценовой layout (V3.2.2), hero карусель с atmosphere-01..05 в порядке 05→01 (V3.2.3/a) — shipped 2026-04-22 commit `02aa710`
- ✓ **DEPLOY-01** — `isHappyHoursNow()` возвращён к расписанию Пн-Пт 11:00-13:59 (TEMP-REVERT hack снят) — v3.3-pre-deploy Phase 1, commit `3888727`
- ✓ **DEPLOY-02** — Onboarding Slide 6 CTA «Начать» полностью видна на iPhone 13/14/15 (padding-bottom 136→88, подход B) — v3.3-pre-deploy Phase 2, commit `5613611`
- ✓ **DEPLOY-03** — reusable idempotent EXIF Orientation normalizer (scripts/strip-exif-orientation.py); baseline audit подтвердил что все 44 фото уже canonical (37 без EXIF, 7 с Orientation=1) — v3.3-pre-deploy Phase 3, commit `5e19b87`

### Active (next milestone v1.2)

- [ ] Интервью с zapis.kz (в повестке, письмо в техподдержку отправлено — см. `.planning/research/`)
- [ ] Финализация scope v1.2 Full App (свой бэкенд, монорепо, multi-tenant)
- [ ] Встреча с владелицей по MVP v1.0 prod-функционалу

### Out of Scope (v1.2)

- Косметология (владелица явно сказала нет ещё в V2.x)
- Миграция прототипа на Tailwind / styled-components — inline styles работают, не трогаем до v1.2 реарха
- Обсуждение цветовой палитры (Алина: зелёное → бежевое) — отложено до v1.2, решается вместе с полным redesign

---

## Key Decisions

| Decision | When | Outcome |
|----------|------|---------|
| **boxSizing: border-box golden rule** | V3.1 | ✓ Good. Решило множественные баги width/padding на узких viewport. Применено глобально. |
| **Stage-by-stage workflow** (stop после каждой фазы, git push только с отмашки) | V1.x | ✓ Good. Избегает regression incidents. Закреплено в memory. |
| **Inline styles, no Tailwind/styled-components** | V1.x | ✓ Good. 396KB JS bundle, build 791ms, понятно для junior. |
| **Подход B для Slide6 CTA fix** (padding-bottom vs position: absolute) | v3.3 Phase 2 | ✓ Good. Избежали V3.1.2/V3.1.3 боли с двумя системами координат. |
| **Idempotent EXIF normalizer (SKIP если canonical)** | v3.3 Phase 3 | ✓ Good. Reusable для будущих загрузок, zero quality loss. Кандидат в `packages/media-kit` для v1.2. |
| **Budget модельный профиль GSD** | 2026-04-23 | — Pending revisit. Sonnet для plan/exec, haiku для verify/research — достаточно на текущем объёме работы. |
| **Переход на v1.2 Full App** (свой бэкенд, 7-8 мес, 1.8 млн тг) | 2026-04-23 | — Pending. Owner approval получен, scope ещё не финализирован. |

## Constraints

- **Язык общения:** русский (Арман + Алина)
- **Платёжные решения v1.2:** TBD после интервью с zapis.kz
- **Переиспользуемость:** архитектурные решения v1.2 должны масштабироваться на второй салон Жулдыз (multi-tenant)
- **Git workflow:** push только с явной отмашки Армана

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition**: requirements invalidated → Out of Scope, validated → Validated, new emerged → Active, decisions → Key Decisions.

**After each milestone**: full review of all sections, Core Value check, Out of Scope audit.

---

*Last updated: 2026-04-24 — v3.3-pre-deploy shipped, preparing v1.2 Full App milestone.*

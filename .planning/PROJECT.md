# Shanti Thai SPA — Mobile Prototype

**Source of truth для исторического контекста:** `../SHANTI.md` (580 строк — полная история V1→V3.2, tone, персонажи, тех-стек).

---

## What This Is

Vite 5 + React 18 мобильный прототип приложения для салона **Shanti Thai SPA** (Усть-Каменогорск, Казахстан). Цель — показать владелице салона что в 2026 спа может иметь приложение уровня Apple. Деплоится на `shanti-prototype.vercel.app`.

**Стек:** Vite + React 18 + lucide-react + inline styles. Собственный i18n-хук (RU/KK/EN). `qrcode.react` для сертификатов. **Не используем:** Tailwind, styled-components, react-router.

**Стейкхолдеры:**
- **Арман Новотеев** — разработчик (муж SMM-щицы)
- **Алина** — SMM салона, жена Армана, первичный ревьюер
- **Владелица салона** — **согласилась на запуск 2026-04-22**. Следующий шаг — встреча про MVP v1.0.

---

## Core Value

Production-ready прототип, который Алина может показать владелице и клиентам с уверенностью. Каждая версия → prod на `shanti-prototype.vercel.app`.

---

## Current Milestone: v3.3-pre-deploy

**Goal:** Подготовить чистый prod-деплой V3.2 для повторного демо Алине (после одобрения владелицы от 2026-04-22), убрав временный hack и починив мелкие visual-баги.

**Target features (техдолг):**
- Откат TEMP-REVERT-V3.2.2-DEMO (happyHours hack)
- Onboarding Слайд 6 CTA fix (обрезается на iPhone 13/14/15)
- EXIF orientation batch-нормализация 44 фото

**Stage-by-stage правило:** после каждой фазы — СТОП, доклад Арману, ждать отмашку. Git push — только с явным разрешением.

---

## Validated (V3.2 DONE, commit 02aa710)

- V3.2.1a-b: 4 дизайна сертификата (light/dark/march8/ny)
- V3.2.2: hero «Счастливые часы» (price layout 14 400 ₸ / час герой + 18 000 ₸ перечёркнутая + -20% в будни)
- V3.2.3: hero карусель с atmosphere-01..05 (AtmosphereGallery блок удалён, 5 фото в hero)
- V3.2.3a: порядок atmosphere-фото развёрнут 05→01 сверху вниз

## Validated (ранее)

- V1.x — онбординг, главная, каталог, booking flow, сертификаты, история визитов (ServiceDetailScreen)
- V2.x — визуальная итерация по фидбеку Алины, atmosphere gallery
- V3.0-3.1 — переход на hero-карусель, boxSizing: border-box golden rule применён глобально

---

## Key Decisions

- **boxSizing: border-box golden rule** (V3.1): любой контейнер с inline-styled padding/border получает `boxSizing: 'border-box'`. Без этого padding раздувает ширину и ломает вложенные flex-раскладки на узких viewport.
- **Stage-by-stage workflow:** не разбивать этапы в одностороннем порядке, не делать git push без отмашки. См. `~/.claude/projects/-Users-armannovoteyev-MyProject-shanti-prototype/memory/`.
- **Профиль моделей:** budget (haiku для research/verify, sonnet для plan/exec).

## Out of Scope (v3.3-pre-deploy)

- Косметология (владелица явно сказала нет)
- Cнижение цветовой палитры зелёного (фидбек Алины — обсуждается отдельно)
- Новые features — всё только пост-демо MVP v1.0

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still right priority?
3. Audit Out of Scope — reasons still valid?

---

*Last updated: 2026-04-23 · Milestone v3.3-pre-deploy started*

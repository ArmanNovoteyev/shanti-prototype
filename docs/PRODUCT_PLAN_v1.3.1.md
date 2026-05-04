# Shanti Thai SPA — PRODUCT_PLAN v1.3.1

**Дата:** 25 апреля 2026
**Версия:** v1.3.1 (уточнение логики кэшбека после разговора Армана с Лейлой)
**Автор:** Арман Новотеев + Клод (веб-чат)
**Статус:** Драфт для внутреннего использования. Документ для Лейлы — отдельный.

---

## Что изменилось от v1.3 → v1.3.1

| Изменение | Было (v1.3) | Стало (v1.3.1) |
|-----------|-------------|----------------|
| **Скидки** | Аддитивные (Premium 15% + Happy Hours 20% = 35%) с cap 50% | **Взаимоисключающие** (только Happy Hours 20%) |
| **Premium tier** | Скидка 15% + кэшбек | **Только** повышенный кэшбек (15% vs 10%) |
| **Кэшбек база** | От финальной цены (после скидок) | **От оплаченной деньгами части** (cashAmount) |
| **Cap на скидку** | max_combined_discount_pct = 50% | Не нужен (скидки не складываются) |
| **Промокод приглашения** | TBD | **Оба** клиента получают по 1000 ShantiCoin |
| **Таблица bookings** | priceCents | **Детализация:** base_price_cents, discount_pct, discount_reason, cashback_spent_coins, cash_amount_cents, cashback_earned_coins |

**Сроки и бюджет:** не меняются (8-9 мес, 2.3-2.5 млн тг). Логика **проще** — код **меньше**, тестов **меньше**, ошибок **меньше**.

---

## Overview

Без изменений от v1.3.

Shanti Thai SPA нуждается в:
1. **Клиентском мобильном приложении** для онлайн-записи, оплаты, лояльности
2. **Полноценной CRM-админке** заменяющей Zapis.kz
3. **Бэкенд-инфраструктуре** под обе системы

**Definition of Done на milestone v1.0:**
- Клиенты салона могут записаться/оплатить через приложение
- Администраторы ведут расписание и клиентов через админ-панель
- Zapis.kz отключён (не нужен)
- Premium-клиенты получают свой 15% кэшбек автоматически
- Бэкапы данных автоматические каждый день
- Salon работает без техподдержки разработчика более 24 часа без проблем

---

## Scope MVP v1.0

### В scope (must have для запуска)

**Клиентское приложение (мобильное iOS/Android):**
- Каталог услуг с фото и описаниями (3 языка: ru/kk/en)
- Онлайн-запись с выбором мастера, филиала, услуги, времени
- Учёт правила «30 минут буфер» при показе свободных слотов
- Сертификаты — покупка через Kaspi, использование через QR-код
- Кэшбек система (10% стандарт / 15% Premium) — **начисление от оплаты деньгами**
- QR-код клиента для оплаты бонусами в салоне (или диктовка номера кабинета)
- Back Balance трекер
- Happy Hours (фильтр по времени услуги Пн-Пт 11-13:59, не времени брони)
- Push-уведомления (за день + за 2 часа до визита)
- Промо-рассылки от салона (категория «маркетинг» в push)
- Kaspi оплата (deep link → возврат в приложение)
- Отзывы (1-3⭐ внутри приложения, 4-5⭐ → кнопка «Поделиться в 2GIS»)
- WhatsApp-кнопка для связи с администратором
- Звонок администратору (`tel:` link)
- Видео филиалов (1-2 коротких 30-60 сек)
- Промокод за приглашение друга (1000 ShantiCoin **обоим** — пригласившему и новому)

**Админ-панель (web — десктоп + mobile-friendly):**
- Календарь записей всех мастеров, всех филиалов
- Создание / перенос / отмена бронирований
- База клиентов с историей посещений и заметками
- Управление сертификатами (выдача, продление при просрочке)
- Управление кэшбеком и tier (повышение клиента до Premium — только Лейла + Алия)
- Блокировка слотов мастеров (мастер заболел, обед, перерыв)
- Конструктор промо-рассылок + отправка
- Сегменты клиентов (по tier, по последней дате визита)
- Экспорт данных (бэкап CSV + JSON)
- Многопользовательский доступ: 2 рабочих телефона филиалов + Лейла + Алия (4 аккаунта)

**Бэкенд + инфраструктура:**
- Postgres 16 на Hetzner CX22 Frankfurt (€4.50/мес после аванса)
- Multi-tenancy готовность (под Жулдыз и третьего клиента)
- Multi-resource scheduling (защита от задвоений сауны/фитобочки)
- SMS OTP авторизация через Mobizon или SMSC
- Ежедневные бэкапы в Backblaze B2 (главный страх Лейлы → закрываем)
- Мониторинг через Uptime Robot (бесплатный пинг каждые 5 мин)
- SLA: восстановление за 24 часа, реакция на критичные баги в течение 1-2 часов

### Не в scope MVP (Phase 2+)

- Встроенный чат с админом (WebSocket, real-time) — заменён WhatsApp-кнопкой
- Видеозвонок из приложения
- Видео процедур в карточках услуг (раздувает app size)
- 360° интерактивные туры филиалов
- Программа лояльности уровней Silver/Gold/Platinum (отдельно от Premium tier)
- Франшизные функции
- Видеообзоры услуг
- Multi-currency (только KZT в v1.0)

---

## Architecture Decisions

### A1. Standalone бэкенд, Zapis.kz отключаем
Лейла подтвердила: **полная замена Zapis**. Никаких интеграций, никакого `zapis_external_id`.

### A2. Multi-resource scheduling с EXCLUDE constraint
Каждая комната = ресурс с capacity=1. PostgreSQL EXCLUDE USING gist + tstzrange защищает от задвоений.

### A3. Premium tier — отдельная колонка `clients.tier`
Не отдельная таблица tiers (YAGNI — пока 2 уровня), просто enum `'standard' | 'premium'`. Cashback rate хранится в `tenants.cashback_standard_pct` (10) и `tenants.cashback_premium_pct` (15).

### A4. ⭐ Скидки взаимоисключающие, кэшбек от наличной части
**КЛЮЧЕВОЕ РЕШЕНИЕ — основа бизнес-модели Лейлы.**

**Правила:**
- **Скидка** на услугу — только **одна** действующая в момент (Happy Hours OR ручная скидка от админа OR нет)
- **Premium tier — это НЕ скидка**, а **только повышенный кэшбек** (15% vs 10%)
- **Кэшбек начисляется на cashAmount** (то что оплачено реальными деньгами через Kaspi/наличные)
- Часть оплаченная **бонусами не даёт** кэшбек

**Алгоритм расчёта:**
```typescript
// Шаг 1: применяем скидку (Happy Hours или ручная)
const priceAfterDiscount = service.priceCents * (1 - activeDiscountPct / 100)

// Шаг 2: клиент решает сколько списать с баланса
const cashbackToSpend = Math.min(client.balance, priceAfterDiscount)

// Шаг 3: остаток оплачивается реальными деньгами
const cashAmount = priceAfterDiscount - cashbackToSpend

// Шаг 4: кэшбек начисляется ТОЛЬКО на cashAmount
const cashbackRate = client.tier === 'premium' ? 0.15 : 0.10
const cashbackEarned = Math.floor(cashAmount * cashbackRate)
```

**Пример (Standard клиент):**
```
Услуга:                    30 000 ₸
Скидки:                    нет
priceAfterDiscount:        30 000 ₸
На балансе клиента:        15 000 ShantiCoin
cashbackToSpend:           15 000 ShantiCoin
cashAmount:                15 000 ₸
Кэшбек 10%:                1 500 ShantiCoin начислено
```

**Пример (Premium клиент с Happy Hours):**
```
Услуга:                    30 000 ₸
Скидка Happy Hours:        20%
priceAfterDiscount:        24 000 ₸
На балансе клиента:        0 ShantiCoin
cashbackToSpend:           0 ShantiCoin
cashAmount:                24 000 ₸
Кэшбек 15%:                3 600 ShantiCoin начислено
```

**Пример (полная оплата бонусами):**
```
Услуга:                    20 000 ₸
Скидки:                    нет
priceAfterDiscount:        20 000 ₸
На балансе клиента:        25 000 ShantiCoin
cashbackToSpend:           20 000 ShantiCoin
cashAmount:                0 ₸
Кэшбек:                    0 ShantiCoin (нет cashAmount)
```

**Защита от exploits:**
- Невозможен бесконечный круг "кэшбек на кэшбек"
- Кэшбек растёт только с реальной выручки салона
- Premium клиент платит столько же, но возвращается чаще (накопление быстрее)

### A5. Кэшбек от cashAmount — единственная политика
Это резолвит DECISION NEEDED #1 из v1.3. Ответ: **кэшбек от той части цены, которую клиент оплатил деньгами**, не от изначальной и не от финальной цены.

### A6. WhatsApp вместо встроенного чата
В MVP — кнопка «Связаться с админом» открывает WhatsApp с шаблонным текстом. Embedded чат — Phase 2.

### A7. Отзывы — split на 1-3 и 4-5
1-3⭐ остаются внутри приложения. 4-5⭐ — кнопка «Поделиться в 2GIS» с deep-link.

### A8. Видео — только обзоры филиалов, не услуг
1-2 коротких видео по 30-60 сек на филиал. Услуги — фото высокого качества.

`[TBD: confirm with Leila]` — Лейла дописала «360». По умолчанию: обычное видео.

### A9. 30 минут буфер на комнате И мастере
Защита от задвоения комнаты + перегрузки мастера. Реализуется через два EXCLUDE constraint:
1. `booking_resources` (комнаты) — EXCLUDE с буфером
2. `bookings` (мастер) — EXCLUDE на `primary_staff_id` с буфером

`[TBD: confirm with Leila]` — может только комната. По умолчанию: оба.

### A10. ⭐ Промокод приглашения — оба получают по 1000
Подтверждено Арманом 25 апреля. Когда новый клиент B регистрируется и вводит код клиента A:
- B получает 1000 ShantiCoin (welcome bonus)
- A получает 1000 ShantiCoin (referral reward)

**Обоснование:** мотивирует обе стороны быстро записаться.

---

## Database Changes (per Planning Skill Section 1)

### Новые поля и миграции после v1.2

#### Migration 0003: Premium tier для клиентов
```sql
-- packages/db/src/migrations/0003_client_tier.sql
CREATE TYPE client_tier AS ENUM ('standard', 'premium');

ALTER TABLE clients ADD COLUMN tier client_tier NOT NULL DEFAULT 'standard';

-- Индекс для частых запросов "все Premium клиенты":
CREATE INDEX idx_clients_tenant_tier ON clients (tenant_id, tier) WHERE deleted_at IS NULL;
```

#### Migration 0004: Cashback и buffer settings в tenants (УПРОЩЕНО)
```sql
-- packages/db/src/migrations/0004_tenant_cashback_buffer.sql
ALTER TABLE tenants
  ADD COLUMN cashback_standard_pct integer NOT NULL DEFAULT 10,
  ADD COLUMN cashback_premium_pct integer NOT NULL DEFAULT 15,
  ADD COLUMN buffer_minutes_between_bookings integer NOT NULL DEFAULT 30;
-- УБРАНО: max_combined_discount_pct (скидки не складываются — не нужен cap)

ALTER TABLE tenants
  ADD CONSTRAINT cashback_standard_pct_range CHECK (cashback_standard_pct BETWEEN 0 AND 100),
  ADD CONSTRAINT cashback_premium_pct_range CHECK (cashback_premium_pct BETWEEN 0 AND 100),
  ADD CONSTRAINT buffer_minutes_range CHECK (buffer_minutes_between_bookings BETWEEN 0 AND 240);
```

#### Migration 0005: Обновление EXCLUDE с буфером (комнаты)
```sql
-- packages/db/src/migrations/0005_overlap_with_buffer.sql

-- 1. Снимаем старый constraint
ALTER TABLE booking_resources DROP CONSTRAINT booking_resources_no_overlap;

-- 2. Создаём новый с учётом 30 мин буфера
ALTER TABLE booking_resources
ADD CONSTRAINT booking_resources_no_overlap_with_buffer
EXCLUDE USING gist (
  resource_id WITH =,
  tstzrange(
    starts_at,
    ends_at + (
      SELECT (buffer_minutes_between_bookings || ' minutes')::interval
      FROM tenants WHERE id = tenant_id
    ),
    '[)'
  ) WITH &&
);
```

`[TBD: performance test on 10k+ booking_resources]`

#### Migration 0006: Staff-level overlap
```sql
-- packages/db/src/migrations/0006_staff_overlap_guard.sql

ALTER TABLE bookings
ADD CONSTRAINT bookings_staff_no_overlap_with_buffer
EXCLUDE USING gist (
  primary_staff_id WITH =,
  tstzrange(
    starts_at,
    ends_at + (
      SELECT (buffer_minutes_between_bookings || ' minutes')::interval
      FROM tenants WHERE id = tenant_id
    ),
    '[)'
  ) WITH &&
) WHERE (primary_staff_id IS NOT NULL);
```

#### Migration 0007: ⭐ Детализация bookings для аудита (НОВОЕ в v1.3.1)
```sql
-- packages/db/src/migrations/0007_booking_payment_details.sql

-- Расширение bookings для полной видимости расчёта цены
ALTER TABLE bookings
  ADD COLUMN base_price_cents integer NOT NULL DEFAULT 0,           -- 30 000 (без скидок)
  ADD COLUMN discount_pct integer NOT NULL DEFAULT 0,               -- 20 (если Happy Hours) или 0
  ADD COLUMN discount_reason varchar(32),                           -- 'happy_hours' / 'manual_adjustment' / NULL
  ADD COLUMN cashback_spent_coins integer NOT NULL DEFAULT 0,       -- 15 000 (списано бонусами)
  ADD COLUMN cash_amount_cents integer NOT NULL DEFAULT 0,          -- 15 000 ₸ (оплачено деньгами)
  ADD COLUMN cashback_earned_coins integer NOT NULL DEFAULT 0;      -- 1 500 (начислено за визит)

-- CHECK: priceCents удалить, но сначала пересчитать через generated column
-- (для backward compatibility со старым priceCents)

ALTER TABLE bookings
  ADD CONSTRAINT discount_pct_range CHECK (discount_pct BETWEEN 0 AND 100),
  ADD CONSTRAINT cashback_spent_non_negative CHECK (cashback_spent_coins >= 0),
  ADD CONSTRAINT cash_amount_non_negative CHECK (cash_amount_cents >= 0),
  ADD CONSTRAINT cashback_earned_non_negative CHECK (cashback_earned_coins >= 0);

-- Старая колонка priceCents становится computed (для обратной совместимости):
-- final_price_cents = cashback_spent_coins (1 coin = 1 ₸ paritet) + cash_amount_cents
-- Можно удалить priceCents в Phase 2 или оставить как deprecated
```

**Зачем такая детализация:**
- Полный аудит каждого платежа: сколько было, сколько скидка, сколько бонусами, сколько деньгами, сколько начислили
- Если возникнет спор с клиентом — все данные прозрачны
- Аналитика для Лейлы: какие клиенты больше платят бонусами vs деньгами

### Новые таблицы

#### `cashback_transactions` — история начислений и списаний
```sql
CREATE TABLE cashback_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  type varchar(16) NOT NULL,
    -- 'earned' (начисление за оплаченный booking)
    -- 'redeemed' (списание при оплате booking)
    -- 'expired' (сгорел — 6 месяцев без визитов)
    -- 'admin_adjustment' (Лейла/Алия вручную поправила)
    -- 'referral_bonus' (1000 за приглашение друга / приглашённого)
    -- 'welcome_bonus' (1000 за регистрацию по промокоду)
  amount_coins integer NOT NULL, -- positive for earned, negative for redeemed
  expires_at timestamp with time zone, -- NULL для redeemed/expired/adjustment, дата для earned (6 мес)
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text -- для admin_adjustment, кто и почему
);

CREATE INDEX idx_cashback_client ON cashback_transactions (client_id, created_at DESC);
CREATE INDEX idx_cashback_expiring ON cashback_transactions (expires_at) WHERE expires_at IS NOT NULL;
```

#### `referral_codes` — промокоды
```sql
CREATE TABLE referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  inviter_client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  code varchar(16) NOT NULL,
  used_by_client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_referral_code_unique ON referral_codes (tenant_id, code);
```

**Logic:** При первом запуске нового клиента с промокодом:
1. INSERT cashback_transactions (type='referral_bonus', amount=+1000) для **inviter_client_id**
2. INSERT cashback_transactions (type='welcome_bonus', amount=+1000) для **used_by_client_id**
3. UPDATE referral_codes SET used_by_client_id, used_at

#### `notification_campaigns` — промо-рассылки
```sql
CREATE TABLE notification_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_by_staff_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  title varchar(128) NOT NULL,
  body text NOT NULL,
  segment_filter jsonb, -- {tier: 'premium'} или {last_visit_before: '2026-01-01'} и т.д.
  scheduled_for timestamp with time zone, -- NULL = немедленная отправка
  sent_at timestamp with time zone,
  recipients_count integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
```

### Обновления `services` / `service_variants`

**Поле `service_variants.allows_happy_hours: boolean` (default true)** — некоторые услуги исключены из Happy Hours (Лейла указала «Акция не распространяется на сертификаты»).

```sql
ALTER TABLE service_variants
  ADD COLUMN allows_happy_hours boolean NOT NULL DEFAULT true;
```

---

## Edge Cases (per Planning Skill Section 2)

### Бронирование

- **Concurrent writes:** 2 клиента жмут «Записаться» на один слот
  - **Handled:** EXCLUDE constraint в БД отвергнет второй INSERT
  - В UI: показать «Этот слот только что занят»
- **Partial failure:** Kaspi оплатил, но запись не создалась
  - **Handled:** транзакция БД откатывается, Kaspi возврат через webhook
- **Past dates:** клиент пытается записаться на вчера
  - **Handled:** валидация в Zod schema + БД CHECK constraint
- **Buffer violation:** запись сразу после другой без 30 мин
  - **Handled:** EXCLUDE с буфером отвергнет на уровне БД
  - В UI: блокировка слотов в календаре
- **Timezone:** клиент в другом часовом поясе
  - **Handled:** UTC хранение, Asia/Almaty отображение
- **Network failure:** запрос ушёл, ответ не пришёл
  - **Handled:** idempotency key в headers (UUID на клиенте)

### Кэшбек (новые edge cases в v1.3.1)

- **Полная оплата бонусами (cashAmount = 0):**
  - **Handled:** `cashbackEarned = 0` (нет cashAmount = нет начисления)
  - Это **намеренное** поведение, защита от exploit
  - В UI: предупредить клиента «При полной оплате бонусами кэшбек не начисляется»
- **Concurrent earn/redeem:** клиент платит бонусами, админ корректирует баланс
  - **Handled:** SERIALIZABLE isolation для balance операций, retry на conflict
- **Expired при использовании:** бонусы истекли пока листал меню
  - **Handled:** проверка `expires_at > NOW()` при каждом расчёте баланса
- **Negative balance:** баг позволил уйти в минус
  - **Handled:** CHECK constraint + триггер пересчёта balance из transactions
- **Premium → Standard downgrade:** Лейла понизила tier
  - **Handled:** новые начисления — по новому %, старые остаются как есть
- **Скидка от админа + Happy Hours одновременно:**
  - **НЕ возможно** по правилам v1.3.1 (только одна скидка)
  - **Handled:** валидация в admin panel — при создании ручной скидки её приоритет, Happy Hours игнорируется

### Сертификаты

- **Истёк при использовании:** клиент не знал что истёк
  - **Handled:** проверка `validUntil > NOW()` + уведомление за неделю до истечения
- **QR не сканируется:** старый телефон, плохое освещение
  - **Handled:** fallback — клиент диктует 12-значный код админу
- **Использован дважды:** баг или попытка обмана
  - **Handled:** `prepaid_vouchers.status = 'redeemed'` + CHECK не позволит вернуть в active

### Промо-рассылки

- **Спам:** Лейла отправит 10 рассылок в день
  - **Handled:** soft limit «не более 1 в неделю» — предупреждение в админке
  - Клиент может отключить промо в настройках
- **Большая рассылка 5000 клиентов:**
  - **Handled:** очередь по 100/мин через cron

### Промокод приглашения

- **Клиент пытается ввести свой собственный код:** A приглашает A
  - **Handled:** валидация `inviter_client_id !== used_by_client_id`
- **Один промокод используется дважды:**
  - **Handled:** UNIQUE constraint на (tenant_id, code) + check `used_by_client_id IS NULL` перед использованием

---

## Security Review (per Planning Skill Section 3)

`[SECURITY-REVIEW]` секция — **рекомендую human security expert review перед prod-деплоем.**

### Auth (SMS OTP через Lucia)

**Threat model:**
- ✅ Brute force OTP — rate limit 5 попыток в 10 мин per phone
- ✅ Replay attack — OTP одноразовый, expires_at = 5 мин
- ✅ Session hijacking — HttpOnly + Secure cookies, SameSite=Strict
- ❌ SIM swap — клиент несёт ответственность (Terms of Service)

**Library:** Lucia Auth v3 (`[verify via npm view @lucia-auth/lucia version]`)

**Rate limiting:**
- `/auth/request-otp`: 3 запроса в 10 мин per phone
- `/auth/verify-otp`: 5 попыток в 10 мин per phone, после блок 1 час

### Kaspi Payments

**Threat model:**
- ✅ Webhook impersonation — проверка подписи Kaspi
- ✅ Replay webhook — idempotency через `kaspi_transaction_id`
- ✅ Refund manipulation — refund только через админку

**No custom crypto.** jose для JWT, crypto.timingSafeEqual для подписей.

### PII Handling

- Phone numbers: E.164 формат
- Email: nullable, не основной идентификатор
- Birth dates: только если клиент указал
- Soft delete через `deletedAt`, hard delete через год

### Cashback System (новый раздел в v1.3.1)

**Threat model:**
- ✅ Race condition при concurrent списании: SERIALIZABLE isolation
- ✅ Кэшбек инфляция: невозможна т.к. начисление только на cashAmount
- ✅ Manual adjustment abuse: только Лейла/Алия + audit log + 2FA обязательно
- ✅ Referral abuse: проверка inviter !== invited, UNIQUE codes

### Admin Panel access

- Email + пароль (Argon2id)
- 2FA через TOTP **обязательно для Лейлы и Алии** (powers to upgrade Premium и admin_adjustment)
- Session timeout: 8 часов inactivity
- Audit log всех действий админки

`[SECURITY-REVIEW]` `[TBD: hire security consultant for code audit]` — бюджет ~50-100к тг.

---

## YAGNI Check (per Planning Skill Section 4)

### Включаем сейчас:
- ✅ Multi-tenancy (Жулдыз через 2-3 мес)
- ✅ Domain-neutral именование
- ✅ Audit log таблица (страх Лейлы → нужен trail)
- ✅ Backup автоматический
- ✅ Premium tier (бизнес-критично)
- ✅ Cashback transactions table (детальный аудит)

### Откладываем:
- ❌ Event bus / pub-sub
- ❌ Microservices
- ❌ Feature flags framework
- ❌ Internationalization library (i18next)
- ❌ Real-time WebSocket админки
- ❌ A/B testing framework
- ❌ Subscription tiers таблица (Premium через `clients.tier` хватит)
- ❌ Custom DSL
- ❌ Multi-currency (только KZT)
- ❌ Cap на скидки (`max_combined_discount_pct`) — не нужен т.к. скидки не складываются

---

## Dependencies (per Planning Skill Section 5)

**Все версии нужно verify перед инсталляцией: `npm view <package> version`**

### Backend (apps/api)
- Node.js 20.x LTS
- Fastify 5.8.x — `[verified Apr 24]`
- TypeScript 5.9.x — `[verified Apr 24]`
- Drizzle ORM — `[verify latest]`
- pg — `[verify latest]`
- Lucia Auth — `[verify latest stable, v3+]`
- jose (JWT) — `[verify latest]`
- Zod 4.x — `[verify latest]`
- Fastify-rate-limit — `[verify latest]`
- node-cron — `[verify latest]`

### Frontend
- React 19.x — `[verified Apr 24]`
- Vite 5.x — `[verified Apr 24]`
- TypeScript 5.9.x
- React Router — `[verify latest v6 or v7]`
- TanStack Query — `[verify latest v5]`
- Capacitor 7.x — `[verify latest]`

### Infrastructure
- Hetzner CX22 Frankfurt (€4.50/мес)
- Backblaze B2 (~$0.005/GB/мес)
- Mobizon SMS (~5 тг/SMS)
- Domain shanti-spa.kz (~5000 тг/год)
- Apple Developer ($99/год)
- Google Play ($25 разовый)

---

## Decision Points (per Planning Skill Section 6)

### Резолвенные:
- ✅ DECISION #1 (кэшбек база) — **от cashAmount**
- ✅ DECISION #3 (промокод) — **обоим по 1000**

### Открытые для встречи с Лейлой:

#### 🛑 DECISION NEEDED #2: Buffer 30 мин — где применять
**Options:**
- A) Только для комнаты
- B) Только для мастера
- C) Для обоих (комната + мастер) — **рекомендация**

**Blocks:** Migration 0005 + 0006

#### 🛑 DECISION NEEDED #4: Видео филиалов формат
**Options:**
- A) Обычное видео 30-60 сек MP4 — **рекомендация для MVP**
- B) 360° фото-панорамы (+1-2 нед)
- C) Полный VR-тур (+$500-2000)

#### 🛑 DECISION NEEDED #5: Apple/Google аккаунты на чьё имя
**Options:**
- A) Арман как ИП — быстро (1 нед) — **рекомендация для MVP**
- B) Лейла как ИП Shanti — правильнее, дольше (3-4 нед)

#### 🛑 DECISION NEEDED #6: SMS-провайдер (внутреннее)
**Options:**
- A) Mobizon (~5 тг/SMS) — **рекомендация**
- B) SMSC (~3 тг/SMS, RU-base)
- C) Twilio (~30 тг/SMS, мировой стандарт)

#### 🛑 DECISION NEEDED #7: Цены пакетов для Лейлы
Будет в отдельном документе «Что дальше».

#### 🛑 DECISION NEEDED #8 (НОВОЕ в v1.3.1): Минимальный кэшбек при полной оплате бонусами
**Context:** если клиент платит 100% бонусами, cashAmount=0, кэшбек=0.
**Options:**
- A) **Без минимума** — 0 кэшбек, простая модель — **рекомендация**
- B) Минимальный кэшбек 100 ShantiCoin за визит независимо от cashAmount
- C) Минимальный 1% кэшбек от изначальной цены

**Recommendation:** A — простота, защита от inflation

---

## Estimated Effort

### Сравнение версий

| Phase | v1.2 (мес) | v1.3 (мес) | v1.3.1 (мес) | Изменение |
|-------|------------|------------|--------------|-----------|
| 1. Backend foundation | 1.0 | 1.2 | 1.1 | -0.1 (проще логика скидок) |
| 2. Client app MVP | 1.5 | 1.5 | 1.5 | без изменений |
| 3. Admin panel | 0.5 | 2.0 | 2.0 | без изменений |
| 4. Kaspi + integrations | 1.0 | 1.0 | 1.0 | без изменений |
| 5. iOS/Android wrapping | 1.0 | 1.0 | 1.0 | без изменений |
| 6. App Store submission | 1.0 | 1.0 | 1.0 | без изменений |
| **Buffer (15%)** | 0.9 | 1.2 | 1.15 | пропорционально |
| **Total** | **6.9** | **8.9** | **8.75** | **-0.15 от v1.3** |

**Округляем для Лейлы:** **8-9 месяцев**

### Бюджет

| Статья | v1.2 | v1.3 | v1.3.1 |
|--------|------|------|--------|
| Backend разработка | 600 | 700 | 680 |
| Client app | 500 | 500 | 500 |
| Admin panel (полная CRM) | 100 | 600 | 600 |
| Интеграции | 200 | 200 | 200 |
| Сторы + сертификаты | 100 | 100 | 100 |
| Тестирование + полировка | 200 | 250 | 250 |
| Аккаунты | 100 | 100 | 100 |
| **Итого тыс ₸** | **1 800** | **2 450** | **2 430** |

**Диапазон для Лейлы:** **2.3-2.5 млн тг**

### График траншей

| % | Сумма (при 2.4 млн) | Когда |
|---|------|-------|
| 25% | 600 000 | Подписание меморандума |
| 20% | 480 000 | Backend MVP |
| 20% | 480 000 | Client app PWA |
| 20% | 480 000 | Admin panel |
| 15% | 360 000 | App Store + Google Play launch |

---

## Definition of Done (для milestone v1.0)

### Технические критерии:
- [ ] Все 31 услуга и 5 мастеров Shanti в БД
- [ ] Бронирование через приложение работает на iOS + Android
- [ ] Kaspi оплата сертификатов проходит успешно (test и prod)
- [ ] Кэшбек начисляется на cashAmount автоматически по завершении booking
- [ ] Premium tier применяется правильно (15% vs 10%)
- [ ] Happy Hours скидка применяется на услуги в Пн-Пт 11-13:59
- [ ] Buffer 30 мин корректно блокирует слоты в UI и в БД
- [ ] EXCLUDE constraint защищает от задвоений (verified smoke test)
- [ ] Бэкапы каждую ночь в Backblaze B2 (verified 7 ночей подряд)
- [ ] Uptime Robot мониторит /health каждые 5 мин
- [ ] Push-уведомления приходят за день и за 2 часа
- [ ] WhatsApp-кнопка открывает корректный диалог с админом
- [ ] Все 4 админ-аккаунта могут работать параллельно
- [ ] Admin panel: создание, перенос, отмена бронирований
- [ ] Admin panel: повышение Premium (только Лейла + Алия)
- [ ] Отзывы 4-5⭐ → редирект в 2GIS работает
- [ ] Promo-рассылка отправляется выбранному сегменту
- [ ] Промокод приглашения начисляет 1000 коинов обоим

### Бизнес-критерии:
- [ ] Лейла лично записалась через приложение и довольна UX
- [ ] Алина может составить рассылку через админку без помощи разработчика
- [ ] Один администратор провёл смену **только** через нашу админку
- [ ] Тестовые 50 бронирований в течение недели без потерь данных
- [ ] Среднее время ответа API <500ms на p95
- [ ] Zero downtime в течение приёмочной недели

### Документация:
- [ ] HANDOFF обновлён
- [ ] README в монорепо описывает запуск локально
- [ ] Видео-туториал для администраторов (5-10 мин)
- [ ] Договор обслуживания подписан с условиями SLA

---

## Phase Breakdown

### Phase 1 — Backend Foundation (1.1 мес — в процессе)

**Сделано:**
- ✅ Step 1.0 — Drizzle schema
- ✅ Step 1.1 — Docker Postgres + миграции
- ✅ Step 1.2 — EXCLUDE USING gist
- ✅ Step 1.3 — Fastify routes + Zod
- ✅ Step 1.4 — Seed Shanti

**Впереди:**
- Step 1.5 — SMS OTP auth (Lucia + Mobizon)
- Step 1.6 — Premium tier + cashback miграции (0003-0004, 0007)
- Step 1.7 — Buffer-aware EXCLUDE (0005-0006)
- Step 1.8 — Cashback transactions + service layer (расчёт цены)
- Step 1.9 — Promo-кампании
- Step 1.10 — Audit log
- Step 1.11 — Real CRUD endpoints
- Step 1.12 — Backup в Backblaze B2

### Phase 2 — Client App MVP (1.5 мес)
- React Native через Capacitor (использует apps/client)
- Все экраны прототипа shanti-prototype портируются
- Бизнес-логика подключается к live API
- Отзывы 1-3 / 4-5 split
- WhatsApp кнопка
- Push (FCM + APNS)
- **Особое внимание:** UI расчёта цены **показывает разбивку** (cashbackToSpend, cashAmount, cashbackEarned)

### Phase 3 — Admin Panel (2.0 мес)
- Календарь с drag-n-drop
- База клиентов с поиском, заметками
- Управление сертификатами и кэшбеком
- **Manual adjustment** интерфейс для Лейлы/Алии
- Promo-кампании конструктор
- Сегменты клиентов
- Экспорт CSV/JSON

### Phase 4 — Kaspi + Integrations (1.0 мес)
- Kaspi Pay
- 2GIS deep link для отзывов
- Mobizon SMS
- Email уведомления (опц.)

### Phase 5 — iOS/Android Wrapping (1.0 мес)
- Capacitor сборка
- Splash, иконки, метаданные
- Скриншоты для сторов

### Phase 6 — App Store Submission (1.0 мес)
- Apple/Google верификация
- TestFlight beta
- Public launch

---

## Risks

| Риск | Вероятность | Воздействие | Митигация |
|------|-------------|-------------|-----------|
| Apple отклонит несколько раз | 60% | +1-2 нед | Заранее консультант KZ |
| Kaspi Pay отклонит | 30% | +2-4 нед | Заранее sandbox + требования |
| Лейла передумает по scope | 40% | +1-2 нед | Чёткий меморандум + change-request |
| Mobizon откажет в verification | 10% | +1 нед | Backup: SMSC параллельно |
| Жулдыз требует кастомизаций | 70% (Phase 7) | varies | Multi-tenant архитектура |
| Performance issues (1000+ юзеров) | 40% | +2-4 нед | Мониторинг, индексы |
| Арман выгорит | 50% | +нед | Не >8ч/день после марафона |

---

## Что делаем дальше

1. **Этот документ** — review с Арманом
2. **Документ для Лейлы** «Что дальше» — упрощённый, 1 страница
3. **Уточнения к Лейле:** DECISION #2, #4, #5, #7, #8 (на встрече через 3-5 дней)
4. **Phase 1 Step 1.5** (SMS OTP) — после встречи с Лейлой и аванса
5. **Параллельно:** ИП Армана, Mobizon регистрация, домен, Backblaze

---

*Shanti Thai SPA — версия плана 1.3.1, 25 апреля 2026.*

*Главное изменение от v1.3:*
- *Скидки взаимоисключающие (не аддитивные)*
- *Premium tier — только повышенный кэшбек, не скидка*
- *Кэшбек начисляется на cashAmount (оплачено деньгами)*
- *Промокод — обоим по 1000 ShantiCoin*

*Все TBD пометки — для встречи с Лейлой.*

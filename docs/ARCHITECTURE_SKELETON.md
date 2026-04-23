# Адаптивный скелет — архитектура для переиспользования

*Документ написан: 2026-04-24*
*Для: Арман Новотеев*
*Контекст: Shanti v1.0 → Жулдыз → бутик в ТРЦ → кафе → ...*

---

## 🎯 МИССИЯ ЭТОГО ДОКУМЕНТА

Сделать **Shanti** таким, чтобы **следующий клиент** (Жулдыз) мог быть написан за **2-3 месяца вместо 7-8**. Третий клиент — за **1.5-2 месяца**. Четвёртый — за **месяц**.

Путь к этому — **«Адаптивный скелет»**: частная библиотека переиспользуемых компонентов, на которой ты строишь **кастомные продукты** для каждого клиента.

Это **НЕ multi-tenant SaaS**. Это **«boutique-разработка на своём фреймворке»**.

---

## 📐 ПРИНЦИПЫ СКЕЛЕТА (незыблемые)

### 1. **Domain-neutral в packages, domain-specific в apps**

Любой код в `packages/*` **не знает** что такое «массаж», «зуб», «рубашка», «латте». Он знает **абстракции**: service, booking, staff, client, payment.

Код в `apps/*/src/` — **знает конкретику**. Там может быть `MassageStages.tsx`, `DentalChart.tsx`, `CoffeeMenu.tsx`.

**Правило:** если в имени файла, функции, или переменной встречается доменное слово (mastera, zub, butik) — **это не packages**, это apps.

### 2. **Конфиг вместо хардкода**

Всё что может отличаться между клиентами — в **конфиг-файл**, не в код.

- Шаги бронирования (Shanti: `branch → spa_option → duration → master → datetime`; Жулдыз: `clinic → doctor_specialty → doctor → datetime`)
- Валюта и формат цены (тг для РК, можно рубли/доллары для других)
- Часы работы, таймзона
- Фичи (сертификаты есть/нет, бонусы есть/нет, happy hours есть/нет)
- Тема (цвета, шрифты, лого)

### 3. **Feature flags — всегда**

Каждая «опциональная» фича включается/выключается флагом. Один код, разные клиенты.

### 4. **Theme через tokens, не через хардкод цветов**

Компонент **не знает** конкретных цветов. Он знает `theme.colors.primary` и рисует с этим. Меняем тему — меняется всё приложение.

### 5. **Интерфейсы (TS types) вместо конкретных классов**

Если сущность может быть разной в разных клиентах — определяем **интерфейс**, не класс. Каждый клиент реализует по-своему.

### 6. **Чеклист при написании каждого файла** (критично!)

Перед коммитом любого файла задаём себе вопрос:

> **«Этот файл/функция/переменная — может пригодиться в Жулдыз / бутике / кафе?»**

- Да → **`packages/*`** с domain-neutral именем
- Нет → **`apps/*/src/shanti/`** с доменной конкретикой
- Не уверен → **`apps/*/src/` + TODO-комментарий** на рефакторинг в packages когда второй клиент появится

### 7. **Не оверинженеринг с первого дня**

НЕ пытаемся сделать «универсальный фреймворк» с первого файла. **Первые недели** пишем простой Shanti-код, но **с оглядкой** на будущее абстрагирование. Абстракции появляются **когда** они реально нужны — после 2-3 повторений одного паттерна.

**Правило трёх (Rule of Three):** один раз — пишем. Два раза — копируем с отметкой TODO. **Три раза** — выносим в packages.

---

## 🏗 СТРУКТУРА МОНОРЕПО

```
shanti-monorepo/                      ← Первый клиент, здесь растёт всё
│
├── apps/                              ← Продукты для клиентов (specific)
│   ├── client/                        ← Shanti клиентское приложение
│   │   └── src/
│   │       ├── screens/               ← экраны (Home, Booking, Gift, ...)
│   │       ├── features/              ← Shanti-специфичные фичи
│   │       │   ├── back-balance/      ← только Shanti
│   │       │   ├── happy-hours/       ← только Shanti
│   │       │   └── gift-certificates/ ← только Shanti
│   │       └── config.ts              ← Shanti config
│   │
│   ├── admin/                         ← Shanti админка
│   │   └── src/
│   │       ├── pages/
│   │       ├── features/
│   │       └── config.ts
│   │
│   ├── api/                           ← Shanti бэкенд (Fastify)
│   │   └── src/
│   │       ├── routes/
│   │       ├── features/              ← Shanti-специфичная бизнес-логика
│   │       └── config.ts
│   │
│   └── mobile/                        ← Capacitor обёртка (Фаза 4)
│
├── packages/                          ← Переиспользуемый фундамент (neutral)
│   ├── auth-kit/                      ← ⭐ 100% переиспользование
│   │   ├── sms-otp.ts                 (Lucia + Mobizon/SMSC)
│   │   ├── session.ts
│   │   ├── guards.ts                  (role-based middleware)
│   │   └── types.ts                   (User, Session, Role)
│   │
│   ├── booking-kit/                   ← ⭐ 80% переиспользование
│   │   ├── slot-engine.ts             (проверка доступности, конфликты)
│   │   ├── flow-builder.ts            (настраиваемые шаги через конфиг)
│   │   ├── types.ts                   (Booking, Slot, Executor, Service)
│   │   └── validators.ts
│   │
│   ├── payment-kit/                   ← ⭐ 90% переиспользование
│   │   ├── kaspi.ts                   (Kaspi Pay интеграция)
│   │   ├── webhook-handlers.ts
│   │   └── types.ts                   (Transaction, PaymentStatus)
│   │
│   ├── ui-kit/                        ← ⭐ 70% переиспользование
│   │   ├── components/
│   │   │   ├── Button.tsx             (принимает theme через props)
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Sheet.tsx
│   │   ├── theme/
│   │   │   ├── types.ts               (Theme interface)
│   │   │   └── provider.tsx           (ThemeProvider)
│   │   └── hooks/
│   │       ├── useTheme.ts
│   │       └── useTranslation.ts      (i18n)
│   │
│   ├── db-core/                       ← ⭐ 85% переиспользование
│   │   ├── schema/
│   │   │   ├── clients.ts             (клиенты — везде)
│   │   │   ├── staff.ts               (персонал — везде, но разные роли)
│   │   │   ├── services.ts            (услуги/товары — везде)
│   │   │   ├── bookings.ts            (записи — везде)
│   │   │   ├── branches.ts            (филиалы — везде)
│   │   │   ├── consents.ts            (согласия ПД — везде)
│   │   │   ├── audit-log.ts           (аудит — везде)
│   │   │   └── bonus-transactions.ts  (опционально, через feature flag)
│   │   └── migrations/                (Drizzle миграции)
│   │
│   ├── notifications-kit/             ← ⭐ 95% переиспользование
│   │   ├── push.ts                    (Capacitor push)
│   │   ├── sms.ts                     (Mobizon/SMSC)
│   │   ├── email.ts
│   │   ├── templates/                 (шаблоны уведомлений)
│   │   └── scheduler.ts               (напоминания перед визитом)
│   │
│   ├── shared-types/                  ← ⭐ 100% переиспользование
│   │   ├── domain.ts                  (Client, Staff, Booking, Service...)
│   │   ├── api-contracts.ts           (DTO между client/api)
│   │   └── zod-schemas.ts             (валидация)
│   │
│   └── shared-config/                 ← ⭐ 80% переиспользование
│       ├── feature-flags.ts           (типы флагов)
│       ├── locales-loader.ts          (i18n utilities)
│       └── constants.ts               (формат телефона, и т.д.)
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 🔧 КОНКРЕТНЫЕ ПАТТЕРНЫ

### Паттерн 1: **Booking Flow через конфиг**

❌ Плохо (Shanti-only):
```typescript
// apps/client/src/screens/BookingScreen.tsx
const STEPS = ['branch', 'spa_option', 'duration', 'master', 'datetime']
function nextStep(current: string) {
  if (current === 'branch') return 'spa_option'
  if (current === 'spa_option') return 'duration'
  // ...
}
```

✅ Хорошо (универсально):
```typescript
// packages/booking-kit/flow-builder.ts
export type BookingStep =
  | 'branch' | 'service_option' | 'duration'
  | 'executor' | 'datetime' | 'confirm'
  | 'clinic' | 'doctor_specialty' | 'doctor'
  // ... все возможные шаги

export interface BookingFlowConfig {
  steps: BookingStep[]
  conditionalSteps?: Record<string, (draft: Draft) => boolean>
}

export function buildFlow(config: BookingFlowConfig): FlowEngine { ... }
```

```typescript
// apps/client/src/shanti/booking-flow.ts
export const shantiFlow: BookingFlowConfig = {
  steps: ['branch', 'service_option', 'duration', 'executor', 'datetime', 'confirm'],
  conditionalSteps: {
    service_option: (draft) => draft.service.category === 'spa',
    duration: (draft) => draft.service.durationMinutes == null,
  }
}
```

```typescript
// Будущее: apps/client/src/zhuldyz/booking-flow.ts
export const zhuldyzFlow: BookingFlowConfig = {
  steps: ['clinic', 'doctor_specialty', 'doctor', 'datetime', 'confirm'],
  conditionalSteps: { ... }
}
```

---

### Паттерн 2: **Theme через tokens**

```typescript
// packages/ui-kit/theme/types.ts
export interface Theme {
  colors: {
    primary: string
    primaryForeground: string
    secondary: string
    background: string
    foreground: string
    muted: string
    accent: string
    destructive: string
  }
  fonts: {
    display: string
    body: string
  }
  radius: {
    sm: string
    md: string
    lg: string
  }
  spacing: (multiplier: number) => string
}
```

```typescript
// apps/client/src/shanti/theme.ts
import type { Theme } from '@shanti/ui-kit'

export const shantiTheme: Theme = {
  colors: {
    primary: '#B8794A',          // copper
    primaryForeground: '#FBF8F1', // ivory
    secondary: '#344237',         // deepSage
    background: '#FBF8F1',        // ivory
    foreground: '#2A2E28',        // textMain
    muted: '#8A8B86',
    accent: '#4A5D4F',            // sage
    destructive: '#B8483F'
  },
  fonts: {
    display: 'Evolventa, serif',
    body: 'Evolventa, sans-serif'
  },
  radius: { sm: '8px', md: '16px', lg: '24px' },
  spacing: (n) => `${n * 4}px`
}
```

```typescript
// Будущее: apps/client/src/zhuldyz/theme.ts
export const zhuldyzTheme: Theme = {
  colors: {
    primary: '#0F62FE',          // medical blue
    primaryForeground: '#FFFFFF',
    secondary: '#002D9C',
    background: '#FFFFFF',
    foreground: '#161616',
    muted: '#6F6F6F',
    accent: '#0043CE',
    destructive: '#DA1E28'
  },
  fonts: {
    display: 'Inter, sans-serif',
    body: 'Inter, sans-serif'
  },
  radius: { sm: '4px', md: '8px', lg: '12px' },
  spacing: (n) => `${n * 4}px`
}
```

**Правило:** ни один компонент в `packages/ui-kit/` не пишет `#B8794A` — только `theme.colors.primary`.

---

### Паттерн 3: **Feature Flags**

```typescript
// packages/shared-config/feature-flags.ts
export interface ClientFeatureFlags {
  gift_certificates: boolean
  loyalty_bonus: boolean
  back_balance_tracker: boolean
  happy_hours: boolean
  push_notifications: boolean
  sms_notifications: boolean
  kaspi_payment: boolean
  whatsapp_deeplink: boolean
  reviews_submit: boolean              // в v1.0 только просмотр
  referral_program: boolean

  // Зубная специфика (для Жулдыз)
  dental_chart: boolean
  treatment_plans: boolean
  xray_archive: boolean
  insurance_integration: boolean

  // Ресторанная специфика (для кафе)
  table_reservation: boolean
  menu_ordering: boolean
  delivery: boolean
}
```

```typescript
// apps/client/src/shanti/feature-flags.ts
export const shantiFlags: ClientFeatureFlags = {
  gift_certificates: true,
  loyalty_bonus: true,
  back_balance_tracker: true,
  happy_hours: true,
  push_notifications: true,
  sms_notifications: true,
  kaspi_payment: true,
  whatsapp_deeplink: true,
  reviews_submit: false,              // v1.1
  referral_program: false,            // v1.1

  dental_chart: false,
  treatment_plans: false,
  xray_archive: false,
  insurance_integration: false,
  table_reservation: false,
  menu_ordering: false,
  delivery: false
}
```

```typescript
// В компоненте:
function HomeScreen() {
  const flags = useFeatureFlags()

  return (
    <>
      <Hero />
      {flags.happy_hours && <HappyHoursBanner />}
      {flags.gift_certificates && <GiftBanner />}
      {flags.loyalty_bonus && <BonusTeaser />}
      {flags.dental_chart && <DentalChartPreview />}
    </>
  )
}
```

---

### Паттерн 4: **Domain-neutral naming**

| Shanti-термин | Neutral (в packages) |
|---------------|----------------------|
| `master` (мастер) | `staff` / `executor` / `provider` |
| `spa_option` (сауна/фитобочка) | `service_variant` / `service_option` |
| `happy_hours` | `promo_window` / `time_based_discount` |
| `back_balance_sessions` | `package_sessions` / `subscription_sessions` |
| `gift_certificate` | `prepaid_voucher` / `gift_voucher` |
| `branch` | `location` / `venue` |
| `bonus_transaction` | `loyalty_transaction` |

**В apps/shanti/** — можем использовать доменные слова (`master.tsx` название файла ок).
**В packages/** — только neutral (`staff.ts`, `executor.ts`).

---

### Паттерн 5: **Домен-специфика через расширения типов**

```typescript
// packages/shared-types/domain.ts
export interface Staff {
  id: string
  name: string
  photo_url: string | null
  branch_id: string
  rating: number
  // поля которые ЕСТЬ у всех
}

// Дополнительные поля — через extension:
export interface ShantiMaster extends Staff {
  experience_years: number
  specializations: string[]         // ['massage', 'spa', 'thai']
  languages: string[]                // ['ru', 'th']
}

export interface ZhuldyzDoctor extends Staff {
  medical_license: string            // номер лицензии
  specialty: 'therapist' | 'orthodontist' | 'surgeon' | 'hygienist'
  years_of_practice: number
  diplomas: string[]
}
```

**В packages работает с `Staff`. В apps — с конкретным типом.**

---

### Паттерн 6: **Конфиг клиента = единая точка правды**

Каждый клиент имеет **один файл-конфиг** который знает о нём всё:

```typescript
// apps/client/src/shanti/config.ts
import type { ClientConfig } from '@shanti/shared-config'

export const shantiConfig: ClientConfig = {
  clientName: 'Shanti Thai SPA',
  locale: 'ru-KZ',
  timezone: 'Asia/Almaty',
  currency: 'KZT',
  currencySymbol: '₸',

  branches: [
    { id: 'satpayeva', name: 'Сатпаева 50/1', ... },
    { id: 'nurmagambetova', name: 'Нурмагамбетова 4', ... }
  ],

  businessHours: { open: '10:00', close: '22:00', daysOff: [] },

  theme: shantiTheme,
  flags: shantiFlags,
  bookingFlow: shantiFlow,

  locales: {
    ru: () => import('./locales/ru.json'),
    kk: () => import('./locales/kk.json'),
    en: () => import('./locales/en.json')
  },

  contact: {
    phone: '+7 705 499-21-21',
    whatsapp: '+7 705 499-21-21',
    instagram: '@shanti_thai_spa_ukg',
    email: 'info@shanti-spa.kz'
  },

  integrations: {
    kaspi: { shopId: '...', secret: 'env:KASPI_SECRET' },
    sms: { provider: 'mobizon', apiKey: 'env:MOBIZON_KEY' },
    sentry: { dsn: 'env:SENTRY_DSN' }
  }
}
```

**Один файл конфига = 90% характеристик клиента.**
Меняем его → продукт адаптируется.

---

## ✅ ЧЕКЛИСТ ПЕРЕД КАЖДЫМ КОММИТОМ

Перед `git commit` задаём 5 вопросов:

1. **[Domain-neutrality]** Есть ли в packages/ доменные слова? Если да — переношу в apps/.
2. **[Config vs hardcode]** Могу ли я заменить хардкод на запись в конфиге? Если да — делаю.
3. **[Feature flag]** Это опциональная фича для какого-то будущего клиента? Если да — feature flag.
4. **[Theme tokens]** Использую `theme.colors.xxx` а не `#B8794A`? Если нет — исправляю.
5. **[Rule of Three]** Это уже третий раз когда я пишу похожий код? Если да — выношу в packages.

Если 5 галочек — коммит. Если нет — рефактор сначала.

---

## 🚦 ФАЗОВЫЙ ПОДХОД

### Фаза 1 (Shanti, старт)
- Настройка монорепо
- **Сразу** создаём структуру `packages/*` даже если некоторые пакеты пустые
- `auth-kit`, `db-core`, `shared-types` — первые кандидаты
- Пишем Shanti-код **с оглядкой** на паттерны выше

### Фаза 2-3 (Shanti MVP)
- Выносим в packages то что уже **трижды повторили**
- Документируем `ARCHITECTURE.md` в каждом пакете
- Feature flags — на всех опциональных фичах

### Фаза 4-5 (Shanti → сторы)
- Финальный рефакторинг
- Каждый пакет — **полностью neutral**, проверено code-auditor

### После публикации (v1.0 в сторах)
- Audit: какие apps/-компоненты **можно** вынести в packages/
- `packages/` становится **shared-kit** библиотекой

### Старт Жулдыз
- Новый монорепо `zhuldyz-monorepo/`
- `packages/*` — **npm-зависимости на @shanti/auth-kit, @shanti/ui-kit и т.д.**
  (или pnpm workspace если в одном супер-монорепо)
- `apps/client/` — пишем специфику (карта зубов и т.д.)
- **2-3 месяца** вместо 7-8

### Третий клиент (бутик / кафе)
- Тот же паттерн
- **1.5-2 месяца**
- К этому времени видим что **вот эти 5 паттернов повторяются** → ещё абстрагируем

### После 3-4 клиентов — время для настоящего v2.0 SaaS
- Multi-tenant архитектура
- Белые-лейбл
- Онбординг новых клиентов за **день**, не месяц

---

## ❌ АНТИПАТТЕРНЫ (что НЕ делаем)

### 1. Не абстрагируем ДО первого дублирования
Если **в Shanti** пишу функцию `calculateHappyHoursDiscount()` — она живёт в `apps/client/src/shanti/`, **не** в `packages/`. До тех пор пока **второй клиент** не попросит похожую фичу.

### 2. Не создаём сущности "на всякий случай"
Нет `SuperGenericBookingEngine` с 50 конфигурационными опциями. **Одна простая реализация**, которую **рефакторим** когда нужен второй вариант.

### 3. Не переписываем Shanti "под скелет" постоянно
Рефакторинг в packages — **между фазами**, не **во время** фазы. Фокус на доставку Shanti v1.0 в сторы.

### 4. Не делаем config настолько гибким что в нём можно всё
Конфиг — **данные**, не код. Если в конфиг попадает функция или сложная логика — **это уже код**, должен быть в TypeScript.

### 5. Не смешиваем Shanti и Жулдыз в одном монорепо (на первом этапе)
Shanti — отдельный репо. Жулдыз — отдельный репо, **зависит** от `@shanti/*` пакетов через npm. Объединять в один мульти-клиентский монорепо — **только** когда уже 3+ клиентов и паттерны устаканились.

---

## 🎯 КРИТИЧЕСКИЕ ФАЙЛЫ (с первого дня)

Эти файлы **создаём в день 1 Фазы 1** монорепо:

1. **`packages/shared-types/src/domain.ts`** — базовые доменные типы (Client, Staff, Booking, Service, Branch)
2. **`packages/shared-config/src/feature-flags.ts`** — интерфейс `ClientFeatureFlags`
3. **`packages/ui-kit/src/theme/types.ts`** — интерфейс `Theme`
4. **`apps/client/src/shanti/config.ts`** — главный конфиг Shanti
5. **`docs/ARCHITECTURE_SKELETON.md`** — этот файл (living document)

**Пересматриваем ARCHITECTURE_SKELETON раз в месяц** по ходу проекта — обновляем паттерны, добавляем новые антипаттерны, корректируем правила.

---

## 💰 ЭКОНОМИЧЕСКИЙ СМЫСЛ

Без скелета:
- Shanti 1.8 млн за 7 мес
- Жулдыз 1.5 млн за 6 мес (с нуля) = **итого 3.3 млн за 13 мес**

С адаптивным скелетом:
- Shanti 1.8 млн за 7-8 мес (+1 месяц на «правильность», окупается)
- Жулдыз 1.5 млн за 2-3 мес = **итого 3.3 млн за 10 мес**
- **+3 месяца свободного времени** на третьего клиента

Третий клиент:
- **Без скелета:** 1.5 млн / 5 мес = 300к/мес
- **Со скелетом:** 1.5 млн / 1.5 мес = **1 млн/мес** 🔥

**Скелет окупается на втором клиенте, монетизируется на третьем.**

---

## 🌿 ПОСЛЕДНЕЕ СЛОВО

Жаным, этот документ — **твой контракт с собой**. Когда в Фазе 1 ты будешь писать booking-logic и захочется «просто захардкодить для Shanti» — вспомни что **через 3 месяца** Алина принесёт Жулдыз, и **тебе** потом разбирать этот захардкод.

Правило:
- Shanti — это **первый клиент**.
- Но **ты уже строишь платформу** своих будущих продуктов.
- Каждая строка Shanti — это **инвестиция** в будущих клиентов или **техдолг** перед ними.

Документ — **живой**. Обновляем когда учимся новому.

— Клод, 24 апреля 2026, Усть-Каменогорск 🌿

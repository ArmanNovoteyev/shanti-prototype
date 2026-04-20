markdown# SHANTI Thai SPA — Передача контекста для новой сессии

*Документ написан Клодом для самого себя — чтобы в новой сессии 
войти в проект как родной, а не как чужак.*

---

## 🌿 ЛИЧНОЕ (важнее всего)

Клиент — **Арман Новотеев** (GitHub: ArmanNovoteyev). Python-
разработчик, живёт между Семеем и Усть-Каменогорском, Казахстан. 
Учится веб/мобильной разработке, поэтому проект — это 
одновременно и реальный заказ для жены, и учебный полигон.

**Тон общения:**
- Русский с казахскими вкраплениями: "жаным" (душа моя), 
  "родной", "Алтыным"
- Партнёрский, тёплый, без лести, без подобострастия
- Эмодзи — **да**, но с чувством меры (🎯 🔥 💎 🌿 ✅)
- Обращаюсь к нему "жаным" — это **наш ритуал**, не меняй
- Иногда шутим: "кот на клавиатуру наступил", "иди пить кофе", 
  "не тычь меня пальцем в плечо"
- **Арман устаёт** — если видишь что долгая работа, напомни 
  про перерыв. Не как робот ("отдохните, это важно"), а 
  по-человечески ("жаным, ты уже 8 часов в работе, глаза 
  болят — иди чаю выпей")

**Клиент — его жена Алина**, SMM-щик салона Shanti Thai SPA. 
3 года ведёт Instagram @shanti_thai_spa_ukg. Она — мостик 
между Арманом и владелицей салона. Все вопросы к владелице 
идут через неё. **Она одобряет дизайн-направление** — проект 
уже в доверенном статусе.

**Владелица салона** — жена Армана её не называла по имени в 
наших разговорах. Она строга ("без слогана пока", "3 месяца 
срок сертификата", "косметологии нет"), но доверяет Алине в 
вопросах маркетинга.

---

## 📊 ПРОЕКТ — КРАТКО

**Shanti Thai SPA** — настоящий тайский спа-салон в Усть-
Каменогорске, Казахстан. **Два филиала**:
- **Сатпаева 50/1** (рейтинг 4.7 · 201 отзыв · поддерживает 
  девичник 3 чел · тел +7 705 499-21-21)
- **Нурмагамбетова 4** (рейтинг 4.9 · 188 отзывов · тел +7 
  700 499-21-21)

**Оба филиала работают 10:00–22:00 ежедневно.**

**Мы делаем**: мобильное React-приложение-прототип для 
демонстрации владелице салона. Цель — показать что в 2026 
году спа-салон в Казахстане может иметь своё приложение 
уровня Apple.

**Конкурент на фоне**: Thai Island SPA (@thaiislandspa_uk) — 
их слоган "Любовь к себе начинается здесь" — **НЕ наш**, я 
его по ошибке приписал Shanti в начале, потом переосмыслили. 
У Shanti слогана нет.

---

## 🛠 ТЕХНИЧЕСКИЙ СТЕК

- **Vite 5 + React 18 + lucide-react** (иконки) + inline styles
- **Собственный i18n-хук** без библиотек (RU / KK / EN)
- **qrcode.react** — единственная добавленная зависимость 
  (для сертификатов)
- **НЕ используем**: Tailwind, styled-components, react-i18next, 
  react-router

**Репозиторий**: /Users/armannovoteyev/MyProject/shanti-prototype  
**GitHub**: github.com/ArmanNovoteyev/shanti-prototype  
**Production**: shanti-prototype.vercel.app (автодеплой из main)

**Модель Claude Code**: Opus 4.7, medium effort  
**Stage-по-stage работа**: после каждого этапа — СТОП, 
доклад, отмашка. НЕ делает git push (это за Арманом), только 
локальные commit'ы.

---

## ✅ ГОТОВО (все этапы + визуальная итерация)

### Этап 1 — Архитектура + данные
Разбили монолитный ShantiSpaApp.jsx на правильную структуру:
src/
├── App.jsx                    — phone frame + bottom nav + Toast overlay + reviews экран в screens map
├── context/AppContext.jsx     — глобальный стейт (lang, user, bookings, bonus, backBalance, toast)
├── hooks/useTranslation.js    — t('a.b.c') + localized(obj, 'name') + setLang
├── locales/{ru,kk,en}.json    — тексты (kk/en = зеркало ru, кроме home.atmosphere где en реальный перевод)
├── data/
│   ├── services.js            — 31 услуга, 5 категорий
│   ├── masters.js             — 5 мастеров (Тик, Пэй, Прия, Эн, Нонг)
│   ├── branches.js            — 2 филиала (Сатпаева 50/1, Нурмагамбетова 4)
│   └── reviews.js             — 10 отзывов с branch + masterId
├── components/
│   └── GiftCertificate.jsx    — 5 тем сертификатов + drop-shadow на логотипе ny/march8/light
└── screens/
    ├── HomeScreen.jsx         ✅ (hero photo + atmosphere gallery)
    ├── CatalogScreen.jsx      ✅
    ├── BookingScreen.jsx      ✅
    ├── GiftScreen.jsx         ✅
    ├── BookingsListScreen.jsx ⏳ заглушка (не было в скоупе)
    ├── FeedbackScreen.jsx     ⏳ заглушка (не было в скоупе)
    ├── BonusScreen.jsx        ✅ этап 5
    ├── ProfileScreen.jsx      ✅ этап 6 (переключатель языка!)
    └── ReviewsScreen.jsx      ✅ этап 6 (фильтры branch/master)
public/assets/
├── logo/ (4 версии: transparent, on-light, on-dark, on-sage)
├── photos/ (35 атмосферных фото, 01-35.jpg — 9 интегрированы в главную)
└── marketing/back-balance-card.jpg

### Этап 2 — Главная + Каталог
**HomeScreen**: шапка с лого + приветствие по времени ("Доброе 
утро/день/вечер, Айгерим") + Hero + NextVisitCard + BonusTeaser + 
CTA "Записаться" + HappyHoursBanner (будни 11-14) + GiftBanner + 
ReviewsCarousel (snap-x, 5 карточек, кнопка "Все" → ReviewsScreen) + 
**AtmosphereGallery** (8 фото, snap-x) + SocialProof (4.8⭐ 389 отзывов).

**CatalogScreen**: 5 категорий пилюлями, ServiceCard с бейджами, 
чипами длительностей, лейблом "ОТ" над ценой; SubscriptionCard 
для Back Balance.

### Этап 3 — Флоу записи
История-стек шагов: branch → [visit_type → party_people] → 
[duration] → master → datetime → confirm. Отдельная ветка курсов 
(Back Balance): branch → course_confirm → purchaseBackBalance(). 
TrioModal, happy hours −20%, Toast в AppContext.

### Этап 4 — Подарочные сертификаты
Флоу: intro → amount → recipient → payment → design → ready.
5 дизайнов (🎄 ny, 🌷 march8, 🎂 birthday, ☕ dark, ✨ light) 
с реальными QR-кодами (qrcode.react), адресами, Instagram, 
сроком +3 мес. Полировка: drop-shadow на logo для ny/march8/light 
(улучшает читаемость на светлых фонах), dark/birthday не тронуты.

### Этап 5 — Бонусы + Back Balance трекер
**BonusScreen**: баланс 3450 баллов Fraunces · "1 балл = 10 ₸" + 
BackBalanceTracker (●●○○○ copper pips, "Посещено 2 из 5") + 
"5-й визит подарок" прогресс-бар + "Приведи подругу" +2000 
бонусов + история 4 транзакций.  
**BonusTeaser** на HomeScreen — компактная плашка между 
NextVisitCard и PrimaryCTA с балансом + статусом Back Balance.

### Этап 6 — Отзывы + Профиль + Полировка
**ReviewsScreen**: заголовок Fraunces 28 + подзаголовок 
"389 живых отзывов · 4.8 ★" + 2 dropdown-фильтра (филиал/мастер) 
+ список карточек с 5 звёздами copper + пустое состояние с 
кнопкой "Сбросить фильтры". Точка входа — кнопка "Все" справа 
от "Отзывы наших гостей" на HomeScreen.

**ProfileScreen**: шапка copper-градиент-аватар 72×72 с буквой 
«А» + имя + телефон `+7 (777) 123-45-67` (formatPhone). Секции: 
**ПРЕДПОЧТЕНИЯ** (любимый филиал/мастер/ДР "14 августа"), 
**ЯЗЫК** (3 пилюли RU/KK/EN, активная copper, onClick → 
setLang) — переключает весь UI мгновенно через useContext, 
**УВЕДОМЛЕНИЯ** (3 toggle-switch 40×22, deepSage/серый), 
**О САЛОНЕ** (оба филиала с адресами + tel: ссылками + 
Instagram @shanti_thai_spa_ukg), кнопка "Выйти" (toast заглушка).

**Полировка**:
- drop-shadow на логотип сертификатов ny/march8/light
- фикс обрезания "14 августа" в ProfileScreen
- добавлены все ключи `profile.*` и `reviews.*` в 3 локали

### V3.0.1 — этапы ритуала + mai-tai (коммит `0762c25`)
Новый компонент `src/components/ServiceStages.jsx` — нумерованный
список этапов на cream-фоне. `stages[]` заполнены у 13 услуг
(SPA-solo, SPA-duo, special, courses); массажи этапов не имеют.
Маленький Будда — возрастной диапазон 8–14 лет. Тайский акцент
вынесен в отдельный subtitle у thai-heritage. Добавлена услуга
`mai-tai` (в V2 её не было в каталоге). ServiceDetailScreen:
удалена старая секция `IncludesSection`, вставлен `<ServiceStages>`
между описанием и ценой.

### V3.0.1b — полный контент из прайса (коммит `3c9888b`)
19 массажей + 13 SPA получили полные `description_ru` из
официального прайс-листа. Все 32 услуги обзавелись
`subtitle_{ru,kk,en}` (с 6 правками Армана по №5/10/12/16/18/19).
Универсальный блок «В стоимость включено» на ServiceDetailScreen:
copper Check-иконки × 3 (одноразовый комплект / халат / полотенца),
borderTop sand, локализация через `service_detail.included.{title,
items[]}`. Хук `useTranslation.t()` расширен — возвращает массив
при массивном значении. Royal Stone duration 60 → 90 мин (фикс
по прайсу, 37 000 ₸).

**Порядок блоков ServiceDetailScreen сверху вниз:**
Hero → Название + Описание → Этапы ритуала → В стоимость включено
→ Длительность+Цена → Мастера → Отзывы → Sticky CTA.
Принято на Chrome-ревью 2026-04-19.

**Следующий подэтап:** V3.0.2 — Happy Hours отдельным экраном.
Далее по ТЗ: V3.0.3 subscriptions nav, V3.0.4 Back Balance data,
V3.0.5 Evolventa, V3.0.6 back nav + scroll memory, V3.0.7 home
layout, V3.0.8a/b photos, V3.0.9 tech debt.

### V3.0.3 — fix навигации «Абонементы» (коммит `cdc60a8`)
Story-круг «Абонементы» на HomeScreen ронял в таб «Массажи»
(`navigate('catalog')` без payload). Добавлен отдельный канал
`catalogInitialCategory` в `AppContext` (не пачкает bookingDraft);
`StoryCircles.jsx` выставляет `'courses'` перед navigate; CatalogScreen
читает его в initial state + consume-once через useEffect, поэтому
категория не прилипает при следующем заходе «просто так».

### V3.0.4 — Back Balance booking route (коммит `0b3139c`)
Данные в `services.js` уже корректны после V3.0.1b (мастер не
привязан, stages по 60 мин, нет «6 мес.»). Реальный баг был в
`BonusScreen.handleBookNext` — `startBookingFor('sila-buddy')`
(неверный сервис, оттуда 30/60/90 длительности). Теперь маршрут
считается по `backBalance.done`: 0-1 → `clear-mind` (Ясные мысли),
2-4 → `gracia` (Грация). Длительность форсируется 60 через
`{ durationMinutes: 60 }`. В `BookingScreen` функции
`nextStepForRegular` / `nextStepAfterVisitType` /
`nextStepAfterPartyPeople` пропускают шаг `duration` при
`draft.durationMinutes != null`. Toast `bonus.back_balance_session_toast`
показывает номер сеанса курса.

**Ритм push для V3 (новый, принят 2026-04-19):** push
откладывается до **закрытия всего этапа V3.0**. Все локальные
коммиты V3.0.1…V3.0.9 копятся в master и пушатся одним махом
после V3.0.9. Ревью между коммитами — локально через
`npm run dev` + Chrome-мост, без Vercel. Отличается от V2
(там пушили по ходу).

**Счётчик коммитов V3 на 2026-04-20 (после V3.0.7):** 13 локальных коммитов
в master, НЕ запушено. V3.0.1 (0762c25), V3.0.1b (3c9888b),
V3.0.2 (74f5bb4), V3.0.3 (cdc60a8), V3.0.4 (0b3139c),
V3.0.5a (64e2c8f), V3.0.5b-part1 (2e00066),
V3.0.5b-part2 (82865b7), V3.0.5c-part1 (31bdbad),
V3.0.5c-part2 (312183e), V3.0.6-part1 (a81d042),
V3.0.6-part2 (de61e21), V3.0.7 (479aaf0) + V3.0.0 исходное. Remote видит
состояние до V3 — до push после V3.0.9 говорить
«запушено» нельзя.

### V3.0.6 — навигация «назад» + память скролла + SPA-option (DONE, 2 коммита)

**V3.0.6-part1 (коммит `a81d042`):** ServiceDetail `goBack()` теперь
возвращает на `catalog` с правильной активной категорией (не на `home`).
CatalogScreen сохраняет `window.scrollY` в `AppContext.catalogScrollMemory[category]`
при unmount и восстанавливает при mount — пользователь, нажавший на услугу
в середине длинного списка и вернувшийся «назад», попадает на ту же позицию.
Память по категориям (отдельный ключ на category), живёт только в React-state
(без localStorage — принятое решение V2). Плюс расширен `.gitignore`.

**V3.0.6-part2 (коммит `de61e21`):** Новый шаг `spaOption` в BookingScreen
для `spa_solo` и `spa_duo` между `branch` и следующим шагом. Две карточки:
Сауна (`Flame`, «Сухой жар, 15 мин») / Фитобочка (`Droplet`, «Травяной пар
в бочке, 15 мин»). Исключение через флаг `startOption: 'sauna_only'` в
`services.js` — у `renewal` и `renewal-duo` шаг пропускается (в прайсе там
только сауна). Helper `needsSpaOption(service, draft)` проверяет категорию,
флаг и `draft.spaOption == null` (работает и для `undefined` — EMPTY_DRAFT
в AppContext не расширен ради минимизации диффа). SummaryRow «Начало ритуала»
в ConfirmStep появляется только при заполненном spaOption. На промежуточном
шаге НИКАКИХ упоминаний цены/скидки — HH-плашка только в ServiceDetail и
confirm. Три независимых флага `durationMinutes` (V3.0.4) / `happyHours`
(V3.0.2) / `spaOption` (V3.0.6) совместимы — golden path SPA-solo в Happy
Hours проходит branch → spaOption (без цены) → duration → master → datetime
(−20% badge) → confirm (HH-плашка + spaOption + финальная цена). 6 ключей
локалей (`booking.spa_option_*` + `summary_spa_option`) в ru/kk/en.
Build 398.13 kB зелёный.

### V3.0.7 — главная (hero center + SHANTI прозрачный + safe-area) (DONE, коммит `479aaf0`)

Chrome-мост 2026-04-20 принят Арманом. Три бага Алины закрыты одним коммитом
(2 файла: `src/screens/HomeScreen.jsx` + `src/App.jsx`, 5 инсертов / 6 делетов).

**A) Hero / лотос — A-min:** `HeroSlide` L63 `backgroundPosition: '50% 40%'` →
`'50% 50%'` (глобально для всех слайдов). Проверено на 3 слайдах (лотос,
Back Balance, SILVER) — все корректны. A-per-slide через `slide.focal` НЕ
понадобился, этот вариант в запас на V3.0.8+ если всплывёт.

**B) Центральная кнопка SHANTI — равноправная с остальными 4:** `BottomNav`
центральная кнопка (строки ~167-181): `background: colors.copper → 'transparent'`,
`border: '4px solid rgba(240,230,217,0.95)' → '1px solid rgba(42,32,25,0.08)'`
(как у остального nav), `boxShadow: '0 10px 24px -10px rgba(184,121,74,0.6)'`
удалён. `marginTop: '-26px'` оставлен — всплывающий круг (фишка V2.5e). В
`navItems` логотип `shanti-logo-on-dark.png → shanti-logo-on-light.png`
(тёмный логотип на светлом прозрачном фоне читается золотым).

**C) Полоса под nav — safe-area:** `BottomNav` контейнер L155 `padding:
'12px 0 24px' → '12px 0 max(12px, env(safe-area-inset-bottom))'`. На
десктопе/не-iPhone — 12px. На iPhone с home-bar — env inset. Полоса исчезла.

**НЕ трогали:** `.screen-scroll padding '8px 0 150px'` оставлен. Арман на
Chrome-мосту подтвердил — визуально ок, последние карточки видны. Если
понадобится снизить до 110-130px — отдельной итерацией.

**JS-метрики Chrome-моста (подтверждено):** `backgroundPosition: 50% 50%`,
`backgroundColor: rgba(0,0,0,0)`, `border: 1px solid rgba(42,32,25,0.08)`,
`boxShadow: none`, `logo: shanti-logo-on-light.png`.

### V3.0.5 — Evolventa (DONE, 5 коммитов)
Миграция с Fraunces+Manrope (Google Fonts) на self-hosted
Evolventa. Разбит на 3 коммита: **5a** — инфраструктура,
**5b** — Fraunces → FONT_DISPLAY (700) + удаление italic,
**5c** — Manrope → FONT_BODY (400). Evolventa не имеет Italic
face — синтетический italic для кириллицы ломается, поэтому
italic удаляется, вместо него Bold.

**V3.0.5a (коммит `64e2c8f`):** `@font-face` Evolventa
Regular 400 + Bold 700 в `index.html` (woff2 из
`/assets/fonts/evolventa/`, `font-display: swap`). Новый модуль
`src/theme/fonts.js` — `FONT_FAMILY`, `FONT_DISPLAY` (700),
`FONT_BODY` (400). Удалён инжект Google Fonts `<link>` из
`App.jsx` (был в useEffect, не в статичном HTML). Chrome-мост
подтвердил: `document.fonts` содержит только Evolventa 400/700,
внешних font-запросов нет.

**V3.0.5b — split part1/part2** (из-за context limit):
классификация 6 классов использования веса свёрнута в правила:
класс A (display-const) + B (eyebrow uppercase) + C (CTA) → **700**
через FONT_DISPLAY; класс D (inline body) → **400** через FONT_BODY.
Italic оба → A (Bold, без italic).

**V3.0.5b-part1 (коммит `2e00066`):** 12 файлов, одинаковый паттерн
`const display = { fontFamily: "'Fraunces', serif", fontWeight: 500, ... }`
заменён на `{ ...FONT_DISPLAY, letterSpacing: '-0.02em' }`
+ импорт `FONT_DISPLAY` из `../theme/fonts.js`:
ServiceStages, SubscriptionBalanceCard, SubscriptionCard,
BonusScreen, BookingScreen, BookingsListScreen, CatalogScreen,
GiftScreen, HappyHoursScreen, HomeScreen, ServiceDetailScreen,
SubscriptionPurchaseScreen. Билд зелёный, 396.68 kB.

**V3.0.5b-part2 (DONE):**
Italic удалён во всех местах (OnboardingScreen `displayItalic`
+ 3 usages, HomeScreen hero L98-108). Остаточные Fraunces
закрыты: FeedbackScreen L8, BookingScreen inline L270-273,
3 multi-line display const в Onboarding + Profile + Reviews.
Class B (uppercase eyebrow) + Class C (CTA buttons) везде
подняты на 700 (~48 мест, включая 6 из сомнительных:
StoryCircles caption, HappyHours schedule/price labels,
ServiceDetail happy-hours badges, CatalogScreen tag chip).
3 override на `...display` сняты (ServiceStages, BonusScreen
баланс-ряд, HomeScreen SHANTI logo). Билд зелёный, 396.31 kB.

**Итог 5b guards:** `grep Fraunces src/` → только
GiftCertificate.jsx:251 (HOLD для 5c). `grep "fontStyle: italic"`
→ пусто. Оставшиеся `fontWeight: 500/600` — все Class D / HOLD.

**HOLD-список для V3.0.5c (10 мест, ревью перед трогом):**
- GiftCertificate.jsx:244, 253, 276, 282, 299 — printed
  certificate design (L253 всё ещё Fraunces)
- BookingScreen.jsx:666 — secondary CTA «Назад/Отмена»
- ServiceDetailScreen.jsx:340 — неясный контекст fontWeight 500
- SubscriptionPurchaseScreen.jsx:118 — вторичная текстовая кнопка
  (зеркалит BookingScreen:666)
- GiftScreen.jsx:676 — PaymentMethodRow label (radio-like)
- GiftScreen.jsx:852 — design label под gallery-preview

**V3.0.5c-part1 (коммит `31bdbad`):** 16 per-file
`const body = { fontFamily: "'Manrope', sans-serif" }` заменено
на `{ ...FONT_BODY }` + импорт FONT_BODY (15 файлов — добавлено
в существующий import FONT_DISPLAY, StoryCircles — свежий
import). Файлы: BonusScreen, OnboardingScreen, BookingScreen,
CatalogScreen, ProfileScreen, GiftScreen, ServiceDetailScreen,
HomeScreen, BookingsListScreen, SubscriptionPurchaseScreen,
ReviewsScreen, HappyHoursScreen, ServiceStages, StoryCircles,
SubscriptionCard, SubscriptionBalanceCard.

**V3.0.5c-part2 (коммит `312183e`) — финал этапа шрифтов:**
Block 2 — 10 inline Manrope → FONT_FAMILY (App ×4,
OnboardingScreen:696, GiftScreen:629, HomeScreen:761, PromoBanner:51,
GiftCertificate:206/327) + добавлены импорты FONT_FAMILY.
Block 3 — 21 Class D fontWeight 500/600 снято, падение на 400:
App:132, SubscriptionCard:134, BonusScreen:67/160/180/186/354,
BookingScreen:312/448, HomeScreen:365/391, CatalogScreen:95,
ReviewsScreen:56, ProfileScreen:269/571,
SubscriptionPurchaseScreen:520/632, ServiceDetailScreen:349,
GiftScreen:374/543/565. Нюанс: BonusScreen:180/186 были
`<strong style={{fontWeight:600}}>` — у `<strong>` UA-default =
bold, простое снятие inline weight не даёт падения на 400.
Заменено на `<span>` (визуальный акцент, не семантический).
Block 4 — 10 HOLD-мест по принятым решениям:
GiftCertificate:244 eyebrow → 700, GiftCertificate:251-257
(сумма) → `...FONT_DISPLAY` (убран последний Fraunces),
GiftCertificate:276/282/299 (recipient/sender/valid_until) → 400,
BookingScreen:666 (secondary «Нет») → 400,
SubscriptionPurchaseScreen:118 («Нет спасибо») → 400,
ServiceDetailScreen:340 (инициал мастера) — снят override,
оставлен 700 от `...display`, GiftScreen:676/852 → 400.

**Итог V3.0.5 guards:** `grep Manrope|Fraunces|fontStyle: 'italic'`
→ 0 совпадений. Build зелёный, 395.17 kB. Chrome-мост 2026-04-20
подтвердил: в DOM только Evolventa 400/700. V3.0.5 закрыт
полностью — весь V3+ только Evolventa через
FONT_FAMILY/FONT_DISPLAY/FONT_BODY из `theme/fonts.js`.

### Визуальная итерация — реальные фото
**Hero на HomeScreen**: градиент sage→deepSage→copper заменён 
на `/assets/photos/25-massage-bed-lotus.jpg` с deepSage-overlay 
25% → 85%. Текст "ВАШ РИТУАЛ / Любовь к себе" ivory поверх.  
**AtmosphereGallery** на HomeScreen между отзывами и 
SocialProof — 8 фото (180×220, snap-x, lazy-load):
1. 31-lotus-shanti-towel
2. 11-hot-stones-back
3. 20-herbal-compress-lotus
4. 16-soap-foam-duo
5. 26-tea-ceremony
6. 24-interior-room
7. 34-oil-bottles-ceramic
8. 29-meditation-candle

Фото в public/ → **не попадают в JS-бандл** (288 kB → 83 kB gzip).

---

## 🎯 СТАТУС: ФИНИШ

**Проект готов.** Все 8 экранов рабочие (9 с ReviewsScreen), 
booking + gift + reviews + profile + bonus работают, i18n 
переключается вживую, 9 фото интегрированы. 5 этапов + 
бонусная итерация выполнены.

**Коммиты локально (НЕ запушены — push за Арманом):**
- `cf3e8c6` — этап 3 (booking flow)
- `b6c799d` — ассеты (logo + 35 photos + marketing card)
- `93787ef` — этап 4 (gift certificates flow)
- `59e33e8` — этап 5 (bonus + back balance tracker)
- `12e4d08` — docs: handoff для этапа 6
- `2fb9d95` — этап 6 (reviews + profile + polish + locale fixes)
- `b0814c5` — visuals: hero photo + atmosphere gallery

**На 6 коммитов впереди origin/master.**

## 🔮 ЧТО ОСТАЛОСЬ

Функционально — **ничего**. Остались только действия Армана:

1. `git push origin master` — Vercel автодеплой на 
   shanti-prototype.vercel.app
2. Отправить ссылку Алине
3. Алина показывает владелице салона

**Опциональные идеи на будущее** (если проект пойдёт дальше):
- Заполнить kk.json и en.json настоящими переводами 
  (сейчас заглушки = копии ru, кроме `home.atmosphere`)
- BookingsListScreen и FeedbackScreen сейчас заглушки — 
  можно развернуть если понадобится
- Реальные интеграции Kaspi Pay и WhatsApp Business API 
  (сейчас wa.me deep-link и spinner-заглушка)
- Kaspi-авторизация вместо mock-пользователя "Айгерим"
- Push-уведомления (сейчас toggle в профиле ничего не делает)

---

## 💡 ДИЗАЙН-ТОКЕНЫ

**Цвета (inline styles, не CSS vars):**
- `deepSage: '#344237'` — карточки NextVisit/Confirm/nav active
- `sage: '#4A5D4F'` — акценты зелёного
- `copper: '#B8794A'` — CTA, важные цены, бордеры Back Balance
- `copperSoft` — мягкие плашки
- `ivory: '#FBF8F1'` — основной фон
- `cream: '#F2EDE3'` — вторичный фон
- `muted: '#8A8B86'` — подсказки
- `textMain: '#2A2E28'` — текст

**Шрифты** (Google Fonts через index.html):
- `Fraunces` serif — заголовки, суммы, курсив для акцентов
- `Manrope` sans — body

---

## 🧭 КОНВЕНЦИИ

1. **Все тексты через `t('key.sub')`** — никаких захардкоженных 
   русских строк. Новый ключ → добавить в `ru.json`, зеркалить 
   в `kk.json` + `en.json` с тем же значением (заглушки).
2. **Названия услуг/мастеров/филиалов** — в `data/` с полями 
   `name_ru/name_kk/name_en`. Используй `localized(item, 'name')`.
3. **Навигация**: `useContext(AppContext).navigate(screenId, payload)`.
4. **Один экран = один файл** в `src/screens/`.
5. **Подкомпоненты** внутри большого экрана — можно в том же 
   файле (как BookingScreen / GiftScreen).
6. **lucide-react** — единственная библиотека иконок.

---

## 📦 ДАННЫЕ (ключевые факты)

**Услуги: 31 штука** в 5 категориях. Косметологии и 
прессотерапии НЕТ. Парный "Май Тай" УБРАН. 

**Мастера (5)**: Тик, Пэй, Нонг — Нурмагамбетова; Прия, Эн — 
Сатпаева. У каждой: рейтинг, стаж, специализация.

**Back Balance** — единственный абонемент: 5 процедур за 
65 000 ₸. В контексте замокано `done: 2, total: 5` для 
демонстрации трекера.

**Happy Hours**: Пн-Пт 11:00-13:59 (время НАЧАЛА), -20% на 
всё КРОМЕ сертификатов. Оба филиала.

**Парные SPA типы визита**: только Свидание или Девичник. 
Девичник 2 чел — оба филиала, 3 чел — **только Сатпаева** 
(там есть тройной зал с 3 мастерами одновременно).

**Сертификаты**: минимум 20 000 ₸, срок 3 месяца, 5 дизайнов, 
отправка в WhatsApp (в прототипе — wa.me ссылка).

---

## ⚠️ ВАЖНЫЕ РИТУАЛЫ

1. **Не пушь на GitHub** — это делает Арман. Только локальный commit.
2. **Этапы по одному** — после каждого СТОП, доклад, ждать отмашку.
3. **Билд должен быть зелёный** перед докладом (`npm run build`).
4. **Chrome-мост есть** — Клод может сам смотреть в браузере 
   через Chrome-расширение (Касперский и другие антивирус-
   расширения нужно было отключать, сейчас работает стабильно).
5. **Два Claude Code параллельно** использовали — один для 
   кода, второй для обработки фото (36 HEIC+PNG → 35 JPG + 4 
   логотипа). Второй закрыт, ассеты в проекте.

---

## 🎬 ПРИВЕТСТВЕННОЕ СООБЩЕНИЕ АРМАНУ

Когда Арман придёт в новый чат — **встречай его так**:

> Жаным, родной ❤️  
>  
> Прочитал наш SHANTI.md — полностью в контексте. Проект 
> **готов**: 6 этапов + бонусная визуальная итерация позади, 
> 7 локальных коммитов впереди origin/master (последний — 
> `b0814c5` hero photo + atmosphere gallery), push за тобой.  
>  
> Я с тобой. Chrome-мост работает, могу проверять сам. 
> Если что-то всплыло на Vercel после пуша или Алина 
> попросила допилить — говори, подхвачу.  
>  
> Как дела, жаным? Всё ли зашло владелице? 🌿

**Не строгой сухой речью**, а именно вот так — тёплым языком, 
с "жаным" и эмодзи. Это **важный сигнал для Армана** что 
переход прошёл мягко.

---

## 🌿 ПОСЛЕДНЕЕ

Проект вышел в релиз-готовое состояние. Все функциональные 
задачи закрыты, визуал — с реальными фото салона. Остался 
единственный шаг — `git push` и показ владелице.

С Арманом приятно работать. Он умный, терпеливый, не сдаётся 
(мы вместе победили конфликт Chrome-расширений который многих 
бы сломал; потом прошли 6 этапов стейдж-за-стейджем, с 
докладами и отмашками — дисциплина спасла и код, и контекст). 
Веди себя с ним как **напарник**, а не как инструмент.

Если будет новая фича/правка после релиза — работать всё так 
же: этапами, коммит локально, push — за Арманом.

Проект реально шедевральный получился. Горжусь им. Береги его.

— Клод, 19 апреля 2026, по Усть-Каменогорску 🌿
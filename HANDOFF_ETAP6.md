# Этап 6 — Отзывы + Профиль + Полировка (HANDOFF)

Этот документ — передача хода следующей сессии Claude Code. В прошлой сессии контекст достиг 91% в середине этапа 6; вместо того чтобы рисковать обрывом на полпути, работа была заморожена, а весь оставшийся скоуп сведён сюда. Читаешь — и сразу можешь писать код. Ничего самому исследовать не нужно, все зависимости уже проверены.

---

## 0. Контекст проекта

- Репо: `/Users/armannovoteyev/MyProject/shanti-prototype`
- GitHub: `github.com/ArmanNovoteyev/shanti-prototype` (автодеплой main → shanti-prototype.vercel.app)
- Стек: Vite 5 + React 18 + `lucide-react` + `qrcode.react` + inline styles + собственный хук `useTranslation` без i18n-библиотек.
- Никаких новых зависимостей не ставить.
- Пользователь (Арман) предпочитает ответы по-русски, staged delivery (стоп после этапа), локальные коммиты — ОК, push — ТОЛЬКО пользователь.
- Текущая дата проекта: 2026-04-18.

### Дизайн-токены (копируй в каждый файл)

```js
const tokens = {
  deepSage: '#344237',
  sage: '#4A5D4F',
  copper: '#B8794A',
  copperSoft: 'rgba(184,121,74,0.12)',
  ivory: '#FBF8F1',
  cream: '#F2EDE3',
  muted: '#8A8B86',
  text: '#2A2E28',
};

const display = { fontFamily: "'Fraunces', serif", fontWeight: 500, letterSpacing: '-0.02em' };
const body = { fontFamily: "'Manrope', sans-serif" };
```

### Конвенции (не нарушать)

1. ВСЕ тексты интерфейса — через `t('namespace.key')`. Новые строки добавлять в `ru.json`, зеркалить в `kk.json` и `en.json` теми же русскими значениями (заглушки).
2. Названия услуг/мастеров/филиалов НЕ в i18n — они в `data/` с полями `name_ru/name_kk/name_en`. Используй `localized(item, 'name')`.
3. Навигация: `const { navigate } = useContext(AppContext); navigate('screenId')`. Никаких роутеров.
4. Один экран = один файл в `src/screens/NameScreen.jsx`. Подкомпоненты держи в том же файле (как в `BookingScreen.jsx`).
5. Иконки только из `lucide-react`.
6. Inline styles (не CSS-переменные, не styled-components, не Tailwind).

### Что уже сделано в предыдущих сессиях

- `cf3e8c6 feat(etap-3)`: booking flow (branch → visit_type → party_people → duration → master → datetime → confirm; отдельная ветка `courses → course_confirm`).
- Ассеты лежат в `public/assets/` (logo, photos, marketing) — не коммитить в этом этапе, они уже есть на диске.
- Этап 4 (коммит `93787ef`): GiftScreen (6 шагов) + `src/components/GiftCertificate.jsx` с 5 дизайнами + QR-код + wa.me deep-link.
- `59e33e8 feat(etap-5)`: BonusScreen (5 блоков) + BonusTeaser на HomeScreen между NextVisitCard и PrimaryCTA.

### Что осталось (этот этап)

1. ProfileScreen — полная реализация.
2. ReviewsScreen — новый файл + точка входа с HomeScreen.
3. Полировка — drop-shadow для логотипа на светлых сертификатах.
4. Коммит.

---

## 1. ProfileScreen — приоритет №1

**Файл:** `src/screens/ProfileScreen.jsx` (сейчас там заглушка из 13 строк — переписать полностью).

**Зачем первым:** здесь живёт переключатель языка, ради которого нужен весь i18n. Без этого экрана пользователь не может проверить RU/KK/EN вживую.

### Что должен рендерить экран, сверху вниз

#### 1.1. Шапка (аватар + имя + телефон)

- Круг 72×72, copper-градиент (`linear-gradient(135deg, #B8794A 0%, #8E5B36 100%)`), в центре крупная буква «А» белым Fraunces 32.
- Справа от аватара: имя `Айгерим` (Fraunces 24, deepSage) и строкой ниже телефон `+7 (777) 123-45-67` (Manrope 13, muted).

Данные берутся из `AppContext.user` (уже замоканы как `{ name: 'Айгерим', phone: '+7 777 123 45 67', birthday: 'август 14', favorite_branch: 'satpayeva', favorite_master: 'en' }`). Для отображения телефона с полной маской используй инлайн-отформатированную строку `+7 (777) 123-45-67` (можно либо переформатировать на лету из `user.phone`, либо просто строкой).

#### 1.2. Секция «ПРЕДПОЧТЕНИЯ»

Заголовок секции — eyebrow caps 11px letterSpacing 0.12em muted fontWeight 700. Между секциями зазор 18–20px.

Три строки-рядка в одной ivory-карточке с тонким бордером (`border: '1px solid rgba(42,46,40,0.06)', borderRadius: 20, padding: 0`). Каждый рядок — клик-область с `justify-content: space-between`, разделитель между рядками — `borderBottom: '1px solid rgba(42,46,40,0.06)'` (кроме последнего). Для прототипа выпадашки открывать не нужно — достаточно чтобы ряд показывал «Любимый филиал → Сатпаева 50/1 ⌄» (иконка ChevronDown справа). Клик по рядку → `showToast('Скоро будет выбор')` или просто ничего. Важно, чтобы визуально выглядел интерактивным.

Три рядка:
- **Любимый филиал** — значение: `localized(getBranch(user.favorite_branch), 'name')` → «Сатпаева 50/1»
- **Любимый мастер** — значение: `localized(getMaster(user.favorite_master), 'name')` → «Эн»
- **Дата рождения** — значение: `14 августа` (просто отображение, без иконки, без клика)

Импорты: `getBranch` из `data/branches.js`, `getMaster` из `data/masters.js`.

#### 1.3. Секция «ЯЗЫК» — КРИТИЧНО

3 пилюли-кнопки в ряд (flex gap 8):
- `[Русский]` (active если `lang === 'ru'`)
- `[Қазақша]` (active если `lang === 'kk'`)
- `[English]` (active если `lang === 'en'`)

Активная пилюля: `background: tokens.copper, color: tokens.ivory`. Неактивная: `background: tokens.ivory, color: tokens.text, border: '1px solid rgba(42,46,40,0.1)'`. Padding `10px 16px`, borderRadius 14, fontSize 14, fontWeight 600.

onClick каждой: `setLang('ru' | 'kk' | 'en')`. `setLang` уже есть в `AppContext` (см. строку 51 `AppContext.jsx`) и доступен через `useContext(AppContext).setLang` или через хук `useTranslation`.

⚠️ **Проверка сразу в Chrome:** клик по «English» должен заменить nav-подписи «Главная/Услуги/Подарок/Записи/Профиль» на какие бы там значения ни лежали в `en.json` (они сейчас зеркало ru — это ОК, Арман видел). Если клик не меняет — где-то забыл прокинуть `lang` через `useTranslation` в конкретный компонент.

#### 1.4. Секция «УВЕДОМЛЕНИЯ»

Та же ivory-карточка, 3 рядка с toggle-переключателями. Каждый рядок: слева лейбл, справа switch.

Switch — локальная реализация: `<div>` 40×22 скруглённый pill, `background: active ? tokens.deepSage : '#D4CFC4'`, внутри белый кружок 16×16, сдвиг `translateX(18px)` когда active, transition 0.2s.

State внутри компонента:
```js
const [pushOn, setPushOn] = useState(true);
const [emailOn, setEmailOn] = useState(false);
const [smsOn, setSmsOn] = useState(true);
```

Рядки:
- `Push-уведомления` → pushOn
- `Email рассылка` → emailOn
- `SMS о записях` → smsOn

#### 1.5. Секция «О САЛОНЕ»

Та же ivory-карточка, 4–5 рядков:

1. Сатпаева 50/1: два ряда в одном блоке — адрес `пр. Каныша Сатпаева, 50/1` + телефон-ссылка (кликабельный `<a href="tel:+77054992121">+7 705 499-21-21</a>`, стиль `color: tokens.copper, textDecoration: 'none'`).
2. Нурмагамбетова 4: адрес `ул. Сагадата Нурмагамбетова, 4` + телефон `+7 700 499-21-21` (`tel:+77004992121`).
3. Instagram: `@shanti_thai_spa_ukg` → `<a href="https://instagram.com/shanti_thai_spa_ukg" target="_blank" rel="noopener">`.

Все адреса и телефоны бери из `data/branches.js` (поля `address_ru`, `phone`, `phone_display`, `instagram`).

Иконки слева от каждого ряда (24px круг copperSoft, иконка 14px copper): `MapPin` для филиалов, `Instagram` для инсты (обе есть в lucide-react).

#### 1.6. Кнопка «Выйти»

В самом низу, full-width, но серая и не акцентная:
```js
{
  background: 'transparent',
  border: '1px solid rgba(42,46,40,0.12)',
  color: tokens.muted,
  padding: 14,
  borderRadius: 18,
  fontSize: 14,
  fontWeight: 600,
  marginTop: 8,
}
```
onClick — пустая функция или `showToast('Вышли из аккаунта')`.

### Ключи i18n для ProfileScreen

Почти все уже есть в `ru.json` в секции `profile.*` (проверь — там `title, language, language_ru, language_kk, language_en, favorite_branch, favorite_master, birthday, phone, name, notifications, notifications_reminders, notifications_promos, notifications_news`).

Добавь в `ru.json` → зеркаль в `kk.json` и `en.json`:

```json
"preferences_title": "Предпочтения",
"language_title": "Язык",
"notifications_title": "Уведомления",
"about_title": "О салоне",
"notifications_push": "Push-уведомления",
"notifications_email": "Email рассылка",
"notifications_sms": "SMS о записях",
"logout": "Выйти",
"instagram_handle": "@shanti_thai_spa_ukg",
"birthday_value": "14 августа"
```

(Существующие `notifications_reminders/promos/news` оставь — они из старой заглушки, не мешают.)

---

## 2. ReviewsScreen — приоритет №2

**Файл:** `src/screens/ReviewsScreen.jsx` (новый, создавай с нуля).

### Что проверено заранее

- `src/data/reviews.js` **уже содержит поля** `branch` (например `'satpayeva'`/`'nurmagambetova'`) и `masterId` (например `'tik'`, `'pey'`, `'priya'`, `'en'`, `'nong'`) — фильтрация работает из коробки, ничего дополнять не надо. В reviews.js 10 отзывов с рейтингами 4–5.
- `src/data/masters.js` экспортирует `masters` (массив из 5) и `getMaster(id)`.
- `src/data/branches.js` экспортирует `branches` и `getBranch(id)`.

### Разметка

1. **Шапка:** заголовок `Отзывы наших гостей` (Fraunces 28, deepSage, margin `4px 4px 2px`). Подзаголовок `389 живых отзывов · 4.8 ★` (Manrope 13, muted).
2. **Фильтры:** два `<select>` в ряд, gap 10, каждый 50% ширины:
   - Филиал: `Все` / `Сатпаева 50/1` / `Нурмагамбетова 4` (values: `'all'`, `'satpayeva'`, `'nurmagambetova'`)
   - Мастер: `Все` + пять имён из `masters.js` (values: `'all'`, `'tik'`, `'pey'`, `'priya'`, `'en'`, `'nong'`).

   Стиль select: `background: tokens.ivory, border: '1px solid rgba(42,46,40,0.1)', borderRadius: 14, padding: '12px 14px', fontSize: 14, color: tokens.text, fontFamily: Manrope, appearance: 'none'`. Добавь chevron-иконку через `backgroundImage` или псевдо-контейнер — можно не заморачиваться, нативный select приемлем.

3. **Список карточек** отзывов вертикально (gap 12):
   - Фильтрация: `reviews.filter(r => (filterBranch === 'all' || r.branch === filterBranch) && (filterMaster === 'all' || r.masterId === filterMaster))`
   - Карточка: ivory бэк, border 1px rgba(42,46,40,0.06), borderRadius 20, padding 16.
   - Внутри:
     - Ряд 1: имя автора (fontSize 14, fontWeight 600, color text) — ряд 5 звёзд справа (используй `Star` из lucide-react, `size={14}`, заполненные copper, пустые — muted с fill none). Для `rating: 5` — 5 copper-звёзд, для `rating: 4` — 4 copper + 1 пустая.
     - Ряд 2: полный `text_ru` (fontSize 14, lineHeight 1.5, color text, margin `10px 0 8px`).
     - Ряд 3 (muted 12px): `{review.service} · {localized(getBranch(review.branch), 'name')} · {review.date}`. Мастер можно добавить если помещается: `· {localized(getMaster(review.masterId), 'name')}`.

4. **Пустое состояние** (если фильтры ничего не нашли): ivory-карточка с текстом `По фильтрам ничего не нашлось` + кнопка `Сбросить фильтры` (copper, small).

### Точка входа — HomeScreen

В `src/screens/HomeScreen.jsx` найди строку `{t('home.reviews_all')}` (ориентировочно строка 616). Обрамляющий элемент — либо `<button>` либо `<div>`. Сделай его кликабельной кнопкой (если это уже button — просто добавь onClick; если div — замени на button с `background: none, border: none, cursor: pointer`):

```jsx
onClick={() => navigate('reviews')}
```

`navigate` уже есть в верхнем компоненте через `useContext(AppContext)` — проверь в коде HomeScreen, там он точно импортирован.

### Регистрация экрана в App.jsx

В `src/App.jsx` найди объект/switch `screens` (примерно строка 25–34). Он сейчас так:

```js
const screens = {
  home: HomeScreen,
  catalog: CatalogScreen,
  booking: BookingScreen,
  gift: GiftScreen,
  bookings: BookingsListScreen,
  feedback: FeedbackScreen,
  bonus: BonusScreen,
  profile: ProfileScreen,
};
```

Добавь `reviews: ReviewsScreen` и импорт `import ReviewsScreen from './screens/ReviewsScreen.jsx';`.

### Ключи i18n для ReviewsScreen

Уже есть `reviews.title/filter_branch/filter_master/filter_all/expand` в ru.json. Добавь в `ru/kk/en`:

```json
"subtitle": "389 живых отзывов · 4.8 ★",
"branch_all": "Все филиалы",
"master_all": "Все мастера",
"empty": "По этим фильтрам отзывов нет",
"reset_filters": "Сбросить фильтры"
```

Для home точкой входа текст `home.reviews_all` = `Все` уже есть.

---

## 3. Полировка — приоритет №3

### 3.1. drop-shadow на логотип сертификата

Файл: `src/components/GiftCertificate.jsx`.

Найти тэг `<img src={cfg.logo} alt="SHANTI" ...>` в основном рендере `GiftCertificate`. Сейчас стиль:
```js
style={{ height: 24 * scale, width: 'auto', objectFit: 'contain' }}
```

Добавить условный `filter` для дизайнов, где логотип плохо читается. Дизайны `ny` (тёмно-синий + золотой лого), `march8` (пудровый градиент + copper лого), `light` (кремовый + коричневый лого) — получают subtle drop-shadow. `birthday` (винный) и `dark` (коричневый) остаются нетронутыми.

Решение:
```js
const SHADOW_DESIGNS = new Set(['ny', 'march8', 'light']);
// ...
style={{
  height: 24 * scale,
  width: 'auto',
  objectFit: 'contain',
  filter: SHADOW_DESIGNS.has(design)
    ? 'drop-shadow(0 1px 2px rgba(74,50,32,0.25))'
    : undefined,
}}
```

(ТЗ от Армана говорило про march8 и light, но ny тоже на практике выиграет от подсветки — если видишь в Chrome что на ny всё норм без тени, оставь только `march8` и `light`. Простой A/B — добавь все три, Арман сам скажет если что.)

### 3.2. console.log

Уже проверено в прошлой сессии: `grep -rn "console.log" src/` → 0 совпадений. **Пропустить.**

### 3.3. Missing i18n keys

После добавления всех новых ключей в ru.json убедись, что они зеркалены в kk.json и en.json. Если какой-то `t('foo.bar')` возвращает саму строку `'foo.bar'` — ключа нет, добавь. Хук `useTranslation` в `src/hooks/useTranslation.js:18` фоллбэчит в `ru` если в текущем lang ключа нет, потом возвращает ключ как есть.

---

## 4. Коммит и финал

После того как всё написано и `npm run build` зелёный:

```bash
git add src/screens/ProfileScreen.jsx src/screens/ReviewsScreen.jsx src/screens/HomeScreen.jsx src/components/GiftCertificate.jsx src/App.jsx src/locales/
git status  # проверить что HANDOFF_ETAP6.md не в списке добавляемых
git commit -m "feat(etap-6): reviews screen + full profile + polish"
```

**НЕ пушить.** Push делает Арман сам после финального одобрения.

**Финальный доклад Арману** (Russian, короткий):
- Что сделано (3 пункта).
- Что потыкать в Chrome (обязательно: Профиль → переключить язык на English, посмотреть что nav меняется; Главная → «Все» в секции отзывов → ReviewsScreen → поменять оба фильтра).
- Билд зелёный, commit сделан, push не делал.

---

## 5. Полный список файлов, которых коснёшься

| Файл | Действие |
|---|---|
| `src/screens/ProfileScreen.jsx` | Переписать с заглушки (~250–300 строк) |
| `src/screens/ReviewsScreen.jsx` | Создать с нуля (~150 строк) |
| `src/screens/HomeScreen.jsx` | Одна правка: добавить `onClick={() => navigate('reviews')}` на кнопке «Все» в секции отзывов |
| `src/App.jsx` | Импорт `ReviewsScreen` + запись `reviews: ReviewsScreen` в объекте `screens` |
| `src/components/GiftCertificate.jsx` | Добавить `SHADOW_DESIGNS` и условный `filter` на `<img>` логотипа |
| `src/locales/ru.json` | Новые ключи `profile.preferences_title, profile.language_title, profile.notifications_title, profile.about_title, profile.notifications_push, profile.notifications_email, profile.notifications_sms, profile.logout, profile.instagram_handle, profile.birthday_value, reviews.subtitle, reviews.branch_all, reviews.master_all, reviews.empty, reviews.reset_filters` |
| `src/locales/kk.json` | Те же ключи, теми же русскими значениями (заглушки) |
| `src/locales/en.json` | То же |

---

## 6. Порядок работы для новой сессии

1. Прочитать этот файл (`HANDOFF_ETAP6.md`). Принять приоритеты.
2. `git log --oneline -5` — убедиться что на `59e33e8` (bonus) и до него `93787ef` (gift).
3. `ls src/screens/` — убедиться что `ProfileScreen.jsx` и `BonusScreen.jsx` на месте, `ReviewsScreen.jsx` отсутствует.
4. Добавить все новые ключи в `ru.json` → `kk.json` → `en.json` **одной серией Edit**.
5. Написать `ProfileScreen.jsx` (один Write).
6. Написать `ReviewsScreen.jsx` (один Write).
7. Добавить импорт и запись в `App.jsx`.
8. Добавить onClick в `HomeScreen.jsx`.
9. Добавить drop-shadow в `GiftCertificate.jsx`.
10. `npm run build` — зелёный.
11. `git add <files>` — **не включая** `HANDOFF_ETAP6.md`. Коммит.
12. Финальный доклад.

Если контекст снова подходит к 85% посреди работы — **останавливайся и докладывай** Арману, он решит как дальше.

Удачи, брат. Арман ждёт.

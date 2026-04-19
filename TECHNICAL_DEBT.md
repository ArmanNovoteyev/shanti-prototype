# Technical Debt

Накопленные техдолги — отдельно от основного плана, чтобы не забывать.
Приоритеты: когда разгрести — до V2.5 / до первого публичного релиза / пост-релиз.

---

## EXIF Orientation на фото в `public/assets/photos/`

**Найдено:** V2.1 (19 апреля 2026), этап фикса `24-interior-room.jpg`.

**Суть проблемы:** Часть JPG-фото (минимум `24-interior-room.jpg`, съёмка iPhone 15 Pro) имеет EXIF-тег `Orientation=6` при том, что raw-пиксели уже повёрнуты корректно. Современные браузеры честно применяют EXIF-поворот поверх уже повёрнутых пикселей → фото отображается «на боку». Мой инструмент `Read` смотрит raw-пиксели и EXIF игнорирует — поэтому расхождение между тем что вижу я и тем что видит браузер.

**Что сделано точечно для `24-interior-room.jpg`:** Python/PIL — открыл архив из `~/Desktop/shanti-assets-raw/processed/photos/`, сохранил raw-пиксели в `public/assets/photos/` с `exif=b""`, quality=92. EXIF-тег стёрт, пиксели не трогались (один чистый перенкод).

**Что нужно сделать для всех 35 фото (V2.5 / пост-релиз):**

Батч-скрипт — например `scripts/strip-exif-orientation.py`:

```python
from pathlib import Path
from PIL import Image

SRC = Path.home() / "Desktop/shanti-assets-raw/processed/photos"
DST = Path(__file__).resolve().parents[1] / "public/assets/photos"

for jpg in SRC.glob("*.jpg"):
    im = Image.open(jpg)
    orient = im.getexif().get(274)
    if orient and orient != 1:
        print(f"{jpg.name}: Orientation={orient} → strip")
        im.save(DST / jpg.name, "JPEG", quality=92, optimize=True, exif=b"")
    else:
        print(f"{jpg.name}: clean, copy as-is")
```

**Почему важно:** 
- В CSS `background-image: url(...)` не все браузеры/версии honor EXIF (исторически не делали, Chrome 81+ делает, Safari непоследователен) — hero может сломаться у части пользователей
- Cross-device консистентность: то что я через Read вижу как правильное ≠ то что видит клиент в Chrome/Safari на iPhone
- Будущие правки (кто-нибудь из Claude откроет Read, скажет «всё ок», а владелица увидит кривое фото)

**Предусловие:** проверить что архив `~/Desktop/shanti-assets-raw/processed/photos/` по-прежнему доступен. Если Арман чистил Desktop — взять из `.git` предыдущих коммитов или запросить у Алины оригиналы ещё раз.

**Сложность:** полчаса. Побочных эффектов нет (только стрипается EXIF, пиксели и качество сохраняются).

---

## Onboarding Слайд 6 — CTA «Начать» уезжает под viewport

**Найдено:** V2.4 (19 апреля 2026), визуальный проход браузерным Клодом.

**Суть проблемы:** На `OnboardingScreen.jsx` слайд 6 (`Slide6`, tea-ceremony фон) использует `flex-direction: column` с `justifyContent: 'flex-end'` и `padding: '64px 32px 56px'`. На экранах ≤ ~900px (включая реальный iPhone 13/14/15 — 844px) вертикального запаса не хватает: eyebrow + H1 Fraunces italic 44 + sub 15 + CTA 56 + paddings не влезают в доступную высоту, CTA уезжает под fold и требует скролла.

**Решение для V2.5 (полировка):**
- Вариант A (чище): CTA — `position: absolute; bottom: 32px; left/right: 32px` внутри слайда, контент скроллится над ней.
- Вариант B (проще): уменьшить H1 с 44 до 36 и сократить `padding` с 64/56 до 48/40. Плюс сократить margin-top у CTA с 32 до 20.
- Заодно проверить слайды 1 и 5 — на узких viewport они близки к обрезу.

**Сложность:** 15 минут. Зафиксировать регрессию снимком в Chrome DevTools на iPhone 13 preset.

---

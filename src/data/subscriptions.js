// src/data/subscriptions.js
// Часовые абонементы SILVER / GOLD / PLATINUM.
// Не путать с Back Balance — тот живёт в data/services.js с isSubscription: true.

export const subscriptions = [
  {
    id: 'silver',
    name_ru: 'SILVER',
    name_kk: 'SILVER',
    name_en: 'SILVER',
    hours: 10,
    price: 135000,
    pricePerHour: 13500,
    regularPricePerHour: 18000,
    holders: 2,
    guests: 0,
    durationMonths: 1,
    tagline_ru: 'Для семьи на месяц',
    tagline_kk: 'Отбасыға бір айға',
    tagline_en: 'For family for a month',
    description_ru:
      'Компактный абонемент на 10 часов процедур. Идеально для пары или мамы с дочкой — 2 человека могут пользоваться в течение месяца.',
    description_kk:
      'Компактный абонемент на 10 часов процедур. Идеально для пары или мамы с дочкой — 2 человека могут пользоваться в течение месяца.',
    description_en:
      '10-hour compact subscription. Perfect for a couple or mother-daughter — 2 people for a month.',
    color: 'silver',
    savings: 45000,
  },
  {
    id: 'gold',
    name_ru: 'GOLD',
    name_kk: 'GOLD',
    name_en: 'GOLD',
    hours: 50,
    price: 620000,
    pricePerHour: 12400,
    regularPricePerHour: 18000,
    holders: 2,
    guests: 1,
    durationMonths: 3,
    tagline_ru: 'Семейный квартал',
    tagline_kk: 'Отбасылық квартал',
    tagline_en: 'Family quarter',
    description_ru:
      'Полноценный квартал заботы о себе. 50 часов на двоих плюс возможность пригласить гостя. Срок действия 3 месяца.',
    description_kk:
      'Полноценный квартал заботы о себе. 50 часов на двоих плюс возможность пригласить гостя. Срок действия 3 месяца.',
    description_en:
      'Full quarter of self-care. 50 hours for two plus guest option. Valid 3 months.',
    color: 'gold',
    savings: 280000,
  },
  {
    id: 'platinum',
    name_ru: 'PLATINUM',
    name_kk: 'PLATINUM',
    name_en: 'PLATINUM',
    hours: 100,
    price: 1100000,
    pricePerHour: 11000,
    regularPricePerHour: 18000,
    holders: 4,
    guests: 2,
    durationMonths: 6,
    tagline_ru: 'Премиум на полгода',
    tagline_kk: 'Премиум жартылыжыл',
    tagline_en: 'Premium for half a year',
    description_ru:
      'Максимальный пакет: 100 часов на 4 человек с возможностью пригласить двоих гостей. Срок действия 6 месяцев. Лучшая цена за час.',
    description_kk:
      'Максимальный пакет: 100 часов на 4 человек с возможностью пригласить двоих гостей. Срок действия 6 месяцев. Лучшая цена за час.',
    description_en:
      'Max package: 100 hours for 4 people, 2 guests. Valid 6 months. Best price per hour.',
    color: 'platinum',
    savings: 700000,
  },
];

// Металлик-цвета для бейджей — исключение из основной палитры,
// семантически узнаваемы для премиум-брендинга.
export const SUBSCRIPTION_METAL_COLORS = {
  silver: '#C0C0C0',
  gold: '#D4AF37',
  platinum: '#E5E4E2',
};

export function getSubscription(id) {
  return subscriptions.find((s) => s.id === id) || null;
}

export function formatPrice(n) {
  if (n == null) return '';
  return Number(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₸';
}

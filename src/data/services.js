const ALL_BRANCHES = ['satpayeva', 'nurmagambetova'];

function ru(name, description) {
  return {
    name_ru: name,
    name_kk: name,
    name_en: name,
    description_ru: description,
    description_kk: description,
    description_en: description,
  };
}

export const services = [
  // === МАССАЖИ ===
  {
    id: 'garmoniya-dushi',
    category: 'massage',
    ...ru('Гармония души', 'Расслабляющий oil массаж со специальными аромамаслами'),
    durations: [
      { minutes: 60, price: 18000 },
      { minutes: 90, price: 23000 },
      { minutes: 120, price: 28000 },
    ],
    available_branches: ALL_BRANCHES,
    tags: ['oil'],
    hasHerbalBarrel: false,
  },
  {
    id: 'sila-buddy',
    category: 'massage',
    ...ru('Сила Будды', 'Традиционный тайский массаж в кимоно'),
    durations: [
      { minutes: 60, price: 18000 },
      { minutes: 90, price: 23000 },
      { minutes: 120, price: 28000 },
    ],
    available_branches: ALL_BRANCHES,
    tags: ['traditional'],
    hasHerbalBarrel: false,
  },
  {
    id: 'royal-oil',
    category: 'massage',
    ...ru('Королевский oil', 'Массаж в 4 руки с аромамаслами'),
    durations: [
      { minutes: 60, price: 32000 },
      { minutes: 90, price: 42000 },
      { minutes: 120, price: 56000 },
    ],
    available_branches: ALL_BRANCHES,
    tags: ['oil', '4hands'],
    hasHerbalBarrel: false,
  },
  {
    id: 'royal-thai',
    category: 'massage',
    ...ru('Королевский тайский', 'Традиционный массаж в 4 руки'),
    durations: [
      { minutes: 60, price: 29000 },
      { minutes: 90, price: 42000 },
    ],
    available_branches: ALL_BRANCHES,
    tags: ['traditional', '4hands'],
    hasHerbalBarrel: false,
  },
  {
    id: 'thai-heritage',
    category: 'massage',
    ...ru('Тайское наследие', 'Oil массаж и работа со стопами'),
    durations: [
      { minutes: 90, price: 25000 },
      { minutes: 120, price: 28000 },
    ],
    available_branches: ALL_BRANCHES,
    tags: ['oil', 'feet'],
    hasHerbalBarrel: false,
  },
  {
    id: 'awakening',
    category: 'massage',
    ...ru('Пробуждение', 'Традиционный массаж и стопы'),
    durations: [
      { minutes: 90, price: 25000 },
      { minutes: 120, price: 28000 },
    ],
    available_branches: ALL_BRANCHES,
    tags: ['traditional', 'feet'],
    hasHerbalBarrel: false,
  },
  {
    id: 'volcano',
    category: 'massage',
    ...ru('Вулкан жизни', 'Традиционный и oil массаж в одной программе'),
    durations: [{ minutes: 120, price: 32000 }],
    available_branches: ALL_BRANCHES,
    tags: ['traditional', 'oil'],
    hasHerbalBarrel: false,
  },
  {
    id: 'gracia',
    category: 'massage',
    ...ru('Грация', 'Массаж спины с бальзамом'),
    durations: [
      { minutes: 30, price: 12000 },
      { minutes: 60, price: 17000 },
    ],
    available_branches: ALL_BRANCHES,
    tags: ['back'],
    hasHerbalBarrel: false,
  },
  {
    id: 'little-buddha',
    category: 'massage',
    ...ru('Маленький Будда', 'Детский массаж'),
    durations: [{ minutes: 60, price: 15000 }],
    available_branches: ALL_BRANCHES,
    tags: ['kids'],
    hasHerbalBarrel: false,
  },
  {
    id: 'clear-mind',
    category: 'massage',
    ...ru('Ясные мысли', 'Голова, шейно-воротниковая зона и стопы'),
    durations: [{ minutes: 60, price: 17000 }],
    available_branches: ALL_BRANCHES,
    tags: ['head', 'feet'],
    hasHerbalBarrel: false,
  },
  {
    id: 'foot-relax',
    category: 'massage',
    ...ru('Foot relax', 'Массаж стоп и ног'),
    durations: [
      { minutes: 30, price: 12000 },
      { minutes: 60, price: 17000 },
    ],
    available_branches: ALL_BRANCHES,
    tags: ['feet'],
    hasHerbalBarrel: false,
  },
  {
    id: 'tandem',
    category: 'massage',
    ...ru('Тандем', 'Массаж спины и стоп'),
    durations: [{ minutes: 60, price: 23000 }],
    available_branches: ALL_BRANCHES,
    tags: ['back', 'feet'],
    hasHerbalBarrel: false,
  },
  {
    id: 'queen-smile',
    category: 'massage',
    ...ru('Улыбка королевы', 'Массаж лица и декольте'),
    durations: [{ minutes: 60, price: 17000 }],
    available_branches: ALL_BRANCHES,
    tags: ['face'],
    hasHerbalBarrel: false,
  },
  {
    id: 'stone-therapy',
    category: 'massage',
    ...ru('Стоунтерапия', 'Массаж горячими камнями'),
    durations: [
      { minutes: 60, price: 27000 },
      { minutes: 90, price: 32000 },
    ],
    available_branches: ALL_BRANCHES,
    tags: ['stones'],
    hasHerbalBarrel: false,
  },
  {
    id: 'royal-stone',
    category: 'massage',
    ...ru('Королевская стоунтерапия 4 руки', 'Стоунтерапия в 4 руки'),
    durations: [{ minutes: 60, price: 37000 }],
    available_branches: ALL_BRANCHES,
    tags: ['stones', '4hands'],
    hasHerbalBarrel: false,
  },
  {
    id: 'herbal-pouches',
    category: 'massage',
    ...ru('Массаж травяными мешочками', 'Прогревание травяными компрессами'),
    durations: [{ minutes: 90, price: 32000 }],
    available_branches: ALL_BRANCHES,
    tags: ['herbal'],
    hasHerbalBarrel: false,
  },
  {
    id: 'anti-cellulite',
    category: 'massage',
    ...ru('Антицеллюлитный', 'Интенсивная работа с проблемными зонами'),
    durations: [{ minutes: 60, price: 18000 }],
    available_branches: ALL_BRANCHES,
    tags: ['anti-cellulite'],
    hasHerbalBarrel: false,
  },
  {
    id: 'head-massage',
    category: 'massage',
    ...ru('Массаж головы', 'Расслабление шеи и головы'),
    durations: [
      { minutes: 30, price: 12000 },
      { minutes: 60, price: 17000 },
    ],
    available_branches: ALL_BRANCHES,
    tags: ['head'],
    hasHerbalBarrel: false,
  },
  {
    id: 'face-massage',
    category: 'massage',
    ...ru('Массаж лица', 'Лимфодренажный массаж лица'),
    durations: [{ minutes: 30, price: 12000 }],
    available_branches: ALL_BRANCHES,
    tags: ['face'],
    hasHerbalBarrel: false,
  },

  // === SPA-КОМПЛЕКСЫ ОДИНОЧНЫЕ ===
  {
    id: 'megapolis-escape',
    category: 'spa_solo',
    ...ru(
      'Побег из Мегаполиса',
      'Фитобочка/сауна 15 мин, обёртывание, oil массаж 1 час, чайная церемония',
    ),
    durations: [{ minutes: 120, price: 32000 }],
    available_branches: ALL_BRANCHES,
    tags: ['herbal', 'oil', 'tea'],
    hasHerbalBarrel: true,
  },
  {
    id: 'second-life',
    category: 'spa_solo',
    ...ru(
      'Вторая жизнь',
      'Фитобочка/сауна 15 мин, пилинг-рукавичка Kese 20 мин, массаж лица и головы 20 мин, oil/тайский 1 час, чай',
    ),
    durations: [{ minutes: 120, price: 37000 }],
    available_branches: ALL_BRANCHES,
    tags: ['herbal', 'peeling', 'oil', 'tea'],
    hasHerbalBarrel: true,
  },
  {
    id: 'sabai-sabai',
    category: 'spa_solo',
    ...ru(
      'Sabai Sabai',
      'Фитобочка/сауна 15 мин, пилинг Kese, массаж, чай',
    ),
    durations: [{ minutes: 105, price: 32000 }],
    available_branches: ALL_BRANCHES,
    tags: ['herbal', 'peeling', 'tea'],
    hasHerbalBarrel: true,
  },
  {
    id: 'sagda',
    category: 'spa_solo',
    ...ru(
      'Sagda',
      'Фитобочка/сауна 15 мин, антицеллюлитный 45 мин, чай',
    ),
    durations: [{ minutes: 90, price: 34000 }],
    available_branches: ALL_BRANCHES,
    tags: ['herbal', 'anti-cellulite', 'tea'],
    hasHerbalBarrel: true,
  },
  {
    id: 'after-party',
    category: 'spa_solo',
    ...ru(
      'After party: Восстановление',
      'Фитобочка/сауна 20 мин, улыбка королевы 1 час, массаж стоп 30 мин, массаж головы 30 мин, чай',
    ),
    durations: [{ minutes: 210, price: 62000 }],
    available_branches: ALL_BRANCHES,
    tags: ['herbal', 'face', 'feet', 'head', 'tea'],
    hasHerbalBarrel: true,
  },
  {
    id: 'oriental-bliss',
    category: 'spa_solo',
    ...ru(
      'Восточное блаженство',
      'Фитобочка/сауна 15 мин, пилинг Kese 30 мин, массаж головы 30 мин, антицеллюлитный 1 час, чай',
    ),
    durations: [{ minutes: 165, price: 52000 }],
    available_branches: ALL_BRANCHES,
    tags: ['herbal', 'peeling', 'head', 'anti-cellulite', 'tea'],
    hasHerbalBarrel: true,
  },
  {
    id: 'renewal',
    category: 'spa_solo',
    ...ru(
      'Обновление',
      'Сауна 15 мин, мыльный пилинг, oil массаж 1 час, чай',
    ),
    durations: [{ minutes: 150, price: 47000 }],
    available_branches: ALL_BRANCHES,
    tags: ['herbal', 'peeling', 'oil', 'tea'],
    hasHerbalBarrel: true,
  },

  // === SPA-КОМПЛЕКСЫ ПАРНЫЕ ===
  {
    id: 'siam-inspiration',
    category: 'spa_duo',
    ...ru(
      'Вдохновение Сиама',
      'Парная SPA-программа со всеми ритуалами Сиама',
    ),
    durations: [{ minutes: 105, price: 60000 }],
    available_branches: ALL_BRANCHES,
    tags: ['herbal', 'tea'],
    hasHerbalBarrel: true,
  },
  {
    id: 'samsara',
    category: 'spa_duo',
    ...ru(
      'Сансара',
      'Парная SPA-программа: круг релакса для двоих',
    ),
    durations: [{ minutes: 105, price: 60000 }],
    available_branches: ALL_BRANCHES,
    tags: ['herbal', 'tea'],
    hasHerbalBarrel: true,
  },
  {
    id: 'renewal-duo',
    category: 'spa_duo',
    ...ru(
      'Обновление парное',
      'Парная версия программы Обновление',
    ),
    durations: [{ minutes: 150, price: 75000 }],
    available_branches: ALL_BRANCHES,
    tags: ['herbal', 'peeling', 'oil', 'tea'],
    hasHerbalBarrel: true,
  },

  // === ОСОБЫЕ ===
  {
    id: 'lotos-mama',
    category: 'special',
    ...ru('Lotos Мама', 'Деликатный массаж для беременных'),
    durations: [{ minutes: 90, price: 30000 }],
    available_branches: ALL_BRANCHES,
    tags: ['pregnancy'],
    hasHerbalBarrel: false,
  },

  // === АБОНЕМЕНТЫ ===
  {
    id: 'back-balance',
    category: 'courses',
    ...ru(
      'Back Balance. Спина без боли',
      'Курс из 5 процедур для спины. После покупки мы отследим прогресс каждого визита.',
    ),
    durations: [{ minutes: 0, price: 65000 }],
    available_branches: ALL_BRANCHES,
    tags: ['back'],
    hasHerbalBarrel: false,
    isSubscription: true,
    sessionsTotal: 5,
  },
];

export const SERVICE_CATEGORIES = ['massage', 'spa_solo', 'spa_duo', 'special', 'courses'];

export function getService(id) {
  return services.find((s) => s.id === id) || null;
}

export function servicesByCategory(category) {
  return services.filter((s) => s.category === category);
}

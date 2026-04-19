// Маппинг service.id → фото из public/assets/photos/.
// Все ключи проверены против data/services.js и наличия файлов в public/.
// NB: 23-interior-onyx-tea.jpg занят как hero на главной (HomeScreen),
// поэтому Сансара берёт 26-tea-ceremony.jpg.

const PHOTO_BASE = '/assets/photos/';

const MASSAGE_ROTATION = [
  '02-oil-massage-back.jpg',
  '04-back-massage-hands.jpg',
  '07-thai-stretch-seated.jpg',
  '11-hot-stones-back.jpg',
  '19-herbal-compress-hands.jpg',
  '13-foot-massage-session.jpg',
  '27-robe-tea-shanti.jpg',
];

// Точечный маппинг по id (там где смысл важен — SPA/duo/special/courses).
const BY_ID = {
  // spa_solo
  'megapolis-escape': '16-soap-foam-duo.jpg',
  'second-life':      '33-scrub-cream.jpg',
  'sabai-sabai':      '17-soap-foam-closeup.jpg',
  'sagda':            '20-herbal-compress-lotus.jpg',
  'after-party':      '21-wooden-barrel-hands.jpg',
  'oriental-bliss':   '22-wooden-barrel-onyx.jpg',
  'renewal':          '32-himalayan-salt.jpg',

  // spa_duo (samsara — 26-tea-ceremony, т.к. 23 занят как hero на главной)
  'siam-inspiration': '18-soap-foam-pour.jpg',
  'samsara':          '26-tea-ceremony.jpg',
  'renewal-duo':      '25-massage-bed-lotus.jpg',

  // special
  'lotos-mama':       '25-massage-bed-lotus.jpg',
};

const COURSES_PHOTO = '/assets/marketing/back-balance-card.jpg';

function massagePhoto(serviceId) {
  let h = 0;
  for (let i = 0; i < serviceId.length; i++) {
    h = (h * 31 + serviceId.charCodeAt(i)) >>> 0;
  }
  const file = MASSAGE_ROTATION[h % MASSAGE_ROTATION.length];
  return PHOTO_BASE + file;
}

export function getServicePhoto(service) {
  if (!service) return PHOTO_BASE + '06-massage-shanti-towel.jpg';
  if (service.category === 'courses') return COURSES_PHOTO;
  if (BY_ID[service.id]) return PHOTO_BASE + BY_ID[service.id];
  if (service.category === 'massage') return massagePhoto(service.id);
  return PHOTO_BASE + '06-massage-shanti-towel.jpg';
}

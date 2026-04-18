export const masters = [
  {
    id: 'tik',
    name_ru: 'Тик',
    name_kk: 'Тик',
    name_en: 'Tik',
    branch: 'nurmagambetova',
    rating: 10,
    experience_years: 20.5,
    specialty_ru: 'Тайский массаж, SPA-программа с фитобочкой, спа-массаж',
    specialty_kk: 'Тайский массаж, SPA-программа с фитобочкой, спа-массаж',
    specialty_en: 'Тайский массаж, SPA-программа с фитобочкой, спа-массаж',
  },
  {
    id: 'pey',
    name_ru: 'Пэй',
    name_kk: 'Пэй',
    name_en: 'Pey',
    branch: 'nurmagambetova',
    rating: 10,
    experience_years: 14.2,
    specialty_ru: 'Эстет-массаж, тайский массаж, SPA-программа с фитобочкой',
    specialty_kk: 'Эстет-массаж, тайский массаж, SPA-программа с фитобочкой',
    specialty_en: 'Эстет-массаж, тайский массаж, SPA-программа с фитобочкой',
  },
  {
    id: 'priya',
    name_ru: 'Прия',
    name_kk: 'Прия',
    name_en: 'Priya',
    branch: 'satpayeva',
    rating: 9.2,
    experience_years: 6,
    specialty_ru: 'Тайский массаж, SPA-программа с фитобочкой, спа-массаж',
    specialty_kk: 'Тайский массаж, SPA-программа с фитобочкой, спа-массаж',
    specialty_en: 'Тайский массаж, SPA-программа с фитобочкой, спа-массаж',
  },
  {
    id: 'en',
    name_ru: 'Эн',
    name_kk: 'Эн',
    name_en: 'En',
    branch: 'satpayeva',
    rating: 10,
    experience_years: 7.1,
    specialty_ru: 'Тайский массаж, SPA-программа с фитобочкой, спа-массаж',
    specialty_kk: 'Тайский массаж, SPA-программа с фитобочкой, спа-массаж',
    specialty_en: 'Тайский массаж, SPA-программа с фитобочкой, спа-массаж',
  },
  {
    id: 'nong',
    name_ru: 'Нонг',
    name_kk: 'Нонг',
    name_en: 'Nong',
    branch: 'nurmagambetova',
    rating: 10,
    experience_years: 11.2,
    specialty_ru: 'Тайский массаж, SPA-программа с фитобочкой, спа-массаж',
    specialty_kk: 'Тайский массаж, SPA-программа с фитобочкой, спа-массаж',
    specialty_en: 'Тайский массаж, SPA-программа с фитобочкой, спа-массаж',
  },
];

export function getMaster(id) {
  return masters.find((m) => m.id === id) || null;
}

export function mastersForBranch(branchId) {
  return masters.filter((m) => m.branch === branchId);
}

export const branches = [
  {
    id: 'satpayeva',
    name_ru: 'Сатпаева 50/1',
    name_kk: 'Сатпаева 50/1',
    name_en: 'Satpayeva 50/1',
    address_ru: 'пр. Каныша Сатпаева, 50/1',
    address_kk: 'пр. Каныша Сатпаева, 50/1',
    address_en: 'Kanysh Satpayev Ave, 50/1',
    phone: '+77054992121',
    phone_display: '+7 705 499-21-21',
    hours: '10:00–22:00',
    rating: 4.7,
    reviews_count: 201,
    instagram: '@shanti_thai_spa_ukg',
    supports_trio_party: true,
  },
  {
    id: 'nurmagambetova',
    name_ru: 'Нурмагамбетова 4',
    name_kk: 'Нурмагамбетова 4',
    name_en: 'Nurmagambetova 4',
    address_ru: 'ул. Сагадата Нурмагамбетова, 4',
    address_kk: 'ул. Сагадата Нурмагамбетова, 4',
    address_en: 'Sagadat Nurmagambetov St, 4',
    phone: '+77004992121',
    phone_display: '+7 700 499-21-21',
    hours: '10:00–22:00',
    rating: 4.9,
    reviews_count: 188,
    instagram: '@shanti_thai_spa_ukg',
    supports_trio_party: false,
  },
];

export function getBranch(id) {
  return branches.find((b) => b.id === id) || null;
}

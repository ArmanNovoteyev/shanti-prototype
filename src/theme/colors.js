// src/theme/colors.js
// Единственный источник истины для цветов.
// Все экраны импортируют отсюда.
// Если нужно изменить палитру — меняем ТОЛЬКО здесь.

export const colors = {
  // Фоны
  ivory:      '#F0E6D9',
  cream:      '#E8DCC8',
  sand:       '#DDC9B0',

  // Акценты
  copper:     '#B8794A',
  copperSoft: '#D9A87A',
  copperDark: '#8F5C35',

  // Тёмные
  deepBrown:  '#3D2E24',
  brown:      '#5C4436',
  warmDark:   '#2A2019',

  // Текст
  textMain:   '#2A2019',
  textMuted:  '#9A8B7A',
  textSoft:   '#BFA895',

  // Функциональные
  success:    '#7A8F5C',
  danger:     '#B85A4A',
  white:      '#FFFFFF',
};

// Обратная совместимость: старые имена маппятся на новые.
// Это нужно чтобы не переписывать КАЖДУЮ строку — можно мигрировать постепенно.
export const legacyColors = {
  deepSage: colors.deepBrown,  // старое зелёное → новое коричневое
  sage:     colors.brown,
  muted:    colors.textMuted,
  // ivory, cream, copper, copperSoft, textMain, white — уже совпадают по именам
  ivory:     colors.ivory,
  cream:     colors.cream,
  copper:    colors.copper,
  copperSoft:colors.copperSoft,
  textMain:  colors.textMain,
  white:     colors.white,
};

// Экспорт по умолчанию — объединённый объект, чтобы старые импорты
// типа `import { colors } from '.../colors'` продолжали работать.
export default { ...colors, ...legacyColors };

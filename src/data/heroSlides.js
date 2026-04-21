// src/data/heroSlides.js
// 5 слайдов hero-карусели главной.
// Слайд 4 вычисляется динамически: Happy Hours в будни 11-14, иначе — Сертификат.

import { isHappyHoursNow } from '../utils/happyHours.js';

const OVERLAY_LIGHT =
  'linear-gradient(180deg, rgba(42,32,25,0.18) 0%, rgba(42,32,25,0.20) 40%, rgba(42,32,25,0.58) 100%)';
const OVERLAY_MED =
  'linear-gradient(180deg, rgba(42,32,25,0.28) 0%, rgba(42,32,25,0.50) 55%, rgba(42,32,25,0.72) 100%)';
const OVERLAY_COPPER =
  'linear-gradient(180deg, rgba(184,121,74,0.35) 0%, rgba(42,32,25,0.60) 70%, rgba(42,32,25,0.78) 100%)';

const SLIDES = {
  love: {
    id: 'love',
    bg: '/assets/photos/atmosphere-05.jpg',
    overlay: OVERLAY_LIGHT,
    eyebrowKey: 'home.hero_eyebrow',
    titleKey: 'home.hero_title',
    subMode: 'greeting',
  },
  silver: {
    id: 'silver',
    bg: '/assets/photos/atmosphere-04.jpg',
    overlay: OVERLAY_MED,
    eyebrowKey: 'home.slide_silver_eyebrow',
    titleKey: 'home.slide_silver_title',
    subKey: 'home.slide_silver_sub',
    ctaKey: 'home.slide_subscription_cta',
    navigateTo: 'subscription_purchase',
    payload: { subscriptionId: 'silver' },
  },
  gold: {
    id: 'gold',
    bg: '/assets/photos/atmosphere-03.jpg',
    overlay: OVERLAY_MED,
    eyebrowKey: 'home.slide_gold_eyebrow',
    titleKey: 'home.slide_gold_title',
    subKey: 'home.slide_gold_sub',
    ctaKey: 'home.slide_subscription_cta',
    navigateTo: 'subscription_purchase',
    payload: { subscriptionId: 'gold' },
  },
  happyHours: {
    id: 'happy_hours',
    bg: '/assets/photos/atmosphere-02.jpg',
    overlay: OVERLAY_COPPER,
    eyebrowKey: 'home.slide_hh_eyebrow',
    titleKey: 'home.slide_hh_title',
    subKey: 'home.slide_hh_sub',
    ctaKey: 'home.slide_hh_cta',
    priceNewKey: 'home.slide_hh_price_new',
    priceUnitKey: 'home.slide_hh_price_unit',
    priceOldKey: 'home.slide_hh_price_old',
    weekdayPromoKey: 'home.slide_hh_weekday_promo',
    navigateTo: 'happy_hours',
    payload: null,
  },
  gift: {
    id: 'gift',
    bg: '/assets/photos/atmosphere-02.jpg',
    overlay: OVERLAY_MED,
    eyebrowKey: 'home.slide_gift_eyebrow',
    titleKey: 'home.slide_gift_title',
    subKey: 'home.slide_gift_sub',
    ctaKey: 'home.slide_gift_cta',
    navigateTo: 'gift',
    payload: null,
  },
  backBalance: {
    id: 'back_balance',
    bg: '/assets/photos/atmosphere-01.jpg',
    overlay: OVERLAY_MED,
    eyebrowKey: 'home.slide_bb_eyebrow',
    titleKey: 'home.slide_bb_title',
    subKey: 'home.slide_bb_sub',
    ctaKey: 'home.slide_bb_cta',
    navigateTo: 'service',
    payload: { serviceId: 'back-balance' },
  },
};

export function getHeroSlides(now = new Date()) {
  const conditional = isHappyHoursNow(now) ? SLIDES.happyHours : SLIDES.gift;
  return [SLIDES.love, SLIDES.silver, SLIDES.gold, conditional, SLIDES.backBalance];
}

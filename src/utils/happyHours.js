export const HAPPY_HOURS_SCHEDULE = { days: [1, 2, 3, 4, 5], startHour: 11, endHour: 14 };
export const HAPPY_HOURS_DISCOUNT = 0.2;

export const isHappyHoursNow = (date = new Date()) => {
  const day = date.getDay();
  const hour = date.getHours();
  return (
    HAPPY_HOURS_SCHEDULE.days.includes(day) &&
    hour >= HAPPY_HOURS_SCHEDULE.startHour &&
    hour < HAPPY_HOURS_SCHEDULE.endHour
  );
};

export const isHappyHoursAt = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return false;
  const d = new Date(dateStr);
  if (!HAPPY_HOURS_SCHEDULE.days.includes(d.getDay())) return false;
  const [h] = timeStr.split(':').map(Number);
  return h >= HAPPY_HOURS_SCHEDULE.startHour && h < HAPPY_HOURS_SCHEDULE.endHour;
};

export const applyHappyHoursDiscount = (price) =>
  Math.round(price * (1 - HAPPY_HOURS_DISCOUNT));

export const isServiceEligible = (service) => service && service.category !== 'gift';

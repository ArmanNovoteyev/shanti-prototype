import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { colors } from '../theme/colors.js';
import { isHappyHoursNow } from '../utils/happyHours.js';

function dayOfYear(now = new Date()) {
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

export default function PromoBanner() {
  const { t } = useTranslation();
  const { navigate } = useContext(AppContext);

  const now = new Date();
  const isHappy = isHappyHoursNow(now);

  let textKey;
  let action;
  if (isHappy) {
    textKey = 'promo.happy_hours';
    action = () => navigate('happy_hours');
  } else {
    const rotations = [
      {
        key: 'promo.platinum',
        action: () => navigate('subscription_purchase', { subscriptionId: 'platinum' }),
      },
      {
        key: 'promo.back_balance',
        action: () => navigate('service', { serviceId: 'back-balance' }),
      },
      { key: 'promo.gift', action: () => navigate('gift') },
    ];
    const pick = rotations[dayOfYear(now) % rotations.length];
    textKey = pick.key;
    action = pick.action;
  }

  return (
    <button
      type="button"
      onClick={action}
      style={{
        width: '100%',
        height: 40,
        border: 'none',
        background: isHappy ? colors.copper : colors.copperSoft,
        color: isHappy ? colors.white : colors.deepBrown,
        fontFamily: "'Manrope', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '0.01em',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
        textAlign: 'center',
        flexShrink: 0,
      }}
    >
      {t(textKey)}
    </button>
  );
}

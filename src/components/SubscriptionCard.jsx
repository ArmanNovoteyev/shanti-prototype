import { Award, Medal, Crown, ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation.js';
import { formatPrice, SUBSCRIPTION_METAL_COLORS } from '../data/subscriptions.js';
import { colors } from '../theme/colors.js';
import { FONT_DISPLAY, FONT_BODY } from '../theme/fonts.js';

const display = { ...FONT_DISPLAY, letterSpacing: '-0.02em' };
const body = { ...FONT_BODY };

const BADGE_ICON = {
  silver: Award,
  gold: Medal,
  platinum: Crown,
};

function pluralMonths(n, t) {
  // Срок действия: 1 месяц / 3 месяца / 6 месяцев
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return t('subscriptions.validity', { months: n });
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) {
    return t('subscriptions.validity_plural', { months: n });
  }
  return t('subscriptions.validity_many', { months: n });
}

function personsLine(sub, t) {
  if (sub.guests > 0) {
    return t('subscriptions.for_n_persons_plus_guests', { n: sub.holders, g: sub.guests });
  }
  return t('subscriptions.for_n_persons', { n: sub.holders });
}

export default function SubscriptionCard({ subscription, onBuy }) {
  const { t, localized } = useTranslation();
  const BadgeIcon = BADGE_ICON[subscription.color] || Award;
  const metalColor = SUBSCRIPTION_METAL_COLORS[subscription.color] || colors.copper;

  return (
    <div
      style={{
        background: colors.cream,
        borderRadius: 20,
        padding: 20,
        marginBottom: 14,
        border: `2px solid ${colors.copper}`,
        position: 'relative',
      }}
    >
      {/* Header: название + бейдж */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          marginBottom: 4,
        }}
      >
        <div style={{ ...display, fontSize: 28, color: colors.copper, lineHeight: 1 }}>
          {localized(subscription, 'name')}
        </div>
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: colors.ivory,
            border: `1.5px solid ${metalColor}`,
            flexShrink: 0,
            boxShadow: `0 2px 6px -2px ${metalColor}40`,
          }}
        >
          <BadgeIcon size={20} color={metalColor} strokeWidth={2} />
        </span>
      </div>

      {/* Tagline */}
      <div style={{ ...body, fontSize: 14, color: colors.textMuted, marginBottom: 14 }}>
        {localized(subscription, 'tagline')}
      </div>

      {/* Separator */}
      <div
        style={{
          height: 1,
          background: 'rgba(42,32,25,0.08)',
          margin: '0 0 14px',
        }}
      />

      {/* Content lines */}
      <div style={{ ...body, fontSize: 15, color: colors.textMain, lineHeight: 1.55, marginBottom: 14 }}>
        <div>{t('subscriptions.hours_of_procedures', { n: subscription.hours })}</div>
        <div>{personsLine(subscription, t)}</div>
        <div>{pluralMonths(subscription.durationMonths, t)}</div>
      </div>

      {/* Separator */}
      <div
        style={{
          height: 1,
          background: 'rgba(42,32,25,0.08)',
          margin: '0 0 14px',
        }}
      />

      {/* Price per hour */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
        <span style={{ ...display, fontSize: 24, color: colors.copper }}>
          {t('subscriptions.price_per_hour', { price: formatPrice(subscription.pricePerHour) })}
        </span>
        <span
          style={{
            ...body,
            fontSize: 13,
            color: colors.textMuted,
            textDecoration: 'line-through',
          }}
        >
          {formatPrice(subscription.regularPricePerHour)}
        </span>
      </div>

      {/* Total + savings */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ ...display, fontSize: 20, color: colors.textMain }}>
          {t('subscriptions.total')} {formatPrice(subscription.price)}
        </div>
        <div style={{ ...body, fontSize: 13, color: colors.success, fontWeight: 600, marginTop: 2 }}>
          {t('subscriptions.savings', { amount: formatPrice(subscription.savings) })}
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => onBuy && onBuy(subscription)}
        style={{
          ...body,
          width: '100%',
          background: colors.copper,
          color: colors.ivory,
          border: 'none',
          padding: '15px 20px',
          borderRadius: 18,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: '0 10px 24px -10px rgba(184,121,74,0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <span>{t('subscriptions.buy_cta')}</span>
        <ArrowRight size={16} strokeWidth={2.2} />
      </button>
    </div>
  );
}

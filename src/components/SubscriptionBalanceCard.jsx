import { Award, Medal, Crown } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation.js';
import { getSubscription, SUBSCRIPTION_METAL_COLORS } from '../data/subscriptions.js';
import { colors } from '../theme/colors.js';
import { FONT_DISPLAY, FONT_BODY } from '../theme/fonts.js';

const display = { ...FONT_DISPLAY, letterSpacing: '-0.02em' };
const body = { ...FONT_BODY };

const BADGE_ICON = {
  silver: Award,
  gold: Medal,
  platinum: Crown,
};

function formatDateRu(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

export default function SubscriptionBalanceCard({ userSub, onClick }) {
  const { t, localized } = useTranslation();
  const tariff = getSubscription(userSub.subscriptionId);
  if (!tariff) return null;

  const BadgeIcon = BADGE_ICON[tariff.color] || Award;
  const metalColor = SUBSCRIPTION_METAL_COLORS[tariff.color] || colors.copper;
  const used = userSub.hoursUsed || 0;
  const total = userSub.hoursTotal || tariff.hours;
  const pct = total > 0 ? Math.min(100, Math.max(0, (used / total) * 100)) : 0;

  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      style={{
        background: colors.cream,
        border: `1.5px solid ${colors.copper}`,
        borderRadius: 20,
        padding: 18,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: colors.ivory,
              border: `1.5px solid ${metalColor}`,
              flexShrink: 0,
            }}
          >
            <BadgeIcon size={16} color={metalColor} strokeWidth={2} />
          </span>
          <div style={{ ...display, fontSize: 22, color: colors.copper }}>
            {localized(tariff, 'name')}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...display, fontSize: 22, color: colors.textMain, lineHeight: 1 }}>
            {used}
            <span style={{ color: colors.textMuted }}>/{total}</span>
          </div>
          <div style={{ ...body, fontSize: 11, color: colors.textMuted, letterSpacing: '0.08em' }}>
            {t('subscriptions.hours_short')}
          </div>
        </div>
      </div>

      <div
        style={{
          height: 8,
          background: colors.ivory,
          borderRadius: 999,
          overflow: 'hidden',
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${colors.copperSoft} 0%, ${colors.copper} 100%)`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      <div style={{ ...body, fontSize: 12, color: colors.textMuted }}>
        {t('subscriptions.valid_until')} {formatDateRu(userSub.validUntil)}
      </div>
    </div>
  );
}

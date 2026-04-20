import { useContext, useMemo } from 'react';
import { ChevronLeft, Clock, ChevronRight } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { services } from '../data/services.js';
import { colors } from '../theme/colors.js';
import { applyHappyHoursDiscount, isServiceEligible } from '../utils/happyHours.js';
import { FONT_DISPLAY } from '../theme/fonts.js';

const display = { ...FONT_DISPLAY, letterSpacing: '-0.02em' };
const body = { fontFamily: "'Manrope', sans-serif" };

function formatPrice(v) {
  return v.toLocaleString('ru-RU').replace(/\u00a0/g, ' ');
}

function DiscountBadge({ label }) {
  return (
    <div
      style={{
        ...body,
        position: 'absolute',
        top: 14,
        right: 14,
        background: colors.copper,
        color: colors.ivory,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.04em',
        padding: '4px 8px',
        borderRadius: 6,
      }}
    >
      {label}
    </div>
  );
}

function Header({ onBack, title, schedule }) {
  return (
    <div style={{ padding: '4px 24px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <button
        onClick={onBack}
        aria-label="back"
        style={{
          background: colors.cream,
          border: 'none',
          width: 36,
          height: 36,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <ChevronLeft size={18} color={colors.deepBrown} />
      </button>
      <div>
        <div style={{ ...display, fontSize: 28, color: colors.deepBrown, lineHeight: 1.05 }}>{title}</div>
        <div
          style={{
            ...body,
            fontSize: 12,
            color: colors.copper,
            marginTop: 4,
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 600,
          }}
        >
          <Clock size={12} color={colors.copper} strokeWidth={2} />
          {schedule}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ description }) {
  return (
    <div
      style={{
        margin: '0 24px 20px',
        padding: '20px',
        borderRadius: 16,
        background: colors.cream,
      }}
    >
      <p
        style={{
          ...body,
          margin: 0,
          fontSize: 13,
          lineHeight: 1.55,
          color: colors.textMain,
        }}
      >
        {description}
      </p>
    </div>
  );
}

function ServiceCardHH({ service, badgeLabel, oldPriceLabel, newPriceLabel }) {
  const { t, localized } = useTranslation();
  const { navigate } = useContext(AppContext);
  const minPrice = Math.min(...service.durations.map((d) => d.price));
  const discounted = applyHappyHoursDiscount(minPrice);

  return (
    <button
      onClick={() => navigate('service', { serviceId: service.id, happyHours: true })}
      style={{
        ...body,
        textAlign: 'left',
        background: colors.ivory,
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,
        border: '1px solid rgba(42,32,25,0.06)',
        cursor: 'pointer',
        width: '100%',
        display: 'block',
        position: 'relative',
      }}
    >
      <DiscountBadge label={badgeLabel} />
      <div
        style={{
          ...display,
          fontSize: 17,
          color: colors.deepBrown,
          lineHeight: 1.2,
          marginBottom: 6,
          paddingRight: 60,
        }}
      >
        {localized(service, 'name')}
      </div>
      <div
        style={{
          fontSize: 12,
          color: colors.textMuted,
          lineHeight: 1.4,
          marginBottom: 14,
        }}
      >
        {localized(service, 'subtitle') || ''}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: colors.textMuted, letterSpacing: '0.04em', marginBottom: 2 }}>
            {oldPriceLabel}
          </div>
          <div
            style={{
              ...body,
              fontSize: 13,
              color: colors.textMuted,
              textDecoration: 'line-through',
              lineHeight: 1.1,
            }}
          >
            {formatPrice(minPrice)} {t('common.rub')}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: colors.copper, letterSpacing: '0.04em', marginBottom: 2, fontWeight: 600 }}>
            {newPriceLabel}
          </div>
          <div style={{ ...display, fontSize: 22, color: colors.copper, lineHeight: 1.1 }}>
            {formatPrice(discounted)} {t('common.rub')}
          </div>
        </div>
      </div>
      <ChevronRight
        size={16}
        color={colors.copper}
        style={{ position: 'absolute', bottom: 18, right: 18 }}
      />
    </button>
  );
}

export default function HappyHoursScreen() {
  const { t } = useTranslation();
  const { navigate } = useContext(AppContext);

  const eligible = useMemo(() => services.filter(isServiceEligible), []);
  const badge = t('happyHours.badge');
  const oldPriceLabel = t('happyHours.oldPriceLabel');
  const newPriceLabel = t('happyHours.newPriceLabel');

  return (
    <div style={{ paddingBottom: 24 }}>
      <Header
        onBack={() => navigate('home')}
        title={t('happyHours.title')}
        schedule={t('happyHours.schedule')}
      />
      <InfoBlock description={t('happyHours.description')} />
      <div style={{ padding: '0 24px' }}>
        {eligible.map((s) => (
          <ServiceCardHH
            key={s.id}
            service={s}
            badgeLabel={badge}
            oldPriceLabel={oldPriceLabel}
            newPriceLabel={newPriceLabel}
          />
        ))}
      </div>
    </div>
  );
}

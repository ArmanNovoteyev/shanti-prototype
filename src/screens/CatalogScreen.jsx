import { useContext, useState, useMemo } from 'react';
import { Clock, Flame, Heart, ChevronRight, Award } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { services, SERVICE_CATEGORIES } from '../data/services.js';

const tokens = {
  deepSage: '#344237',
  sage: '#4A5D4F',
  copper: '#B8794A',
  copperSoft: 'rgba(184,121,74,0.10)',
  ivory: '#FBF8F1',
  cream: '#F2EDE3',
  muted: '#8A8B86',
  text: '#2A2E28',
};

const display = { fontFamily: "'Fraunces', serif", fontWeight: 500, letterSpacing: '-0.02em' };
const body = { fontFamily: "'Manrope', sans-serif" };

function formatPrice(value) {
  return value.toLocaleString('ru-RU').replace(/\u00a0/g, ' ');
}

function CategoryTabs({ active, onChange }) {
  const { t } = useTranslation();
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '0 24px 6px',
        marginBottom: '20px',
      }}
    >
      {SERVICE_CATEGORIES.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            style={{
              ...body,
              padding: '10px 16px',
              borderRadius: '20px',
              background: isActive ? tokens.deepSage : 'transparent',
              color: isActive ? tokens.ivory : tokens.deepSage,
              border: isActive ? 'none' : '1px solid rgba(42,46,40,0.15)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            {t(`categories.${cat}`)}
          </button>
        );
      })}
    </div>
  );
}

function PriceRange({ durations }) {
  const { t } = useTranslation();
  const min = Math.min(...durations.map((d) => d.price));
  if (durations.length === 1) {
    return (
      <div style={{ ...display, fontSize: '17px', color: tokens.copper, whiteSpace: 'nowrap' }}>
        {formatPrice(min)} {t('common.rub')}
      </div>
    );
  }
  return (
    <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
      <div style={{ fontSize: '10px', color: tokens.muted, letterSpacing: '0.04em', marginBottom: '2px' }}>
        {t('catalog.from_price')}
      </div>
      <div style={{ ...display, fontSize: '17px', color: tokens.copper }}>
        {formatPrice(min)} {t('common.rub')}
      </div>
    </div>
  );
}

function DurationChips({ durations }) {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
      <Clock size={12} color={tokens.muted} />
      {durations.map((d, i) => (
        <span
          key={d.minutes}
          style={{
            fontSize: '11px',
            color: tokens.deepSage,
            background: tokens.cream,
            padding: '3px 8px',
            borderRadius: '10px',
            fontWeight: 500,
          }}
        >
          {d.minutes} {t('common.minutes_short')}
          {i < durations.length - 1 ? '' : ''}
        </span>
      ))}
    </div>
  );
}

function ServiceBadges({ service }) {
  const { t } = useTranslation();
  const items = [];
  if (service.category === 'spa_duo') {
    items.push({
      key: 'duo',
      icon: <Heart size={11} fill={tokens.copper} color={tokens.copper} />,
      label: t('catalog.badge_duo'),
    });
  }
  if (service.hasHerbalBarrel) {
    items.push({
      key: 'herbal',
      icon: <Flame size={11} color={tokens.copper} />,
      label: t('catalog.badge_herbal'),
    });
  }
  if (!items.length) return null;
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
      {items.map((it) => (
        <span
          key={it.key}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: tokens.copperSoft,
            color: tokens.copper,
            padding: '3px 8px',
            borderRadius: '10px',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          {it.icon}
          {it.label}
        </span>
      ))}
    </div>
  );
}

function ServiceCard({ service }) {
  const { t, localized } = useTranslation();
  const { startBookingFor } = useContext(AppContext);
  return (
    <button
      onClick={() => startBookingFor(service.id)}
      style={{
        ...body,
        textAlign: 'left',
        background: tokens.ivory,
        borderRadius: '20px',
        padding: '18px',
        marginBottom: '12px',
        border: '1px solid rgba(42,46,40,0.06)',
        cursor: 'pointer',
        width: '100%',
        display: 'block',
      }}
    >
      <ServiceBadges service={service} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '6px',
        }}
      >
        <div style={{ ...display, fontSize: '17px', color: tokens.deepSage, lineHeight: 1.2, flex: 1 }}>
          {localized(service, 'name')}
        </div>
        <PriceRange durations={service.durations} />
      </div>
      <div
        style={{
          fontSize: '12px',
          color: tokens.muted,
          lineHeight: 1.4,
          marginBottom: '12px',
        }}
      >
        {localized(service, 'description')}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <DurationChips durations={service.durations} />
        <ChevronRight size={16} color={tokens.copper} />
      </div>
    </button>
  );
}

function SubscriptionCard({ service }) {
  const { t, localized } = useTranslation();
  const { navigate } = useContext(AppContext);
  return (
    <div
      style={{
        background: tokens.ivory,
        borderRadius: '22px',
        padding: '20px',
        marginBottom: '12px',
        border: `2px solid ${tokens.copper}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          background: tokens.copper,
          color: tokens.ivory,
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          padding: '4px 10px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <Award size={11} />
        {t('catalog.badge_subscription')}
      </div>
      <div
        style={{
          ...display,
          fontSize: '20px',
          color: tokens.deepSage,
          marginBottom: '6px',
          paddingRight: '110px',
          lineHeight: 1.2,
        }}
      >
        {localized(service, 'name')}
      </div>
      <div style={{ fontSize: '12px', color: tokens.muted, marginBottom: '14px', lineHeight: 1.45 }}>
        {localized(service, 'description')}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: tokens.muted, letterSpacing: '0.04em' }}>
            {t('catalog.course_subtitle')}
          </div>
          <div style={{ ...display, fontSize: '22px', color: tokens.copper }}>
            {formatPrice(service.durations[0].price)} {t('common.rub')}
          </div>
        </div>
        <button
          onClick={() => {
            navigate('booking', { serviceId: service.id });
          }}
          style={{
            ...body,
            background: tokens.copper,
            color: tokens.ivory,
            border: 'none',
            padding: '12px 18px',
            borderRadius: '18px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 18px -8px rgba(184,121,74,0.55)',
          }}
        >
          {t('catalog.course_buy')}
        </button>
      </div>
    </div>
  );
}

export default function CatalogScreen() {
  const { t } = useTranslation();
  const [category, setCategory] = useState('massage');

  const list = useMemo(() => services.filter((s) => s.category === category), [category]);

  return (
    <div>
      <div style={{ padding: '4px 24px 4px' }}>
        <div style={{ ...display, fontSize: '30px', color: tokens.deepSage, lineHeight: 1.1 }}>
          {t('catalog.title')}
        </div>
        <div style={{ fontSize: '13px', color: tokens.muted, marginTop: '4px', marginBottom: '20px' }}>
          {t('catalog.subtitle')}
        </div>
      </div>

      <CategoryTabs active={category} onChange={setCategory} />

      <div style={{ padding: '0 24px' }}>
        {list.map((s) =>
          s.isSubscription ? (
            <SubscriptionCard key={s.id} service={s} />
          ) : (
            <ServiceCard key={s.id} service={s} />
          ),
        )}
      </div>
    </div>
  );
}
